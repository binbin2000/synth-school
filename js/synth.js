/* ============================================================
   synth.js — Audio Demo Sounds via Web Audio API
   ============================================================ */

const SynthDemo = (() => {
  let currentAudio = null; // currently playing <audio> element

  function getAudioCtx() {
    Piano.ensureAudioContext();
    return Piano.getAudioContext();
  }

  // ── Play a single tone with release ──────────────────────────
  function playTone(frequency, waveType = 'sawtooth', duration = 0.5) {
    const ac = getAudioCtx();
    if (!ac) return;
    if (ac.state === 'suspended') ac.resume();

    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = waveType;
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0, ac.currentTime);
    gain.gain.linearRampToValueAtTime(0.4, ac.currentTime + 0.005);
    gain.gain.setValueAtTime(0.4, ac.currentTime + duration - 0.1);
    gain.gain.linearRampToValueAtTime(0, ac.currentTime + duration);

    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(ac.currentTime);
    osc.stop(ac.currentTime + duration + 0.05);
  }

  // ── Play a chord ──────────────────────────────────────────────
  function playChord(notes, waveType = 'sawtooth', duration = 1.2) {
    const ac = getAudioCtx();
    if (!ac) return;
    if (ac.state === 'suspended') ac.resume();

    const masterGain = ac.createGain();
    const vol = 0.35 / Math.sqrt(notes.length);
    masterGain.gain.setValueAtTime(0, ac.currentTime);
    masterGain.gain.linearRampToValueAtTime(vol, ac.currentTime + 0.008);
    masterGain.gain.setValueAtTime(vol, ac.currentTime + duration - 0.15);
    masterGain.gain.linearRampToValueAtTime(0, ac.currentTime + duration);
    masterGain.connect(ac.destination);

    notes.forEach(freq => {
      const osc = ac.createOscillator();
      osc.type = waveType;
      osc.frequency.value = freq;
      osc.connect(masterGain);
      osc.start(ac.currentTime);
      osc.stop(ac.currentTime + duration + 0.1);
    });
  }

  // ── Play an arpeggio ──────────────────────────────────────────
  function playArpeggio(notes, waveType = 'sawtooth', bpm = 120, repeats = 1) {
    const ac = getAudioCtx();
    if (!ac) return;
    if (ac.state === 'suspended') ac.resume();

    const noteLen = (60 / bpm) * 0.9;
    const gap = 60 / bpm;
    const totalNotes = notes.length * repeats;

    const masterGain = ac.createGain();
    masterGain.gain.value = 0.3;
    masterGain.connect(ac.destination);

    for (let rep = 0; rep < repeats; rep++) {
      notes.forEach((freq, i) => {
        const idx = rep * notes.length + i;
        const start = ac.currentTime + idx * gap;

        const osc = ac.createOscillator();
        const envGain = ac.createGain();
        osc.type = waveType;
        osc.frequency.value = freq;

        envGain.gain.setValueAtTime(0, start);
        envGain.gain.linearRampToValueAtTime(0.8, start + 0.005);
        envGain.gain.setValueAtTime(0.8, start + noteLen - 0.03);
        envGain.gain.linearRampToValueAtTime(0, start + noteLen);

        osc.connect(envGain);
        envGain.connect(masterGain);
        osc.start(start);
        osc.stop(start + noteLen + 0.05);
      });
    }

    return totalNotes * gap;
  }

  // ── Play note with full ADSR ──────────────────────────────────
  function playWithADSR(frequency, adsr, waveType = 'sawtooth') {
    const ac = getAudioCtx();
    if (!ac) return;
    if (ac.state === 'suspended') ac.resume();

    const t = ac.currentTime;
    const sustainDur = 0.35;

    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = waveType;
    osc.frequency.value = frequency;

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(1.0, t + adsr.attack);
    gain.gain.linearRampToValueAtTime(adsr.sustainLevel, t + adsr.attack + adsr.decay);
    gain.gain.setValueAtTime(adsr.sustainLevel, t + adsr.attack + adsr.decay + sustainDur);
    gain.gain.linearRampToValueAtTime(0, t + adsr.attack + adsr.decay + sustainDur + adsr.release);

    const totalDur = adsr.attack + adsr.decay + sustainDur + adsr.release;

    const masterGain = ac.createGain();
    masterGain.gain.value = 0.4;

    osc.connect(gain);
    gain.connect(masterGain);
    masterGain.connect(ac.destination);
    osc.start(t);
    osc.stop(t + totalDur + 0.1);
  }

  // ── Custom audio player element ───────────────────────────────
  function createAudioDemoBlock(blockData) {
    const wrap = document.createElement('div');
    wrap.className = 'block-audio-demo';

    const label = document.createElement('div');
    label.className = 'audio-demo-label';
    label.textContent = blockData.label || 'DEMO';
    wrap.appendChild(label);

    const player = document.createElement('div');
    player.className = 'audio-demo-player';

    const playBtn = document.createElement('button');
    playBtn.className = 'audio-play-btn';
    playBtn.innerHTML = '&#9654;';
    player.appendChild(playBtn);

    const scrubContainer = document.createElement('div');
    scrubContainer.className = 'audio-scrubber-container';
    const scrubFill = document.createElement('div');
    scrubFill.className = 'audio-scrubber-fill';
    scrubContainer.appendChild(scrubFill);
    player.appendChild(scrubContainer);

    const timeLabel = document.createElement('span');
    timeLabel.className = 'audio-time';
    timeLabel.textContent = '0:00';
    player.appendChild(timeLabel);

    wrap.appendChild(player);

    if (blockData.description) {
      const desc = document.createElement('p');
      desc.className = 'audio-demo-description';
      desc.textContent = blockData.description;
      wrap.appendChild(desc);
    }

    // Wire up audio element if src provided
    if (blockData.src) {
      const audio = new Audio(`assets/audio/${blockData.src}`);
      audio.preload = 'metadata';

      function formatTime(s) {
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return `${m}:${sec.toString().padStart(2, '0')}`;
      }

      audio.addEventListener('loadedmetadata', () => {
        timeLabel.textContent = `0:00 / ${formatTime(audio.duration)}`;
      });

      audio.addEventListener('timeupdate', () => {
        if (!audio.duration) return;
        const pct = (audio.currentTime / audio.duration) * 100;
        scrubFill.style.width = pct + '%';
        timeLabel.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
      });

      audio.addEventListener('ended', () => {
        playBtn.innerHTML = '&#9654;';
        scrubFill.style.width = '0%';
      });

      playBtn.addEventListener('click', () => {
        if (currentAudio && currentAudio !== audio) {
          currentAudio.pause();
          currentAudio.currentTime = 0;
          // Reset other player buttons
          document.querySelectorAll('.audio-play-btn').forEach(b => { b.innerHTML = '&#9654;'; });
          document.querySelectorAll('.audio-scrubber-fill').forEach(f => { f.style.width = '0%'; });
        }
        if (audio.paused) {
          audio.play();
          currentAudio = audio;
          playBtn.innerHTML = '&#9646;&#9646;';
        } else {
          audio.pause();
          playBtn.innerHTML = '&#9654;';
        }
      });

      scrubContainer.addEventListener('click', e => {
        const rect = scrubContainer.getBoundingClientRect();
        const pct = (e.clientX - rect.left) / rect.width;
        audio.currentTime = pct * audio.duration;
      });
    } else if (blockData.synth) {
      // Synthesized demo — generate sound programmatically
      const s = blockData.synth;
      playBtn.addEventListener('click', () => {
        if (s.type === 'tone')   playTone(s.freq, s.wave, s.duration);
        if (s.type === 'chord')  playChord(s.notes, s.wave, s.duration);
        if (s.type === 'arpeggio') playArpeggio(s.notes, s.wave, s.bpm, s.repeats);
      });
      timeLabel.textContent = '▶ WEB AUDIO';
    }

    return wrap;
  }

  // ── Animated arpeggio demo block ──────────────────────────────
  function createArpDemoBlock(patterns) {
    const block = document.createElement('div');
    block.className = 'arp-demo';

    const title = document.createElement('div');
    title.className = 'arp-demo-title';
    title.textContent = 'ARPEGGIO-MÖNSTER — klicka ▶ för att höra';
    block.appendChild(title);

    const patternsEl = document.createElement('div');
    patternsEl.className = 'arp-patterns';

    patterns.forEach(p => {
      const row = document.createElement('div');
      row.className = 'arp-pattern-row';

      const nameEl = document.createElement('span');
      nameEl.className = 'arp-pattern-name';
      nameEl.textContent = p.name;
      row.appendChild(nameEl);

      const btn = document.createElement('button');
      btn.className = 'arp-play-btn';
      btn.textContent = '▶';
      row.appendChild(btn);

      const vizEl = document.createElement('div');
      vizEl.className = 'arp-visualization';
      const stepCount = p.notes.length * (p.repeats || 2);
      const steps = [];
      for (let i = 0; i < stepCount; i++) {
        const step = document.createElement('div');
        step.className = 'arp-step';
        vizEl.appendChild(step);
        steps.push(step);
      }
      row.appendChild(vizEl);
      patternsEl.appendChild(row);

      btn.addEventListener('click', () => {
        Piano.ensureAudioContext();
        const duration = playArpeggio(p.notes, p.wave || 'sawtooth', p.bpm || 120, p.repeats || 2);
        const noteDur = (60 / (p.bpm || 120));
        steps.forEach((s, i) => {
          setTimeout(() => {
            steps.forEach(s2 => s2.classList.remove('active'));
            s.classList.add('active');
          }, i * noteDur * 1000);
        });
        setTimeout(() => steps.forEach(s => s.classList.remove('active')), duration * 1000 + 100);
      });
    });

    block.appendChild(patternsEl);
    return block;
  }

  return { playTone, playChord, playArpeggio, playWithADSR, createAudioDemoBlock, createArpDemoBlock };
})();
