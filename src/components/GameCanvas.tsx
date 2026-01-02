import { useEffect, useRef } from 'react';

interface GameCanvasProps {
  playerY: number;
  aiY: number;
  ballX: number;
  ballY: number;
  constants: {
    CANVAS_WIDTH: number;
    CANVAS_HEIGHT: number;
    PADDLE_WIDTH: number;
    PADDLE_HEIGHT: number;
    BALL_SIZE: number;
  };
}

const GameCanvas = ({ playerY, aiY, ballX, ballY, constants }: GameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { CANVAS_WIDTH, CANVAS_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT, BALL_SIZE } = constants;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = 'hsl(240, 20%, 4%)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw grid pattern
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x < CANVAS_WIDTH; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_HEIGHT);
      ctx.stroke();
    }
    for (let y = 0; y < CANVAS_HEIGHT; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_WIDTH, y);
      ctx.stroke();
    }

    // Draw center line
    ctx.setLineDash([20, 15]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH / 2, 0);
    ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw player paddle with glow
    ctx.shadowColor = 'hsl(180, 100%, 50%)';
    ctx.shadowBlur = 20;
    ctx.fillStyle = 'hsl(180, 100%, 50%)';
    ctx.fillRect(20, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
    
    // Inner glow for player paddle
    ctx.shadowBlur = 10;
    ctx.fillStyle = 'hsl(180, 100%, 70%)';
    ctx.fillRect(22, playerY + 2, PADDLE_WIDTH - 4, PADDLE_HEIGHT - 4);

    // Draw AI paddle with glow
    ctx.shadowColor = 'hsl(320, 100%, 60%)';
    ctx.shadowBlur = 20;
    ctx.fillStyle = 'hsl(320, 100%, 60%)';
    ctx.fillRect(CANVAS_WIDTH - 20 - PADDLE_WIDTH, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);
    
    // Inner glow for AI paddle
    ctx.shadowBlur = 10;
    ctx.fillStyle = 'hsl(320, 100%, 75%)';
    ctx.fillRect(CANVAS_WIDTH - 18 - PADDLE_WIDTH, aiY + 2, PADDLE_WIDTH - 4, PADDLE_HEIGHT - 4);

    // Draw ball with intense glow
    ctx.shadowColor = 'white';
    ctx.shadowBlur = 25;
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(ballX + BALL_SIZE / 2, ballY + BALL_SIZE / 2, BALL_SIZE / 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Ball inner glow
    ctx.shadowBlur = 15;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.arc(ballX + BALL_SIZE / 2, ballY + BALL_SIZE / 2, BALL_SIZE / 3, 0, Math.PI * 2);
    ctx.fill();

    // Reset shadow
    ctx.shadowBlur = 0;

  }, [playerY, aiY, ballX, ballY, CANVAS_WIDTH, CANVAS_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT, BALL_SIZE]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className="rounded-lg border-2 border-border neon-box-primary"
    />
  );
};

export default GameCanvas;
