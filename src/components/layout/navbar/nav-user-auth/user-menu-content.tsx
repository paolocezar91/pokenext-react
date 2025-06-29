import { Cog6ToothIcon, ArrowLeftEndOnRectangleIcon, HomeIcon } from "@heroicons/react/24/solid";
import NavButton from "../nav-button";
import NavLink from "../nav-link";
import GithubIcon from "../github-icon";
import { useTranslation } from "react-i18next";
import { User } from "next-auth";

export interface Session {
  user?: User
  expires: string
}

export default function UserMenuContent({ session, pathname, onSignIn, onSignOut }: {
  session: Session | null;
  pathname: string;
  onSignIn: () => void;
  onSignOut: () => void;
}) {
  const { t } = useTranslation('common');
  return (
    <ul className="w-full">
      {!session ? <>
        <li className="h-10 mb-1">
          <NavButton className="flex justify-between w-full" onClick={onSignIn}>
            {t('menu.signIn')}
            <GithubIcon />
          </NavButton>
        </li>
        <li className="h-10 mb-1">
          <NavLink className="flex justify-between" href="/" isActive={pathname === '/'}>
            <span>{t('menu.home')}</span>
            <HomeIcon width={22}/>
          </NavLink>
        </li>
        <li className="h-10 mb-1">
          <NavLink className="flex justify-between" href="/settings/" isActive={pathname === '/settings'}>
            <span>{t('menu.settings')}</span>
            <Cog6ToothIcon width={22}/>
          </NavLink>
        </li>
      </> : <>
        <li className="flex items-center mb-2 border-b-2 border-white border-solid pb-2">
          <span className="ml-2 text-xs text-white mb-2">
            {session?.user?.name || session?.user?.email}
          </span>
        </li>
        <li className="h-10 mb-1">
          <NavLink className="h-10 flex justify-between" href="/settings/" isActive={pathname === '/settings'}>
            <span>{t('menu.settings')}</span>
            <Cog6ToothIcon width={22}/>
          </NavLink>
        </li>
        <li className="h-10 mb-1">
          <NavButton className="flex justify-between w-full" onClick={onSignOut}>
            <span>{t('menu.signOut')}</span>
            <ArrowLeftEndOnRectangleIcon width={22}/>
          </NavButton>
        </li>
      </>}
    </ul>
  );
}
