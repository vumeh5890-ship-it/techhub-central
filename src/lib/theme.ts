export function getTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return (localStorage.getItem("thms-theme") as "light" | "dark") ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
}
export function applyTheme(t: "light" | "dark") {
  document.documentElement.classList.toggle("dark", t === "dark");
  localStorage.setItem("thms-theme", t);
}
