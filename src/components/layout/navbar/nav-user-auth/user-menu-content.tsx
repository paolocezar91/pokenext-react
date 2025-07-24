import { Cog6ToothIcon, ArrowLeftEndOnRectangleIcon, HomeIcon } from "@heroicons/react/24/solid";
import NavButton from "../nav-button";
import NavLink from "../nav-link";
import GithubIcon from "../github-icon";
import { useTranslation } from "react-i18next";
import { User } from "next-auth";
import Tooltip from "@/components/shared/tooltip/tooltip";

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

  const signInButton = <NavButton className="flex justify-between w-full" onClick={onSignIn}>
    {t('menu.signIn')}
    <GithubIcon />
  </NavButton>;

  const settingsButton = <NavLink className="flex justify-between" href="/settings/" isActive={pathname === '/settings'}>
    <Cog6ToothIcon width={22}/>
  </NavLink>;

  const signOutButton = <NavButton className="flex justify-between w-full" onClick={onSignOut}>
    <span>{t('menu.signOut')}</span>
    <ArrowLeftEndOnRectangleIcon width={22}/>
  </NavButton>;

  const userNameOrEmail = <span className="ml-2 text-sm text-white mb-2 font-bold">
    {session ? session?.user?.name || session?.user?.email: 'Guest'}
  </span>;

  return (
    <ul className="w-full">
      <li className="flex justify-between items-center mb-2 border-b-2 border-white border-solid px-2 py-4">
        <span className="text-xs">{userNameOrEmail}</span>
        <Tooltip content={t('menu.settings')}>
          {settingsButton}
        </Tooltip>
      </li>
      <li className="h-10 m-1">
        {session ? signOutButton : signInButton}
      </li>
    </ul>
  );
}
