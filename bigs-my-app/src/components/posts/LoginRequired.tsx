// src/components/post/LoginRequired.tsx
"use client";

import Link from "next/link";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

export default function LoginRequired() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <section className="rounded-lg border border-black/10 bg-white p-12 text-center">
        <div className="mb-6 flex justify-center">
          <LockOutlinedIcon
            sx={{ fontSize: 64, color: "rgba(156,163,175,1)" }}
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
          className="inline-block rounded-lg bg-black px-6 py-3 text-white transition-colors hover:bg-black/90"
        >
          로그인하기
        </Link>
      </section>
    </main>
  );
}
