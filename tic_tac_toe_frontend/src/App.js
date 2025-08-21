import React, { useMemo, useState } from 'react';
import './App.css';

/**
 * Minimalistic Tic Tac Toe game
 * - Two-player local play (X and O)
 * - Start/New Game
 * - Player turn indication
 * - Win/Draw detection
 * - Reset functionality
 * - Light theme, centered board with status top bar and controls below
 */

// Helpers
const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // cols
  [0, 4, 8],
  [2, 4, 6], // diags
];

// PUBLIC_INTERFACE
export function calculateWinner(squares) {
  /** Determine the winner and the winning line if any.
   * Returns: { winner: 'X'|'O'|null, line: number[]|null }
   */
  for (const [a, b, c] of LINES) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: null };
}

// Components

function TopBar({ status }) {
  return (
    <div className="ttt-topbar" role="status" aria-live="polite">
      <h1 className="ttt-title">Tic Tac Toe</h1>
      <div className="ttt-status">{status}</div>
    </div>
  );
}

function Square({ value, onClick, isHighlight, index }) {
  const label = value ? `Cell ${index + 1}, ${value}` : `Cell ${index + 1}, empty`;
  return (
    <button
      className={`ttt-square ${isHighlight ? 'highlight' : ''}`}
      onClick={onClick}
      aria-label={label}
    >
      {value}
    </button>
  );
}

function Board({ squares, onPlay, highlightLine }) {
  const renderSquare = (i) => (
    <Square
      key={i}
      value={squares[i]}
      onClick={() => onPlay(i)}
      isHighlight={highlightLine?.includes(i)}
      index={i}
    />
  );

  return (
    <div className="ttt-board" role="grid" aria-label="Tic Tac Toe board">
      {[0, 1, 2].map((row) => (
        <div className="ttt-row" role="row" key={row}>
          {[0, 1, 2].map((col) => renderSquare(row * 3 + col))}
        </div>
      ))}
    </div>
  );
}

function Controls({ onNewGame, onReset, canReset }) {
  return (
    <div className="ttt-controls">
      <button className="btn primary" onClick={onNewGame} aria-label="Start new game">
        New Game
      </button>
      <button
        className="btn secondary"
        onClick={onReset}
        disabled={!canReset}
        aria-label="Reset current game"
      >
        Reset
      </button>
    </div>
  );
}

// PUBLIC_INTERFACE
export default function App() {
  /** Root component rendering a two-player Tic Tac Toe game (light, minimalistic). */
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);

  const result = useMemo(() => calculateWinner(squares), [squares]);
  const isDraw = useMemo(
    () => squares.every((s) => s !== null) && !result.winner,
    [squares, result.winner]
  );

  const status = useMemo(() => {
    if (!hasStarted && squares.every((s) => s === null)) {
      return 'Press "New Game" to start';
    }
    if (result.winner) {
      return `Winner: ${result.winner} 🎉`;
    }
    if (isDraw) {
      return 'Draw 🤝';
    }
    return `Turn: ${xIsNext ? 'X' : 'O'}`;
  }, [hasStarted, squares, result.winner, isDraw, xIsNext]);

  const canInteract = hasStarted && !result.winner && !isDraw;

  const handlePlay = (i) => {
    if (!canInteract || squares[i]) return;
    const next = squares.slice();
    next[i] = xIsNext ? 'X' : 'O';
    setSquares(next);
    setXIsNext((prev) => !prev);
  };

  // PUBLIC_INTERFACE
  const newGame = () => {
    /** Starts a new game with an empty board and X's turn */
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setHasStarted(true);
  };

  // PUBLIC_INTERFACE
  const resetGame = () => {
    /** Resets the current game to initial state but keeps "started" true if already started */
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  return (
    <div className="App">
      <main className="ttt-container">
        <TopBar status={status} />
        <Board squares={squares} onPlay={handlePlay} highlightLine={result.line} />
        <Controls onNewGame={newGame} onReset={resetGame} canReset={hasStarted} />
        <footer className="ttt-footer">
          <span className="hint">Light theme • Minimal UI</span>
        </footer>
      </main>
    </div>
  );
}
