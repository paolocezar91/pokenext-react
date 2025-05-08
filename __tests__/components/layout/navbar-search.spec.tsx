import NavSearch from '@/components/layout/navbar/navbar-search';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/router';

// Mock dependencies
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('NavSearch Component', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush, });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with placeholder', () => {
    render(<NavSearch />);
    expect(screen.getByPlaceholderText('actions.go.placeholder')).toBeInTheDocument();
    expect(screen.getByTestId('form-go-to')).toBeInTheDocument();
  });

  it('updates input value on change', () => {
    render(<NavSearch />);
    const input = screen.getByPlaceholderText('actions.go.placeholder');
    fireEvent.change(input, { target: { value: 'pikachu' }});
    expect(input).toHaveValue('pikachu');
  });

  it('shows suggestions when typing', async () => {
    render(<NavSearch />);
    const input = screen.getByPlaceholderText('actions.go.placeholder');

    fireEvent.change(input, { target: { value: 'metapod' }});

    await waitFor(() => {
      expect(screen.getByText('Metapod')).toBeInTheDocument();
    });
  });

  it('filters suggestions correctly', async () => {
    render(<NavSearch />);
    const input = screen.getByPlaceholderText('actions.go.placeholder');

    fireEvent.change(input, { target: { value: 'metapod' }});

    await waitFor(() => {
      expect(screen.getByText('Metapod')).toBeInTheDocument();
      expect(screen.queryByText('Pikachu')).not.toBeInTheDocument();
      expect(screen.queryByText('Bulbasaur')).not.toBeInTheDocument();
    });
  });

  it('navigates to pokemon page when suggestion is clicked', async () => {
    render(<NavSearch />);
    const input = screen.getByPlaceholderText('actions.go.placeholder');

    fireEvent.change(input, { target: { value: 'metapod' }});
    await waitFor(() => {
      expect(screen.getByText('Metapod')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Metapod'));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/pokedex/metapod');
    });
  });

  it('navigates to pokemon page when form is submitted', async () => {
    render(<NavSearch />);
    const input = screen.getByPlaceholderText('actions.go.placeholder');
    const form = screen.getByTestId('form-go-to');

    fireEvent.change(input, { target: { value: 'metapod' }});
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/pokedex/metapod');
    });
  });

  it('clears suggestions when input is empty', async () => {
    render(<NavSearch />);
    const input = screen.getByPlaceholderText('actions.go.placeholder');

    // Type something to show suggestions
    fireEvent.change(input, { target: { value: 'metapod' }});
    await waitFor(() => {
      expect(screen.getByText('Metapod')).toBeInTheDocument();
    });

    // Clear input
    fireEvent.change(input, { target: { value: '' }});
    await waitFor(() => {
      expect(screen.queryByText('Metapod')).not.toBeInTheDocument();
    });
  });
});