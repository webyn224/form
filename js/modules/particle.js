export function initParticles() {
  const fields = [...document.querySelectorAll("[data-particles]")];
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const positions = [
    [7, 16, 7],
    [32, 5, 5],
    [62, 26, 9],
    [88, 9, 5],
    [18, 58, 8],
    [46, 42, 5],
    [77, 68, 7],
    [4, 84, 4],
    [40, 78, 8],
    [94, 44, 6],
  ];
  fields.forEach((field) => {
    [...field.querySelectorAll("i")].forEach((dot, index) => {
      const [x, y, size] = positions[index % positions.length];
      dot.style.setProperty("--x", x);
      dot.style.setProperty("--y", y);
      dot.style.setProperty("--size", `${size}px`);
      dot.style.setProperty(
        "--dot",
        [
          "var(--color-accent-ink)",
          "var(--color-work-doula-text)",
          "var(--color-work-care-text)",
        ][index % 3],
      );
    });
  });
  if (!fields.length) return;
  let frame = 0;
  function update() {
    frame = 0;
    fields.forEach((field) => {
      const section =
        field.closest(".p-top-intro__thoughts") || field.closest("section");
      const bounds = section.getBoundingClientRect();
      const progress = motion.matches
        ? 0
        : Math.min(
            1,
            Math.max(
              0,
              -bounds.top /
                Math.max(1, bounds.height - window.innerHeight * 0.5),
            ),
          );
      field.style.setProperty("--progress", progress.toFixed(3));
    });
  }
  function requestUpdate() {
    if (!frame) frame = requestAnimationFrame(update);
  }
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  motion.addEventListener("change", requestUpdate);
  update();
}
