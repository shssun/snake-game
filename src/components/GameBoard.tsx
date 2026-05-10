import { useRef, useEffect } from 'react';
import type { GameState } from '../types/game';
import { CANVAS_SIZE, CELL_SIZE, GRID_SIZE } from '../types/game';

interface GameBoardProps {
  gameState: GameState;
}

function drawGrid(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.lineWidth = 0.5;
  for (let i = 0; i <= GRID_SIZE; i++) {
    ctx.beginPath();
    ctx.moveTo(i * CELL_SIZE, 0);
    ctx.lineTo(i * CELL_SIZE, CANVAS_SIZE);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i * CELL_SIZE);
    ctx.lineTo(CANVAS_SIZE, i * CELL_SIZE);
    ctx.stroke();
  }
}

function drawFood(ctx: CanvasRenderingContext2D, gameState: GameState) {
  const { food, foodAnimationFrame } = gameState;
  const centerX = food.x * CELL_SIZE + CELL_SIZE / 2;
  const centerY = food.y * CELL_SIZE + CELL_SIZE / 2;
  const pulse = 1 + Math.sin(foodAnimationFrame * 0.3) * 0.15;
  const baseRadius = CELL_SIZE / 2 - 2;
  const radius = baseRadius * pulse;

  // Glow
  ctx.save();
  ctx.shadowColor = '#f43f5e';
  ctx.shadowBlur = 12;
  ctx.fillStyle = '#f43f5e';
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Inner highlight
  ctx.fillStyle = '#fb7185';
  ctx.beginPath();
  ctx.arc(centerX - 1, centerY - 1, radius * 0.5, 0, Math.PI * 2);
  ctx.fill();
}

function drawSnake(ctx: CanvasRenderingContext2D, gameState: GameState) {
  const { snake } = gameState;
  const length = snake.length;

  snake.forEach((segment, index) => {
    const x = segment.x * CELL_SIZE;
    const y = segment.y * CELL_SIZE;
    const padding = 1;

    // Gradient from head (emerald) to tail (teal)
    const t = index / Math.max(length - 1, 1);
    const r = Math.round(16 + t * 0); // emerald range
    const g = Math.round(185 - t * 140);
    const b = Math.round(129 - t * 60);

    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.shadowColor = index === 0 ? '#34d399' : 'transparent';
    ctx.shadowBlur = index === 0 ? 8 : 0;

    // Rounded rectangle
    const rx = x + padding;
    const ry = y + padding;
    const rw = CELL_SIZE - padding * 2;
    const rh = CELL_SIZE - padding * 2;
    const cornerRadius = 4;

    ctx.beginPath();
    ctx.moveTo(rx + cornerRadius, ry);
    ctx.lineTo(rx + rw - cornerRadius, ry);
    ctx.quadraticCurveTo(rx + rw, ry, rx + rw, ry + cornerRadius);
    ctx.lineTo(rx + rw, ry + rh - cornerRadius);
    ctx.quadraticCurveTo(rx + rw, ry + rh, rx + rw - cornerRadius, ry + rh);
    ctx.lineTo(rx + cornerRadius, ry + rh);
    ctx.quadraticCurveTo(rx, ry + rh, rx, ry + rh - cornerRadius);
    ctx.lineTo(rx, ry + cornerRadius);
    ctx.quadraticCurveTo(rx, ry, rx + cornerRadius, ry);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;

    // Eyes on head
    if (index === 0) {
      const dir = gameState.direction;
      drawEyes(ctx, x, y, dir);
    }
  });
}

function drawEyes(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  direction: string
) {
  const cx = x + CELL_SIZE / 2;
  const cy = y + CELL_SIZE / 2;
  const eyeOffset = 4;
  const eyeRadius = 2.5;

  let leftX: number, leftY: number, rightX: number, rightY: number;

  switch (direction) {
    case 'UP':
      leftX = cx - eyeOffset;
      leftY = cy - eyeOffset;
      rightX = cx + eyeOffset;
      rightY = cy - eyeOffset;
      break;
    case 'DOWN':
      leftX = cx - eyeOffset;
      leftY = cy + eyeOffset;
      rightX = cx + eyeOffset;
      rightY = cy + eyeOffset;
      break;
    case 'LEFT':
      leftX = cx - eyeOffset;
      leftY = cy - eyeOffset;
      rightX = cx - eyeOffset;
      rightY = cy + eyeOffset;
      break;
    case 'RIGHT':
      leftX = cx + eyeOffset;
      leftY = cy - eyeOffset;
      rightX = cx + eyeOffset;
      rightY = cy + eyeOffset;
      break;
    default:
      leftX = cx + eyeOffset;
      leftY = cy - eyeOffset;
      rightX = cx + eyeOffset;
      rightY = cy + eyeOffset;
  }

  // White of eyes
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(leftX, leftY, eyeRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(rightX, rightY, eyeRadius, 0, Math.PI * 2);
  ctx.fill();

  // Pupils
  ctx.fillStyle = '#1a1a2e';
  ctx.beginPath();
  ctx.arc(leftX, leftY, 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(rightX, rightY, 1.5, 0, Math.PI * 2);
  ctx.fill();
}

export function GameBoard({ gameState }: GameBoardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    drawGrid(ctx);

    if (gameState.status !== 'IDLE') {
      drawFood(ctx, gameState);
      drawSnake(ctx, gameState);
    }
  }, [gameState]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_SIZE}
      height={CANVAS_SIZE}
      className="rounded-lg border-2 border-slate-700 shadow-lg shadow-emerald-900/20"
    />
  );
}
