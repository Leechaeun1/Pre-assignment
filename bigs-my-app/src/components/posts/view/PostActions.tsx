"use client";

import Link from "next/link";
import { getAccessToken } from "@/lib/api";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;

type Props = { postId: number };

export default function PostActions({ postId }: Props) {
  const router = useRouter();
  const deletingLabel = "삭제 중...";
  const idleLabel = "삭제";

  async function handleDelete() {
    const ok = window.confirm("정말 이 글을 삭제하시겠습니까?");
    if (!ok) return;

    const btn = document.getElementById("delete-btn") as HTMLButtonElement;
    try {
      if (btn) {
        btn.disabled = true;
        btn.innerText = deletingLabel;
      }
      const token = getAccessToken();
      const res = await fetch(
        `${API_BASE.replace(/\/$/, "")}/boards/${postId}`,
        {
          method: "DELETE",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `삭제 실패 (status ${res.status})`);
      }

      router.push("/");
    } catch (e: any) {
      alert(e?.message || "삭제 중 오류가 발생했습니다.");
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerText = idleLabel;
      }
    }
  }

  return (
    <div className="mt-6 flex justify-end gap-2">
      <Link
        href="/"
        className="rounded-md bg-black px-4 py-2 text-sm text-white hover:opacity-90"
      >
        목록으로
      </Link>

      <Link
        href={`/posts/${postId}/edit`}
        className="rounded-md border border-black/20 bg-white px-4 py-2 text-sm text-gray-800 hover:bg-black/5"
      >
        수정하기
      </Link>

      <button
        id="delete-btn"
        onClick={handleDelete}
        className="rounded-md border border-red-300 bg-white px-4 py-2 text-sm text-red-600 hover:bg-red-50"
      >
        {idleLabel}
      </button>
    </div>
  );
}
