// js/engine.js
// Daily Math Training Lab
// Handles UI, quiz flow, timer, settings, sounds, and calls curriculum generators.

(function () {
  const TOTAL_QUESTIONS = 15;
  const NEXT_QUESTION_DELAY_MS = 1000;

  const POSITIVE_FEEDBACK = [
    "Awesome!",
    "Great job!",
    "Well done!",
    "Nice work!",
    "You got it!",
    "Excellent!",
    "Super!",
    "Nice thinking!",
    "Keep it up!",
    "Boom! Nailed it."
  ];

  const TRY_AGAIN_FEEDBACK = [
    "Close! Try again.",
    "Not yet—give it another shot.",
    "Almost there, think it through.",
    "Try once more.",
    "Keep going, you’ve got this."
  ];

  const state = {
    grade: null,
    progressiveIndex: null,
    number: 1,
    quizId: "",
    currentQuestionIndex: 0,
    totalQuestions: TOTAL_QUESTIONS,
    currentQuestion: null,
    startTimestamp: null,
    endTimestamp: null,
    questionStartTimestamp: null,
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
  let progressBarEl;

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
    progressBarEl = document.getElementById("quizProgressBar");

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
      gradeSelect.innerHTML =
        '<option value="">Error loading grades. See console.</option>';
      return;
    }

    const grades = getGradesList();
    gradeSelect.innerHTML = '<option value="">Select Grade</option>';
    grades.forEach((g) => {
      const opt = document.createElement("option");
      opt.value = g.id;
      opt.textContent = `Grade ${g.id} – ${g.name}`;
      gradeSelect.appendChild(opt);
    });
  }

  function onGradeChange() {
    const grade = parseInt(gradeSelect.value, 10);
    if (Number.isNaN(grade)) {
      progressiveSelect.innerHTML =
        '<option value="">Select Grade First</option>';
      return;
    }

    if (typeof getTopicsForGrade !== "function") {
      console.error(
        "getTopicsForGrade() not defined. Check curriculum.js load order."
      );
      progressiveSelect.innerHTML =
        '<option value="">Error loading topics. See console.</option>';
      return;
    }

    const topics = getTopicsForGrade(grade);
    if (!topics || !topics.length) {
      progressiveSelect.innerHTML =
        '<option value="">No topics found for this grade.</option>';
      return;
    }

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
    state.questionStartTimestamp = state.startTimestamp;
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

    updateProgressBar();

    switchScreen("quizScreen");
    renderCurrentQuestion();
  }

  // ---- Question / Answer Flow ----

  function updateProgressBar() {
    if (!progressBarEl) return;
    const total = state.totalQuestions || TOTAL_QUESTIONS;
    let index = state.currentQuestionIndex;
    if (index < 0) index = 0;
    if (index > total) index = total;
    const fraction = total > 0 ? index / total : 0;
    progressBarEl.style.width = (fraction * 100) + "%";
  }

  function renderCurrentQuestion() {
    try {
      const q = generateQuestionFor(
        state.grade,
        state.progressiveIndex,
        state.number
      );
      state.currentQuestion = q;
      state.attemptsOnCurrent = 0;
      state.questionStartTimestamp = Date.now();

      updateProgressBar();

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
          <div>Elapsed (this question): <span id="elapsedTimeQuestion">0:00</span></div>
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
      answerInput.value = "";
      answerInput.focus();
    } catch (err) {
      console.error("Error generating question:", err);
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
      updateProgressBar();
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
    updateProgressBar();
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
      <p><strong>Grade:</strong> ${state.grade} – 
${
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
    const explanation =
      q.explanation || "Try to break the problem into simpler steps.";
    const example = q.example || "";
    let html = `<strong>Explanation:</strong> ${escapeHtmlWithBreaks(
      explanation
    )}`;
    if (example) {
      html += `<br><br><strong>Example:</strong> ${escapeHtmlWithBreaks(
        example
      )}`;
    }
    helpContentEl.innerHTML = html;
  }

  // ---- Navigation ----

  function switchScreen(screenId) {
    if (homeScreen) homeScreen.classList.remove("active");
    if (quizScreen) quizScreen.classList.remove("active");
    if (resultScreen) resultScreen.classList.remove("active");

    const el = document.getElementById(screenId);
    if (el) el.classList.add("active");
  }

  function goHome() {
    if (state.timerInterval) {
      clearInterval(state.timerInterval);
      state.timerInterval = null;
    }
    switchScreen("homeScreen");
  }

  // ---- Timer / Elapsed ----

  function updateElapsedTime() {
    if (!state.startTimestamp) return;
    const now = Date.now();

    // total set time (header)
    const totalSec = (now - state.startTimestamp) / 1000;
    const totalEl = document.getElementById("elapsedTimeTotal");
    if (totalEl) {
      totalEl.textContent = formatDuration(totalSec);
    }

    // per-question time (meta)
    if (state.questionStartTimestamp) {
      const qSec = (now - state.questionStartTimestamp) / 1000;
      const qEl = document.getElementById("elapsedTimeQuestion");
      if (qEl) {
        qEl.textContent = formatDuration(qSec);
      }
    }
  }

  // ---- Settings ----

  function toggleSettingsPanel() {
    if (!settingsPanel) return;
    settingsPanel.classList.toggle("active");
  }

  function closeSettingsPanel() {
    if (!settingsPanel) return;
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
    body.classList.remove("font-small", "font-medium", "font-large", "font-xl");
    const sizeClass = `font-${state.settings.fontSize}`;
    body.classList.add(sizeClass);

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
    // fun two-note positive chirp
    playTone(880, 140, "triangle", 0.26);
    setTimeout(function () {
      playTone(1175, 160, "triangle", 0.22);
    }, 120);
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

  // ---- Utility helpers ----

  function compareAnswers(userInput, correctAnswer) {
    // numeric comparison if both parse
    const userNum = parseFloat(userInput);
    const correctNum = parseFloat(correctAnswer);

    if (!Number.isNaN(userNum) && !Number.isNaN(correctNum)) {
      return Math.abs(userNum - correctNum) < 1e-9;
    }

    return String(userInput).trim().toLowerCase() ===
      String(correctAnswer).trim().toLowerCase();
  }

  function showPositiveFeedback() {
    const msg =
      POSITIVE_FEEDBACK[Math.floor(Math.random() * POSITIVE_FEEDBACK.length)];
    feedbackEl.textContent = msg;
    feedbackEl.style.color = "#16a34a";
  }

  function showTryAgainFeedback() {
    const msg =
      TRY_AGAIN_FEEDBACK[
        Math.floor(Math.random() * TRY_AGAIN_FEEDBACK.length)
      ];
    feedbackEl.textContent = msg;
    feedbackEl.style.color = "#dc2626";
  }

  function formatDuration(totalSec) {
    totalSec = Math.max(0, Math.floor(totalSec));
    const minutes = Math.floor(totalSec / 60);
    const seconds = totalSec % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  function formatDateTime(d) {
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    const hours = d.getHours().toString().padStart(2, "0");
    const minutes = d.getMinutes().toString().padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  function generateQuizId() {
    const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
    const now = new Date();
    const timePart = `${now.getHours().toString().padStart(2, "0")}${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
    return `${rand}-${timePart}`;
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
