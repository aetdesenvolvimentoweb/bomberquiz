import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get("auth_token");
  const userInfo = request.cookies.get("user_info");
  const path = request.nextUrl.pathname;

  // Rotas públicas que não precisam de autenticação
  if (path === "/login" || path === "/cadastro" || path === "/") {
    // Se o usuário já estiver autenticado, redirecionar para o dashboard
    if (authToken && userInfo) {
      try {
        return NextResponse.redirect(
          new URL("/usuario/dashboard", request.url),
        );
      } catch (error) {
        // Se houver erro ao analisar os dados do usuário, continuar normalmente
        console.error("Erro ao analisar dados do usuário:", error);
      }
    }
    return NextResponse.next();
  }

  // Verificar autenticação para rotas protegidas
  if (!authToken || !userInfo) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // Verificar permissões baseadas no papel do usuário
    const user = JSON.parse(userInfo.value);
    const { role } = user;

    // Verificar acesso a rotas administrativas
    if (
      path.startsWith("/admin") &&
      role !== "Administrador" &&
      role !== "Colaborador"
    ) {
      return NextResponse.redirect(new URL("/usuario/dashboard", request.url));
    }

    // Verificar acesso a rotas específicas de administrador
    if (path.startsWith("/admin/relatorios") && role !== "Administrador") {
      return NextResponse.redirect(new URL("/admin/perguntas", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    // Se houver erro ao analisar os dados do usuário, redirecionar para login
    console.error("Erro ao analisar dados do usuário:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    // Aplicar middleware a todas as rotas exceto recursos estáticos
    "/((?!_next/static|_next/image|favicon.ico|images).*)",
  ],
};
