"use client";

import { LoginProps } from "@/backend/domain/entities";
import { useRouter } from "next/navigation";

export const LoginButton = () => {
  const router = useRouter();

  const handleLogin = async () => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "andredavid1@gmail.com",
        password: "12345678",
      } as LoginProps),
    });

    if (response.ok) {
      router.push("/dashboard");
      router.refresh();
    }

    const errorMessage = await response.json();
    console.log(errorMessage);
  };

  return (
    <button
      className="w-full bg-blue-500 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition-colors duration-150"
      onClick={handleLogin}
    >
      Entrar
    </button>
  );
};
