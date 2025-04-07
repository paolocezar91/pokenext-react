import './list.scss';
import { ChangeEvent, useState } from 'react';

export default function PokemonFilter({ onFilter }: { onFilter: (data: string) => void }) {

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
      name="Filter"
      className="w-full bg-white rounded-lg border-2 border-[#212529] text-[#212529] p-2 my-3"
      type="text"
      placeholder="Filter..."
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        handleFilter(e.target.value);
      }} />
  );
}