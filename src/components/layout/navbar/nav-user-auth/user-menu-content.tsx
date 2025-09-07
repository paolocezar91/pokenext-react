import { ArrowLeftEndOnRectangleIcon, Cog6ToothIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/solid";
import { User } from "next-auth";
import { useTranslations } from "next-intl";
import GithubIcon from "../github-icon";
import NavButton from "../nav-button";
import NavLink from "../nav-link";

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
  const t = useTranslations();

  const signInButton = <NavButton className="flex justify-between w-full" onClick={onSignIn}>
    {t('menu.signIn')}
    <GithubIcon />
  </NavButton>;

  const aboutButton = <NavLink className="flex justify-between w-full" href="/about/" isActive={pathname === '/about'}>
    <span>{t('menu.about')}</span>
    <QuestionMarkCircleIcon width={22}/>
  </NavLink>;

  const settingsButton = <NavLink className="flex justify-between w-full" href="/settings/" isActive={pathname === '/settings'}>
    <span>{t('menu.settings')}</span>
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
      </li>
      <li className="h-10 m-1">{settingsButton}</li>
      <li className="h-10 m-1">{aboutButton}</li>
      <li className="h-10 m-1">
        {session ? signOutButton : signInButton}
      </li>
    </ul>
  );
}
