// js/utils.js
// Shared helper functions for Daily Math Training Lab.

(function () {
  function randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function mapNumberToDifficulty(number) {
    if (typeof number !== "number" || isNaN(number)) return 0.3;
    const n = Math.min(100, Math.max(1, number));
    return (n - 1) / 99; // 0..1
  }

  function clampDifficulty(d) {
    if (typeof d !== "number" || isNaN(d)) return 0.5;
    if (d < 0) return 0;
    if (d > 1) return 1;
    return d;
  }

  function randomSign() {
    return Math.random() < 0.5 ? -1 : 1;
  }

  function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    if (!b) return a || 1;
    while (b) {
      const t = b;
      b = a % b;
      a = t;
    }
    return a || 1;
  }

  function lcm(a, b) {
    if (a === 0 || b === 0) return 0;
    return Math.abs(a * b) / gcd(a, b);
  }

  function simplifyFraction(num, den) {
    if (den === 0) return [num, den];
    const g = gcd(num, den);
    return [num / g, den / g];
  }

  function toMixedNumber(num, den) {
    if (den === 0) return { whole: 0, num, den };
    const whole = (num / den) | 0;
    const remainder = Math.abs(num % den);
    return { whole, num: remainder, den: Math.abs(den) };
  }

  // Expose globally
  window.randomInt = randomInt;
  window.randomChoice = randomChoice;
  window.shuffleArray = shuffleArray;
  window.mapNumberToDifficulty = mapNumberToDifficulty;
  window.clampDifficulty = clampDifficulty;
  window.randomSign = randomSign;
  window.gcd = gcd;
  window.lcm = lcm;
  window.simplifyFraction = simplifyFraction;
  window.toMixedNumber = toMixedNumber;
})();
