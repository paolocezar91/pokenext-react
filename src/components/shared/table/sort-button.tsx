import Tooltip from "@/components/shared/tooltip/tooltip";
import { kebabToSpace } from "@/components/shared/utils";
import { ArrowLongDownIcon, ArrowLongUpIcon, ArrowsUpDownIcon, XMarkIcon } from "@heroicons/react/24/solid";
import React from "react";
import { Button } from "react-bootstrap";
import { SortingDir } from "./sorting";

export default function SortButton<T>({ children, attr, disabled, sorting, onClick }: {
  children: React.ReactNode,
  attr: string,
  sorting: SortingDir<T>[],
  disabled?: boolean,
  onClick: () => void
}) {
  const sortEntry = sorting.find(s => s.key === attr);
  let tooltipContent = "";
  let icon: React.ReactNode;
  if(!sortEntry) {
    tooltipContent=`Sort by ${kebabToSpace(attr)} ascending`;
    icon = <ArrowsUpDownIcon className="w-5" />;
  }
  if(sortEntry?.dir === '+'){
    tooltipContent = `Sort by ${kebabToSpace(attr)} descending`;
    icon = <ArrowLongUpIcon className="w-5" />;
  }
  if(sortEntry?.dir === '-'){
    tooltipContent = `Deactivate sorting`;
    icon = <ArrowLongDownIcon className="w-5" />;
  }

  return <Tooltip content={tooltipContent}>
    <Button
      disabled={disabled}
      className={`
          flex 
          items-start
          ml-1
          px-2
          py-1
          cursor-pointer
          rounded
          bg-(--pokedex-red-dark)
          hover:bg-(--pokedex-red-darker)
          transition-colors
          ${sortEntry ? 'bg-white text-(--pokedex-red-dark) hover:text-white' : ''}
        `}
      onClick={() => onClick()}
    >
      <span className="mr-1">{children}</span>
      {icon}
    </Button>
  </Tooltip>;
};

export function ResetSortButton({ disabled, onClick }: { disabled: boolean, onClick: () => void }) {
  return <Tooltip content="Reset sorting">
    <Button
      disabled={disabled}
      className={`
          ml-1
          p-1
          cursor-pointer
          rounded
          text-(--pokedex-red-darker)
          bg-white
          transition-colors
          hover:bg-(--pokedex-red-darker)
          hover:text-white
          disabled:bg-(--pokedex-red)
          disabled:text-white
          disabled:opacity-50
        `}
      onClick={() => onClick()}>
      <XMarkIcon className="w-5" />
    </Button>
  </Tooltip>;
};
