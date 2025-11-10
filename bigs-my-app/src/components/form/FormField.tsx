import { ReactNode } from "react";

type Props = {
  id: string;
  label: string;
  error?: string | null;
  touched?: boolean;
  children: ReactNode;
  className?: string;
};

export default function FormField({
  id,
  label,
  error,
  touched,
  children,
  className = "",
}: Props) {
  return (
    <div className={className}>
      <div className="mb-2 flex items-baseline gap-2">
        <label htmlFor={id} className="text-base font-bold">
          {label}
        </label>
        {touched && error && (
          <span className="text-xs text-red-600">{error}</span>
        )}
      </div>
      {children}
    </div>
  );
}
