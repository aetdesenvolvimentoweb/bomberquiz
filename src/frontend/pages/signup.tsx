import { SignupButton } from "../components/signup";

export const SignupPage = () => {
  return (
    <>
      <h1 className="text-center text-3xl pb-4">Página de cadastro</h1>
      <div className="flex items-center justify-center">
        <SignupButton />
      </div>
    </>
  );
};
