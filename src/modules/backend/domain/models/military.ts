export interface AddMilitary {
  militaryRankId: string;
  rg: number;
  name: string;
  birthday: Date;
  email: string;
  phone: string;
  password: string;
  role: "Administrador" | "Colaborador" | "Cliente";
}

export interface Military extends AddMilitary {
  id: string;
}
