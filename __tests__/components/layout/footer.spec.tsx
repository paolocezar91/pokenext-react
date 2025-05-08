import Footer from '@/components/layout/footer';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

describe('Footer', () => {
  it('should match snapshot with no valid description', () => {
    const { asFragment } = render(<Footer />);
    expect(asFragment()).toMatchSnapshot();
  });
});