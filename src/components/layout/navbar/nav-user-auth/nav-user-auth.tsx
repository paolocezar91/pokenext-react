import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { handleSignOut, signInWithGithub } from "./auth-actions";
import UserAvatarButton from "./user-avatar-button";
import UserMenu from "./user-menu";
import UserMenuContent from "./user-menu-content";

export default function NavUserAuth() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname() || '';

  // Close the menu if clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  if (status === "loading") {
    return <UserAvatarButton image={undefined} onClick={() => {}} onMouseEnter={() => {}} />;
  }

  return (
    <div className="relative" ref={menuRef}>
      <UserAvatarButton
        image={session?.user?.image}
        onClick={() => setMenuOpen((open) => !open)}
        onMouseEnter={() => setMenuOpen(true)}
      />
      <UserMenu open={menuOpen} onClose={() => setMenuOpen(false)}>
        <UserMenuContent
          session={session}
          pathname={pathname}
          onSignIn={signInWithGithub}
          onSignOut={handleSignOut}
        />
      </UserMenu>
    </div>
  );
}
