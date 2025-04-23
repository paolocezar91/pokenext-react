'use client';

import { Bars3Icon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { MobileMenu } from "./mobile-menu";
import { NavLink } from "./nav-link";

export default function Navbar({ title }: { title: string }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation('common');
  const router = useRouter();

  const goTo = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const input = event.currentTarget.elements.namedItem('pokemon-search') as HTMLInputElement;
    const idx = input?.value?.toLowerCase()?.trim();
    if(idx) {
      router.push(`/pokedex/${idx}`);
    }
  };
  const items = <>
    <li className="mt-2">
      <NavLink href="/pokedex/" isActive={router.pathname === '/pokedex'}>Home</NavLink>
    </li>
    <li className="mt-2">
      <NavLink href="/settings/" isActive={router.pathname === '/settings'}>Settings</NavLink>
    </li>
    <li className="mt-2">
      <div className="go-to rounded md:mr-4 mr-0">
        <form onSubmit={goTo} data-testid="form-go-to w-inherit">
          <div className="h-10 flex">
            <input
              name="pokemon-search"
              placeholder={t('actions.go.placeholder')}
              type="text"
              className="
                  w-50
                  h-full
                  bg-white
                  text-xs
                  text-black
                  rounded-l
                  px-2
                  py-1
                  placeholder-gray-500
                  border-solid
                  border-r-0
                  border-2
                  border-black
                  hover:border-white
                " />
            <button
              type="submit"
              className="
                  h-full
                  bg-(--pokedex-blue)
                  text-sm
                  text-white
                  rounded-r
                  px-2
                  py-1
                  border-l-2
                  border-solid
                  border-2
                  border-black
                  hover:bg-gray-700
                  hover:border-white
                "
            >
              { t("actions.go.button") }!
            </button>
          </div>
        </form>
      </div>
    </li>
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
        <div className="hidden w-full md:block md:w-auto">
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
            md:space-x-8
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