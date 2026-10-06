export function initConsultation() {
  const dialog = document.querySelector('[data-consultation-dialog]');
  if (!dialog) return;
  document.querySelectorAll('[data-consultation]').forEach(button => {
    button.addEventListener('click', () => dialog.showModal());
  });
  dialog.querySelectorAll('[data-close-dialog]').forEach(button => {
    button.addEventListener('click', () => dialog.close());
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
}
