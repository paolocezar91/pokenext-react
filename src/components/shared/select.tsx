import { ChangeEvent, ReactNode } from "react";

export default function Select({
  children,
  value,
  className,
  id,
  onChange
}: {
  children: ReactNode,
  value?: string | number | readonly string[] | undefined,
  className?: string,
  id?: string,
  onChange: (_: ChangeEvent<HTMLSelectElement>) => void
}) {
  return <select
    className={`bg-white text-black text-xs my-2 px-2 py-1 mb-2 border-solid border-2 border-foreground mr-2 rounded hover:border-(--pokedex-red-dark) ${className}`}
    onChange={onChange}
    value={value}
    id={id}
  >
    {children}
  </select>;
}