import { useTranslation } from 'react-i18next';
import './list.scss';
import { ChangeEvent, useState } from 'react';

export default function PokemonFilter({ onFilter }: { onFilter: (_: string) => void }) {
  const { t } = useTranslation('common');

  const [filterText, setFilterText] = useState('');

  const handleFilter = (text: string) => {
    setFilterText(text);
    if(text.length === 0 || text.length > 1){
      onFilter(text);
    }
  };

  return (
    <input
      value={filterText}
      name="filter"
      className="w-full bg-white rounded-lg border-2 border-[#212529] text-[#212529] p-2 my-3"
      type="text"
      placeholder={t("actions.search")}
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        handleFilter(e.target.value);
      }} />
  );
}