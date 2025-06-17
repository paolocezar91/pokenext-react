import { signIn, signOut, useSession } from "next-auth/react";
import React, { useState, useRef, useEffect } from "react";
import { ArrowLeftEndOnRectangleIcon, Cog6ToothIcon, UserIcon } from "@heroicons/react/24/solid";
import NavLink from "./nav-link";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { Image } from "react-bootstrap";
import NavButton from "./nav-button";

export default function NavUserAuth() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation('common');
  const router = useRouter();

  const signInWithGithub = async () => {
    await signIn("github");
  };

  const handleSignOut = async () => {
    await signOut();
  };

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

  const signInButton =
    <NavButton
      onClick={signInWithGithub}
    >
      <ArrowLeftEndOnRectangleIcon width={22}/>
      <span className="ml-2">
        {t('menu.signInWithGithub')}
      </span>
    </NavButton>
  ;

  const authMenu =
    <div className="relative" ref={menuRef}>
      <NavButton
        onClick={() => setMenuOpen((open) => !open)}
        onMouseEnter={() => setMenuOpen(true)}
        aria-label="User menu"
      >
        <UserIcon className="h-6 w-6 text-white" />
      </NavButton>
      {menuOpen &&
        <div
          onMouseLeave={() => setMenuOpen(false)}
          className="absolute
            w-50
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
            p-4
            flex
            flex-col
            items-start"
        >
          <ul>
            <li className="flex items-center mb-2 border-b-2 border-white border-solid pb-2">
              {session?.user?.image &&
              <Image
                src={session.user.image}
                alt="User avatar"
                className="w-12 h-12 rounded-full border-2 border-gray-300 mb-2 object-cover"
              />
              }
              <span className="ml-2 text-xs text-white mb-2">
                {session?.user?.name || session?.user?.email}
              </span>
            </li>
            <li className="h-10">
              <NavLink className="h-10 flex justify-between" href="/settings/" isActive={router.pathname === '/settings'}>
                <span>{t('menu.settings')}</span>
                <Cog6ToothIcon width={22}/>
              </NavLink>
            </li>
            <li
              className="h-10"
            >
              <NavButton className="flex justify-between w-full" onClick={handleSignOut}>
                <span>{t('menu.signOut')}</span>
                <ArrowLeftEndOnRectangleIcon width={22}/>
              </NavButton>
            </li>
          </ul>
        </div>
      }
    </div>
  ;

  if (status === "loading") {
    return null; // or a loading spinner
  }

  return session ? authMenu : signInButton;
}
