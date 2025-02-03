import { LoginButton } from "../components/login";

export const LoginPage = () => {
  return (
    <>
      <h1 className="text-center text-3xl pb-4">Página de login</h1>
      <div className="flex items-center justify-center">
        <LoginButton />
      </div>
    </>
  );
};
