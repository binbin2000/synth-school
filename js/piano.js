/* ============================================================
   piano.js — Virtual Piano with Web Audio API
   ============================================================ */

const Piano = (() => {
  let audioCtx = null;
  let masterGainNode = null;
  let analyserNode = null;
  let compressorNode = null;
  const activeNotes = new Map(); // noteStr -> { osc, noteGain }

  // ── Frequency table ───────────────────────────────────────────
  const BASE_FREQS = {
    C: 16.352, 'C#': 17.324, Db: 17.324,
    D: 18.354, 'D#': 19.445, Eb: 19.445,
    E: 20.602,
    F: 21.827, 'F#': 23.125, Gb: 23.125,
    G: 24.500, 'G#': 25.957, Ab: 25.957,
    A: 27.500, 'A#': 29.135, Bb: 29.135,
    B: 30.868
  };

  function noteFrequency(note, octave) {
    return BASE_FREQS[note] * Math.pow(2, octave);
  }

  // ── Audio context (lazy init) ─────────────────────────────────
  function ensureAudioContext() {
    if (audioCtx) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    compressorNode = audioCtx.createDynamicsCompressor();
    compressorNode.threshold.value = -24;
    compressorNode.knee.value = 30;
    compressorNode.ratio.value = 12;
    compressorNode.attack.value = 0.003;
    compressorNode.release.value = 0.25;

    analyserNode = audioCtx.createAnalyser();
    analyserNode.fftSize = 2048;

    masterGainNode = audioCtx.createGain();
    masterGainNode.gain.value = 0.7;

    masterGainNode.connect(analyserNode);
    analyserNode.connect(compressorNode);
    compressorNode.connect(audioCtx.destination);
  }

  // ── Play / Stop note ─────────────────────────────────────────
  function playNote(noteStr, frequency, waveType = 'sawtooth') {
    if (!audioCtx) return;
    if (activeNotes.has(noteStr)) return; // already playing

    const osc = audioCtx.createOscillator();
    const noteGain = audioCtx.createGain();

    osc.type = waveType;
    osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    noteGain.gain.setValueAtTime(0, audioCtx.currentTime);
    noteGain.gain.linearRampToValueAtTime(0.8, audioCtx.currentTime + 0.005);

    osc.connect(noteGain);
    noteGain.connect(masterGainNode);
    osc.start();

    activeNotes.set(noteStr, { osc, noteGain });
  }

  function stopNote(noteStr) {
    const entry = activeNotes.get(noteStr);
    if (!entry) return;
    const { osc, noteGain } = entry;
    noteGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.05);
    try { osc.stop(audioCtx.currentTime + 0.3); } catch (e) { /* ignore */ }
    activeNotes.delete(noteStr);
  }

  function stopAllNotes() {
    for (const key of activeNotes.keys()) stopNote(key);
  }

  // ── Keyboard builder ─────────────────────────────────────────
  // White keys in order
  const WHITE_NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  // Black key positions (relative to white key index, 0-based)
  // C#=after C(0), D#=after D(1), F#=after F(3), G#=after G(4), A#=after A(5)
  const BLACK_AFTER = [0, 1, 3, 4, 5]; // white key indices
  const BLACK_NAMES = ['C#', 'D#', 'F#', 'G#', 'A#'];

  function buildKeyboard(container, config) {
    const {
      octaves = 2,
      startOctave = 4,
      defaultWave = 'sawtooth',
      highlightKeys = [],
      showWaveSelector = false,
    } = config;

    container.innerHTML = '';
    container.style.position = 'relative';

    const totalWhite = octaves * 7;
    const whiteW = 100 / totalWhite; // percent

    // Build white keys first
    for (let oct = startOctave; oct < startOctave + octaves; oct++) {
      for (let i = 0; i < 7; i++) {
        const noteName = WHITE_NOTES[i];
        const noteStr = `${noteName}${oct}`;
        const freq = noteFrequency(noteName, oct);
        const idx = (oct - startOctave) * 7 + i;

        const key = document.createElement('div');
        key.className = 'piano-key-white';
        key.dataset.note = noteStr;
        key.dataset.freq = freq;
        key.style.left = `${idx * whiteW}%`;
        key.style.width = `${whiteW}%`;

        if (highlightKeys.includes(noteStr)) key.classList.add('highlighted');

        const label = document.createElement('span');
        label.className = 'piano-key-label';
        label.textContent = noteStr;
        key.appendChild(label);

        container.appendChild(key);
      }
    }

    // Build black keys
    for (let oct = startOctave; oct < startOctave + octaves; oct++) {
      const octOffset = (oct - startOctave) * 7;
      for (let j = 0; j < BLACK_AFTER.length; j++) {
        const whiteIdx = octOffset + BLACK_AFTER[j];
        const noteName = BLACK_NAMES[j];
        const noteStr = `${noteName}${oct}`;
        const freq = noteFrequency(noteName, oct);

        const key = document.createElement('div');
        key.className = 'piano-key-black';
        key.dataset.note = noteStr;
        key.dataset.freq = freq;

        // Position: center between white key [whiteIdx] and [whiteIdx+1]
        const leftPct = (whiteIdx + 0.65) * whiteW;
        const widthPct = whiteW * 0.65;
        key.style.left = `${leftPct}%`;
        key.style.width = `${widthPct}%`;

        if (highlightKeys.includes(noteStr)) key.classList.add('highlighted');
        container.appendChild(key);
      }
    }

    // Attach pointer events
    attachPointerEvents(container, defaultWave, showWaveSelector);
    return container;
  }

  function attachPointerEvents(container, defaultWave, showWaveSelector) {
    let currentWave = defaultWave;
    if (showWaveSelector) {
      const sel = container.closest('.block-piano-widget')?.querySelector('.piano-wave-select');
      if (sel) {
        sel.value = defaultWave;
        sel.addEventListener('change', () => { currentWave = sel.value; });
      }
    }

    function getWave() {
      const sel = container.closest('.block-piano-widget')?.querySelector('.piano-wave-select');
      return sel ? sel.value : currentWave;
    }

    function startKey(el) {
      if (!el || !el.dataset.note) return;
      ensureAudioContext();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const noteStr = el.dataset.note;
      const freq = parseFloat(el.dataset.freq);
      playNote(noteStr, freq, getWave());
      el.classList.add('active');
    }

    function endKey(el) {
      if (!el || !el.dataset.note) return;
      stopNote(el.dataset.note);
      el.classList.remove('active');
    }

    const pointerMap = new Map(); // pointerId -> noteStr

    container.addEventListener('pointerdown', e => {
      e.preventDefault();
      const el = e.target.closest('[data-note]');
      if (!el) return;
      container.setPointerCapture(e.pointerId);
      pointerMap.set(e.pointerId, el.dataset.note);
      startKey(el);
    });

    container.addEventListener('pointermove', e => {
      if (!pointerMap.has(e.pointerId)) return;
      const el = document.elementFromPoint(e.clientX, e.clientY)?.closest('[data-note]');
      const prevNote = pointerMap.get(e.pointerId);
      if (el && el.dataset.note !== prevNote) {
        // End previous, start new (glissando)
        const prevEl = container.querySelector(`[data-note="${prevNote}"]`);
        endKey(prevEl);
        pointerMap.set(e.pointerId, el.dataset.note);
        startKey(el);
      }
    });

    container.addEventListener('pointerup', e => {
      const noteStr = pointerMap.get(e.pointerId);
      if (noteStr) {
        const el = container.querySelector(`[data-note="${noteStr}"]`);
        endKey(el);
        pointerMap.delete(e.pointerId);
      }
    });

    container.addEventListener('pointercancel', e => {
      const noteStr = pointerMap.get(e.pointerId);
      if (noteStr) {
        const el = container.querySelector(`[data-note="${noteStr}"]`);
        endKey(el);
        pointerMap.delete(e.pointerId);
      }
    });
  }

  // ── Computer keyboard mapping ─────────────────────────────────
  const KEY_MAP = {
    'z': ['C', 4], 's': ['C#', 4], 'x': ['D', 4], 'd': ['D#', 4],
    'c': ['E', 4], 'v': ['F', 4], 'g': ['F#', 4], 'b': ['G', 4],
    'h': ['G#', 4], 'n': ['A', 4], 'j': ['A#', 4], 'm': ['B', 4],
    'q': ['C', 5], '2': ['C#', 5], 'w': ['D', 5], '3': ['D#', 5],
    'e': ['E', 5], 'r': ['F', 5], '5': ['F#', 5], 't': ['G', 5],
    '6': ['G#', 5], 'y': ['A', 5], '7': ['A#', 5], 'u': ['B', 5],
  };

  let keyboardWave = 'sawtooth';
  const pressedKeys = new Set();

  function initKeyboardListeners() {
    document.addEventListener('keydown', e => {
      if (e.repeat) return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') return;
      const mapping = KEY_MAP[e.key.toLowerCase()];
      if (!mapping) return;
      const [note, octave] = mapping;
      const noteStr = `${note}${octave}`;
      const freq = noteFrequency(note, octave);
      ensureAudioContext();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      playNote(noteStr, freq, keyboardWave);
      pressedKeys.add(noteStr);

      // Light up floating piano key
      const overlayKey = document.querySelector(`#piano-overlay-keyboard [data-note="${noteStr}"]`);
      if (overlayKey) overlayKey.classList.add('active');
    });

    document.addEventListener('keyup', e => {
      const mapping = KEY_MAP[e.key.toLowerCase()];
      if (!mapping) return;
      const [note, octave] = mapping;
      const noteStr = `${note}${octave}`;
      stopNote(noteStr);
      pressedKeys.delete(noteStr);

      const overlayKey = document.querySelector(`#piano-overlay-keyboard [data-note="${noteStr}"]`);
      if (overlayKey) overlayKey.classList.remove('active');
    });
  }

  // ── Waveform visualizer (floating piano) ─────────────────────
  let animFrameId = null;

  function startWaveformAnimation(canvas) {
    if (!analyserNode || !canvas) return;
    const ctx = canvas.getContext('2d');
    const bufLen = analyserNode.frequencyBinCount;
    const dataArr = new Float32Array(bufLen);

    function draw() {
      analyserNode.getFloatTimeDomainData(dataArr);

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      ctx.strokeStyle = '#00fff7';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = '#00fff7';
      ctx.shadowBlur = 6;
      ctx.beginPath();

      const sliceWidth = w / bufLen;
      let x = 0;
      for (let i = 0; i < bufLen; i++) {
        const v = dataArr[i];
        const y = (1 - v) * (h / 2);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        x += sliceWidth;
      }
      ctx.stroke();
      animFrameId = requestAnimationFrame(draw);
    }

    if (animFrameId) cancelAnimationFrame(animFrameId);
    draw();
  }

  function stopWaveformAnimation() {
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
  }

  // ── Floating piano overlay ────────────────────────────────────
  function initOverlay() {
    const overlay = document.getElementById('piano-overlay');
    const openBtn = document.getElementById('piano-open-btn');
    const closeBtn = document.getElementById('piano-overlay-close');
    const keyboardContainer = document.getElementById('piano-overlay-keyboard');
    const waveCanvas = document.getElementById('piano-waveform-display');
    const waveSelect = document.getElementById('piano-wave-select');
    const octaveSlider = document.getElementById('piano-octave');
    const volumeSlider = document.getElementById('piano-volume');

    if (!overlay || !openBtn) return;

    // Resize canvas to actual pixel dimensions
    function resizeCanvas() {
      if (waveCanvas) {
        waveCanvas.width = waveCanvas.offsetWidth;
        waveCanvas.height = waveCanvas.offsetHeight;
      }
    }

    openBtn.addEventListener('click', () => {
      overlay.classList.toggle('hidden');
      if (!overlay.classList.contains('hidden')) {
        ensureAudioContext();
        resizeCanvas();
        buildOverlayKeyboard(parseInt(octaveSlider?.value || 4));
        startWaveformAnimation(waveCanvas);
      } else {
        stopAllNotes();
      }
    });

    closeBtn?.addEventListener('click', () => {
      overlay.classList.add('hidden');
      stopAllNotes();
    });

    waveSelect?.addEventListener('change', () => {
      keyboardWave = waveSelect.value;
    });

    octaveSlider?.addEventListener('input', () => {
      stopAllNotes();
      buildOverlayKeyboard(parseInt(octaveSlider.value));
    });

    volumeSlider?.addEventListener('input', () => {
      if (masterGainNode) masterGainNode.gain.value = parseFloat(volumeSlider.value);
    });

    function buildOverlayKeyboard(startOct) {
      if (!keyboardContainer) return;
      keyboardContainer.style.position = 'relative';
      keyboardContainer.style.height = '90px';
      keyboardContainer.style.touchAction = 'none';
      buildKeyboard(keyboardContainer, {
        octaves: 2,
        startOctave: startOct,
        defaultWave: waveSelect?.value || 'sawtooth',
        showWaveSelector: false,
      });
    }
  }

  // ── Create embedded piano widget ──────────────────────────────
  function createWidget(config) {
    const wrap = document.createElement('div');
    wrap.className = 'block-piano-widget';

    const header = document.createElement('div');
    header.className = 'piano-widget-header';

    const title = document.createElement('span');
    title.className = 'piano-widget-title';
    title.textContent = config.caption || 'Virtuellt Tangentbord';
    header.appendChild(title);

    if (config.showWaveSelector !== false) {
      const controls = document.createElement('div');
      controls.className = 'piano-widget-controls';
      const sel = document.createElement('select');
      sel.className = 'piano-wave-select';
      ['sawtooth', 'square', 'sine', 'triangle'].forEach(w => {
        const opt = document.createElement('option');
        opt.value = w;
        opt.textContent = { sawtooth: 'SAW', square: 'SQR', sine: 'SINE', triangle: 'TRI' }[w];
        sel.appendChild(opt);
      });
      sel.value = config.defaultWave || 'sawtooth';
      controls.appendChild(sel);
      header.appendChild(controls);
    }
    wrap.appendChild(header);

    const kbContainer = document.createElement('div');
    kbContainer.className = 'piano-keyboard-container';
    kbContainer.style.touchAction = 'none';
    wrap.appendChild(kbContainer);

    buildKeyboard(kbContainer, config);

    const hint = document.createElement('p');
    hint.style.cssText = 'font-family:"Share Tech Mono",monospace;font-size:.62rem;color:var(--text-muted);text-align:center;padding:.2rem .5rem .5rem;';
    hint.textContent = 'Klicka/tryck på tangenterna — eller använd datorns tangentbord (Z–M, Q–U)';
    wrap.appendChild(hint);

    return wrap;
  }

  // ── Public API ────────────────────────────────────────────────
  return {
    init() {
      initKeyboardListeners();
      initOverlay();
    },
    createWidget,
    buildKeyboard,
    playNote(noteStr, freq, wave) {
      ensureAudioContext();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      playNote(noteStr, freq, wave);
    },
    stopNote,
    stopAllNotes,
    setWave(w) { keyboardWave = w; },
    getAudioContext() { return audioCtx; },
    ensureAudioContext,
    noteFrequency,
  };
})();
