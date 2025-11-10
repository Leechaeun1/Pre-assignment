// 로그인 유효성 검사
import { useState } from "react";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function useLoginValidation() {
  const [emailErr, setEmailErr] = useState<string | null>(null);
  const [pwErr, setPwErr] = useState<string | null>(null);

  const [touched, setTouched] = useState({
    email: false,
    pw: false,
  });

  function validateEmail(value: string) {
    if (!value) return "필수 항목입니다.";
    if (!emailRegex.test(value))
      return "정확한 이메일 형식을 입력해 주세요. (예: bigs@naver.com)";
    return null;
  }

  function validatePw(value: string) {
    if (!value) return "필수 항목입니다.";
    return null;
  }

  function checkEmail(value: string) {
    setTouched((prev) => ({ ...prev, email: true }));
    const err = validateEmail(value.trim());
    setEmailErr(err);
    return !err;
  }

  function checkPw(value: string) {
    setTouched((prev) => ({ ...prev, pw: true }));
    const err = validatePw(value);
    setPwErr(err);
    return !err;
  }

  return {
    emailErr,
    pwErr,
    touched,
    setEmailErr,
    setPwErr,
    checkEmail,
    checkPw,
  };
}
