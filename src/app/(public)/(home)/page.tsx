import Link from "next/link";

const HomeRoute = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl p-4">Public Home Page</h1>
      <Link href={"/login"}>Página de Login</Link>
      <Link href={"/cadastro"}>Pagina de Cadastro</Link>
    </div>
  );
};

export default HomeRoute;
