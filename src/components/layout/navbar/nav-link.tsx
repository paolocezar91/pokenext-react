import Link from "next/link";
import { ReactNode } from "react";

export default function NavLink({
  href,
  children,
  isActive = false,
  className = "",
}: {
  href: string;
  children: ReactNode;
  isActive?: boolean;
  className?: string;
}) {
  const baseClasses = `
    flex
    px-2
    py-2
    text-sm
    rounded
    transition-colors
    hover:shadow-md
    hover:bg-(--pokedex-red-dark)
    active:bg-white
    active:text-(--pokedex-red-dark)`;

  const activeClasses = isActive
    ? "bg-(--pokedex-red-darker) text-white border-transparent"
    : "bg-transparent";

  return (
    <Link
      href={href}
      className={`${baseClasses} ${activeClasses} ${className}`}
    >
      {children}
    </Link>
  );
};