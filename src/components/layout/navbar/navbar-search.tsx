import All from "@/app/poke-array.json";
import { getNumber } from "@/components/shared/thumb/thumb";
import { useRouter } from "next/router";
import { FormEvent, useState, ChangeEvent } from "react";
import { useTranslation } from "react-i18next";

export default function NavSearch() {
  const router = useRouter();
  const { t } = useTranslation('common');

  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<{ name: string, displayName: string, id: number | string }[]>([]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase().trim();
    setInputValue(value);

    if (value) {
      // Filter suggestions based on the input value
      const filtered = All.filter((pokemon: { name: string, displayName: string, id: number }) =>
        pokemon.name.toLowerCase().includes(value)
      );
      setSuggestions(filtered.slice(0, 10)); // Limit to 10 suggestions
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: { name: string, displayName: string, id: number | string }) => {
    setInputValue(suggestion.name);
    setSuggestions([]); // Clear suggestions after selection
    setTimeout(() => {
      router.push(`/pokedex/${suggestion.name}`);
    }, 100); // Delay to allow for the input value to update
  };

  const goTo = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const idx = inputValue.toLowerCase().trim();
    if (idx) {
      router.push(`/pokedex/${idx}`);
    }
  };

  const boldPartialMatch = (text: string, query: string) => {
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return text; // No match found

    const beforeMatch = text.slice(0, index);
    const match = text.slice(index, index + query.length);
    const afterMatch = text.slice(index + query.length);

    return (
      <>
        {beforeMatch}
        <strong class="match">{match}</strong>
        {afterMatch}
      </>
    );
  };

  const getSuggestion = (suggestion: { name: string, displayName: string, id: number | string }) => {
    const { name, displayName, id } = suggestion;
    const idx = typeof id === 'number' ? getNumber(id) : '';
    const isMatch = inputValue.length > 0 && name.toLowerCase().includes(inputValue.toLowerCase());

    return (
      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        <span className="text-xs">{isMatch ? boldPartialMatch(displayName, inputValue) : displayName}</span>
        {idx && <span className="text-xs">({idx})</span>}
      </div>
    );
  };


  return (
    <form onSubmit={goTo} data-testid="form-go-to" className="w-inherit relative">
      <div className="h-10 flex">
        <input
          name="pokemon-search"
          placeholder={t('actions.go.placeholder')}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          className="
            w-60
            h-full
            bg-white
            text-xs
            text-black
            rounded
            px-2
            py-1
            placeholder-gray-500
            border-solid
            border-2
            border-black
            hover:border-gray-700
          "
        />
      </div>
      {suggestions.length > 0 &&
        <ul className="absolute bg-white border border-foreground text-black text-xs rounded shadow-lg mt-1 max-h-40 overflow-y-auto w-60 z-10">
          {suggestions.map((suggestion) =>
            <li
              key={suggestion.name}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-2 py-1 cursor-pointer hover:bg-gray-200"
            >
              {getSuggestion(suggestion)}
            </li>
          )}
        </ul>
      }
    </form>
  );
}