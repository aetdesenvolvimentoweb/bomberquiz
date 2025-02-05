"use client";

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
      className="w-fit bg-green-500 hover:bg-green-700 text-white py-2 px-6 rounded-md transition-colors duration-150"
      onClick={handleSignup}
    >
      Cadastrar
    </button>
  );
};
