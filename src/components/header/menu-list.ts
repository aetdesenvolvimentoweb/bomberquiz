export const menuList = (
  userRole: "Administrador" | "Colaborador" | "Cliente",
) => {
  if (userRole === "Cliente") {
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

  if (userRole === "Colaborador") {
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

  if (userRole === "Administrador") {
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
