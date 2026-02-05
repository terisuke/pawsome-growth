import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AddDogModal } from './AddDogModal';

describe('AddDogModal Component', () => {
  const mockOnAdd = vi.fn();
  const mockOnClose = vi.fn();

  it('does not render when isOpen is false', () => {
    render(<AddDogModal isOpen={false} onClose={mockOnClose} onAdd={mockOnAdd} />);
    expect(screen.queryByText('新しい家族を追加')).not.toBeInTheDocument();
  });

  it('renders correctly when open', () => {
    render(<AddDogModal isOpen={true} onClose={mockOnClose} onAdd={mockOnAdd} />);
    expect(screen.getByText('新しい家族を追加')).toBeInTheDocument();
    expect(screen.getByLabelText('なまえ')).toBeInTheDocument();
  });

  it('calls onAdd with correct data when submitted', () => {
    render(<AddDogModal isOpen={true} onClose={mockOnClose} onAdd={mockOnAdd} />);

    fireEvent.change(screen.getByLabelText('なまえ'), { target: { value: 'ポチ' } });
    fireEvent.change(screen.getByLabelText('犬種'), { target: { value: 'チワワ' } });

    fireEvent.click(screen.getByText('登録する'));

    expect(mockOnAdd).toHaveBeenCalledWith(
      'ポチ',
      'チワワ',
      expect.any(String),
      expect.any(String)
    );
  });
});
