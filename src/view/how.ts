import { animate } from "motion";

const createAnimations = (modal: HTMLElement) => {
  const show = async () => {
    modal.style.display = "grid";
    await animate(modal, { opacity: 1 }, { duration: 0.3 });
  };

  const hide = async () => {
    await animate(modal, { opacity: 0 }, { duration: 0.3 });
    modal.style.display = "none";
  };

  return { show, hide };
};

const setupEventListeners = (
  modal: HTMLElement,
  triggerButton: HTMLButtonElement,
  closeButton: HTMLElement,
  { show, hide }: { show: () => Promise<void>; hide: () => Promise<void> }
) => {
  triggerButton.addEventListener("click", show);
  closeButton.addEventListener("click", hide);

  window.addEventListener("click", async (event) => {
    if (event.target === modal) await hide();
  });

  document.addEventListener("keydown", async (event) => {
    if (event.key === "Escape" && modal.style.display === "grid") {
      await hide();
    }
  });
};

export function connect(
  elementName: string,
  triggerButtonClass: string,
  closeButtonClass: string
) {
  const modal = document.getElementById(elementName) as HTMLElement;
  const triggerButton = document.querySelector(
    triggerButtonClass
  ) as HTMLButtonElement;
  const closeButton = document.querySelector(closeButtonClass) as HTMLElement;

  const animations = createAnimations(modal);

  setupEventListeners(modal, triggerButton, closeButton, animations);

  return animations;
}
