import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

export const capitilize = (str = '') => {
  const splitStr = str.toLowerCase().split(' ');
  for (let i = 0; i < splitStr.length; i++) {
    // You do not need to check if i is larger than splitStr length, as your for does that for you
    // Assign it back to the array
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  // Directly return the joined string
  return splitStr.join(' ');
};

export const normalizeGeneration = (text: string) => {
  text = text.replace("generation-viii", "Gen VIII");
  text = text.replace("generation-vii", "Gen VII");
  text = text.replace("generation-vi", "Gen VI");
  text = text.replace("generation-v", "Gen V");
  text = text.replace("generation-iv", "Gen IV");
  text = text.replace("generation-iii", "Gen III");
  text = text.replace("generation-ii", "Gen II");
  text = text.replace("generation-i", "Gen I");
  return text;
};

export const normalizeVersionGroup = (text: string) => {
  text = text.replace("red-blue", "Red/Blue");
  text = text.replace("yellow", "Yellow");
  text = text.replace("gold-silver", "Gold/Silver");
  text = text.replace("crystal", "Crystal");
  text = text.replace("ruby-sapphire", "Ruby/Sapphire");
  text = text.replace("emerald", "Emerald");
  text = text.replace("firered-leafgreen", "Fire Red/Leaf Green");
  text = text.replace("diamond-pearl", "Diamond/Pearl");
  text = text.replace("platinum", "Platinum");
  text = text.replace("heartgold-soulsilver", "Heart Gold/Soul Silver");
  text = text.replace("black-white", "Black/White");
  text = text.replace("xd", "XD");
  text = text.replace("colosseum", "Colosseum");
  text = text.replace("black-2-white-2", "Black 2/White 2");
  text = text.replace("x-y", "X/Y");
  text = text.replace("omega-ruby-alpha-sapphire", "OR/AS");
  text = text.replace("sun-moon", "Sun/Moon");
  text = text.replace("ultra-sun-ultra-moon", "Ultra Sun/Ultra Moon");
  text = text.replace("lets-go-pikachu-lets-go-eevee", "Let's Go Pikachu/Eevee");
  text = text.replace("sword-shield", "Sword/Shield");
  text = text.replace("brilliant-diamond-and-shining-pearl", "Brill. Diamond/Shin. Pearl");
  text = text.replace("legends-arceus", "Legends: Arceus");
  text = text.replace("scarlet-violet", "Scarlet/Violet");
  return text;
};

export const normalizePokemonName = (text: string) => {
  // edge cases
  text = text.replace('nidoran-m', 'nidoran ♂');
  text = text.replace('nidoran-f', 'nidoran ♀');
  text = text.replace('mr-mime', 'mr. Mime');
  text = text.replace('mime-jr', 'mime Jr.');
  text = text.replace('mr-rime', 'mr. Rime');
  text = text.replace('-altered', ' (Altered)');
  text = text.replace('-land', ' (Land)');
  text = text.replace('-red-striped', ' (Red Striped)');
  text = text.replace('-blue-striped', ' (Blue Striped)');
  text = text.replace('-white-striped', ' (White Striped)');
  text = text.replace('-standard', ' (Standard)');
  text = text.replace('-incarnate', ' (Incarnate)');
  text = text.replace('-therian', ' (Therian)');
  text = text.replace('-ordinary', '');
  text = text.replace('-aria', ' (Aria)');
  text = text.replace('-unbound', ' (Unbound)');
  text = text.replace('-male', ' ♂');
  text = text.replace('-female', ' ♀');
  text = text.replace('-50', ' (50%)');
  text = text.replace('-baile', ' (Baile)');
  text = text.replace('-pom-pom', ' (Pom-Pom)');
  text = text.replace('-pau', ' (Pa\'u)');
  text = text.replace('-sensu', ' (Sensu)');
  text = text.replace('-disguised', '');
  text = text.replace('-full-belly', '');
  text = text.replace('-single-strike', '');
  text = text.replace('-green-plumage', ' (Green Plumage)');
  text = text.replace('-yellow-plumage', ' (Yellow Plumage)');
  text = text.replace('-blue-plumage', ' (Blue Plumage)');
  text = text.replace('-white-plumage', ' (White Plumage)');
  text = text.replace('-curly', '');
  text = text.replace('-plant', ' (Plant)');
  text = text.replace('-sandy', ' (Sandy)');
  text = text.replace('-trash', ' (Trash)');
  text = text.replace('-alola', ' (Alola)');
  text = text.replace('-galar', ' (Galar)');
  text = text.replace('-gmax', ' (Gigantamax)');
  text = text.replace('-mega-x', ' (Mega X)');
  text = text.replace('-mega-y', ' (Mega Y)');
  text = text.replace('-mega', ' (Mega)');
  text = text.replace('-hisui', ' (Hisui)');
  text = text.replace('-heat', ' (Heat)');
  text = text.replace('-wash', ' (Wash)');
  text = text.replace('-frost', ' (Frost)');
  text = text.replace('-fan', ' (Fan)');
  text = text.replace('-mow', ' (Mow)');
  text = text.replace('-normal', '');
  text = text.replace('-average', '');
  text = text.replace('-shield', ' (Shield)');
  text = text.replace('-midday', ' (Midday)');
  text = text.replace('-solo', '');
  text = text.replace('-amped', ' (Amped)');
  text = text.replace('-ice', ' (Ice)');
  text = text.replace('-family-of-four', ' (Family of Four)');
  text = text.replace('-zero', ' (Zero)');
  text = text.replace('-two-segment', ' (Two Segment)');

  return capitilize(text);
};

export const kebabToSpace = (name: string) => {
  return name.replaceAll('-',' ');
};

export const kebabToSlash = (name: string) => {
  return name.replaceAll('-','/');
};

export const getIdFromUrlSubstring = (url = '') => url.split("/")[url.split("/").length - 2];


export const useLocalStorage = <T>(
  key: string,
  defaultValue: T
): [T, Dispatch<SetStateAction<T>>] => {
  const isMounted = useRef(false);
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setValue(JSON.parse(item));
      }
    } catch (e) {
      console.log(e);
    }
    return () => {
      isMounted.current = false;
    };
  }, [key]);

  useEffect(() => {
    if (isMounted.current) {
      window.localStorage.setItem(key, JSON.stringify(value));
    } else {
      isMounted.current = true;
    }
  }, [key, value]);

  return [value, setValue];
};
