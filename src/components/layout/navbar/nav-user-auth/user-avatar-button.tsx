import { UserIcon } from "@heroicons/react/24/solid";
import { Button, Image } from "react-bootstrap";
import NavButton from "../nav-button";

export default function UserAvatarButton({
  image,
  onClick,
  onMouseEnter,
}: {
  image?: string;
  onClick: () => void;
  onMouseEnter: () => void;
}) {
  return image ?
    <Button onClick={onClick} onMouseEnter={onMouseEnter}>
      <Image
        src={image}
        alt="User avatar"
        className="w-10 h-10 rounded-full border-2 border-gray-300 object-cover opacity-90 hover:opacity-100"
      />
    </Button>
    :
    <NavButton
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      aria-label="User menu"
    >
      <UserIcon className="h-6 w-6 text-white" />
    </NavButton>
  ;
}
