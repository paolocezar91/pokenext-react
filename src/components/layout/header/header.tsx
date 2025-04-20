import Tooltip from "@/components/shared/tooltip/tooltip";
import Image from "next/image";
import { useRouter } from 'next/router';
import { FormEvent } from 'react';
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import './header.scss';

export default function Header({ title }: Readonly<{ title: string }>) {
  const router = useRouter();
  const { t } = useTranslation();

  const goTo = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const input = form.elements.namedItem('pokemon-search') as HTMLInputElement;
    const idx = input?.value?.toLowerCase()?.trim();
    if(idx) {
      router.push(`/pokedex/${idx}`);
    }
  };

  return (
    <nav className="relative navbar flex flex-wrap items-center justify-between border-b-4 border-solid border-(--pokedex-red-light)">
      <div className="flex w-full pt-1 pb-1 mx-auto items-center justify-between">
        <Button
          onClick={() => router.push("/pokedex/")}
          className="navbar-brand pt-2 pb-2 flex items-center"
          aria-description="Go to Home Page"
          data-testid="home-page-link"
        >
          <Image
            priority={true}
            src="/logo.svg"
            width={48}
            height={48}
            alt={title}
            className="mx-2 inline" />
          <h1 className="text-sm hidden md:inline">
            { title }
          </h1>
        </Button>

        <span className="go-to border-solid border-2 border-black bg-white rounded mr-4">
          <Tooltip position="bottom" content={t('actions.go.tooltip')}>
            <form onSubmit={goTo} data-testid="form-go-to">
              <input name="pokemon-search" placeholder={t('actions.go.placeholder')} type="text" className="w-30 ml-2 py-1 text-black bg-white placeholder-gray-500 text-xs" />
              <button type="submit" className="px-2 text-sm text-white bg-(--pokedex-blue) hover:bg-(--pokedex-blue-dark) py-1 border-l-2 border-solid border-black">{ t("actions.go.button") }!</button>
            </form>
          </Tooltip>
        </span>
      </div>
    </nav>
  );
}