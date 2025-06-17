'use client';

import { Bars3Icon, ChevronDownIcon, Cog6ToothIcon, HomeIcon, UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import MobileMenu from "./mobile-menu";
import NavLink from "./nav-link";
import NavSearch from "./navbar-search";
import Tooltip from "@/components/shared/tooltip/tooltip";
import SignIn from "./signin";

export default function Navbar({ title }: { title: string }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false); // State to control SignIn visibility

  const { t } = useTranslation('common');
  const router = useRouter();

  const signInLink =
    <li
      className="h-10 relative"
      onClick={() => setShowSignIn((prev) => !prev)}
      tabIndex={0}
      style={{ outline: "none" }}
    >
      <NavLink className="h-10" href="#">
        {t('menu.signIn')}
      </NavLink>
      {showSignIn &&
        <div
          className="absolute left-0 top-full z-50 mt-2"
          style={{ minWidth: "200px" }}
        >
          <SignIn />
        </div>
      }
    </li>;

  const userMenu = <li className="h-10">
    <UserIcon width={22}/> <ChevronDownIcon width={18}/>
  </li>;

  const items = <>
    <li className="h-10">
      <div className="go-to rounded">
        <NavSearch />
      </div>
    </li>
    <li className="h-10">
      <Tooltip content={t('menu.home')}>
        <NavLink className="h-10" href="/pokedex/" isActive={router.pathname === '/pokedex'}>
          <HomeIcon width={22}/>
        </NavLink>
      </Tooltip>
    </li>
    <li className="h-10">
      <Tooltip content={t('menu.settings')}>
        <NavLink className="h-10" href="/settings/" isActive={router.pathname === '/settings'}>
          <Cog6ToothIcon width={22}/>
        </NavLink>
      </Tooltip>
    </li>
    { !isLoggedIn ? signInLink : userMenu}
  </>;




  return (
    <nav className="bg-(--pokedex-red) border-white border-b-2 border-solid">
      <div className="flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          href="/pokedex/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <Image
            priority
            src="/logo.svg"
            width={48}
            height={48}
            alt={title}
            className="inline" />
          <span className="hidden md:inline self-center text-base font-semibold whitespace-nowrap dark:text-white ml-4">
            { title }
          </span>
        </Link>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          type="button"
          className="
            inline-flex
            items-center
            p-2
            w-10
            h-10
            justify-center
            text-sm
            text-white
            rounded-lg
            md:hidden
            focus:outline-none
            focus:ring-2
            focus:ring-white
            focus:bg-(--pokedex-red-dark)
            text-gray-400
            hover:bg-gray-700
          "
          aria-controls="navbar-multi-level"
          aria-expanded={isMenuOpen}
        >
          <span className="sr-only">Open main menu</span>
          <Bars3Icon />
        </button>
        <div className="hidden w-full md:block md:w-auto" >
          <ul className="
            flex
            flex-col
            items-center
            p-4
            mt-4
            border
            border-gray-700
            rounded
            rtl:space-x-reverse
            md:p-0
            md:space-x-4
            md:flex-row
            md:mt-0
            md:border-0
            md:bg-(--pokedex-red)
          ">
            {items}
          </ul>
        </div>
        <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
          {items}
        </MobileMenu>
      </div>
    </nav>
  );
};