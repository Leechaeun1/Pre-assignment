"use client";

type Props = { category: string; createdAt: string };

export default function PostMeta({ category, createdAt }: Props) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className="rounded bg-black/5 px-2 py-0.5 text-xs">{category}</span>
      <time className="text-xs text-gray-500">
        {new Date(createdAt).toLocaleString()}
      </time>
    </div>
  );
}
