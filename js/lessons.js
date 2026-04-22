/* ============================================================
   lessons.js — All lesson data (Swedish)
   ============================================================ */

window.MODULES = [
  { id: 1, title: 'Ljud & Syntar',        subtitle: 'Förstå vad du hör',             lessonIds: [1, 2],       color: '#bf5fff' },
  { id: 2, title: 'Musikteori',            subtitle: 'Noterna bakom vibbet',           lessonIds: [3, 4, 5],    color: '#00fff7' },
  { id: 3, title: 'Arturia MiniFreak',     subtitle: 'Lär känna ditt instrument',      lessonIds: [6, 7, 8],    color: '#ff2d78' },
  { id: 4, title: 'Forma Ditt Ljud',       subtitle: 'ADSR, LFO och effekter',         lessonIds: [9, 10, 11],  color: '#00fff7' },
  { id: 5, title: 'Skapa Synthwave',       subtitle: 'Leads, pads och arpeggios',      lessonIds: [12, 13, 14], color: '#bf5fff' },
  { id: 6, title: 'Din Första Låt',        subtitle: 'Sätt ihop allt du lärt dig',     lessonIds: [15, 16],     color: '#ff2d78' },
];

window.LESSONS = {

  // ════════════════════════════════════════════════════════════
  // MODUL 1 — Ljud & Syntar
  // ════════════════════════════════════════════════════════════

  1: {
    id: 1, moduleId: 1,
    title: 'Vad är Ljud?',
    subtitle: 'Frekvenser, vågformer och varför dina öron funkar',
    tags: ['Grunder', 'Fysik'],
    estimatedMinutes: 8,
    blocks: [
      {
        type: 'text',
        html: `<p>Allt ljud är <strong>vibration</strong>. När en gitarrsträng slås, en bas pumpar eller en synth spelar en not — sätts luftmolekyler i rörelse. De knuffar varandra framåt som dominobrickor, skapar en våg av tryckförändringar som slutligen träffar ditt trumhinna och tolkas som ljud av hjärnan.</p>
<p>Två egenskaper definierar en ton: <strong>frekvens</strong> (hur högt eller lågt det låter) och <strong>amplitud</strong> (hur starkt det är).</p>`
      },
      {
        type: 'tip',
        label: 'NYCKELBEGREPP',
        html: `<p>Frekvens mäts i <strong>Hz (hertz)</strong> — svängningar per sekund. Noten <strong>A4</strong> (stämningsnoten på ett piano) vibrerar exakt <strong>440 Hz</strong>. Varje oktav upp fördubblar frekvensen: A5 = 880 Hz.</p>`
      },
      {
        type: 'text',
        html: `<h3>De fyra grundvågformerna</h3>
<p>En synth skapar ljud med <strong>oscillatorer</strong> som genererar vågformer. Det finns fyra klassiska former — klicka på dem för att höra hur de låter:</p>`
      },
      { type: 'waveform', caption: 'Klicka på varje vågform för att höra skillnaden', config: { waveforms: ['sine', 'square', 'sawtooth', 'triangle'], interactive: true, playable: true } },
      {
        type: 'text',
        html: `<ul>
<li><strong>Sine (sinus)</strong> — Rent, mjukt, inga övertoner. Tänk visselpipa.</li>
<li><strong>Square (fyrkant)</strong> — Ihålig, hollow-känsla. Klassisk chiptune-ljud.</li>
<li><strong>Sawtooth (sågtand)</strong> — Skarp, buzzig, rik på övertoner. <em>Synthwavens ryggrad</em>.</li>
<li><strong>Triangle</strong> — Mildare än fyrkant, men mjukare än sågtand.</li>
</ul>`
      },
      {
        type: 'tip',
        label: 'SYNTHWAVE-TIPS',
        html: `<p>Sågtandsvågen är den absolut vanligaste vågformen i synthwave. Den skarpa klangen klär sig fantastiskt i reverb och delay — det är den som ger stilen sin karaktäristiska "retro rymden"-känsla.</p>`
      },
      {
        type: 'piano',
        config: { defaultWave: 'sawtooth', showWaveSelector: true, octaves: 2, startOctave: 4, highlightKeys: [], caption: 'Spela några noter — testa att byta vågform och hör skillnaden' }
      },
      { type: 'quiz' }
    ],
    quiz: {
      questions: [
        {
          text: 'Vad mäter Hz (hertz)?',
          options: ['Volym — hur starkt ljudet är', 'Frekvens — svängningar per sekund', 'Längden på en not', 'Hur många övertoner ett ljud har'],
          correctIndex: 1,
          explanation: 'Hz mäter frekvens: antalet kompletta svängningar per sekund. 440 Hz = 440 cykler per sekund, vilket vi hör som noten A4.'
        },
        {
          text: 'Vilken vågform låter renast och mjukast, utan övertoner?',
          options: ['Sawtooth', 'Square', 'Sine', 'Triangle'],
          correctIndex: 2,
          explanation: 'Sinusvågen innehåller bara grundfrekvensen — inga övertoner alls — och ger det renaste, mjukaste ljudet.'
        },
        {
          text: 'Noten A4 är 440 Hz. Vad är A5 (en oktav högre)?',
          options: ['880 Hz', '480 Hz', '220 Hz', '540 Hz'],
          correctIndex: 0,
          explanation: 'Varje oktav fördubblar frekvensen. A5 = 440 × 2 = 880 Hz.'
        },
        {
          text: 'Vilken vågform är vanligast i synthwave-leads?',
          options: ['Sine', 'Triangle', 'Sawtooth', 'Square'],
          correctIndex: 2,
          explanation: 'Sågtandsvågen är rik på övertoner, skarp och "buzzig" — den skär igenom en mix och klär sig perfekt i synthwave-effekter som reverb och delay.'
        }
      ],
      passingScore: 3
    }
  },

  2: {
    id: 2, moduleId: 1,
    title: 'Vad är en Synth?',
    subtitle: 'Subtractive synthesis — steg för steg',
    tags: ['Grunder', 'Synthesis'],
    estimatedMinutes: 10,
    blocks: [
      {
        type: 'text',
        html: `<p>En synthesizer skapar ljud <em>elektroniskt</em>. I stället för att fånga upp ett akustiskt instrument, <strong>bygger synthesen upp ett ljud från grunden</strong> med hjälp av elektroniska kretsar (eller digitala simulationer av sådana).</p>
<p>Den vanligaste typen — och den som MiniFreak bygger på — kallas <strong>subtraktiv synthesis</strong>. Namnet kommer av att man börjar med ett ljud <em>rikt på övertoner</em> och sedan subtraherar (tar bort) delar av det med ett filter.</p>`
      },
      {
        type: 'tip',
        label: 'SIGNALKEDJAN',
        html: `<p>Alla subtractive syntar följer samma grundprincip:<br>
<strong>Oscillator → Filter → Amplifier → Effekter</strong><br>
Varje steg formar ljudet på olika sätt.</p>`
      },
      {
        type: 'text',
        html: `<h3>Oscillatorn (OSC) — Ljud föds</h3>
<p>Oscillatorn genererar grundljudet — en av vågformerna du lärde dig i förra lektionen. Den bestämmer <strong>tonhöjden</strong> (vilken not du spelar) och ger råmaterialet som resten av synthens kretsar sedan bearbetar.</p>
<h3>Filtret — Tonen formas</h3>
<p>Filtret är hjärtat i subtraktiv synthesis. Det <strong>skär bort frekvenser</strong> ur signalen. Det vanligaste är ett lågpassfilter (LP) som släpper igenom låga frekvenser men dämpar höga — resultatet är ett varmare, mörkare ljud. Höj filtrets <em>cutoff-frekvens</em> så öppnar sig mer av övertonsrikedomen. Sänk den för ett mörkare, mer dövat ljud.</p>
<h3>Amplifiern (VCA) — Volymen kontrolleras</h3>
<p>VCA (Voltage-Controlled Amplifier) styr <strong>hur volymen förändras över tid</strong>. Det är här du bestämmer om ett ljud ska smyga in mjukt eller attackera hårt, hålla sig uppe länge eller klinga av snabbt. Vi återkommer till detta i ADSR-lektionen.</p>
<h3>Effekter — Ljud sätts i rum</h3>
<p>Reverb, delay, chorus och andra effekter placerar ditt ljud i ett virtuellt rum och ger det djup och karaktär. Synthwave använder <em>extremt</em> mycket reverb — det är en stor del av stilens DNA.</p>`
      },
      {
        type: 'tip',
        label: 'MINIFREAK-NOTERING',
        html: `<p>Arturia MiniFreak är en <strong>hybrid-synth</strong>: oscillatorerna är digitala (de kan generera massor av olika vågformer och syntestyper), men filtret och VCA är <strong>analoga</strong>. Det ger det bästa av två världar — flexibilitet från den digitala sidan, värme och karaktär från den analoga.</p>`
      },
      {
        type: 'text',
        html: `<h3>Prova det virtuellt</h3>
<p>Även om vi inte kan styra alla parametrar i browsern kan du redan nu höra skillnaden mellan ett öppet och stängt filter genom att jämföra vågformerna nedan. Sinusvågen liknar ett <em>stängt filter</em> (bara grundtonen kvar). Sågtanden liknar ett <em>öppet filter</em> (alla övertoner framme).</p>`
      },
      {
        type: 'waveform',
        caption: '"Öppet filter" = SAW (rika övertoner), "Stängt filter" ≈ SINE (bara grundton)',
        config: { waveforms: ['sine', 'sawtooth'], interactive: true, playable: true }
      },
      { type: 'quiz' }
    ],
    quiz: {
      questions: [
        {
          text: 'Vad kallas den vanligaste typen av synthesis som MiniFreak använder?',
          options: ['Additiv synthesis', 'FM-synthesis', 'Subtraktiv synthesis', 'Granulär synthesis'],
          correctIndex: 2,
          explanation: 'Subtraktiv synthesis börjar med ett tonrikt ljud (oscillator) och tar sedan bort frekvenser med ett filter för att forma klangen.'
        },
        {
          text: 'Vad är signalkedjans ordning i en subtraktiv synth?',
          options: ['Filter → Oscillator → Amplifier', 'Oscillator → Filter → Amplifier', 'Amplifier → Oscillator → Filter', 'Oscillator → Amplifier → Filter'],
          correctIndex: 1,
          explanation: 'Oscillatorn skapar råljudet, filtret formar det, amplifiern styr volymen över tid. OSC → Filter → Amplifier.'
        },
        {
          text: 'Vad händer när du sänker ett lågpassfilters cutoff-frekvens?',
          options: ['Ljudet blir skarpare och ljusare', 'Ljudet försvinner helt', 'Ljudet blir mörkare och varmare', 'Frekvensen på noten ändras'],
          correctIndex: 2,
          explanation: 'Ett lågpassfilter släpper igenom låga frekvenser. Sänker du cutoff filtreras fler höga frekvenser (övertoner) bort — resultatet är ett mörkare, varmare ljud.'
        },
        {
          text: 'MiniFreak är en hybridsynth. Vad är digitalt respektive analogt?',
          options: ['Digitalt filter, analog oscillator', 'Digital oscillator, analogt filter och VCA', 'Allt är digitalt', 'Allt är analogt'],
          correctIndex: 1,
          explanation: 'MiniFreaks oscillatorer är digitala (flexibla, kan göra många syntestyper), medan filtret och VCA är analoga (varmare, mer karaktäristiska).'
        }
      ],
      passingScore: 3
    }
  },

  // ════════════════════════════════════════════════════════════
  // MODUL 2 — Musikteori
  // ════════════════════════════════════════════════════════════

  3: {
    id: 3, moduleId: 2,
    title: 'Noter & Tangentbordet',
    subtitle: 'De 12 noterna och hur oktaver fungerar',
    tags: ['Musikteori', 'Grunder'],
    estimatedMinutes: 10,
    blocks: [
      {
        type: 'text',
        html: `<p>All västerländsk musik — pop, klassisk, synthwave, techno — bygger på samma 12 noter som upprepas i <strong>oktaver</strong>. Dessa 12 noter kallas en <strong>kromatisk skala</strong>.</p>
<p>På ett pianotangentbord representeras de vita tangenterna av naturnoterna: <strong>C D E F G A B</strong>. De svarta tangenterna är <strong>halvtoner</strong> — de heter antingen <em>sharp (♯)</em> vilket betyder ett halvsteg upp, eller <em>flat (♭)</em> ett halvsteg ner.</p>`
      },
      {
        type: 'piano',
        config: {
          defaultWave: 'sine',
          showWaveSelector: false,
          octaves: 2,
          startOctave: 4,
          highlightKeys: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'],
          caption: 'De blåmarkerade tangenterna är C-dur-skalan. Spela dem uppifrån och ned!'
        }
      },
      {
        type: 'text',
        html: `<h3>Halvtoner och heltoner</h3>
<p>Avståndet mellan två grannliggande tangenter (t.ex. C till C# eller E till F) kallas ett <strong>halvsteg</strong>. Två halvsteg = ett <strong>helsteg</strong>.</p>
<p>Observera att E–F och B–C <em>inte</em> har en svart tangent emellan sig — de är redan ett halvsteg ifrån varandra.</p>`
      },
      {
        type: 'tip',
        label: 'MINNESTRICK',
        html: `<p>Titta på de svarta tangenterna: de sitter i grupper om <strong>2 och 3</strong>. C är alltid den vita tangenten <em>precis till vänster</em> om en grupp med 2 svarta tangenter.</p>`
      },
      {
        type: 'text',
        html: `<h3>Oktaver</h3>
<p>När du spelar C3, C4 eller C2 är det samma notnamn — men på olika <strong>oktaver</strong>. Varje oktav upp fördubblar frekvensen. C3 (mittens C) är ca 261 Hz, C4 är 523 Hz, C2 är 131 Hz.</p>
<p>I synthwave spelar man ofta <strong>leads</strong> i octav 4–5, <strong>bass</strong> i octav 1–2, och <strong>pads</strong> sprider sig över flera oktaver.</p>`
      },
      {
        type: 'text',
        html: `<h3>Spela C-dur-skalan</h3>
<p>Prova att spela de markerade tangenterna uppifrån: C–D–E–F–G–A–B–C. Det är C-dur-skalan — den enklaste skalan, bara vita tangenter. Du känner igen melodin — det är den klassiska "do re mi fa sol la si do".</p>`
      },
      { type: 'quiz' }
    ],
    quiz: {
      questions: [
        {
          text: 'Hur många noter finns det i en kromatisk skala?',
          options: ['7', '8', '10', '12'],
          correctIndex: 3,
          explanation: 'Den kromatiska skalan har 12 noter: C, C#, D, D#, E, F, F#, G, G#, A, A#, B — sedan börjar det om på nästa C.'
        },
        {
          text: 'Vilket av dessa par är ett halvsteg (inga svarta tangenter emellan)?',
          options: ['C–D', 'D–E', 'E–F', 'F–G'],
          correctIndex: 2,
          explanation: 'E–F är ett halvsteg — det finns ingen svart tangent (E#/Fb) emellan dem. Samma gäller B–C.'
        },
        {
          text: 'C4 är 261 Hz. Ungefär vad är C5?',
          options: ['521 Hz', '261 Hz', '131 Hz', '392 Hz'],
          correctIndex: 0,
          explanation: 'Varje oktav upp fördubblar frekvensen. C5 ≈ 261 × 2 = 522 Hz (exakt 523,25 Hz).'
        },
        {
          text: 'Var på tangentbordet hittar du note C?',
          options: ['Till höger om 3 svarta tangenter', 'Till vänster om 2 svarta tangenter', 'Mitt emellan 2 svarta tangenter', 'Till vänster om 3 svarta tangenter'],
          correctIndex: 1,
          explanation: 'C är alltid den vita tangenten precis till vänster om en grupp med 2 svarta tangenter.'
        }
      ],
      passingScore: 3
    }
  },

  4: {
    id: 4, moduleId: 2,
    title: 'Skalor',
    subtitle: 'Mollskalan och pentatoniken — synthwaves favoriter',
    tags: ['Musikteori', 'Skalor'],
    estimatedMinutes: 12,
    blocks: [
      {
        type: 'text',
        html: `<p>En <strong>skala</strong> är en samling noter som låter bra tillsammans. Den definierar stämningen i en låt. Durskalan låter glad och stark. <strong>Mollskalan</strong> låter melankolisk, mörk och intensiv — och det är <em>precis</em> det synthwave handlar om.</p>`
      },
      {
        type: 'tip',
        label: 'SYNTHWAVE-FAKTA',
        html: `<p>Nästan all synthwave är skriven i <strong>moll</strong>. Genrens mörka, nostalgidroppande känsla kommer direkt från molltonearten. Tänk Kavinsky, Perturbator, Carpenter Brut — allt i moll.</p>`
      },
      {
        type: 'text',
        html: `<h3>Naturlig mollskala</h3>
<p>Mollskalan bildas med ett specifikt mönster av hel- och halvsteg:<br>
<strong>Helt – Halvt – Helt – Helt – Halvt – Helt – Helt</strong></p>
<p>Börjar vi på A (A-moll — den enklaste mollskalan, bara vita tangenter) får vi:</p>`
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
          caption: 'A-mollskalan — markerade tangenter. Spela dem uppåt och nedåt och känn stämningen!'
        }
      },
      {
        type: 'text',
        html: `<h3>Pentatonisk mollskala</h3>
<p>Pentatoniken är en 5-notersskala (penta = fem) som tar bort de två "gnistigaste" noterna från mollskalan. Resultatet är en skala som <em>nästan alltid låter bra</em> — du kan spela vilka noter som helst ur skalan och det klingar.</p>
<p>A pentatonisk moll: <strong>A – C – D – E – G</strong></p>`
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
<p style="margin-top:.5rem">Dessa 5 noter är din <strong>säkra zon</strong> — allt du improviserar med dem låter troligtvis bra!</p>`
      },
      {
        type: 'piano',
        config: {
          defaultWave: 'sawtooth',
          showWaveSelector: false,
          octaves: 2,
          startOctave: 3,
          highlightKeys: ['A3', 'C4', 'D4', 'E4', 'G4', 'A4', 'C5', 'D5', 'E5', 'G5'],
          caption: 'A pentatonisk moll — improvisera fritt med de markerade tangenterna'
        }
      },
      {
        type: 'tip',
        label: 'ÖVNING',
        html: `<p>Starta din MiniFreak, välj ett SAW-ljud och spela fritt med de markerade pentatoniska noterna. Spela långsamt, skapa en enkel melodi. Rotera upp en oktav med octave-knappen för ett skarpare lead-ljud.</p>`
      },
      { type: 'quiz' }
    ],
    quiz: {
      questions: [
        {
          text: 'Vilken skala är vanligast i synthwave?',
          options: ['Durskalan', 'Mollskalan', 'Blues-skalan', 'Heltonsskalan'],
          correctIndex: 1,
          explanation: 'Mollskalan ger den mörka, melankoliska stämning som är synthwaves kärna. Nästan all synthwave är i moll.'
        },
        {
          text: 'Hur många noter har en pentatonisk skala?',
          options: ['3', '5', '7', '8'],
          correctIndex: 1,
          explanation: 'Penta = fem på latin/grekiska. Pentatoniska skalor har 5 noter, vilket gör dem enklare att improvisera med.'
        },
        {
          text: 'Vilka noter ingår i A pentatonisk moll?',
          options: ['A C D E G', 'A B C D E', 'A C# E F# G', 'A B D E G'],
          correctIndex: 0,
          explanation: 'A pentatonisk moll: A – C – D – E – G. Fem noter som nästan alltid låter bra tillsammans.'
        },
        {
          text: 'Vad är skillnaden mellan naturlig mollskala och pentatonisk mollskala?',
          options: ['Mollskalan har 5 noter, pentatoniken 7', 'Pentatoniken saknar 2 av mollskalans noter', 'De är exakt likadana', 'Pentatoniken använder bara svarta tangenter'],
          correctIndex: 1,
          explanation: 'Pentatonisk moll tar bort 2 av de 7 noterna i naturlig mollskala (det 2:a och 6:e steget), vilket ger 5 noter som är lättare att improvisera med.'
        }
      ],
      passingScore: 3
    }
  },

  5: {
    id: 5, moduleId: 2,
    title: 'Ackord & Progressioner',
    subtitle: 'Klangen bakom synthwave-känslan',
    tags: ['Musikteori', 'Harmonik'],
    estimatedMinutes: 12,
    blocks: [
      {
        type: 'text',
        html: `<p>Ett <strong>ackord</strong> är tre eller fler noter som spelas samtidigt. Varje ackord har en karaktär — dur-ackord låter glada och stabila, moll-ackord melankoliska och introspektiva.</p>
<p>En <strong>progression</strong> är en sekvens av ackord som upprepas som koralgrunden i låten. Det är progressionen som ger synthwave-låtar sin karakteristiska känslomässiga kurva.</p>`
      },
      {
        type: 'text',
        html: `<h3>Bygga ett ackord</h3>
<p>Det enklaste ackordet — ett <strong>treklang</strong> — byggs av tre noter med specifika intervall:<br>
<strong>Grundton + ters (3 eller 4 halvsteg upp) + kvint (7 halvsteg från grundton)</strong></p>
<p>Am-ackordet: <strong>A – C – E</strong></p>`
      },
      {
        type: 'text',
        html: `<div class="chord-buttons">
<button class="chord-btn" data-notes="[220,261.63,329.63]" data-wave="sawtooth">Am</button>
<button class="chord-btn" data-notes="[174.61,220,261.63]" data-wave="sawtooth">F</button>
<button class="chord-btn" data-notes="[130.81,164.81,196]" data-wave="sawtooth">C</button>
<button class="chord-btn" data-notes="[146.83,185,220]" data-wave="sawtooth">Gm</button>
</div>
<p>Klicka på ackorden ovan för att höra dem. Lägg märke till skillnaden mellan Am (moll) och C (dur).</p>`
      },
      {
        type: 'tip',
        label: 'KLASSISK SYNTHWAVE-PROGRESSION',
        html: `<p>Den ikoniska synthwave-progressionen är <strong>i – VI – III – VII</strong> i a-moll:<br>
<strong>Am – F – C – G</strong><br>
Du hittar den i hundratals synthwave-låtar. Den blandningen av mörkt (Am) och upplyftande (F, C) är formelns hemlighet.</p>`
      },
      {
        type: 'text',
        html: `<h3>Prova den klassiska progressionen</h3>
<p>Klicka igenom ackorden nedan i ordning — det är <strong>Am – F – C – G</strong>. Repetera dem och känn hur progressionen "roterar" runt och skapar en loopad spänning:</p>
<div class="chord-buttons">
<button class="chord-btn" data-notes="[220,261.63,329.63]" data-wave="sawtooth">Am (i)</button>
<button class="chord-btn" data-notes="[174.61,220,261.63]" data-wave="sawtooth">F (VI)</button>
<button class="chord-btn" data-notes="[261.63,329.63,392]" data-wave="sawtooth">C (III)</button>
<button class="chord-btn" data-notes="[196,246.94,293.66]" data-wave="sawtooth">G (VII)</button>
</div>`
      },
      {
        type: 'text',
        html: `<h3>Varför funkar progressionen?</h3>
<p>Am ger tyngd och mörker (tonikan). F lyfter lite (subdominant). C ger ljus (mollparalell-dur). G bygger spänning som vill lösa sig tillbaka till Am. Den cykeln — spänning och upplösning — är vad som gör musiken drabbande.</p>`
      },
      {
        type: 'piano',
        config: {
          defaultWave: 'sawtooth',
          showWaveSelector: false,
          octaves: 2,
          startOctave: 3,
          highlightKeys: ['A3', 'C4', 'E4', 'F3', 'A3', 'C4', 'C3', 'E3', 'G3', 'G3', 'B3', 'D4'],
          caption: 'Spela ackorden manuellt: Am = A+C+E, F = F+A+C, C = C+E+G, G = G+B+D'
        }
      },
      { type: 'quiz' }
    ],
    quiz: {
      questions: [
        {
          text: 'Vad är ett ackord?',
          options: ['En enda not som spelas länge', 'Tre eller fler noter spelat tillsammans', 'En rytmisk figur', 'En sekvens av melodinot'],
          correctIndex: 1,
          explanation: 'Ett ackord är minst tre noter spelade samtidigt. Det vanligaste är treklangen: grundton + ters + kvint.'
        },
        {
          text: 'Vilka noter bildar Am-ackordet (A-moll)?',
          options: ['A – B – C', 'A – C – E', 'A – C# – E', 'A – D – G'],
          correctIndex: 1,
          explanation: 'Am = A (grundton) + C (mollters, 3 halvsteg upp) + E (kvint, 7 halvsteg upp).'
        },
        {
          text: 'Vad är den klassiska synthwave-progressionen?',
          options: ['C – G – Am – F', 'Am – F – C – G', 'Dm – Am – Bb – C', 'Em – G – D – A'],
          correctIndex: 1,
          explanation: 'Am – F – C – G (i–VI–III–VII i a-moll) är en av de mest använda ackordprogressionerna i synthwave.'
        },
        {
          text: 'Varför låter Am-ackordet mer melankoliskt än C-dur?',
          options: ['Am har fler noter', 'Am innehåller en mollters (3 halvsteg), C-dur en durters (4 halvsteg)', 'Am spelas lägre i registret', 'Am är ett enklare ackord'],
          correctIndex: 1,
          explanation: 'Skillnaden är tersen: mollackord har en liten ters (3 halvsteg), durackord en stor ters (4 halvsteg). Den lilla tersen ger den mörkare, melankoliska karaktären.'
        }
      ],
      passingScore: 3
    }
  },

  // ════════════════════════════════════════════════════════════
  // MODUL 3 — Arturia MiniFreak
  // ════════════════════════════════════════════════════════════

  6: {
    id: 6, moduleId: 3,
    title: 'MiniFreak: Gränssnittsöversikt',
    subtitle: 'Vad gör varje sektion på fronpanelen?',
    tags: ['MiniFreak', 'Hårdvara'],
    estimatedMinutes: 12,
    blocks: [
      {
        type: 'text',
        html: `<p>Arturia MiniFreak kan se överväldigande ut vid första anblick — massor av knappar, reglage och skärmar. Men med rätt karta är den faktiskt <strong>logiskt organiserad</strong>. Allt hör hemma i signalkedjan du lärde dig: Oscillatorer → Filter → Amplifier → Effekter.</p>`
      },
      { type: 'minifreak', config: {} },
      {
        type: 'text',
        html: `<h3>Sektionerna uppifrån och ned</h3>
<ul>
<li><strong>Oscillator A & B</strong> — Två digitala oscillatorer. Var och en kan generera massor av syntestyper (Wavetable, Virtual Analog, FM, osv). Här börjar allt ljud.</li>
<li><strong>Filter</strong> — Arturia's version av Steiner-Parker-filtret. Lågpass (LP), bandpass (BP) eller högpass (HP). Cutoff och Resonance är de viktigaste reglagen.</li>
<li><strong>Envelopes (Env1 / Env2)</strong> — Två ADSR-kurvator. Env2 styr normalt volymen (Amp Envelope). Env1 kan modulera filter, pitch, LFO m.m.</li>
<li><strong>LFO 1 & 2</strong> — Lågfrekvensoscillatorer för modulering — vibrato, tremolo, filter-wobbel, etc.</li>
<li><strong>Effects</strong> — Tre parallella effektblock: Chorus/Flanger/Phaser, Delay och Reverb.</li>
<li><strong>Arpeggiator & Sequencer</strong> — Inbyggd arpeggiator och 16-stegs sequencer.</li>
<li><strong>Macros (4 knappar)</strong> — Programmerbara knappar som kan styra flera parametrar samtidigt.</li>
<li><strong>SPICE & DICE</strong> — Randomisering av ljud. Spice justerar lite, Dice genererar helt nytt ljud.</li>
</ul>`
      },
      {
        type: 'tip',
        label: 'KOMMA IGÅNG',
        html: `<p>Börja alltid med ett <strong>preset</strong> som liknar det ljud du vill ha, sedan justerar du därifrån. Tryck på <em>Browse</em>-knappen och bläddra bland presets — det finns hundratals. Lyssna på kategorierna "Lead", "Pad", "Bass" och "Arp".</p>`
      },
      {
        type: 'text',
        html: `<h3>Display och navigering</h3>
<p>MiniFreak har en liten OLED-skärm som visar vilken parameter du justerar och dess värde. När du vrider på ett reglage uppdateras skärmen direkt. Det finns en <strong>navigation joystick/push-encoder</strong> till höger om skärmen för att navigera i menyer.</p>
<p>För att editera ett preset: välj ett, gör ändringar, håll in <em>Shift</em> och tryck <em>Store</em> för att spara till en ny slot.</p>`
      },
      { type: 'quiz' }
    ],
    quiz: {
      questions: [
        {
          text: 'Hur många oscillatorer har MiniFreak?',
          options: ['1', '2', '3', '4'],
          correctIndex: 1,
          explanation: 'MiniFreak har två digitala oscillatorer: Oscillator A och Oscillator B. De kan ha olika syntestyper och kan stämmas mot varandra.'
        },
        {
          text: 'Vilken filtertyp är MiniFreaks filter baserat på?',
          options: ['Moog-ladder', 'Steiner-Parker', 'SEM state-variable', 'Chamberlin'],
          correctIndex: 1,
          explanation: 'MiniFreak använder Arturias version av det klassiska Steiner-Parker-filtret, som kan köras som LP (lågpass), BP (bandpass) eller HP (högpass).'
        },
        {
          text: 'Vad gör DICE-knappen på MiniFreak?',
          options: ['Slår på/av arpeggiator', 'Randomiserar ett helt nytt ljud', 'Justerar LFO-hastigheten', 'Sparar ett preset'],
          correctIndex: 1,
          explanation: 'DICE randomiserar oscillatorinställningarna och skapar ett helt nytt ljud. SPICE gör en mildare justering av det befintliga ljudet.'
        },
        {
          text: 'Var i signalkedjan sitter enveloperna (ADSR) på MiniFreak?',
          options: ['Före oscillatorerna', 'I filtret', 'De modulerar filter och amplifier', 'I effektblocket'],
          correctIndex: 2,
          explanation: 'Enveloperna är modulationskällor — de påverkar (modulerar) amplituden (Env2 normalt) och kan modulera filter-cutoff och andra parametrar (Env1).'
        }
      ],
      passingScore: 3
    }
  },

  7: {
    id: 7, moduleId: 3,
    title: 'Oscillatorer A & B',
    subtitle: 'Vågformer, stämning och det dubbla OSC-tricket',
    tags: ['MiniFreak', 'Oscillatorer'],
    estimatedMinutes: 12,
    blocks: [
      {
        type: 'text',
        html: `<p>MiniFreaks oscillatorer är ovanliga — de är <strong>digitala</strong> vilket ger dem ett enormt utbud av syntestyper. Du kan välja bland Virtual Analog-vågformer, Wavetables, FM-synthesis, Speech-synthesis, Karplus-Strong och mycket mer.</p>
<p>Men oroa dig inte för alla alternativ just nu. För synthwave behöver du egentligen bara ett fåtal.</p>`
      },
      {
        type: 'tip',
        label: 'SYNTHWAVE-ESSENTIALS',
        html: `<p>För leads: välj <strong>Virtual Analog → Sawtooth</strong> på Osc A (och B om du vill ha ett tjockare ljud).<br>
För pads: prova <strong>Wavetable</strong>-oscillatorn med ett mjukt bord.<br>
För bass: <strong>Virtual Analog → Square</strong> eller SAW ett par oktaver ner.</p>`
      },
      {
        type: 'text',
        html: `<h3>TYPE-reglaget</h3>
<p>Varje oscillator har ett <strong>TYPE</strong>-reglage (och en knapp för att välja syntestyp). Vrider du TYPE-reglaget inom Virtual Analog-mode bläddrar du mellan vågformerna: SAW, SQUARE, TRIANGLE, SINE och varianter däremellan.</p>
<h3>WAVE och TIMBRE</h3>
<p>Beroende på syntestyp styr <strong>WAVE</strong> och <strong>TIMBRE</strong>-reglagen karaktären på ljudet. I Virtual Analog-mode: WAVE väljer vågform, TIMBRE justerar pulsvidd (för square) eller mängd övertoner.</p>`
      },
      {
        type: 'waveform',
        caption: 'Dessa fyra vågformer är de viktigaste — prova dem på din MiniFreak också!',
        config: { waveforms: ['sawtooth', 'square', 'sine', 'triangle'], interactive: true, playable: true }
      },
      {
        type: 'text',
        html: `<h3>Det dubbla OSC-tricket: Detune</h3>
<p>Ett av de kraftfullaste tricken i synthwave är att köra <strong>två oscillatorer stämda lite mot varandra</strong>. Inget låter fetare. Ange samma syntestyp på OSC A och OSC B, och justera sedan OSC B's <strong>SEMITONE</strong> eller <strong>DETUNE</strong> ett par cent (hundradels halvton) upp eller ner.</p>
<p>Resultatet är en <em>chorus-liknande</em> svallning som gör att leadet "flödar" och tar mer plats. Klassisk synthwave-produktion.</p>`
      },
      {
        type: 'text',
        html: `<div class="chord-buttons">
<button class="chord-btn" data-notes="[220]" data-wave="sawtooth">OSC A: SAW 220Hz</button>
<button class="chord-btn" data-notes="[220, 222]" data-wave="sawtooth">A + B: Detunat ±2 cent</button>
<button class="chord-btn" data-notes="[220, 225]" data-wave="sawtooth">A + B: Detunat ±5 cent</button>
</div>
<p>Hör hur mycket tjockare det låter med två detunade oscillatorer!</p>`
      },
      {
        type: 'tip',
        label: 'UNISON-LÄGE',
        html: `<p>MiniFreak har ett <strong>Unison</strong>-läge (Shift + Paraphonic/Unison-knapp) som staplar alla röster på samma tangent och detunar dem mot varandra. Aktivera det för maximal tjocklek på ett lead.</p>`
      },
      { type: 'quiz' }
    ],
    quiz: [
      {
        text: 'Varför kallas MiniFreaks oscillatorer "digitala"?',
        options: ['De kräver batterier', 'De simulerar och genererar vågformer digitalt och kan ha många syntestyper', 'De är sämre än analoga', 'De genererar bara digitalt brus'],
        correctIndex: 1,
        explanation: 'Digitala oscillatorer simulerar vågformer med algoritmer, vilket ger dem förmågan att göra Wavetable, FM, VA-analog och mycket mer — något analoga kretsar inte kan.'
      },
    ],
    quiz: {
      questions: [
        {
          text: 'Vad händer när du detunar OSC B ett par cent mot OSC A?',
          options: ['Noten hamnar en halvton upp', 'Ljudet låter tjockare och mer svallande', 'Oscillatorn slutar spela', 'Det skapar ett vibrato'],
          correctIndex: 1,
          explanation: 'Lätt detuneing av två oscillatorer skapar faskillnader som ger ett tjockare, svallande ljud — nästan som en inbyggd chorus. Klassiskt synthwave-trick.'
        },
        {
          text: 'Vilken vågform är bäst för ett klassiskt synthwave-lead?',
          options: ['Sine', 'Triangle', 'Sawtooth', 'Square'],
          correctIndex: 2,
          explanation: 'Sawtooth (sågtand) är rik på övertoner, har en skarp attack och klär sig utmärkt i reverb och delay — perfekt för synthwave-leads.'
        },
        {
          text: 'Vad styr TYPE-reglaget på MiniFreaks oscillatorer?',
          options: ['Volym på oscillatorn', 'Syntestyp och/eller vågformsval', 'Oktav-inställning', 'LFO-hastighet'],
          correctIndex: 1,
          explanation: 'TYPE-reglaget väljer syntestyp (Virtual Analog, Wavetable, FM, etc.) och inom varje syntestyp bläddrar det mellan vågformer eller varianter.'
        },
        {
          text: 'Vad gör Unison-läget på MiniFreak?',
          options: ['Slår ihop alla presets till ett', 'Stackar alla röster på samma tangent med detuneing för ett fetare ljud', 'Lägger till ett eko-effect', 'Kopplar ihop OSC A och B i serie'],
          correctIndex: 1,
          explanation: 'Unison-läget staplar alla tillgängliga röster på samma tangent och detunar dem mot varandra, vilket ger ett extremt tjockt, massivt ljud.'
        }
      ],
      passingScore: 3
    }
  },

  8: {
    id: 8, moduleId: 3,
    title: 'Filtret: Steiner-Parker',
    subtitle: 'Cutoff, resonans och det klassiska filtret',
    tags: ['MiniFreak', 'Filter'],
    estimatedMinutes: 12,
    blocks: [
      {
        type: 'text',
        html: `<p>Filtret är <strong>hjärtat</strong> i en subtraktiv synth. Det är det viktigaste verktyget för att forma klangen och ge ett ljud sin karaktär. MiniFreak använder en analog version av det klassiska <strong>Steiner-Parker-filtret</strong> — designat av Nyle Steiner på 70-talet och känt för sin öppna, lite grova karaktär.</p>`
      },
      {
        type: 'text',
        html: `<h3>Filtertyper</h3>
<p>Steiner-Parker kan köras i tre lägen — välj med FILTER TYPE-knappen:</p>
<ul>
<li><strong>LP (Lågpass)</strong> — Släpper igenom frekvenser <em>under</em> cutoff, dämpar höga. Mörknar ljudet. Vanligast.</li>
<li><strong>BP (Bandpass)</strong> — Släpper igenom ett band kring cutoff, dämpar allt utanför. Smalare, nasal klang.</li>
<li><strong>HP (Högpass)</strong> — Släpper igenom frekvenser <em>över</em> cutoff, dämpar låga. Tunnar ut ljudet, bra för high-end-element.</li>
</ul>`
      },
      {
        type: 'tip',
        label: 'SYNTHWAVE-TIPS',
        html: `<p><strong>LP-filtret</strong> är ditt go-to för leads och pads. Börja med cutoff ca 70% och justera därifrån. Sänk det för ett mörkare, mer <em>dovat</em> ljud. Höj det för att öppna upp övertoner och göra leaden skarpare.</p>`
      },
      {
        type: 'text',
        html: `<h3>CUTOFF-frekvensen</h3>
<p>Cutoff (CUT-reglaget) är <strong>det viktigaste reglaget på synthens filter</strong>. Det bestämmer var filtret "stänger av" frekvenser. Tänk det som en equalizer-kurva: LP-filter skär av allt ovanför cutoff.</p>
<ul>
<li>Cutoff lågt (t.ex. 20%) → Mörkt, dovat, bas-tungt</li>
<li>Cutoff mellanhögt (50–70%) → Balanserat, varmt</li>
<li>Cutoff högt (90–100%) → Filter i princip öppet, alla övertoner framme</li>
</ul>`
      },
      {
        type: 'text',
        html: `<h3>RESONANS</h3>
<p>Resonansen (RES-reglaget) förstärker frekvenserna <em>precis runt</em> cutoff-punkten. Det skapar ett slags ringande, piskande ljud. Vid hög resonans kan filtret börja självoscillera och generera en ton.</p>
<ul>
<li>Resonans låg (0–30%) → Naturligt, varmt</li>
<li>Resonans mellanhög (40–60%) → Karaktäristisk synth-klang, lite "wah"</li>
<li>Resonans hög (70–100%) → Extremt, ringande, acid-liknande</li>
</ul>`
      },
      {
        type: 'tip',
        label: 'FILTERSVEP — KLASSISKT TRICK',
        html: `<p>Öppna ett pad-ljud med cutoff lågt och automera eller manuellt vrida upp cutoff under ett intro. Det skapar en spänningsuppbyggnad som exploderar när refrängen börjar — ett av de mest klassiska synthwave-knepen.</p>`
      },
      {
        type: 'text',
        html: `<h3>ENVELOPE → FILTER (Env Amount)</h3>
<p>Filtrets cutoff kan <strong>moduleras av Env1</strong>. Det innebär att cutoff öppnar sig automatiskt varje gång du trycker en tangent (enligt ADSR-kurvan) och sedan stänger igen. Det ger den klassiska "wah-wah"-rörelsen på plucked synth-ljud.</p>
<p>På MiniFreak: <strong>ENV→FILT</strong>-reglaget styr hur mycket Env1 påverkar cutoff. Positivt värde = kuvert öppnar filtret. Negativt = kuvert stänger det.</p>`
      },
      { type: 'quiz' }
    ],
    quiz: {
      questions: [
        {
          text: 'Vad gör ett lågpassfilter (LP)?',
          options: ['Tar bort låga frekvenser', 'Släpper igenom låga frekvenser och dämpar höga', 'Förstärker alla frekvenser', 'Skapar ett echo-ljud'],
          correctIndex: 1,
          explanation: 'Lågpassfilter (LP) = "låg passerar". Det släpper igenom låga frekvenser och dämpar allt ovanför cutoff-frekvensen, vilket mörknar och mildrar klangen.'
        },
        {
          text: 'Vad händer när du vrider upp resonansen?',
          options: ['Cutoff-frekvensen stiger', 'Frekvenserna runt cutoff förstärks och skapar ett ringande ljud', 'Volymen minskar', 'LFO:n startar'],
          correctIndex: 1,
          explanation: 'Resonans förstärker frekvenser precis runt cutoff-punkten. Hög resonans ger ett karaktäristiskt "synthigt" piskljud och kan vid extrem inställning få filtret att självoscillera.'
        },
        {
          text: 'Vilket filterläge ger ett "nasalt" smalt ljud?',
          options: ['LP', 'HP', 'BP', 'Alla filterlägen låter likadant'],
          correctIndex: 2,
          explanation: 'BP (bandpass) släpper igenom ett smalt frekvensband kring cutoff och dämpar allt utanför — det ger en nasal, smal klang.'
        },
        {
          text: 'Vad gör ENV→FILT-reglaget på MiniFreak?',
          options: ['Justerar amplituden med ett envelope', 'Styr hur mycket Env1 modulerar filter-cutoff', 'Kopplar LFO till filtret', 'Justerar filtertypen'],
          correctIndex: 1,
          explanation: 'ENV→FILT bestämmer hur mycket Env1 (modulationsenvelopen) påverkar filter-cutoff. Det ger den klassiska "öppnande" filterbewegning när en tangent trycks.'
        }
      ],
      passingScore: 3
    }
  },

  // ════════════════════════════════════════════════════════════
  // MODUL 4 — Forma Ditt Ljud
  // ════════════════════════════════════════════════════════════

  9: {
    id: 9, moduleId: 4,
    title: 'ADSR: Envelopens kraft',
    subtitle: 'Attack, Decay, Sustain, Release — forma soundets tidslinje',
    tags: ['Sound Design', 'ADSR'],
    estimatedMinutes: 15,
    blocks: [
      {
        type: 'text',
        html: `<p>ADSR är ett <strong>kuvert</strong> — det beskriver hur ett ljud förändras i volym (eller filteröppning) <em>över tid</em>, från det ögonblick du trycker ner en tangent till att du släpper den.</p>
<p>Fyra parametrar styr kurvan: <strong>Attack</strong>, <strong>Decay</strong>, <strong>Sustain</strong> och <strong>Release</strong>.</p>`
      },
      {
        type: 'text',
        html: `<ul>
<li><strong>Attack</strong> — Hur lång tid det tar för volymen att gå från 0 till max när du trycker tangenten. Kort attack = hård, plötslig attack. Lång attack = mjuk, insmygande (typiskt för pads).</li>
<li><strong>Decay</strong> — Hur snabbt volymen sjunker från toppen ner till sustain-nivån.</li>
<li><strong>Sustain</strong> — Den nivå volymen håller på <em>medan</em> tangenten är nedtryckt. (Observera: sustain är en nivå, inte en tid!)</li>
<li><strong>Release</strong> — Hur lång tid det tar för volymen att nå noll <em>efter</em> du släpper tangenten.</li>
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
        html: `<p>Dra i handtagen på ADSR-kurvorna ovan. Klicka sedan <strong>▶ SPELA NOT</strong> och lyssna hur karaktären ändras. Prova presets: PLUCK ger ett perkussivt ryck, PAD smyger in mjukt, ORGAN är instant on/off.</p>`
      },
      {
        type: 'text',
        html: `<h3>ADSR på MiniFreak</h3>
<p>MiniFreak har <strong>två envelopes</strong>:<br>
<strong>Env1</strong> (Mod Envelope) — Fritt användbar modulator. Tilldela den till filter-cutoff, pitch, oscillator-wave etc.<br>
<strong>Env2</strong> (Amp Envelope) — Styr standardmässigt volymen (amplifiern/VCA).</p>
<p>Adjustera A, D, S, R-reglagen direkt på fronpanelen. På skärmen ser du aktuella värden.</p>`
      },
      {
        type: 'text',
        html: `<h3>Synthwave ADSR-recept</h3>
<ul>
<li><strong>Hard lead</strong>: A=1ms, D=100ms, S=70%, R=100ms — attackerar snabbt, håller sig uppe</li>
<li><strong>Soft pad</strong>: A=800ms, D=200ms, S=80%, R=2s — smyger in och klingar ut</li>
<li><strong>Pluck/Bass</strong>: A=1ms, D=150ms, S=0%, R=80ms — perkussiv, inget sustain</li>
<li><strong>Strings</strong>: A=350ms, D=150ms, S=75%, R=1s — klassisk stråkkaraktär</li>
</ul>`
      },
      { type: 'quiz' }
    ],
    quiz: {
      questions: [
        {
          text: 'Vad styr Attack-parametern i ett ADSR-kuvert?',
          options: ['Hur länge noten håller sig uppe', 'Hur lång tid det tar från 0 till maxvolym när en tangent trycks', 'Hur snabbt volymen sjunker efter release', 'Nivån på volymen under sustain-fasen'],
          correctIndex: 1,
          explanation: 'Attack är den tid det tar för volymen (eller modulationssignalen) att gå från noll upp till maxvärdet, precis när du trycker ner tangenten.'
        },
        {
          text: 'Sustain är en ___?',
          options: ['Tid — hur länge noten spelas', 'Nivå — volymen medan tangenten hålls nedtryckt', 'Frekvens — hur hög tonen är', 'Kurva — hur snabbt volymen ändras'],
          correctIndex: 1,
          explanation: 'Sustain är unik bland ADSR-parametrarna — det är en NIVÅ (0–100%), inte en tid. Det är den volym som hålls kvar medan tangenten är nedtryckt.'
        },
        {
          text: 'Du vill ha ett mjukt pad-ljud som smyger in. Vilken inställning passar bäst?',
          options: ['A=1ms, D=50ms, S=0%, R=10ms', 'A=800ms, D=200ms, S=80%, R=2s', 'A=1ms, D=1ms, S=100%, R=1ms', 'A=2s, D=2s, S=0%, R=3s'],
          correctIndex: 1,
          explanation: 'Lång attack (800ms) gör att ljuet smyger in mjukt. Hög sustain (80%) håller det uppe. Lång release (2s) låter det klinga ut vackert.'
        },
        {
          text: 'Vad händer om du sätter Release till 0ms?',
          options: ['Noten klingar ut gradvis', 'Noten slutar abrupt direkt när du släpper tangenten', 'Synthen kraschar', 'Noten spelar för alltid'],
          correctIndex: 1,
          explanation: 'Release = 0 innebär att volymen hoppar direkt till noll när tangenten släpps — inget utklingsljud alls, noten skärs av abrupt.'
        }
      ],
      passingScore: 3
    }
  },

  10: {
    id: 10, moduleId: 4,
    title: 'LFO: Modulera Ditt Ljud',
    subtitle: 'Vibrato, tremolo och filter-wobbel',
    tags: ['Sound Design', 'LFO', 'Modulering'],
    estimatedMinutes: 10,
    blocks: [
      {
        type: 'text',
        html: `<p>LFO står för <strong>Low Frequency Oscillator</strong> — en oscillator som svänger <em>långsamt</em>, under hörbara frekvenser (under 20 Hz). En LFO genererar ingen ton — den skapar istället en <strong>kontrollsignal</strong> som påverkar (modulerar) andra parametrar.</p>
<p>Det är LFO:n som ger dig vibrato, tremolo, filter-wobbel och rytmiska pulseringar.</p>`
      },
      {
        type: 'tip',
        label: 'MODULERING',
        html: `<p>Modulering = att låta en signal (LFO, envelope, etc.) automatiskt styra en annan parameter (pitch, volym, cutoff, etc.) över tid. Det är vad som gör ett statiskt ljud <em>levande</em>.</p>`
      },
      {
        type: 'text',
        html: `<h3>LFO-vågformen bestämmer rörelsen</h3>
<ul>
<li><strong>Sine-LFO</strong> → Mjuk, kontinuerlig svängning. Perfekt för vibrato.</li>
<li><strong>Square-LFO</strong> → Hoppar mellan två lägen. Perfekt för tremolo-puls eller pitch-hopp.</li>
<li><strong>Sawtooth-LFO</strong> → Rycker upp gradvis. Skapar ett rytmiskt ramp-mönster.</li>
<li><strong>S&H (Sample & Hold)</strong> → Hoppar slumpmässigt. Klassisk retro-synth robotljud.</li>
</ul>`
      },
      {
        type: 'text',
        html: `<h3>Rate och Amount</h3>
<p><strong>Rate</strong> (hastighet) — Hur snabbt LFO:n svänger. Låg rate (0.1–0.5 Hz) = långsam svallning. Hög rate (5–15 Hz) = snabb vibrato.</p>
<p><strong>Amount/Depth</strong> — Hur <em>mycket</em> LFO:n påverkar destination-parametern. Noll = ingen effekt. Max = extrem effekt.</p>`
      },
      {
        type: 'text',
        html: `<h3>LFO på MiniFreak</h3>
<p>MiniFreak har <strong>2 LFOs</strong> med egna RATE, WAVE och AMOUNT-reglage. Destination tilldelas via <strong>Mod Matrix</strong> (en liten matris på panelen eller i menyn) — du väljer SOURCE (t.ex. LFO1) och DESTINATION (t.ex. OSC1 Pitch) och ställer in modulationsdjupet.</p>
<p>Snabbaste sättet att testa: rikta LFO1 mot OSC1 Pitch (vibrato) eller mot Filter Cutoff (filter-wobbel).</p>`
      },
      {
        type: 'tip',
        label: 'SYNTHWAVE LFO-RECEPT',
        html: `<p><strong>Vibrato</strong>: LFO Sine → OSC Pitch, Rate ~5Hz, Amount litet (2–5 cent). Aktivera bara i slutet av noter (Trigger: Note-off eller med aftertouch).<br>
<strong>Filter-wobbel</strong>: LFO Sine/Triangle → Filter Cutoff, Rate ~0.3–0.8Hz, Amount medium. Ger ett levande, andande ljud.<br>
<strong>Auto-tremolo</strong>: LFO Square → Amp Volume, Rate syncat till BPM. Skapar en rhythmisk pulsering.</p>`
      },
      { type: 'quiz' }
    ],
    quiz: {
      questions: [
        {
          text: 'Vad är ett LFO?',
          options: ['En oscillator som spelar hörbara toner', 'En lågfrekvensoscillator som skapar kontrollsignaler för modulering', 'En typ av filter', 'Ett reverb-effekt'],
          correctIndex: 1,
          explanation: 'LFO (Low Frequency Oscillator) svänger under hörbara frekvenser och genererar kontrollsignaler som kan modulera andra parametrar som pitch, volym och filter.'
        },
        {
          text: 'Vilket LFO-mönster ger ett klassiskt vibrato?',
          options: ['Square', 'S&H (Sample & Hold)', 'Sine', 'Sawtooth'],
          correctIndex: 2,
          explanation: 'Sinusvågen ger en mjuk, kontinuerlig svängning — perfekt för vibrato (mjuk pitch-modulering).'
        },
        {
          text: 'Vad styr LFO Rate-parametern?',
          options: ['Hur stark effekten är', 'Hur snabbt LFO:n svänger', 'Vilken parameter LFO:n modulerar', 'Vågformen på LFO:n'],
          correctIndex: 1,
          explanation: 'Rate styr hastigheten på LFO:ns svängning — låg rate = långsam, mjuk rörelse; hög rate = snabb vibration eller tremolo.'
        },
        {
          text: 'Du vill skapa ett filter-wobbel som gör ett pad-ljud levande. Vilken destination väljer du i Mod Matrix?',
          options: ['OSC1 Wave', 'Filter Cutoff', 'Reverb Mix', 'ADSR Attack'],
          correctIndex: 1,
          explanation: 'LFO → Filter Cutoff skapar en svallande öppning och stängning av filtret — det "andande" filter-wobblet som är extremt vanligt i synthwave-pads.'
        }
      ],
      passingScore: 3
    }
  },

  11: {
    id: 11, moduleId: 4,
    title: 'Effekter: Reverb, Delay & Chorus',
    subtitle: 'Placera ditt ljud i tid och rum',
    tags: ['Sound Design', 'Effekter'],
    estimatedMinutes: 12,
    blocks: [
      {
        type: 'text',
        html: `<p>Effekter är <strong>det sista ledet</strong> i signalkedjan — de tar ett torrt, syntetiskt ljud och placerar det i ett rum, ett eko eller ett klanglandskap. I synthwave är effekter <em>extremt</em> viktiga. Genren definieras i stor utsträckning av dess karakteristiska reverb-tyngda, eko-dränkta ljud.</p>`
      },
      {
        type: 'text',
        html: `<h3>Reverb — Rumskänsla</h3>
<p>Reverb simulerar hur ljud studsar i ett rum och skapar en serie reflektioner. Kortare reverb = litet rum (badrum, källare). Längre reverb = stor hall, katedral, rymden.</p>
<p><strong>Synthwave-reverb</strong>: Använd lång reverb-tid (2–6 sekunder), hög <em>wet mix</em> (50–80%). Det ger den karaktäristiska "80-tals stor hall"-känslan.</p>
<p>På MiniFreak: <strong>REVERB Size</strong> styr storleken/längden. <strong>REVERB Mix</strong> balanserar torrt vs. reverberat ljud.</p>`
      },
      {
        type: 'text',
        html: `<h3>Delay — Ekon i tid</h3>
<p>Delay är ett eko-effekt — det spelar upp kopior av signalen efter en viss tid. <em>Pingpong delay</em> studsar ekona fram och tillbaka mellan vänster och höger kanal.</p>
<p><strong>Synthwave-delay</strong>: Synka delay-time till låtens BPM (t.ex. 1/8 eller dotted 1/8 för det klassiska U2/synthwave-ekat). Gör feedback ca 30–50% för att få 3–5 ekon som klingar ut.</p>
<p>På MiniFreak: <strong>DELAY Time</strong> och <strong>DELAY Fdbk</strong> (feedback). BPM-sync-läge gör att ekon följer låttempos automatiskt.</p>`
      },
      {
        type: 'text',
        html: `<h3>Chorus — Tjocklek och rymkänsla</h3>
<p>Chorus skapar kopior av signalen med lätt detuneing och tidsfördröjning, vilket ger en <em>svallande, "flöjtig" karaktär</em>. Det är som att höra en kör sjunga samma melodi — alla är lite ur takt, men det låter varmare och tjockare.</p>
<p><strong>Synthwave-chorus</strong>: Lätt chorus på leads och pads (Rate ~0.3 Hz, Depth ~30–50%) ger ett bredare stereofält utan att förstöra attacken.</p>
<p>MiniFreak: MODULATION-blocket kan köras som Chorus, Flanger eller Phaser — välj Chorus för synthwave.</p>`
      },
      {
        type: 'tip',
        label: 'EFFEKTORDNING PÅ MINIFREAK',
        html: `<p>MiniFreak kör effekterna i parallell, inte seriell. Det innebär att Chorus, Delay och Reverb alla bearbetar signalen "vid sidan om" och blandas sedan ihop. Spela gärna med alla tre aktiverade för det fullständiga synthwave-ljudet.</p>`
      },
      {
        type: 'text',
        html: `<h3>Golden ratio för synthwave-effekter</h3>
<ul>
<li>Reverb Size: 70–80%, Mix: 40–60%</li>
<li>Delay Time: 1/8 syncat, Feedback: 30–40%, Mix: 20–30%</li>
<li>Chorus Rate: 0.3 Hz, Depth: 40–50%</li>
</ul>
<p>Kombinera dessa tre och du har genrens klassiska "rymd"-ljud på sekunder.</p>`
      },
      { type: 'quiz' }
    ],
    quiz: {
      questions: [
        {
          text: 'Vad gör ett reverb-effekt?',
          options: ['Skapar ett rytmiskt eko', 'Simulerar hur ljud studsar i ett rum, ger rumskänsla', 'Tjocknar ljudet med detunade kopior', 'Lägger till distortion'],
          correctIndex: 1,
          explanation: 'Reverb simulerar akustiken i ett rum — reflektioner och efterklang. Lång reverb-tid ger känslan av en stor hall eller katedralrymd.'
        },
        {
          text: 'Delay-effect synkat till BPM med 1/8-not och 40% feedback ger?',
          options: ['En lång, utdragen rumskänsla', 'Rytmiska ekon som följer låtens tempo', 'En bred stereobild', 'Vibrato'],
          correctIndex: 1,
          explanation: 'BPM-synkat delay med 1/8-not skapar ekon precis på taktslagen, vilket ger ett rytmiskt, pulserade eko-mönster typiskt för synthwave.'
        },
        {
          text: 'Varför ger chorus ett "tjockare" ljud?',
          options: ['Det lägger till bas-frekvenser', 'Det skapar detunade och lätt fördröjda kopior av signalen', 'Det komprimerar signalen', 'Det lägger till övertoner med distortion'],
          correctIndex: 1,
          explanation: 'Chorus skapar lätt detunade och tidsfördröjda kopior av signalen. Kombinationen gör att signalen låter som om flera instrument spelar tillsammans — tjockare och bredare.'
        },
        {
          text: 'Vilket effekt-recept ger klassisk synthwave-känsla?',
          options: ['Ingen reverb, inget delay, inget chorus', 'Lång reverb, BPM-synkat delay, lätt chorus', 'Enbart distortion', 'Kortare reverb och inget delay'],
          correctIndex: 1,
          explanation: 'Synthwave definieras av lång reverb (stor hall-känsla), BPM-synkat delay (rytmiska ekon) och lätt chorus (tjocklek). Alla tre ihop ger genrens karakteristiska "rymd"-ljud.'
        }
      ],
      passingScore: 3
    }
  },

  // ════════════════════════════════════════════════════════════
  // MODUL 5 — Skapa Synthwave
  // ════════════════════════════════════════════════════════════

  12: {
    id: 12, moduleId: 5,
    title: 'Lead-ljud',
    subtitle: 'Det skarpa, melodiska hjärtat i en synthwave-låt',
    tags: ['Sound Design', 'Lead', 'Synthwave'],
    estimatedMinutes: 12,
    blocks: [
      {
        type: 'text',
        html: `<p>Lead-synthen är det ljud som spelar <strong>melodin</strong> — det som lyssnaren sjunger med på. Det ska vara distinkt, skarpt och ha tillräckligt med karaktär för att stå ut i mixet. Samtidigt ska det inte vara så aggressivt att det tröttnar fort.</p>`
      },
      {
        type: 'tip',
        label: 'MÅL',
        html: `<p>Ett bra synthwave-lead: Skärt men inte irriterande. Energetiskt men med en liten nostalgi-sorg i sig. Tänk på Kavinsky's "Nightcall" eller M83's "Midnight City".</p>`
      },
      {
        type: 'text',
        html: `<h3>Recept: Klassiskt Synthwave Lead</h3>
<ol>
<li><strong>Oscillatorer</strong>: OSC A = SAW, OSC B = SAW, detuna B ~5–10 cent. Volym 50/50.</li>
<li><strong>Filter</strong>: LP, Cutoff ca 65–75%, Resonance 20–35%. Env1 Amount positiv (ca 30%) för att filtret öppnar sig vid attack.</li>
<li><strong>Env2 (Amp)</strong>: A=5ms, D=100ms, S=80%, R=200ms.</li>
<li><strong>Env1 (Mod→Filter)</strong>: A=3ms, D=200ms, S=40%, R=150ms.</li>
<li><strong>Reverb</strong>: Size 70%, Mix 35%.</li>
<li><strong>Delay</strong>: 1/8-note sync, Fdbk 35%, Mix 20%.</li>
</ol>`
      },
      {
        type: 'text',
        html: `<h3>Lyssna på skillnaden</h3>
<p>Prova dessa ljud och hör hur envelopet och filtret förändrar karaktären:</p>
<div class="chord-buttons">
<button class="chord-btn" data-notes="[440]" data-wave="sawtooth" data-duration="1">SAW (torrt)</button>
<button class="chord-btn" data-notes="[440, 442]" data-wave="sawtooth" data-duration="1">SAW x2 (detunat)</button>
<button class="chord-btn" data-notes="[440, 442, 220, 221]" data-wave="sawtooth" data-duration="1.5">Tjockt Lead</button>
</div>`
      },
      {
        type: 'text',
        html: `<h3>Legato och portamento</h3>
<p>Synthwave-leads glider ofta <strong>mjukt mellan tonerna</strong> — det kallas portamento (eller glide). På MiniFreak aktiveras det med <strong>GLIDE</strong>-reglaget (tid för att glida mellan toner). Spela i Mono-läge för klassiskt lead-spel.</p>
<p>Legato-spel (hålla föregående not medan du spelar nästa) kombinerat med glide ger den signaturkaraktäristiska "svepande" lead-rösten.</p>`
      },
      {
        type: 'piano',
        config: {
          defaultWave: 'sawtooth',
          showWaveSelector: true,
          octaves: 2,
          startOctave: 4,
          highlightKeys: ['A4', 'C5', 'D5', 'E5', 'G5'],
          caption: 'Spela pentatonisk A-moll (markerade tangenter) med SAW-vågformen — detta är ditt lead!'
        }
      },
      { type: 'quiz' }
    ],
    quiz: {
      questions: [
        {
          text: 'Vilket trick ger ett synthwave-lead mer "tjocklek"?',
          options: ['Öka reverb till 100%', 'Köra två detunade SAW-oscillatorer mot varandra', 'Sätta attack till maxvärdet', 'Stänga filtret helt'],
          correctIndex: 1,
          explanation: 'Två SAW-oscillatorer detunade mot varandra (5–15 cent) skapar en chorus-liknande svallning som gör leadet tjockare och mer rumslig.'
        },
        {
          text: 'Vad är portamento/glide?',
          options: ['En effekt som lägger till reverb', 'En glidande pitch-rörelse mellan toner', 'En arpeggiator-funktion', 'En typ av filter'],
          correctIndex: 1,
          explanation: 'Portamento (glide) gör att synthen glider mjukt i pitch från en ton till nästa, snarare än att hoppa direkt. Det ger leads en mjuk, svepande karaktär.'
        },
        {
          text: 'Hur bör Env1 (Mod-envelop) vara inställd för att ge leadet en snabb "öppning"?',
          options: ['Attack lång, Decay kort', 'Attack kort, positiv ENV→FILT amount', 'Sustain = 0%', 'Release maximalt'],
          correctIndex: 1,
          explanation: 'Kort attack på Env1 med positiv ENV→FILT amount gör att filtret snabbt öppnar sig vid tangentanslag, vilket ger leadet en karaktäristisk "prick" och öppenhet.'
        },
        {
          text: 'Var i melodin spelar ett synthwave-lead typiskt sett?',
          options: ['I basen, under 200 Hz', 'I diskanten, oktav 4–6', 'Överallt simultant', 'Bara i intro-sektionen'],
          correctIndex: 1,
          explanation: 'Leads spelas i diskantregistret (oktav 4–6, ca 262–2000 Hz) för att melodin ska höras tydligt ovanför bas, trummor och pads.'
        }
      ],
      passingScore: 3
    }
  },

  13: {
    id: 13, moduleId: 5,
    title: 'Pad-ljud',
    subtitle: 'Mjuka, atmosfäriska bakgrunder som skapar stämning',
    tags: ['Sound Design', 'Pad', 'Synthwave'],
    estimatedMinutes: 12,
    blocks: [
      {
        type: 'text',
        html: `<p>Pads är bakgrundsljud — <strong>texturer och harmoni</strong> som fyller ut rummet och håller ackordprogressionen levande. De ska vara mjuka, flyktiga och nästan osynliga — men utan dem känns låten tom och kall.</p>
<p>Pads är yin till leadets yang: leadet berättar melodin, paden håller stämningen.</p>`
      },
      {
        type: 'text',
        html: `<h3>Recept: Klassisk Synthwave Pad</h3>
<ol>
<li><strong>Oscillatorer</strong>: OSC A = SAW, OSC B = SAW men OCT+1 (en oktav upp). Detuna B ~12 cent. OSC A vol 60%, B vol 40%.</li>
<li><strong>Filter</strong>: LP, Cutoff 45–55%, Resonance 10–15%. Inget envelope-modulation.</li>
<li><strong>Env2 (Amp)</strong>: A=600–900ms, D=200ms, S=75%, R=1.5–2s.</li>
<li><strong>LFO1 → Filter Cutoff</strong>: Sine, Rate 0.3Hz, Amount 15%. Ger ett svagt "andande".</li>
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
        html: `<h3>Spela pad-ackord</h3>
<p>En pad spelas normalt med öppna, brett voicade ackord — sprid noterna över flera oktaver. Prova att spela Am-progressionen som pads:</p>
<div class="chord-buttons">
<button class="chord-btn" data-notes="[110, 165, 220, 261.63]" data-wave="sawtooth">Am (brett)</button>
<button class="chord-btn" data-notes="[87.3, 130.8, 174.6, 220]" data-wave="sawtooth">F (brett)</button>
<button class="chord-btn" data-notes="[130.8, 196, 261.6, 329.6]" data-wave="sawtooth">C (brett)</button>
<button class="chord-btn" data-notes="[98, 147, 196, 246.9]" data-wave="sawtooth">G (brett)</button>
</div>`
      },
      {
        type: 'tip',
        label: 'POLYFONISK SPELSTIL',
        html: `<p>Sätt MiniFreak i <strong>Poly-läge</strong> (Paraphonic eller Poly om tillgängligt) för att spela pads. Pads ska ha lång attack och release — tryck ner nästa ackord <em>innan</em> du släpper det föregående så att de "smälter" in i varandra.</p>`
      },
      {
        type: 'piano',
        config: {
          defaultWave: 'sawtooth',
          showWaveSelector: false,
          octaves: 3,
          startOctave: 3,
          highlightKeys: ['A3', 'C4', 'E4', 'A4', 'C5', 'E5'],
          caption: 'Prova Am-ackordet brett voicat: A3+C4+E4+A4+C5+E5 — det är padljudet!'
        }
      },
      { type: 'quiz' }
    ],
    quiz: {
      questions: [
        {
          text: 'Vad är en pads roll i en synthwave-låt?',
          options: ['Spela melodin', 'Hålla basgången', 'Ge harmonisk bakgrund och stämning', 'Ersätta trummorna'],
          correctIndex: 2,
          explanation: 'Pads är harmonisk bakgrund — de håller ackordprogressionen levande och skapar texturen och stämningen i låten, utan att ta överhanden från leadet.'
        },
        {
          text: 'Vilket ADSR-recept passar bäst för en mjuk synth-pad?',
          options: ['A=1ms, D=50ms, S=0%, R=10ms', 'A=800ms, D=200ms, S=80%, R=2s', 'A=50ms, D=50ms, S=50%, R=50ms', 'A=1ms, D=200ms, S=100%, R=1ms'],
          correctIndex: 1,
          explanation: 'Lång attack gör att paden smyger in mjukt. Hög sustain håller den uppe. Lång release låter den klinga ut naturligt. Allt detta ger den drömska pad-karaktären.'
        },
        {
          text: 'Vad innebär "brett voicade" ackord vid padspelning?',
          options: ['Spela alla noter i samma oktav', 'Sprida ut noterna över flera oktaver', 'Spela bara grundtonen och kvinten', 'Spela ackordet i en hand'],
          correctIndex: 1,
          explanation: 'Brett voicade ackord sprider noterna över 2–3 oktaver, vilket ger ett öppnare, rymdligare ljud som passar perfekt för pad-texturer.'
        },
        {
          text: 'Varför passar LFO → Filter Cutoff bra på ett pad-ljud?',
          options: ['Det gör paden skarpare', 'Det skapar ett svagt "andande" för att göra paden levande', 'Det lägger till eko', 'Det ökar volymen'],
          correctIndex: 1,
          explanation: 'En långsam LFO (0.2–0.5 Hz) mot filter-cutoff ger en subtil, svallande öppning och stängning av filtret som gör att paden "andas" och inte känns statisk.'
        }
      ],
      passingScore: 3
    }
  },

  14: {
    id: 14, moduleId: 5,
    title: 'Arpeggio & Sequencer',
    subtitle: 'Rytmiska mönster och MiniFreaks inbyggda sequencer',
    tags: ['Arpeggio', 'Sequencer', 'Rytm'],
    estimatedMinutes: 12,
    blocks: [
      {
        type: 'text',
        html: `<p>En <strong>arpeggiator</strong> tar ett ackord och spelar dess noter en i taget i ett mönster. Istället för att alla tre noter i Am klingar simultant, spelas de uppåt: A – C – E – A – C – E... Det är ett av synthwaves mest karakteristiska element.</p>`
      },
      {
        type: 'text',
        html: `<h3>Arpeggio-mönster</h3>
<p>MiniFreaks arpeggiator kan spela mönstren på många sätt:</p>
<ul>
<li><strong>UP</strong> — Uppåt: lägsta noten till högsta</li>
<li><strong>DOWN</strong> — Nedåt: högsta till lägsta</li>
<li><strong>UP-DOWN</strong> — Upp och sedan ned, fram och tillbaka</li>
<li><strong>ORDER</strong> — I den ordning du tryckt ned tangenterna</li>
<li><strong>RANDOM</strong> — Slumpmässig ordning</li>
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
        html: `<h3>Rate och Octave</h3>
<p><strong>Rate</strong> styr hur snabbt arpeggiaton spelar — synca till BPM för musikalt resultat (1/8, 1/16, etc.).<br>
<strong>Octave Range</strong> bestämmer hur många oktaver arpeggio-mönstret span över. 1 oktav = spela Am i en oktav. 2 oktaver = hoppa upp och spela Am en oktav upp också.</p>`
      },
      {
        type: 'tip',
        label: 'MINIFREAK ARPEGGIATOR',
        html: `<p>Aktivera arpeggiatorn med <strong>ARP</strong>-knappen. Välj mönster och rate. Håll sedan ner ett ackord — Am (A+C+E) med Octave Range 2 och 1/16-rate är ett klassiskt synthwave-arpeggiorecept. Lägg till lite reverb och delay och det är klart!</p>`
      },
      {
        type: 'text',
        html: `<h3>16-stegs Sequencer</h3>
<p>MiniFreaks sequencer låter dig spela in en 16-steg-melodilur och loopa den. Det är mer flexibelt än arpeggiatorn — varje steg kan ha sin egen not, velocity och länk till nästa steg.</p>
<p>Grundläggande workflow:<br>
1. Tryck <strong>SEQ</strong>-knappen<br>
2. Välj startsteg och aktivera steg med de 16 tangentknapparna på tangentbordet<br>
3. Mata in noter för varje steg<br>
4. Tryck <strong>Play</strong> och lyssna på loopen</p>`
      },
      {
        type: 'piano',
        config: {
          defaultWave: 'sawtooth',
          showWaveSelector: false,
          octaves: 2,
          startOctave: 4,
          highlightKeys: ['A4', 'C5', 'E5', 'A5'],
          caption: 'Prova att spela Am-arpeggiot manuellt: A4–C5–E5–A5 upprepat, snabbt och rytmiskt'
        }
      },
      { type: 'quiz' }
    ],
    quiz: {
      questions: [
        {
          text: 'Vad gör en arpeggiator?',
          options: ['Spelar ett ackords noter simultant', 'Spelar ett ackords noter en i taget i ett mönster', 'Lägger till reverb på ackord', 'Transponerar ackord upp en oktav'],
          correctIndex: 1,
          explanation: 'En arpeggiator tar ett ackord och spelar dess noter sekventiellt (en i taget) i ett mönster — upp, ner, upp-ner, osv — för att skapa rytmiska melodimönster.'
        },
        {
          text: 'Vilket arpeggio-mönster spelar noterna från lägsta till högsta?',
          options: ['DOWN', 'UP-DOWN', 'RANDOM', 'UP'],
          correctIndex: 3,
          explanation: 'UP-mönstret spelar noterna uppifrån grunden till toppen: lägsta noten först, sedan uppåt till den högsta.'
        },
        {
          text: 'Varför syncar man arpeggiatorns rate till låtens BPM?',
          options: ['Det är obligatoriskt', 'Det gör att arpeggiot följer låtens rytmiska grid och låter musikalt', 'Det påverkar inte ljudet', 'Det ökar hastigheten'],
          correctIndex: 1,
          explanation: 'BPM-sync gör att varje arpeggio-steg faller på en exakt taktdel (1/8, 1/16, etc.), vilket gör att arpeggiot låter som en del av musiken snarare än som ett slumpmässigt mönster.'
        },
        {
          text: 'Skillnaden mellan arpeggiator och sequencer?',
          options: ['De är identiska', 'Arpeggiatorn genererar mönster ur hållna ackord; sequencern spelar in en förprogrammerad melodislinga', 'Sequencern är snabbare', 'Arpeggiatorn har fler steg'],
          correctIndex: 1,
          explanation: 'Arpeggiatorn tar ett hållet ackord och genererar ett mönster dynamiskt. Sequencern låter dig spela in en specifik melodislinga med upp till 16 steg som sedan loopar.'
        }
      ],
      passingScore: 3
    }
  },

  // ════════════════════════════════════════════════════════════
  // MODUL 6 — Din Första Låt
  // ════════════════════════════════════════════════════════════

  15: {
    id: 15, moduleId: 6,
    title: 'Låtstruktur',
    subtitle: 'Intro, vers, refräng — hur du bygger en synthwave-låt',
    tags: ['Komposition', 'Struktur'],
    estimatedMinutes: 12,
    blocks: [
      {
        type: 'text',
        html: `<p>En låt utan struktur är bara ett ljud-experiment. Struktur ger lyssnaren en resa — det skapar förväntning, klimax och avslut. Den goda nyheten: <strong>synthwave-låtar följer ofta enkla, tydliga strukturer</strong>.</p>`
      },
      {
        type: 'text',
        html: `<h3>Grundstrukturen</h3>
<p>En klassisk synthwave-låt ser ofta ut så här:</p>
<ul>
<li><strong>Intro</strong> (8–16 takter) — Paden presenterar sig. Filtret är stängt, öppnar sig gradvis. Skapar förväntan.</li>
<li><strong>Vers A</strong> (16 takter) — Leadet presenterar temat/melodin. Bas och trummor läggs till.</li>
<li><strong>Brygga / Pre-refräng</strong> (8 takter) — Energin byggs upp. Kanske en arpeggio-figur.</li>
<li><strong>Refräng</strong> (16 takter) — Allt exploderar: full mix, lead på topp, pads under.</li>
<li><strong>Vers B</strong> (16 takter) — Melodin återkommer med variation.</li>
<li><strong>Refräng × 2</strong> — Starkare, kanske en extra oktav upp.</li>
<li><strong>Outro</strong> (8–16 takter) — Strippas ner gradvis, filtret stängs.</li>
</ul>`
      },
      {
        type: 'tip',
        label: 'SPÄNNING & UPPLÖSNING',
        html: `<p>Spänning byggs upp av: tätare arpeggio, högre frekvenser, öppnat filter, fler element.<br>
Upplösning sker i: refrängen, pauser, ett enkelt pad-ackord utan lead.<br>
Alternerandet mellan spänning och upplösning är <strong>hela hemligheten</strong> bakom att en låt känns engagerande.</p>`
      },
      {
        type: 'text',
        html: `<h3>Takter och BPM</h3>
<p>Synthwave kör typiskt <strong>80–120 BPM</strong> (slag per minut). 100 BPM är en bra startpunkt. En takt är 4 slag. 8 takter = en typisk fras. 16 takter = en typisk sektion.</p>
<p>Räkna: Intro 16 takter × 4 slag × (60/100 sek/slag) ≈ 38 sekunder. Hela låten med strukturen ovan ≈ 3–4 minuter — klassisk poplängd.</p>`
      },
      {
        type: 'text',
        html: `<h3>Layers — Lägg till instrument gradvis</h3>
<p>Synthwave-låtar byggs ofta upp i lager. Börja spartanskt och lägg till element gradvis:</p>
<ol>
<li>Pad (ackordprogressionen)</li>
<li>Bas (enkel grundton på taktslagen)</li>
<li>Trummor (kick + snare)</li>
<li>Lead (melodin)</li>
<li>Arpeggio (rytmisk textur)</li>
<li>Counter-melody (svar på leadet)</li>
</ol>`
      },
      {
        type: 'tip',
        label: 'DAW ELLER HÅRDVARA?',
        html: `<p>MiniFreak kan spela sina lager med den inbyggda sequencern och arpeggiatorn, men för en komplett låt behöver du troligtvis en DAW (Digital Audio Workstation) som Ableton Live, Logic Pro eller FL Studio. MiniFreak ansluts via MIDI eller USB och spelar in exakt som du klickar på tangenterna.</p>`
      },
      { type: 'quiz' }
    ],
    quiz: {
      questions: [
        {
          text: 'Vilken BPM är typisk för synthwave?',
          options: ['40–60 BPM', '80–120 BPM', '140–180 BPM', '200–240 BPM'],
          correctIndex: 1,
          explanation: 'Synthwave ligger typiskt i 80–120 BPM — tillräckligt energetisk för dans men inte för snabb för den drömska, svävande känslan. 100 BPM är ett vanligt startläge.'
        },
        {
          text: 'Hur många slag är en takt i 4/4-takt (vilket är standard)?',
          options: ['2', '3', '4', '8'],
          correctIndex: 2,
          explanation: '4/4-takt (vanligaste taktsignaturen i pop och elektronisk musik) har 4 slag per takt. 4/4 = täljare 4 slag, nämnare 4:e nottypen (fjärdedelsnot).'
        },
        {
          text: 'I vilket avsnitt av en synthwave-låt "exploderar" vanligtvis allt?',
          options: ['Intro', 'Vers A', 'Refräng', 'Outro'],
          correctIndex: 2,
          explanation: 'Refrängen är låtens klimax — här är allt med: lead, pad, bas, trummor, arpeggio. Det är det ögonblicket lyssnaren väntat på sedan introt.'
        },
        {
          text: 'Vad är "layering" i en låtproduktion?',
          options: ['Att lägga alla instrument direkt från start', 'Att gradvis lägga till instrument och element för att bygga upp energi', 'Att ta bort instrument under refrängen', 'Att spela alla instrument i samma frekvensregister'],
          correctIndex: 1,
          explanation: 'Layering = att lägga till instrument och element gradvis under låten, vilket skapar en känsla av uppbyggnad och energi — från sparse intro till full refräng.'
        }
      ],
      passingScore: 3
    }
  },

  16: {
    id: 16, moduleId: 6,
    title: 'Sätt Ihop Allt',
    subtitle: 'Din första produktion — ett komplett minirecept',
    tags: ['Komposition', 'Produktion', 'Slutprojekt'],
    estimatedMinutes: 15,
    blocks: [
      {
        type: 'text',
        html: `<p>Du har lärt dig allt du behöver. Nu är det dags att <strong>skapa din första låt</strong>. Vi gör en enkel 2-minuters synthwave-skiss med tre element: pad, lead och arpeggio. Allt i A-moll, progressionen Am–F–C–G.</p>`
      },
      {
        type: 'tip',
        label: 'INGET PERFEKT',
        html: `<p>Din första låt behöver inte vara perfekt — den behöver bara <em>existera</em>. Varje producent du beundrar har en skrattretande hemsk första låt som de aldrig visar någon. Fokus: ha kul och avsluta något.</p>`
      },
      {
        type: 'text',
        html: `<h3>Steg 1: Paden — Grunden</h3>
<p>Börja med progressionen. Skapa ett mjukt pad-ljud (se Lektion 13). Programmera Am–F–C–G-progressionen med 4 takter per ackord = en loop på 16 takter à 100 BPM (~38 sekunder per omgång).</p>
<p>Recept: SAW × 2, LP-filter 50%, Cutoff stängt i intro (20%), öppnar gradvis. Attack 800ms, Release 2s.</p>`
      },
      {
        type: 'text',
        html: `<h3>Steg 2: Leaden — Melodin</h3>
<p>Spela en enkel melodi med pentatonisk A-moll över din pad. Enkelt är bäst — 4–8 noter som upprepas med variationer. Exempel på en enkel melodi:</p>`
      },
      {
        type: 'piano',
        config: {
          defaultWave: 'sawtooth',
          showWaveSelector: false,
          octaves: 2,
          startOctave: 4,
          highlightKeys: ['A4', 'G4', 'E4', 'D4', 'C5', 'A4', 'G4', 'E4'],
          caption: 'En enkel 8-notsmelodi i A pentatonisk moll — spela den uppifrån och lyssna!'
        }
      },
      {
        type: 'text',
        html: `<p>Melodin: A4 – G4 – E4 – D4 – C5 – A4 – G4 – E4 (upprepa). Enkelt, men det funkar. Lägg till detunat OSC B, Reverb 40%, Delay 1/8 sync.</p>
<h3>Steg 3: Arpeggiot — Rörelsen</h3>
<p>Aktivera arpeggiatorn (ARP-knappen på MiniFreak). Håll Am-ackordet (A+C+E), sätt Rate till 1/8-note, Octave Range 2, Pattern: UP. Nu har du den klassiska rörliga arpeggio-texturen.</p>`
      },
      {
        type: 'text',
        html: `<h3>Steg 4: Bygg Strukturen</h3>
<ol>
<li><strong>Intro (0:00–0:30)</strong>: Bara paden, filter stängt och öppnar sig gradvis.</li>
<li><strong>Vers (0:30–1:00)</strong>: Lägg till leaden. Spela melodin.</li>
<li><strong>Build (1:00–1:15)</strong>: Lägg till arpeggiot. Energin stiger.</li>
<li><strong>Klimax (1:15–1:45)</strong>: Allt ihop. Kanske ett extra pad-lager en oktav upp.</li>
<li><strong>Outro (1:45–2:00)</strong>: Ta bort leaden, bara pad och arpeggio, sedan bara pad.</li>
</ol>`
      },
      {
        type: 'tip',
        label: 'NÄSTA STEG',
        html: `<p>När du är klar med grundskissen: lägg till en enkel kick-trumma (808-kick på varje 4/4-slag), experimentera med filtersvep i transitions, och testa att transponera melodin en oktav upp i klimaxet. Du är en synthwave-producent!</p>`
      },
      {
        type: 'text',
        html: `<h3>Gratulerar! Du är klar!</h3>
<p>Du har gått igenom hela Synth School och lärt dig:</p>
<ul>
<li>Hur ljud och vågformer fungerar</li>
<li>Subtractive synthesis och signalkedjan</li>
<li>Musikteori: noter, skalor och ackordprogressioner</li>
<li>Arturia MiniFreaks alla sektioner</li>
<li>Oscillatorer, filter, ADSR, LFO och effekter</li>
<li>Hur man skapar leads, pads och arpeggios i synthwave-stil</li>
<li>Grundläggande låtstruktur och produktionsteknik</li>
</ul>
<p>Det enda som återstår: <strong>öppna din MiniFreak och börja spela.</strong></p>`
      },
      { type: 'quiz' }
    ],
    quiz: {
      questions: [
        {
          text: 'I vilken ordning bör du typiskt bygga upp elementen i en synthwave-skiss?',
          options: ['Lead → Pad → Arpeggio → Bas', 'Pad (grund) → Lead (melodi) → Arpeggio (rörelse)', 'Trummor → Bas → Lead → Pad', 'Arpeggio → Lead → Pad → Effekter'],
          correctIndex: 1,
          explanation: 'Börja med paden som harmonisk grund, lägg sedan till lead-melodin, sedan arpeggiot för rörelse. Bas och trummor kan läggas till sist för att inte dominera designprocessen.'
        },
        {
          text: 'Am–F–C–G är en progression i?',
          options: ['C-dur', 'D-moll', 'A-moll', 'E-moll'],
          correctIndex: 2,
          explanation: 'Am–F–C–G är progressionen i–VI–III–VII i A-moll. Am är tonika (grundackordet) och bekräftar tonarten A-moll.'
        },
        {
          text: 'Vilket av dessa påståenden om synthwave-produktion är sant?',
          options: ['Mer komplexa melodier är alltid bättre', 'Enkel och repetitiv melodi + bra sound design = funkar oftast', 'Du behöver lång erfarenhet innan du kan göra en hel låt', 'Reverb och delay bör undvikas'],
          correctIndex: 1,
          explanation: 'Synthwave handlar om känsla och sound design snarare än melodisk komplexitet. En enkel, catchy fras med rätt ljud, effekter och progression slår alltid en komplex melodi med dåligt ljud.'
        },
        {
          text: 'Vad är det viktigaste rådet för din första låt?',
          options: ['Den ska vara perfekt innan du delar den', 'Lägg mer än en månad på varje parameter', 'Avsluta den — ett färdigt projekt är alltid bättre än ett ofärdigt', 'Kopiera exakt ett befintligt musikstycke'],
          correctIndex: 2,
          explanation: 'Den viktigaste vanan i musikproduktion: avsluta projekt. En hel, imperfekt låt lär dig mer och ger mer tillfredsställelse än tio halvfärdiga. "Done is better than perfect."'
        }
      ],
      passingScore: 3
    }
  },

}; // end LESSONS
