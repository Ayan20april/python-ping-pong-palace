interface ScoreBoardProps {
  playerScore: number;
  aiScore: number;
  winScore: number;
}

const ScoreBoard = ({ playerScore, aiScore, winScore }: ScoreBoardProps) => {
  return (
    <div className="flex items-center justify-center gap-16 mb-6">
      <div className="text-center">
        <p className="text-sm uppercase tracking-widest text-muted-foreground mb-1">You</p>
        <p className="text-6xl font-bold text-primary neon-text-primary">
          {playerScore}
        </p>
      </div>
      
      <div className="flex flex-col items-center">
        <span className="text-muted-foreground text-2xl">VS</span>
        <span className="text-xs text-muted-foreground mt-1">First to {winScore}</span>
      </div>
      
      <div className="text-center">
        <p className="text-sm uppercase tracking-widest text-muted-foreground mb-1">CPU</p>
        <p className="text-6xl font-bold text-secondary neon-text-secondary">
          {aiScore}
        </p>
      </div>
    </div>
  );
};

export default ScoreBoard;
