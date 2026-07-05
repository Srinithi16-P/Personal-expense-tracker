export const Input = ({ label, error, className = "", ...props }) => (
  <label className="block">
    {label && <span className="mb-1.5 block text-sm text-ink-400">{label}</span>}
    <input
      className={`w-full rounded-lg bg-base-800 border border-base-600 px-3.5 py-2.5 text-sm text-ink-100 placeholder:text-ink-500 outline-none focus:border-accent-500 transition-colors ${className}`}
      {...props}
    />
    {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
  </label>
);
