// runs on every page - dark mode, mobile menu and footer year

// set the theme straight away so the page doesn't flash white first
let savedTheme = null;
try {
  savedTheme = localStorage.getItem("theme");
} catch (e) {}

if (savedTheme) {
  document.documentElement.setAttribute("data-theme", savedTheme);
} else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
  document.documentElement.setAttribute("data-theme", "dark");
} else {
  document.documentElement.setAttribute("data-theme", "light");
}

document.addEventListener("DOMContentLoaded", () => {
  const themeBtn = document.querySelector(".theme-toggle");
  const menuBtn = document.querySelector(".menu-toggle");
  const nav = document.getElementById("nav-links");

  // dark / light switch
  themeBtn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const newTheme = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    try {
      localStorage.setItem("theme", newTheme);
    } catch (e) {}
  });

  // mobile menu
  function closeMenu() {
    nav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  }

  menuBtn.addEventListener("click", () => {
    nav.classList.toggle("open");
    const isOpen = nav.classList.contains("open");
    menuBtn.setAttribute("aria-expanded", isOpen);
  });

  // close it when a link is clicked or esc is pressed
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) closeMenu();
  });

  document.getElementById("year").textContent = new Date().getFullYear();
});
