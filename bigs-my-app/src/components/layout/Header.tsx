"use client";

import { useEffect, useRef, useState } from "react";

import AccountMenu from "@/components/account/AccountMenu";
import CloseIcon from "@mui/icons-material/Close";
import Link from "next/link";
import MenuIcon from "@mui/icons-material/Menu";
import UserPopover from "@/components/layout/UserPopover";
import { getAccessToken } from "@/lib/api";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [bubbleOpen, setBubbleOpen] = useState(false);
  const [mobileInfoOpen, setMobileInfoOpen] = useState(false);

  const desktopBtnRef = useRef<HTMLButtonElement>(null);
  const accountPanelId = "mobile-account-panel";

  useEffect(() => {
    const sync = () => setIsLogin(!!getAccessToken());
    sync();
    window.addEventListener("loginStatusChanged", sync);
    return () => window.removeEventListener("loginStatusChanged", sync);
  }, []);

  const toggleDesktopPopover = () => setBubbleOpen((v) => !v);
  const closeDesktopPopover = () => setBubbleOpen(false);

  const toggleMobileMenu = () => setOpen((v) => !v);
  const closeMobileMenu = () => {
    setOpen(false);
    setMobileInfoOpen(false);
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
              <div className="relative">
                <button
                  ref={desktopBtnRef}
                  type="button"
                  onClick={toggleDesktopPopover}
                  className="text-gray-800 hover:text-black"
                  aria-haspopup="dialog"
                  aria-expanded={bubbleOpen}
                >
                  내 정보
                </button>
                {bubbleOpen && (
                  <UserPopover
                    onClose={closeDesktopPopover}
                    buttonRef={desktopBtnRef}
                  />
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-gray-800 hover:text-black"
                >
                  로그인
                </Link>
                <Link
                  href="/auth/signup"
                  className="text-gray-800 hover:text-black"
                >
                  회원가입
                </Link>
              </>
            )}

            <Link
              href="/posts/new"
              className="rounded-md bg-black px-3 py-1.5 text-white hover:opacity-90"
            >
              글쓰기
            </Link>
          </nav>

          <button
            onClick={toggleMobileMenu}
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
        <div className="border-t border-black/10 bg-white sm:hidden">
          <div className="flex justify-end">
            <nav className="flex w-full max-w-60 flex-col items-end gap-2 px-6 py-3 text-sm text-right">
              {isLogin ? (
                <>
                  <button
                    type="button"
                    className="w-full text-right text-gray-800 hover:text-black"
                    onClick={() => setMobileInfoOpen((v) => !v)}
                    aria-expanded={mobileInfoOpen}
                    aria-controls={accountPanelId}
                  >
                    내 정보
                  </button>

                  {mobileInfoOpen && (
                    <div
                      id={accountPanelId}
                      className="w-full rounded-lg border border-black/10 bg-white"
                    >
                      <AccountMenu
                        variant="inline"
                        onClose={() => setMobileInfoOpen(false)}
                        className="p-3"
                      />
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href="/login"
                  className="w-full text-gray-800 hover:text-black"
                  onClick={closeMobileMenu}
                >
                  로그인
                </Link>
              )}

              <Link
                href="/posts/new"
                className="w-full text-gray-800 hover:text-black"
                onClick={closeMobileMenu}
              >
                글쓰기
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
