"use client";

import { BoardDetail, fetchBoardById } from "@/lib/boards";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [data, setData] = useState<BoardDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchBoardById(id);
        setData(res);
      } catch (e: any) {
        setErr(e?.message || "글을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (!loading && !data && !err) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <section className="rounded-xl border border-black/10 bg-white p-6">
        {loading ? (
          <div className="space-y-4">
            <div className="animate-pulse h-6 w-20 rounded bg-gray-200" />
            <div className="animate-pulse h-8 w-2/3 rounded bg-gray-200" />
            <div className="animate-pulse h-4 w-1/3 rounded bg-gray-200" />
            <div className="animate-pulse h-64 w-full rounded bg-gray-200" />
            <div className="animate-pulse h-4 w-full rounded bg-gray-200" />
            <div className="animate-pulse h-4 w-5/6 rounded bg-gray-200" />
          </div>
        ) : err ? (
          <p className="text-center text-red-600">{err}</p>
        ) : data ? (
          <>
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded bg-black/5 px-2 py-0.5 text-xs">
                {data.boardCategory}
              </span>
              <time className="text-xs text-gray-500">
                {new Date(data.createdAt).toLocaleString()}
              </time>
            </div>

            <h1 className="mb-4 text-2xl font-semibold">{data.title}</h1>
            <article className="prose prose-neutral max-w-none whitespace-pre-wrap leading-7">
              {data.content}
            </article>
            {data.imageUrl ? (
              <div className="mb-4 overflow-hidden rounded-lg border border-black/10 bg-gray-50">
                <Image
                  src={
                    data.imageUrl.startsWith("http")
                      ? data.imageUrl
                      : `${API_BASE.replace(/\/$/, "")}${
                          data.imageUrl.startsWith("/") ? "" : "/"
                        }${data.imageUrl}`
                  }
                  alt={data.title}
                  width={800}
                  height={600}
                  className="max-h-[480px] w-full object-contain rounded-lg border border-black/10"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              </div>
            ) : null}
          </>
        ) : null}
      </section>

      <div className="mt-6 flex justify-end">
        <Link
          href="/"
          className="rounded-md bg-black px-4 py-2 text-sm text-white hover:opacity-90"
        >
          목록으로
        </Link>
      </div>
    </main>
  );
}
