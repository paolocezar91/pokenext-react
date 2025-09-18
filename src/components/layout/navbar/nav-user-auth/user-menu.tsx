import { ReactNode } from "react";
import "./user-menu.scss";

export default function UserMenu({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  return open ?
    <div
      onMouseLeave={onClose}
      className="
        user-menu
        w-80
        border-2
        border-white
        border-solid
        mt-2
        bg-black
        text-white
        rounded
        shadow-lg
        p-0
        flex
        flex-col
        items-start"
    >
      {children}
    </div>
    : null;
}
