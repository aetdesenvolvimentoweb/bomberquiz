"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { loginUser } from "@/actions/auth";
import LoginImg from "@/assets/images/login.png";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Definindo o schema de validação com Zod
const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z
    .string()
    .min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
});

// Tipo derivado do schema
type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Inicializando o formulário com react-hook-form e zod
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (values: LoginFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      // Chamando a server action para fazer login
      const result = await loginUser(values);

      if (result.success) {
        // Redirecionando com base no papel do usuário
        if (
          result.user.role === "administrador" ||
          result.user.role === "colaborador"
        ) {
          router.push("/admin/dashboard");
        } else {
          router.push("/usuario/dashboard");
        }
        router.refresh(); // Importante para atualizar os componentes do servidor
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error("Erro ao processar login:", error);
      setError("Ocorreu um erro inesperado. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden bg-card">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleLogin)}
              className="p-6 md:p-8"
            >
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-lg font-bold">Bem-vindo de volta</h1>
                  <p className="text-balance text-muted-foreground">
                    Faça login para o BomberQuiz
                  </p>
                </div>

                {error && (
                  <div className="p-3 bg-destructive/15 text-destructive rounded-md text-sm">
                    {error}
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          type="email"
                          placeholder="m@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <div className="flex items-center">
                        <FormLabel htmlFor="password">Senha</FormLabel>
                        <a
                          href="#"
                          className="ml-auto text-sm underline-offset-2 hover:underline"
                        >
                          Esqueceu sua senha?
                        </a>
                      </div>
                      <FormControl>
                        <Input id="password" type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-secondary text-secondary-foreground hover:bg-secondary hover:brightness-110 transition-colors duration-150"
                >
                  {isLoading ? "Carregando..." : "Login"}
                </Button>
                <div className="text-center text-sm">
                  Não tem uma conta?{" "}
                  <a href="/cadastro" className="underline underline-offset-4">
                    Cadastre-se
                  </a>
                </div>
              </div>
            </form>
          </Form>
          <div className="relative hidden bg-muted md:block mr-6 rounded-md">
            <Image
              src={LoginImg}
              priority
              alt="BomberQuiz"
              className="absolute inset-0 object-cover dark:brightness-[0.2] dark:grayscale rounded-md"
              fill
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
