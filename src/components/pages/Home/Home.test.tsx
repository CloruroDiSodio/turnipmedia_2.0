import { render, screen } from '@testing-library/react';
import Home from './Home';

test('renders the home greeting', () => {
  render(<Home />);
  expect(screen.getByText('Hi! :)')).toBeTruthy();
});
