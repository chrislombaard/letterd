/* eslint-disable @typescript-eslint/no-require-imports */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';
import AuthorPost from './author-post';

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

describe('AuthorPost', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  it('renders the author post form', () => {
    renderWithProvider(<AuthorPost />);
    
    expect(screen.getByText(/Write and publish your newsletter/)).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/content/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/schedule/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /publish/i })).toBeInTheDocument();
  });

  it('requires all required fields to submit', async () => {
    const user = userEvent.setup();
    renderWithProvider(<AuthorPost />);
    
    const submitButton = screen.getByRole('button', { name: /publish/i });
    await user.click(submitButton);
    
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    });

    renderWithProvider(<AuthorPost />);
    
    const titleInput = screen.getByLabelText(/title/i);
    const subjectInput = screen.getByLabelText(/email subject/i);
    const contentInput = screen.getByLabelText(/content/i);
    const submitButton = screen.getByRole('button', { name: /publish/i });
    
    await user.type(titleInput, 'Test Newsletter');
    await user.type(subjectInput, 'Test Subject');
    await user.type(contentInput, 'This is test content');
    await user.click(submitButton);
    
    expect(global.fetch).toHaveBeenCalledWith('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Test Newsletter',
        subject: 'Test Subject',
        bodyHtml: 'This is test content',
        publishNow: true,
      }),
    });
  });

  it('shows loading state during submission', async () => {
    const user = userEvent.setup();
    
    (global.fetch as jest.Mock).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ ok: true, json: () => ({}) }), 100))
    );

    renderWithProvider(<AuthorPost />);
    
    const titleInput = screen.getByLabelText(/title/i);
    const subjectInput = screen.getByLabelText(/email subject/i);
    const contentInput = screen.getByLabelText(/content/i);
    const submitButton = screen.getByRole('button', { name: /publish/i });
    
    await user.type(titleInput, 'Test Newsletter');
    await user.type(subjectInput, 'Test Subject');
    await user.type(contentInput, 'This is test content');
    await user.click(submitButton);
    
    expect(submitButton).toBeDisabled();
    expect(screen.getByText('Publishing...')).toBeInTheDocument();
  });

  it('clears form after successful submission', async () => {
    const user = userEvent.setup();
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    });

    renderWithProvider(<AuthorPost />);
    
    const titleInput = screen.getByLabelText(/title/i) as HTMLInputElement;
    const subjectInput = screen.getByLabelText(/email subject/i) as HTMLInputElement;
    const contentInput = screen.getByLabelText(/content/i) as HTMLTextAreaElement;
    const submitButton = screen.getByRole('button', { name: /publish/i });
    
    await user.type(titleInput, 'Test Newsletter');
    await user.type(subjectInput, 'Test Subject');
    await user.type(contentInput, 'This is test content');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(titleInput.value).toBe('');
      expect(subjectInput.value).toBe('');
      expect(contentInput.value).toBe('');
    });
  });

  it('handles submission errors', async () => {
    const user = userEvent.setup();
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({}),
    });

    renderWithProvider(<AuthorPost />);
    
    const titleInput = screen.getByLabelText(/title/i);
    const subjectInput = screen.getByLabelText(/email subject/i);
    const contentInput = screen.getByLabelText(/content/i);
    const submitButton = screen.getByRole('button', { name: /publish/i });
    
    await user.type(titleInput, 'Test Newsletter');
    await user.type(subjectInput, 'Test Subject');
    await user.type(contentInput, 'This is test content');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
    
    const { notifications } = require('@mantine/notifications');
    expect(notifications.show).toHaveBeenCalledWith({
      color: 'gray',
      title: 'Error',
      message: 'Failed to create post',
    });
  });

  it('changes button text when scheduling is enabled', async () => {
    const user = userEvent.setup();
    renderWithProvider(<AuthorPost />);
    
    const scheduleInput = screen.getByLabelText(/schedule/i);
    await user.type(scheduleInput, '2025-12-25T10:00');
    
    expect(screen.getByRole('button', { name: /schedule/i })).toBeInTheDocument();
  });

  it('includes schedule date in submission when provided', async () => {
    const user = userEvent.setup();
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    });

    renderWithProvider(<AuthorPost />);
    
    const titleInput = screen.getByLabelText(/title/i);
    const subjectInput = screen.getByLabelText(/email subject/i);
    const contentInput = screen.getByLabelText(/content/i);
    const scheduleInput = screen.getByLabelText(/schedule/i);
    const submitButton = screen.getByRole('button');
    
    await user.type(titleInput, 'Test Newsletter');
    await user.type(subjectInput, 'Test Subject');
    await user.type(contentInput, 'This is test content');
    await user.type(scheduleInput, '2025-12-25T10:00');
    await user.click(submitButton);
    
    expect(global.fetch).toHaveBeenCalledWith('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Test Newsletter',
        subject: 'Test Subject',
        bodyHtml: 'This is test content',
        scheduledAt: '2025-12-25T10:00',
      }),
    });
  });
});