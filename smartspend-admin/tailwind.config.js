/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          950: "rgb(var(--c-base-950) / <alpha-value>)",
          900: "rgb(var(--c-base-900) / <alpha-value>)",
          850: "rgb(var(--c-base-850) / <alpha-value>)",
          800: "rgb(var(--c-base-800) / <alpha-value>)",
          700: "rgb(var(--c-base-700) / <alpha-value>)",
          600: "rgb(var(--c-base-600) / <alpha-value>)",
          500: "rgb(var(--c-base-500) / <alpha-value>)",
        },
        accent: {
          400: "rgb(var(--c-accent-400) / <alpha-value>)",
          500: "rgb(var(--c-accent-500) / <alpha-value>)",
          600: "rgb(var(--c-accent-600) / <alpha-value>)",
          700: "rgb(var(--c-accent-700) / <alpha-value>)",
        },
        ink: {
          100: "rgb(var(--c-ink-100) / <alpha-value>)",
          300: "rgb(var(--c-ink-300) / <alpha-value>)",
          400: "rgb(var(--c-ink-400) / <alpha-value>)",
          500: "rgb(var(--c-ink-500) / <alpha-value>)",
        },
      },
      fontFamily: { sans: ["Inter", "system-ui", "sans-serif"] },
      borderRadius: { xl2: "1.25rem" },
    },
  },
  plugins: [],
};
