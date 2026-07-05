const variants = {
  primary: "bg-accent-500 text-base-950 hover:bg-accent-400",
  secondary: "bg-base-800 text-ink-100 border border-base-600 hover:border-ink-400",
  ghost: "bg-transparent text-ink-300 hover:text-ink-100",
  danger: "bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20",
};

export const Button = ({ children, variant = "primary", className = "", ...props }) => (
  <button
    className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    {...props}
  >
    {children}
  </button>
);
