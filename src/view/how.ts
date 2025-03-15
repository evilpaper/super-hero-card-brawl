import { animate } from "motion";

export function create(
  modalId: string,
  triggerButtonClass: string,
  closeButtonClass: string
) {
  const modal = document.getElementById(modalId) as HTMLElement;
  const triggerButton = document.querySelector(
    triggerButtonClass
  ) as HTMLButtonElement;
  const closeButton = document.querySelector(closeButtonClass) as HTMLElement;

  const show = async () => {
    modal.style.display = "grid";
    await animate(modal, { opacity: 1 }, { duration: 0.3 });
  };

  const hide = async () => {
    await animate(modal, { opacity: 0 }, { duration: 0.3 });
    modal.style.display = "none";
  };

  // Event listeners
  triggerButton.addEventListener("click", show);
  closeButton.addEventListener("click", hide);

  window.addEventListener("click", async (event) => {
    if (event.target === modal) {
      await hide();
    }
  });

  document.addEventListener("keydown", async (event) => {
    if (event.key === "Escape" && modal.style.display === "grid") {
      await hide();
    }
  });

  // Optionally return controls if needed elsewhere
  return {
    show,
    hide,
  };
}
