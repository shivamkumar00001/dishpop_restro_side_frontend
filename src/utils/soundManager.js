// src/utils/soundManager.js

let audio = null;
let unlocked = false;
let ringingInterval = null;
let currentOrderId = null;

/**
 * Create audio instance
 */
function createAudio() {
  if (!audio) {
    audio = new Audio("/sounds/new-order.mp3");
    audio.preload = "auto";
    audio.volume = 1.0;
  }
  return audio;
}

/**
 * Initialize audio immediately on page load
 * This prepares the audio context without requiring user interaction
 */
export function initializeSound() {
  try {
    createAudio();
    
    // Try to unlock immediately
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      const ctx = new AudioCtx();
      
      // Resume context if suspended
      if (ctx.state === 'suspended') {
        ctx.resume().then(() => {
          console.log("🔊 Audio context resumed");
        });
      }
    }
    
    unlocked = true;
    console.log("🔊 Sound initialized and ready");
    return true;
  } catch (e) {
    console.warn("Sound initialization failed:", e);
    return false;
  }
}

/**
 * Unlock audio context on first user interaction
 * This is a fallback for browsers that require user gesture
 */
export function autoUnlockSound() {
  if (unlocked) return;

  try {
    createAudio();
    
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      const ctx = new AudioCtx();
      
      // Create silent buffer to unlock
      const buffer = ctx.createBuffer(1, 1, 22050);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
      
      // Resume if needed
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
    }

    unlocked = true;
    localStorage.setItem("soundUnlocked", "true");
    console.log("🔊 Sound unlocked via user interaction");
  } catch (e) {
    console.warn("Sound unlock failed:", e);
  }
}

/**
 * Play sound once
 */
function playOnce() {
  if (!audio) {
    createAudio();
  }

  try {
    audio.currentTime = 0;
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          unlocked = true; // Mark as unlocked on successful play
        })
        .catch((err) => {
          if (err.name === 'NotAllowedError') {
            console.warn("🔇 Sound blocked by browser - waiting for user interaction");
          } else {
            console.warn("Failed to play sound:", err);
          }
        });
    }
  } catch (err) {
    console.error("Sound error:", err);
  }
}

/**
 * Start continuous ringing for an order
 * Plays bell sound repeatedly until stopped
 * 
 * @param {string} orderId - Order ID to ring for
 * @param {number} intervalMs - Time between rings (default: 2000ms = 2 seconds)
 */
export function startContinuousRinging(orderId, intervalMs = 289) {
  // Create audio if not exists
  if (!audio) {
    createAudio();
  }

  // If already ringing for this order, don't restart
  if (currentOrderId === orderId && ringingInterval) {
    console.log("🔔 Already ringing for order:", orderId);
    return;
  }

  // Stop any existing ringing
  stopRinging();

  // Set current order
  currentOrderId = orderId;

  // Play immediately
  playOnce();
  console.log("🔔 Started continuous ringing for order:", orderId);

  // Set up interval to keep ringing (faster interval)
  ringingInterval = setInterval(() => {
    playOnce();
    console.log("🔔 Ring... (order:", orderId, ")");
  }, intervalMs);
}

/**
 * Stop the continuous ringing
 */
export function stopRinging() {
  if (ringingInterval) {
    clearInterval(ringingInterval);
    ringingInterval = null;
    console.log("🔇 Stopped ringing for order:", currentOrderId);
  }

  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }

  currentOrderId = null;
}

/**
 * Check if currently ringing for an order
 */
export function isRinging() {
  return ringingInterval !== null;
}

/**
 * Get the order ID currently ringing
 */
export function getCurrentRingingOrder() {
  return currentOrderId;
}

/**
 * Set volume (0.0 to 1.0)
 */
export function setVolume(volume) {
  if (!audio) createAudio();
  if (audio) {
    audio.volume = Math.max(0, Math.min(1, volume));
  }
}

/**
 * Mute/unmute
 */
export function toggleMute() {
  if (!audio) createAudio();
  if (audio) {
    audio.muted = !audio.muted;
    return audio.muted;
  }
  return false;
}

/**
 * Set ringing interval
 * @param {number} intervalMs - Time between rings in milliseconds
 */
export function setRingingInterval(intervalMs) {
  if (ringingInterval && currentOrderId) {
    // Restart with new interval
    const orderId = currentOrderId;
    stopRinging();
    startContinuousRinging(orderId, intervalMs);
  }
}

// Auto-initialize on module load
initializeSound();

export default {
  initializeSound,
  autoUnlockSound,
  startContinuousRinging,
  stopRinging,
  isRinging,
  getCurrentRingingOrder,
  setVolume,
  toggleMute,
  setRingingInterval,
};