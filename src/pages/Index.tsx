import { usePingPong } from '@/hooks/usePingPong';
import GameCanvas from '@/components/GameCanvas';
import ScoreBoard from '@/components/ScoreBoard';
import GameControls from '@/components/GameControls';
import ControlsInfo from '@/components/ControlsInfo';

const Index = () => {
  const { gameState, startGame, togglePause, constants } = usePingPong();

  return (
    <main className="min-h-screen bg-background game-grid flex flex-col items-center justify-center p-4">
      <header className="text-center mb-8">
        <h1 className="text-5xl font-bold tracking-tight mb-2">
          <span className="text-primary neon-text-primary">PING</span>
          <span className="text-foreground mx-2">•</span>
          <span className="text-secondary neon-text-secondary">PONG</span>
        </h1>
        <p className="text-muted-foreground text-sm uppercase tracking-widest">
          Arcade Edition
        </p>
      </header>

      <ScoreBoard
        playerScore={gameState.playerScore}
        aiScore={gameState.aiScore}
        winScore={constants.WIN_SCORE}
      />

      <div className="relative">
        <GameCanvas
          playerY={gameState.playerY}
          aiY={gameState.aiY}
          ballX={gameState.ballX}
          ballY={gameState.ballY}
          constants={constants}
        />
        
        {!gameState.isPlaying && !gameState.winner && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg backdrop-blur-sm">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground mb-2 animate-float">
                Ready to Play?
              </p>
              <p className="text-muted-foreground">Press Start or Enter</p>
            </div>
          </div>
        )}

        {gameState.isPaused && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg backdrop-blur-sm">
            <div className="text-center">
              <p className="text-3xl font-bold text-accent neon-text-primary">PAUSED</p>
              <p className="text-muted-foreground mt-2">Press Space to resume</p>
            </div>
          </div>
        )}
      </div>

      <GameControls
        isPlaying={gameState.isPlaying}
        isPaused={gameState.isPaused}
        winner={gameState.winner}
        onStart={startGame}
        onPause={togglePause}
      />

      <ControlsInfo />

      <footer className="mt-8 text-center text-muted-foreground text-xs">
        <p>First to {constants.WIN_SCORE} points wins</p>
      </footer>
    </main>
  );
};

export default Index;
