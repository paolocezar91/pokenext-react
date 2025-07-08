import { ReactNode } from "react";

export default function UserMenu({ open, onClose, children }: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  return open ?
    <div
      onMouseLeave={onClose}
      className="absolute
        w-80
        border-2
        border-white
        border-solid
        right-0
        mt-2
        bg-(--pokedex-red)
        text-white
        rounded
        shadow-lg
        z-10
        p-0
        flex
        flex-col
        items-start"
    >
      {children}
    </div>
    : null;
}
