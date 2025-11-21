// js/engine.js
// Daily Math Training Lab
// Handles UI, quiz flow, timer, settings, sounds, and calls curriculum generators.

(function () {
  const TOTAL_QUESTIONS = 25;
  const NEXT_QUESTION_DELAY_MS = 1000;

  const POSITIVE_FEEDBACK = [
    "Awesome!",
    "Great job!",
    "Well done!",
    "Nice work!",
    "You got it!",
    "Excellent!",
    "Super!",
    "Brilliant!",
    "Keep it up!",
    "Fantastic!"
  ];

  let state = {
    grade: null,
    progressiveIndex: null,
    number: 1,
    quizId: "",
    currentQuestionIndex: 0,
    totalQuestions: TOTAL_QUESTIONS,
    currentQuestion: null,
    startTimestamp: null,
    endTimestamp: null,
    timerInterval: null,
    attemptsOnCurrent: 0,
    totalAttempts: 0,
    correctFirstTryCount: 0,
    startedAtDisplay: "",
    settings: {
      fontSize: "medium",
      animations: "on",
      sound: "on"
    },
    audioContext: null
  };

  // ---- DOM elements ----
  let homeScreen, quizScreen, resultScreen;
  let gradeSelect, progressiveSelect, numberInput, startBtn;
  let questionContainer, answerInput, submitBtn, feedbackEl;
  let showHintBtn, showExplanationBtn, helpContentEl;
  let resultDetailsEl, backHomeBtn;
  let settingsBtn, settingsPanel, closeSettingsBtn;
  let fontSizeSelect, animationsSelect, soundSelect;
  let siteTitleEl;

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    // Cache DOM
    homeScreen = document.getElementById("homeScreen");
    quizScreen = document.getElementById("quizScreen");
    resultScreen = document.getElementById("resultScreen");

    gradeSelect = document.getElementById("gradeSelect");
    progressiveSelect = document.getElementById("progressiveSelect");
    numberInput = document.getElementById("numberSelect");
    startBtn = document.getElementById("startBtn");

    questionContainer = document.getElementById("questionContainer");
    answerInput = document.getElementById("answerInput");
    submitBtn = document.getElementById("submitAnswer");
    feedbackEl = document.getElementById("feedback");
    showHintBtn = document.getElementById("showHint");
    showExplanationBtn = document.getElementById("showExplanation");
    helpContentEl = document.getElementById("helpContent");

    resultDetailsEl = document.getElementById("resultDetails");
    backHomeBtn = document.getElementById("backHome");

    settingsBtn = document.getElementById("settingsBtn");
    settingsPanel = document.getElementById("settingsPanel");
    closeSettingsBtn = document.getElementById("closeSettings");
    fontSizeSelect = document.getElementById("fontSizeSelect");
    animationsSelect = document.getElementById("animationsSelect");
    soundSelect = document.getElementById("soundSelect");

    siteTitleEl = document.querySelector(".site-title");

    // Populate grade select
    populateGrades();

    // Event listeners
    gradeSelect.addEventListener("change", onGradeChange);
    startBtn.addEventListener("click", onStartQuiz);
    submitBtn.addEventListener("click", onSubmitAnswer);
    answerInput.addEventListener("keyup", function (e) {
      if (e.key === "Enter") onSubmitAnswer();
    });

    showHintBtn.addEventListener("click", onShowHint);
    showExplanationBtn.addEventListener("click", onShowExplanation);
    backHomeBtn.addEventListener("click", goHome);

    // Settings
    settingsBtn.addEventListener("click", toggleSettingsPanel);
    closeSettingsBtn.addEventListener("click", closeSettingsPanel);
    fontSizeSelect.addEventListener("change", onFontSizeChange);
    animationsSelect.addEventListener("change", onAnimationsChange);
    soundSelect.addEventListener("change", onSoundChange);

    if (siteTitleEl) {
      siteTitleEl.style.cursor = "pointer";
      siteTitleEl.addEventListener("click", goHome);
    }

    applySettingsToDOM();
  }

  // ---- Grade / Progressive population ----

  function populateGrades() {
    if (typeof getGradesList !== "function") {
      console.error("getGradesList() not defined. Check curriculum.js load order.");
      return;
    }
    const grades = getGradesList();
    gradeSelect.innerHTML = '<option value="">Select Grade</option>';
    grades.forEach((g) => {
      const opt = document.createElement("option");
      opt.value = g.grade;
      opt.textContent = g.name;
      gradeSelect.appendChild(opt);
    });
    progressiveSelect.innerHTML = '<option value="">Select Grade First</option>';
  }

  function onGradeChange() {
    const grade = parseInt(gradeSelect.value, 10);
    if (Number.isNaN(grade)) {
      progressiveSelect.innerHTML = '<option value="">Select Grade First</option>';
      return;
    }
    const topics = getProgressivesForGrade(grade) || [];
    progressiveSelect.innerHTML = "";
    topics.forEach((t) => {
      const opt = document.createElement("option");
      opt.value = t.index;
      opt.textContent = `${t.index} – ${t.name}`;
      progressiveSelect.appendChild(opt);
    });
  }

  // ---- Start Quiz ----

  function onStartQuiz() {
    const grade = parseInt(gradeSelect.value, 10);
    const progressiveIndex = parseInt(progressiveSelect.value, 10);
    let number = parseInt(numberInput.value, 10);

    if (Number.isNaN(grade)) {
      alert("Please choose a grade.");
      return;
    }
    if (Number.isNaN(progressiveIndex)) {
      alert("Please choose a topic (progressive).");
      return;
    }
    if (Number.isNaN(number) || number < 1) number = 1;
    if (number > 100) number = 100;

    numberInput.value = number;

    startQuiz({ grade, progressiveIndex, number });
  }

  function startQuiz({ grade, progressiveIndex, number }) {
    // reset state
    state.grade = grade;
    state.progressiveIndex = progressiveIndex;
    state.number = number;
    state.quizId = generateQuizId();
    state.currentQuestionIndex = 0;
    state.totalQuestions = TOTAL_QUESTIONS;
    state.currentQuestion = null;
    state.startTimestamp = Date.now();
    state.endTimestamp = null;
    state.attemptsOnCurrent = 0;
    state.totalAttempts = 0;
    state.correctFirstTryCount = 0;
    state.startedAtDisplay = formatDateTime(new Date(state.startTimestamp));

    if (state.timerInterval) clearInterval(state.timerInterval);
    state.timerInterval = setInterval(updateElapsedTime, 1000);

    feedbackEl.textContent = "";
    helpContentEl.textContent = "";
    answerInput.value = "";

    switchScreen("quizScreen");
    renderCurrentQuestion();
  }

  // ---- Question / Answer Flow ----

  function renderCurrentQuestion() {
    try {
      const q = generateQuestionFor(
        state.grade,
        state.progressiveIndex,
        state.number
      );
      state.currentQuestion = q;
      state.attemptsOnCurrent = 0;

      const topic = getTopicFor(state.grade, state.progressiveIndex);
      const gradeInfo = CURRICULUM[state.grade];

      const metaHtml = `
        <div class="quiz-meta">
          <div>Grade ${state.grade} – ${gradeInfo ? gradeInfo.name : ""}</div>
          <div>Topic: ${topic ? topic.name : ""}</div>
          <div>Number: ${state.number}</div>
          <div>Question ${state.currentQuestionIndex + 1} of ${
        state.totalQuestions
      }</div>
          <div>Quiz ID: <span class="quiz-id">${state.quizId}</span></div>
          <div>Started: ${state.startedAtDisplay}</div>
          <div>Elapsed: <span id="elapsedTime">0:00</span></div>
        </div>
      `;

      const questionHtml = `
        <div class="question-text">${escapeHtmlWithBreaks(q.text || "")}</div>
        ${
          q.concept
            ? `<div class="concept-tag">Concept: ${escapeHtml(q.concept)}</div>`
            : ""
        }
      `;

      questionContainer.innerHTML = metaHtml + questionHtml;
      feedbackEl.textContent = "";
      helpContentEl.textContent = "";

      // focus answer box
      setTimeout(() => {
        answerInput.focus();
      }, 50);

      // update timer display immediately
      updateElapsedTime();
    } catch (err) {
      console.error(err);
      alert(
        "There is a problem loading this question. Please check that all generator files are uploaded."
      );
      goHome();
    }
  }

  function onSubmitAnswer() {
    if (!state.currentQuestion) return;
    const userInput = (answerInput.value || "").trim();
    if (!userInput) return;

    const correctAnswer = state.currentQuestion.answer;
    const isCorrect = compareAnswers(userInput, correctAnswer);

    state.totalAttempts++;
    if (isCorrect) {
      if (state.attemptsOnCurrent === 0) {
        state.correctFirstTryCount++;
      }
      state.currentQuestionIndex++;
      showPositiveFeedback();
      playCorrectSound();
      // clear help and input
      helpContentEl.textContent = "";
      answerInput.value = "";

      if (state.currentQuestionIndex >= state.totalQuestions) {
        // finish quiz after short delay so user can see the last "Awesome!"
        setTimeout(finishQuiz, NEXT_QUESTION_DELAY_MS);
      } else {
        setTimeout(renderCurrentQuestion, NEXT_QUESTION_DELAY_MS);
      }
    } else {
      state.attemptsOnCurrent++;
      showTryAgainFeedback();
      playWrongSound();
    }
  }

  function finishQuiz() {
    state.endTimestamp = Date.now();
    if (state.timerInterval) {
      clearInterval(state.timerInterval);
      state.timerInterval = null;
    }

    const totalMs = state.endTimestamp - state.startTimestamp;
    const totalSec = totalMs / 1000;
    const avgSecPerQuestion = totalSec / state.totalQuestions;
    const questions = state.totalQuestions;
    const firstTryRate =
      questions > 0
        ? Math.round((state.correctFirstTryCount / questions) * 100)
        : 0;

    const topic = getTopicFor(state.grade, state.progressiveIndex);
    const gradeInfo = CURRICULUM[state.grade];

    const totalTimeStr = formatDuration(totalSec);
    const avgTimeStr = avgSecPerQuestion.toFixed(1);

    const endDisplay = formatDateTime(new Date(state.endTimestamp));

    const detailsHtml = `
      <p><strong>Grade:</strong> ${state.grade} – ${
      gradeInfo ? gradeInfo.name : ""
    }</p>
      <p><strong>Topic:</strong> ${topic ? topic.name : ""}</p>
      <p><strong>Number:</strong> ${state.number}</p>
      <p><strong>Quiz ID:</strong> ${state.quizId}</p>
      <p><strong>Started:</strong> ${state.startedAtDisplay}</p>
      <p><strong>Finished:</strong> ${endDisplay}</p>
      <p><strong>Total Time:</strong> ${totalTimeStr}</p>
      <p><strong>Average Time per Question:</strong> ${avgTimeStr} sec</p>
      <p><strong>Total Questions:</strong> ${questions}</p>
      <p><strong>Total Attempts:</strong> ${state.totalAttempts}</p>
      <p><strong>First-Try Correct:</strong> ${
        state.correctFirstTryCount
      } (${firstTryRate}%)</p>
    `;

    resultDetailsEl.innerHTML = detailsHtml;
    switchScreen("resultScreen");
    playResultMelody();
  }

  // ---- Screens ----

  function switchScreen(screenId) {
    [homeScreen, quizScreen, resultScreen].forEach((s) => {
      if (!s) return;
      if (s.id === screenId) {
        s.classList.add("active");
        s.classList.remove("hidden");
      } else {
        s.classList.remove("active");
        s.classList.add("hidden");
      }
    });
  }

  function goHome() {
    if (state.timerInterval) {
      clearInterval(state.timerInterval);
      state.timerInterval = null;
    }
    switchScreen("homeScreen");
  }

  // ---- Hint & Explanation ----

  function onShowHint() {
    if (!state.currentQuestion) return;
    const q = state.currentQuestion;
    const hint = q.hint || "Think about what the question is really asking.";
    helpContentEl.innerHTML = `<strong>Hint:</strong> ${escapeHtmlWithBreaks(
      hint
    )}`;
  }

  function onShowExplanation() {
    if (!state.currentQuestion) return;
    const q = state.currentQuestion;
    const exp = q.explanation || "This question practices the main concept.";
    const example = q.example || "";
    helpContentEl.innerHTML =
      `<strong>Concept explanation:</strong><br>${escapeHtmlWithBreaks(
        exp
      )}` +
      (example
        ? `<br><br><strong>Example:</strong><br>${escapeHtmlWithBreaks(
            example
          )}`
        : "");
  }

  // ---- Feedback visuals ----

  function showPositiveFeedback() {
    const text =
      POSITIVE_FEEDBACK[Math.floor(Math.random() * POSITIVE_FEEDBACK.length)];
    feedbackEl.textContent = text;
    feedbackEl.style.color = randomBrightColor();
    feedbackEl.style.transform = "scale(1.0)";
    feedbackEl.style.opacity = "1";

    // little pop animation
    if (!document.body.classList.contains("animations-off")) {
      feedbackEl.animate(
        [
          { transform: "scale(0.9)", opacity: 0.5 },
          { transform: "scale(1.2)", opacity: 1 },
          { transform: "scale(1.0)", opacity: 1 }
        ],
        {
          duration: 500,
          easing: "ease-out"
        }
      );
    }
  }

  function showTryAgainFeedback() {
    feedbackEl.textContent = "Not yet, try again!";
    feedbackEl.style.color = "#d32f2f";
    if (!document.body.classList.contains("animations-off")) {
      feedbackEl.animate(
        [
          { transform: "translateX(0)" },
          { transform: "translateX(-4px)" },
          { transform: "translateX(4px)" },
          { transform: "translateX(0)" }
        ],
        {
          duration: 300,
          easing: "ease-in-out"
        }
      );
    }
  }

  // ---- Timer ----

  function updateElapsedTime() {
    if (!state.startTimestamp) return;
    const now = Date.now();
    const totalSec = (now - state.startTimestamp) / 1000;
    const elapsedEl = document.getElementById("elapsedTime");
    if (elapsedEl) {
      elapsedEl.textContent = formatDuration(totalSec);
    }
  }

  function formatDuration(seconds) {
    seconds = Math.max(0, Math.floor(seconds));
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  function formatDateTime(d) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const seconds = String(d.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  // ---- Settings ----

  function toggleSettingsPanel() {
    settingsPanel.classList.toggle("active");
  }

  function closeSettingsPanel() {
    settingsPanel.classList.remove("active");
  }

  function onFontSizeChange() {
    state.settings.fontSize = fontSizeSelect.value;
    applySettingsToDOM();
  }

  function onAnimationsChange() {
    state.settings.animations = animationsSelect.value;
    applySettingsToDOM();
  }

  function onSoundChange() {
    state.settings.sound = soundSelect.value;
  }

  function applySettingsToDOM() {
    const body = document.body;
    // font size via class
    body.classList.remove("font-small", "font-medium", "font-large", "font-xl");
    const size = state.settings.fontSize || "medium";
    body.classList.add("font-" + size);

    // animations
    if (state.settings.animations === "off") {
      body.classList.add("animations-off");
    } else {
      body.classList.remove("animations-off");
    }
  }

  // ---- Sound (Web Audio) ----

  function ensureAudioContext() {
    if (!state.audioContext) {
      try {
        state.audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();
      } catch (e) {
        console.warn("Web Audio not supported.", e);
      }
    }
    return state.audioContext;
  }

  function playTone(frequency, durationMs, type = "sine", volume = 0.2) {
    if (state.settings.sound !== "on") return;
    const ctx = ensureAudioContext();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gainNode.gain.value = volume;

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    const now = ctx.currentTime;
    oscillator.start(now);
    oscillator.stop(now + durationMs / 1000);
  }

  function playCorrectSound() {
    // simple positive beep
    playTone(880, 150, "triangle", 0.25);
  }

  function playWrongSound() {
    // short low beep
    playTone(220, 200, "sawtooth", 0.2);
  }

  function playResultMelody() {
    if (state.settings.sound !== "on") return;
    const ctx = ensureAudioContext();
    if (!ctx) return;

    // small three-note melody
    const now = ctx.currentTime;
    const notes = [
      { freq: 523.25, start: 0, dur: 0.15 }, // C5
      { freq: 659.25, start: 0.18, dur: 0.18 }, // E5
      { freq: 783.99, start: 0.4, dur: 0.25 } // G5
    ];

    notes.forEach((n) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = n.freq;
      gain.gain.value = 0.25;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + n.start);
      osc.stop(now + n.start + n.dur);
    });
  }

  // ---- Helpers ----

  function compareAnswers(userInput, correctAnswer) {
    if (correctAnswer === null || correctAnswer === undefined) {
      return false;
    }
    const correctStr = String(correctAnswer).trim();

    // try numeric comparison first
    const uNum = parseFloat(userInput);
    const cNum = parseFloat(correctStr);
    if (!Number.isNaN(uNum) && !Number.isNaN(cNum)) {
      const diff = Math.abs(uNum - cNum);
      return diff < 1e-6; // allow small rounding
    }
    // fallback string comparison (case-insensitive)
    return userInput.toLowerCase() === correctStr.toLowerCase();
  }

  function randomBrightColor() {
    const colors = ["#ff4081", "#ff9800", "#4caf50", "#3f51b5", "#9c27b0"];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function generateQuizId() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let id = "";
    for (let i = 0; i < 8; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function escapeHtmlWithBreaks(str) {
    return escapeHtml(str).replace(/\n/g, "<br>");
  }
})();
