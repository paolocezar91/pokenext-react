import { ReactNode } from "react";
import { Button } from "react-bootstrap";

export default function NavButton({
  onClick,
  onMouseEnter,
  children,
  isActive = false,
  className = "",
}: {
  onClick?: () => void;
  onMouseEnter?: () => void;
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
    cursor-pointer
    transition-colors
    hover:shadow-md
    hover:bg-(--pokedex-red-dark)
    active:bg-white
    active:text-(--pokedex-red-dark)
  `;

  const activeClasses = isActive
    ? "bg-(--pokedex-red-darker) text-white border-transparent"
    : "bg-transparent";

  return (
    <Button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={`${baseClasses} ${activeClasses} ${className}`}
    >
      {children}
    </Button>
  );
}
