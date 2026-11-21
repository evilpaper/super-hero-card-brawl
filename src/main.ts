import Game from "./game/game";

// Must match the font-weight declared in each @font-face rule, or load() won't find the face.
const FONTS = [
  '16px "Whyte Inktrap Book"',
  '16px "Whyte Inktrap Regular"',
  'bold 16px "Whyte Inktrap Heavy"',
];

function loadFonts() {
  // A missing font shouldn't block the game; canvas falls back to sans-serif.
  return Promise.all(
    FONTS.map((font) => document.fonts.load(font).catch(() => [])),
  );
}

const canvas = document.querySelector<HTMLCanvasElement>(".canvas")!;

const ctx = canvas.getContext("2d")!;

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(window.innerWidth * dpr);
  canvas.height = Math.round(window.innerHeight * dpr);
  // Draw in CSS pixels; the transform maps them onto the high-DPI backing store.
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();

const game = new Game();

game.start();

loadFonts().then(() => {
  // First render goes here, once fonts are ready.
});
