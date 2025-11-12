"use client";

import { BoardItem } from "@/lib/boards";
import Link from "next/link";

export default function PostList({ items }: { items: BoardItem[] }) {
  return (
    <ul className="divide-y divide-black/10">
      {items.map((item) => (
        <li key={item.id} className="p-4 transition-colors hover:bg-black/2">
          <Link href={`/posts/${item.id}`} className="block">
            <div className="flex items-center gap-2">
              <span className="rounded bg-black/5 px-2 py-0.5 text-xs">
                {item.category}
              </span>
              <h2 className="truncate font-medium">{item.title}</h2>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              {new Date(item.createdAt).toLocaleString()}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
