export function capitilize(s: string) {
  return String(s[0]).toUpperCase() + String(s).slice(1);
}

export const normalizePokemonName = (text: string) => {
  // edge cases
  text = text.replace('nidoran-m', 'nidoran ♂');
  text = text.replace('nidoran-f', 'nidoran ♂');
  text = text.replace('mr-mime', 'mr. Mime');
  text = text.replace('mime-jr', 'mime Jr.');
  text = text.replace('mr-rime', 'mr. Rime');
  text = text.replace('-altered', '');
  text = text.replace('-land', '');
  text = text.replace('-red-striped', '');
  text = text.replace('-standard', '');
  text = text.replace('-standard', '');
  text = text.replace('-incarnate', '');
  text = text.replace('-ordinary', '');
  text = text.replace('-aria', '');
  text = text.replace('-male', '');
  text = text.replace('-50', '');
  text = text.replace('-baile', '');
  text = text.replace('-disguised', '');
  text = text.replace('-full-belly', '');
  text = text.replace('-single-strike', '');
  text = text.replace('-green-plumage', '');
  text = text.replace('-curly', '');

  return capitilize(text);
};

export const kebabToSpace = (name: string) => {
  return name.replaceAll('-',' ');
};

export const getIdFromUrlSubstring = (url: string) => url.split("/")[url.split("/").length - 2];
