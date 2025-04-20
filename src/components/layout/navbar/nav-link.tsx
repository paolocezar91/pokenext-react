// components/NavLink.tsx
import Link from "next/link";
import { ReactNode } from "react";

interface NavLinkProps {
  href: string;
  children: ReactNode;
  isActive?: boolean;
  isDropdown?: boolean;
  className?: string;
}

export const NavLink = ({
  href,
  children,
  isActive = false,
  isDropdown = false,
  className = "",
}: NavLinkProps) => {
  const baseClasses =
    "block py-2 px-3 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:p-0 text-white text-sm";

  const activeClasses = isActive
    ? "text-white bg-blue-700 md:bg-transparent"
    : "text-gray-900 dark:text-white";

  const dropdownClasses = isDropdown
    ? "flex items-center justify-between w-full"
    : "";

  return (
    <Link
      href={href}
      className={`${baseClasses} ${activeClasses} ${dropdownClasses} ${className}`}
    >
      {children}
    </Link>
  );
};