"use client";

export default function ThemeToggle() {
  const toggle = () => {
    const dark = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Basculer entre le thème clair et le thème sombre"
      className="grid size-9 place-items-center rounded-full text-sm transition-colors hover:bg-accent-soft"
    >
      <span aria-hidden="true" className="dark:hidden">🌙</span>
      <span aria-hidden="true" className="hidden dark:inline">☀️</span>
    </button>
  );
}
