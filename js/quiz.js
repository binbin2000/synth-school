/* ============================================================
   quiz.js — Quiz Engine
   ============================================================ */

const Quiz = (() => {
  // Per-session state (not persisted)
  const sessions = {}; // lessonId -> { currentQ, answers, attempts, container }

  function getSession(lessonId) {
    if (!sessions[lessonId]) {
      sessions[lessonId] = { currentQ: 0, answers: [], attempts: 0, container: null };
    }
    return sessions[lessonId];
  }

  // ── Render quiz widget into container ────────────────────────
  function renderQuiz(container, lessonId) {
    const lesson = window.LESSONS[lessonId];
    if (!lesson || !lesson.quiz) return;

    const session = getSession(lessonId);
    session.container = container;
    session.currentQ = 0;
    session.answers = [];

    container.innerHTML = '';

    const widget = document.createElement('div');
    widget.className = 'quiz-widget';

    // Header
    const header = document.createElement('div');
    header.className = 'quiz-header';
    header.innerHTML = `
      <span class="quiz-icon">◈</span>
      <span class="quiz-title">Kunskapskoll</span>
      <span class="quiz-progress-label" id="quiz-progress-${lessonId}">Fråga 1 av ${lesson.quiz.questions.length}</span>
    `;
    widget.appendChild(header);

    // Body
    const body = document.createElement('div');
    body.className = 'quiz-body';
    body.id = `quiz-body-${lessonId}`;
    widget.appendChild(body);

    container.appendChild(widget);

    // Use requestAnimationFrame so the container is in the DOM before we render the first question
    requestAnimationFrame(() => showQuestion(lessonId, 0));
  }

  // ── Show a single question ────────────────────────────────────
  function showQuestion(lessonId, index) {
    const lesson = window.LESSONS[lessonId];
    const session = getSession(lessonId);
    const q = lesson.quiz.questions[index];

    // Find body via container reference (safe even if not yet in document)
    const session2 = getSession(lessonId);
    const body = session2.container?.querySelector(`#quiz-body-${lessonId}`)
              || document.getElementById(`quiz-body-${lessonId}`);
    const progressLabel = session2.container?.querySelector(`#quiz-progress-${lessonId}`)
                       || document.getElementById(`quiz-progress-${lessonId}`);
    if (!body || !q) return;

    if (progressLabel) {
      progressLabel.textContent = `Fråga ${index + 1} av ${lesson.quiz.questions.length}`;
    }

    body.innerHTML = '';

    const qText = document.createElement('p');
    qText.className = 'quiz-q-text';
    qText.textContent = q.text;
    body.appendChild(qText);

    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'quiz-options';
    body.appendChild(optionsDiv);

    q.options.forEach((optText, i) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option';
      btn.textContent = optText;
      btn.addEventListener('click', () => handleAnswer(lessonId, index, i, btn, optionsDiv));
      optionsDiv.appendChild(btn);
    });
  }

  // ── Handle answer selection ───────────────────────────────────
  function handleAnswer(lessonId, qIndex, selectedIndex, selectedBtn, optionsDiv) {
    const lesson = window.LESSONS[lessonId];
    const q = lesson.quiz.questions[qIndex];
    const session = getSession(lessonId);

    // Disable all buttons
    const allBtns = optionsDiv.querySelectorAll('.quiz-option');
    allBtns.forEach(b => { b.disabled = true; });

    const isCorrect = selectedIndex === q.correctIndex;
    session.answers[qIndex] = isCorrect;

    // Short delay before showing correct/incorrect
    setTimeout(() => {
      selectedBtn.classList.add(isCorrect ? 'correct' : 'incorrect');
      if (!isCorrect) {
        allBtns[q.correctIndex].classList.add('correct');
      }

      // Explanation
      const explanation = document.createElement('div');
      explanation.className = 'quiz-explanation';
      explanation.innerHTML = `<strong>${isCorrect ? '✓ Rätt!' : '✗ Inte riktigt.'}</strong> ${q.explanation}`;
      optionsDiv.after(explanation);

      // Next button
      const session = getSession(lessonId);
      const body = session.container?.querySelector(`#quiz-body-${lessonId}`)
                || document.getElementById(`quiz-body-${lessonId}`);
      const isLast = qIndex === lesson.quiz.questions.length - 1;

      if (isLast) {
        // Auto-advance to results after reading explanation
        setTimeout(() => showResults(lessonId), 1800);
      } else {
        const nextBtn = document.createElement('button');
        nextBtn.className = 'quiz-next-btn';
        nextBtn.textContent = 'NÄSTA FRÅGA →';
        nextBtn.addEventListener('click', () => showQuestion(lessonId, qIndex + 1));
        body?.appendChild(nextBtn);
      }
    }, 350);
  }

  // ── Show quiz results inline in the quiz widget ──────────────
  function showResults(lessonId) {
    const lesson = window.LESSONS[lessonId];
    const session = getSession(lessonId);
    session.attempts++;

    const correct = session.answers.filter(Boolean).length;
    const total = lesson.quiz.questions.length;
    const passing = lesson.quiz.passingScore || Math.ceil(total * 0.75);
    const passed = correct >= passing;

    // Save progress
    if (window.App) App.markLessonComplete(lessonId, correct, total, passed);

    // Play sound feedback
    try {
      Piano.ensureAudioContext();
      if (passed) SynthDemo.playChord([261.63, 329.63, 392], 'sine', 1.0);
      else SynthDemo.playTone(220, 'sine', 0.4);
    } catch (e) { /* audio optional */ }

    // Render results inline in the quiz body
    const body = session.container?.querySelector(`#quiz-body-${lessonId}`)
              || document.getElementById(`quiz-body-${lessonId}`);
    if (!body) return;

    const stars = starsFor(correct, total, passing);
    const isLast = lessonId === 16;

    body.innerHTML = '';

    const scoreEl = document.createElement('div');
    scoreEl.style.cssText = 'text-align:center;padding:.5rem 0 1rem';
    scoreEl.innerHTML = `
      <div style="font-family:'Orbitron',monospace;font-size:2.5rem;font-weight:900;color:${passed ? 'var(--neon-green)' : 'var(--neon-pink)'};text-shadow:${passed ? 'var(--glow-green)' : 'var(--glow-pink)'}">
        ${correct}/${total}
      </div>
      <div style="font-size:1.6rem;letter-spacing:.3rem;margin:.25rem 0 .6rem">${stars}</div>
      <p style="color:var(--text-secondary);font-size:.9rem;margin-bottom:${passed ? '1.25rem' : '.5rem'}">${feedbackText(correct, total, passing, passed)}</p>
      ${!passed ? `<p style="font-family:'Share Tech Mono',monospace;font-size:.7rem;color:var(--text-muted);margin-bottom:1rem">Du behöver ${passing}/${total} rätt för att låsa upp nästa lektion.</p>` : ''}
    `;
    body.appendChild(scoreEl);

    const btnRow = document.createElement('div');
    btnRow.style.cssText = 'display:flex;gap:.75rem;justify-content:center;flex-wrap:wrap';

    const retryBtn = document.createElement('button');
    retryBtn.className = 'btn btn-secondary';
    retryBtn.style.fontSize = '.72rem';
    retryBtn.textContent = 'FÖRSÖK IGEN';
    retryBtn.addEventListener('click', () => reset(lessonId));
    btnRow.appendChild(retryBtn);

    if (passed && !isLast) {
      const continueBtn = document.createElement('button');
      continueBtn.className = 'btn btn-primary';
      continueBtn.style.fontSize = '.72rem';
      continueBtn.textContent = 'NÄSTA LEKTION →';
      continueBtn.addEventListener('click', () => {
        if (window.App) App.handleNextAfterQuiz(lessonId);
      });
      btnRow.appendChild(continueBtn);
    } else if (passed && isLast) {
      const finishBtn = document.createElement('button');
      finishBtn.className = 'btn btn-primary';
      finishBtn.style.fontSize = '.72rem';
      finishBtn.textContent = 'AVSLUTA KURSEN ◈';
      finishBtn.addEventListener('click', () => {
        if (window.App) App.handleNextAfterQuiz(lessonId);
      });
      btnRow.appendChild(finishBtn);
    }

    body.appendChild(btnRow);
    body.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // ── Helpers ───────────────────────────────────────────────────
  function starsFor(correct, total, passing) {
    if (correct === total) return '★★★';
    if (correct >= passing) return '★★☆';
    if (correct >= passing - 1) return '★☆☆';
    return '☆☆☆';
  }

  function feedbackText(correct, total, passing, passed) {
    if (correct === total) return 'Perfekt! Du kan allt från den här lektionen!';
    if (passed) return `Bra jobbat! Du klarade kunskapskollet.`;
    return `Du fick ${correct} av ${total} rätt. Repetera lektionen och försök igen!`;
  }

  // ── Reset a lesson's quiz ─────────────────────────────────────
  function reset(lessonId) {
    const session = getSession(lessonId);
    session.currentQ = 0;
    session.answers = [];
    if (session.container) {
      renderQuiz(session.container, lessonId);
    }
  }

  function isAllAnswered(lessonId) {
    const lesson = window.LESSONS[lessonId];
    if (!lesson?.quiz) return true;
    const session = getSession(lessonId);
    return session.answers.length >= lesson.quiz.questions.length;
  }

  return { renderQuiz, reset, showResults, isAllAnswered };
})();
