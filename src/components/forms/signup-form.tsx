"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { signupUser } from "@/actions/auth";
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
const signupSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
    email: z.string().email({ message: "Email inválido" }),
    phone: z.string().min(10, { message: "Telefone inválido" }),
    birthdate: z.string().min(10, { message: "Data de nascimento inválida" }),
    password: z
      .string()
      .min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
    passwordConfirmation: z
      .string()
      .min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "As senhas não coincidem",
    path: ["passwordConfirmation"],
  });

// Tipo derivado do schema
type SignupFormValues = z.infer<typeof signupSchema>;

export const SignupForm = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Inicializando o formulário com react-hook-form e zod
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      birthdate: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const handleSignup = async (values: SignupFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      // Chamando a server action para fazer login
      const userCreateData = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        birthdate: values.birthdate,
        password: values.password,
      };
      const result = await signupUser(userCreateData);

      if (result.success) {
        // Redirecionando com base no papel do usuário
        router.push("/login");
        router.refresh(); // Importante para atualizar os componentes do servidor
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error("Erro ao processar o cadastro:", error);
      setError("Ocorreu um erro inesperado. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col", className)} {...props}>
      <Card className="overflow-hidden bg-card">
        <CardContent className="p-0">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSignup)}
              className="p-6 md:p-8 w-full"
            >
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-lg font-bold">Cadastro de Usuário</h1>
                  <p className="text-balance text-muted-foreground">
                    Venha fazer parte do BomberQuiz!
                  </p>
                </div>

                {error && (
                  <div className="p-3 bg-destructive/15 text-destructive rounded-md text-sm">
                    {error}
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="name">Nome</FormLabel>
                      <FormControl>
                        <Input
                          id="name"
                          type="text"
                          placeholder="nome completo"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="phone">Telefone</FormLabel>
                      <FormControl>
                        <Input
                          id="phone"
                          type="phone"
                          placeholder="(62) 99999-9999"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="birthdate"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="birthdate">
                        Data de Nascimento
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="birthdate"
                          type="date"
                          placeholder="01/01/1990"
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
                      </div>
                      <FormControl>
                        <Input id="password" type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="passwordConfirmation"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="passwordConfirmation">
                        Confirme sua senha
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="passwordConfirmation"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
                  Ao clicar em continuar, você concorda com nossos{" "}
                  <Link href="#">Termos de Serviço</Link> e{" "}
                  <Link href="#">Política de Privacidade</Link>.
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-secondary text-secondary-foreground hover:bg-secondary hover:brightness-110 transition-colors duration-150"
                >
                  {isLoading ? "Carregando..." : "Continuar"}
                </Button>
                <div className="text-center text-sm">
                  Já é cadastrado?{" "}
                  <a href="/login" className="underline underline-offset-4">
                    Faça login
                  </a>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
