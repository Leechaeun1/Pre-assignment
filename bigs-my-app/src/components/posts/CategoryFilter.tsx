// src/components/post/CategoryFilter.tsx
"use client";

type Props = {
  categories: { key: string; label: string }[];
  activeKey: string;
  onChange: (key: string) => void;
  className?: string;
};

export default function CategoryFilter({
  categories,
  activeKey,
  onChange,
  className,
}: Props) {
  return (
    <div className={`flex flex-wrap gap-2 ${className ?? ""}`}>
      {categories.map((c) => (
        <button
          key={c.key}
          onClick={() => onChange(c.key)}
          className={`rounded-full px-3 py-1 text-sm transition-colors ${
            activeKey === c.key
              ? "bg-black text-white"
              : "bg-black/5 hover:bg-black/10"
          }`}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}
