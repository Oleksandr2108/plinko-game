"use client";

import { useRouter } from "next/navigation";
import { logout } from "../model/logout";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return <button onClick={handleLogout}>Logout</button>;
}
