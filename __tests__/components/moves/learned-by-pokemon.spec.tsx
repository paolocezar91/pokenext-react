import LearnedByPokemon from '@/components/moves/learned-by-pokemon';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { INamedApiResource, IPokemon } from 'pokeapi-typescript';

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('@/context/UserContext', () => ({
  useUser: () => ({
    settings: { descriptionLang: 'en' }
  })
}));

describe('LearnedByPokemon Component', () => {
  const mockLearnedByPokemon = [
    {
      "name": "ditto",
      "url": "/api/v2/pokemon/132/"
    },
    {
      "name": "mew",
      "url": "/api/v2/pokemon/151/"
    }
  ] as unknown as INamedApiResource<IPokemon>[];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the component with initial state', () => {
    render(<LearnedByPokemon learnedByPokemon={mockLearnedByPokemon} />);

    // Test title transformation
    expect(screen.getByRole('heading')).toHaveTextContent('moves.learnedBy.title');
    expect(screen.getByText('Mew')).toBeInTheDocument();
    expect(screen.getByText('Ditto')).toBeInTheDocument();
  });

  it('should have the link to the pokemons', () => {
    render(<LearnedByPokemon learnedByPokemon={mockLearnedByPokemon} />);

    // Test title transformation
    expect(screen.getByRole('heading')).toHaveTextContent('moves.learnedBy.title');
    expect(screen.getByText('Mew')).toBeInTheDocument();
    const mewLink = screen.getByRole('link', { name: 'Mew' });
    expect(mewLink).toHaveAttribute('href', '/pokedex/mew');
  });


  it('should match snapshot', () => {
    const { asFragment } = render(<LearnedByPokemon learnedByPokemon={mockLearnedByPokemon} />);
    expect(asFragment()).toMatchSnapshot();
  });
});