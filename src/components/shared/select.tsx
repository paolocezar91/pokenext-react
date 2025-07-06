import { ChangeEvent, ReactNode } from "react";

export default function Select({
  children,
  value,
  className,
  id,
  multiple,
  onChange
}: {
  children: ReactNode,
  value?: string | number | readonly string[] | undefined,
  className?: string,
  id?: string,
  multiple?: boolean,
  onChange: (_: ChangeEvent<HTMLSelectElement>) => void
}) {
  return <select
    className={`
      bg-white
      text-black
      text-xs
      px-2
      py-1
      border-solid
      border-2
      border-foreground
      rounded
      hover:border-(--pokedex-red-dark)
      ${className}
    `}
    onChange={onChange}
    value={value}
    id={id}
    multiple={multiple}
  >
    {children}
  </select>;
}