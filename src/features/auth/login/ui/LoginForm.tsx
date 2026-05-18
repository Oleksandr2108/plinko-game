"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { login } from "../model/login";

interface LoginData {
  subtitle: string;
  tip?: string;
  btnText: string;
  accaunt: boolean;
  textAccaunt: string;
  onSubmit?: (data: { email: string; password: string }) => void;
}

const LoginForm = (props: LoginData) => {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      email: fd.get("email") as string,
      password: fd.get("password") as string,
    };
    try {
      if (props.onSubmit) {
        props.onSubmit(data);
      } else {
        await login(data);
        router.push("/");
      }
    } catch {
      setError("Invalid credentials");
    }
  }

  return (
    <div className="w-full  m-auto bg-(--foreground) border border-(--borderColor) rounded-2xl p-8">
      <div
        className="m-auto w-16 h-16 rounded-full flex items-center justify-center"
        style={{ background: "var(--buttonBg)" }}
      >
        <div className="w-7.5 h-7.5 rounded-full  border-[2.66667px] border-white flex items-center justify-center ">
          <div className="w-2 h-2 bg-white rounded-full "></div>
        </div>
      </div>

      <h1 className="text-[30px] font-bold text-center mt-4">Plinko </h1>
      <p className="text-[16px] text-(--text) font-normal text-center mt-2">
        {props.subtitle}
      </p>
      <form
        className="mt-8"
        onSubmit={handleSubmit}
      >
        <label
          htmlFor="email"
          className="text-[14px] font-medium text-(--secondaryText)"
        >
          {" "}
          Email
        </label>
        <input
          name="email"
          type="email"
          placeholder="your@email.com"
          required
          className="bg-(--inputBg) text-(--placeholderColor) text-[14px] placeholder-(--placeholderColor) border border-(--borderColor) rounded-lg w-full py-1 px-3 mt-2 focus:outline-none "
        />
        <label
          htmlFor="password"
          className="text-[14px] font-medium text-(--secondaryText) mt-4 block"
        >
          {" "}
          Password
        </label>
        <input
          name="password"
          type="password"
          placeholder="your password"
          required
          className="bg-(--inputBg) text-(--placeholderColor) text-[14px] placeholder-(--placeholderColor) border border-(--borderColor) rounded-lg w-full py-1 px-3 mt-2 focus:outline-none "
        />
        {props.tip ? (
          <p className="text-[12px] text-(--colorSmallText) mt-1">
            {props.tip}
          </p>
        ) : null}

        <button
          type="submit"
          className="bg-(--buttonBg) text-white text-[14px] font-medium rounded-lg w-full py-3 mt-4 cursor-pointer"
          style={{ background: "var(--buttonBg)" }}
        >
          {props.btnText}
        </button>
      </form>
      <span className="text-[14px] text-(--secondaryText) mt-4 block text-center">
        {props.textAccaunt}{" "}
        <a
          href={props.accaunt ? "/register" : "/login"}
          className="text-(--colorAccess) hover:underline cursor-pointer"
        >
          {props.accaunt ? "Sign Up" : "Sign In"}
        </a>
      </span>
    </div>
  );
};

export default LoginForm;
