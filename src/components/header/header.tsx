import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/router';
import { FormEvent } from 'react';
import './header.scss';
import { useTranslation } from "react-i18next";

export default function Header({ title }: Readonly<{ title: string }>) {
  const router = useRouter();
  const { t } = useTranslation('common');

  const goTo = ((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const idx = (event.currentTarget[0] as HTMLInputElement).value;
    if(!!idx) {
      router.push(`/pokemon/${idx}`);
    }
  });

  return (
    <nav className="relative navbar flex flex-wrap items-center justify-between">
      <div className="flex w-full pt-1 pb-1 mx-auto items-center justify-between">
        <Link
          href="/"
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
          <form onSubmit={goTo}>
            <input placeholder={ t("actions.go.placeholder") } type="text" className="w-60 ml-2 py-1 border-solid text-black placeholder-gray-500 border-r-2" />
            <button type="submit" className="px-2 text-white bg-(--pokedex-blue) py-1">{ t("actions.go.button") }!</button>
          </form>
        </span>
      </div>
    </nav>
  );
}