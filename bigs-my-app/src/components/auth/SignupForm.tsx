"use client";

import { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Button from "@/components/common/Button";
import FormField from "@/components/form/FormField";
import ValidatedInput from "@/components/form/ValidatedInput";
import { signup } from "@/lib/api";
import { useSignupValidation } from "./useSignupValidation";

export default function SignupForm() {
  const router = useRouter();
  const q = useSearchParams();
  const next = q.get("next") || "/";

  const emailRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const pwRef = useRef<HTMLInputElement>(null);
  const pw2Ref = useRef<HTMLInputElement>(null);

  const {
    emailErr,
    nameErr,
    pwErr,
    pw2Err,
    touched,
    checkEmail,
    checkName,
    checkPw,
    checkPw2,
    setEmailErr,
    setNameErr,
    setPwErr,
    setPw2Err,
  } = useSignupValidation();

  const [submitErr, setSubmitErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const username = emailRef.current?.value.trim() || "";
    const name = nameRef.current?.value.trim() || "";
    const password = pwRef.current?.value || "";
    const confirmPassword = pw2Ref.current?.value || "";

    const ok =
      checkEmail(username) &&
      checkName(name) &&
      checkPw(password) &&
      checkPw2(password, confirmPassword);

    if (!ok) return;

    try {
      setLoading(true);
      setSubmitErr(null);

      await signup({ username, name, password, confirmPassword });

      router.replace(`/auth/login?next=${encodeURIComponent(next)}`);
    } catch (err: any) {
      setSubmitErr(err?.message || "회원가입 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {submitErr && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {submitErr}
        </div>
      )}

      <FormField
        id="username"
        label="이메일"
        error={emailErr}
        touched={touched.email}
      >
        <ValidatedInput
          id="username"
          ref={emailRef}
          type="email"
          placeholder="이메일을 입력하세요."
          autoComplete="username"
          onBlurValidate={(v) => checkEmail(v)}
          clearError={() => setEmailErr(null)}
        />
      </FormField>

      <FormField id="name" label="이름" error={nameErr} touched={touched.name}>
        <ValidatedInput
          id="name"
          ref={nameRef}
          type="text"
          placeholder="이름을 입력하세요."
          autoComplete="name"
          onBlurValidate={(v) => checkName(v)}
          clearError={() => setNameErr(null)}
        />
      </FormField>

      <FormField
        id="password"
        label="비밀번호"
        error={pwErr}
        touched={touched.pw}
      >
        <ValidatedInput
          id="password"
          ref={pwRef}
          type="password"
          placeholder="비밀번호 (8자 이상, 숫자/영문/특수문자 포함)"
          autoComplete="new-password"
          onBlurValidate={(v) => checkPw(v)}
          clearError={() => setPwErr(null)}
        />
      </FormField>

      <FormField
        id="confirmPassword"
        label="비밀번호 확인"
        error={pw2Err}
        touched={touched.pw2}
      >
        <ValidatedInput
          id="confirmPassword"
          ref={pw2Ref}
          type="password"
          placeholder="비밀번호를 한 번 더 입력하세요."
          autoComplete="new-password"
          onBlurValidate={() =>
            checkPw2(pwRef.current?.value || "", pw2Ref.current?.value || "")
          }
          clearError={() => setPw2Err(null)}
        />
      </FormField>

      <div className="flex justify-center">
        <Button type="submit" disabled={loading} className="w-70 mt-4">
          회원가입
        </Button>
      </div>
    </form>
  );
}
