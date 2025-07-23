import { ChevronDownIcon } from "@heroicons/react/24/solid";
import React, { useState } from "react";

type Option = {
  value: string;
  label: string;
};


export default function MultiSelect({
  options,
  value,
  onChange,
  className = "",
  id,
  placeholder,
  maxSelected = 2,
}: {
  options: Option[];
  value: string[];
  onChange: (selected: string[]) => void;
  className?: string;
  id?: string;
  placeholder?: string;
  maxSelected?: number;
}) {
  const [open, setOpen] = useState(false);

  const handleSelect = (optionValue: string) => {
    if (value.includes(optionValue)) {
      // Deselect
      onChange(value.filter((v) => v !== optionValue));
    } else if (value.length < maxSelected) {
      // Select
      onChange([...value, optionValue]);
    }
  };

  const handleRemove = (optionValue: string) => {
    onChange(value.filter((v) => v !== optionValue));
  };

  const selectedOptions = options.filter((opt) => value.includes(opt.value));

  return (
    <div className={`relative inline-block w-80 ${className}`} id={id}>
      <div
        className="
          bg-white
          text-xs
          px-2
          py-1
          border-solid
          border-2
          border-[#212529]
          text-[#212529]
          rounded-lg
          hover:border-(--pokedex-red)
          flex
          flex-wrap
          gap-1
          cursor-pointer
          min-h-[2.5rem]
          items-center"
        onClick={() => setOpen((o) => !o)}
        tabIndex={0}
        onBlur={() => setTimeout(() => setOpen(false), 500)}
      >
        {selectedOptions.length === 0 && <span className="text-gray-400">{placeholder}</span>}
        <span className="grow flex gap-1">
          {selectedOptions.map((opt) =>
            <span
              key={opt.value}
              className="
                bg-gray-200
                rounded
                px-2
                py-0.5
                flex
                items-center
                gap-1
                shrink
                text-xs
                text-black
              "
            >
              {opt.label}
              <button
                type="button"
                className="ml-1 p-1 text-red-500 hover:text-red-700 cursor-pointer"
                onClick={e => {
                  e.stopPropagation();
                  handleRemove(opt.value);
                }}
                aria-label={`Remove ${opt.label}`}
              >
                ×
              </button>
            </span>
          )}
        </span>
        <ChevronDownIcon className="w-5"/>
      </div>
      {open &&
      <ul className="
        absolute
        z-10
        left-0
        right-0
        bg-white
        border-2
        border-foreground
        rounded
        mt-1
        max-h-48
        overflow-auto
        shadow-lg
      ">
        {options.map((opt) =>
          <li
            key={opt.value}
            className={`
              px-3
              py-2
              cursor-pointer
              hover:bg-gray-100
              transition-colors
              text-xs
              flex
              items-center
              text-gray-800 
              ${value.includes(opt.value) ? "font-bold": ""}
              ${value.length >= maxSelected && !value.includes(opt.value) ? "opacity-50 pointer-events-none" : ""}
            `}
            onClick={() => handleSelect(opt.value)}
          >
            {opt.label}
            {value.includes(opt.value) && <span className="ml-2 text-green-600">✔</span>}
          </li>
        )}
      </ul>
      }
    </div>
  );
}
