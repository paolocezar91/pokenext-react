import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { handleSignOut, signInWithGithub } from "./auth-actions";
import UserAvatarButton from "./user-avatar-button";
import UserMenu from "./user-menu";
import UserMenuContent from "./user-menu-content";
import { AnimatePresence, motion } from "framer-motion";

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
      <AnimatePresence>
        <UserMenu open={menuOpen} onClose={() => setMenuOpen(false)}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ width: '100%' }}
          >
            <UserMenuContent
              session={session}
              pathname={pathname}
              onSignIn={signInWithGithub}
              onSignOut={handleSignOut}
            />
          </motion.div>
        </UserMenu>
      </AnimatePresence>
    </div>
  );
}
