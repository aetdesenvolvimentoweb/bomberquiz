"use client";

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
      className="w-full bg-red-500 hover:bg-red-700 text-white py-2 px-6 rounded-md transition-colors duration-150"
      onClick={handleLogout}
    >
      Sair
    </button>
  );
};
