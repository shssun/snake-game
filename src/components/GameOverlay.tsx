import type { GameStatus } from '../types/game';

interface GameOverlayProps {
  status: GameStatus;
  score: number;
  onStart: () => void;
}

export function GameOverlay({ status, score, onStart }: GameOverlayProps) {
  if (status !== 'IDLE' && status !== 'GAME_OVER') return null;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 rounded-lg z-10">
      {status === 'IDLE' ? (
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-emerald-400">Snake Game</h2>
          <p className="text-slate-400">Press Start or Space to play</p>
          <div className="text-slate-500 text-sm space-y-1">
            <p>Arrow Keys or WASD to move</p>
            <p>Space to pause / resume</p>
          </div>
          <button
            onClick={onStart}
            className="mt-4 px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-lg font-semibold rounded-xl transition-colors shadow-lg shadow-emerald-900/30"
          >
            Start Game
          </button>
        </div>
      ) : (
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-rose-400">Game Over</h2>
          <p className="text-2xl text-slate-300">
            Score: <span className="text-emerald-400 font-bold">{score}</span>
          </p>
          <button
            onClick={onStart}
            className="mt-4 px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-lg font-semibold rounded-xl transition-colors shadow-lg shadow-emerald-900/30"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
