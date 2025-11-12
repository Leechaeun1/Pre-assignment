"use client";

type Cat = { key: string; label: string };

export default function CategoryPicker({
  cats,
  value,
  onChange,
}: {
  cats: Cat[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="mb-4">
      <label className="mb-2 block text-sm text-gray-700">카테고리</label>
      <div className="flex flex-wrap gap-2">
        {cats.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => onChange(c.key)}
            className={`rounded-full px-3 py-1 text-sm transition-colors ${
              value === c.key
                ? "bg-black text-white"
                : "bg-black/5 hover:bg-black/10"
            }`}
            aria-pressed={value === c.key}
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}
