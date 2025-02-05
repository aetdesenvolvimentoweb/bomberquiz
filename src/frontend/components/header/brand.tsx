import { FaBomb } from "react-icons/fa";
import Link from "next/link";

export const Brand = () => {
  return (
    <Link href={"/"}>
      <div className="flex items-center gap-1">
        <div>
          {/* aqui vai uma image logo */}
          <FaBomb className="w-6 h-6" />
        </div>
        <div className="flex items-center gap-[1.5px]">
          <h2 className="text-xl font-semibold uppercase">Bomber</h2>
          <h2 className="font-semibold bg-gray-900 text-white py-0.5 px-2 rounded-lg">
            Quiz
          </h2>
        </div>
      </div>
    </Link>
  );
};
