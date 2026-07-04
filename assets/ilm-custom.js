document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("click", (e) => {
    const swatch = e.target.closest(".swatches");
    if (!swatch) return;
    swatch.parentElement.classList.add("ilm-checked");
  });
});