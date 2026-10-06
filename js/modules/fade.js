export function initFade() {
  const elements = [...document.querySelectorAll("[data-fade]")];
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (motion.matches || !("IntersectionObserver" in window)) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove("is-pending");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.08 },
  );
  elements.forEach((element) => {
    // Above-the-fold content remains immediately readable.
    if (element.getBoundingClientRect().top < window.innerHeight) return;
    element.classList.add("is-pending");
    observer.observe(element);
  });
  motion.addEventListener("change", () => {
    if (!motion.matches) return;
    elements.forEach((element) => element.classList.remove("is-pending"));
    observer.disconnect();
  });
}
