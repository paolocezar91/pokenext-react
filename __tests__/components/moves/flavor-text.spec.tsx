import FlavorText from '@/components/moves/flavor-text';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { IMove } from 'pokeapi-typescript';

jest.mock('@heroicons/react/24/solid', () => ({
  ChevronLeftIcon: () => <div>LeftIcon</div>,
  ChevronRightIcon: () => <div>RightIcon</div>,
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('FlavorText Component', () => {
  const mockMoveData = {
    name: 'fire-blast',
    flavor_text_entries: [
      {
        flavor_text: 'First flavor text',
        language: { name: 'en' },
        version_group: { name: 'red-blue' }
      },
      {
        flavor_text: 'Second flavor text',
        language: { name: 'en' },
        version_group: { name: 'gold-silver' }
      },
      {
        flavor_text: 'Non-English text',
        language: { name: 'jp' },
        version_group: { name: 'diamond-pearl' }
      },
      {
        flavor_text: 'Third flavor text',
        language: { name: 'en' },
        version_group: { name: 'sword-shield' }
      }
    ]
  } as unknown as IMove;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the component with initial state', () => {
    render(<FlavorText moveData={mockMoveData} />);

    // Test title transformation
    expect(screen.getByRole('heading')).toHaveTextContent('Fire Blast');

    // Test initial flavor text
    expect(screen.getByText('First flavor text')).toBeInTheDocument();

    // Test version group normalization
    expect(screen.getByText('(Red/Blue)')).toBeInTheDocument();

    // Test pagination display
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
  });

  it('should filter non-English flavor texts', () => {
    render(<FlavorText moveData={mockMoveData} />);

    // Only English texts should be shown (3 out of 4)
    expect(screen.queryByText('Non-English text')).not.toBeInTheDocument();
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
  });

  it('should navigate between flavor texts', () => {
    render(<FlavorText moveData={mockMoveData} />);

    const prevButton = screen.getByTestId('previous-button');
    const nextButton = screen.getByTestId('next-button');

    // Initial state - prev button disabled
    expect(prevButton).toBeDisabled();
    expect(nextButton).not.toBeDisabled();

    // Go to next flavor text
    fireEvent.click(nextButton);
    expect(screen.getByText('Second flavor text')).toBeInTheDocument();
    expect(screen.getByText('(Gold/Silver)')).toBeInTheDocument();
    expect(screen.getByText('2 / 3')).toBeInTheDocument();
    expect(prevButton).not.toBeDisabled();

    // Go to next again
    fireEvent.click(nextButton);
    expect(screen.getByText('Third flavor text')).toBeInTheDocument();
    expect(screen.getByText('(Sword/Shield)')).toBeInTheDocument();
    expect(screen.getByText('3 / 3')).toBeInTheDocument();
    expect(nextButton).toBeDisabled();

    // Go back to previous
    fireEvent.click(prevButton);
    expect(screen.getByText('Second flavor text')).toBeInTheDocument();
    expect(screen.getByText('2 / 3')).toBeInTheDocument();
  });

  it('should handle single flavor text case', () => {
    const singleFlavorData = {
      ...mockMoveData,
      flavor_text_entries: [mockMoveData.flavor_text_entries[0]]
    };

    render(<FlavorText moveData={singleFlavorData} />);

    const prevButton = screen.getByTestId('previous-button');
    const nextButton = screen.getByTestId('next-button');

    expect(prevButton).toBeDisabled();
    expect(nextButton).toBeDisabled();
    expect(screen.getByText('1 / 1')).toBeInTheDocument();
  });
});