import { render, screen } from '@testing-library/react';
import { IMoveTarget } from 'pokeapi-typescript';
import '@testing-library/jest-dom';
import MoveTarget from '@/components/moves/move-target';

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('@/context/user-context', () => ({
  useUser: () => ({
    settings: { descriptionLang: 'en' }
  })
}));

describe('MoveTarget Component', () => {
  const mockTargetData: IMoveTarget = {
    name: 'specific-move',
    descriptions: [
      {
        description: 'Targets a specific move of the opponent',
        language: { name: 'en', url: '' }
      },
      {
        description: '非英語の説明', // Non-English description
        language: { name: 'jp', url: '' }
      },
      {
        description: 'Another English description that should not appear',
        language: { name: 'en', url: '' }
      }
    ],
    // Include other required IMoveTarget properties with mock values
    moves: [],
    id: 1,
    names: []
  };

  it('should render the component with English description', () => {
    render(<MoveTarget targetData={mockTargetData} />);

    expect(screen.getByRole('heading', { name: 'moves.moveTarget.title' })).toBeInTheDocument();
    expect(screen.getByText('Targets a specific move of the opponent')).toBeInTheDocument();

    // Verify non-English description is not shown
    expect(screen.queryByText('非英語の説明')).not.toBeInTheDocument();

    // Verify only the first English description is shown
    expect(screen.queryByText('Another English description that should not appear')).not.toBeInTheDocument();
  });

  it('should handle empty descriptions array', () => {
    const emptyDescriptionData = {
      ...mockTargetData,
      descriptions: []
    };

    render(<MoveTarget targetData={emptyDescriptionData} />);

    expect(screen.getByRole('heading', { name: 'moves.moveTarget.title' })).toBeInTheDocument();
    expect(screen.queryByText('moves.moveTarget.empty')).toBeInTheDocument();
  });

  it('should handle missing English description', () => {
    const noEnglishData = {
      ...mockTargetData,
      descriptions: [
        {
          description: 'Solo descripción en español',
          language: { name: 'es', url: '' }
        }
      ]
    };

    render(<MoveTarget targetData={noEnglishData} />);

    expect(screen.getByRole('heading', { name: 'moves.moveTarget.title' })).toBeInTheDocument();
    expect(screen.queryByText('moves.moveTarget.empty')).toBeInTheDocument();
  });

  it('should match snapshot with English description', () => {
    const { asFragment } = render(<MoveTarget targetData={mockTargetData} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should match snapshot with no valid description', () => {
    const noEnglishData = {
      ...mockTargetData,
      descriptions: [
        {
          description: 'Solo descripción en español',
          language: { name: 'es', url: '' }
        }
      ]
    };
    const { asFragment } = render(<MoveTarget targetData={noEnglishData} />);
    expect(asFragment()).toMatchSnapshot();
  });
});