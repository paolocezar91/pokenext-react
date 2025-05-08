import Navbar from '@/components/layout/navbar/navbar';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/router';

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock react-i18next
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// Mock the MobileMenu and other child components to simplify testing
jest.mock('@/components/layout/navbar/mobile-menu', () => jest.fn(({ children }) => <div>{children}</div>));
jest.mock('@/components/layout/navbar/nav-link', () => jest.fn(({ href, children }) => <a href={href}>{children}</a>));
jest.mock('@/components/layout/navbar/nav-search', () => jest.fn(() => <div>NavSearch</div>));

describe('Navbar Component', () => {
  const mockRouter = {
    pathname: '/',
    push: jest.fn(),
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with title', () => {
    render(<Navbar title="Pokedex App" />);
    expect(screen.getByText('Pokedex App')).toBeInTheDocument();
  });

  it('contains a link to home page on the logo', () => {
    render(<Navbar title="Pokedex App" />);
    const logoLink = screen.getByRole('link', { name: /pokedex app/i });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute('href', '/pokedex');
  });

  it('renders home link correctly', () => {
    render(<Navbar title="Pokedex App" />);
    const homeLink = screen.getAllByRole('link', { name: "menu.home" });
    expect(homeLink[0]).toBeInTheDocument();
    expect(homeLink[0]).toHaveAttribute('href', '/pokedex/');
    expect(homeLink[1]).toBeInTheDocument();
    expect(homeLink[1]).toHaveAttribute('href', '/pokedex/');
  });

  it('renders settings link correctly', () => {
    render(<Navbar title="Pokedex App" />);
    const settingsLink = screen.getAllByRole('link', { name: /settings/i });
    expect(settingsLink[0]).toBeInTheDocument();
    expect(settingsLink[0]).toHaveAttribute('href', '/settings/');
    expect(settingsLink[1]).toBeInTheDocument();
    expect(settingsLink[1]).toHaveAttribute('href', '/settings/');
  });

  it('toggles mobile menu when button is clicked', () => {
    render(<Navbar title="Pokedex App" />);
    const menuButton = screen.getByRole('button', { name: /open main menu/i });

    // Initial state should be closed
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');

    // Click to open
    fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute('aria-expanded', 'true');

    // Click to close
    fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('renders NavSearch component', () => {
    render(<Navbar title="Pokedex App" />);
    expect(screen.getAllByText('NavSearch')[0]).toBeInTheDocument();
    expect(screen.getAllByText('NavSearch')[1]).toBeInTheDocument();
  });
});