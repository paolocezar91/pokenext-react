import Image from "next/image";
import Link from "next/link";
import MenuMd from "./menu-md";
import MenuXs from "./menu-xs";

export default function Navbar({ title }: { title: string }) {
  return (
    <nav className="bg-(--pokedex-red) border-white border-b-2 border-solid">
      <div className="flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <Image
            priority
            src="/logo.svg"
            width={48}
            height={48}
            alt={title}
            className="inline" />
          <span className="hidden md:inline self-center text-base font-semibold whitespace-nowrap dark:text-white ml-4">
            { title }
          </span>
        </Link>
        <MenuMd />
        <MenuXs />
      </div>
    </nav>
  );
};