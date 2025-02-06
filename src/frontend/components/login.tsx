"use client";

import { FiLogIn } from "react-icons/fi";
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
      className="flex items-center justify-center gap-2 min-w-8 min-h-8 bg-green-300 hover:bg-green-200 font-semibold py-2 px-3 rounded-md text-lg md:text-base"
      title="Entrar"
      onClick={handleLogin}
    >
      <FiLogIn className="w-6 h-6" />
      <span className="hidden md:block">Entrar</span>
    </button>
  );
};
