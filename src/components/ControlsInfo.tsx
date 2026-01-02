const ControlsInfo = () => {
  return (
    <div className="mt-8 p-4 rounded-lg bg-card border border-border">
      <h3 className="text-lg font-bold mb-3 text-foreground">Controls</h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <kbd className="px-2 py-1 bg-muted rounded text-muted-foreground border border-border">↑</kbd>
            <kbd className="px-2 py-1 bg-muted rounded text-muted-foreground border border-border">↓</kbd>
          </div>
          <span className="text-muted-foreground">Move paddle</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <kbd className="px-2 py-1 bg-muted rounded text-muted-foreground border border-border">W</kbd>
            <kbd className="px-2 py-1 bg-muted rounded text-muted-foreground border border-border">S</kbd>
          </div>
          <span className="text-muted-foreground">Alternative</span>
        </div>
        <div className="flex items-center gap-3">
          <kbd className="px-3 py-1 bg-muted rounded text-muted-foreground border border-border">Space</kbd>
          <span className="text-muted-foreground">Pause/Resume</span>
        </div>
        <div className="flex items-center gap-3">
          <kbd className="px-3 py-1 bg-muted rounded text-muted-foreground border border-border">Enter</kbd>
          <span className="text-muted-foreground">Start game</span>
        </div>
      </div>
    </div>
  );
};

export default ControlsInfo;
