// js/utils.js

// Simple DOM helper
function $(id) {
  return document.getElementById(id);
}

// Format seconds as mm:ss
function formatTimeSeconds(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");
  return `${mm}:${ss}`;
}

// Format a Date object nicely
function formatDateTime(dt) {
  if (!dt) return "";
  const options = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  };
  return dt.toLocaleString(undefined, options);
}

// Random integer [min, max]
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Shuffle copy of an array
function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Smooth difficulty factor in [0, 1] from number 1-100
function difficultyFromNumber(num) {
  if (num < 1) num = 1;
  if (num > 100) num = 100;
  return (num - 1) / 99; // 0 at 1, 1 at 100
}

// Quiz ID
function generateQuizId() {
  return "Q-" + randomInt(100000, 999999);
}

// Grade band helper: returns "elem" / "mid" / "high"
function getGradeBand(grade) {
  if (grade <= 5) return "elem";
  if (grade <= 8) return "mid";
  return "high";
}

// Language helper that adapts to grade band
function gradePrompt(grade, elemText, midText, highText) {
  const band = getGradeBand(grade);
  if (band === "elem") return elemText;
  if (band === "mid") return midText || elemText;
  return highText || midText || elemText;
}
