import type { GameStatus } from '../types/game';

interface GameControlsProps {
  status: GameStatus;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export function GameControls({
  status,
  onStart,
  onPause,
  onReset,
}: GameControlsProps) {
  return (
    <div className="flex gap-3">
      {status === 'IDLE' || status === 'GAME_OVER' ? (
        <button
          onClick={onStart}
          className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-emerald-900/30"
        >
          {status === 'IDLE' ? 'Start Game' : 'Play Again'}
        </button>
      ) : (
        <button
          onClick={onPause}
          className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-amber-900/30"
        >
          {status === 'PLAYING' ? 'Pause' : 'Resume'}
        </button>
      )}
      <button
        onClick={onReset}
        className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold rounded-lg transition-colors"
      >
        Reset
      </button>
    </div>
  );
}
