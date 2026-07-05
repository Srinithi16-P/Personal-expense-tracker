const tones = {
  green: "bg-accent-500/10 text-accent-400 border-accent-500/30",
  amber: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  red: "bg-red-500/10 text-red-400 border-red-500/30",
  gray: "bg-base-700 text-ink-400 border-base-600",
};

export const Badge = ({ children, tone = "gray" }) => (
  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}>
    {children}
  </span>
);
