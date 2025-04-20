// components/MobileMenu.tsx
import { useRouter } from "next/router";
import { FormEvent, ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface MobileMenuProps {
  isOpen: boolean;
  children: ReactNode;
  onClose: () => void;
}

export const MobileMenu = ({ children, isOpen }: MobileMenuProps) => {
  return (
    <div
      className={`${isOpen ? "block" : "hidden"} w-full md:hidden`}
      id="navbar-multi-level"
    >
      <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
        { children }
      </ul>
    </div>
  );
};