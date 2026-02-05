import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { supabase } from '../lib/supabase';
import { Auth } from './Auth';

// Mock Supabase
vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
    },
  },
}));

describe('Auth Component', () => {
  it('renders login form by default', () => {
    render(<Auth />);
    expect(screen.getByText('ログイン')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('example@email.com')).toBeInTheDocument();
  });

  it('switches to sign up form', () => {
    render(<Auth />);
    fireEvent.click(screen.getByText(/サインアップ/));
    expect(screen.getByText('サインアップ', { selector: 'button span' })).toBeInTheDocument();
  });

  it('calls supabase signInWithPassword on login submit', async () => {
    const mockSignIn = vi.mocked(supabase.auth.signInWithPassword);
    mockSignIn.mockResolvedValueOnce({ data: { user: {} as any, session: {} as any }, error: null });

    render(<Auth />);

    fireEvent.change(screen.getByPlaceholderText('example@email.com'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('ログイン', { selector: 'button span' }));

    expect(mockSignIn).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });
});
