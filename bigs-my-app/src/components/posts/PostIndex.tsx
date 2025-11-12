"use client";

import {
  BoardItem,
  PageResp,
  fetchBoards,
  fetchCategories,
} from "@/lib/boards";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import CategoryFilter from "./CategoryFilter";
import LoginRequired from "./LoginRequired";
import Pagination from "@/components/common/Pagination";
import PostList from "./PostList";
import PostListSkeleton from "./PostListSkeleton";
import { getAccessToken } from "@/lib/api";

const PAGE_SIZE = 10;

export default function PostIndex() {
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
    const checkLoginStatus = () => setIsLoggedIn(!!getAccessToken());
    checkLoginStatus();
    window.addEventListener("loginStatusChanged", checkLoginStatus);
    return () =>
      window.removeEventListener("loginStatusChanged", checkLoginStatus);
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
      } catch {}
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
          category: activeCat === "ALL" ? undefined : activeCat,
        });

        setRawList(data.content || []);
        setServerMeta({
          totalPages: data.totalPages ?? 1,
          number: data.number ?? requestPage,
        });
      } catch {
        setErr("목록을 불러오지 못했습니다.");
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

  const sortedList = useMemo(() => {
    return [...filtered].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [filtered]);

  const localTotalPages = Math.max(1, Math.ceil(sortedList.length / PAGE_SIZE));

  const displayList =
    activeCat === "ALL"
      ? sortedList
      : sortedList.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const totalPagesForUI =
    activeCat === "ALL" ? serverMeta.totalPages : localTotalPages;

  if (!isLoggedIn) {
    return <LoginRequired />;
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <CategoryFilter
        categories={cats}
        activeKey={activeCat}
        onChange={changeCat}
        className="mb-4"
      />

      <section className="rounded-lg border border-black/10 bg-white">
        {loading ? (
          <PostListSkeleton rows={6} />
        ) : err ? (
          <div className="p-8 text-center text-red-600">{err}</div>
        ) : displayList.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            게시글이 없습니다.
          </div>
        ) : (
          <PostList items={displayList} />
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
