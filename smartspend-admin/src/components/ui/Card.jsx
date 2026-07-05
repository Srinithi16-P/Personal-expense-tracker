export const Card = ({ children, className = "", ...props }) => (
  <div className={`bg-base-850 border border-base-700 rounded-xl2 p-6 ${className}`} {...props}>
    {children}
  </div>
);
