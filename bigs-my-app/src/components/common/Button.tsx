import { ButtonHTMLAttributes } from "react";
export default function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className = "", ...rest } = props;
  return (
    <button
      {...rest}
      className={`rounded-md bg-black px-4 py-2 text-white shadow-lg transition
                  hover:opacity-90 active:translate-y-px ${className}`}
    />
  );
}
