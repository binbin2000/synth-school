/* ============================================================
   app.js — Orchestrator: navigation, rendering, progress
   ============================================================ */

var App = (() => {

  // ── State ─────────────────────────────────────────────────────
  const state = {
    currentLessonId: null,
    currentScreen: 'home',
    quizPendingForLesson: null,
  };

  // ── Progress (localStorage) ───────────────────────────────────
  const STORAGE_KEY = 'synthSchoolProgress';
  const SCHEMA_VERSION = 1;

  const Progress = {
    _cache: null,

    load() {
      if (this._cache) return this._cache;
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return this._default();
        const data = JSON.parse(raw);
        if (data.version !== SCHEMA_VERSION) return this._default();
        this._cache = data;
        return data;
      } catch (e) {
        return this._default();
      }
    },

    _default() {
      this._cache = { version: SCHEMA_VERSION, lastVisited: null, lessons: {} };
      return this._cache;
    },

    save() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this._cache));
      } catch (e) {
        showToast('Progress kan inte sparas i privat läge.');
      }
    },

    markComplete(lessonId, quizScore, quizTotal, passed) {
      const d = this.load();
      const existing = d.lessons[lessonId] || {};
      d.lessons[lessonId] = {
        completed: passed,
        quizScore,
        quizTotal,
        quizAttempts: (existing.quizAttempts || 0) + 1,
        completedDate: new Date().toISOString().slice(0, 10),
      };
      d.lastVisited = lessonId;
      this.save();
      updateProgressBar();
      buildSidebar();
    },

    isCompleted(lessonId) {
      return this.load().lessons[lessonId]?.completed === true;
    },

    isAccessible(lessonId) {
      if (lessonId === 1) return true;
      return this.isCompleted(lessonId - 1);
    },

    getCompletedCount() {
      return Object.values(this.load().lessons).filter(l => l.completed).length;
    },

    reset() {
      localStorage.removeItem(STORAGE_KEY);
      this._cache = null;
    },
  };

  // ── Toast ─────────────────────────────────────────────────────
  function showToast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2800);
  }

  // ── Screen management ─────────────────────────────────────────
  function showScreen(name) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(`${name}-screen`);
    if (target) target.classList.add('active');
    state.currentScreen = name;
    document.getElementById('content-area').scrollTop = 0;
    window.scrollTo(0, 0);
  }

  // ── Progress bar ──────────────────────────────────────────────
  function updateProgressBar() {
    const done = Progress.getCompletedCount();
    const total = 16;
    const pct = (done / total) * 100;
    const bar = document.getElementById('nav-progress-bar');
    const label = document.getElementById('nav-progress-label');
    if (bar) bar.style.width = pct + '%';
    if (label) label.textContent = `${done} / ${total} lektioner`;
  }

  // ── Sidebar ───────────────────────────────────────────────────
  function buildSidebar() {
    const inner = document.getElementById('sidebar-inner');
    if (!inner) return;
    inner.innerHTML = '';

    window.MODULES.forEach(mod => {
      const group = document.createElement('div');
      group.className = 'module-group';

      const header = document.createElement('div');
      header.className = 'module-header';
      header.textContent = `Modul ${mod.id} — ${mod.title}`;
      group.appendChild(header);

      const ul = document.createElement('ul');
      ul.className = 'lesson-list';

      mod.lessonIds.forEach(lid => {
        const lesson = window.LESSONS[lid];
        if (!lesson) return;
        const completed = Progress.isCompleted(lid);
        const accessible = Progress.isAccessible(lid);
        const active = lid === state.currentLessonId;

        const li = document.createElement('li');
        li.className = 'lesson-item' +
          (active ? ' active' : '') +
          (completed ? ' completed' : '') +
          (!accessible && !active ? ' locked' : '');

        const icon = document.createElement('span');
        icon.className = 'lesson-status-icon';
        icon.textContent = completed ? '✓' : (!accessible ? '🔒' : '○');

        const title = document.createElement('span');
        title.className = 'lesson-title';
        title.textContent = `L${lid}: ${lesson.title}`;

        li.appendChild(icon);
        li.appendChild(title);

        if (accessible || completed) {
          li.addEventListener('click', () => navigateTo(lid));
        }

        ul.appendChild(li);
      });

      group.appendChild(ul);
      inner.appendChild(group);
    });
  }

  // ── Navigation ────────────────────────────────────────────────
  function closeMobileSidebar() {
    document.getElementById('layout')?.classList.remove('sidebar-open');
  }

  function navigateTo(lessonId) {
    closeMobileSidebar();
    if (lessonId === null) {
      state.currentLessonId = null;
      buildSidebar();
      showScreen('home');
      window.location.hash = '';
      return;
    }

    const lesson = window.LESSONS[lessonId];
    if (!lesson) return;

    state.currentLessonId = lessonId;
    state.quizPendingForLesson = null;
    Progress.load().lastVisited = lessonId;
    Progress.save();

    renderLesson(lessonId);
    buildSidebar();
    showScreen('lesson');
    window.location.hash = `lesson-${lessonId}`;
  }

  // ── Lesson rendering ──────────────────────────────────────────
  function renderLesson(lessonId) {
    const lesson = window.LESSONS[lessonId];
    if (!lesson) return;

    // Header
    const mod = window.MODULES.find(m => m.id === lesson.moduleId);
    document.getElementById('lesson-breadcrumb').textContent =
      `Modul ${lesson.moduleId}: ${mod?.title || ''} › Lektion ${lessonId}`;
    document.getElementById('lesson-title-display').textContent = lesson.title;

    const tagsEl = document.getElementById('lesson-tags');
    tagsEl.innerHTML = '';
    (lesson.tags || []).forEach(tag => {
      const span = document.createElement('span');
      span.className = 'tag';
      span.textContent = tag;
      tagsEl.appendChild(span);
    });

    // Body
    const body = document.getElementById('lesson-body');
    body.innerHTML = '';
    lesson.blocks.forEach(block => {
      const el = renderBlock(block, lessonId);
      if (el) body.appendChild(el);
    });

    // Footer — only previous button; forward navigation handled by quiz
    const prevBtn = document.getElementById('prev-lesson-btn');
    const nextBtn = document.getElementById('next-lesson-btn');
    const statusEl = document.getElementById('lesson-completion-status');

    prevBtn.style.visibility = lessonId === 1 ? 'hidden' : 'visible';
    prevBtn.onclick = () => navigateTo(lessonId - 1);

    // Hide the next button — progression is driven by the inline quiz result
    if (nextBtn) nextBtn.style.display = 'none';

    const completed = Progress.isCompleted(lessonId);
    statusEl.innerHTML = completed
      ? `<span style="font-family:'Share Tech Mono',monospace;font-size:.7rem;color:var(--neon-green)">✓ AVKLARAD</span>`
      : '';
  }

  // ── Block renderer ────────────────────────────────────────────
  function renderBlock(block, lessonId) {
    switch (block.type) {

      case 'text': {
        const div = document.createElement('div');
        div.className = 'block-text';
        div.innerHTML = block.html;
        // Wire up chord buttons
        div.querySelectorAll('.chord-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const notes = JSON.parse(btn.dataset.notes);
            const wave = btn.dataset.wave || 'sawtooth';
            const dur = parseFloat(btn.dataset.duration) || 1.2;
            Piano.ensureAudioContext();
            SynthDemo.playChord(notes, wave, dur);
          });
        });
        return div;
      }

      case 'tip': {
        const div = document.createElement('div');
        div.className = 'block-tip';
        div.innerHTML = `<div class="tip-label">${block.label || 'TIPS'}</div>${block.html}`;
        return div;
      }

      case 'image': {
        const fig = document.createElement('figure');
        fig.className = 'block-image';
        fig.innerHTML = `<img src="assets/images/${block.src}" alt="${block.caption || ''}"><figcaption>${block.caption || ''}</figcaption>`;
        return fig;
      }

      case 'audio-demo': {
        return SynthDemo.createAudioDemoBlock(block);
      }

      case 'piano': {
        return Piano.createWidget(block.config);
      }

      case 'adsr': {
        return ADSRVisualizer.createBlock(block.config);
      }

      case 'waveform': {
        return ADSRVisualizer.createWaveformBlock(block.config);
      }

      case 'quiz': {
        const container = document.createElement('div');
        Quiz.renderQuiz(container, lessonId);
        return container;
      }

      case 'minifreak': {
        return renderMiniFreakBlock();
      }

      case 'arp-demo': {
        return SynthDemo.createArpDemoBlock(block.config);
      }

      default:
        return null;
    }
  }

  // ── MiniFreak diagram block ───────────────────────────────────
  function renderMiniFreakBlock() {
    const block = document.createElement('div');
    block.className = 'block-minifreak';

    // Sections in actual left-to-right panel order with real control names
    const sections = [
      {
        id: 'preset', name: 'PRESET', color: '#bf5fff',
        controls: ['PRESET NAME', 'BANK ◂ ▸', 'LOAD / SAVE', 'DISPLAY'],
        desc: 'Preset-hantering med OLED-display. Bläddra bland bankens ljud med pilknapparna. SAVE sparar dina ändringar. Håll inne SHIFT för extra funktioner.'
      },
      {
        id: 'osc-a', name: 'OSC A', color: '#00fff7',
        controls: ['TYPE', 'WAVE', 'TIMBRE', 'SHAPE'],
        desc: 'Digital oscillator A. TYPE väljer syntestyp — Virtual Analog, Wavetable, FM, Chords, Speech m.fl. WAVE väljer vågform/preset. TIMBRE och SHAPE formar klangfärgen beroende på vald syntestyp.'
      },
      {
        id: 'osc-b', name: 'OSC B', color: '#00fff7',
        controls: ['TYPE', 'WAVE', 'TIMBRE', 'SHAPE', 'SEMI', 'FINE'],
        desc: 'Digital oscillator B — identisk arkitektur som A men helt oberoende. SEMI stämmer om OSC B i halvtoner relativt A (t.ex. +7 = kvint). FINE för mikrostämning i cent. Blanda olika syntestyper för komplexa klanger.'
      },
      {
        id: 'mix', name: 'MIX', color: '#00fff7',
        controls: ['OSC A/B'],
        desc: 'Mixar balansen mellan OSC A och OSC B. Vrid vänster för enbart A, höger för enbart B, mitten för 50/50-mix. Enkelt men kraftfullt — prova att detuning OSC B och mixa in lite för bred, levande klang.'
      },
      {
        id: 'filter', name: 'FILTER', color: '#ff2d78',
        controls: ['CUTOFF', 'RESONANCE', 'ENV AMT', 'LP · BP · HP'],
        desc: 'Analogt Steiner-Parker-filter — en av MiniFreaks stoltaste funktioner. CUTOFF styr vilka frekvenser som släpps igenom. RESONANCE skapar en topp vid cutoff-frekvensen. ENV AMT avgör hur mycket Env 1 påverkar filtret. Välj LP (lågpass), BP (bandpass) eller HP (högpass) med switchen.'
      },
      {
        id: 'env1', name: 'ENV 1', color: '#ff2d78',
        controls: ['ATTACK', 'DECAY', 'SUSTAIN', 'RELEASE'],
        desc: 'Modulationsenvelope (ADSR). Styr som standard filter-cutoff via ENV AMT-knappen, men kan modulera nästan vad som helst via Mod Matrix. Snabb attack + kort decay = pluck-filter. Lång attack + hög sustain = svällande pad-filter.'
      },
      {
        id: 'env2', name: 'ENV 2', color: '#ff2d78',
        controls: ['ATTACK', 'DECAY', 'SUSTAIN', 'RELEASE'],
        desc: 'Amplitud-envelope (VCA). Det här är den viktigaste envelopen — den styr hur volymen förändras över tid. Kort attack + kort release = perkussivt ljud. Lång attack = fade-in. Lång release = efterklang. ADSR på ENV 2 är det du hör direkt.'
      },
      {
        id: 'lfo1', name: 'LFO 1', color: '#bf5fff',
        controls: ['RATE', 'WAVE', 'RISE', 'SHAPE'],
        desc: 'Lågfrekvensoscillator 1. RATE styr hastighet (0,01 Hz–100 Hz eller BPM-synkat). WAVE väljer form (sinus, triangel, såg, firkant, sample&hold). RISE ger mjuk fade-in av LFO. Koppla till destination via Mod Matrix — klassiskt: LFO 1 → PITCH för vibrato.'
      },
      {
        id: 'lfo2', name: 'LFO 2', color: '#bf5fff',
        controls: ['RATE', 'WAVE', 'RISE', 'SHAPE'],
        desc: 'Lågfrekvensoscillator 2 — identisk med LFO 1. Koppla till en annan destination för dubbel modulationsrörelse. Populärt exempel: LFO 1 → Filter cutoff (långsam svepning) + LFO 2 → OSC B pitch (snabb tremolo).'
      },
      {
        id: 'effects', name: 'EFFECTS', color: '#00fff7',
        controls: ['MOD (amount)', 'DELAY (time)', 'REVERB (size)', 'MOD TYPE', 'DELAY TYPE', 'REVERB TYPE'],
        desc: 'Tre parallella effektblock. MOD: Chorus, Flanger, Phaser eller Ensemble — ger bredd och rörelse. DELAY: ekko med BPM-sync, Ping Pong eller analog eko-karaktär. REVERB: Hall, Room, Plate eller Spring — ger rumslig dimension. Varje block har amount-reglage + typval.'
      },
      {
        id: 'arp', name: 'ARP / SEQ', color: '#bf5fff',
        controls: ['ON/OFF', 'RATE', 'GATE', 'MODE', 'OCT', 'HOLD'],
        desc: 'Arpeggiator och 16-stegs Step Sequencer delar samma sektion. ARP: håll ett ackord och välj mönster (Up, Down, Up-Down, Random) och oktavomfång. SEQ: spela in egna melodislingor upp till 64 steg med variabel gatelängd och transposition per steg.'
      },
      {
        id: 'macros', name: 'MACROS', color: '#ff2d78',
        controls: ['MACRO 1', 'MACRO 2', 'MACRO 3', 'MACRO 4'],
        desc: '4 programmerbara knappar för live-kontroll. Varje Macro kan kopplas till flera parametrar med individuell intensitet. Perfekt för scen: en knapptryckning kan öppna filtret, höja reverben och ändra LFO-hastigheten samtidigt. Assignas via MATRIX-knappen.'
      },
      {
        id: 'spice', name: 'SPICE / DICE', color: '#bf5fff',
        controls: ['SPICE ●', 'DICE ◈'],
        desc: 'Två unika knappar. SPICE: vrider subtilt på flera parametrar för att "krydda" nuvarande preset utan att radera det — bra för variation. DICE: randomiserar ett helt nytt ljud inom vald kategori — idealiskt för inspiration och att hitta oväntade klanger.'
      },
    ];

    // ── Header ────────────────────────────────────────────────────
    const header = document.createElement('div');
    header.className = 'minifreak-header';
    header.innerHTML = '<span style="color:var(--neon-cyan)">Arturia MiniFreak</span> — klicka på en sektion för detaljer';
    block.appendChild(header);

    // ── Panel ─────────────────────────────────────────────────────
    const panelWrap = document.createElement('div');
    panelWrap.className = 'mf-panel-wrap';

    const panel = document.createElement('div');
    panel.className = 'mf-panel';

    sections.forEach(s => {
      const sec = document.createElement('div');
      sec.className = 'mf-sec';
      sec.dataset.id = s.id;
      sec.style.setProperty('--sec-color', s.color);

      const nameEl = document.createElement('div');
      nameEl.className = 'mf-sec-name';
      nameEl.textContent = s.name;
      sec.appendChild(nameEl);

      const knobsEl = document.createElement('div');
      knobsEl.className = 'mf-sec-knobs';
      s.controls.forEach(ctrl => {
        const k = document.createElement('div');
        k.className = 'mf-knob';
        const dot = document.createElement('div');
        dot.className = 'mf-knob-dot';
        const lbl = document.createElement('div');
        lbl.className = 'mf-knob-lbl';
        lbl.textContent = ctrl;
        k.appendChild(dot);
        k.appendChild(lbl);
        knobsEl.appendChild(k);
      });
      sec.appendChild(knobsEl);

      panel.appendChild(sec);
    });

    panelWrap.appendChild(panel);

    // ── Keyboard bar ──────────────────────────────────────────────
    const keybar = document.createElement('div');
    keybar.className = 'mf-keyboard';
    for (let i = 0; i < 37; i++) {
      const k = document.createElement('div');
      k.className = 'mf-key';
      keybar.appendChild(k);
    }
    panelWrap.appendChild(keybar);
    block.appendChild(panelWrap);

    // ── Detail box ────────────────────────────────────────────────
    const detail = document.createElement('div');
    detail.className = 'minifreak-detail';
    detail.textContent = '← Klicka på en sektion ovan för att läsa om dess funktion.';
    block.appendChild(detail);

    // Click interaction
    panel.querySelectorAll('.mf-sec').forEach(sec => {
      sec.addEventListener('click', () => {
        panel.querySelectorAll('.mf-sec').forEach(s => s.classList.remove('active'));
        sec.classList.add('active');
        const found = sections.find(s => s.id === sec.dataset.id);
        if (found) {
          detail.innerHTML = `<strong style="color:var(--neon-cyan)">${found.name}</strong> — ${found.desc}`;
        }
      });
    });

    return block;
  }

  // ── Next lesson flow ──────────────────────────────────────────
  function handleNext(lessonId) {
    const lesson = window.LESSONS[lessonId];
    const completed = Progress.isCompleted(lessonId);

    // handleNext is now only called from module-complete and course-complete flows
    // Quiz-driven navigation happens inline via Quiz.showResults buttons

    // Last lesson
    if (lessonId === 16) {
      showCourseComplete();
      return;
    }

    // Check if end of module
    const currentMod = window.MODULES.find(m => m.lessonIds.includes(lessonId));
    const isLastInModule = currentMod && currentMod.lessonIds[currentMod.lessonIds.length - 1] === lessonId;

    if (isLastInModule && completed) {
      showModuleComplete(currentMod, lessonId);
    } else {
      navigateTo(lessonId + 1);
    }
  }

  function handleNextAfterQuiz(lessonId) {
    const lesson = window.LESSONS[lessonId];
    if (lessonId === 16) {
      showCourseComplete();
      return;
    }
    const currentMod = window.MODULES.find(m => m.lessonIds.includes(lessonId));
    const isLastInModule = currentMod && currentMod.lessonIds[currentMod.lessonIds.length - 1] === lessonId;
    if (isLastInModule) {
      showModuleComplete(currentMod, lessonId);
    } else {
      navigateTo(lessonId + 1);
    }
  }

  function showModuleComplete(mod, finishedLessonId) {
    const nextModId = mod.id + 1;
    const nextMod = window.MODULES.find(m => m.id === nextModId);

    document.getElementById('module-complete-title').textContent = `Modul ${mod.id} klar!`;
    document.getElementById('module-complete-text').textContent =
      nextMod
        ? `Du har klarat "${mod.title}". Nästa upp: Modul ${nextMod.id} — ${nextMod.title}.`
        : `Du har klarat alla moduler! Dags att göra din första synthwave-låt.`;

    const contBtn = document.getElementById('module-continue-btn');
    const homeBtn = document.getElementById('module-home-btn');

    contBtn.style.display = nextMod ? '' : 'none';
    if (nextMod) {
      contBtn.onclick = () => navigateTo(nextMod.lessonIds[0]);
    }
    homeBtn.onclick = () => navigateTo(null);

    showScreen('module-complete');
  }

  function showCourseComplete() {
    document.getElementById('module-complete-title').textContent = 'Kurs avklarad! ◈';
    document.getElementById('module-complete-text').textContent =
      'Du har gått igenom hela Synth School! Öppna din MiniFreak och skapa din första synthwave-låt.';
    document.getElementById('module-continue-btn').style.display = 'none';
    document.getElementById('module-home-btn').onclick = () => navigateTo(null);
    showScreen('module-complete');
  }

  // ── Mark lesson complete (called by quiz.js) ──────────────────
  function markLessonComplete(lessonId, score, total, passed) {
    Progress.markComplete(lessonId, score, total, passed);
  }

  // ── Hero waveform animation ───────────────────────────────────
  function animateHeroWaveform() {
    const canvas = document.getElementById('hero-waveform-canvas');
    if (!canvas) return;
    canvas.width = canvas.offsetWidth || 500;
    canvas.height = canvas.offsetHeight || 80;
    const ctx = canvas.getContext('2d');
    let t = 0;

    function draw() {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const grad = ctx.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, 'rgba(0,255,247,.8)');
      grad.addColorStop(0.5, 'rgba(191,95,255,.8)');
      grad.addColorStop(1, 'rgba(255,45,120,.8)');

      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.shadowColor = '#00fff7';
      ctx.shadowBlur = 8;
      ctx.beginPath();

      for (let x = 0; x < w; x++) {
        const phase = (x / w) * Math.PI * 6 + t;
        const y = h / 2 + Math.sin(phase) * (h * 0.3) * Math.sin(x / w * Math.PI);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      t += 0.025;
      requestAnimationFrame(draw);
    }
    draw();
  }

  // ── Init ──────────────────────────────────────────────────────
  function init() {
    // Build sidebar
    buildSidebar();
    updateProgressBar();

    // Hero animation
    animateHeroWaveform();

    // Start button
    document.getElementById('start-btn')?.addEventListener('click', () => {
      navigateTo(1);
    });

    // Continue button
    const lastVisited = Progress.load().lastVisited;
    const contBtn = document.getElementById('continue-btn');
    if (lastVisited && contBtn) {
      const les = window.LESSONS[lastVisited];
      contBtn.style.display = '';
      contBtn.textContent = `FORTSÄTT L${lastVisited}: ${les?.title?.toUpperCase() || ''}`;
      contBtn.addEventListener('click', () => navigateTo(lastVisited));
    }

    // Module overview cards
    const grid = document.getElementById('module-overview-grid');
    if (grid) {
      window.MODULES.forEach(mod => {
        const completed = mod.lessonIds.filter(id => Progress.isCompleted(id)).length;
        const card = document.createElement('div');
        card.className = `module-card module-${mod.id}`;
        card.style.setProperty('--accent', mod.color);
        card.innerHTML = `
          <div class="module-card-num">MODUL ${mod.id}</div>
          <div class="module-card-title">${mod.title}</div>
          <div class="module-card-subtitle">${mod.subtitle}</div>
          <div class="module-card-lessons">${completed}/${mod.lessonIds.length} lektioner klara</div>
        `;
        card.addEventListener('click', () => {
          const firstLesson = mod.lessonIds.find(id => Progress.isAccessible(id)) || mod.lessonIds[0];
          navigateTo(firstLesson);
        });
        grid.appendChild(card);
      });
    }

    // Sidebar backdrop for mobile overlay
    const backdrop = document.createElement('div');
    backdrop.id = 'sidebar-backdrop';
    document.getElementById('layout')?.appendChild(backdrop);
    backdrop.addEventListener('click', closeMobileSidebar);

    // Sidebar toggle: overlay on mobile, collapse on desktop
    document.getElementById('sidebar-toggle')?.addEventListener('click', () => {
      const layout = document.getElementById('layout');
      if (window.innerWidth <= 768) {
        layout.classList.toggle('sidebar-open');
      } else {
        layout.classList.toggle('sidebar-collapsed');
      }
    });

    // Piano init
    Piano.init();

    // Deep link via URL hash
    const hash = window.location.hash;
    const match = hash.match(/^#lesson-(\d+)$/);
    if (match) {
      const lessonId = parseInt(match[1]);
      if (window.LESSONS[lessonId]) navigateTo(lessonId);
    }
  }

  // ── DOMContentLoaded ──────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', init);

  // ── Public API ────────────────────────────────────────────────
  return {
    navigateTo,
    showScreen,
    markLessonComplete,
    handleNextAfterQuiz,
  };

})();
