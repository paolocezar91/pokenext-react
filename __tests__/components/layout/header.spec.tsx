import PokeNavbar from '@/components/layout/navbar/navbar';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import mockRouter from 'next-router-mock';
import { act } from 'react';

jest.mock('next/router', () => jest.requireActual('next-router-mock'));
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));


describe('Header', () => {
  beforeEach(() => {
    // Reset the router before each test
    mockRouter.setCurrentUrl('/');
  });

  it('should render title', () => {
    const title = 'title';
    render(<PokeNavbar title={title} />);
    expect(screen.queryByRole('heading', {level: 1})).toBeInTheDocument();
  });

  it('should sent to home page', () => {
    const title = 'title';
    render(<PokeNavbar title={title} />);
    const homePageLink = screen.getByTestId("home-page-link");
    fireEvent.click(homePageLink);

    expect(mockRouter.asPath).toBe('/pokedex');
  });

  it('should update input value and submit form', () => {
    const title = 'title';
    render(<PokeNavbar title={title} />);

    // Get form elements
    const form = screen.getByTestId('form-go-to');
    const input = screen.getByPlaceholderText('actions.go.placeholder');

    // Simulate user typing
    // Simulate user typing
    fireEvent.change(input, { target: { value: 'bulbasaur' } });
    expect(input).toHaveValue('bulbasaur');

    // This will work because testing-library's fireEvent creates proper event structure
    fireEvent.submit(form);

    // Verify router navigation
    expect(mockRouter.asPath).toBe('/pokedex/bulbasaur');
  });

  it('should not navigate with empty input', () => {
    const title = 'title';
    render(<PokeNavbar title={title} />);

    const form = screen.getByTestId('form-go-to');
    fireEvent.submit(form);

    // Router should not change
    expect(mockRouter.asPath).toBe('/');
  });

  it('should handle different pokemon names', () => {
    const title = 'title';
    render(<PokeNavbar title={title} />);

    const testCases = [
      { input: '25', expected: '/pokedex/25' },
      { input: 'pikachu', expected: '/pokedex/pikachu' },
      { input: 'CHARIZARD', expected: '/pokedex/charizard' }, // test case insensitivity
      { input: ' eevee ', expected: '/pokedex/eevee' }, // test whitespace
    ];

    testCases.forEach(({ input, expected }) => {
      const form = screen.getByTestId('form-go-to');
      const inputField = screen.getByPlaceholderText('actions.go.placeholder');

      fireEvent.change(inputField, { target: { value: input } });
      fireEvent.submit(form);

      expect(mockRouter.asPath).toBe(expected);

      // Reset router for next test case
      act(() => {
        mockRouter.setCurrentUrl('/');
      });
    });
  });

  it('should match snapshot', () => {
    const title = 'title';
    const { asFragment } = render(<PokeNavbar title={title} />);
    expect(asFragment()).toMatchSnapshot();
  });
});