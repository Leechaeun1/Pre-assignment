import { authJson, getAccessToken } from "@/lib/api";

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

  const path = `/boards?${qs.toString()}`;
  const hasToken = !!getAccessToken();

  try {
    if (hasToken) {
      return await authJson<PageResp<BoardItem>>(path);
    } else {
      return {
        content: [],
        totalElements: 0,
        totalPages: 0,
        number: 0,
        size: size,
      } as PageResp<BoardItem>;
    }
  } catch (error) {
    throw error;
  }
}

export async function fetchCategories() {
  const hasToken = !!getAccessToken();

  try {
    if (hasToken) {
      return await authJson<Record<string, string>>("/boards/categories");
    } else {
      return {} as Record<string, string>;
    }
  } catch (error) {
    throw error;
  }
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
  return authJson<BoardDetail>(`/boards/${id}`);
}
