import "@/frontend/styles/globals.css";
import Link from "next/link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-gray-700 text-white p-10 rounded-lg">
      <div className="pb-10">
        <ul className="list-none flex gap-5 bg-gray-800 p-2 rounded-md">
          <li>
            <Link
              className="hover:bg-gray-600 p-2 rounded-md transition-colors duration-150"
              href={"/"}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              className="hover:bg-gray-600 p-2 rounded-md transition-colors duration-150"
              href={"/dashboard"}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              className="hover:bg-gray-600 p-2 rounded-md transition-colors duration-150"
              href={"/login"}
            >
              Login
            </Link>
          </li>
          <li>
            <Link
              className="hover:bg-gray-600 p-2 rounded-md transition-colors duration-150"
              href={"/cadastro"}
            >
              Cadastro
            </Link>
          </li>
        </ul>
      </div>
      {children}
    </div>
  );
}
