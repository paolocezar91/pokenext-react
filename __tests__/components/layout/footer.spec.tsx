import Footer from '@/components/layout/footer';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

jest.mock('next/router', () => jest.requireActual('next-router-mock'));
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'en-US',
      changeLanguage: jest.fn()
    }
  }),
}));


describe('Footer', () => {
  it('should update select value when language changes', () => {
    const mockChangeLanguage = jest.fn();

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    jest.spyOn(require('react-i18next'), 'useTranslation').mockReturnValue({
      i18n: {
        language: 'en-US',
        changeLanguage: mockChangeLanguage,
      },
      t: (key: string) => key,
    });

    render(<Footer />);

    const langSelect = screen.getByTestId('lang') as HTMLSelectElement;

    // Verify initial value
    expect(langSelect.value).toBe('en-US');

    // Simulate language change
    fireEvent.change(langSelect, { target: { value: 'pt-BR' } });

    // Verify the changeLanguage function was called
    expect(mockChangeLanguage).toHaveBeenCalledWith('pt-BR');
  });

  it('should match snapshot with no valid description', () => {
    const { asFragment } = render(<Footer />);
    expect(asFragment()).toMatchSnapshot();
  });
});