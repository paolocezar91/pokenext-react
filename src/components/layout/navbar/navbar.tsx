import Tooltip from "@/components/shared/tooltip/tooltip";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import MenuMd from "./menu-md";
import MenuXs from "./menu-xs";
import NavLink from "./nav-link";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Navbar({ title }: { title: string }) {
  const { t } = useTranslation('common');
  const pathname = usePathname() || '';
  const homeButton = pathname !== '/' && <Tooltip content={t('actions.backToList')}>
    <NavLink href="/">
      <ArrowUturnLeftIcon className="w-6" />
    </NavLink>
  </Tooltip>;

  return (
    <nav className="bg-(--pokedex-red) border-white border-b-2 border-solid">
      <div className="flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <Image
            priority
            src="/logo.svg"
            width={48}
            height={48}
            alt={title}
            className="inline" />
          <span className="hidden md:inline self-center text-base font-semibold whitespace-nowrap dark:text-white">
            { title }
          </span>
        </Link>
        <MenuMd>
          {homeButton}
        </MenuMd>
        <MenuXs>
          {homeButton}
        </MenuXs>
      </div>
    </nav>
  );
};