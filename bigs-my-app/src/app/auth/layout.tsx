"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isSignup = pathname.includes("/signup");
  const isLogin = pathname.includes("/login");

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-white">
      <h1 className="mb-8 text-center text-4xl font-bold">
        {isSignup ? "Sign Up" : "Log In"}
      </h1>

      <div className="w-full max-w-md rounded-lg bg-black/[0.07] p-8">
        {children}
      </div>

      {isLogin && (
        <div className="mt-6 text-center text-sm text-gray-700">
          아직 계정이 없으신가요?{" "}
          <Link
            href="/auth/signup"
            className="font-medium text-black underline hover:text-blue-600"
          >
            회원가입하기
          </Link>
        </div>
      )}
    </div>
  );
}
