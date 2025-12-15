let audio = null;
let unlocked = false;

function createAudio() {
  if (!audio) {
    audio = new Audio("/sounds/new-order.mp3");
    audio.preload = "auto";
    audio.volume = 1.0;
  }
}

/**
 * Unlock audio context silently on first user interaction
 */
export function autoUnlockSound() {
  if (unlocked || localStorage.getItem("soundUnlocked") === "true") {
    createAudio();
    unlocked = true;
    return;
  }

  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioCtx();

    const buffer = ctx.createBuffer(1, 1, 22050);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start(0);

    createAudio();
    unlocked = true;
    localStorage.setItem("soundUnlocked", "true");

    console.log("🔊 Sound auto-unlocked");
  } catch (e) {
    console.warn("Sound unlock failed:", e);
  }
}

/**
 * Play sound for new order
 */
export function playNewOrderSound() {
  if (!audio || !unlocked) return;

  audio.currentTime = 0;
  audio.play().catch(() => {});
}
