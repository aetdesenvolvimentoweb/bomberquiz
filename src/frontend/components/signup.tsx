"use client";

import { FiUserPlus } from "react-icons/fi";
import { UserProps } from "@/backend/domain/entities";
import { useRouter } from "next/navigation";

export const SignupButton = () => {
  const router = useRouter();

  const handleSignup = async () => {
    const response = await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify({
        name: "André David dos Santos",
        email: "andredavid1@gmail.com",
        phone: "+5562999980175",
        birthdate: new Date("1979-12-04"),
        role: "cliente",
        password: "12345678",
      } as UserProps),
    });

    if (response.ok) {
      const message = await response.json();
      console.log(message);
      if (!message.body.error) {
        router.push("/login");
        router.refresh();
      }
      //toastify de erro
    }
  };

  return (
    <button
      className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 focus:bg-blue-500 font-semibold text-white py-2 px-3"
      title="Cadastrar"
      onClick={handleSignup}
    >
      <FiUserPlus className="w-6 h-6" />
      <span className="hidden md:block">Cadastrar</span>
    </button>
  );
};
