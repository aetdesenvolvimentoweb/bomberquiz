import Image from "next/image";
import Link from "next/link";
import brandImage from "@/frontend/assets/images/bomberquiz.jpg";

export const Brand = () => {
  return (
    <Link className="focus:outline-none m-0 p-0" href={"/"}>
      <Image
        className="rounded-md"
        src={brandImage}
        width={96}
        height={96}
        alt="logo"
      />
    </Link>
  );
};
