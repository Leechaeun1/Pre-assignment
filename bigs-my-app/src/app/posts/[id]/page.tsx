"use client";

import PostDetailContainer from "@/components/posts/view/PostDetailContainer";
import { notFound } from "next/navigation";
import { useParams } from "next/navigation";

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  return <PostDetailContainer id={id} onNotFound={notFound} />;
}
