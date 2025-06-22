'use client';

import { Bars3Icon, HomeIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import MobileMenu from "./mobile-menu";
import NavLink from "./nav-link";
import NavSearch from "./navbar-search";
import Tooltip from "@/components/shared/tooltip/tooltip";
import NavUserAuth from "./nav-user-auth";
import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Navbar({ title }: { title: string }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation('common');
  const pathname = usePathname();

  const items = <>
    <li className="h-10">
      <div className="go-to rounded">
        <NavSearch />
      </div>
    </li>
    <li className="h-10">
      <Tooltip content={t('menu.home')}>
        <NavLink className="h-10" href="/" isActive={pathname === '/'}>
          <HomeIcon width={22}/>
        </NavLink>
      </Tooltip>
    </li>
    <li className="h-10">
      <SessionProvider>
        <NavUserAuth />
      </SessionProvider>
    </li>
  </>;

  return (
    <nav className="bg-(--pokedex-red) border-white border-b-2 border-solid">
      <div className="flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          href="/"
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