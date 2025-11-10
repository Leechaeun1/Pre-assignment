import { InputHTMLAttributes, forwardRef } from "react";

type Props = InputHTMLAttributes<HTMLInputElement>;
const Input = forwardRef<HTMLInputElement, Props>(
  ({ className = "", ...rest }, ref) => (
    <input
      ref={ref}
      className={`w-full rounded-md  bg-white px-3 py-2 shadow-sm
                outline-none  ${className}`}
      {...rest}
    />
  )
);
Input.displayName = "Input";
export default Input;
