import { ChangeEvent } from "react";


export default function Toggle({
  value,
  disabled,
  id,
  className,
  childrenLeft,
  childrenRight,
  size = 'base',
  onChange
}: {
  value: boolean;
  id: string;
  disabled?: boolean;
  className?: string;
  childrenLeft?: React.ReactNode;
  childrenRight?: React.ReactNode;
  size?: 'sm' | 'base'
  onChange: (_: boolean) => void
}) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  const heightBase = 'w-11 h-6 after:h-5 after:w-5';
  const heightSM = 'w-7 h-4 after:h-3 after:w-3';
  const height = size === 'sm' ? heightSM : heightBase;
  const baseClass = `relative
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
      after:rounded-full`;

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
      aria-label={
        (typeof childrenRight === 'string' ? childrenRight : typeof childrenLeft === 'string' ? childrenLeft : 'Toggle')}
    />
    {childrenLeft && <span className="ms-3 mr-2 text-xs font-medium text-foreground"> {childrenLeft} </span>}
    <div className={`
      ${baseClass}
      ${height}
    `}></div>
    {childrenRight && <span className="ms-3 ml-2 text-xs font-medium text-foreground"> {childrenRight} </span>}
  </label>
  ;
}