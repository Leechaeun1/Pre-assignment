"use client";

import { clearTokens, getAccessToken } from "@/lib/api";
import { extractUserFromPayload, parseJwt } from "@/lib/jwt";

import clsx from "clsx";

type Props = {
  onClose: () => void;
  variant?: "popover" | "inline";
  className?: string;
};

export default function AccountMenu({
  onClose,
  variant = "popover",
  className,
}: Props) {
  const token = getAccessToken();
  const payload = token ? parseJwt(token) : null;
  const { id: userId, name: userName } = extractUserFromPayload(payload);

  const onLogout = () => {
    clearTokens();
    window.dispatchEvent(new Event("loginStatusChanged"));
    onClose();
  };

  return (
    <div
      className={clsx(
        variant === "popover" && "w-64 p-4",
        variant === "inline" && "w-full p-3",
        className
      )}
    >
      <p className="mb-1 text-sm text-gray-600">로그인 사용자</p>

      <div
        className={clsx(
          "p-3 rounded-lg",
          variant === "popover" ? "bg-gray-50" : "bg-gray-50"
        )}
      >
        <div className="text-sm">
          <span className="text-gray-500">아이디</span>
          <span className="ml-2 font-medium">{userId ?? "알 수 없음"}</span>
        </div>
        <div className="mt-1 text-sm">
          <span className="text-gray-500">이름</span>
          <span className="ml-2 font-medium">{userName ?? "알 수 없음"}</span>
        </div>
      </div>

      <div className={clsx("mt-3 flex justify-end gap-2")}>
        <button
          onClick={onLogout}
          className="rounded-md bg-black px-3 py-1.5 text-sm text-white hover:opacity-90"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}
