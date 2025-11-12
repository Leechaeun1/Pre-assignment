"use client";

import Image from "next/image";
import PostActions from "./PostActions";
import PostMeta from "./PostMeta";

type Props = {
  loading: boolean;
  error: string | null;
  data: {
    id: number;
    title: string;
    content: string;
    boardCategory: string;
    imageUrl?: string | null;
    createdAt: string;
  } | null;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;

function buildImageSrc(imageUrl: string) {
  if (!imageUrl) return "";
  if (imageUrl.startsWith("http")) return imageUrl;
  const base = API_BASE.replace(/\/$/, "");
  const path = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
  return `${base}${path}`;
}

export default function PostDetail({ loading, error, data }: Props) {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <section className="rounded-xl border border-black/10 bg-white p-6">
        {loading && <PostSkeleton />}
        {!loading && error && (
          <p className="text-center text-red-600">{error}</p>
        )}
        {!loading && !error && data && (
          <>
            <PostMeta
              category={data.boardCategory}
              createdAt={data.createdAt}
            />

            <h1 className="mb-4 text-2xl font-semibold">{data.title}</h1>

            <article className="prose prose-neutral max-w-none whitespace-pre-wrap leading-7">
              {data.content}
            </article>

            {data.imageUrl && (
              <div className="mb-4 overflow-hidden rounded-lg border border-black/10 bg-gray-50">
                <Image
                  src={buildImageSrc(data.imageUrl)}
                  alt={data.title}
                  width={800}
                  height={600}
                  className="max-h-[480px] w-full rounded-lg border border-black/10 object-contain"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display =
                      "none";
                  }}
                />
              </div>
            )}

            <PostActions postId={data.id} />
          </>
        )}
      </section>
    </main>
  );
}

function PostSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-6 w-20 animate-pulse rounded bg-gray-200" />
      <div className="h-8 w-2/3 animate-pulse rounded bg-gray-200" />
      <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200" />
      <div className="h-64 w-full animate-pulse rounded bg-gray-200" />
      <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
      <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200" />
    </div>
  );
}
