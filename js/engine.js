// js/engine.js

// ----- DOM refs -----
const homeScreen = $("home-screen");
const quizScreen = $("quiz-screen");
const resultScreen = $("result-screen");

const gradeSelect = $("grade-select");
const progSelect = $("progressive-select");
const numberInput = $("number-input");
const homeError = $("home-error");
const startQuizBtn = $("start-quiz-btn");
const homeTitleBtn = $("home-title-btn");

const quizGradeTopic = $("quiz-grade-topic");
const quizNumberLabel = $("quiz-number-label");
const quizConceptLabel = $("quiz-concept-label");
const quizIdSpan = $("quiz-id");
const quizStartTimeSpan = $("quiz-start-time");
const quizElapsedTimeSpan = $("quiz-elapsed-time");
const quizQuestionCounter = $("quiz-question-counter");
const quizProgressFill = $("quiz-progress-fill");
const quizQuestionText = $("quiz-question-text");
const answerInput = $("answer-input");
const submitAnswerBtn = $("submit-answer-btn");
const helpBtn = $("help-btn");
const quizFeedback = $("quiz-feedback");
const helpPanel = $("help-panel");
const helpHint = $("help-hint");
const showExplanationBtn = $("show-explanation-btn");
const explanationBlock = $("explanation-block");
const helpExplanation = $("help-explanation");
const helpExample = $("help-example");

const resultGrade = $("result-grade");
const resultProgressive = $("result-progressive");
const resultTopic = $("result-topic");
const resultNumber = $("result-number");
const resultQuizId = $("result-quiz-id");
const resultStarted = $("result-started");
const resultFinished = $("result-finished");
const resultTotalTime = $("result-total-time");
const resultAvgTime = $("result-avg-time");
const resultFirstTry = $("result-first-try");
const resultMultiAttempt = $("result-multi-attempt");
const resultHelpUsed = $("result-help-used");
const resultSummaryLine = $("result-summary-line");

const retryBtn = $("retry-btn");
const nextNumberBtn = $("next-number-btn");
const backHomeBtn = $("back-home-btn");

const correctFlash = $("correct-flash");
const correctSound = $("correct-sound");
const resultSound = $("result-sound");

// ----- State -----
const STATE = {
  screen: "home",
  grade: null,
  progressiveIndex: null,
  number: null,
  topicName: "",
  quizId: "",
  questions: [],
  currentIndex: 0,
  startTime: null,
  endTime: null,
  elapsedSeconds: 0,
  timerInterval: null,
  attempts: [],
  helpUsed: [],
  firstTryCorrectCount: 0
};

const correctMessages = [
  "Awesome!",
  "Good job!",
  "Well done!",
  "Nice!",
  "Great work!",
  "Excellent!",
  "You got it!",
  "Super!"
];

const correctColors = [
  "#2563eb",
  "#16a34a",
  "#7c3aed",
  "#db2777",
  "#ea580c",
  "#0d9488",
  "#facc15"
];

// ----- Screen switching -----
function switchScreen(screen) {
  STATE.screen = screen;
  homeScreen.classList.remove("active");
  quizScreen.classList.remove("active");
  resultScreen.classList.remove("active");

  if (screen === "home") homeScreen.classList.add("active");
  if (screen === "quiz") quizScreen.classList.add("active");
  if (screen === "result") resultScreen.classList.add("active");
}

// Populate progressives when grade changes
gradeSelect.addEventListener("change", () => {
  const g = parseInt(gradeSelect.value, 10);
  progSelect.innerHTML = "";
  if (!g || !curriculumTopics[g]) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "Select grade first";
    progSelect.appendChild(opt);
    return;
  }
  const topics = curriculumTopics[g];
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Select progressive";
  progSelect.appendChild(placeholder);
  topics.forEach((topic, idx) => {
    const opt = document.createElement("option");
    opt.value = String(idx + 1);
    opt.textContent = `${idx + 1} – ${topic.name}`;
    progSelect.appendChild(opt);
  });
});

// Title click → back home
homeTitleBtn.addEventListener("click", () => {
  switchScreen("home");
});

// Start quiz
startQuizBtn.addEventListener("click", () => {
  homeError.textContent = "";
  const gradeVal = parseInt(gradeSelect.value, 10);
  const progVal = parseInt(progSelect.value, 10);
  const numVal = parseInt(numberInput.value, 10);

  if (!gradeVal || !curriculumTopics[gradeVal]) {
    homeError.textContent = "Please choose a valid grade.";
    return;
  }
  if (!progVal || progVal < 1 || progVal > 7) {
    homeError.textContent = "Please choose a progressive topic.";
    return;
  }
  if (!numVal || numVal < 1 || numVal > 100) {
    homeError.textContent = "Please choose a number between 1 and 100.";
    return;
  }

  startNewQuiz(gradeVal, progVal, numVal);
});

// Submit answer
submitAnswerBtn.addEventListener("click", () => {
  submitCurrentAnswer();
});

// Enter key on answer
answerInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    submitCurrentAnswer();
  }
});

// Help toggle
helpBtn.addEventListener("click", () => {
  toggleHelpPanel();
});

// Show full explanation
showExplanationBtn.addEventListener("click", () => {
  explanationBlock.classList.remove("hidden");
});

// Result screen buttons
retryBtn.addEventListener("click", () => {
  if (STATE.grade && STATE.progressiveIndex && STATE.number) {
    startNewQuiz(STATE.grade, STATE.progressiveIndex, STATE.number);
  }
});

nextNumberBtn.addEventListener("click", () => {
  if (STATE.grade && STATE.progressiveIndex) {
    let nextNum = STATE.number + 1;
    if (nextNum > 100) nextNum = 100;
    startNewQuiz(STATE.grade, STATE.progressiveIndex, nextNum);
  }
});

backHomeBtn.addEventListener("click", () => {
  switchScreen("home");
});

// ----- Timer -----
function startTimer() {
  STATE.timerInterval = setInterval(() => {
    if (!STATE.startTime) return;
    const now = new Date();
    const diffSeconds = Math.floor((now - STATE.startTime) / 1000);
    STATE.elapsedSeconds = diffSeconds;
    quizElapsedTimeSpan.textContent = formatTimeSeconds(diffSeconds);
  }, 1000);
}

function stopTimer() {
  if (STATE.timerInterval) {
    clearInterval(STATE.timerInterval);
    STATE.timerInterval = null;
  }
}

// ----- Quiz lifecycle -----
function startNewQuiz(grade, progressiveIndex, number) {
  stopTimer();

  STATE.grade = grade;
  STATE.progressiveIndex = progressiveIndex;
  STATE.number = number;

  const topicObj = (curriculumTopics[grade] || [])[progressiveIndex - 1];
  STATE.topicName = topicObj ? topicObj.name : "";
  STATE.quizId = generateQuizId();
  STATE.questions = [];
  STATE.currentIndex = 0;
  STATE.startTime = new Date();
  STATE.endTime = null;
  STATE.elapsedSeconds = 0;
  STATE.attempts = new Array(25).fill(0);
  STATE.helpUsed = new Array(25).fill(false);
  STATE.firstTryCorrectCount = 0;

  // generate 25 questions for this grade/topic/number
  for (let i = 0; i < 25; i++) {
    // small variation: mix around the chosen "number" within a band for variety
    const offset = randomInt(-3, 3);
    const localNumber = Math.min(100, Math.max(1, number + offset));
    const q = generateQuestionFor(grade, progressiveIndex, localNumber);
    STATE.questions.push(q);
  }

  // UI
  quizGradeTopic.textContent = `Grade ${grade} · Progressive ${progressiveIndex} – ${STATE.topicName}`;
  quizNumberLabel.textContent = `Number ${number}`;
  quizIdSpan.textContent = STATE.quizId;
  quizStartTimeSpan.textContent = formatDateTime(STATE.startTime);
  quizElapsedTimeSpan.textContent = "00:00";
  quizFeedback.textContent = "Type your answer, then press Submit.";
  quizFeedback.className = "feedback info";
  helpPanel.classList.remove("visible");
  explanationBlock.classList.add("hidden");
  answerInput.disabled = false;
  submitAnswerBtn.disabled = false;
  answerInput.value = "";

  updateQuestionDisplay();
  startTimer();
  switchScreen("quiz");
}

function updateQuestionDisplay() {
  const idx = STATE.currentIndex;
  const q = STATE.questions[idx];

  quizQuestionText.textContent = q.text;
  quizConceptLabel.textContent = `Concept: ${q.concept || "Math practice"}`;
  quizQuestionCounter.textContent = `${idx + 1} / ${STATE.questions.length}`;
  quizProgressFill.style.width = `${(idx / STATE.questions.length) * 100}%`;

  quizFeedback.textContent = "Type your answer, then press Submit.";
  quizFeedback.className = "feedback info";

  helpPanel.classList.remove("visible");
  explanationBlock.classList.add("hidden");
  helpHint.textContent = q.hint || "";
  helpExplanation.textContent = q.explanation || "";
  helpExample.textContent = q.example || "";

  answerInput.value = "";
  answerInput.focus();
}

// ----- Answer handling -----
function submitCurrentAnswer() {
  if (STATE.currentIndex >= STATE.questions.length) return;

  const idx = STATE.currentIndex;
  const q = STATE.questions[idx];
  let userVal = answerInput.value.trim();

  if (userVal === "") {
    quizFeedback.textContent = "Please enter a number before submitting.";
    quizFeedback.className = "feedback error";
    return;
  }

  let parsed = parseFloat(userVal);
  if (isNaN(parsed)) {
    quizFeedback.textContent = "Please enter a valid number.";
    quizFeedback.className = "feedback error";
    return;
  }

  STATE.attempts[idx]++;

  const correctAnswer = q.answer;
  let isCorrect = false;

  if (typeof correctAnswer === "number" && String(correctAnswer).includes(".")) {
    const diff = Math.abs(correctAnswer - parsed);
    isCorrect = diff < 0.01;
  } else {
    isCorrect = parsed === correctAnswer;
  }

  if (isCorrect) {
    if (STATE.attempts[idx] === 1) {
      STATE.firstTryCorrectCount++;
    }
    showCorrectFlash();
    playCorrectSound();
    quizFeedback.textContent = "Correct!";
    quizFeedback.className = "feedback info";
    answerInput.disabled = true;
    submitAnswerBtn.disabled = true;

    setTimeout(() => {
      answerInput.disabled = false;
      submitAnswerBtn.disabled = false;
      correctFlash.classList.remove("visible");

      STATE.currentIndex++;
      if (STATE.currentIndex >= STATE.questions.length) {
        finishQuiz();
      } else {
        updateQuestionDisplay();
      }
    }, 1000); // 1 second delay before next question
  } else {
    quizFeedback.textContent = "Not correct yet, try again.";
    quizFeedback.className = "feedback error";
  }
}

function toggleHelpPanel() {
  const idx = STATE.currentIndex;
  if (!helpPanel.classList.contains("visible")) {
    helpPanel.classList.add("visible");
    STATE.helpUsed[idx] = true;
  } else {
    helpPanel.classList.remove("visible");
  }
}

// ----- Correct flash & sounds -----
function showCorrectFlash() {
  const msg = correctMessages[randomInt(0, correctMessages.length - 1)];
  const color = correctColors[randomInt(0, correctColors.length - 1)];
  correctFlash.textContent = msg;
  correctFlash.style.color = color;
  correctFlash.classList.add("visible");
}

function playCorrectSound() {
  if (correctSound && correctSound.play) {
    try {
      correctSound.currentTime = 0;
      correctSound.volume = 0.6;
      correctSound.play();
    } catch (e) {}
  }
}

function playResultSound() {
  if (resultSound && resultSound.play) {
    try {
      resultSound.currentTime = 0;
      resultSound.volume = 0.6;
      resultSound.play();
    } catch (e) {}
  }
}

// ----- Finish quiz -----
function finishQuiz() {
  stopTimer();
  STATE.endTime = new Date();

  const totalSec = STATE.elapsedSeconds;
  const totalQ = STATE.questions.length;

  resultGrade.textContent = `Grade ${STATE.grade}`;
  resultProgressive.textContent = `Progressive ${STATE.progressiveIndex}`;
  resultTopic.textContent = STATE.topicName;
  resultNumber.textContent = STATE.number;
  resultQuizId.textContent = STATE.quizId;

  resultStarted.textContent = formatDateTime(STATE.startTime);
  resultFinished.textContent = formatDateTime(STATE.endTime);
  resultTotalTime.textContent = formatTimeSeconds(totalSec);

  const avg = totalQ > 0 ? Math.round((totalSec / totalQ) * 10) / 10 : 0;
  resultAvgTime.textContent = `${avg} s/question`;

  const firstTry = STATE.firstTryCorrectCount;
  const multiAttempt = totalQ - firstTry;
  const helpCount = STATE.helpUsed.filter(Boolean).length;

  resultFirstTry.textContent = `${firstTry} / ${totalQ}`;
  resultMultiAttempt.textContent = `${multiAttempt}`;
  resultHelpUsed.textContent = `${helpCount}`;

  resultSummaryLine.textContent =
    `Grade ${STATE.grade} · Progressive ${STATE.progressiveIndex} – ${STATE.topicName} · ` +
    `Number ${STATE.number} · Quiz ID ${STATE.quizId}`;

  switchScreen("result");
  playResultSound();
}
