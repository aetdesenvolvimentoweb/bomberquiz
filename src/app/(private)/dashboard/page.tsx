import { DashboardPage } from "@/frontend/pages/dashboard";

const getUsers = async () => {
  const response = await fetch("http://localhost:3000/api/users", {
    method: "GET",
  });
  const users = await response.json();
  return users.body.data;
};

const DashboardRoute = async () => {
  const users = await getUsers();

  return <DashboardPage users={users} />;
};

export default DashboardRoute;
