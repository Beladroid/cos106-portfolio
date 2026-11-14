// runs on every page - theme, mobile menu, scroll reveal, number count-up and footer year

// set the theme straight away so the page doesn't flash the wrong colours first
// night (dark) is the default look, day is the light one
let savedTheme = null;
try {
  savedTheme = localStorage.getItem("theme");
} catch (e) {}

if (savedTheme === "light") {
  document.documentElement.setAttribute("data-theme", "light");
} else {
  document.documentElement.setAttribute("data-theme", "dark");
}

// tells the css that javascript is working (so hidden reveal items can animate in)
document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", () => {
  const themeBtn = document.querySelector(".theme-toggle");
  const menuBtn = document.querySelector(".menu-toggle");
  const nav = document.getElementById("nav-links");

  // night / day switch
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
    document.body.style.overflow = "";
  }

  menuBtn.addEventListener("click", () => {
    nav.classList.toggle("open");
    const isOpen = nav.classList.contains("open");
    menuBtn.setAttribute("aria-expanded", isOpen);
    // stop the page behind from scrolling while the menu covers it
    document.body.style.overflow = isOpen ? "hidden" : "";
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

  // fade sections in as they scroll into view
  const revealItems = document.querySelectorAll(".reveal");
  const revealWatcher = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        revealWatcher.unobserve(entry.target); // only once
      }
    });
  }, { threshold: 0.15 });
  revealItems.forEach((item) => revealWatcher.observe(item));

  // count the numbers up from 0 when they come into view
  function countUp(el) {
    const target = Number(el.dataset.count);
    const duration = 1400;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // slows down at the end
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const numbers = document.querySelectorAll("[data-count]");
  const numberWatcher = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        numberWatcher.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  numbers.forEach((n) => numberWatcher.observe(n));

  document.getElementById("year").textContent = new Date().getFullYear();
});
