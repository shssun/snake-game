export interface Position {
  x: number;
  y: number;
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type GameStatus = 'IDLE' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

export interface GameState {
  snake: Position[];
  food: Position;
  direction: Direction;
  nextDirection: Direction;
  score: number;
  highScore: number;
  status: GameStatus;
  gridSize: number;
  speed: number;
  foodAnimationFrame: number;
}

export const GRID_SIZE = 20;
export const CELL_SIZE = 25;
export const CANVAS_SIZE = GRID_SIZE * CELL_SIZE; // 500
export const INITIAL_SPEED = 150;
export const SPEED_INCREMENT = 2;
export const MIN_SPEED = 60;
