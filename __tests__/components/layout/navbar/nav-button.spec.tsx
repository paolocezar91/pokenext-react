import NavButton from '@/components/layout/navbar/nav-button';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

describe('NavButton Component', () => {
  it('renders correctly with name and class', () => {
    render(<NavButton className='bulbasaur'>Bulbasaur</NavButton>);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Bulbasaur');
    expect(button).toHaveClass('bulbasaur');
  });

  it('click callback and onMouseEnterCallback are fired', () => {
    const clickCallback = jest.fn();
    const onMouseEnterCallback = jest.fn();

    render(<NavButton onMouseEnter={() => onMouseEnterCallback()} onClick={() => clickCallback()} className='bulbasaur'>Bulbasaur</NavButton>);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(clickCallback).toHaveBeenCalled();
    fireEvent.mouseEnter(button);
    expect(onMouseEnterCallback).toHaveBeenCalled();
  });

  it('should match snapshot', () => {
    const { asFragment } = render(<NavButton>Bulbasaur</NavButton>);
    expect(asFragment()).toMatchSnapshot();
  });
});