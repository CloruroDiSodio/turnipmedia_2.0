import { fireEvent, render, screen } from '@testing-library/react';
import Home from './Home';

test('renders the home greeting', () => {
  render(<Home />);
  expect(screen.getByText('Hi! :)')).toBeTruthy();
});

test('the tea break button swaps the portrait', () => {
  render(<Home />);
  const button = screen.getByRole('button', { name: 'Tea break' });
  expect(screen.getByRole('img', { name: /smiling/ })).toBeTruthy();

  fireEvent.click(button);
  expect(button.getAttribute('aria-pressed')).toBe('true');
  expect(screen.getByRole('img', { name: /cup of tea/ })).toBeTruthy();
  expect(screen.getByText('A cup of tea.')).toBeTruthy();
});
