// components/Navbar.tsx
import Tooltip from "@/components/shared/tooltip/tooltip";
import { Bars3Icon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { MobileMenu } from "./mobile-menu";
import { NavLink } from "./nav-link";

export default function PokeNavbar({title}: {title: string}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { t } = useTranslation('common');


  const goTo = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const input = form.elements.namedItem('pokemon-search') as HTMLInputElement;
    const idx = input?.value?.toLowerCase()?.trim();
    if(idx) {
      router.push(`/pokedex/${idx}`);
    }
  };
  const items = <>
    <li>
      <NavLink href="/pokedex/" isActive={router.pathname === '/pokedex'}>Home</NavLink>
    </li>
    <li>
      <NavLink href="/settings/" isActive={router.pathname === '/settings'}>Settings</NavLink>
    </li>
    <li>
      <div className="go-to border-solid border-2 border-black bg-white rounded mr-4">
        <Tooltip position="bottom" content={t('actions.go.tooltip')}>
          <form onSubmit={goTo} data-testid="form-go-to">
            <input name="pokemon-search" placeholder={t('actions.go.placeholder')} type="text" className="w-30 ml-2 py-1 text-black bg-white placeholder-gray-500 text-xs" />
            <button type="submit" className="px-2 text-sm text-white bg-(--pokedex-blue) hover:bg-(--pokedex-blue-dark) py-1 border-l-2 border-solid border-black">{ t("actions.go.button") }!</button>
          </form>
        </Tooltip>
      </div>
    </li>
  </>;

  return (
    <nav className="bg-(--pokedex-red) dark:border-gray-700">
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
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-multi-level"
          aria-expanded={isMenuOpen}
        >
          <span className="sr-only">Open main menu</span>
          <Bars3Icon />
        </button>
        <div className="hidden w-full md:block md:w-auto">
          <ul className="flex flex-col items-center font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-(--pokedex-red) md dark:border-gray-700">
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