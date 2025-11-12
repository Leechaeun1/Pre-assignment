"use client";

import Link from "next/link";

export default function FormActions({
  cancelHref,
  submitLabel,
  disabled,
}: {
  cancelHref: string;
  submitLabel: string;
  disabled?: boolean;
}) {
  return (
    <div className="mt-6 flex justify-end gap-2">
      <Link
        href={cancelHref}
        className="rounded-md border border-black/20 bg-white px-4 py-2 text-sm text-gray-800 hover:bg-black/5"
      >
        취소
      </Link>
      <button
        type="submit"
        disabled={disabled}
        className="rounded-md bg-black px-4 py-2 text-sm text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitLabel}
      </button>
    </div>
  );
}
