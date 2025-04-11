import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/router';
import { FormEvent } from 'react';
import './header.scss';
import { useTranslation } from "react-i18next";
import Tooltip from "../tooltip/tooltip";

export default function Header({ title }: Readonly<{ title: string }>) {
  const router = useRouter();
  const { t } = useTranslation();

  const goTo = ((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const idx = (event.currentTarget[0] as HTMLInputElement).value;
    if(!!idx) {
      router.push(`/pokedex/${idx}`);
    }
  });

  return (
    <nav className="relative navbar flex flex-wrap items-center justify-between">
      <div className="flex w-full pt-1 pb-1 mx-auto items-center justify-between">
        <Link
          href="/pokedex/"
          className="navbar-brand pt-2 pb-2 text-lg whitespace-nowrap"
        >
          <Image
            priority={true}
            src="/logo.svg"
            width={48}
            height={48}
            alt={title}
            className="mx-2 inline" />
          { title }
        </Link>

        <span className="go-to border-solid border-2 border-background bg-foreground rounded mr-4">
          <Tooltip position="bottom" content={t('actions.go.tooltip')}>
            <form onSubmit={goTo}>
              <input placeholder={t('actions.go.placeholder')} type="text" className="lg:w-60 md:w-20  ml-2 py-1 text-black placeholder-gray-500 text-xs" />
              <button type="submit" className="px-2 text-sm text-white bg-(--pokedex-blue) hover:bg-(--pokedex-blue-dark) py-1">{ t("actions.go.button") }!</button>
            </form>
          </Tooltip>
        </span>
      </div>
    </nav>
  );
}