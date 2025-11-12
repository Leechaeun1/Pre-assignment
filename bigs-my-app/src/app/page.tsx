"use client";

import {
  BoardItem,
  PageResp,
  fetchBoards,
  fetchCategories,
} from "@/lib/boards";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import Link from "next/link";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Pagination from "@/components/common/Pagination";
import { getAccessToken } from "@/lib/api";

const PAGE_SIZE = 10;

export default function HomePage() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const qPage = Number(sp.get("page") ?? "0");
  const qCat = sp.get("category") ?? "ALL";

  const [page, setPage] = useState(qPage);
  const [activeCat, setActiveCat] = useState(qCat);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [cats, setCats] = useState<{ key: string; label: string }[]>([
    { key: "ALL", label: "전체" },
  ]);

  const [rawList, setRawList] = useState<BoardItem[]>([]);
  const [serverMeta, setServerMeta] = useState({ totalPages: 1, number: 0 });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const checkLoginStatus = () => {
      setIsLoggedIn(!!getAccessToken());
    };

    checkLoginStatus();

    window.addEventListener("loginStatusChanged", checkLoginStatus);

    return () => {
      window.removeEventListener("loginStatusChanged", checkLoginStatus);
    };
  }, []);

  function pushQuery(next: { page?: number; category?: string }) {
    const params = new URLSearchParams(sp.toString());
    if (next.page !== undefined) params.set("page", String(next.page));
    if (next.category !== undefined) params.set("category", next.category);
    router.replace(`${pathname}?${params.toString()}`);
  }

  useEffect(() => {
    if (!isLoggedIn) {
      setCats([{ key: "ALL", label: "전체" }]);
      return;
    }

    (async () => {
      try {
        const obj = await fetchCategories();
        const arr = [
          { key: "ALL", label: "전체" },
          ...Object.entries(obj).map(([k, v]) => ({ key: k, label: v })),
        ];
        setCats(arr);
      } catch {
        //
      }
    })();
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) {
      setRawList([]);
      setLoading(false);
      return;
    }

    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const requestPage = activeCat === "ALL" ? page : 0;
        const requestSize = activeCat === "ALL" ? PAGE_SIZE : 1000;

        const data: PageResp<BoardItem> = await fetchBoards({
          page: requestPage,
          size: requestSize,
        });

        setRawList(data.content || []);
        setServerMeta({
          totalPages: data.totalPages ?? 1,
          number: data.number ?? requestPage,
        });
      } catch {
        //
      } finally {
        setLoading(false);
      }
    })();
  }, [page, activeCat, isLoggedIn]);

  function changeCat(key: string) {
    setActiveCat(key);
    setPage(0);
    pushQuery({ category: key, page: 0 });
  }

  function changePage(n: number) {
    setPage(n);
    pushQuery({ page: n });
  }

  const filtered = useMemo(
    () =>
      activeCat === "ALL"
        ? rawList
        : rawList.filter((it) => it.category === activeCat),
    [rawList, activeCat]
  );

  const localTotalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const displayList =
    activeCat === "ALL"
      ? rawList
      : filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const totalPagesForUI =
    activeCat === "ALL" ? serverMeta.totalPages : localTotalPages;

  if (!isLoggedIn) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <section className="rounded-lg border border-black/10 bg-white p-12 text-center">
          <div className="mb-6 flex justify-center">
            <LockOutlinedIcon
              sx={{ fontSize: 64, color: "rgba(156,163,175,1)" }} // Tailwind gray-400
            />
          </div>

          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            로그인이 필요합니다
          </h2>
          <p className="mb-6 text-gray-600">
            게시판을 이용하시려면 로그인해주세요.
          </p>
          <Link
            href="/auth/login"
            className="inline-block rounded-lg bg-black px-6 py-3 text-white hover:bg-black/90 transition-colors"
          >
            로그인하기
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <div className="mb-4 flex flex-wrap gap-2">
        {cats.map((c) => (
          <button
            key={c.key}
            onClick={() => changeCat(c.key)}
            className={`rounded-full px-3 py-1 text-sm transition-colors ${
              activeCat === c.key
                ? "bg-black text-white"
                : "bg-black/5 hover:bg-black/10"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <section className="rounded-lg border border-black/10 bg-white">
        {loading ? (
          <div className="p-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse border-b border-black/5 p-4 last:border-none"
              >
                <div className="mb-2 h-4 w-2/3 rounded bg-gray-200"></div>
                <div className="h-3 w-1/3 rounded bg-gray-200"></div>
              </div>
            ))}
          </div>
        ) : err ? (
          <div className="p-8 text-center text-red-600">{err}</div>
        ) : displayList.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            게시글이 없습니다.
          </div>
        ) : (
          <ul className="divide-y divide-black/10">
            {displayList.map((item) => (
              <li
                key={item.id}
                className="p-4 hover:bg-black/2 transition-colors"
              >
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
        )}
      </section>

      <div className="mt-6">
        <Pagination
          page={page}
          totalPages={totalPagesForUI}
          onChange={changePage}
          windowSize={5}
        />
      </div>
    </main>
  );
}
