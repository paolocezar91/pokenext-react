import Toggle from '@/components/shared/toggle';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

describe('Toggle Component', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with default unchecked state', () => {
    render(<Toggle id="test" value={false} onChange={mockOnChange} />);

    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBeFalsy();
    expect(checkbox).not.toBeChecked();
  });

  it('should render with checked state when value is true', () => {
    render(<Toggle id="test" value={true} onChange={mockOnChange} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeTruthy();
    expect(checkbox).toBeChecked();
  });

  it('should display children text when provided', () => {
    render(<Toggle id="test" value={false} onChange={mockOnChange}>Test Label</Toggle>);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('should display className when provided', () => {
    render(<Toggle id="test" className="test-class" value={false} onChange={mockOnChange}>Test Label</Toggle>);
    expect(screen.getByTestId('toggle-label')).toHaveClass('test-class');
  });

  it('should call onChange with true when toggling from off to on', () => {
    render(<Toggle id="test" value={false} onChange={mockOnChange} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(true);
  });

  it('should call onChange with false when toggling from on to off', () => {
    render(<Toggle id="test" value={true} onChange={mockOnChange} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(false);
  });

  it('should toggle when clicking on the label text', () => {
    render(<Toggle id="test" value={false} onChange={mockOnChange}>Toggle Me</Toggle>);

    const labelText = screen.getByText('Toggle Me');
    fireEvent.click(labelText);

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(true);
  });

  it('should have proper accessibility attributes', () => {
    render(<Toggle id="test" value={false} onChange={mockOnChange}>Accessible Toggle</Toggle>);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('type', 'checkbox');
    expect(checkbox).toHaveClass('sr-only peer');
  });

  it('should match snapshot when unchecked', () => {
    const { asFragment } = render(<Toggle id="test" value={false} onChange={mockOnChange} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should match snapshot when checked', () => {
    const { asFragment } = render(<Toggle id="test" value={true} onChange={mockOnChange} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should match snapshot with children', () => {
    const { asFragment } = render(<Toggle id="test" value={false} onChange={mockOnChange}>Label</Toggle>);
    expect(asFragment()).toMatchSnapshot();
  });
});