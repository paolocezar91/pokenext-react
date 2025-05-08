// components/NavLink.tsx
import Link from "next/link";
import { ReactNode } from "react";

interface NavLinkProps {
  href: string;
  children: ReactNode;
  isActive?: boolean;
  className?: string;
}

export default function NavLink({
  href,
  children,
  isActive = false,
  className = "",
}: NavLinkProps) {
  const baseClasses =
    "block px-3 py-2 text-sm rounded hover:shadow-md hover:bg-(--pokedex-red-dark)";

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