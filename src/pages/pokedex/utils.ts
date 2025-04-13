export function capitilize(s: string) {
  return String(s[0]).toUpperCase() + String(s).slice(1);
}

export const normalizePokemonName = (text: string) => {
  return replaceGenderSymbol(capitilize(text));
};

export const replaceGenderSymbol = (text: string) => {
  return text.replace('-m', ' ♂').replace('-f', ' ♀');
};

export const kebabToSpace = (name: string) => {
  return name.replaceAll('-',' ');
};