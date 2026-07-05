const toneToBar = { green: "bg-accent-500", amber: "bg-amber-400", red: "bg-red-500" };

export const ProgressBar = ({ percent, tone = "green" }) => (
  <div className="h-2 w-full rounded-full bg-base-700 overflow-hidden">
    <div
      className={`h-full rounded-full ${toneToBar[tone]} transition-all duration-500`}
      style={{ width: `${Math.min(percent, 100)}%` }}
    />
  </div>
);
