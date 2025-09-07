import RootLayout from '@/components/layout/layout';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

jest.mock('@/components/layout/navbar/navbar', () => jest.fn(({ children }) => <div>{children}</div>));
jest.mock('next/router', () => jest.requireActual('next-router-mock'));
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en-US' }}),
}));


describe('Layout', () => {
  it('Renders children', () => {
    const childrenTestId = 'testId';

    render(<RootLayout title="test">
      <span data-testid={childrenTestId}></span>
    </RootLayout>);

    expect(screen.queryByTestId(childrenTestId)).toBeInTheDocument();
  });
});