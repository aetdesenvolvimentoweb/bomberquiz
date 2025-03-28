"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { apiHost } from "@/utils/api";

// Schema de validação
const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z
    .string()
    .min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
});

type LoginFormData = z.infer<typeof loginSchema>;

// Definindo o schema de validação com Zod
const signupSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  phone: z.string().min(10, { message: "Telefone inválido" }),
  birthdate: z.string().min(10, { message: "Data de nascimento inválida" }),
  password: z
    .string()
    .min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
});

// Tipo derivado do schema
type SignupFormData = z.infer<typeof signupSchema>;

// Interface para os dados do usuário
interface UserData {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: "administrador" | "colaborador" | "cliente";
}

// Tipo para o resultado da ação de login
type LoginResult =
  | { success: true; user: UserData }
  | { success: false; error: string };

// Tipo para o resultado da ação de login
type SignupResult = { success: true } | { success: false; error: string };

/**
 * Server action para autenticar o usuário
 */
export async function loginUser(formData: LoginFormData): Promise<LoginResult> {
  try {
    // Validar os dados do formulário
    const validatedData = loginSchema.parse(formData);

    // Fazer a requisição para a API externa
    const response = await fetch(`${apiHost}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedData),
      // Importante para garantir que a requisição seja feita do lado do servidor
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || "Credenciais inválidas",
      };
    }

    const jsonData = await response.json();
    const accessToken = jsonData.data.accessToken;
    const user = jsonData.data.user;

    // Definir o cookie de autenticação (HttpOnly para segurança)
    const cookiesList = await cookies();
    cookiesList.set({
      name: "auth_token",
      value: accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: "/",
    });

    // Armazenar informações básicas do usuário em um cookie não-HttpOnly
    // para acesso no cliente (apenas dados não sensíveis)
    cookiesList.set({
      name: "user_info",
      value: JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        role: user.role,
      }),
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: "/",
    });

    return {
      success: true,
      user: user as UserData,
    };
  } catch (error) {
    console.error("Erro durante o login:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Dados de formulário inválidos",
      };
    }

    return {
      success: false,
      error:
        "Ocorreu um erro durante a autenticação" + (error as Error).message,
    };
  }
}

/**
 * Server action para cadastrar usuário
 */
export async function signupUser(
  formData: SignupFormData,
): Promise<SignupResult> {
  try {
    // Validar os dados do formulário
    const validatedData = signupSchema.parse(formData);

    // Fazer a requisição para a API externa
    const response = await fetch(`${apiHost}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedData),
      // Importante para garantir que a requisição seja feita do lado do servidor
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || "Erro ao cadastrar usuário",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Erro durante o login:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Dados de formulário inválidos",
      };
    }

    return {
      success: false,
      error:
        "Ocorreu um erro durante o cadastro de usuário" +
        (error as Error).message,
    };
  }
}

/**
 * Server action para fazer logout do usuário
 */
export async function logoutUser() {
  const cookiesList = await cookies();
  // Remover cookies de autenticação
  cookiesList.delete("auth_token");
  cookiesList.delete("user_info");

  // Redirecionar para a página de login
  redirect("/login");
}

/**
 * Server action para verificar se o usuário está autenticado
 */
export async function getCurrentUser(): Promise<UserData | null> {
  const cookiesList = await cookies();
  const userCookie = cookiesList.get("user_info");

  if (!userCookie || !userCookie.value) {
    return null;
  }

  try {
    return JSON.parse(userCookie.value) as UserData;
  } catch (error) {
    console.error("Erro ao analisar dados do usuário:", error);
    return null;
  }
}

/**
 * Server action para verificar se o token é válido
 * Útil para verificações periódicas de autenticação
 */
export async function verifyToken(): Promise<boolean> {
  const cookiesList = await cookies();
  const token = cookiesList.get("auth_token");

  if (!token || !token.value) {
    return false;
  }

  try {
    // Fazer uma requisição para a API para verificar se o token é válido
    const response = await fetch(`${apiHost}/auth/verify"`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
      cache: "no-store",
    });

    return response.ok;
  } catch (error) {
    console.error("Erro ao verificar token:", error);
    return false;
  }
}

export async function getPath(): Promise<string> {
  const headersList = await headers();
  const referer = headersList.get("referer") || "/";

  return referer;
}
