import { useState, useCallback, useEffect, useRef } from 'react';
import type { GameState, Position, Direction } from '../types/game';
import { GRID_SIZE, INITIAL_SPEED, SPEED_INCREMENT, MIN_SPEED } from '../types/game';

const HIGH_SCORE_KEY = 'snake-game-high-score';

function getHighScore(): number {
  try {
    const stored = localStorage.getItem(HIGH_SCORE_KEY);
    return stored ? parseInt(stored, 10) : 0;
  } catch {
    return 0;
  }
}

function saveHighScore(score: number): void {
  try {
    localStorage.setItem(HIGH_SCORE_KEY, String(score));
  } catch {
    // localStorage not available
  }
}

const INITIAL_SNAKE: Position[] = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
];

function generateFood(snake: Position[]): Position {
  const occupied = new Set(snake.map((p) => `${p.x},${p.y}`));
  let food: Position;
  do {
    food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (occupied.has(`${food.x},${food.y}`));
  return food;
}

function getNextHead(head: Position, direction: Direction): Position {
  switch (direction) {
    case 'UP':
      return { x: head.x, y: head.y - 1 };
    case 'DOWN':
      return { x: head.x, y: head.y + 1 };
    case 'LEFT':
      return { x: head.x - 1, y: head.y };
    case 'RIGHT':
      return { x: head.x + 1, y: head.y };
  }
}

function isOppositeDirection(a: Direction, b: Direction): boolean {
  return (
    (a === 'UP' && b === 'DOWN') ||
    (a === 'DOWN' && b === 'UP') ||
    (a === 'LEFT' && b === 'RIGHT') ||
    (a === 'RIGHT' && b === 'LEFT')
  );
}

function createInitialState(): GameState {
  const initialFood = generateFood(INITIAL_SNAKE);
  return {
    snake: INITIAL_SNAKE,
    food: initialFood,
    direction: 'RIGHT',
    nextDirection: 'RIGHT',
    score: 0,
    highScore: getHighScore(),
    status: 'IDLE',
    gridSize: GRID_SIZE,
    speed: INITIAL_SPEED,
    foodAnimationFrame: 0,
  };
}

export function useSnakeGame() {
  const [gameState, setGameState] = useState<GameState>(createInitialState);
  const gameLoopRef = useRef<number | null>(null);
  const gameStateRef = useRef<GameState>(gameState);

  // Keep ref in sync
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const moveSnake = useCallback(() => {
    const state = gameStateRef.current;
    if (state.status !== 'PLAYING') return;

    const direction = state.nextDirection;
    const head = state.snake[0];
    const newHead = getNextHead(head, direction);

    // Wall collision
    if (
      newHead.x < 0 ||
      newHead.x >= GRID_SIZE ||
      newHead.y < 0 ||
      newHead.y >= GRID_SIZE
    ) {
      const highScore = Math.max(state.score, state.highScore);
      saveHighScore(highScore);
      setGameState((prev) => ({
        ...prev,
        status: 'GAME_OVER',
        highScore,
      }));
      return;
    }

    // Self collision (check against all except the last segment which will move)
    for (let i = 0; i < state.snake.length - 1; i++) {
      if (state.snake[i].x === newHead.x && state.snake[i].y === newHead.y) {
        const highScore = Math.max(state.score, state.highScore);
        saveHighScore(highScore);
        setGameState((prev) => ({
          ...prev,
          status: 'GAME_OVER',
          highScore,
        }));
        return;
      }
    }

    const ate = newHead.x === state.food.x && newHead.y === state.food.y;

    const newSnake = [newHead, ...state.snake];
    if (!ate) {
      newSnake.pop();
    }

    const newScore = ate ? state.score + 10 : state.score;
    const newFood = ate ? generateFood(newSnake) : state.food;
    const newSpeed = Math.max(
      MIN_SPEED,
      INITIAL_SPEED - Math.floor(newScore / 50) * SPEED_INCREMENT
    );

    setGameState((prev) => ({
      ...prev,
      snake: newSnake,
      food: newFood,
      direction,
      score: newScore,
      speed: newSpeed,
      foodAnimationFrame: prev.foodAnimationFrame + 1,
    }));
  }, []);

  const startGameLoop = useCallback(() => {
    if (gameLoopRef.current !== null) return;
    const loop = () => {
      moveSnake();
    };
    const id = window.setInterval(loop, gameStateRef.current.speed);
    gameLoopRef.current = id;
  }, [moveSnake]);

  const stopGameLoop = useCallback(() => {
    if (gameLoopRef.current !== null) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    }
  }, []);

  const restartGameLoop = useCallback(() => {
    stopGameLoop();
    const loop = () => {
      moveSnake();
    };
    const id = window.setInterval(loop, gameStateRef.current.speed);
    gameLoopRef.current = id;
  }, [moveSnake, stopGameLoop]);

  // Restart loop when speed changes
  useEffect(() => {
    if (gameState.status === 'PLAYING') {
      restartGameLoop();
    }
    return stopGameLoop;
  }, [gameState.speed]); // eslint-disable-line react-hooks/exhaustive-deps

  const setDirection = useCallback((dir: Direction) => {
    const state = gameStateRef.current;
    if (state.status !== 'PLAYING') return;
    if (isOppositeDirection(dir, state.direction)) return;
    setGameState((prev) => ({ ...prev, nextDirection: dir }));
  }, []);

  // Keyboard handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const state = gameStateRef.current;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          if (state.status === 'PLAYING') setDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          if (state.status === 'PLAYING') setDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          if (state.status === 'PLAYING') setDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          if (state.status === 'PLAYING') setDirection('RIGHT');
          break;
        case ' ':
          e.preventDefault();
          if (state.status === 'PLAYING') {
            setGameState((prev) => ({ ...prev, status: 'PAUSED' }));
            stopGameLoop();
          } else if (state.status === 'PAUSED') {
            setGameState((prev) => ({ ...prev, status: 'PLAYING' }));
            startGameLoop();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setDirection, startGameLoop, stopGameLoop]);

  const startGame = useCallback(() => {
    const newState = createInitialState();
    newState.status = 'PLAYING';
    newState.highScore = getHighScore();
    gameStateRef.current = newState;
    setGameState(newState);

    // Start loop after a frame
    requestAnimationFrame(() => {
      const loop = () => moveSnake();
      stopGameLoop();
      const id = window.setInterval(loop, newState.speed);
      gameLoopRef.current = id;
    });
  }, [moveSnake, stopGameLoop]);

  const togglePause = useCallback(() => {
    const state = gameStateRef.current;
    if (state.status === 'PLAYING') {
      setGameState((prev) => ({ ...prev, status: 'PAUSED' }));
      stopGameLoop();
    } else if (state.status === 'PAUSED') {
      setGameState((prev) => ({ ...prev, status: 'PLAYING' }));
      startGameLoop();
    }
  }, [startGameLoop, stopGameLoop]);

  const resetGame = useCallback(() => {
    stopGameLoop();
    const newState = createInitialState();
    newState.highScore = getHighScore();
    gameStateRef.current = newState;
    setGameState(newState);
  }, [stopGameLoop]);

  return {
    gameState,
    startGame,
    togglePause,
    resetGame,
  };
}
