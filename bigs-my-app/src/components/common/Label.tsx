import { LabelHTMLAttributes } from "react";
export default function Label(props: LabelHTMLAttributes<HTMLLabelElement>) {
  const { className = "", ...rest } = props;
  return (
    <label
      {...rest}
      className={`block text-medium font-semibold ${className}`}
    />
  );
}
