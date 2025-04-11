import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './list.scss';

export default function PokemonFilter({ onFilter }: { onFilter: (_: string) => void }) {
  const { t } = useTranslation();

  const [filterText, setFilterText] = useState('');

  const handleFilter = (e: ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setFilterText(text);
    if(text.length === 0 || text.length > 1){
      onFilter(text);
    }
  };

  return (
    <input
      value={filterText}
      name="filter"
      className="w-full text-sm bg-white rounded-lg border-2 border-[#212529] text-[#212529] p-2 my-3"
      type="text"
      placeholder={t("actions.filter")}
      onChange={handleFilter} />
  );
}