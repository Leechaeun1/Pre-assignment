"use client";

import { useEffect, useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import Link from "next/link";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/navigation";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      return !!token;
    }
    return false;
  });
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("accessToken");
      setIsLogin(!!token);
    };

    window.addEventListener("storage", checkLoginStatus);

    window.addEventListener("loginStatusChanged", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
      window.removeEventListener("loginStatusChanged", checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsLogin(false);

    window.dispatchEvent(new Event("loginStatusChanged"));

    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/10 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="text-xl font-bold hover:opacity-70">
          게시판
        </Link>

        <div className="flex items-center gap-4">
          <nav className="hidden items-center gap-6 sm:flex">
            {isLogin ? (
              <>
                <Link
                  href="/me"
                  className=" text-sm text-gray-800 hover:text-black"
                >
                  마이페이지
                </Link>
                <button
                  onClick={handleLogout}
                  className=" text-sm  text-red-500 hover:text-black cursor-pointer "
                >
                  로그아웃
                </button>
                <Link
                  href="/posts/new"
                  className="rounded-md bg-black px-3 py-1.5 text-white hover:opacity-90"
                >
                  글쓰기
                </Link>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="rounded-md border border-black/20 px-3 py-1.5 text-sm text-gray-700 hover:bg-black hover:text-white"
              >
                로그인
              </Link>
            )}
          </nav>

          <button
            onClick={() => setOpen(!open)}
            className="rounded-md p-2 text-gray-700 sm:hidden"
            aria-label="Toggle menu"
          >
            {open ? (
              <CloseIcon fontSize="medium" />
            ) : (
              <MenuIcon fontSize="medium" />
            )}
          </button>
        </div>
      </div>

      {open && (
        <div className="sm:hidden border-t border-black/10 bg-white">
          <div className="flex justify-end">
            <nav className="flex w-full max-w-60 flex-col items-end gap-2 px-6 py-3 text-sm text-right">
              {isLogin ? (
                <>
                  <Link
                    href="/me"
                    className="w-full text-gray-800 hover:text-black"
                    onClick={() => setOpen(false)}
                  >
                    마이페이지
                  </Link>
                  <Link
                    href="/posts/new"
                    className="w-full text-gray-800 hover:text-black"
                    onClick={() => setOpen(false)}
                  >
                    글쓰기
                  </Link>
                  <div className="h-4" />
                  <button
                    onClick={() => {
                      handleLogout();
                      setOpen(false);
                    }}
                    className="w-full text-red-500 hover:text-black text-right"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/login"
                  className="w-full text-gray-800 hover:text-black text-right"
                  onClick={() => setOpen(false)}
                >
                  로그인
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
