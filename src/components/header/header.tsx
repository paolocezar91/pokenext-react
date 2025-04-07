import './header.scss';
import Image from "next/image";
import Link from "next/link";

export default function Header({ title }: Readonly<{ title: string }>) {
    
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
            alt="Picture of the author"
            className="mx-2 inline" />
          { title }
        </Link>
      </div>
    </nav>
  );
}