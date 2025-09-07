import { useLocale } from "next-intl";
import NextLink, { LinkProps } from "next/link";
import { ReactNode } from "react";

type Props = Omit<LinkProps, "href"> & {
  href: string;
  children: ReactNode;
  className?: string;
  target?: string;
};

export default function Link({ href, children, className = "", target, ...props }: Props) {
  const locale = useLocale()
  const localizedHref = `/${locale}${href.startsWith("/") ? href : "/" + href}`;
  return <NextLink 
    className={className}
    href={localizedHref}
    target={target}
    {...props}
  >
      {children}
  </NextLink>;
}