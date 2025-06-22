import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Layout from '@/pages/layout';

jest.mock('next/router', () => jest.requireActual('next-router-mock'));
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en-US' } }),
}));

describe('Layout', () => {
  it('Renders children', () => {
    const childrenTestId = 'testId';

    render(<Layout title="test">
      <span data-testid={childrenTestId}></span>
    </Layout>);

    expect(screen.queryByTestId(childrenTestId)).toBeInTheDocument();
  });
});