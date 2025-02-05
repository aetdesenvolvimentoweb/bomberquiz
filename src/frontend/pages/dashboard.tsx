import { LogoutButton } from "../components/logout";
import { UserMapped } from "@/backend/domain/entities";

interface DashboardPageProps {
  users: UserMapped[];
}
export const DashboardPage = ({ users }: DashboardPageProps) => {
  return (
    <>
      <h1 className="text-center text-3xl pb-4">BomberQuiz</h1>
      <div className="flex items-center justify-center">
        <LogoutButton />
      </div>
      {users &&
        users.map((user) => (
          <div className="flex flex-col gap-2 p-2" key={user.id}>
            <span>{user.id}</span>
            <span>{user.name}</span>
            <span>{user.email}</span>
            <span>{user.phone}</span>
            <span>{new Date(user.birthdate).toLocaleDateString()}</span>
            <span>{user.role}</span>
            <span>{new Date(user.createdAt!).toLocaleDateString()}</span>
            <span>{new Date(user.updatedAt!).toLocaleDateString()}</span>
          </div>
        ))}
    </>
  );
};
