function ProgressBar({ value, max, color }) {
  const pct = Math.min((value / max) * 100, 100);
  const over = value > max;
  
  return (
    <div className="w-full h-1.5 bg-[#0f2040] rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: over ? '#ef4444' : color }} />
    </div>
  );
}

export default ProgressBar