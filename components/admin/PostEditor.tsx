"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { generateSlug, extractExcerpt } from "@/lib/utils";
import type { Post } from "@/types/database";
import {
  Save, Eye, EyeOff, Upload, X, Tag, Loader2,
  ImagePlus, Bold, Italic, Heading2, List, Link2, Code, Quote, AlertCircle
} from "lucide-react";

interface PostEditorProps {
  post?: Post; // undefined = create mode
}

export default function PostEditor({ post }: PostEditorProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isEditing = !!post;

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [coverImage, setCoverImage] = useState(post?.cover_image ?? "");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(post?.tags ?? []);
  const [published, setPublished] = useState(post?.published ?? false);

  const [slugManuallyEdited, setSlugManuallyEdited] = useState(isEditing);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(false);

  // ─── Slug auto-generation ───────────────────────────────────────────
  function handleTitleChange(val: string) {
    setTitle(val);
    if (!slugManuallyEdited) {
      setSlug(generateSlug(val));
    }
  }

  // ─── Tag handling ────────────────────────────────────────────────────
  function addTag(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const trimmed = tagInput.trim().toLowerCase().replace(/,/g, "");
      if (trimmed && !tags.includes(trimmed)) {
        setTags([...tags, trimmed]);
      }
      setTagInput("");
    }
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  // ─── Cover image upload ──────────────────────────────────────────────
  async function handleCoverUpload(file: File) {
    if (!file) return;
    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("bucket", "blog-images");
    formData.append("folder", "covers");

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Upload failed");
    } else {
      setCoverImage(data.url);
    }
    setUploading(false);
  }

  // ─── Inline content image upload ────────────────────────────────────
  async function handleContentImageUpload(file: File) {
    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("bucket", "blog-images");
    formData.append("folder", "content");

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Upload failed");
    } else {
      insertMarkdown(`![Image description](${data.url})`);
    }
    setUploading(false);
  }

  // ─── Markdown toolbar helpers ────────────────────────────────────────
  function insertMarkdown(syntax: string, wrap = false) {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.slice(start, end);

    let inserted: string;
    if (wrap && selected) {
      inserted = `${syntax}${selected}${syntax}`;
    } else if (wrap) {
      inserted = `${syntax}text${syntax}`;
    } else {
      inserted = syntax;
    }

    const newContent = content.slice(0, start) + inserted + content.slice(end);
    setContent(newContent);

    // Restore focus + cursor
    setTimeout(() => {
      textarea.focus();
      const newPos = start + inserted.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  }

  const toolbarActions = [
    { icon: Heading2, label: "Heading", action: () => insertMarkdown("## ") },
    { icon: Bold, label: "Bold", action: () => insertMarkdown("**", true) },
    { icon: Italic, label: "Italic", action: () => insertMarkdown("_", true) },
    { icon: List, label: "List", action: () => insertMarkdown("\n- ") },
    { icon: Link2, label: "Link", action: () => insertMarkdown("[text](url)") },
    { icon: Code, label: "Code", action: () => insertMarkdown("`", true) },
    { icon: Quote, label: "Quote", action: () => insertMarkdown("\n> ") },
  ];

  // ─── Save handler ─────────────────────────────────────────────────────
  async function handleSave(publishOverride?: boolean) {
    setError("");
    setSaving(true);

    const publishedValue = publishOverride !== undefined ? publishOverride : published;
    const autoExcerpt = excerpt.trim() || extractExcerpt(content);

    const body = {
      title: title.trim(),
      slug: slug.trim(),
      content,
      excerpt: autoExcerpt,
      cover_image: coverImage || null,
      tags,
      published: publishedValue,
    };

    if (!body.title || !body.slug || !body.content) {
      setError("Title, slug, and content are required");
      setSaving(false);
      return;
    }

    const url = isEditing ? `/api/posts/${post.id}` : "/api/posts";
    const method = isEditing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Failed to save post");
      setSaving(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="font-display font-bold text-2xl text-slate-900">
          {isEditing ? "Edit Post" : "Create New Post"}
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreview(!preview)}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
          >
            {preview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {preview ? "Editor" : "Preview"}
          </button>
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 px-3 py-2 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Draft
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="flex items-center gap-1.5 text-sm font-semibold text-white bg-brand-700 px-4 py-2 rounded-lg hover:bg-brand-800 disabled:opacity-50 transition-colors"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
            Publish
          </button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main editor — 2/3 */}
        <div className="lg:col-span-2 space-y-4">
          {/* Title */}
          <div className="card shadow-card p-5">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="My Awesome Blog Post"
              className="w-full text-xl font-display font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none bg-transparent"
            />

            {/* Slug */}
            <div className="mt-3 pt-3 border-t border-slate-100">
              <label className="text-xs text-slate-400 mr-2">Slug:</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugManuallyEdited(true);
                }}
                placeholder="my-awesome-blog-post"
                className="text-xs font-mono text-slate-600 focus:outline-none bg-transparent border-b border-dashed border-slate-200 focus:border-brand-400 pb-0.5 transition-colors"
              />
            </div>
          </div>

          {/* Content */}
          <div className="card shadow-card overflow-hidden">
            {/* Markdown toolbar */}
            <div className="flex items-center gap-0.5 px-3 py-2 border-b border-slate-100 bg-slate-50/60 flex-wrap">
              {toolbarActions.map(({ icon: Icon, label, action }) => (
                <button
                  key={label}
                  onClick={action}
                  title={label}
                  type="button"
                  className="w-8 h-8 rounded flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-white transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}

              {/* Content image upload */}
              <div className="ml-auto">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="content-image-upload"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleContentImageUpload(f);
                    e.target.value = "";
                  }}
                />
                <label
                  htmlFor="content-image-upload"
                  className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-brand-700 cursor-pointer px-2 py-1 rounded hover:bg-white transition-colors"
                >
                  <ImagePlus className="w-3.5 h-3.5" />
                  {uploading ? "Uploading…" : "Insert Image"}
                </label>
              </div>
            </div>

            {preview ? (
              <div className="p-6 min-h-64">
                {/* Lazy import to keep editor bundle small */}
                <div className="prose prose-slate prose-sm max-w-none text-sm text-slate-500 italic">
                  Preview is available in the browser — editor is server-rendered.
                </div>
              </div>
            ) : (
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your content in Markdown…&#10;&#10;## Getting Started&#10;&#10;Your first paragraph here."
                rows={24}
                className="w-full p-5 text-sm font-mono text-slate-800 leading-relaxed resize-none focus:outline-none placeholder:text-slate-300"
              />
            )}
          </div>
        </div>

        {/* Sidebar — 1/3 */}
        <div className="space-y-4">
          {/* Cover Image */}
          <div className="card shadow-card p-4">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
              Cover Image
            </label>

            {coverImage ? (
              <div className="relative rounded-xl overflow-hidden mb-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={coverImage} alt="Cover" className="w-full h-36 object-cover" />
                <button
                  onClick={() => setCoverImage("")}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-brand-300 hover:bg-brand-50/30 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleCoverUpload(f);
                    e.target.value = "";
                  }}
                />
                {uploading ? (
                  <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
                ) : (
                  <>
                    <Upload className="w-5 h-5 text-slate-400 mb-1.5" />
                    <span className="text-xs text-slate-400">Click to upload cover</span>
                    <span className="text-[10px] text-slate-300 mt-0.5">JPG, PNG, WebP</span>
                  </>
                )}
              </label>
            )}

            {/* URL input */}
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="Or paste image URL…"
              className="mt-2 w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 placeholder:text-slate-300 transition-colors"
            />
          </div>

          {/* Excerpt */}
          <div className="card shadow-card p-4">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Excerpt (SEO Description)
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Short description for search results (auto-generated if empty)"
              rows={3}
              className="w-full text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none resize-none leading-relaxed"
            />
            <p className="text-[10px] text-slate-400 mt-1">{excerpt.length}/160 chars</p>
          </div>

          {/* Tags */}
          <div className="card shadow-card p-4">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-xs font-medium text-brand-700 bg-brand-50 border border-brand-100 px-2 py-0.5 rounded-full"
                >
                  {tag}
                  <button onClick={() => removeTag(tag)} className="text-brand-400 hover:text-brand-700">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={addTag}
                placeholder="Add tag, press Enter"
                className="flex-1 text-sm text-slate-700 focus:outline-none placeholder:text-slate-300"
              />
            </div>
          </div>

          {/* Status */}
          <div className="card shadow-card p-4">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
              Status
            </label>
            <div className="flex gap-2">
              {[
                { value: false, label: "Draft", color: "amber" },
                { value: true, label: "Published", color: "brand" },
              ].map(({ value, label, color }) => (
                <button
                  key={label}
                  onClick={() => setPublished(value)}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
                    published === value
                      ? color === "brand"
                        ? "bg-brand-700 text-white"
                        : "bg-amber-500 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Save actions */}
          <div className="space-y-2">
            <button
              onClick={() => handleSave()}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 text-sm font-semibold bg-brand-700 text-white py-2.5 rounded-xl hover:bg-brand-800 disabled:opacity-60 transition-colors"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isEditing ? "Update Post" : "Save Post"}
            </button>
            <button
              onClick={() => router.back()}
              className="w-full text-sm font-medium text-slate-500 py-2 hover:text-slate-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
