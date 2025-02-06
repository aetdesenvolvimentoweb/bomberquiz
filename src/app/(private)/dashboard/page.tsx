import { DashboardPage } from "@/frontend/pages/dashboard";

const getUsers = async () => {
  const url =
    process.env.NODE_ENV === "production"
      ? "https://bomberquiz.vercel.app"
      : "http://localhost:3000";
  const response = await fetch(`${url}/api/users`, {
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
