import './list.scss';
import { ChangeEvent, useState } from 'react';


export default function PokemonSearch() {
  const [searchText, setSearchText] = useState('');
  const update = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e)
    setSearchText(e.target.value)
  }

  return (
    <input
      className="w-full bg-white rounded-lg border-2 border-[#212529] text-[#212529] p-2 my-3"
      type="text"
      placeholder="Search..."
      value={searchText}
      onChange={(e) => update(e)} />
  );
}