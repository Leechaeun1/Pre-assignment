"use client";

import { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Button from "@/components/common/Button";
import FormField from "@/components/form/FormField";
import ValidatedInput from "@/components/form/ValidatedInput";
import { signin } from "@/lib/api";
import { useLoginValidation } from "@/components/auth/useLoginValidation";

export default function LoginForm() {
  const router = useRouter();
  const q = useSearchParams();
  const next = q.get("next") || "/";

  const emailRef = useRef<HTMLInputElement>(null);
  const pwRef = useRef<HTMLInputElement>(null);

  const {
    emailErr,
    pwErr,
    touched,
    checkEmail,
    checkPw,
    setEmailErr,
    setPwErr,
  } = useLoginValidation();

  const [setSubmitErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const email = emailRef.current?.value.trim() || "";
    const password = pwRef.current?.value || "";

    const okEmail = checkEmail(email);
    const okPw = checkPw(password);
    if (!okEmail || !okPw) return;

    setLoading(true);
    await signin(email, password);
    router.replace(next);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <FormField
        id="email"
        label="이메일"
        error={emailErr}
        touched={touched.email}
      >
        <ValidatedInput
          id="email"
          ref={emailRef}
          type="email"
          placeholder="이메일을 입력하세요."
          autoComplete="username"
          onBlurValidate={(v) => checkEmail(v)}
          clearError={() => setEmailErr(null)}
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
          placeholder="비밀번호를 입력하세요."
          autoComplete="current-password"
          onBlurValidate={(v) => checkPw(v)}
          clearError={() => setPwErr(null)}
        />
      </FormField>

      <div className="flex justify-center">
        <Button type="submit" disabled={loading} className="w-70 mt-4">
          로그인하기
        </Button>
      </div>
    </form>
  );
}
