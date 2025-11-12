"use client";

import { BoardDetail, fetchBoardById } from "@/lib/boards";
import { useEffect, useState } from "react";

import PostDetail from "./PostDetail";

type Props = {
  id: string;
  onNotFound?: () => void;
};

export default function PostDetailContainer({ id, onNotFound }: Props) {
  const [data, setData] = useState<BoardDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchBoardById(id);
        setData(res);
      } catch (e: any) {
        setErr(e?.message || "글을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  useEffect(() => {
    if (!loading && !data && !err && onNotFound) onNotFound();
  }, [loading, data, err, onNotFound]);

  return <PostDetail loading={loading} error={err} data={data} />;
}
