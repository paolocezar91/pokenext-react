import PokeApiQuery from '@/app/poke-api-query';
import MultiSelect from '@/components/shared/multi-select';
import { capitilize } from '@/components/shared/utils';
import { ChevronLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { IType } from 'pokeapi-typescript';
import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Tooltip from '../../shared/tooltip/tooltip';

const pokeApiQuery = new PokeApiQuery();

export default function PokedexFilter({
  className,
  name,
  types,
  onFilterName,
  onFilterTypes,
}: {
  className?: string,
  name?: string,
  types?: string[],
  onFilterName: (value: string) => void
  onFilterTypes: (values: string[]) => void
}) {
  const { t } = useTranslation('common');
  const [filterName, setFilterName] = useState(name);
  const [filterType, setFilterType] = useState<string[]>(types ?? []);
  const [typeOptions, setTypeOptions] = useState<IType[]>([]);
  const [open, setOpen] = useState<boolean>(!!name || !!types?.length);

  useEffect(() => {
    pokeApiQuery.getAllTypes().then(options => setTypeOptions(options));
  }, []);

  useEffect(() => {
    if(filterName !== undefined && (filterName?.length === 0 || filterName?.length > 2)){
      const timeOutId = setTimeout(() => onFilterName(filterName), 300);
      return () => clearTimeout(timeOutId);
    }
  }, [filterName]);

  const handleTypeFilter = (t: string[]) => {
    setFilterType(t);
    onFilterTypes(t);
  };

  const toggleFilterForm =
    <Tooltip content={
      !open ?
        t("filters.openFilters") :
        t("filters.closeFilters")
    }>
      <Button className={`
      cursor-pointer
      flex
      p-2
      rounded
      mr-2
      transition-colors
      ${open ?
        "bg-(--pokedex-red-darker) hover:text-(--pokedex-red-darker) hover:bg-white" :
        "hover:bg-(--pokedex-red-darker)"}
    `}
      onClick={() => setOpen(!open)}
      >
        { open ? <ChevronLeftIcon className="w-6" />: <MagnifyingGlassIcon className="w-6" />}
      </Button>
    </Tooltip>;

  const filterForm =<div className="flex">
    <div className="name-filter">
      <Tooltip content={t("filters.filterName.tooltip")}>
        <input
          value={filterName}
          name="filter"
          className={`w-30
            md:w-75
            text-xs
            bg-white
            rounded-lg
            border-2
            border-[#212529]
            text-[#212529]
            p-2
            min-h-[2.5rem]
            hover:border-(--pokedex-red)
            ${className}`}
          type="text"
          placeholder={t("filters.filterName.placeholder")}
          onChange={(event) => setFilterName(event.target.value)} />
      </Tooltip>
    </div>
    <div className="type-filter mx-2">
      <MultiSelect
        placeholder={t("filters.filterTypes.placeholder")}
        onChange={handleTypeFilter}
        value={filterType}
        options={
          typeOptions.map(
            ({ name }: { name: string }) =>
              ({ label: capitilize(name), value: name })
          )
        }
      />
    </div>
  </div>;

  return (
    <>
      {toggleFilterForm}
      { open && filterForm }
    </>
  );
}