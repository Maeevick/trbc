export function setupPanelToggle() {
  const toggle = document.querySelector(".menu-toggle") as HTMLButtonElement;
  const panel = document.querySelector(".info-panel") as HTMLElement;

  toggle.addEventListener("touchend", (e) => {
    e.preventDefault();
    panel.classList.toggle("expanded");
  });

  toggle.addEventListener("click", (e) => {
    e.preventDefault();
    panel.classList.toggle("expanded");
  });
}
