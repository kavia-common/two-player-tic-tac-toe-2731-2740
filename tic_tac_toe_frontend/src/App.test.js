import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders Tic Tac Toe title and New Game button', () => {
  render(<App />);
  expect(screen.getByText(/Tic Tac Toe/i)).toBeInTheDocument();
  const newGameBtn = screen.getByRole('button', { name: /New Game/i });
  expect(newGameBtn).toBeInTheDocument();
});

test('allows starting a new game and making a move', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: /New Game/i }));
  const firstCell = screen.getByRole('button', { name: /Cell 1/i });
  fireEvent.click(firstCell);
  expect(firstCell).toHaveTextContent('X');
});
