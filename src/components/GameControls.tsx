import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface GameControlsProps {
  isPlaying: boolean;
  isPaused: boolean;
  winner: 'player' | 'ai' | null;
  onStart: () => void;
  onPause: () => void;
}

const GameControls = ({ isPlaying, isPaused, winner, onStart, onPause }: GameControlsProps) => {
  if (!isPlaying || winner) {
    return (
      <div className="flex flex-col items-center gap-4 mt-6">
        {winner && (
          <div className={`text-2xl font-bold ${winner === 'player' ? 'text-primary neon-text-primary' : 'text-secondary neon-text-secondary'}`}>
            {winner === 'player' ? '🎉 You Win!' : 'CPU Wins!'}
          </div>
        )}
        <Button 
          onClick={onStart}
          variant="neon"
          size="lg"
          className="animate-pulse-glow"
        >
          <Play className="mr-2 h-5 w-5" />
          {winner ? 'Play Again' : 'Start Game'}
        </Button>
        <p className="text-muted-foreground text-sm">or press Enter</p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 mt-6">
      <Button 
        onClick={onPause}
        variant="outline"
        size="lg"
      >
        {isPaused ? (
          <>
            <Play className="mr-2 h-5 w-5" />
            Resume
          </>
        ) : (
          <>
            <Pause className="mr-2 h-5 w-5" />
            Pause
          </>
        )}
      </Button>
      <Button 
        onClick={onStart}
        variant="ghost"
        size="lg"
      >
        <RotateCcw className="mr-2 h-5 w-5" />
        Restart
      </Button>
      <span className="text-muted-foreground text-sm ml-4">Space to pause</span>
    </div>
  );
};

export default GameControls;
