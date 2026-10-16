import { act, fireEvent, render, screen } from '@testing-library/react';
import Contacts from './Contacts';

afterEach(() => {
  jest.useRealTimers();
});

test('social cards are named by their network and handle', () => {
  render(<Contacts />);
  const github = screen.getByRole('link', { name: /GitHub/ });
  expect(github).toHaveAccessibleName(/@CloruroDiSodio/);
  expect(github).toHaveAccessibleName(/opens in a new tab/);
});

test('the copy button copies the email and announces it', async () => {
  const writeText = jest.fn().mockResolvedValue(undefined);
  Object.assign(navigator, { clipboard: { writeText } });

  render(<Contacts />);
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: 'Copy address' }));
  });

  expect(writeText).toHaveBeenCalledWith('den.moscon@gmail.com');
  expect(screen.getByRole('status')).toHaveTextContent('Copied to the clipboard!');
});

test('the copy button falls back gracefully when the clipboard is unavailable', async () => {
  Object.assign(navigator, { clipboard: { writeText: jest.fn().mockRejectedValue(new Error('denied')) } });

  render(<Contacts />);
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: 'Copy address' }));
  });

  expect(screen.getByRole('status')).toHaveTextContent(/select it instead/);
});

test('shows the local time near Milan', () => {
  jest.useFakeTimers({ now: new Date('2026-10-16T08:30:00Z') }); // 10:30 in Milan (CEST)
  render(<Contacts />);
  expect(screen.getByText(/near Milan/)).toHaveTextContent("It's 10:30 near Milan: I'm probably writing code.");
});
