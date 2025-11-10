import { authJson } from "@/lib/api";

export type BoardItem = {
  id: number;
  title: string;
  category: string;
  createdAt: string;
};

export type PageResp<T> = {
  content: T[];
  totalElements?: number;
  totalPages?: number;
  number?: number;
  size?: number;
};

export async function fetchBoards(
  params: { page?: number; size?: number; category?: string } = {}
) {
  const { page = 0, size = 10, category } = params;
  const qs = new URLSearchParams({ page: String(page), size: String(size) });
  if (category && category !== "ALL") qs.set("category", category);
  return authJson<PageResp<BoardItem>>(`/boards?${qs.toString()}`);
}

export async function fetchCategories() {
  return authJson<Record<string, string>>("/boards/categories");
}

export type BoardDetail = {
  id: number;
  title: string;
  content: string;
  boardCategory: string;
  imageUrl?: string | null;
  createdAt: string;
};

export async function fetchBoardById(id: string | number) {
  return authJson<BoardDetail>(`/boards/${id}`, { method: "GET" });
}
