"use client";

import { FiLogOut } from "react-icons/fi";
import { useRouter } from "next/navigation";

export const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      const errorMessage = await response.json();
      console.log(errorMessage);
    }

    router.push("/login");
    router.refresh();
  };

  return (
    <button
      className="flex items-center justify-center gap-2 min-w-8 min-h-8 bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-3 rounded-md text-lg md:text-base"
      title="Sair"
      onClick={handleLogout}
    >
      <FiLogOut className="w-6 h-6" />
      <span className="hidden md:block">Sair</span>
    </button>
  );
};
