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
      // Always write localStorage immediately as reliable backup
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this._cache));
      } catch (e) {
        showToast(I18n.t('private_warning'));
      }
      // Also schedule API save when a profile is active
      if (ProfileManager.isAvailable()) {
        ProfileManager.scheduleProgressSave(this._cache);
      }
    },

    loadFromProfile(profile) {
      const data = profile.progress;
      if (data && data.version === SCHEMA_VERSION) {
        this._cache = data;
      } else {
        this._cache = this._default();
      }
      // Mirror to localStorage so offline fallback stays current
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this._cache));
      } catch (e) { /* private mode */ }
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

    skip(lessonId) {
      const d = this.load();
      if (d.lessons[lessonId]?.completed) return; // don't overwrite a completed lesson
      d.lessons[lessonId] = { ...d.lessons[lessonId], skipped: true };
      d.lastVisited = lessonId;
      this.save();
      buildSidebar();
    },

    isSkipped(lessonId) {
      const entry = this.load().lessons[lessonId];
      return entry?.skipped === true && !entry?.completed;
    },

    isAccessible(lessonId) {
      if (lessonId === 1) return true;
      return this.isCompleted(lessonId - 1) || this.isSkipped(lessonId - 1);
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
    if (label) label.textContent = I18n.t('progress_label', done, total);
  }

  // ── Sidebar ───────────────────────────────────────────────────
  function buildSidebar() {
    const inner = document.getElementById('sidebar-inner');
    if (!inner) return;
    inner.innerHTML = '';

    I18n.getModules().forEach(mod => {
      const group = document.createElement('div');
      group.className = 'module-group';

      const header = document.createElement('div');
      header.className = 'module-header';
      header.textContent = `${I18n.t('module_word')} ${mod.id} — ${mod.title}`;
      group.appendChild(header);

      const ul = document.createElement('ul');
      ul.className = 'lesson-list';

      mod.lessonIds.forEach(lid => {
        const lesson = I18n.getLessons()[lid];
        if (!lesson) return;
        const completed = Progress.isCompleted(lid);
        const skipped   = Progress.isSkipped(lid);
        const accessible = Progress.isAccessible(lid);
        const active = lid === state.currentLessonId;

        const li = document.createElement('li');
        li.className = 'lesson-item' +
          (active ? ' active' : '') +
          (completed ? ' completed' : '') +
          (skipped ? ' skipped' : '') +
          (!accessible && !active ? ' locked' : '');

        const icon = document.createElement('span');
        icon.className = 'lesson-status-icon';
        icon.textContent = completed ? '✓' : (skipped ? '⤵' : (!accessible ? '🔒' : '○'));

        const title = document.createElement('span');
        title.className = 'lesson-title';
        title.textContent = `${I18n.t('lesson_word').charAt(0)}${lid}: ${lesson.title}`;

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

    const lesson = I18n.getLessons()[lessonId];
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
    const lesson = I18n.getLessons()[lessonId];
    if (!lesson) return;

    // Header
    const mod = I18n.getModules().find(m => m.id === lesson.moduleId);
    document.getElementById('lesson-breadcrumb').textContent =
      `${I18n.t('module_word')} ${lesson.moduleId}: ${mod?.title || ''} › ${I18n.t('lesson_word')} ${lessonId}`;
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

    prevBtn.textContent = I18n.t('prev_btn');
    prevBtn.style.visibility = lessonId === 1 ? 'hidden' : 'visible';
    prevBtn.onclick = () => navigateTo(lessonId - 1);

    // Hide the next button — progression is driven by the inline quiz result
    if (nextBtn) { nextBtn.style.display = 'none'; nextBtn.textContent = I18n.t('next_btn'); }

    const completed = Progress.isCompleted(lessonId);
    const skipped   = Progress.isSkipped(lessonId);

    // Remove any previous skip button
    document.getElementById('skip-lesson-btn')?.remove();

    if (!completed) {
      const skipBtn = document.createElement('button');
      skipBtn.id = 'skip-lesson-btn';
      skipBtn.className = 'btn-skip-lesson';
      skipBtn.textContent = I18n.t('skip_btn');
      skipBtn.addEventListener('click', () => {
        Progress.skip(lessonId);
        const nextId = lessonId + 1;
        if (I18n.getLessons()[nextId]) {
          navigateTo(nextId);
        } else {
          navigateTo(null);
        }
      });
      statusEl.after(skipBtn);
    }

    statusEl.innerHTML = completed
      ? `<span style="font-family:'Share Tech Mono',monospace;font-size:.7rem;color:var(--neon-green)">${I18n.t('status_completed')}</span>`
      : (skipped ? `<span style="font-family:'Share Tech Mono',monospace;font-size:.7rem;color:var(--neon-purple)">${I18n.t('status_skipped')}</span>` : '');
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
    const lang = I18n.getLang();
    const sections = [
      {
        id: 'preset', name: 'PRESET', color: '#bf5fff',
        controls: ['PRESET NAME', 'BANK ◂ ▸', 'LOAD / SAVE', 'DISPLAY'],
        desc: lang === 'en'
          ? 'Preset management with OLED display. Browse presets with the arrow buttons. SAVE stores your edits. Hold SHIFT for secondary functions.'
          : 'Preset-hantering med OLED-display. Bläddra bland bankens ljud med pilknapparna. SAVE sparar dina ändringar. Håll inne SHIFT för extra funktioner.'
      },
      {
        id: 'osc-a', name: 'OSC A', color: '#00fff7',
        controls: ['TYPE', 'WAVE', 'TIMBRE', 'SHAPE'],
        desc: lang === 'en'
          ? 'Digital oscillator A. TYPE selects synthesis type — Virtual Analog, Wavetable, FM, Chords, Speech and more. WAVE selects the waveform/preset. TIMBRE and SHAPE sculpt the tonal character depending on the chosen synthesis type.'
          : 'Digital oscillator A. TYPE väljer syntestyp — Virtual Analog, Wavetable, FM, Chords, Speech m.fl. WAVE väljer vågform/preset. TIMBRE och SHAPE formar klangfärgen beroende på vald syntestyp.'
      },
      {
        id: 'osc-b', name: 'OSC B', color: '#00fff7',
        controls: ['TYPE', 'WAVE', 'TIMBRE', 'SHAPE', 'SEMI', 'FINE'],
        desc: lang === 'en'
          ? 'Digital oscillator B — identical architecture to A but fully independent. SEMI tunes OSC B in semitones relative to A (e.g. +7 = fifth). FINE for microtuning in cents. Mix different synthesis types for complex timbres.'
          : 'Digital oscillator B — identisk arkitektur som A men helt oberoende. SEMI stämmer om OSC B i halvtoner relativt A (t.ex. +7 = kvint). FINE för mikrostämning i cent. Blanda olika syntestyper för komplexa klanger.'
      },
      {
        id: 'mix', name: 'MIX', color: '#00fff7',
        controls: ['OSC A/B'],
        desc: lang === 'en'
          ? 'Blends the balance between OSC A and OSC B. Turn left for only A, right for only B, centre for 50/50. Simple but powerful — try detuning OSC B and blending a little for a wide, living sound.'
          : 'Mixar balansen mellan OSC A och OSC B. Vrid vänster för enbart A, höger för enbart B, mitten för 50/50-mix. Enkelt men kraftfullt — prova att detuning OSC B och mixa in lite för bred, levande klang.'
      },
      {
        id: 'filter', name: 'FILTER', color: '#ff2d78',
        controls: ['CUTOFF', 'RESONANCE', 'ENV AMT', 'LP · BP · HP'],
        desc: lang === 'en'
          ? 'Analogue Steiner-Parker filter — one of the MiniFreak\'s proudest features. CUTOFF controls which frequencies pass through. RESONANCE creates a peak at the cutoff frequency. ENV AMT determines how much Env 1 modulates the filter. Choose LP (low-pass), BP (band-pass) or HP (high-pass) with the switch.'
          : 'Analogt Steiner-Parker-filter — en av MiniFreaks stoltaste funktioner. CUTOFF styr vilka frekvenser som släpps igenom. RESONANCE skapar en topp vid cutoff-frekvensen. ENV AMT avgör hur mycket Env 1 påverkar filtret. Välj LP (lågpass), BP (bandpass) eller HP (högpass) med switchen.'
      },
      {
        id: 'env1', name: 'ENV 1', color: '#ff2d78',
        controls: ['ATTACK', 'DECAY', 'SUSTAIN', 'RELEASE'],
        desc: lang === 'en'
          ? 'Modulation envelope (ADSR). Controls filter cutoff via ENV AMT by default, but can modulate almost anything via the Mod Matrix. Fast attack + short decay = pluck filter. Long attack + high sustain = swelling pad filter.'
          : 'Modulationsenvelope (ADSR). Styr som standard filter-cutoff via ENV AMT-knappen, men kan modulera nästan vad som helst via Mod Matrix. Snabb attack + kort decay = pluck-filter. Lång attack + hög sustain = svällande pad-filter.'
      },
      {
        id: 'env2', name: 'ENV 2', color: '#ff2d78',
        controls: ['ATTACK', 'DECAY', 'SUSTAIN', 'RELEASE'],
        desc: lang === 'en'
          ? 'Amplitude envelope (VCA). This is the most important envelope — it controls how the volume changes over time. Short attack + short release = percussive sound. Long attack = fade-in. Long release = sustained trail. ADSR on ENV 2 is what you hear immediately.'
          : 'Amplitud-envelope (VCA). Det här är den viktigaste envelopen — den styr hur volymen förändras över tid. Kort attack + kort release = perkussivt ljud. Lång attack = fade-in. Lång release = efterklang. ADSR på ENV 2 är det du hör direkt.'
      },
      {
        id: 'lfo1', name: 'LFO 1', color: '#bf5fff',
        controls: ['RATE', 'WAVE', 'RISE', 'SHAPE'],
        desc: lang === 'en'
          ? 'Low Frequency Oscillator 1. RATE controls speed (0.01 Hz–100 Hz or BPM-synced). WAVE selects shape (sine, triangle, saw, square, sample&hold). RISE gives a soft fade-in of the LFO. Assign to a destination via the Mod Matrix — classic: LFO 1 → PITCH for vibrato.'
          : 'Lågfrekvensoscillator 1. RATE styr hastighet (0,01 Hz–100 Hz eller BPM-synkat). WAVE väljer form (sinus, triangel, såg, firkant, sample&hold). RISE ger mjuk fade-in av LFO. Koppla till destination via Mod Matrix — klassiskt: LFO 1 → PITCH för vibrato.'
      },
      {
        id: 'lfo2', name: 'LFO 2', color: '#bf5fff',
        controls: ['RATE', 'WAVE', 'RISE', 'SHAPE'],
        desc: lang === 'en'
          ? 'Low Frequency Oscillator 2 — identical to LFO 1. Route to a different destination for dual modulation movement. Popular example: LFO 1 → Filter cutoff (slow sweep) + LFO 2 → OSC B pitch (fast tremolo).'
          : 'Lågfrekvensoscillator 2 — identisk med LFO 1. Koppla till en annan destination för dubbel modulationsrörelse. Populärt exempel: LFO 1 → Filter cutoff (långsam svepning) + LFO 2 → OSC B pitch (snabb tremolo).'
      },
      {
        id: 'effects', name: 'EFFECTS', color: '#00fff7',
        controls: ['MOD (amount)', 'DELAY (time)', 'REVERB (size)', 'MOD TYPE', 'DELAY TYPE', 'REVERB TYPE'],
        desc: lang === 'en'
          ? 'Three parallel effects blocks. MOD: Chorus, Flanger, Phaser or Ensemble — adds width and movement. DELAY: echo with BPM-sync, Ping Pong or analogue echo character. REVERB: Hall, Room, Plate or Spring — adds spatial dimension. Each block has an amount knob + type selector.'
          : 'Tre parallella effektblock. MOD: Chorus, Flanger, Phaser eller Ensemble — ger bredd och rörelse. DELAY: ekko med BPM-sync, Ping Pong eller analog eko-karaktär. REVERB: Hall, Room, Plate eller Spring — ger rumslig dimension. Varje block har amount-reglage + typval.'
      },
      {
        id: 'arp', name: 'ARP / SEQ', color: '#bf5fff',
        controls: ['ON/OFF', 'RATE', 'GATE', 'MODE', 'OCT', 'HOLD'],
        desc: lang === 'en'
          ? 'Arpeggiator and 16-step Step Sequencer share this section. ARP: hold a chord and select a pattern (Up, Down, Up-Down, Random) and octave range. SEQ: record your own melodic loops up to 64 steps with variable gate length and per-step transposition.'
          : 'Arpeggiator och 16-stegs Step Sequencer delar samma sektion. ARP: håll ett ackord och välj mönster (Up, Down, Up-Down, Random) och oktavomfång. SEQ: spela in egna melodislingor upp till 64 steg med variabel gatelängd och transposition per steg.'
      },
      {
        id: 'macros', name: 'MACROS', color: '#ff2d78',
        controls: ['MACRO 1', 'MACRO 2', 'MACRO 3', 'MACRO 4'],
        desc: lang === 'en'
          ? '4 programmable buttons for live control. Each Macro can be linked to multiple parameters with individual intensity. Perfect for the stage: one button press can open the filter, raise the reverb and change the LFO rate simultaneously. Assign via the MATRIX button.'
          : '4 programmerbara knappar för live-kontroll. Varje Macro kan kopplas till flera parametrar med individuell intensitet. Perfekt för scen: en knapptryckning kan öppna filtret, höja reverben och ändra LFO-hastigheten samtidigt. Assignas via MATRIX-knappen.'
      },
      {
        id: 'spice', name: 'SPICE / DICE', color: '#bf5fff',
        controls: ['SPICE ●', 'DICE ◈'],
        desc: lang === 'en'
          ? 'Two unique buttons. SPICE: subtly tweaks multiple parameters to "spice up" the current preset without erasing it — great for variation. DICE: randomises a brand new sound within the selected category — ideal for inspiration and finding unexpected timbres.'
          : 'Två unika knappar. SPICE: vrider subtilt på flera parametrar för att "krydda" nuvarande preset utan att radera det — bra för variation. DICE: randomiserar ett helt nytt ljud inom vald kategori — idealiskt för inspiration och att hitta oväntade klanger.'
      },
    ];

    // ── Header ────────────────────────────────────────────────────
    const header = document.createElement('div');
    header.className = 'minifreak-header';
    header.innerHTML = `<span style="color:var(--neon-cyan)">Arturia MiniFreak</span> — ${I18n.t('mf_header')}`;
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
    detail.textContent = I18n.t('mf_click_hint');
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
    const lesson = I18n.getLessons()[lessonId];
    const completed = Progress.isCompleted(lessonId);

    if (lessonId === 16) {
      showCourseComplete();
      return;
    }

    const currentMod = I18n.getModules().find(m => m.lessonIds.includes(lessonId));
    const isLastInModule = currentMod && currentMod.lessonIds[currentMod.lessonIds.length - 1] === lessonId;

    if (isLastInModule && completed) {
      showModuleComplete(currentMod, lessonId);
    } else {
      navigateTo(lessonId + 1);
    }
  }

  function handleNextAfterQuiz(lessonId) {
    if (lessonId === 16) {
      showCourseComplete();
      return;
    }
    const currentMod = I18n.getModules().find(m => m.lessonIds.includes(lessonId));
    const isLastInModule = currentMod && currentMod.lessonIds[currentMod.lessonIds.length - 1] === lessonId;
    if (isLastInModule) {
      showModuleComplete(currentMod, lessonId);
    } else {
      navigateTo(lessonId + 1);
    }
  }

  function showModuleComplete(mod, finishedLessonId) {
    const nextMod = I18n.getModules().find(m => m.id === mod.id + 1);

    document.getElementById('module-complete-title').textContent = I18n.t('module_done_title', mod.id);
    document.getElementById('module-complete-text').textContent = nextMod
      ? I18n.t('module_done_next', mod.title, nextMod.id, nextMod.title)
      : I18n.t('module_done_last', mod.title);

    const contBtn = document.getElementById('module-continue-btn');
    const homeBtn = document.getElementById('module-home-btn');

    contBtn.textContent = I18n.t('next_module_btn');
    homeBtn.textContent = I18n.t('home_btn');
    contBtn.style.display = nextMod ? '' : 'none';
    if (nextMod) contBtn.onclick = () => navigateTo(nextMod.lessonIds[0]);
    homeBtn.onclick = () => navigateTo(null);

    showScreen('module-complete');
  }

  function showCourseComplete() {
    document.getElementById('module-complete-title').textContent = I18n.t('course_done_title');
    document.getElementById('module-complete-text').textContent = I18n.t('course_done_text');
    const contBtn = document.getElementById('module-continue-btn');
    const homeBtn = document.getElementById('module-home-btn');
    contBtn.style.display = 'none';
    homeBtn.textContent = I18n.t('home_btn');
    homeBtn.onclick = () => navigateTo(null);
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

  // ── Profile UI ────────────────────────────────────────────────

  const EMOJIS = ['🎹','🎸','🎵','🎶','🎧','🎷','🎺','🎻','🥁','🎼',
                  '🌟','⚡','🔥','🦄','🤖','🐱','🐶','🐻','🦊','🐼'];

  function updateNavProfile(profile) {
    const btn    = document.getElementById('nav-profile-btn');
    const avatar = document.getElementById('nav-profile-avatar');
    const name   = document.getElementById('nav-profile-name');
    if (!btn) return;
    if (profile) {
      avatar.textContent = profile.avatar;
      name.textContent   = profile.name.toUpperCase();
      btn.classList.remove('hidden');
    } else {
      btn.classList.add('hidden');
    }
  }

  function showProfileScreen(canCancel = false) {
    showScreen('profile');
    const container = document.getElementById('profile-screen');
    container.innerHTML = `<div class="profile-loading">${I18n.t('profile_loading')}</div>`;
    ProfileManager.list().then(profiles => renderProfileScreenContent(profiles, canCancel));
  }

  function renderProfileScreenContent(profiles, canCancel) {
    const container = document.getElementById('profile-screen');
    container.innerHTML = '';

    const inner = document.createElement('div');
    inner.className = 'profile-screen-inner';

    // Title
    const title = document.createElement('p');
    title.className = 'profile-screen-subtitle';
    title.textContent = profiles.length ? I18n.t('who_plays') : I18n.t('welcome');
    inner.appendChild(title);

    if (profiles.length === 0) {
      const hint = document.createElement('p');
      hint.className = 'profile-screen-hint';
      hint.textContent = I18n.t('first_hint');
      inner.appendChild(hint);
    }

    // Profile grid
    const grid = document.createElement('div');
    grid.className = 'profile-grid';
    grid.id = 'profile-grid';

    profiles.forEach(p => grid.appendChild(makeProfileCard(p, grid, canCancel)));

    // "New profile" card
    const newCard = document.createElement('div');
    newCard.className = 'profile-card new-profile';
    newCard.innerHTML = `<span class="profile-avatar">＋</span><span class="profile-name">${I18n.t('new_profile_card')}</span>`;
    newCard.addEventListener('click', () => {
      newCard.style.display = 'none';
      form.classList.remove('hidden');
      nameInput.focus();
    });
    grid.appendChild(newCard);
    inner.appendChild(grid);

    // New profile form
    const form = document.createElement('div');
    form.className = 'new-profile-form hidden';
    form.id = 'new-profile-form';

    form.innerHTML = `<h3>${I18n.t('new_profile_title')}</h3>`;

    const nameInput = document.createElement('input');
    nameInput.type        = 'text';
    nameInput.className   = 'new-profile-input';
    nameInput.placeholder = I18n.t('name_placeholder');
    nameInput.maxLength   = 40;
    form.appendChild(nameInput);

    // Emoji picker
    const picker = document.createElement('div');
    picker.className = 'emoji-picker';
    let selectedEmoji = EMOJIS[0];
    EMOJIS.forEach(e => {
      const btn = document.createElement('button');
      btn.className = 'emoji-btn' + (e === selectedEmoji ? ' selected' : '');
      btn.textContent = e;
      btn.addEventListener('click', () => {
        picker.querySelectorAll('.emoji-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedEmoji = e;
      });
      picker.appendChild(btn);
    });
    form.appendChild(picker);

    // Language picker
    const langPicker = document.createElement('div');
    langPicker.className = 'lang-picker';
    let selectedLang = I18n.getLang();
    [{ val: 'sv', label: '🇸🇪 Svenska' }, { val: 'en', label: '🇬🇧 English' }].forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'lang-option' + (opt.val === selectedLang ? ' selected' : '');
      btn.textContent = opt.label;
      btn.dataset.lang = opt.val;
      btn.addEventListener('click', () => {
        langPicker.querySelectorAll('.lang-option').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedLang = opt.val;
      });
      langPicker.appendChild(btn);
    });
    form.appendChild(langPicker);

    // Actions
    const actions = document.createElement('div');
    actions.className = 'new-profile-actions';

    const cancelBtn = document.createElement('button');
    cancelBtn.className   = 'btn btn-ghost';
    cancelBtn.textContent = I18n.t('cancel_btn');
    cancelBtn.addEventListener('click', () => {
      form.classList.add('hidden');
      newCard.style.display = '';
      nameInput.value = '';
    });

    const saveBtn = document.createElement('button');
    saveBtn.className   = 'btn btn-primary';
    saveBtn.textContent = I18n.t('create_btn');
    saveBtn.addEventListener('click', async () => {
      const name = nameInput.value.trim();
      if (!name) { nameInput.focus(); return; }
      saveBtn.disabled    = true;
      saveBtn.textContent = '…';
      try {
        const profile = await ProfileManager.create(name, selectedEmoji, selectedLang);
        onProfilePicked(profile);
      } catch {
        showToast(I18n.t('save_error'));
        saveBtn.disabled    = false;
        saveBtn.textContent = I18n.t('create_btn');
      }
    });

    nameInput.addEventListener('keydown', e => { if (e.key === 'Enter') saveBtn.click(); });

    actions.appendChild(cancelBtn);
    actions.appendChild(saveBtn);
    form.appendChild(actions);
    inner.appendChild(form);

    // Cancel / back button (when switching profiles mid-session)
    if (canCancel) {
      const backBtn = document.createElement('button');
      backBtn.className   = 'btn btn-ghost';
      backBtn.style.marginTop = '1.5rem';
      backBtn.textContent = I18n.t('back_btn');
      backBtn.addEventListener('click', () => navigateTo(state.currentLessonId || null));
      inner.appendChild(backBtn);
    }

    container.appendChild(inner);

    // Auto-expand form if no profiles yet
    if (profiles.length === 0) {
      newCard.style.display = 'none';
      form.classList.remove('hidden');
      nameInput.focus();
    }
  }

  function makeProfileCard(profile, grid, canCancel) {
    const card = document.createElement('div');
    card.className = 'profile-card';

    const delBtn = document.createElement('button');
    delBtn.className   = 'profile-delete-btn';
    delBtn.title       = I18n.t('delete_title');
    delBtn.textContent = '✕';
    delBtn.addEventListener('click', async e => {
      e.stopPropagation();
      if (delBtn.dataset.confirm) {
        await ProfileManager.remove(profile.id);
        if (ProfileManager.getActive()?.id === profile.id) {
          ProfileManager.deselect();
          updateNavProfile(null);
        }
        ProfileManager.list().then(ps => renderProfileScreenContent(ps, canCancel));
      } else {
        delBtn.dataset.confirm = '1';
        delBtn.textContent     = '?';
        delBtn.style.color     = 'var(--neon-pink)';
        delBtn.style.opacity   = '1';
        setTimeout(() => {
          if (delBtn.dataset.confirm) {
            delete delBtn.dataset.confirm;
            delBtn.textContent   = '✕';
            delBtn.style.color   = '';
            delBtn.style.opacity = '';
          }
        }, 3000);
      }
    });

    const avatar = document.createElement('span');
    avatar.className   = 'profile-avatar';
    avatar.textContent = profile.avatar;

    const name = document.createElement('span');
    name.className   = 'profile-name';
    name.textContent = profile.name;

    card.appendChild(delBtn);
    card.appendChild(avatar);
    card.appendChild(name);

    card.addEventListener('click', async () => {
      card.classList.add('loading');
      const full = await ProfileManager.select(profile.id);
      if (full) onProfilePicked(full);
    });

    return card;
  }

  function onProfilePicked(profile) {
    I18n.setLang(profile.lang || 'sv');
    Progress.loadFromProfile(profile);
    updateNavProfile(profile);
    startApp();
  }

  function switchToProfile(profile) {
    I18n.setLang(profile.lang || 'sv');
    Progress.loadFromProfile(profile);
    updateNavProfile(profile);
    state.currentLessonId = null;
    buildSidebar();
    updateProgressBar();
    applyUILang();
    navigateTo(null);
  }

  // ── Apply UI language strings to static DOM elements ──────────
  function applyUILang() {
    const lang = I18n.getLang();
    document.documentElement.lang = lang;
    document.title = lang === 'en'
      ? 'Synth School — Learn Synthwave with MiniFreak'
      : 'Synth School — Lär dig Synthwave med MiniFreak';

    const heroSub = document.querySelector('.hero-subtitle');
    if (heroSub) heroSub.textContent = I18n.t('hero_subtitle');

    const sidebarToggle = document.getElementById('sidebar-toggle');
    if (sidebarToggle) sidebarToggle.title = I18n.t('sidebar_title');

    const profileBtn = document.getElementById('nav-profile-btn');
    if (profileBtn) profileBtn.title = I18n.t('profile_btn_title');

    const pianoOpenBtn = document.getElementById('piano-open-btn');
    if (pianoOpenBtn) pianoOpenBtn.title = I18n.t('piano_btn_title');

    const pianoTitle = document.querySelector('#piano-overlay-header span');
    if (pianoTitle) pianoTitle.textContent = I18n.t('piano_title');

    // Piano overlay controls (Wave / Octave / Volume labels)
    const pianoLabels = document.querySelectorAll('#piano-overlay-controls label');
    const labelKeys = ['wave_label', 'octave_label', 'volume_label'];
    pianoLabels.forEach((lbl, i) => {
      if (labelKeys[i]) lbl.firstChild.textContent = I18n.t(labelKeys[i]) + ' ';
    });

    const langBtn = document.getElementById('nav-lang-btn');
    if (langBtn) langBtn.textContent = lang === 'en' ? '🇸🇪' : '🇬🇧';

    updateProgressBar();
  }

  // ── Toggle language (called from nav lang button) ─────────────
  function toggleLang() {
    const newLang = I18n.getLang() === 'sv' ? 'en' : 'sv';
    I18n.setLang(newLang);

    // Persist lang
    if (ProfileManager.isAvailable()) {
      const active = ProfileManager.getActive();
      if (active) ProfileManager.update(active.id, { lang: newLang });
    }
    try { localStorage.setItem('synthSchoolLang', newLang); } catch {}

    // Re-render
    applyUILang();
    buildSidebar();
    if (state.currentScreen === 'lesson' && state.currentLessonId) {
      renderLesson(state.currentLessonId);
    } else {
      startApp();
    }
  }

  // ── startApp — runs after profile is resolved ─────────────────
  function startApp() {
    applyUILang();
    buildSidebar();
    updateProgressBar();
    animateHeroWaveform();

    // Start button
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
      startBtn.textContent = I18n.t('start_btn');
      startBtn.onclick = () => navigateTo(1);
    }

    // Continue button
    const lastVisited = Progress.load().lastVisited;
    const contBtn = document.getElementById('continue-btn');
    if (contBtn) {
      if (lastVisited) {
        const les = I18n.getLessons()[lastVisited];
        contBtn.style.display = '';
        contBtn.textContent   = `${I18n.t('continue_prefix')} L${lastVisited}: ${les?.title?.toUpperCase() || ''}`;
        contBtn.onclick = () => navigateTo(lastVisited);
      } else {
        contBtn.style.display = 'none';
      }
    }

    // Module overview cards (rebuild each time in case of profile switch)
    const grid = document.getElementById('module-overview-grid');
    if (grid) {
      grid.innerHTML = '';
      I18n.getModules().forEach(mod => {
        const completed = mod.lessonIds.filter(id => Progress.isCompleted(id)).length;
        const card = document.createElement('div');
        card.className = `module-card module-${mod.id}`;
        card.style.setProperty('--accent', mod.color);
        card.innerHTML = `
          <div class="module-card-num">${I18n.t('module_label')} ${mod.id}</div>
          <div class="module-card-title">${mod.title}</div>
          <div class="module-card-subtitle">${mod.subtitle}</div>
          <div class="module-card-lessons">${I18n.t('lessons_done', completed, mod.lessonIds.length)}</div>
        `;
        card.addEventListener('click', () => {
          const firstLesson = mod.lessonIds.find(id => Progress.isAccessible(id)) || mod.lessonIds[0];
          navigateTo(firstLesson);
        });
        grid.appendChild(card);
      });
    }

    showScreen('home');

    // Deep link via URL hash (only on first load)
    const hash = window.location.hash;
    const match = hash.match(/^#lesson-(\d+)$/);
    if (match) {
      const lessonId = parseInt(match[1]);
      if (I18n.getLessons()[lessonId]) navigateTo(lessonId);
    }
  }

  // ── Init — detects API, resolves profile, then calls startApp ─
  async function init() {
    // One-time setup (not profile-dependent)
    const backdrop = document.createElement('div');
    backdrop.id = 'sidebar-backdrop';
    document.getElementById('layout')?.appendChild(backdrop);
    backdrop.addEventListener('click', closeMobileSidebar);

    document.getElementById('sidebar-toggle')?.addEventListener('click', () => {
      const layout = document.getElementById('layout');
      if (window.innerWidth <= 768) {
        layout.classList.toggle('sidebar-open');
      } else {
        layout.classList.toggle('sidebar-collapsed');
      }
    });

    document.getElementById('nav-profile-btn')?.addEventListener('click', () => {
      showProfileScreen(true);
    });

    Piano.init();

    // Wire up lang toggle button
    document.getElementById('nav-lang-btn')?.addEventListener('click', toggleLang);

    // Load persisted lang for localStorage fallback
    try {
      const storedLang = localStorage.getItem('synthSchoolLang');
      if (storedLang) I18n.setLang(storedLang);
    } catch {}

    // Show home screen immediately using localStorage data (no blank screen)
    startApp();

    // Then try to resolve a profile in the background
    const apiAvailable = await ProfileManager.detectAPI();
    if (!apiAvailable) return; // already running with localStorage

    const storedId = ProfileManager.getStoredId();
    if (storedId) {
      const profile = await ProfileManager.select(storedId);
      if (profile) {
        I18n.setLang(profile.lang || 'sv');
        Progress.loadFromProfile(profile);
        updateNavProfile(profile);
        // Refresh home screen UI with profile data if still on home
        if (state.currentScreen === 'home') startApp();
        return;
      }
    }

    // No profile stored or profile no longer exists — show picker
    showProfileScreen(false);
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
