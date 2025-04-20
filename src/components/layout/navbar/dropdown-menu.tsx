// components/DropdownMenu.tsx
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { ReactNode, useState } from "react";

interface DropdownMenuProps {
  title: string;
  children: ReactNode;
}

export const DropdownMenu = ({ title, children }: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-2 px-3 text-white hover:text-(--pokedex-red-light) md:p-0 md:w-auto"
      >
        {title}
        <ChevronDownIcon className="w-6" />
      </button>
      <div
        className={`z-10 ${
          isOpen ? "block" : "hidden"
        } font-normal divide-y divide-gray-100 rounded-lg shadow-sm absolute md:mt-0 mt-2 bg-(--pokedex-red) dark:divide-gray-600`}
      >
        {children}
      </div>
    </li>
  );
};

interface DropdownItemProps {
  href?: string;
  children: ReactNode;
}

export const DropdownItem = ({ href, children }: DropdownItemProps) => {
  return (
    href ?
      <Link
        href={href}
        className="block px-4 py-2 text-sm text-white"
      >
        {children}
      </Link> :
      <div
        className="block px-4 py-2 text-sm text-white"
      >
        {children}
      </div>
  );
};