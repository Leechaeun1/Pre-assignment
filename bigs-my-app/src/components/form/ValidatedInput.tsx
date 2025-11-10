import { InputHTMLAttributes, forwardRef, useState } from "react";

import Input from "@/components/common/Input";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  error?: string | null;
  touched?: boolean;
  onBlurValidate?: (value: string) => void;
  clearError?: () => void;
};

const ValidatedInput = forwardRef<HTMLInputElement, Props>(
  (
    { error, onBlurValidate, clearError, className = "", type, ...rest },
    ref
  ) => {
    const [showPw, setShowPw] = useState(false);
    const isPassword = type === "password";

    return (
      <div className="relative">
        <Input
          ref={ref}
          type={isPassword && showPw ? "text" : type}
          className={`bg-white placeholder:text-sm pr-10  ${className}`}
          onBlur={(e) => onBlurValidate?.(e.target.value)}
          onChange={() => {
            if (error) clearError?.();
          }}
          {...rest}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
          >
            {showPw ? (
              <VisibilityOffIcon fontSize="small" />
            ) : (
              <RemoveRedEyeIcon fontSize="small" />
            )}
          </button>
        )}
      </div>
    );
  }
);

ValidatedInput.displayName = "ValidatedInput";
export default ValidatedInput;
