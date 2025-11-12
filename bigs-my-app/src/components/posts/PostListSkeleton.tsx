// src/components/post/PostListSkeleton.tsx
"use client";

export default function PostListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="p-4">
      {[...Array(rows)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse border-b border-black/5 p-4 last:border-none"
        >
          <div className="mb-2 h-4 w-2/3 rounded bg-gray-200"></div>
          <div className="h-3 w-1/3 rounded bg-gray-200"></div>
        </div>
      ))}
    </div>
  );
}
