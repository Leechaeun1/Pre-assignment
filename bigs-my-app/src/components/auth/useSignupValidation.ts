import { useState } from "react";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!%*#?&]).{8,}$/;

export function useSignupValidation() {
  const [emailErr, setEmailErr] = useState<string | null>(null);
  const [nameErr, setNameErr] = useState<string | null>(null);
  const [pwErr, setPwErr] = useState<string | null>(null);
  const [pw2Err, setPw2Err] = useState<string | null>(null);

  const [touched, setTouched] = useState({
    email: false,
    name: false,
    pw: false,
    pw2: false,
  });

  function validateEmail(v: string) {
    if (!v) return "필수 항목입니다.";
    if (!emailRegex.test(v)) return "정확한 이메일 형식을 입력해 주세요.";
    return null;
  }
  function validateName(v: string) {
    if (!v) return "필수 항목입니다.";
    return null;
  }
  function validatePw(v: string) {
    if (!v) return "필수 항목입니다.";
    if (!pwRegex.test(v))
      return "8자 이상, 숫자/영문/특수문자(!%*#?&) 포함해야 합니다.";
    return null;
  }
  function validatePw2(pw: string, pw2: string) {
    if (!pw2) return "필수 항목입니다.";
    if (pw !== pw2) return "비밀번호가 일치하지 않습니다.";
    return null;
  }

  function checkEmail(v: string) {
    setTouched((t) => ({ ...t, email: true }));
    const err = validateEmail(v.trim());
    setEmailErr(err);
    return !err;
  }
  function checkName(v: string) {
    setTouched((t) => ({ ...t, name: true }));
    const err = validateName(v.trim());
    setNameErr(err);
    return !err;
  }
  function checkPw(v: string) {
    setTouched((t) => ({ ...t, pw: true }));
    const err = validatePw(v);
    setPwErr(err);
    return !err;
  }
  function checkPw2(pw: string, pw2: string) {
    setTouched((t) => ({ ...t, pw2: true }));
    const err = validatePw2(pw, pw2);
    setPw2Err(err);
    return !err;
  }

  return {
    emailErr,
    nameErr,
    pwErr,
    pw2Err,
    touched,
    setEmailErr,
    setNameErr,
    setPwErr,
    setPw2Err,
    checkEmail,
    checkName,
    checkPw,
    checkPw2,
  };
}
