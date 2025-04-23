// components/MobileMenu.tsx
import { ReactNode } from "react";

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
      <ul className="
        flex
        flex-col
        p-4
        mt-2
        rounded
        bg-background
      ">
        { children }
      </ul>
    </div>
  );
};