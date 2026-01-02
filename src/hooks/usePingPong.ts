import { useState, useEffect, useCallback, useRef } from 'react';

interface GameState {
  playerY: number;
  aiY: number;
  ballX: number;
  ballY: number;
  ballSpeedX: number;
  ballSpeedY: number;
  playerScore: number;
  aiScore: number;
  isPlaying: boolean;
  isPaused: boolean;
  winner: 'player' | 'ai' | null;
}

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 500;
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 12;
const PADDLE_SPEED = 8;
const INITIAL_BALL_SPEED = 5;
const MAX_BALL_SPEED = 12;
const WIN_SCORE = 7;
const AI_SPEED = 4.5;

export const usePingPong = () => {
  const [gameState, setGameState] = useState<GameState>({
    playerY: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    aiY: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    ballX: CANVAS_WIDTH / 2,
    ballY: CANVAS_HEIGHT / 2,
    ballSpeedX: INITIAL_BALL_SPEED,
    ballSpeedY: INITIAL_BALL_SPEED * 0.5,
    playerScore: 0,
    aiScore: 0,
    isPlaying: false,
    isPaused: false,
    winner: null,
  });

  const keysPressed = useRef<Set<string>>(new Set());
  const animationFrameRef = useRef<number>();

  const resetBall = useCallback((direction: 1 | -1 = 1) => {
    setGameState(prev => ({
      ...prev,
      ballX: CANVAS_WIDTH / 2,
      ballY: CANVAS_HEIGHT / 2,
      ballSpeedX: INITIAL_BALL_SPEED * direction,
      ballSpeedY: (Math.random() - 0.5) * INITIAL_BALL_SPEED,
    }));
  }, []);

  const startGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      playerY: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
      aiY: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
      ballX: CANVAS_WIDTH / 2,
      ballY: CANVAS_HEIGHT / 2,
      ballSpeedX: INITIAL_BALL_SPEED,
      ballSpeedY: INITIAL_BALL_SPEED * 0.5,
      playerScore: 0,
      aiScore: 0,
      isPlaying: true,
      isPaused: false,
      winner: null,
    }));
  }, []);

  const togglePause = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPaused: !prev.isPaused,
    }));
  }, []);

  const updateGame = useCallback(() => {
    setGameState(prev => {
      if (!prev.isPlaying || prev.isPaused || prev.winner) return prev;

      let { playerY, aiY, ballX, ballY, ballSpeedX, ballSpeedY, playerScore, aiScore } = prev;

      // Player movement
      if (keysPressed.current.has('ArrowUp') || keysPressed.current.has('w')) {
        playerY = Math.max(0, playerY - PADDLE_SPEED);
      }
      if (keysPressed.current.has('ArrowDown') || keysPressed.current.has('s')) {
        playerY = Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, playerY + PADDLE_SPEED);
      }

      // AI movement
      const aiCenter = aiY + PADDLE_HEIGHT / 2;
      const targetY = ballY;
      if (aiCenter < targetY - 20) {
        aiY = Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, aiY + AI_SPEED);
      } else if (aiCenter > targetY + 20) {
        aiY = Math.max(0, aiY - AI_SPEED);
      }

      // Ball movement
      ballX += ballSpeedX;
      ballY += ballSpeedY;

      // Top/bottom wall collision
      if (ballY <= 0 || ballY >= CANVAS_HEIGHT - BALL_SIZE) {
        ballSpeedY = -ballSpeedY;
        ballY = ballY <= 0 ? 0 : CANVAS_HEIGHT - BALL_SIZE;
      }

      // Player paddle collision
      if (
        ballX <= PADDLE_WIDTH + 20 &&
        ballX >= 20 &&
        ballY + BALL_SIZE >= playerY &&
        ballY <= playerY + PADDLE_HEIGHT
      ) {
        const hitPosition = (ballY + BALL_SIZE / 2 - playerY) / PADDLE_HEIGHT;
        const angle = (hitPosition - 0.5) * Math.PI * 0.6;
        const speed = Math.min(Math.abs(ballSpeedX) * 1.05, MAX_BALL_SPEED);
        ballSpeedX = speed;
        ballSpeedY = Math.sin(angle) * speed;
        ballX = PADDLE_WIDTH + 21;
      }

      // AI paddle collision
      if (
        ballX + BALL_SIZE >= CANVAS_WIDTH - PADDLE_WIDTH - 20 &&
        ballX <= CANVAS_WIDTH - 20 &&
        ballY + BALL_SIZE >= aiY &&
        ballY <= aiY + PADDLE_HEIGHT
      ) {
        const hitPosition = (ballY + BALL_SIZE / 2 - aiY) / PADDLE_HEIGHT;
        const angle = (hitPosition - 0.5) * Math.PI * 0.6;
        const speed = Math.min(Math.abs(ballSpeedX) * 1.05, MAX_BALL_SPEED);
        ballSpeedX = -speed;
        ballSpeedY = Math.sin(angle) * speed;
        ballX = CANVAS_WIDTH - PADDLE_WIDTH - BALL_SIZE - 21;
      }

      // Scoring
      let winner: 'player' | 'ai' | null = null;
      if (ballX < 0) {
        aiScore++;
        if (aiScore >= WIN_SCORE) {
          winner = 'ai';
        } else {
          return {
            ...prev,
            playerY,
            aiY,
            ballX: CANVAS_WIDTH / 2,
            ballY: CANVAS_HEIGHT / 2,
            ballSpeedX: -INITIAL_BALL_SPEED,
            ballSpeedY: (Math.random() - 0.5) * INITIAL_BALL_SPEED,
            aiScore,
          };
        }
      }

      if (ballX > CANVAS_WIDTH) {
        playerScore++;
        if (playerScore >= WIN_SCORE) {
          winner = 'player';
        } else {
          return {
            ...prev,
            playerY,
            aiY,
            ballX: CANVAS_WIDTH / 2,
            ballY: CANVAS_HEIGHT / 2,
            ballSpeedX: INITIAL_BALL_SPEED,
            ballSpeedY: (Math.random() - 0.5) * INITIAL_BALL_SPEED,
            playerScore,
          };
        }
      }

      return {
        ...prev,
        playerY,
        aiY,
        ballX,
        ballY,
        ballSpeedX,
        ballSpeedY,
        playerScore,
        aiScore,
        winner,
        isPlaying: winner ? false : prev.isPlaying,
      };
    });
  }, []);

  // Game loop
  useEffect(() => {
    if (gameState.isPlaying && !gameState.isPaused && !gameState.winner) {
      const gameLoop = () => {
        updateGame();
        animationFrameRef.current = requestAnimationFrame(gameLoop);
      };
      animationFrameRef.current = requestAnimationFrame(gameLoop);

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [gameState.isPlaying, gameState.isPaused, gameState.winner, updateGame]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key.toLowerCase());
      
      if (e.key === ' ' && gameState.isPlaying) {
        e.preventDefault();
        togglePause();
      }
      
      if (e.key === 'Enter' && !gameState.isPlaying) {
        startGame();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState.isPlaying, togglePause, startGame]);

  return {
    gameState,
    startGame,
    togglePause,
    constants: {
      CANVAS_WIDTH,
      CANVAS_HEIGHT,
      PADDLE_WIDTH,
      PADDLE_HEIGHT,
      BALL_SIZE,
      WIN_SCORE,
    },
  };
};
