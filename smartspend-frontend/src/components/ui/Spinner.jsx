export const Spinner = ({ className = "" }) => (
  <div className={`h-5 w-5 animate-spin rounded-full border-2 border-base-600 border-t-accent-500 ${className}`} />
);

export const PageLoader = () => (
  <div className="flex h-64 items-center justify-center">
    <Spinner />
  </div>
);
