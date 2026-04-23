/* ============================================================
   lessons-en.js — All lesson data (English)
   ============================================================ */

window.MODULES_EN = [
  { id: 1, title: 'Sound & Synths',        subtitle: 'Understand what you hear',             lessonIds: [1, 2],       color: '#bf5fff' },
  { id: 2, title: 'Music Theory',           subtitle: 'The notes behind the vibe',            lessonIds: [3, 4, 5],    color: '#00fff7' },
  { id: 3, title: 'Arturia MiniFreak',      subtitle: 'Get to know your instrument',          lessonIds: [6, 7, 8],    color: '#ff2d78' },
  { id: 4, title: 'Shape Your Sound',       subtitle: 'ADSR, LFO and effects',                lessonIds: [9, 10, 11],  color: '#00fff7' },
  { id: 5, title: 'Creating Synthwave',     subtitle: 'Leads, pads and arpeggios',            lessonIds: [12, 13, 14], color: '#bf5fff' },
  { id: 6, title: 'Your First Track',       subtitle: 'Put it all together',                  lessonIds: [15, 16],     color: '#ff2d78' },
];

window.LESSONS_EN = {

  // ════════════════════════════════════════════════════════════
  // MODULE 1 — Sound & Synths
  // ════════════════════════════════════════════════════════════

  1: {
    id: 1, moduleId: 1,
    title: 'What is Sound?',
    subtitle: 'Frequencies, waveforms and why your ears work the way they do',
    tags: ['Basics', 'Physics'],
    estimatedMinutes: 8,
    blocks: [
      {
        type: 'text',
        html: `<p>All sound is <strong>vibration</strong>. When a guitar string is struck, a bass pumps or a synth plays a note — air molecules are set in motion. They push each other forward like dominoes, creating a wave of pressure changes that finally reaches your eardrum and is interpreted as sound by the brain.</p>
<p>Two properties define a tone: <strong>frequency</strong> (how high or low it sounds) and <strong>amplitude</strong> (how loud it is).</p>`
      },
      {
        type: 'tip',
        label: 'KEY CONCEPT',
        html: `<p>Frequency is measured in <strong>Hz (hertz)</strong> — oscillations per second. The note <strong>A4</strong> (the tuning note on a piano) vibrates at exactly <strong>440 Hz</strong>. Every octave up doubles the frequency: A5 = 880 Hz.</p>`
      },
      {
        type: 'text',
        html: `<h3>The four basic waveforms</h3>
<p>A synth creates sound with <strong>oscillators</strong> that generate waveforms. There are four classic shapes — click them to hear what they sound like:</p>`
      },
      { type: 'waveform', caption: 'Click each waveform to hear the difference', config: { waveforms: ['sine', 'square', 'sawtooth', 'triangle'], interactive: true, playable: true } },
      {
        type: 'text',
        html: `<ul>
<li><strong>Sine</strong> — Pure, smooth, no overtones. Think whistle.</li>
<li><strong>Square</strong> — Hollow, reedy feel. Classic chiptune sound.</li>
<li><strong>Sawtooth</strong> — Sharp, buzzy, rich in overtones. <em>The backbone of synthwave</em>.</li>
<li><strong>Triangle</strong> — Softer than square, but gentler than sawtooth.</li>
</ul>`
      },
      {
        type: 'tip',
        label: 'SYNTHWAVE TIP',
        html: `<p>The sawtooth wave is by far the most common waveform in synthwave. Its sharp timbre dresses beautifully in reverb and delay — it's what gives the genre its characteristic "retro space" feel.</p>`
      },
      {
        type: 'piano',
        config: { defaultWave: 'sawtooth', showWaveSelector: true, octaves: 2, startOctave: 4, highlightKeys: [], caption: 'Play some notes — try switching waveforms and hear the difference' }
      },
      { type: 'quiz' }
    ],
    quiz: {
      questions: [
        {
          text: 'What does Hz (hertz) measure?',
          options: ['Volume — how loud the sound is', 'Frequency — oscillations per second', 'The length of a note', 'How many overtones a sound has'],
          correctIndex: 1,
          explanation: 'Hz measures frequency: the number of complete oscillations per second. 440 Hz = 440 cycles per second, which we hear as the note A4.'
        },
        {
          text: 'Which waveform sounds the purest and softest, with no overtones?',
          options: ['Sawtooth', 'Square', 'Sine', 'Triangle'],
          correctIndex: 2,
          explanation: 'The sine wave contains only the fundamental frequency — no overtones at all — and produces the purest, softest sound.'
        },
        {
          text: 'The note A4 is 440 Hz. What is A5 (one octave higher)?',
          options: ['880 Hz', '480 Hz', '220 Hz', '540 Hz'],
          correctIndex: 0,
          explanation: 'Every octave doubles the frequency. A5 = 440 × 2 = 880 Hz.'
        },
        {
          text: 'Which waveform is most common in synthwave leads?',
          options: ['Sine', 'Triangle', 'Sawtooth', 'Square'],
          correctIndex: 2,
          explanation: 'The sawtooth wave is rich in overtones, sharp and buzzy — it cuts through a mix and dresses perfectly in synthwave effects like reverb and delay.'
        }
      ],
      passingScore: 3
    }
  },

  2: {
    id: 2, moduleId: 1,
    title: 'What is a Synth?',
    subtitle: 'Subtractive synthesis — step by step',
    tags: ['Basics', 'Synthesis'],
    estimatedMinutes: 10,
    blocks: [
      {
        type: 'text',
        html: `<p>A synthesizer creates sound <em>electronically</em>. Instead of capturing an acoustic instrument, <strong>synthesis builds a sound from scratch</strong> using electronic circuits (or digital simulations of them).</p>
<p>The most common type — and the one the MiniFreak is based on — is called <strong>subtractive synthesis</strong>. The name comes from starting with a sound <em>rich in overtones</em> and then subtracting (removing) parts of it with a filter.</p>`
      },
      {
        type: 'tip',
        label: 'THE SIGNAL CHAIN',
        html: `<p>All subtractive synths follow the same basic principle:<br>
<strong>Oscillator → Filter → Amplifier → Effects</strong><br>
Each stage shapes the sound in a different way.</p>`
      },
      {
        type: 'text',
        html: `<h3>The Oscillator (OSC) — Sound is born</h3>
<p>The oscillator generates the raw sound — one of the waveforms you learned about in the previous lesson. It determines the <strong>pitch</strong> (which note you play) and provides the raw material that the rest of the synth's circuits then process.</p>
<h3>The Filter — Tone is shaped</h3>
<p>The filter is the heart of subtractive synthesis. It <strong>cuts away frequencies</strong> from the signal. The most common is a low-pass filter (LP) that lets through low frequencies but attenuates high ones — the result is a warmer, darker sound. Raise the filter's <em>cutoff frequency</em> and more of the overtone richness opens up. Lower it for a darker, more muffled sound.</p>
<h3>The Amplifier (VCA) — Volume is controlled</h3>
<p>VCA (Voltage-Controlled Amplifier) controls <strong>how the volume changes over time</strong>. This is where you decide whether a sound sneaks in softly or attacks hard, sustains for a long time or fades quickly. We'll return to this in the ADSR lesson.</p>
<h3>Effects — Sound is placed in space</h3>
<p>Reverb, delay, chorus and other effects place your sound in a virtual room and give it depth and character. Synthwave uses <em>extremely</em> heavy reverb — it's a major part of the genre's DNA.</p>`
      },
      {
        type: 'tip',
        label: 'MINIFREAK NOTE',
        html: `<p>The Arturia MiniFreak is a <strong>hybrid synth</strong>: the oscillators are digital (they can generate lots of different waveforms and synthesis types), but the filter and VCA are <strong>analog</strong>. This gives the best of both worlds — flexibility from the digital side, warmth and character from the analog side.</p>`
      },
      {
        type: 'text',
        html: `<h3>Try it virtually</h3>
<p>Even though we can't control all parameters in the browser, you can already hear the difference between an open and closed filter by comparing the waveforms below. The sine wave resembles a <em>closed filter</em> (only the fundamental left). The sawtooth resembles an <em>open filter</em> (all overtones present).</p>`
      },
      {
        type: 'waveform',
        caption: '"Open filter" = SAW (rich overtones), "Closed filter" ≈ SINE (fundamental only)',
        config: { waveforms: ['sine', 'sawtooth'], interactive: true, playable: true }
      },
      { type: 'quiz' }
    ],
    quiz: {
      questions: [
        {
          text: 'What is the most common type of synthesis that the MiniFreak uses?',
          options: ['Additive synthesis', 'FM synthesis', 'Subtractive synthesis', 'Granular synthesis'],
          correctIndex: 2,
          explanation: 'Subtractive synthesis starts with a tonally rich sound (oscillator) and then removes frequencies with a filter to shape the timbre.'
        },
        {
          text: 'What is the order of the signal chain in a subtractive synth?',
          options: ['Filter → Oscillator → Amplifier', 'Oscillator → Filter → Amplifier', 'Amplifier → Oscillator → Filter', 'Oscillator → Amplifier → Filter'],
          correctIndex: 1,
          explanation: 'The oscillator creates the raw sound, the filter shapes it, the amplifier controls volume over time. OSC → Filter → Amplifier.'
        },
        {
          text: 'What happens when you lower a low-pass filter\'s cutoff frequency?',
          options: ['The sound becomes sharper and brighter', 'The sound disappears completely', 'The sound becomes darker and warmer', 'The pitch of the note changes'],
          correctIndex: 2,
          explanation: 'A low-pass filter lets through low frequencies. Lowering the cutoff filters away more high frequencies (overtones) — the result is a darker, warmer sound.'
        },
        {
          text: 'The MiniFreak is a hybrid synth. What is digital and what is analog?',
          options: ['Digital filter, analog oscillator', 'Digital oscillator, analog filter and VCA', 'Everything is digital', 'Everything is analog'],
          correctIndex: 1,
          explanation: 'The MiniFreak\'s oscillators are digital (flexible, can do many synthesis types), while the filter and VCA are analog (warmer, more characterful).'
        }
      ],
      passingScore: 3
    }
  },

  // ════════════════════════════════════════════════════════════
  // MODULE 2 — Music Theory
  // ════════════════════════════════════════════════════════════

  3: {
    id: 3, moduleId: 2,
    title: 'Notes & The Keyboard',
    subtitle: 'The 12 notes and how octaves work',
    tags: ['Music Theory', 'Basics'],
    estimatedMinutes: 10,
    blocks: [
      {
        type: 'text',
        html: `<p>All Western music — pop, classical, synthwave, techno — is built on the same 12 notes that repeat in <strong>octaves</strong>. These 12 notes are called a <strong>chromatic scale</strong>.</p>
<p>On a piano keyboard, the white keys represent the natural notes: <strong>C D E F G A B</strong>. The black keys are <strong>semitones</strong> — they're called either <em>sharp (♯)</em> meaning a half step up, or <em>flat (♭)</em> a half step down.</p>`
      },
      {
        type: 'piano',
        config: {
          defaultWave: 'sine',
          showWaveSelector: false,
          octaves: 2,
          startOctave: 4,
          highlightKeys: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'],
          caption: 'The blue-highlighted keys are the C major scale. Play them from bottom to top!'
        }
      },
      {
        type: 'text',
        html: `<h3>Half steps and whole steps</h3>
<p>The distance between two adjacent keys (e.g. C to C# or E to F) is called a <strong>half step</strong>. Two half steps = one <strong>whole step</strong>.</p>
<p>Note that E–F and B–C do <em>not</em> have a black key between them — they are already a half step apart.</p>`
      },
      {
        type: 'tip',
        label: 'MEMORY TRICK',
        html: `<p>Look at the black keys: they come in groups of <strong>2 and 3</strong>. C is always the white key <em>immediately to the left</em> of a group of 2 black keys.</p>`
      },
      {
        type: 'text',
        html: `<h3>Octaves</h3>
<p>When you play C3, C4 or C2 it's the same note name — but in different <strong>octaves</strong>. Every octave up doubles the frequency. C3 (middle C) is approximately 261 Hz, C4 is 523 Hz, C2 is 131 Hz.</p>
<p>In synthwave you often play <strong>leads</strong> in octaves 4–5, <strong>bass</strong> in octaves 1–2, and <strong>pads</strong> spread across several octaves.</p>`
      },
      {
        type: 'text',
        html: `<h3>Play the C major scale</h3>
<p>Try playing the highlighted keys from left to right: C–D–E–F–G–A–B–C. That's the C major scale — the simplest scale, using only white keys. You'll recognise the melody — it's the classic "do re mi fa sol la ti do".</p>`
      },
      { type: 'quiz' }
    ],
    quiz: {
      questions: [
        {
          text: 'How many notes are in a chromatic scale?',
          options: ['7', '8', '10', '12'],
          correctIndex: 3,
          explanation: 'The chromatic scale has 12 notes: C, C#, D, D#, E, F, F#, G, G#, A, A#, B — then it starts over at the next C.'
        },
        {
          text: 'Which of these pairs is a half step (no black key between them)?',
          options: ['C–D', 'D–E', 'E–F', 'F–G'],
          correctIndex: 2,
          explanation: 'E–F is a half step — there is no black key (E#/Fb) between them. The same applies to B–C.'
        },
        {
          text: 'C4 is 261 Hz. Approximately what is C5?',
          options: ['521 Hz', '261 Hz', '131 Hz', '392 Hz'],
          correctIndex: 0,
          explanation: 'Every octave up doubles the frequency. C5 ≈ 261 × 2 = 522 Hz (exact: 523.25 Hz).'
        },
        {
          text: 'Where on the keyboard do you find the note C?',
          options: ['To the right of 3 black keys', 'To the left of 2 black keys', 'Between 2 black keys', 'To the left of 3 black keys'],
          correctIndex: 1,
          explanation: 'C is always the white key immediately to the left of a group of 2 black keys.'
        }
      ],
      passingScore: 3
    }
  },

  4: {
    id: 4, moduleId: 2,
    title: 'Scales',
    subtitle: 'The minor scale and pentatonic — synthwave\'s favorites',
    tags: ['Music Theory', 'Scales'],
    estimatedMinutes: 12,
    blocks: [
      {
        type: 'text',
        html: `<p>A <strong>scale</strong> is a collection of notes that sound good together. It defines the mood of a song. The major scale sounds happy and strong. The <strong>minor scale</strong> sounds melancholic, dark and intense — and that's <em>exactly</em> what synthwave is all about.</p>`
      },
      {
        type: 'tip',
        label: 'SYNTHWAVE FACT',
        html: `<p>Almost all synthwave is written in <strong>minor</strong>. The genre's dark, nostalgia-dripping feel comes directly from the minor key. Think Kavinsky, Perturbator, Carpenter Brut — all in minor.</p>`
      },
      {
        type: 'text',
        html: `<h3>Natural minor scale</h3>
<p>The minor scale is formed with a specific pattern of whole and half steps:<br>
<strong>Whole – Half – Whole – Whole – Half – Whole – Whole</strong></p>
<p>Starting on A (A minor — the simplest minor scale, using only white keys) we get:</p>`
      },
      {
        type: 'text',
        html: `<div class="scale-steps">
<span class="scale-step root">A</span>
<span class="scale-step">B</span>
<span class="scale-step">C</span>
<span class="scale-step">D</span>
<span class="scale-step">E</span>
<span class="scale-step">F</span>
<span class="scale-step">G</span>
<span class="scale-step root">A</span>
</div>`
      },
      {
        type: 'piano',
        config: {
          defaultWave: 'sawtooth',
          showWaveSelector: false,
          octaves: 2,
          startOctave: 3,
          highlightKeys: ['A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5'],
          caption: 'The A minor scale — highlighted keys. Play them up and down and feel the mood!'
        }
      },
      {
        type: 'text',
        html: `<h3>Pentatonic minor scale</h3>
<p>The pentatonic is a 5-note scale (penta = five) that removes the two "clashiest" notes from the minor scale. The result is a scale that <em>almost always sounds good</em> — you can play any of its notes and it will ring out nicely.</p>
<p>A pentatonic minor: <strong>A – C – D – E – G</strong></p>`
      },
      {
        type: 'text',
        html: `<div class="scale-steps">
<span class="scale-step root">A</span>
<span class="scale-step">C</span>
<span class="scale-step">D</span>
<span class="scale-step">E</span>
<span class="scale-step">G</span>
<span class="scale-step root">A</span>
</div>
<p style="margin-top:.5rem">These 5 notes are your <strong>safe zone</strong> — anything you improvise with them will likely sound great!</p>`
      },
      {
        type: 'piano',
        config: {
          defaultWave: 'sawtooth',
          showWaveSelector: false,
          octaves: 2,
          startOctave: 3,
          highlightKeys: ['A3', 'C4', 'D4', 'E4', 'G4', 'A4', 'C5', 'D5', 'E5', 'G5'],
          caption: 'A pentatonic minor — improvise freely with the highlighted keys'
        }
      },
      {
        type: 'tip',
        label: 'PRACTICE',
        html: `<p>Start your MiniFreak, choose a SAW sound and play freely with the highlighted pentatonic notes. Play slowly, create a simple melody. Rotate up an octave with the octave button for a sharper lead sound.</p>`
      },
      { type: 'quiz' }
    ],
    quiz: {
      questions: [
        {
          text: 'Which scale is most common in synthwave?',
          options: ['The major scale', 'The minor scale', 'The blues scale', 'The whole tone scale'],
          correctIndex: 1,
          explanation: 'The minor scale provides the dark, melancholic mood that is the core of synthwave. Almost all synthwave is in minor.'
        },
        {
          text: 'How many notes does a pentatonic scale have?',
          options: ['3', '5', '7', '8'],
          correctIndex: 1,
          explanation: 'Penta = five in Latin/Greek. Pentatonic scales have 5 notes, making them simpler to improvise with.'
        },
        {
          text: 'Which notes are in A pentatonic minor?',
          options: ['A C D E G', 'A B C D E', 'A C# E F# G', 'A B D E G'],
          correctIndex: 0,
          explanation: 'A pentatonic minor: A – C – D – E – G. Five notes that almost always sound great together.'
        },
        {
          text: 'What is the difference between the natural minor scale and the pentatonic minor scale?',
          options: ['The minor scale has 5 notes, the pentatonic 7', 'The pentatonic is missing 2 of the minor scale\'s notes', 'They are exactly the same', 'The pentatonic only uses black keys'],
          correctIndex: 1,
          explanation: 'Pentatonic minor removes 2 of the 7 notes from the natural minor scale (the 2nd and 6th degrees), leaving 5 notes that are easier to improvise with.'
        }
      ],
      passingScore: 3
    }
  },

  5: {
    id: 5, moduleId: 2,
    title: 'Chords & Progressions',
    subtitle: 'The harmony behind the synthwave feel',
    tags: ['Music Theory', 'Harmony'],
    estimatedMinutes: 12,
    blocks: [
      {
        type: 'text',
        html: `<p>A <strong>chord</strong> is three or more notes played at the same time. Each chord has a character — major chords sound happy and stable, minor chords melancholic and introspective.</p>
<p>A <strong>progression</strong> is a sequence of chords that repeats as the harmonic foundation of the song. It's the progression that gives synthwave tracks their characteristic emotional arc.</p>`
      },
      {
        type: 'text',
        html: `<h3>Building a chord</h3>
<p>The simplest chord — a <strong>triad</strong> — is built from three notes with specific intervals:<br>
<strong>Root + third (3 or 4 half steps up) + fifth (7 half steps from the root)</strong></p>
<p>The Am chord: <strong>A – C – E</strong></p>`
      },
      {
        type: 'text',
        html: `<div class="chord-buttons">
<button class="chord-btn" data-notes="[220,261.63,329.63]" data-wave="sawtooth">Am</button>
<button class="chord-btn" data-notes="[174.61,220,261.63]" data-wave="sawtooth">F</button>
<button class="chord-btn" data-notes="[130.81,164.81,196]" data-wave="sawtooth">C</button>
<button class="chord-btn" data-notes="[146.83,185,220]" data-wave="sawtooth">Gm</button>
</div>
<p>Click the chords above to hear them. Notice the difference between Am (minor) and C (major).</p>`
      },
      {
        type: 'tip',
        label: 'CLASSIC SYNTHWAVE PROGRESSION',
        html: `<p>The iconic synthwave progression is <strong>i – VI – III – VII</strong> in A minor:<br>
<strong>Am – F – C – G</strong><br>
You'll find it in hundreds of synthwave tracks. That mixture of darkness (Am) and uplift (F, C) is the formula's secret.</p>`
      },
      {
        type: 'text',
        html: `<h3>Try the classic progression</h3>
<p>Click through the chords below in order — it's <strong>Am – F – C – G</strong>. Repeat them and feel how the progression "rotates" around and creates a looped tension:</p>
<div class="chord-buttons">
<button class="chord-btn" data-notes="[220,261.63,329.63]" data-wave="sawtooth">Am (i)</button>
<button class="chord-btn" data-notes="[174.61,220,261.63]" data-wave="sawtooth">F (VI)</button>
<button class="chord-btn" data-notes="[261.63,329.63,392]" data-wave="sawtooth">C (III)</button>
<button class="chord-btn" data-notes="[196,246.94,293.66]" data-wave="sawtooth">G (VII)</button>
</div>`
      },
      {
        type: 'text',
        html: `<h3>Why does the progression work?</h3>
<p>Am provides weight and darkness (the tonic). F lifts things slightly (subdominant). C brings light (the relative major). G builds tension that wants to resolve back to Am. That cycle — tension and resolution — is what makes the music hit hard.</p>`
      },
      {
        type: 'piano',
        config: {
          defaultWave: 'sawtooth',
          showWaveSelector: false,
          octaves: 2,
          startOctave: 3,
          highlightKeys: ['A3', 'C4', 'E4', 'F3', 'A3', 'C4', 'C3', 'E3', 'G3', 'G3', 'B3', 'D4'],
          caption: 'Play the chords manually: Am = A+C+E, F = F+A+C, C = C+E+G, G = G+B+D'
        }
      },
      { type: 'quiz' }
    ],
    quiz: {
      questions: [
        {
          text: 'What is a chord?',
          options: ['A single note played for a long time', 'Three or more notes played together', 'A rhythmic figure', 'A sequence of melody notes'],
          correctIndex: 1,
          explanation: 'A chord is at least three notes played simultaneously. The most common is the triad: root + third + fifth.'
        },
        {
          text: 'Which notes make up the Am chord (A minor)?',
          options: ['A – B – C', 'A – C – E', 'A – C# – E', 'A – D – G'],
          correctIndex: 1,
          explanation: 'Am = A (root) + C (minor third, 3 half steps up) + E (fifth, 7 half steps up).'
        },
        {
          text: 'What is the classic synthwave progression?',
          options: ['C – G – Am – F', 'Am – F – C – G', 'Dm – Am – Bb – C', 'Em – G – D – A'],
          correctIndex: 1,
          explanation: 'Am – F – C – G (i–VI–III–VII in A minor) is one of the most commonly used chord progressions in synthwave.'
        },
        {
          text: 'Why does the Am chord sound more melancholic than C major?',
          options: ['Am has more notes', 'Am contains a minor third (3 half steps), C major a major third (4 half steps)', 'Am is played lower in the register', 'Am is a simpler chord'],
          correctIndex: 1,
          explanation: 'The difference is the third: minor chords have a minor third (3 half steps), major chords a major third (4 half steps). The minor third gives the darker, more melancholic character.'
        }
      ],
      passingScore: 3
    }
  },

  // ════════════════════════════════════════════════════════════
  // MODULE 3 — Arturia MiniFreak
  // ════════════════════════════════════════════════════════════

  6: {
    id: 6, moduleId: 3,
    title: 'MiniFreak: Interface Overview',
    subtitle: 'What does each section on the front panel do?',
    tags: ['MiniFreak', 'Hardware'],
    estimatedMinutes: 12,
    blocks: [
      {
        type: 'text',
        html: `<p>The Arturia MiniFreak can look overwhelming at first glance — lots of buttons, knobs and screens. But with the right map it's actually <strong>logically organised</strong>. Everything belongs in the signal chain you learned: Oscillators → Filter → Amplifier → Effects.</p>`
      },
      { type: 'minifreak', config: {} },
      {
        type: 'text',
        html: `<h3>Sections from top to bottom</h3>
<ul>
<li><strong>Oscillator A & B</strong> — Two digital oscillators. Each can generate many synthesis types (Wavetable, Virtual Analog, FM, etc.). This is where all sound begins.</li>
<li><strong>Filter</strong> — Arturia's version of the Steiner-Parker filter. Low-pass (LP), band-pass (BP) or high-pass (HP). Cutoff and Resonance are the key controls.</li>
<li><strong>Envelopes (Env1 / Env2)</strong> — Two ADSR envelopes. Env2 normally controls volume (Amp Envelope). Env1 can modulate filter, pitch, LFO, etc.</li>
<li><strong>LFO 1 & 2</strong> — Low frequency oscillators for modulation — vibrato, tremolo, filter wobble, etc.</li>
<li><strong>Effects</strong> — Three parallel effects blocks: Chorus/Flanger/Phaser, Delay and Reverb.</li>
<li><strong>Arpeggiator & Sequencer</strong> — Built-in arpeggiator and 16-step sequencer.</li>
<li><strong>Macros (4 buttons)</strong> — Programmable buttons that can control multiple parameters simultaneously.</li>
<li><strong>SPICE & DICE</strong> — Sound randomisation. Spice tweaks slightly, Dice generates an entirely new sound.</li>
</ul>`
      },
      {
        type: 'tip',
        label: 'GETTING STARTED',
        html: `<p>Always start with a <strong>preset</strong> that resembles the sound you're after, then adjust from there. Press the <em>Browse</em> button and scroll through presets — there are hundreds. Listen to the "Lead", "Pad", "Bass" and "Arp" categories.</p>`
      },
      {
        type: 'text',
        html: `<h3>Display and navigation</h3>
<p>The MiniFreak has a small OLED screen that shows which parameter you're adjusting and its value. When you turn a knob the screen updates immediately. There is a <strong>navigation joystick/push-encoder</strong> to the right of the screen for navigating menus.</p>
<p>To edit a preset: select one, make changes, then hold <em>Shift</em> and press <em>Store</em> to save it to a new slot.</p>`
      },
      { type: 'quiz' }
    ],
    quiz: {
      questions: [
        {
          text: 'How many oscillators does the MiniFreak have?',
          options: ['1', '2', '3', '4'],
          correctIndex: 1,
          explanation: 'The MiniFreak has two digital oscillators: Oscillator A and Oscillator B. They can have different synthesis types and can be tuned against each other.'
        },
        {
          text: 'Which filter type is the MiniFreak\'s filter based on?',
          options: ['Moog ladder', 'Steiner-Parker', 'SEM state-variable', 'Chamberlin'],
          correctIndex: 1,
          explanation: 'The MiniFreak uses Arturia\'s version of the classic Steiner-Parker filter, which can run as LP (low-pass), BP (band-pass) or HP (high-pass).'
        },
        {
          text: 'What does the DICE button on the MiniFreak do?',
          options: ['Turns the arpeggiator on/off', 'Randomises a completely new sound', 'Adjusts the LFO speed', 'Saves a preset'],
          correctIndex: 1,
          explanation: 'DICE randomises the oscillator settings and creates a completely new sound. SPICE makes a gentler adjustment to the current sound.'
        },
        {
          text: 'Where in the signal chain do the envelopes (ADSR) sit on the MiniFreak?',
          options: ['Before the oscillators', 'Inside the filter', 'They modulate the filter and amplifier', 'In the effects block'],
          correctIndex: 2,
          explanation: 'Envelopes are modulation sources — they affect (modulate) the amplitude (Env2 normally) and can modulate filter cutoff and other parameters (Env1).'
        }
      ],
      passingScore: 3
    }
  },

  7: {
    id: 7, moduleId: 3,
    title: 'Oscillators A & B',
    subtitle: 'Waveforms, tuning and the dual OSC trick',
    tags: ['MiniFreak', 'Oscillators'],
    estimatedMinutes: 12,
    blocks: [
      {
        type: 'text',
        html: `<p>The MiniFreak's oscillators are unusual — they are <strong>digital</strong> which gives them an enormous range of synthesis types. You can choose from Virtual Analog waveforms, Wavetables, FM synthesis, Speech synthesis, Karplus-Strong and much more.</p>
<p>But don't worry about all the options right now. For synthwave you really only need a handful.</p>`
      },
      {
        type: 'tip',
        label: 'SYNTHWAVE ESSENTIALS',
        html: `<p>For leads: choose <strong>Virtual Analog → Sawtooth</strong> on Osc A (and B if you want a thicker sound).<br>
For pads: try the <strong>Wavetable</strong> oscillator with a soft table.<br>
For bass: <strong>Virtual Analog → Square</strong> or SAW a couple of octaves down.</p>`
      },
      {
        type: 'text',
        html: `<h3>The TYPE knob</h3>
<p>Each oscillator has a <strong>TYPE</strong> knob (and a button to select the synthesis type). Turning the TYPE knob within Virtual Analog mode scrolls through the waveforms: SAW, SQUARE, TRIANGLE, SINE and variants in between.</p>
<h3>WAVE and TIMBRE</h3>
<p>Depending on the synthesis type, the <strong>WAVE</strong> and <strong>TIMBRE</strong> knobs control the character of the sound. In Virtual Analog mode: WAVE selects the waveform, TIMBRE adjusts pulse width (for square) or amount of overtones.</p>`
      },
      {
        type: 'waveform',
        caption: 'These four waveforms are the most important — try them on your MiniFreak too!',
        config: { waveforms: ['sawtooth', 'square', 'sine', 'triangle'], interactive: true, playable: true }
      },
      {
        type: 'text',
        html: `<h3>The dual OSC trick: Detune</h3>
<p>One of the most powerful tricks in synthwave is running <strong>two oscillators tuned slightly against each other</strong>. Nothing sounds fatter. Set the same synthesis type on OSC A and OSC B, then adjust OSC B's <strong>SEMITONE</strong> or <strong>DETUNE</strong> a few cents (hundredths of a semitone) up or down.</p>
<p>The result is a <em>chorus-like</em> swell that makes the lead "flow" and take up more space. Classic synthwave production.</p>`
      },
      {
        type: 'text',
        html: `<div class="chord-buttons">
<button class="chord-btn" data-notes="[220]" data-wave="sawtooth">OSC A: SAW 220Hz</button>
<button class="chord-btn" data-notes="[220, 222]" data-wave="sawtooth">A + B: Detuned ±2 cent</button>
<button class="chord-btn" data-notes="[220, 225]" data-wave="sawtooth">A + B: Detuned ±5 cent</button>
</div>
<p>Hear how much thicker it sounds with two detuned oscillators!</p>`
      },
      {
        type: 'tip',
        label: 'UNISON MODE',
        html: `<p>The MiniFreak has a <strong>Unison</strong> mode (Shift + Paraphonic/Unison button) that stacks all voices on the same key and detunes them against each other. Enable it for maximum thickness on a lead.</p>`
      },
      { type: 'quiz' }
    ],
    quiz: {
      questions: [
        {
          text: 'Why are the MiniFreak\'s oscillators called "digital"?',
          options: ['They require batteries', 'They simulate and generate waveforms digitally and can handle many synthesis types', 'They are inferior to analog', 'They only generate digital noise'],
          correctIndex: 1,
          explanation: 'Digital oscillators simulate waveforms with algorithms, giving them the ability to do Wavetable, FM, VA-analog and much more — something analog circuits cannot do.'
        },
        {
          text: 'What happens when you detune OSC B a few cents against OSC A?',
          options: ['The note shifts a semitone up', 'The sound becomes thicker and more swelling', 'The oscillator stops playing', 'It creates a vibrato'],
          correctIndex: 1,
          explanation: 'Slight detuning of two oscillators creates phase differences that produce a thicker, swelling sound — almost like a built-in chorus. Classic synthwave trick.'
        },
        {
          text: 'Which waveform is best for a classic synthwave lead?',
          options: ['Sine', 'Triangle', 'Sawtooth', 'Square'],
          correctIndex: 2,
          explanation: 'Sawtooth is rich in overtones, has a sharp attack and dresses beautifully in reverb and delay — perfect for synthwave leads.'
        },
        {
          text: 'What does the TYPE knob on the MiniFreak\'s oscillators control?',
          options: ['Volume of the oscillator', 'Synthesis type and/or waveform selection', 'Octave setting', 'LFO speed'],
          correctIndex: 1,
          explanation: 'The TYPE knob selects the synthesis type (Virtual Analog, Wavetable, FM, etc.) and within each synthesis type scrolls between waveforms or variants.'
        },
        {
          text: 'What does Unison mode on the MiniFreak do?',
          options: ['Merges all presets into one', 'Stacks all voices on the same key with detuning for a fatter sound', 'Adds an echo effect', 'Connects OSC A and B in series'],
          correctIndex: 1,
          explanation: 'Unison mode stacks all available voices on the same key and detunes them against each other, producing an extremely thick, massive sound.'
        }
      ],
      passingScore: 3
    }
  },

  8: {
    id: 8, moduleId: 3,
    title: 'The Filter: Steiner-Parker',
    subtitle: 'Cutoff, resonance and the classic filter',
    tags: ['MiniFreak', 'Filter'],
    estimatedMinutes: 12,
    blocks: [
      {
        type: 'text',
        html: `<p>The filter is the <strong>heart</strong> of a subtractive synth. It is the most important tool for shaping timbre and giving a sound its character. The MiniFreak uses an analog version of the classic <strong>Steiner-Parker filter</strong> — designed by Nyle Steiner in the 1970s and known for its open, slightly gritty character.</p>`
      },
      {
        type: 'text',
        html: `<h3>Filter types</h3>
<p>The Steiner-Parker can run in three modes — select with the FILTER TYPE button:</p>
<ul>
<li><strong>LP (Low-pass)</strong> — Passes frequencies <em>below</em> cutoff, attenuates high ones. Darkens the sound. Most common.</li>
<li><strong>BP (Band-pass)</strong> — Passes a band around cutoff, attenuates everything outside. Narrower, nasal tone.</li>
<li><strong>HP (High-pass)</strong> — Passes frequencies <em>above</em> cutoff, attenuates low ones. Thins the sound, good for high-end elements.</li>
</ul>`
      },
      {
        type: 'tip',
        label: 'SYNTHWAVE TIP',
        html: `<p>The <strong>LP filter</strong> is your go-to for leads and pads. Start with cutoff at about 70% and adjust from there. Lower it for a darker, more <em>muffled</em> sound. Raise it to open up overtones and make leads sharper.</p>`
      },
      {
        type: 'text',
        html: `<h3>The CUTOFF frequency</h3>
<p>Cutoff (the CUT knob) is <strong>the most important knob on the synth's filter</strong>. It determines where the filter "cuts off" frequencies. Think of it as an EQ curve: LP filter cuts everything above cutoff.</p>
<ul>
<li>Cutoff low (e.g. 20%) → Dark, muffled, bass-heavy</li>
<li>Cutoff mid-range (50–70%) → Balanced, warm</li>
<li>Cutoff high (90–100%) → Filter essentially open, all overtones present</li>
</ul>`
      },
      {
        type: 'text',
        html: `<h3>RESONANCE</h3>
<p>Resonance (the RES knob) boosts the frequencies <em>right around</em> the cutoff point. This creates a kind of ringing, whip-crack sound. At high resonance the filter can start self-oscillating and generate a tone.</p>
<ul>
<li>Resonance low (0–30%) → Natural, warm</li>
<li>Resonance mid (40–60%) → Characteristic synth tone, slightly "wah"</li>
<li>Resonance high (70–100%) → Extreme, ringing, acid-like</li>
</ul>`
      },
      {
        type: 'tip',
        label: 'FILTER SWEEP — CLASSIC TRICK',
        html: `<p>Open a pad sound with the cutoff low and automate or manually sweep the cutoff up during an intro. It creates a tension build that explodes when the chorus kicks in — one of the most classic synthwave moves.</p>`
      },
      {
        type: 'text',
        html: `<h3>ENVELOPE → FILTER (Env Amount)</h3>
<p>The filter's cutoff can be <strong>modulated by Env1</strong>. This means the cutoff opens automatically each time you press a key (following the ADSR curve) and then closes again. It gives the classic "wah-wah" movement on plucked synth sounds.</p>
<p>On the MiniFreak: the <strong>ENV→FILT</strong> knob controls how much Env1 affects the cutoff. Positive value = envelope opens the filter. Negative = envelope closes it.</p>`
      },
      { type: 'quiz' }
    ],
    quiz: {
      questions: [
        {
          text: 'What does a low-pass filter (LP) do?',
          options: ['Removes low frequencies', 'Passes low frequencies and attenuates high ones', 'Boosts all frequencies', 'Creates an echo sound'],
          correctIndex: 1,
          explanation: 'Low-pass filter (LP) = "low passes". It lets through low frequencies and attenuates everything above the cutoff frequency, darkening and softening the timbre.'
        },
        {
          text: 'What happens when you turn up the resonance?',
          options: ['The cutoff frequency rises', 'Frequencies around cutoff are boosted, creating a ringing sound', 'The volume decreases', 'The LFO starts'],
          correctIndex: 1,
          explanation: 'Resonance boosts frequencies right around the cutoff point. High resonance gives a characteristic "synthy" whip sound and at extreme settings can cause the filter to self-oscillate.'
        },
        {
          text: 'Which filter mode gives a "nasal" narrow sound?',
          options: ['LP', 'HP', 'BP', 'All filter modes sound the same'],
          correctIndex: 2,
          explanation: 'BP (band-pass) lets through a narrow frequency band around cutoff and attenuates everything outside — it gives a nasal, narrow tone.'
        },
        {
          text: 'What does the ENV→FILT knob on the MiniFreak do?',
          options: ['Adjusts amplitude with an envelope', 'Controls how much Env1 modulates the filter cutoff', 'Connects the LFO to the filter', 'Adjusts the filter type'],
          correctIndex: 1,
          explanation: 'ENV→FILT determines how much Env1 (the modulation envelope) affects the filter cutoff. It gives the classic "opening" filter movement when a key is pressed.'
        }
      ],
      passingScore: 3
    }
  },

  // ════════════════════════════════════════════════════════════
  // MODULE 4 — Shape Your Sound
  // ════════════════════════════════════════════════════════════

  9: {
    id: 9, moduleId: 4,
    title: 'ADSR: The Power of Envelopes',
    subtitle: 'Attack, Decay, Sustain, Release — shape the sound\'s timeline',
    tags: ['Sound Design', 'ADSR'],
    estimatedMinutes: 15,
    blocks: [
      {
        type: 'text',
        html: `<p>ADSR is an <strong>envelope</strong> — it describes how a sound changes in volume (or filter opening) <em>over time</em>, from the moment you press a key to when you release it.</p>
<p>Four parameters control the curve: <strong>Attack</strong>, <strong>Decay</strong>, <strong>Sustain</strong> and <strong>Release</strong>.</p>`
      },
      {
        type: 'text',
        html: `<ul>
<li><strong>Attack</strong> — How long it takes for the volume to go from 0 to maximum when you press the key. Short attack = hard, sudden onset. Long attack = soft, sneaking in (typical for pads).</li>
<li><strong>Decay</strong> — How quickly the volume falls from the peak down to the sustain level.</li>
<li><strong>Sustain</strong> — The level the volume holds at <em>while</em> the key is pressed. (Note: sustain is a level, not a time!)</li>
<li><strong>Release</strong> — How long it takes for the volume to reach zero <em>after</em> you release the key.</li>
</ul>`
      },
      {
        type: 'adsr',
        config: {
          attack: 0.01, decay: 0.3, sustainLevel: 0.6, release: 0.5,
          interactive: true, playable: true, waveType: 'sawtooth',
          presets: [
            { name: 'PLUCK', attack: 0.001, decay: 0.12, sustainLevel: 0.0, release: 0.1 },
            { name: 'PAD',   attack: 0.8,  decay: 0.2,  sustainLevel: 0.8, release: 1.8 },
            { name: 'ORGAN', attack: 0.005, decay: 0.0, sustainLevel: 1.0, release: 0.01 },
            { name: 'STRING', attack: 0.35, decay: 0.15, sustainLevel: 0.75, release: 0.9 }
          ]
        }
      },
      {
        type: 'tip',
        label: 'EXPERIMENT',
        html: `<p>Drag the handles on the ADSR curves above. Then click <strong>▶ PLAY NOTE</strong> and listen to how the character changes. Try the presets: PLUCK gives a percussive snap, PAD sneaks in softly, ORGAN is instant on/off.</p>`
      },
      {
        type: 'text',
        html: `<h3>ADSR on the MiniFreak</h3>
<p>The MiniFreak has <strong>two envelopes</strong>:<br>
<strong>Env1</strong> (Mod Envelope) — Freely usable modulator. Assign it to filter cutoff, pitch, oscillator wave, etc.<br>
<strong>Env2</strong> (Amp Envelope) — Controls volume (the amplifier/VCA) by default.</p>
<p>Adjust the A, D, S, R knobs directly on the front panel. The screen shows current values.</p>`
      },
      {
        type: 'text',
        html: `<h3>Synthwave ADSR recipes</h3>
<ul>
<li><strong>Hard lead</strong>: A=1ms, D=100ms, S=70%, R=100ms — attacks quickly, sustains well</li>
<li><strong>Soft pad</strong>: A=800ms, D=200ms, S=80%, R=2s — sneaks in and fades out</li>
<li><strong>Pluck/Bass</strong>: A=1ms, D=150ms, S=0%, R=80ms — percussive, no sustain</li>
<li><strong>Strings</strong>: A=350ms, D=150ms, S=75%, R=1s — classic string character</li>
</ul>`
      },
      { type: 'quiz' }
    ],
    quiz: {
      questions: [
        {
          text: 'What does the Attack parameter in an ADSR envelope control?',
          options: ['How long the note sustains', 'How long it takes to go from 0 to maximum volume when a key is pressed', 'How quickly the volume fades after release', 'The volume level during the sustain phase'],
          correctIndex: 1,
          explanation: 'Attack is the time it takes for the volume (or modulation signal) to rise from zero to maximum, right when you press the key.'
        },
        {
          text: 'Sustain is a ___?',
          options: ['Time — how long the note plays', 'Level — the volume while the key is held down', 'Frequency — how high the pitch is', 'Curve — how fast the volume changes'],
          correctIndex: 1,
          explanation: 'Sustain is unique among ADSR parameters — it is a LEVEL (0–100%), not a time. It is the volume that is held while the key is pressed.'
        },
        {
          text: 'You want a soft pad sound that sneaks in. Which setting fits best?',
          options: ['A=1ms, D=50ms, S=0%, R=10ms', 'A=800ms, D=200ms, S=80%, R=2s', 'A=1ms, D=1ms, S=100%, R=1ms', 'A=2s, D=2s, S=0%, R=3s'],
          correctIndex: 1,
          explanation: 'Long attack (800ms) makes the sound sneak in softly. High sustain (80%) keeps it going. Long release (2s) lets it fade out beautifully.'
        },
        {
          text: 'What happens if you set Release to 0ms?',
          options: ['The note fades out gradually', 'The note stops abruptly the instant you release the key', 'The synth crashes', 'The note plays forever'],
          correctIndex: 1,
          explanation: 'Release = 0 means the volume jumps immediately to zero when the key is released — no tail at all, the note cuts off abruptly.'
        }
      ],
      passingScore: 3
    }
  },

  10: {
    id: 10, moduleId: 4,
    title: 'LFO: Modulate Your Sound',
    subtitle: 'Vibrato, tremolo and filter wobble',
    tags: ['Sound Design', 'LFO', 'Modulation'],
    estimatedMinutes: 10,
    blocks: [
      {
        type: 'text',
        html: `<p>LFO stands for <strong>Low Frequency Oscillator</strong> — an oscillator that swings <em>slowly</em>, below audible frequencies (below 20 Hz). An LFO generates no tone — instead it creates a <strong>control signal</strong> that affects (modulates) other parameters.</p>
<p>The LFO is what gives you vibrato, tremolo, filter wobble and rhythmic pulsations.</p>`
      },
      {
        type: 'tip',
        label: 'MODULATION',
        html: `<p>Modulation = letting one signal (LFO, envelope, etc.) automatically control another parameter (pitch, volume, cutoff, etc.) over time. It's what makes a static sound <em>come alive</em>.</p>`
      },
      {
        type: 'text',
        html: `<h3>The LFO waveform determines the movement</h3>
<ul>
<li><strong>Sine LFO</strong> → Smooth, continuous oscillation. Perfect for vibrato.</li>
<li><strong>Square LFO</strong> → Jumps between two states. Perfect for tremolo pulse or pitch jumps.</li>
<li><strong>Sawtooth LFO</strong> → Ramps up gradually. Creates a rhythmic ramp pattern.</li>
<li><strong>S&H (Sample & Hold)</strong> → Jumps randomly. Classic retro-synth robot sounds.</li>
</ul>`
      },
      {
        type: 'text',
        html: `<h3>Rate and Amount</h3>
<p><strong>Rate</strong> (speed) — How fast the LFO oscillates. Low rate (0.1–0.5 Hz) = slow swell. High rate (5–15 Hz) = fast vibrato.</p>
<p><strong>Amount/Depth</strong> — How <em>much</em> the LFO affects the destination parameter. Zero = no effect. Max = extreme effect.</p>`
      },
      {
        type: 'text',
        html: `<h3>LFO on the MiniFreak</h3>
<p>The MiniFreak has <strong>2 LFOs</strong> with their own RATE, WAVE and AMOUNT knobs. The destination is assigned via the <strong>Mod Matrix</strong> (a small matrix on the panel or in the menu) — you choose the SOURCE (e.g. LFO1) and DESTINATION (e.g. OSC1 Pitch) and set the modulation depth.</p>
<p>Quickest way to test: direct LFO1 to OSC1 Pitch (vibrato) or to Filter Cutoff (filter wobble).</p>`
      },
      {
        type: 'tip',
        label: 'SYNTHWAVE LFO RECIPES',
        html: `<p><strong>Vibrato</strong>: LFO Sine → OSC Pitch, Rate ~5Hz, Amount small (2–5 cents). Activate only at the end of notes (Trigger: Note-off or with aftertouch).<br>
<strong>Filter wobble</strong>: LFO Sine/Triangle → Filter Cutoff, Rate ~0.3–0.8Hz, Amount medium. Gives a lively, breathing sound.<br>
<strong>Auto-tremolo</strong>: LFO Square → Amp Volume, Rate synced to BPM. Creates a rhythmic pulsation.</p>`
      },
      { type: 'quiz' }
    ],
    quiz: {
      questions: [
        {
          text: 'What is an LFO?',
          options: ['An oscillator that plays audible tones', 'A low-frequency oscillator that creates control signals for modulation', 'A type of filter', 'A reverb effect'],
          correctIndex: 1,
          explanation: 'LFO (Low Frequency Oscillator) oscillates below audible frequencies and generates control signals that can modulate other parameters such as pitch, volume and filter.'
        },
        {
          text: 'Which LFO shape gives a classic vibrato?',
          options: ['Square', 'S&H (Sample & Hold)', 'Sine', 'Sawtooth'],
          correctIndex: 2,
          explanation: 'The sine wave gives a smooth, continuous oscillation — perfect for vibrato (gentle pitch modulation).'
        },
        {
          text: 'What does the LFO Rate parameter control?',
          options: ['How strong the effect is', 'How fast the LFO oscillates', 'Which parameter the LFO modulates', 'The waveform of the LFO'],
          correctIndex: 1,
          explanation: 'Rate controls the speed of the LFO\'s oscillation — low rate = slow, gentle movement; high rate = fast vibration or tremolo.'
        },
        {
          text: 'You want to create a filter wobble that makes a pad sound alive. Which destination do you choose in the Mod Matrix?',
          options: ['OSC1 Wave', 'Filter Cutoff', 'Reverb Mix', 'ADSR Attack'],
          correctIndex: 1,
          explanation: 'LFO → Filter Cutoff creates a swelling opening and closing of the filter — the "breathing" filter wobble that is extremely common in synthwave pads.'
        }
      ],
      passingScore: 3
    }
  },

  11: {
    id: 11, moduleId: 4,
    title: 'Effects: Reverb, Delay & Chorus',
    subtitle: 'Place your sound in time and space',
    tags: ['Sound Design', 'Effects'],
    estimatedMinutes: 12,
    blocks: [
      {
        type: 'text',
        html: `<p>Effects are <strong>the final stage</strong> of the signal chain — they take a dry, synthetic sound and place it in a room, an echo or a sonic landscape. In synthwave, effects are <em>extremely</em> important. The genre is largely defined by its characteristically reverb-heavy, echo-drenched sounds.</p>`
      },
      {
        type: 'text',
        html: `<h3>Reverb — Room feel</h3>
<p>Reverb simulates how sound bounces around a room and creates a series of reflections. Shorter reverb = small room (bathroom, cellar). Longer reverb = large hall, cathedral, outer space.</p>
<p><strong>Synthwave reverb</strong>: Use long reverb time (2–6 seconds), high <em>wet mix</em> (50–80%). This gives the characteristic "80s big hall" feel.</p>
<p>On the MiniFreak: <strong>REVERB Size</strong> controls the size/length. <strong>REVERB Mix</strong> balances dry vs. reverberated sound.</p>`
      },
      {
        type: 'text',
        html: `<h3>Delay — Echoes in time</h3>
<p>Delay is an echo effect — it plays back copies of the signal after a set time. <em>Ping-pong delay</em> bounces the echoes back and forth between left and right channels.</p>
<p><strong>Synthwave delay</strong>: Sync the delay time to the track's BPM (e.g. 1/8 or dotted 1/8 for the classic U2/synthwave echo). Set feedback to about 30–50% to get 3–5 echoes that fade out.</p>
<p>On the MiniFreak: <strong>DELAY Time</strong> and <strong>DELAY Fdbk</strong> (feedback). BPM-sync mode makes echoes follow the track tempo automatically.</p>`
      },
      {
        type: 'text',
        html: `<h3>Chorus — Thickness and spaciousness</h3>
<p>Chorus creates copies of the signal with slight detuning and time delay, giving a <em>swelling, "floaty" character</em>. It's like hearing a choir sing the same melody — they're all slightly out of time, but it sounds warmer and thicker.</p>
<p><strong>Synthwave chorus</strong>: Light chorus on leads and pads (Rate ~0.3 Hz, Depth ~30–50%) gives a wider stereo field without destroying the attack.</p>
<p>MiniFreak: the MODULATION block can run as Chorus, Flanger or Phaser — choose Chorus for synthwave.</p>`
      },
      {
        type: 'tip',
        label: 'EFFECT ORDER ON MINIFREAK',
        html: `<p>The MiniFreak runs effects in parallel, not serial. This means Chorus, Delay and Reverb all process the signal "side by side" and are then mixed together. Play with all three enabled for the complete synthwave sound.</p>`
      },
      {
        type: 'text',
        html: `<h3>Golden ratio for synthwave effects</h3>
<ul>
<li>Reverb Size: 70–80%, Mix: 40–60%</li>
<li>Delay Time: 1/8 synced, Feedback: 30–40%, Mix: 20–30%</li>
<li>Chorus Rate: 0.3 Hz, Depth: 40–50%</li>
</ul>
<p>Combine these three and you have the genre's classic "space" sound in seconds.</p>`
      },
      { type: 'quiz' }
    ],
    quiz: {
      questions: [
        {
          text: 'What does a reverb effect do?',
          options: ['Creates a rhythmic echo', 'Simulates how sound bounces in a room, giving a sense of space', 'Thickens the sound with detuned copies', 'Adds distortion'],
          correctIndex: 1,
          explanation: 'Reverb simulates the acoustics of a room — reflections and reverberation. Long reverb time gives the feeling of a large hall or cathedral space.'
        },
        {
          text: 'Delay synced to BPM with a 1/8 note and 40% feedback gives?',
          options: ['A long, drawn-out sense of space', 'Rhythmic echoes that follow the track\'s tempo', 'A wide stereo image', 'Vibrato'],
          correctIndex: 1,
          explanation: 'BPM-synced delay with a 1/8 note creates echoes precisely on the beats, producing a rhythmic, pulsating echo pattern typical of synthwave.'
        },
        {
          text: 'Why does chorus give a "thicker" sound?',
          options: ['It adds bass frequencies', 'It creates detuned and slightly delayed copies of the signal', 'It compresses the signal', 'It adds overtones with distortion'],
          correctIndex: 1,
          explanation: 'Chorus creates slightly detuned and time-delayed copies of the signal. The combination makes the signal sound as if several instruments are playing together — thicker and wider.'
        },
        {
          text: 'Which effect recipe gives the classic synthwave feel?',
          options: ['No reverb, no delay, no chorus', 'Long reverb, BPM-synced delay, light chorus', 'Distortion only', 'Shorter reverb and no delay'],
          correctIndex: 1,
          explanation: 'Synthwave is defined by long reverb (big hall feel), BPM-synced delay (rhythmic echoes) and light chorus (thickness). All three together give the genre\'s characteristic "space" sound.'
        }
      ],
      passingScore: 3
    }
  },

  // ════════════════════════════════════════════════════════════
  // MODULE 5 — Creating Synthwave
  // ════════════════════════════════════════════════════════════

  12: {
    id: 12, moduleId: 5,
    title: 'Lead Sounds',
    subtitle: 'The sharp, melodic heart of a synthwave track',
    tags: ['Sound Design', 'Lead', 'Synthwave'],
    estimatedMinutes: 12,
    blocks: [
      {
        type: 'text',
        html: `<p>The lead synth is the sound that plays <strong>the melody</strong> — what the listener sings along to. It needs to be distinct, sharp and have enough character to stand out in the mix. At the same time it shouldn't be so aggressive that it wears thin quickly.</p>`
      },
      {
        type: 'tip',
        label: 'GOAL',
        html: `<p>A great synthwave lead: cutting but not irritating. Energetic but with a touch of nostalgic sadness. Think Kavinsky's "Nightcall" or M83's "Midnight City".</p>`
      },
      {
        type: 'text',
        html: `<h3>Recipe: Classic Synthwave Lead</h3>
<ol>
<li><strong>Oscillators</strong>: OSC A = SAW, OSC B = SAW, detune B ~5–10 cents. Volume 50/50.</li>
<li><strong>Filter</strong>: LP, Cutoff ~65–75%, Resonance 20–35%. Env1 Amount positive (~30%) so the filter opens on attack.</li>
<li><strong>Env2 (Amp)</strong>: A=5ms, D=100ms, S=80%, R=200ms.</li>
<li><strong>Env1 (Mod→Filter)</strong>: A=3ms, D=200ms, S=40%, R=150ms.</li>
<li><strong>Reverb</strong>: Size 70%, Mix 35%.</li>
<li><strong>Delay</strong>: 1/8-note sync, Fdbk 35%, Mix 20%.</li>
</ol>`
      },
      {
        type: 'text',
        html: `<h3>Hear the difference</h3>
<p>Try these sounds and hear how the envelope and filter change the character:</p>
<div class="chord-buttons">
<button class="chord-btn" data-notes="[440]" data-wave="sawtooth" data-duration="1">SAW (dry)</button>
<button class="chord-btn" data-notes="[440, 442]" data-wave="sawtooth" data-duration="1">SAW x2 (detuned)</button>
<button class="chord-btn" data-notes="[440, 442, 220, 221]" data-wave="sawtooth" data-duration="1.5">Thick Lead</button>
</div>`
      },
      {
        type: 'text',
        html: `<h3>Legato and portamento</h3>
<p>Synthwave leads often <strong>glide smoothly between notes</strong> — this is called portamento (or glide). On the MiniFreak it's activated with the <strong>GLIDE</strong> knob (time to slide between notes). Play in Mono mode for classic lead playing.</p>
<p>Legato playing (holding the previous note while playing the next) combined with glide gives the signature "sweeping" lead voice.</p>`
      },
      {
        type: 'piano',
        config: {
          defaultWave: 'sawtooth',
          showWaveSelector: true,
          octaves: 2,
          startOctave: 4,
          highlightKeys: ['A4', 'C5', 'D5', 'E5', 'G5'],
          caption: 'Play the A minor pentatonic (highlighted keys) with the SAW waveform — this is your lead!'
        }
      },
      { type: 'quiz' }
    ],
    quiz: {
      questions: [
        {
          text: 'Which trick gives a synthwave lead more "thickness"?',
          options: ['Increase reverb to 100%', 'Running two detuned SAW oscillators against each other', 'Set attack to maximum', 'Close the filter completely'],
          correctIndex: 1,
          explanation: 'Two SAW oscillators detuned against each other (5–15 cents) create a chorus-like swell that makes the lead thicker and more spatial.'
        },
        {
          text: 'What is portamento/glide?',
          options: ['An effect that adds reverb', 'A gliding pitch movement between notes', 'An arpeggiator function', 'A type of filter'],
          correctIndex: 1,
          explanation: 'Portamento (glide) makes the synth slide smoothly in pitch from one note to the next, rather than jumping directly. It gives leads a smooth, sweeping character.'
        },
        {
          text: 'How should Env1 (the Mod envelope) be set to give the lead a fast "opening"?',
          options: ['Long attack, short decay', 'Short attack, positive ENV→FILT amount', 'Sustain = 0%', 'Release at maximum'],
          correctIndex: 1,
          explanation: 'Short attack on Env1 with positive ENV→FILT amount makes the filter open up quickly on each keystroke, giving the lead a characteristic brightness and openness.'
        },
        {
          text: 'Where in the melody does a synthwave lead typically play?',
          options: ['In the bass, below 200 Hz', 'In the treble, octaves 4–6', 'Everywhere simultaneously', 'Only in the intro section'],
          correctIndex: 1,
          explanation: 'Leads are played in the treble register (octaves 4–6, approx. 262–2000 Hz) so the melody is heard clearly above the bass, drums and pads.'
        }
      ],
      passingScore: 3
    }
  },

  13: {
    id: 13, moduleId: 5,
    title: 'Pad Sounds',
    subtitle: 'Soft, atmospheric backgrounds that create mood',
    tags: ['Sound Design', 'Pad', 'Synthwave'],
    estimatedMinutes: 12,
    blocks: [
      {
        type: 'text',
        html: `<p>Pads are background sounds — <strong>textures and harmony</strong> that fill out the room and keep the chord progression alive. They should be soft, ethereal and almost invisible — but without them the track feels empty and cold.</p>
<p>Pads are yin to the lead's yang: the lead tells the melody, the pad holds the mood.</p>`
      },
      {
        type: 'text',
        html: `<h3>Recipe: Classic Synthwave Pad</h3>
<ol>
<li><strong>Oscillators</strong>: OSC A = SAW, OSC B = SAW but OCT+1 (one octave up). Detune B ~12 cents. OSC A vol 60%, B vol 40%.</li>
<li><strong>Filter</strong>: LP, Cutoff 45–55%, Resonance 10–15%. No envelope modulation.</li>
<li><strong>Env2 (Amp)</strong>: A=600–900ms, D=200ms, S=75%, R=1.5–2s.</li>
<li><strong>LFO1 → Filter Cutoff</strong>: Sine, Rate 0.3Hz, Amount 15%. Gives a gentle "breathing" effect.</li>
<li><strong>Reverb</strong>: Size 80%, Mix 55%.</li>
<li><strong>Chorus</strong>: Rate 0.4Hz, Depth 45%.</li>
</ol>`
      },
      {
        type: 'adsr',
        config: {
          attack: 0.8, decay: 0.2, sustainLevel: 0.75, release: 1.8,
          interactive: true, playable: true, waveType: 'sawtooth',
          presets: [
            { name: 'SOFT PAD', attack: 0.9, decay: 0.2, sustainLevel: 0.8, release: 2.0 },
            { name: 'HARD PAD', attack: 0.1, decay: 0.15, sustainLevel: 0.7, release: 0.6 },
            { name: 'DRONE',    attack: 2.0, decay: 0.5, sustainLevel: 0.95, release: 3.0 }
          ]
        }
      },
      {
        type: 'text',
        html: `<h3>Playing pad chords</h3>
<p>A pad is normally played with open, widely voiced chords — spread the notes across several octaves. Try playing the Am progression as pads:</p>
<div class="chord-buttons">
<button class="chord-btn" data-notes="[110, 165, 220, 261.63]" data-wave="sawtooth">Am (wide)</button>
<button class="chord-btn" data-notes="[87.3, 130.8, 174.6, 220]" data-wave="sawtooth">F (wide)</button>
<button class="chord-btn" data-notes="[130.8, 196, 261.6, 329.6]" data-wave="sawtooth">C (wide)</button>
<button class="chord-btn" data-notes="[98, 147, 196, 246.9]" data-wave="sawtooth">G (wide)</button>
</div>`
      },
      {
        type: 'tip',
        label: 'POLYPHONIC PLAYING STYLE',
        html: `<p>Put the MiniFreak in <strong>Poly mode</strong> (Paraphonic or Poly if available) to play pads. Pads should have long attack and release — press the next chord <em>before</em> releasing the previous one so they "melt" into each other.</p>`
      },
      {
        type: 'piano',
        config: {
          defaultWave: 'sawtooth',
          showWaveSelector: false,
          octaves: 3,
          startOctave: 3,
          highlightKeys: ['A3', 'C4', 'E4', 'A4', 'C5', 'E5'],
          caption: 'Try the Am chord widely voiced: A3+C4+E4+A4+C5+E5 — that is the pad sound!'
        }
      },
      { type: 'quiz' }
    ],
    quiz: {
      questions: [
        {
          text: 'What is a pad\'s role in a synthwave track?',
          options: ['Play the melody', 'Hold the bass line', 'Provide harmonic background and mood', 'Replace the drums'],
          correctIndex: 2,
          explanation: 'Pads are harmonic background — they keep the chord progression alive and create the texture and mood of the track, without overshadowing the lead.'
        },
        {
          text: 'Which ADSR recipe fits best for a soft synth pad?',
          options: ['A=1ms, D=50ms, S=0%, R=10ms', 'A=800ms, D=200ms, S=80%, R=2s', 'A=50ms, D=50ms, S=50%, R=50ms', 'A=1ms, D=200ms, S=100%, R=1ms'],
          correctIndex: 1,
          explanation: 'Long attack makes the pad sneak in softly. High sustain keeps it going. Long release lets it fade out naturally. All of this gives the dreamy pad character.'
        },
        {
          text: 'What does "widely voiced" chords mean when playing pads?',
          options: ['Play all notes in the same octave', 'Spread the notes across several octaves', 'Play only the root and the fifth', 'Play the chord with one hand'],
          correctIndex: 1,
          explanation: 'Widely voiced chords spread the notes across 2–3 octaves, giving a more open, spacious sound that is perfect for pad textures.'
        },
        {
          text: 'Why does LFO → Filter Cutoff work well on a pad sound?',
          options: ['It makes the pad sharper', 'It creates a gentle "breathing" to make the pad come alive', 'It adds echo', 'It increases volume'],
          correctIndex: 1,
          explanation: 'A slow LFO (0.2–0.5 Hz) on filter cutoff gives a subtle, swelling opening and closing of the filter that makes the pad "breathe" and feel less static.'
        }
      ],
      passingScore: 3
    }
  },

  14: {
    id: 14, moduleId: 5,
    title: 'Arpeggio & Sequencer',
    subtitle: 'Rhythmic patterns and the MiniFreak\'s built-in sequencer',
    tags: ['Arpeggio', 'Sequencer', 'Rhythm'],
    estimatedMinutes: 12,
    blocks: [
      {
        type: 'text',
        html: `<p>An <strong>arpeggiator</strong> takes a chord and plays its notes one at a time in a pattern. Instead of all three notes of Am sounding simultaneously, they play upward: A – C – E – A – C – E... It is one of synthwave's most characteristic elements.</p>`
      },
      {
        type: 'text',
        html: `<h3>Arpeggio patterns</h3>
<p>The MiniFreak's arpeggiator can play patterns in many ways:</p>
<ul>
<li><strong>UP</strong> — Upward: lowest note to highest</li>
<li><strong>DOWN</strong> — Downward: highest to lowest</li>
<li><strong>UP-DOWN</strong> — Up and then down, back and forth</li>
<li><strong>ORDER</strong> — In the order you pressed the keys</li>
<li><strong>RANDOM</strong> — Random order</li>
</ul>`
      },
      { type: 'arp-demo', config: [
        { name: 'UP', notes: [220, 261.63, 329.63, 440], wave: 'sawtooth', bpm: 120, repeats: 2 },
        { name: 'DOWN', notes: [440, 329.63, 261.63, 220], wave: 'sawtooth', bpm: 120, repeats: 2 },
        { name: 'UP-DOWN', notes: [220, 261.63, 329.63, 440, 329.63, 261.63], wave: 'sawtooth', bpm: 120, repeats: 2 },
        { name: 'RANDOM', notes: [329.63, 220, 440, 261.63, 329.63, 220], wave: 'sawtooth', bpm: 120, repeats: 2 }
      ]},
      {
        type: 'text',
        html: `<h3>Rate and Octave</h3>
<p><strong>Rate</strong> controls how fast the arpeggio plays — sync to BPM for a musical result (1/8, 1/16, etc.).<br>
<strong>Octave Range</strong> determines how many octaves the arpeggio pattern spans. 1 octave = play Am in one octave. 2 octaves = jump up and play Am an octave higher too.</p>`
      },
      {
        type: 'tip',
        label: 'MINIFREAK ARPEGGIATOR',
        html: `<p>Activate the arpeggiator with the <strong>ARP</strong> button. Choose pattern and rate. Then hold down a chord — Am (A+C+E) with Octave Range 2 and 1/16 rate is a classic synthwave arpeggio recipe. Add some reverb and delay and you're done!</p>`
      },
      {
        type: 'text',
        html: `<h3>16-step Sequencer</h3>
<p>The MiniFreak's sequencer lets you record a 16-step melodic loop and loop it. It's more flexible than the arpeggiator — each step can have its own note, velocity and tie to the next step.</p>
<p>Basic workflow:<br>
1. Press the <strong>SEQ</strong> button<br>
2. Select the start step and activate steps with the 16 key buttons on the keyboard<br>
3. Enter notes for each step<br>
4. Press <strong>Play</strong> and listen to the loop</p>`
      },
      {
        type: 'piano',
        config: {
          defaultWave: 'sawtooth',
          showWaveSelector: false,
          octaves: 2,
          startOctave: 4,
          highlightKeys: ['A4', 'C5', 'E5', 'A5'],
          caption: 'Try playing the Am arpeggio manually: A4–C5–E5–A5 repeated, fast and rhythmically'
        }
      },
      { type: 'quiz' }
    ],
    quiz: {
      questions: [
        {
          text: 'What does an arpeggiator do?',
          options: ['Plays a chord\'s notes simultaneously', 'Plays a chord\'s notes one at a time in a pattern', 'Adds reverb to chords', 'Transposes chords up an octave'],
          correctIndex: 1,
          explanation: 'An arpeggiator takes a chord and plays its notes sequentially (one at a time) in a pattern — up, down, up-down, etc. — to create rhythmic melodic patterns.'
        },
        {
          text: 'Which arpeggio pattern plays the notes from lowest to highest?',
          options: ['DOWN', 'UP-DOWN', 'RANDOM', 'UP'],
          correctIndex: 3,
          explanation: 'The UP pattern plays the notes from the bottom up: lowest note first, then upward to the highest.'
        },
        {
          text: 'Why do you sync the arpeggiator\'s rate to the track\'s BPM?',
          options: ['It is mandatory', 'It makes the arpeggio follow the track\'s rhythmic grid and sound musical', 'It does not affect the sound', 'It increases the speed'],
          correctIndex: 1,
          explanation: 'BPM sync makes each arpeggio step fall on an exact beat subdivision (1/8, 1/16, etc.), making the arpeggio sound like part of the music rather than a random pattern.'
        },
        {
          text: 'The difference between an arpeggiator and a sequencer?',
          options: ['They are identical', 'The arpeggiator generates patterns from held chords; the sequencer plays back a pre-programmed melodic loop', 'The sequencer is faster', 'The arpeggiator has more steps'],
          correctIndex: 1,
          explanation: 'The arpeggiator takes a held chord and generates a pattern dynamically. The sequencer lets you record a specific melodic loop with up to 16 steps that then loops.'
        }
      ],
      passingScore: 3
    }
  },

  // ════════════════════════════════════════════════════════════
  // MODULE 6 — Your First Track
  // ════════════════════════════════════════════════════════════

  15: {
    id: 15, moduleId: 6,
    title: 'Song Structure',
    subtitle: 'Intro, verse, chorus — how to build a synthwave track',
    tags: ['Composition', 'Structure'],
    estimatedMinutes: 12,
    blocks: [
      {
        type: 'text',
        html: `<p>A track without structure is just a sound experiment. Structure gives the listener a journey — it creates expectation, climax and resolution. The good news: <strong>synthwave tracks often follow simple, clear structures</strong>.</p>`
      },
      {
        type: 'text',
        html: `<h3>The basic structure</h3>
<p>A classic synthwave track often looks like this:</p>
<ul>
<li><strong>Intro</strong> (8–16 bars) — The pad introduces itself. The filter is closed, opening gradually. Creates anticipation.</li>
<li><strong>Verse A</strong> (16 bars) — The lead presents the theme/melody. Bass and drums are added.</li>
<li><strong>Bridge / Pre-chorus</strong> (8 bars) — Energy builds up. Maybe an arpeggio figure.</li>
<li><strong>Chorus</strong> (16 bars) — Everything explodes: full mix, lead on top, pads underneath.</li>
<li><strong>Verse B</strong> (16 bars) — The melody returns with variation.</li>
<li><strong>Chorus × 2</strong> — Stronger, perhaps an extra octave up.</li>
<li><strong>Outro</strong> (8–16 bars) — Strips down gradually, the filter closes.</li>
</ul>`
      },
      {
        type: 'tip',
        label: 'TENSION & RESOLUTION',
        html: `<p>Tension is built by: denser arpeggio, higher frequencies, open filter, more elements.<br>
Resolution happens in: the chorus, pauses, a simple pad chord without lead.<br>
Alternating between tension and resolution is <strong>the whole secret</strong> behind a track that feels engaging.</p>`
      },
      {
        type: 'text',
        html: `<h3>Bars and BPM</h3>
<p>Synthwave typically runs at <strong>80–120 BPM</strong> (beats per minute). 100 BPM is a good starting point. A bar is 4 beats. 8 bars = a typical phrase. 16 bars = a typical section.</p>
<p>Count: Intro 16 bars × 4 beats × (60/100 sec/beat) ≈ 38 seconds. The whole track with the structure above ≈ 3–4 minutes — classic pop length.</p>`
      },
      {
        type: 'text',
        html: `<h3>Layers — Add instruments gradually</h3>
<p>Synthwave tracks are often built up in layers. Start sparsely and add elements one by one:</p>
<ol>
<li>Pad (the chord progression)</li>
<li>Bass (simple root note on the beats)</li>
<li>Drums (kick + snare)</li>
<li>Lead (the melody)</li>
<li>Arpeggio (rhythmic texture)</li>
<li>Counter-melody (response to the lead)</li>
</ol>`
      },
      {
        type: 'tip',
        label: 'DAW OR HARDWARE?',
        html: `<p>The MiniFreak can play its layers with the built-in sequencer and arpeggiator, but for a complete track you'll likely need a DAW (Digital Audio Workstation) like Ableton Live, Logic Pro or FL Studio. The MiniFreak connects via MIDI or USB and records exactly as you press the keys.</p>`
      },
      { type: 'quiz' }
    ],
    quiz: {
      questions: [
        {
          text: 'Which BPM is typical for synthwave?',
          options: ['40–60 BPM', '80–120 BPM', '140–180 BPM', '200–240 BPM'],
          correctIndex: 1,
          explanation: 'Synthwave typically sits at 80–120 BPM — energetic enough for dancing but not too fast for the dreamy, floating feel. 100 BPM is a common starting point.'
        },
        {
          text: 'How many beats are in a bar of 4/4 time (the standard)?',
          options: ['2', '3', '4', '8'],
          correctIndex: 2,
          explanation: '4/4 time (the most common time signature in pop and electronic music) has 4 beats per bar. 4/4 = numerator 4 beats, denominator 4th note type (quarter note).'
        },
        {
          text: 'In which section of a synthwave track does everything usually "explode"?',
          options: ['Intro', 'Verse A', 'Chorus', 'Outro'],
          correctIndex: 2,
          explanation: 'The chorus is the track\'s climax — everything is there: lead, pad, bass, drums, arpeggio. It\'s the moment the listener has been waiting for since the intro.'
        },
        {
          text: 'What is "layering" in track production?',
          options: ['Adding all instruments right from the start', 'Gradually adding instruments and elements to build up energy', 'Removing instruments during the chorus', 'Playing all instruments in the same frequency register'],
          correctIndex: 1,
          explanation: 'Layering = adding instruments and elements gradually through the track, creating a sense of build and energy — from a sparse intro to a full chorus.'
        }
      ],
      passingScore: 3
    }
  },

  16: {
    id: 16, moduleId: 6,
    title: 'Putting It All Together',
    subtitle: 'Your first production — a complete mini recipe',
    tags: ['Composition', 'Production', 'Final Project'],
    estimatedMinutes: 15,
    blocks: [
      {
        type: 'text',
        html: `<p>You've learned everything you need. Now it's time to <strong>create your first track</strong>. We'll make a simple 2-minute synthwave sketch with three elements: pad, lead and arpeggio. All in A minor, with the progression Am–F–C–G.</p>`
      },
      {
        type: 'tip',
        label: 'NO PERFECTION NEEDED',
        html: `<p>Your first track doesn't need to be perfect — it just needs to <em>exist</em>. Every producer you admire has a laughably terrible first track that they never show anyone. Focus: have fun and finish something.</p>`
      },
      {
        type: 'text',
        html: `<h3>Step 1: The Pad — The Foundation</h3>
<p>Start with the progression. Create a soft pad sound (see Lesson 13). Programme the Am–F–C–G progression with 4 bars per chord = a 16-bar loop at 100 BPM (~38 seconds per repeat).</p>
<p>Recipe: SAW × 2, LP filter 50%, Cutoff closed in intro (20%), opens gradually. Attack 800ms, Release 2s.</p>`
      },
      {
        type: 'text',
        html: `<h3>Step 2: The Lead — The Melody</h3>
<p>Play a simple melody using A minor pentatonic over your pad. Simple is best — 4–8 notes that repeat with variations. Example of a simple melody:</p>`
      },
      {
        type: 'piano',
        config: {
          defaultWave: 'sawtooth',
          showWaveSelector: false,
          octaves: 2,
          startOctave: 4,
          highlightKeys: ['A4', 'G4', 'E4', 'D4', 'C5', 'A4', 'G4', 'E4'],
          caption: 'A simple 8-note melody in A pentatonic minor — play it from left to right and listen!'
        }
      },
      {
        type: 'text',
        html: `<p>The melody: A4 – G4 – E4 – D4 – C5 – A4 – G4 – E4 (repeat). Simple, but it works. Add detuned OSC B, Reverb 40%, Delay 1/8 sync.</p>
<h3>Step 3: The Arpeggio — The Movement</h3>
<p>Activate the arpeggiator (ARP button on the MiniFreak). Hold the Am chord (A+C+E), set Rate to 1/8-note, Octave Range 2, Pattern: UP. Now you have the classic moving arpeggio texture.</p>`
      },
      {
        type: 'text',
        html: `<h3>Step 4: Build the Structure</h3>
<ol>
<li><strong>Intro (0:00–0:30)</strong>: Pad only, filter closed and opening gradually.</li>
<li><strong>Verse (0:30–1:00)</strong>: Add the lead. Play the melody.</li>
<li><strong>Build (1:00–1:15)</strong>: Add the arpeggio. Energy rises.</li>
<li><strong>Climax (1:15–1:45)</strong>: Everything together. Maybe an extra pad layer an octave up.</li>
<li><strong>Outro (1:45–2:00)</strong>: Remove the lead, just pad and arpeggio, then pad only.</li>
</ol>`
      },
      {
        type: 'tip',
        label: 'NEXT STEPS',
        html: `<p>When you're done with the basic sketch: add a simple kick drum (808 kick on every 4/4 beat), experiment with filter sweeps in transitions, and try transposing the melody an octave up in the climax. You are a synthwave producer!</p>`
      },
      {
        type: 'text',
        html: `<h3>Congratulations! You're done!</h3>
<p>You've completed the entire Synth School and learned:</p>
<ul>
<li>How sound and waveforms work</li>
<li>Subtractive synthesis and the signal chain</li>
<li>Music theory: notes, scales and chord progressions</li>
<li>All sections of the Arturia MiniFreak</li>
<li>Oscillators, filter, ADSR, LFO and effects</li>
<li>How to create leads, pads and arpeggios in synthwave style</li>
<li>Basic song structure and production technique</li>
</ul>
<p>The only thing left: <strong>open your MiniFreak and start playing.</strong></p>`
      },
      { type: 'quiz' }
    ],
    quiz: {
      questions: [
        {
          text: 'In which order should you typically build up the elements in a synthwave sketch?',
          options: ['Lead → Pad → Arpeggio → Bass', 'Pad (foundation) → Lead (melody) → Arpeggio (movement)', 'Drums → Bass → Lead → Pad', 'Arpeggio → Lead → Pad → Effects'],
          correctIndex: 1,
          explanation: 'Start with the pad as the harmonic foundation, then add the lead melody, then the arpeggio for movement. Bass and drums can be added last so they don\'t dominate the design process.'
        },
        {
          text: 'Am–F–C–G is a progression in?',
          options: ['C major', 'D minor', 'A minor', 'E minor'],
          correctIndex: 2,
          explanation: 'Am–F–C–G is the progression i–VI–III–VII in A minor. Am is the tonic (the root chord) and confirms the key of A minor.'
        },
        {
          text: 'Which of these statements about synthwave production is true?',
          options: ['More complex melodies are always better', 'Simple and repetitive melody + great sound design = usually works', 'You need long experience before you can make a full track', 'Reverb and delay should be avoided'],
          correctIndex: 1,
          explanation: 'Synthwave is about feel and sound design rather than melodic complexity. A simple, catchy phrase with the right sounds, effects and progression always beats a complex melody with poor sound.'
        },
        {
          text: 'What is the most important advice for your first track?',
          options: ['It must be perfect before you share it', 'Spend more than a month on each parameter', 'Finish it — a completed project is always better than an unfinished one', 'Copy an existing piece of music exactly'],
          correctIndex: 2,
          explanation: 'The most important habit in music production: finish projects. A complete, imperfect track teaches you more and is more rewarding than ten half-finished ones. "Done is better than perfect."'
        }
      ],
      passingScore: 3
    }
  },

}; // end LESSONS_EN
