import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';
import NewsletterSignup from './signup';

jest.mock('@mantine/notifications', () => ({
  notifications: {
    show: jest.fn(),
  },
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MantineProvider>{children}</MantineProvider>
);

const renderWithProvider = (component: React.ReactElement) => {
  return render(component, { wrapper: TestWrapper });
};

describe('NewsletterSignup', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  it('renders the newsletter signup form', () => {
    renderWithProvider(<NewsletterSignup />);
    
    expect(screen.getByText('Get updates delivered to your inbox')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /subscribe/i })).toBeInTheDocument();
    expect(screen.getByText('No spam, unsubscribe anytime')).toBeInTheDocument();
  });

  it('requires email input to submit form', async () => {
    const user = userEvent.setup();
    renderWithProvider(<NewsletterSignup />);
    
    const submitButton = screen.getByRole('button', { name: /subscribe/i });
    await user.click(submitButton);
    
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('submits form with valid email', async () => {
    const user = userEvent.setup();
    const mockResponse = { ok: true };
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    renderWithProvider(<NewsletterSignup />);
    
    const emailInput = screen.getByPlaceholderText('your@email.com');
    const submitButton = screen.getByRole('button', { name: /subscribe/i });
    
    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);
    
    expect(global.fetch).toHaveBeenCalledWith('/api/subscribers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com' }),
    });
  });

  it('shows loading state during submission', async () => {
    const user = userEvent.setup();
    
    (global.fetch as jest.Mock).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ ok: true, json: () => ({}) }), 100))
    );

    renderWithProvider(<NewsletterSignup />);
    
    const emailInput = screen.getByPlaceholderText('your@email.com');
    const submitButton = screen.getByRole('button', { name: /subscribe/i });
    
    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);
    
    expect(submitButton).toBeDisabled();
  });

  it('clears form after successful submission', async () => {
    const user = userEvent.setup();
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    });

    renderWithProvider(<NewsletterSignup />);
    
    const emailInput = screen.getByPlaceholderText('your@email.com') as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /subscribe/i });
    
    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(emailInput.value).toBe('');
    });
  });

  it('handles submission errors', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Email already exists';
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: errorMessage }),
    });

    renderWithProvider(<NewsletterSignup />);
    
    const emailInput = screen.getByPlaceholderText('your@email.com');
    const submitButton = screen.getByRole('button', { name: /subscribe/i });
    
    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
    
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { notifications } = require('@mantine/notifications');
    expect(notifications.show).toHaveBeenCalledWith({
      color: 'gray',
      title: 'Error',
      message: errorMessage,
    });
  });
});