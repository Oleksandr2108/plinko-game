"use client";

import { useState } from "react";

interface LoginData {
  subtitle: string;
  tip?: string;
  btnText: string;
  accaunt: boolean;
  textAccaunt: string;
  error?: string;
  errors?: string[];
  isPending?: boolean;
  onSubmit: (data: { email: string; password: string }) => Promise<void> | void;
}

const getInputClassName = (hasError: boolean) =>
  [
    "bg-(--inputBg) text-(--placeholderColor) text-[14px]",
    "placeholder-(--placeholderColor) border rounded-lg w-full",
    "py-1 px-3 mt-2 focus:outline-none",
    hasError
      ? "border-(--borderError) focus:border-(--colorError)"
      : "border-(--borderColor)",
  ].join(" ");

const getFieldErrors = (messages: string[], field: "email" | "password") =>
  messages.filter((message) => message.toLowerCase().includes(field));

const isFieldErrorMessage = (message: string) => {
  const normalizedMessage = message.toLowerCase();
  return (
    normalizedMessage.includes("email") ||
    normalizedMessage.includes("password")
  );
};

const LoginForm = (props: LoginData) => {
  const [localError, setLocalError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLocalError("");

    const fd = new FormData(e.currentTarget);
    const data = {
      email: fd.get("email") as string,
      password: fd.get("password") as string,
    };

    try {
      await props.onSubmit(data);
    } catch {
      setLocalError("Request failed. Please try again.");
    }
  }

  const errorMessages =
    props.errors ??
    (props.error ? [props.error] : localError ? [localError] : []);
  const genericErrors = errorMessages.filter(
    (message) => !isFieldErrorMessage(message),
  );
  const emailErrors = getFieldErrors(errorMessages, "email");
  const passwordErrors = getFieldErrors(errorMessages, "password");
  const emailMessages = emailErrors.length > 0 ? emailErrors : genericErrors;
  const passwordMessages =
    passwordErrors.length > 0 ? passwordErrors : genericErrors;
  const hasEmailError = emailMessages.length > 0;
  const hasPasswordError = passwordMessages.length > 0;

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
          id="email"
          name="email"
          type="email"
          placeholder="your@email.com"
          required
          aria-invalid={hasEmailError}
          aria-describedby={hasEmailError ? "email-error" : undefined}
          className={getInputClassName(hasEmailError)}
        />
        {hasEmailError ? (
          <p
            id="email-error"
            className="text-[12px] text-(--colorError) mt-1"
          >
            {emailMessages.join(" ")}
          </p>
        ) : null}
        <label
          htmlFor="password"
          className="text-[14px] font-medium text-(--secondaryText) mt-4 block"
        >
          {" "}
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="your password"
          required
          aria-invalid={hasPasswordError}
          aria-describedby={hasPasswordError ? "password-error" : undefined}
          className={getInputClassName(hasPasswordError)}
        />
        {hasPasswordError ? (
          <p
            id="password-error"
            className="text-[12px] text-(--colorError) mt-1"
          >
            {passwordMessages.join(" ")}
          </p>
        ) : null}
        {props.tip ? (
          <p className="text-[12px] text-(--colorSmallText) mt-1">
            {props.tip}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={props.isPending}
          className="bg-(--buttonBg) text-white text-[14px] font-medium rounded-lg w-full py-3 mt-4 cursor-pointer"
          style={{ background: "var(--buttonBg)" }}
        >
          {props.isPending ? "Please wait..." : props.btnText}
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
