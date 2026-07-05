export const EmptyState = ({ icon: Icon, title, subtitle, action }) => (
  <div className="flex flex-col items-center justify-center py-14 text-center">
    {Icon && (
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-base-700 text-ink-400">
        <Icon size={22} />
      </div>
    )}
    <p className="text-ink-100 font-medium">{title}</p>
    {subtitle && <p className="mt-1 max-w-xs text-sm text-ink-500">{subtitle}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);
