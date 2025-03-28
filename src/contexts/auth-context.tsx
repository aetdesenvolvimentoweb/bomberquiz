"use client";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

// Definindo os tipos
interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: "Administrador" | "Colaborador" | "Cliente";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

// Criando o contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para usar o contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}

// Provedor do contexto
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Verificar se o usuário está autenticado ao carregar a página
  useEffect(() => {
    const loadUserFromStorage = () => {
      const token = Cookies.get("auth_token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        try {
          const userData = JSON.parse(storedUser) as User;
          setUser(userData);
        } catch (error) {
          console.error("Erro ao analisar dados do usuário:", error);
          logout();
        }
      }
      setIsLoading(false);
    };

    loadUserFromStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Função para fazer login
  const login = (token: string, userData: User) => {
    // Salvar token em cookie
    Cookies.set("auth_token", token, {
      expires: 7,
      secure: true,
      sameSite: "strict",
    });

    // Salvar dados do usuário no localStorage
    localStorage.setItem("user", JSON.stringify(userData));

    // Atualizar estado
    setUser(userData);
  };

  // Função para fazer logout
  const logout = () => {
    // Remover token e dados do usuário
    Cookies.remove("auth_token");
    localStorage.removeItem("user");

    // Limpar estado
    setUser(null);

    // Redirecionar para a página de login
    router.push("/login");
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
