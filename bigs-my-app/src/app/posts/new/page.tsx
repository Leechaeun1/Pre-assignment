"use client";

import PostForm from "@/components/posts/PostForm";

export default function NewPostPage() {
  return <PostForm mode="create" cancelHref="/" />;
}
