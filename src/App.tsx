import { useSnakeGame } from './hooks/useSnakeGame';
import { GameBoard } from './components/GameBoard';
import { ScoreBoard } from './components/ScoreBoard';
import { GameControls } from './components/GameControls';
import { GameOverlay } from './components/GameOverlay';

export default function App() {
  const { gameState, startGame, togglePause, resetGame } = useSnakeGame();

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-white mb-6 tracking-wide">
        Snake Game
      </h1>

      <ScoreBoard score={gameState.score} highScore={gameState.highScore} />

      <div className="relative mt-6">
        <GameBoard gameState={gameState} />
        <GameOverlay
          status={gameState.status}
          score={gameState.score}
          onStart={startGame}
        />
      </div>

      <div className="mt-6">
        <GameControls
          status={gameState.status}
          onStart={startGame}
          onPause={togglePause}
          onReset={resetGame}
        />
      </div>

      {gameState.status === 'PAUSED' && (
        <p className="mt-4 text-amber-400 text-lg font-semibold animate-pulse">
          PAUSED
        </p>
      )}

      <p className="mt-6 text-slate-600 text-sm">
        Arrow Keys / WASD to move | Space to pause
      </p>
    </div>
  );
}
