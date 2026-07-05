
export const SectionBackdrop = ({ variant = "default" }) => {
  const positions =
    variant === "reverse"
      ? { a: "right-0 top-0", b: "left-10 bottom-0", c: "left-1/2 top-1/3" }
      : { a: "left-0 top-0", b: "right-10 bottom-0", c: "right-1/3 top-1/4" };

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className={`absolute ${positions.a} h-56 w-56 -translate-x-1/3 -translate-y-1/3 rounded-full bg-accent-500/10 blur-3xl`} />
      <div className={`absolute ${positions.b} h-48 w-48 translate-x-1/4 translate-y-1/4 rounded-full bg-blue-500/10 blur-3xl`} />
      <div
        className={`absolute ${positions.c} h-32 w-32 opacity-30`}
        style={{
          backgroundImage: "radial-gradient(rgb(var(--c-ink-500)) 1px, transparent 1px)",
          backgroundSize: "12px 12px",
        }}
      />
    </div>
  );
};