"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import Link from "next/link";
import { fetchCategories } from "@/lib/boards";
import { getAccessToken } from "@/lib/api";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;
type Cat = { key: string; label: string };

type Initial = {
  id?: number | string;
  title?: string;
  content?: string;
  category?: string;
  imageUrl?: string | null;
} | null;

type Props = {
  mode: "create" | "edit";
  initial?: Initial;
  cancelHref: string;
};

export default function PostForm({ mode, initial = null, cancelHref }: Props) {
  const router = useRouter();

  const [cats, setCats] = useState<Cat[]>([]);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [category, setCategory] = useState<string>(initial?.category ?? "");
  const [serverImageUrl] = useState<string | null>(initial?.imageUrl ?? null);

  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const catObj = await fetchCategories();
        const arr = Object.entries(catObj).map(([key, label]) => ({
          key,
          label,
        }));
        setCats(arr);
        if (!category) setCategory(arr[0]?.key ?? "");
      } catch (e: any) {
        setErr(e?.message || "카테고리를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const previewUrl = useMemo(() => {
    if (file) return URL.createObjectURL(file);
    if (!serverImageUrl) return null;
    if (serverImageUrl.startsWith("http")) return serverImageUrl;
    const base = API_BASE.replace(/\/$/, "");
    const path = serverImageUrl.startsWith("/")
      ? serverImageUrl
      : `/${serverImageUrl}`;
    return `${base}${path}`;
  }, [file, serverImageUrl]);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files?.[0] ?? null);
  }
  function clearFile() {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !category) {
      setErr("제목, 내용, 카테고리를 모두 입력해주세요.");
      return;
    }

    try {
      setSaving(true);
      setErr(null);

      const payload = {
        title: title.trim(),
        content: content.trim(),
        category,
      };
      const jsonBlob = new Blob([JSON.stringify(payload)], {
        type: "application/json; charset=UTF-8",
      });
      const jsonFile = new File([jsonBlob], "request.json", {
        type: "application/json; charset=UTF-8",
      });

      const fd = new FormData();
      fd.append("request", jsonFile);
      if (file) fd.append("file", file, file.name);

      const token = getAccessToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const url =
        mode === "create"
          ? `${API_BASE.replace(/\/$/, "")}/boards`
          : `${API_BASE.replace(/\/$/, "")}/boards/${initial?.id}`;

      const method = mode === "create" ? "POST" : "PATCH";
      const res = await fetch(url, { method, headers, body: fd });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `요청 실패 (status ${res.status})`);
      }

      const data = await res.json().catch(() => null);
      const id = data?.id ?? initial?.id;
      router.push(`/posts/${id}`);
    } catch (e: any) {
      setErr(e?.message || "저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <form
        onSubmit={onSubmit}
        className="rounded-xl border border-black/10 bg-white p-6"
      >
        <h1 className="mb-4 text-xl font-semibold">
          {mode === "create" ? "새 글 작성" : "글 수정"}
        </h1>

        {(err || loading) && (
          <div className="mb-4 rounded-md border border-black/10 bg-black/5 px-3 py-2 text-sm">
            {loading ? "" : <span className="text-red-700">{err}</span>}
          </div>
        )}

        <div className="mb-4">
          <label className="mb-2 block text-sm text-gray-700">카테고리</label>
          <div className="flex flex-wrap gap-2">
            {cats.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => setCategory(c.key)}
                className={`rounded-full px-3 py-1 text-sm transition-colors ${
                  category === c.key
                    ? "bg-black text-white"
                    : "bg-black/5 hover:bg-black/10"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-sm text-gray-700">제목</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            className="w-full rounded-md border border-black/20 px-3 py-2 text-sm outline-none focus:border-black"
          />
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-sm text-gray-700">내용</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요"
            rows={10}
            className="w-full resize-y rounded-md border border-black/20 px-3 py-2 text-sm outline-none focus:border-black"
          />
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-sm text-gray-700">
            대표 이미지 (선택)
          </label>

          {previewUrl ? (
            <div className="mb-2 overflow-hidden rounded-lg border border-black/10 bg-gray-50">
              <img
                src={previewUrl}
                alt="preview"
                className="max-h-[360px] w-full object-contain"
              />
            </div>
          ) : (
            <p className="mb-2 text-xs text-gray-500">이미지가 없습니다.</p>
          )}

          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="block w-full text-sm file:mr-3 file:rounded-md file:border file:border-black/20 file:bg-white file:px-3 file:py-1.5 file:text-sm hover:file:bg-black/5"
            />
            {file && (
              <button
                type="button"
                onClick={clearFile}
                className="rounded-md border border-black/20 bg-white px-3 py-1.5 text-sm hover:bg-black/5"
              >
                선택 해제
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Link
            href={cancelHref}
            className="rounded-md border border-black/20 bg-white px-4 py-2 text-sm text-gray-800 hover:bg-black/5"
          >
            취소
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-black px-4 py-2 text-sm text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "저장 중..." : mode === "create" ? "작성하기" : "저장"}
          </button>
        </div>
      </form>
    </main>
  );
}
