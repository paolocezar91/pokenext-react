import { ChangeEvent } from "react";


export default function Toggle({
  value,
  children,
  disabled,
  id,
  className,
  onChange
}: {
  value: boolean;
  id: string;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  onChange: (_: boolean) => void
}) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return <label
    className={`${className} inline-flex items-center cursor-pointer`}
    htmlFor={`toggle-${id}`}
    data-testid="toggle-label"
  >
    <input
      id={`toggle-${id}`}
      type="checkbox"
      className="sr-only peer"
      checked={value}
      onChange={handleChange}
      disabled={disabled}
      aria-label={(typeof children === 'string' ? children : 'Toggle')}
    />
    <div className="
      relative
      w-11
      h-6
      bg-gray-700
      border-gray-600
      rounded-full
      rtl:peer-checked:after:-translate-x-full
      peer
      peer-focus:outline-none
      peer-focus:ring-2
      peer-focus:ring-(--pokedex-blue)
      peer-focus:ring-white
      peer-checked:after:translate-x-full
      peer-checked:after:border-(--pokedex-red-light)
      peer-checked:bg-(--pokedex-blue)
      after:transition-all
      after:content-['']
      after:absolute
      after:top-[2px]
      after:start-[2px]
      after:bg-white
      after:border-gray-300
      after:border
      after:rounded-full
      after:h-5
      after:w-5
    "></div>
    {children && <span className="ms-3 text-xs font-medium text-foreground"> {children} </span>}
  </label>
  ;
}