"use client";

import { BoardDetail, fetchBoardById } from "@/lib/boards";
import { useEffect, useState } from "react";

import PostForm from "@/components/posts/PostForm";
import { useParams } from "next/navigation";

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<BoardDetail | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const d = await fetchBoardById(id);
        setData(d);
      } catch (e: any) {
        setErr(e?.message || "글 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="p-6 text-center">로딩 중…</div>;
  if (err || !data)
    return (
      <div className="p-6 text-center text-red-600">
        {err || "글이 없습니다."}
      </div>
    );

  return (
    <PostForm
      mode="edit"
      cancelHref={`/posts/${id}`}
      initial={{
        id: data.id,
        title: data.title,
        content: data.content,
        category: data.boardCategory,
        imageUrl: data.imageUrl ?? null,
      }}
    />
  );
}
