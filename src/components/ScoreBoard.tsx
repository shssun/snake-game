interface ScoreBoardProps {
  score: number;
  highScore: number;
}

export function ScoreBoard({ score, highScore }: ScoreBoardProps) {
  return (
    <div className="flex gap-8">
      <div className="text-center">
        <p className="text-slate-400 text-sm uppercase tracking-wider">Score</p>
        <p className="text-3xl font-bold text-emerald-400 font-mono tabular-nums">
          {score}
        </p>
      </div>
      <div className="text-center">
        <p className="text-slate-400 text-sm uppercase tracking-wider">
          Best
        </p>
        <p className="text-3xl font-bold text-rose-400 font-mono tabular-nums">
          {highScore}
        </p>
      </div>
    </div>
  );
}
