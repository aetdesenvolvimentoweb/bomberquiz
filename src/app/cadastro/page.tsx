import { SignupForm } from "@/components/forms/signup-form";

const SignupPage = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-md md:max-w-3xl">
        <SignupForm />
      </div>
    </div>
  );
};

export default SignupPage;
