"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import LoginForm from "@/features/auth/login/ui/LoginForm";
import { useRegister } from "@/features/auth/register/model/register";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const registerMutation = useRegister({
    onSuccess: () => {
      router.push("/");
    },
    onError: (messages) => {
      setError(messages.join(" "));
    },
  });

  return (
    <main className="w-full max-w-md">
      <LoginForm
        subtitle="Create an account"
        tip="At least 8 characters with a letter and digit"
        btnText="Create Account"
        accaunt={false}
        textAccaunt="Already have an account?"
        error={error}
        isPending={registerMutation.isPending}
        onSubmit={async (data) => {
          setError("");
          await registerMutation.mutateAsync(data);
        }}
      />
      <p className="text-[14px] text-(--colorSmallText) mt-6 text-center">
        {" "}
        By continuing, you agree to our Terms and Privacy Policy
      </p>
    </main>
  );
}
