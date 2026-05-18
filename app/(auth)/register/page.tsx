"use client";

import LoginForm from "@/features/auth/login/ui/LoginForm";

export default function RegisterPage() {
  return (
    <main className="w-full max-w-md">
      <LoginForm
        subtitle="Create an account"
        tip="At least 8 characters with a letter and digit"
        btnText="Create Account"
        accaunt={false}
        textAccaunt="Already have an account?"
        onSubmit={(data: { email: string; password: string }) =>
          console.log(data)
        }
      />
      <p className="text-[14px] text-(--colorSmallText) mt-6 text-center">
        {" "}
        By continuing, you agree to our Terms and Privacy Policy
      </p>
    </main>
  );
}
