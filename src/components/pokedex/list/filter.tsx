import PokeApiQuery from '@/app/query';
import MultiSelect from '@/components/shared/multi-select';
import { capitilize } from '@/components/shared/utils';
import { IType } from 'pokeapi-typescript';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Tooltip from '../../shared/tooltip/tooltip';

const pokeApiQuery = new PokeApiQuery();


export default function PokemonFilter({
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

  return (
    <div className="flex">
      <div className="name-filter">
        <Tooltip content={t("actions.filterName.tooltip")}>
          <input
            value={filterName}
            name="filter"
            className={`w-30
              md:w-100
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
            placeholder={t("actions.filterName.placeholder")}
            onChange={(event) => setFilterName(event.target.value)} />
        </Tooltip>
      </div>
      <div className="type-filter ml-4">
        <MultiSelect
          placeholder={t("actions.filterTypes.placeholder")}
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
    </div>
  );
}