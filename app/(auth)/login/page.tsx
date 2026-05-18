"use client";

import LoginForm from "@/features/auth/login/ui/LoginForm";

export default function LoginPage() {
  return (
    <main className="w-full max-w-md">
      <LoginForm
        subtitle="Welcome back!"
        btnText="Sign In"
        accaunt={true}
        textAccaunt="Don't have an account?"
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
