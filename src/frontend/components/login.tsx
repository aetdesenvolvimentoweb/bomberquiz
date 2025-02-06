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
      className="flex items-center justify-center gap-2 p-1 md:px-2 font-semibold bg-green-700 hover:bg-green-800 text-white border-2 border-transparent hover:border-white focus:border-white"
      title="Entrar"
      onClick={handleLogin}
    >
      <FiLogIn className="w-6 h-6" />
      <span className="hidden md:block">Entrar</span>
    </button>
  );
};
