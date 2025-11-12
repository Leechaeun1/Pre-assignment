"use client";

import { useEffect, useRef } from "react";

import AccountMenu from "@/components/account/AccountMenu";

interface UserPopoverProps {
  onClose: () => void;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
}

export default function UserPopover({ onClose, buttonRef }: UserPopoverProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        ref.current &&
        !ref.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        onClose();
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("mousedown", handleClick);
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("mousedown", handleClick);
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose, buttonRef]);

  return (
    <div
      ref={ref}
      role="dialog"
      className="absolute right-0 mt-2 rounded-xl border border-black/10 bg-white shadow-xl"
    >
      <div className="absolute -top-2 right-6 h-3.5 w-3 rotate-45 bg-white border-l border-t border-black/10" />
      <AccountMenu onClose={onClose} />
    </div>
  );
}
