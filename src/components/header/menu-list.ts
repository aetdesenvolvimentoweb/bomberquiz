export const menuList = (
  userRole: "administrador" | "colaborador" | "cliente",
) => {
  if (userRole === "cliente") {
    return [
      {
        label: "Dashboard",
        href: "/usuario/dashboard",
      },
      {
        label: "Quiz",
        href: "/usuario/quiz",
      },
    ];
  }

  if (userRole === "colaborador") {
    return [
      {
        label: "Dashboard",
        href: "/usuario/dashboard",
      },
      {
        label: "Perguntas",
        href: "/admin/perguntas",
      },
      {
        label: "Quiz",
        href: "/usuario/quiz",
      },
    ];
  }

  if (userRole === "administrador") {
    return [
      {
        label: "Dashboard",
        href: "/usuario/dashboard",
      },
      {
        label: "Perguntas",
        href: "/admin/perguntas",
      },
      {
        label: "Relatórios",
        href: "/admin/relatorios",
      },
      {
        label: "Quiz",
        href: "/usuario/quiz",
      },
    ];
  }
};
