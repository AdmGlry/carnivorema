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
      onClick={toggle}
      aria-label="Basculer le thème"
      className="rounded-full border border-border px-3 py-1.5 text-sm hover:bg-card"
    >
      <span className="dark:hidden">🌙</span>
      <span className="hidden dark:inline">☀️</span>
    </button>
  );
}
