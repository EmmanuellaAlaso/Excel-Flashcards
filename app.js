(() => {
  "use strict";

  const app = document.querySelector("#app");
  const sessions = window.SHEETWISE_SESSIONS;
  const storageKey = "sw";
  const timerOptions = [
    ["up", "Stopwatch"],
    ["off", "Off"],
    ["15", "15s"],
    ["30", "30s"],
    ["60", "60s"],
  ];

  if (!app || !Array.isArray(sessions) || sessions.length === 0) {
    throw new Error("Sheetwise could not load its lesson data.");
  }

  const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);
  const escapeHtml = (value) =>
    String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  const formatInline = (value) =>
    escapeHtml(value)
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  const formatTime = (seconds) =>
    `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
  const cardId = (sessionIndex, cardIndex) => `${sessionIndex}-${cardIndex}`;

  function loadProgress() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
      return {
        learned: saved.m && typeof saved.m === "object" ? saved.m : {},
        timer: saved.t ?? "up",
      };
    } catch (error) {
      console.warn("Sheetwise could not read saved progress.", error);
      return { learned: {}, timer: "up" };
    }
  }

  const progress = loadProgress();
  let state = null;
  let timerId = null;

  function saveProgress() {
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ m: progress.learned, t: progress.timer }),
      );
    } catch (error) {
      console.warn("Sheetwise could not save progress.", error);
    }
  }

  function timerLimit() {
    const seconds = Number(progress.timer);
    return Number.isFinite(seconds) && seconds > 0 ? seconds : 0;
  }

  function home() {
    clearInterval(timerId);
    state = null;

    const totalCards = sessions.reduce((total, session) => total + session.c.length, 0);
    const learnedCount = Object.keys(progress.learned).length;
    const timerControls = timerOptions
      .map(([value, label]) => {
        const selected = String(progress.timer) === value ? "on" : "";
        return `<button type="button" class="${selected}" data-action="timer" data-value="${value}" aria-pressed="${selected ? "true" : "false"}">${label}</button>`;
      })
      .join("");

    app.innerHTML = `
      <header class="top">
        <div class="logo"><span class="logo-mark" aria-hidden="true">fx</span>Sheetwise</div>
        <span class="sc">${learnedCount} of ${totalCards} cards learned</span>
      </header>
      <h1>Excel, one small step at a time</h1>
      <p class="sub">Six sessions of 12 cards each, finishing with four real-life scenarios. Turn a card over, turn it back, and revisit it as often as you like.</p>
      <div class="set">
        <span>Timer</span>
        <div class="seg" role="group" aria-label="Timer">${timerControls}</div>
        ${timerLimit() ? "<span>per card</span>" : ""}
      </div>
      ${sessions.map(renderSession).join("")}`;
  }

  function renderSession(session, index) {
    const learned = session.c.filter((_, cardIndex) =>
      progress.learned[cardId(index, cardIndex)],
    ).length;
    const scenarioCount = session.c.filter((card) => card[3]).length;
    const percentage = Math.round((learned / session.c.length) * 100);

    return `
      <section class="row" aria-label="Session ${index + 1}: ${escapeHtml(session.t)}">
        <div class="sq" aria-hidden="true">S${index + 1}</div>
        <div class="mid">
          <b>${escapeHtml(session.t)}</b>
          <small>${escapeHtml(session.d)} · ${session.c.length} cards (last ${scenarioCount} are real-life scenarios) · ${learned} learned</small>
          <div class="bar" role="progressbar" aria-label="Session progress" aria-valuemin="0" aria-valuemax="${session.c.length}" aria-valuenow="${learned}">
            <i style="width:${percentage}%"></i>
          </div>
        </div>
        <div class="btns">
          <button class="btn secondary" type="button" data-action="start" data-session="${index}" data-mode="study">Study</button>
          <button class="btn" type="button" data-action="start" data-session="${index}" data-mode="quiz">Quiz</button>
        </div>
      </section>`;
  }

  function startSession(sessionIndex, mode) {
    const cards = sessions[sessionIndex].c;
    const core = cards.map((_, index) => index).filter((index) => !cards[index][3]);
    const scenarios = cards.map((_, index) => index).filter((index) => cards[index][3]);

    state = {
      sessionIndex,
      mode,
      queue: [...shuffle(core), ...shuffle(scenarios)],
      index: 0,
      flipped: false,
      startedAt: Date.now(),
      cardStartedAt: Date.now(),
      correct: 0,
      answered: 0,
      hasAnswered: false,
      options: [],
      correctOption: -1,
      done: false,
    };
    renderCard();
    clearInterval(timerId);
    timerId = setInterval(updateTimer, 250);
  }

  function renderHeader() {
    const length = state.queue.length;
    const percentage = Math.round((state.index / length) * 100);
    return `
      <div class="bar2">
        <button class="back" type="button" data-action="home">‹ Sessions</button>
        <div class="bar" role="progressbar" aria-label="Session progress" aria-valuemin="0" aria-valuemax="${length}" aria-valuenow="${state.index}">
          <i style="width:${percentage}%"></i>
        </div>
        <span class="tm" id="timer" aria-live="off"></span>
      </div>`;
  }

  function renderCard() {
    if (state.index >= state.queue.length) {
      renderResults();
      return;
    }

    state.flipped = false;
    state.hasAnswered = false;
    state.cardStartedAt = Date.now();

    const session = sessions[state.sessionIndex];
    const card = session.c[state.queue[state.index]];
    const timerMarkup = timerLimit()
      ? '<div class="cd"><i id="countdown" style="width:100%"></i></div>'
      : '<div class="cd" style="visibility:hidden"><i id="countdown"></i></div>';

    if (state.mode === "study") {
      app.innerHTML = `${renderHeader()}
        <div class="stage">
          <div class="card" id="flashcard" role="button" tabindex="0" aria-label="Flashcard. Activate to reveal the answer." data-action="flip">
            <div class="face">
              <div class="fb"><div class="nb">${escapeHtml(card[0])}</div><div class="fx" aria-hidden="true">fx</div><div class="fl">${card[3] ? "Real-life scenario" : "Question"}</div></div>
              <div class="txt${card[3] ? " scenario-text" : ""}">${formatInline(card[1])}</div>
            </div>
            <div class="face back-face">
              <div class="fb"><div class="nb">${escapeHtml(card[0])}</div><div class="fx" aria-hidden="true">fx</div><div class="fl">Answer</div></div>
              <div class="txt"><div>${formatInline(card[2])}</div></div>
            </div>
          </div>
        </div>
        ${timerMarkup}
        <div id="controls"><p class="hint">Take your time. Click the card or press Space to turn it over</p></div>`;
    } else {
      renderQuizCard(card, timerMarkup);
    }
    updateTimer();
  }

  function renderQuizCard(card, timerMarkup) {
    const sessionCards = sessions[state.sessionIndex].c;
    state.options = card[3]
      ? shuffle([card[2], ...card[3]])
      : shuffle([
          card[2],
          ...shuffle(
            sessionCards
              .filter((candidate) => !candidate[3] && candidate !== card)
              .map((candidate) => candidate[2]),
          ).slice(0, 3),
        ]);
    state.correctOption = state.options.indexOf(card[2]);

    const options = state.options
      .map(
        (option, index) =>
          `<button class="opt" type="button" data-action="answer" data-option="${index}">${formatInline(option)}</button>`,
      )
      .join("");
    const scenarioTag = card[3] ? '<span class="tag">Real-life scenario</span>' : "";

    app.innerHTML = `${renderHeader()}
      <div class="sc">${scenarioTag}${escapeHtml(card[0])} · Question ${state.index + 1} of ${state.queue.length}</div>
      <div class="q${card[3] ? " scenario-text" : ""}">${formatInline(card[1])}</div>
      <div class="options">${options}</div>
      ${timerMarkup}
      <div id="controls"></div>`;
  }

  function flipCard() {
    if (!state || state.mode !== "study" || state.done) return;
    state.flipped = !state.flipped;
    document.querySelector("#flashcard")?.classList.toggle("flipped", state.flipped);
    document.querySelector("#flashcard")?.setAttribute(
      "aria-label",
      state.flipped ? "Flashcard answer. Activate to return to the question." : "Flashcard question. Activate to reveal the answer.",
    );

    const controls = document.querySelector("#controls");
    if (state.flipped) {
      controls.innerHTML = `
        <div class="rate" role="group" aria-label="How well did you know the answer?">
          <button class="again" type="button" data-action="rate" data-rating="1">Again<small>press 1</small></button>
          <button class="hard" type="button" data-action="rate" data-rating="2">Hard<small>press 2</small></button>
          <button class="good" type="button" data-action="rate" data-rating="3">Good<small>press 3</small></button>
          <button class="easy" type="button" data-action="rate" data-rating="4">Easy<small>press 4</small></button>
        </div>
        <p class="hint">Click the card to read the question again</p>`;
    } else {
      controls.innerHTML = '<p class="hint">Click the card or press Space to turn it over</p>';
    }
  }

  function rateCard(rating) {
    if (!state || !state.flipped || state.done) return;

    const currentCard = state.queue[state.index];
    state.answered += 1;
    if (rating >= 3) {
      progress.learned[cardId(state.sessionIndex, currentCard)] = 1;
      state.correct += 1;
    } else {
      delete progress.learned[cardId(state.sessionIndex, currentCard)];
      if (rating === 1) {
        state.queue.push(currentCard);
      } else {
        state.queue.splice(Math.min(state.index + 4, state.queue.length), 0, currentCard);
      }
    }

    saveProgress();
    state.index += 1;
    renderCard();
  }

  function answerQuestion(optionIndex) {
    if (!state || state.hasAnswered || state.done) return;

    state.hasAnswered = true;
    const currentCard = state.queue[state.index];
    const isCorrect = optionIndex === state.correctOption;
    state.answered += 1;

    if (isCorrect) {
      state.correct += 1;
      progress.learned[cardId(state.sessionIndex, currentCard)] = 1;
    } else {
      delete progress.learned[cardId(state.sessionIndex, currentCard)];
    }
    saveProgress();

    document.querySelectorAll(".opt").forEach((button, index) => {
      button.disabled = true;
      if (index === state.correctOption) button.classList.add("correct");
      if (index === optionIndex && !isCorrect) button.classList.add("incorrect");
    });

    const message = optionIndex < 0 ? "Time’s up." : isCorrect ? "Correct." : "Not quite.";
    document.querySelector("#controls").innerHTML = `
      <p class="hint">${message}</p>
      <div class="btns" style="justify-content:center;margin-top:10px">
        <button class="btn" type="button" data-action="next">${state.index + 1 >= state.queue.length ? "See results" : "Next"}</button>
      </div>`;
  }

  function renderResults() {
    clearInterval(timerId);
    state.done = true;

    const score = Math.round((state.correct / Math.max(1, state.answered)) * 100);
    const elapsed = Math.round((Date.now() - state.startedAt) / 1000);
    const title = escapeHtml(sessions[state.sessionIndex].t);
    const headline = state.mode === "quiz" ? `${score}%` : "Well done";
    const result = state.mode === "quiz"
      ? `${state.correct} of ${state.answered} correct`
      : `${state.correct} of ${state.answered} cards feel familiar`;

    app.innerHTML = `
      <div class="end">
        <div class="sc">${title}</div>
        <div class="big">${headline}</div>
        <p class="sub">${result} in ${formatTime(elapsed)}</p>
        <div class="btns">
          <button class="btn secondary" type="button" data-action="home">All sessions</button>
          <button class="btn" type="button" data-action="retry">Go again</button>
        </div>
      </div>`;
  }

  function updateTimer() {
    if (!state) return;
    const timer = document.querySelector("#timer");
    if (!timer) return;

    const limit = timerLimit();
    if (limit && !state.done) {
      const remaining = Math.max(0, limit - (Date.now() - state.cardStartedAt) / 1000);
      timer.textContent = `${Math.ceil(remaining)}s`;
      timer.classList.toggle("low", remaining <= 5);
      const countdown = document.querySelector("#countdown");
      if (countdown) countdown.style.width = `${(remaining / limit) * 100}%`;

      if (remaining <= 0) {
        if (state.mode === "study" && !state.flipped) flipCard();
        if (state.mode === "quiz" && !state.hasAnswered) answerQuestion(-1);
      }
    } else {
      timer.textContent = progress.timer === "off"
        ? ""
        : formatTime((Date.now() - state.startedAt) / 1000);
    }
  }

  app.addEventListener("click", (event) => {
    const control = event.target.closest("[data-action]");
    if (!control || !app.contains(control)) return;

    switch (control.dataset.action) {
      case "timer":
        progress.timer = control.dataset.value;
        saveProgress();
        home();
        break;
      case "start":
        startSession(Number(control.dataset.session), control.dataset.mode);
        break;
      case "home":
        home();
        break;
      case "flip":
        flipCard();
        break;
      case "rate":
        rateCard(Number(control.dataset.rating));
        break;
      case "answer":
        answerQuestion(Number(control.dataset.option));
        break;
      case "next":
        state.index += 1;
        renderCard();
        break;
      case "retry":
        startSession(state.sessionIndex, state.mode);
        break;
      default:
        break;
    }
  });

  app.addEventListener("keydown", (event) => {
    if (!state || state.done || event.target.matches("button, input, textarea, select")) return;

    if (event.key === "Escape") {
      home();
      return;
    }

    if (state.mode === "study") {
      if ((event.key === " " || event.key === "Enter") && event.target.id !== "flashcard") {
        event.preventDefault();
        flipCard();
      } else if (event.target.id === "flashcard" && (event.key === " " || event.key === "Enter")) {
        event.preventDefault();
        flipCard();
      } else if (state.flipped && /^[1-4]$/.test(event.key)) {
        rateCard(Number(event.key));
      }
    } else if (state.hasAnswered && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      state.index += 1;
      renderCard();
    } else if (!state.hasAnswered && /^[1-4]$/.test(event.key)) {
      const optionIndex = Number(event.key) - 1;
      if (optionIndex < state.options.length) answerQuestion(optionIndex);
    }
  });

  home();
})();
