import LearnedByPokemon from '@/components/moves/learned-by-pokemon';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { INamedApiResource, IPokemon } from 'pokeapi-typescript';
import { mockAllIsIntersecting } from "react-intersection-observer/test-utils";

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en'
}));

jest.mock('@/context/user-context', () => ({
  useUser: () => ({
    settings: { descriptionLang: 'en', artworkUrl: 'official-artwork', typeArtworkUrl: 'sword-shield' }
  })
}));

jest.mock('@tanstack/react-query', () => ({
  useQuery: () => ({
    data: [
      { name: "ditto", id: 132, types: [ { type: { name: "normal", url: "/api/v2/type/1/" } } ] },
      { name: "mew", id: 151, types: [ { type: { name: "psychic",  url: "/api/v2/type/14/" } } ] }
    ]
  })
}));

const mockLearnedByPokemon = [
    {
      name: "ditto",
      url: "/api/v2/pokemon/132/"
    },
    {
      name: "mew",
      url: "/api/v2/pokemon/151/"
    }
  ] as unknown as INamedApiResource<IPokemon>[];

describe('LearnedByPokemon Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the component with initial state', () => {
    render(<LearnedByPokemon pokemonList={mockLearnedByPokemon} />);
    mockAllIsIntersecting(true);

    // Test title transformation
    expect(screen.getByRole('heading')).toHaveTextContent('moves.learnedBy.title');
    expect(screen.getByText('Mew')).toBeInTheDocument();
    expect(screen.getByText('Ditto')).toBeInTheDocument();
  });

  it('should have the link to the pokemons', () => {
    render(<LearnedByPokemon pokemonList={mockLearnedByPokemon} />);
    mockAllIsIntersecting(true);

    // Test title transformation
    expect(screen.getByRole('heading')).toHaveTextContent('moves.learnedBy.title');
    expect(screen.getByText('Mew')).toBeInTheDocument();
    const mewLink = screen.getByRole('link', { name: 'Mew' });
    expect(mewLink).toHaveAttribute('href', '/en/pokedex/mew');
  });

  it('should match snapshot', () => {
    const { asFragment } = render(<LearnedByPokemon pokemonList={mockLearnedByPokemon} />);
    mockAllIsIntersecting(true);
    expect(asFragment()).toMatchSnapshot();
  });
});