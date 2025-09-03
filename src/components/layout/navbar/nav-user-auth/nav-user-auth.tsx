import { useClickOutside } from "@/components/shared/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
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
  useClickOutside(menuRef, () => setMenuOpen(false));

  if (status === "loading") {
    return <UserAvatarButton image={undefined} onClick={() => {}} onMouseEnter={() => {}} />;
  }

  return (
    <div className="relative" ref={menuRef}>
      <UserAvatarButton
        image={session?.user?.image ?? ''}
        onClick={() => setMenuOpen((open) => !open)}
        onMouseEnter={() => setMenuOpen(true)}
      />
      <AnimatePresence>
        {menuOpen && <motion.div
          initial={{ opacity: 0, top: '1.5rem' }}
          animate={{ opacity: 1, top: '2rem' }}
          exit={{ opacity: 0, top: '1.5rem' }}
          transition={{ duration: 0.3 }}
          style={{
            width: '100%',
            zIndex: 2,
            height: '100%',
            right: '696%',
            position: 'absolute'
          }}
        >
          <UserMenu open={menuOpen} onClose={() => setMenuOpen(false)}>
            <UserMenuContent
              session={session}
              pathname={pathname}
              onSignIn={signInWithGithub}
              onSignOut={handleSignOut}
            />
          </UserMenu>
        </motion.div>}
      </AnimatePresence>
    </div>
  );
}
