"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import LoginForm from "@/features/auth/login/ui/LoginForm";
import { useLogin } from "@/features/auth/login/model/login";

export default function LoginPage() {
  const router = useRouter();
  const [errors, setErrors] = useState<string[]>([]);
  const loginMutation = useLogin({
    onSuccess: () => {
      router.push("/");
    },
    onError: (messages) => {
      setErrors(messages);
    },
  });

  return (
    <main className="w-full max-w-md">
      <LoginForm
        subtitle="Welcome back!"
        btnText="Sign In"
        accaunt={true}
        textAccaunt="Don't have an account?"
        errors={errors}
        isPending={loginMutation.isPending}
        onSubmit={async (data) => {
          setErrors([]);
          await loginMutation.mutateAsync(data);
        }}
      />
      <p className="text-[14px] text-(--colorSmallText) mt-6 text-center">
        {" "}
        By continuing, you agree to our Terms and Privacy Policy
      </p>
    </main>
  );
}
