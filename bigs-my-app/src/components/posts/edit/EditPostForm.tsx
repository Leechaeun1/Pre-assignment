"use client";

import { fetchBoardById, fetchCategories } from "@/lib/boards";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import CategoryPicker from "./CategoryPicker";
import FormActions from "./FormActions";
import ImageUploader from "./ImageUploader";
import Link from "next/link";
import { getAccessToken } from "@/lib/api";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;
type Cat = { key: string; label: string };

export default function EditPostForm() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [cats, setCats] = useState<Cat[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<string>("");

  const [imageUrl, setImageUrl] = useState<string | null>(null); // 서버 이미지
  const [file, setFile] = useState<File | null>(null); // 새 업로드
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      try {
        setErr(null);
        const [detail, catObj] = await Promise.all([
          fetchBoardById(id),
          fetchCategories(),
        ]);

        const catArr = Object.entries(catObj).map(([key, label]) => ({
          key,
          label,
        })) as Cat[];
        setCats(catArr);

        setTitle(detail.title ?? "");
        setContent(detail.content ?? "");
        setCategory(detail.boardCategory ?? catArr[0]?.key ?? "");
        setImageUrl(detail.imageUrl ?? null);
      } catch (e: any) {
        setErr(e?.message || "글 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const previewUrl = useMemo(() => {
    if (file) return URL.createObjectURL(file);
    if (!imageUrl) return null;
    if (imageUrl.startsWith("http")) return imageUrl;
    const base = API_BASE.replace(/\/$/, "");
    const path = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
    return `${base}${path}`;
  }, [file, imageUrl]);

  function onFileChange(ev: React.ChangeEvent<HTMLInputElement>) {
    const f = ev.target.files?.[0];
    if (f) setFile(f);
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
      const res = await fetch(`${API_BASE.replace(/\/$/, "")}/boards/${id}`, {
        method: "PATCH",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: fd,
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `수정 실패 (status ${res.status})`);
      }

      router.push(`/posts/${id}`);
    } catch (e: any) {
      setErr(e?.message || "수정 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <section className="rounded-xl border border-black/10 bg-white p-6">
          <div className="space-y-4">
            <div className="h-6 w-24 rounded bg-gray-200 animate-pulse" />
            <div className="h-10 w-full rounded bg-gray-200 animate-pulse" />
            <div className="h-8 w-1/3 rounded bg-gray-200 animate-pulse" />
            <div className="h-40 w-full rounded bg-gray-200 animate-pulse" />
          </div>
        </section>
      </main>
    );
  }

  if (err && !saving && !title) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <section className="rounded-xl border border-black/10 bg-white p-6 text-center">
          <p className="text-red-600">{err}</p>
          <div className="mt-6">
            <Link
              href={`/posts/${id}`}
              className="text-sm text-gray-700 underline"
            >
              돌아가기
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <form
        onSubmit={onSubmit}
        className="rounded-xl border border-black/10 bg-white p-6"
      >
        <h1 className="mb-4 text-xl font-semibold">글 수정</h1>

        {err && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {err}
          </div>
        )}

        <CategoryPicker cats={cats} value={category} onChange={setCategory} />

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

        <ImageUploader
          previewUrl={previewUrl}
          inputRef={fileInputRef}
          onFileChange={onFileChange}
          onClear={clearFile}
          hasFile={!!file}
        />

        <FormActions
          cancelHref={`/posts/${id}`}
          submitLabel={saving ? "저장 중..." : "저장"}
          disabled={saving}
        />
      </form>
    </main>
  );
}
