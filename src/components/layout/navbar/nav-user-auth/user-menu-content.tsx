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

  const signInButton = <NavButton className="flex justify-between w-full" onClick={onSignIn}>
    {t('menu.signIn')}
    <GithubIcon />
  </NavButton>;

  const settingsButton = <NavLink className="flex justify-between" href="/settings/" isActive={pathname === '/settings'}>
    <span>{t('menu.settings')}</span>
    <Cog6ToothIcon width={22}/>
  </NavLink>;

  const signOutButton = <NavButton className="flex justify-between w-full" onClick={onSignOut}>
    <span>{t('menu.signOut')}</span>
    <ArrowLeftEndOnRectangleIcon width={22}/>
  </NavButton>;

  const userNameOrEmail = <span className="ml-2 text-sm text-white mb-2">
    {session?.user?.name || session?.user?.email}
  </span>;

  return (
    <ul className="w-full">
      {!session ? <>
        <li className="h-10">
          {signInButton}
        </li>
        <li className="h-10">
          {settingsButton}
        </li>
      </> : <>
        <li className="flex items-center mb-2 border-b-2 border-white border-solid px-2 py-4">
          {userNameOrEmail}
        </li>
        <li className="h-10">
          {settingsButton}
        </li>
        <li className="h-10">
          {signOutButton}
        </li>
      </>}
    </ul>
  );
}
