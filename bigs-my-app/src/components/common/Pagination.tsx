"use client";

type Props = {
  page: number;
  totalPages: number;
  onChange: (nextPage: number) => void;
  windowSize?: number;
};

export default function Pagination({
  page,
  totalPages,
  onChange,
  windowSize = 5,
}: Props) {
  if (totalPages <= 1) return null;

  const clamp = (v: number) => Math.max(0, Math.min(v, totalPages - 1));

  const half = Math.floor(windowSize / 2);
  let start = Math.max(0, page - half);
  const end = Math.min(totalPages - 1, start + windowSize - 1);
  if (end - start + 1 < windowSize) start = Math.max(0, end - windowSize + 1);

  const nums = [];
  for (let i = start; i <= end; i++) nums.push(i);

  return (
    <nav
      className="flex items-center justify-center gap-1 text-sm"
      aria-label="Pagination"
    >
      <button
        className="px-3 py-1 rounded-md border border-black/10 disabled:opacity-40"
        onClick={() => onChange(clamp(0))}
        disabled={page === 0}
      >
        « 처음
      </button>
      <button
        className="px-3 py-1 rounded-md border border-black/10 disabled:opacity-40"
        onClick={() => onChange(clamp(page - 1))}
        disabled={page === 0}
      >
        ‹ 이전
      </button>

      {start > 0 && (
        <button
          className="px-3 py-1 rounded-md border border-black/10"
          onClick={() => onChange(start - 1)}
        >
          …
        </button>
      )}

      {nums.map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          className={`px-3 py-1 rounded-md border ${
            n === page
              ? "bg-black text-white border-black"
              : "border-black/10 hover:bg-black/5"
          }`}
          aria-current={n === page ? "page" : undefined}
        >
          {n + 1}
        </button>
      ))}

      {end < totalPages - 1 && (
        <button
          className="px-3 py-1 rounded-md border border-black/10"
          onClick={() => onChange(end + 1)}
        >
          …
        </button>
      )}

      <button
        className="px-3 py-1 rounded-md border border-black/10 disabled:opacity-40"
        onClick={() => onChange(clamp(page + 1))}
        disabled={page >= totalPages - 1}
      >
        다음 ›
      </button>
      <button
        className="px-3 py-1 rounded-md border border-black/10 disabled:opacity-40"
        onClick={() => onChange(clamp(totalPages - 1))}
        disabled={page >= totalPages - 1}
      >
        끝 »
      </button>
    </nav>
  );
}
