import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const CTA = () => {
  const navigate = useNavigate();
  return (
    <section className="px-6 py-10">
      <div className="mx-auto max-w-6xl rounded-3xl bg-accent-500 px-10 py-16 text-center">
        <h2 className="text-4xl font-bold text-base-950">Ready to spend smarter?</h2>
        <p className="mx-auto mt-3 max-w-md text-base-950/70">
          Join thousands taking control of their finances with SmartSpend.
        </p>
        <button
          onClick={() => navigate("/register")}
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-base-950 px-6 py-3 text-sm font-medium text-ink-100 hover:bg-base-900 transition-colors"
        >
          Create your free account <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
};
