/* ============================================================
   adsr-vis.js — ADSR Envelope Visualizer (Canvas 2D)
   ============================================================ */

const ADSRVisualizer = (() => {
  const PADDING = 24;
  const SUSTAIN_DISPLAY = 0.35; // fixed seconds to show sustain phase visually

  function totalTime(adsr) {
    return adsr.attack + adsr.decay + SUSTAIN_DISPLAY + adsr.release;
  }

  function calcPoints(adsr, w, h) {
    const draw_w = w - PADDING * 2;
    const draw_h = h - PADDING * 2;
    const total = totalTime(adsr);

    const toX = t => PADDING + (t / total) * draw_w;
    const toY = amp => PADDING + (1 - amp) * draw_h;

    return {
      start:        { x: toX(0), y: toY(0) },
      attackPeak:   { x: toX(adsr.attack), y: toY(1.0) },
      sustainStart: { x: toX(adsr.attack + adsr.decay), y: toY(adsr.sustainLevel) },
      sustainEnd:   { x: toX(adsr.attack + adsr.decay + SUSTAIN_DISPLAY), y: toY(adsr.sustainLevel) },
      releaseEnd:   { x: toX(total), y: toY(0) },
    };
  }

  function draw(canvas, adsr, scanProgress = null, draggingHandle = null) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const pts = calcPoints(adsr, w, h);
    const draw_w = w - PADDING * 2;
    const draw_h = h - PADDING * 2;

    // Grid lines
    ctx.strokeStyle = 'rgba(42,42,80,.6)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 5]);
    for (let a of [0.25, 0.5, 0.75]) {
      const y = PADDING + (1 - a) * draw_h;
      ctx.beginPath(); ctx.moveTo(PADDING, y); ctx.lineTo(w - PADDING, y);
      ctx.stroke();
    }
    // Vertical grid at segment boundaries
    for (const pt of [pts.attackPeak, pts.sustainStart, pts.sustainEnd]) {
      ctx.beginPath(); ctx.moveTo(pt.x, PADDING); ctx.lineTo(pt.x, h - PADDING);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Gradient
    const grad = ctx.createLinearGradient(PADDING, 0, w - PADDING, 0);
    grad.addColorStop(0, '#00fff7');
    grad.addColorStop(1, '#bf5fff');

    // Fill under curve
    ctx.beginPath();
    ctx.moveTo(pts.start.x, pts.start.y);
    ctx.lineTo(pts.attackPeak.x, pts.attackPeak.y);
    ctx.lineTo(pts.sustainStart.x, pts.sustainStart.y);
    ctx.lineTo(pts.sustainEnd.x, pts.sustainEnd.y);
    ctx.lineTo(pts.releaseEnd.x, pts.releaseEnd.y);
    ctx.lineTo(pts.releaseEnd.x, h - PADDING);
    ctx.lineTo(pts.start.x, h - PADDING);
    ctx.closePath();
    const fillGrad = ctx.createLinearGradient(PADDING, 0, w - PADDING, 0);
    fillGrad.addColorStop(0, 'rgba(0,255,247,.12)');
    fillGrad.addColorStop(1, 'rgba(191,95,255,.12)');
    ctx.fillStyle = fillGrad;
    ctx.fill();

    // Glow stroke
    ctx.beginPath();
    ctx.moveTo(pts.start.x, pts.start.y);
    ctx.lineTo(pts.attackPeak.x, pts.attackPeak.y);
    ctx.lineTo(pts.sustainStart.x, pts.sustainStart.y);
    ctx.lineTo(pts.sustainEnd.x, pts.sustainEnd.y);
    ctx.lineTo(pts.releaseEnd.x, pts.releaseEnd.y);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 7;
    ctx.globalAlpha = 0.22;
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Main stroke
    ctx.beginPath();
    ctx.moveTo(pts.start.x, pts.start.y);
    ctx.lineTo(pts.attackPeak.x, pts.attackPeak.y);
    ctx.lineTo(pts.sustainStart.x, pts.sustainStart.y);
    ctx.lineTo(pts.sustainEnd.x, pts.sustainEnd.y);
    ctx.lineTo(pts.releaseEnd.x, pts.releaseEnd.y);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Handles
    const handles = [pts.attackPeak, pts.sustainStart, pts.sustainEnd, pts.releaseEnd];
    handles.forEach((pt, i) => {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 7, 0, Math.PI * 2);
      ctx.fillStyle = i === draggingHandle ? '#ffffff' : (i % 2 === 0 ? '#00fff7' : '#bf5fff');
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,.5)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // Scan line
    if (scanProgress !== null) {
      const total = totalTime(adsr);
      const x = PADDING + scanProgress * (w - PADDING * 2);
      ctx.strokeStyle = 'rgba(255,255,255,.7)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(x, PADDING);
      ctx.lineTo(x, h - PADDING);
      ctx.stroke();
    }
  }

  // ── Segment label widths for the DOM label row ────────────────
  function updateSegmentLabels(labelsEl, adsr, canvasWidth) {
    if (!labelsEl) return;
    const total = totalTime(adsr);
    const pcts = [
      adsr.attack / total * 100,
      adsr.decay / total * 100,
      SUSTAIN_DISPLAY / total * 100,
      adsr.release / total * 100,
    ];
    const labels = labelsEl.querySelectorAll('.adsr-segment-label');
    pcts.forEach((p, i) => {
      if (labels[i]) labels[i].style.flex = String(p);
    });
  }

  // ── Init a full interactive ADSR widget ───────────────────────
  function init(container, config) {
    const adsr = {
      attack:       config.attack       ?? 0.05,
      decay:        config.decay        ?? 0.3,
      sustainLevel: config.sustainLevel ?? 0.6,
      release:      config.release      ?? 0.5,
    };
    const waveType = config.waveType || 'sawtooth';
    const interactive = config.interactive !== false;

    // Canvas
    const canvasWrap = container.querySelector('.adsr-canvas-wrap');
    const canvas = container.querySelector('.adsr-canvas');
    if (!canvas) return;

    function resizeCanvas() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight || 150;
      draw(canvas, adsr);
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Segment labels
    const labelsEl = container.querySelector('.adsr-labels');
    function refreshLabels() { updateSegmentLabels(labelsEl, adsr, canvas.width); }
    refreshLabels();

    // Sliders
    const sliders = {
      attack:       container.querySelector('[data-adsr="attack"]'),
      decay:        container.querySelector('[data-adsr="decay"]'),
      sustainLevel: container.querySelector('[data-adsr="sustain"]'),
      release:      container.querySelector('[data-adsr="release"]'),
    };
    const valDisplays = {
      attack:       container.querySelector('[data-adsr-val="attack"]'),
      decay:        container.querySelector('[data-adsr-val="decay"]'),
      sustainLevel: container.querySelector('[data-adsr-val="sustain"]'),
      release:      container.querySelector('[data-adsr-val="release"]'),
    };

    function fmtTime(v) { return v < 1 ? `${Math.round(v*1000)}ms` : `${v.toFixed(1)}s`; }
    function fmtLevel(v) { return `${Math.round(v * 100)}%`; }

    function syncSlidersToAdsr() {
      if (sliders.attack)       { sliders.attack.value = adsr.attack; }
      if (sliders.decay)        { sliders.decay.value = adsr.decay; }
      if (sliders.sustainLevel) { sliders.sustainLevel.value = adsr.sustainLevel; }
      if (sliders.release)      { sliders.release.value = adsr.release; }
      if (valDisplays.attack)       valDisplays.attack.textContent = fmtTime(adsr.attack);
      if (valDisplays.decay)        valDisplays.decay.textContent = fmtTime(adsr.decay);
      if (valDisplays.sustainLevel) valDisplays.sustainLevel.textContent = fmtLevel(adsr.sustainLevel);
      if (valDisplays.release)      valDisplays.release.textContent = fmtTime(adsr.release);
    }
    syncSlidersToAdsr();

    function onSliderChange() {
      if (sliders.attack)       adsr.attack       = parseFloat(sliders.attack.value);
      if (sliders.decay)        adsr.decay        = parseFloat(sliders.decay.value);
      if (sliders.sustainLevel) adsr.sustainLevel = parseFloat(sliders.sustainLevel.value);
      if (sliders.release)      adsr.release      = parseFloat(sliders.release.value);
      draw(canvas, adsr);
      refreshLabels();
      syncSlidersToAdsr();
    }

    for (const sl of Object.values(sliders)) {
      sl?.addEventListener('input', onSliderChange);
    }

    // Presets
    if (config.presets) {
      const presetBtns = container.querySelectorAll('.adsr-preset-btn');
      presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const name = btn.dataset.preset;
          const preset = config.presets.find(p => p.name === name);
          if (!preset) return;
          Object.assign(adsr, preset);
          syncSlidersToAdsr();
          draw(canvas, adsr);
          refreshLabels();
        });
      });
    }

    // Play button
    const playBtn = container.querySelector('.adsr-play-btn');
    playBtn?.addEventListener('click', () => {
      Piano.ensureAudioContext();
      const ac = Piano.getAudioContext();
      if (!ac) return;
      SynthDemo.playWithADSR(261.63, { ...adsr }, waveType);
      animateScan(canvas, adsr);
    });

    // Canvas drag interaction
    if (interactive) {
      let dragging = null; // null | 0..3

      canvas.addEventListener('mousedown', e => {
        const rect = canvas.getBoundingClientRect();
        const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
        const my = (e.clientY - rect.top) * (canvas.height / rect.height);
        const pts = calcPoints(adsr, canvas.width, canvas.height);
        const handles = [pts.attackPeak, pts.sustainStart, pts.sustainEnd, pts.releaseEnd];
        handles.forEach((pt, i) => {
          if (Math.hypot(mx - pt.x, my - pt.y) < 14) dragging = i;
        });
      });

      window.addEventListener('mousemove', e => {
        if (dragging === null) return;
        const rect = canvas.getBoundingClientRect();
        const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
        const my = (e.clientY - rect.top) * (canvas.height / rect.height);
        const draw_w = canvas.width - PADDING * 2;
        const draw_h = canvas.height - PADDING * 2;
        const total = totalTime(adsr);
        const t = Math.max(0, ((mx - PADDING) / draw_w)) * total;
        const amp = Math.max(0, Math.min(1, 1 - (my - PADDING) / draw_h));

        if (dragging === 0) {
          adsr.attack = Math.max(0.001, Math.min(2, t));
        } else if (dragging === 1) {
          adsr.decay = Math.max(0.001, Math.min(2, t - adsr.attack));
        } else if (dragging === 2) {
          adsr.sustainLevel = amp;
        } else if (dragging === 3) {
          const beforeRelease = adsr.attack + adsr.decay + SUSTAIN_DISPLAY;
          adsr.release = Math.max(0.01, Math.min(3, t - beforeRelease));
        }

        draw(canvas, adsr, null, dragging);
        syncSlidersToAdsr();
        refreshLabels();
      });

      window.addEventListener('mouseup', () => { dragging = null; draw(canvas, adsr); });
    }
  }

  // ── Playback scan animation ───────────────────────────────────
  function animateScan(canvas, adsr) {
    const duration = totalTime(adsr) * 1000;
    const start = performance.now();

    function frame(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      draw(canvas, adsr, progress);
      if (progress < 1) requestAnimationFrame(frame);
      else draw(canvas, adsr);
    }
    requestAnimationFrame(frame);
  }

  // ── Create a complete ADSR block element ──────────────────────
  function createBlock(config) {
    const block = document.createElement('div');
    block.className = 'block-adsr';

    const header = document.createElement('div');
    header.className = 'adsr-header';
    header.innerHTML = `<span>ENVELOPE (ADSR)</span>`;
    if (config.playable !== false) {
      const playBtn = document.createElement('button');
      playBtn.className = 'adsr-play-btn';
      playBtn.textContent = '▶ SPELA NOT';
      header.appendChild(playBtn);
    }
    block.appendChild(header);

    const canvasWrap = document.createElement('div');
    canvasWrap.className = 'adsr-canvas-wrap';
    const canvas = document.createElement('canvas');
    canvas.className = 'adsr-canvas';
    canvasWrap.appendChild(canvas);
    block.appendChild(canvasWrap);

    const labelsEl = document.createElement('div');
    labelsEl.className = 'adsr-labels';
    ['A', 'D', 'S', 'R'].forEach(l => {
      const span = document.createElement('span');
      span.className = 'adsr-segment-label';
      span.style.flex = '1';
      span.textContent = l;
      labelsEl.appendChild(span);
    });
    block.appendChild(labelsEl);

    if (config.presets?.length) {
      const presetsEl = document.createElement('div');
      presetsEl.className = 'adsr-presets';
      config.presets.forEach(p => {
        const btn = document.createElement('button');
        btn.className = 'adsr-preset-btn';
        btn.textContent = p.name;
        btn.dataset.preset = p.name;
        presetsEl.appendChild(btn);
      });
      block.appendChild(presetsEl);
    }

    // Sliders
    const ctrlDiv = document.createElement('div');
    ctrlDiv.className = 'adsr-controls';
    const params = [
      { key: 'attack', label: 'ATTACK', attr: 'attack', min: 0.001, max: 2, step: 0.001 },
      { key: 'decay',  label: 'DECAY',  attr: 'decay',  min: 0.001, max: 2, step: 0.001 },
      { key: 'sustain', label: 'SUSTAIN', attr: 'sustain', min: 0, max: 1, step: 0.01 },
      { key: 'release', label: 'RELEASE', attr: 'release', min: 0.01, max: 3, step: 0.01 },
    ];
    params.forEach(p => {
      const group = document.createElement('div');
      group.className = 'adsr-slider-group';
      group.innerHTML = `
        <div class="adsr-slider-label">${p.label}</div>
        <input type="range" min="${p.min}" max="${p.max}" step="${p.step}" data-adsr="${p.attr}">
        <div class="adsr-slider-val" data-adsr-val="${p.attr}">—</div>
      `;
      ctrlDiv.appendChild(group);
    });
    block.appendChild(ctrlDiv);

    // Init after append (needs layout for canvas sizing)
    requestAnimationFrame(() => init(block, config));
    return block;
  }

  // ── Waveform selector block ───────────────────────────────────
  function createWaveformBlock(config) {
    const block = document.createElement('div');
    block.className = 'block-waveform';

    if (config.caption) {
      const cap = document.createElement('div');
      cap.className = 'waveform-caption';
      cap.textContent = config.caption;
      block.appendChild(cap);
    }

    const panels = document.createElement('div');
    panels.className = 'waveform-panels';

    const WAVES = config.waveforms || ['sine', 'square', 'sawtooth', 'triangle'];
    const LABELS = { sine: 'SINE', square: 'SQR', sawtooth: 'SAW', triangle: 'TRI' };

    let selectedWave = WAVES[0];

    WAVES.forEach(wave => {
      const panel = document.createElement('div');
      panel.className = 'waveform-panel' + (wave === selectedWave ? ' selected' : '');
      panel.dataset.wave = wave;

      const cv = document.createElement('canvas');
      cv.className = 'waveform-canvas';
      panel.appendChild(cv);

      const lbl = document.createElement('div');
      lbl.className = 'waveform-label';
      lbl.textContent = LABELS[wave] || wave.toUpperCase();
      panel.appendChild(lbl);

      panel.addEventListener('click', () => {
        panels.querySelectorAll('.waveform-panel').forEach(p => p.classList.remove('selected'));
        panel.classList.add('selected');
        selectedWave = wave;
        if (config.playable) {
          Piano.ensureAudioContext();
          SynthDemo.playTone(261.63, wave, 0.4);
        }
        drawWaveShape(cv, wave, true);
        // Redraw others dim
        WAVES.forEach(w => {
          if (w !== wave) {
            const otherPanels = panels.querySelectorAll(`[data-wave="${w}"] .waveform-canvas`);
            otherPanels.forEach(c => drawWaveShape(c, w, false));
          }
        });
      });

      requestAnimationFrame(() => {
        cv.width = cv.offsetWidth;
        cv.height = cv.offsetHeight || 50;
        drawWaveShape(cv, wave, wave === selectedWave);
      });

      panels.appendChild(panel);
    });

    block.appendChild(panels);
    return block;
  }

  function drawWaveShape(canvas, wave, active) {
    if (!canvas.width) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const midY = h / 2;
    const amp = h * 0.38;
    const periods = 2;

    ctx.clearRect(0, 0, w, h);

    ctx.strokeStyle = active ? '#00fff7' : '#2a2a50';
    ctx.lineWidth = active ? 2 : 1.5;
    if (active) {
      ctx.shadowColor = '#00fff7';
      ctx.shadowBlur = 5;
    } else {
      ctx.shadowBlur = 0;
    }

    ctx.beginPath();
    for (let px = 0; px < w; px++) {
      const t = (px / w) * periods; // 0..periods cycles
      let v = 0;
      const phase = t % 1;
      switch (wave) {
        case 'sine':     v = Math.sin(t * Math.PI * 2); break;
        case 'square':   v = phase < 0.5 ? 1 : -1; break;
        case 'sawtooth': v = phase * 2 - 1; break;
        case 'triangle': v = Math.abs(phase * 4 - 2) - 1; break;
      }
      const y = midY - v * amp;
      px === 0 ? ctx.moveTo(px, y) : ctx.lineTo(px, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  return { init, createBlock, createWaveformBlock, draw, animateScan };
})();
