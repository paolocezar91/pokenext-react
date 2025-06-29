import NavLink from '@/components/layout/navbar/nav-link';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

describe('Nav Link Component', () => {
  it('renders correctly with href, className and children', () => {
    render(<NavLink href='/pokedex/bulbasaur' className='bulbasaur'>Bulbasaur</NavLink>);
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveTextContent('Bulbasaur');
    expect(link).toHaveClass('bulbasaur');
    expect(link).toHaveAttribute('href', '/pokedex/bulbasaur');
  });

  it('should match snapshot', () => {
    const { asFragment } = render(<NavLink href='/pokedex/bulbasaur'>Bulbasaur</NavLink>);
    expect(asFragment()).toMatchSnapshot();
  });
});