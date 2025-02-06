import { LoginButton } from "../components/login";
import { SignupButton } from "../components/signup";

export const LoginPage = () => {
  return (
    <>
      <h1 className="text-center text-3xl p-4">Página de login</h1>
      <div className="flex flex-col items-center justify-center gap-4">
        <SignupButton />
        <LoginButton />
      </div>
    </>
  );
};
