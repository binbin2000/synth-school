/* ============================================================
   i18n.js — Internationalisation: UI strings + lesson helpers
   ============================================================ */

var I18n = (() => {
  let _lang = 'sv';

  const strings = {
    sv: {
      // Progress
      progress_label:     (done, total) => `${done} / ${total} lektioner`,
      // Home
      hero_subtitle:      'Lär dig skapa synthwave med Arturia MiniFreak — från nybörjare till producent.',
      start_btn:          'BÖRJA LEKTION 1',
      continue_prefix:    'FORTSÄTT',
      // Lesson footer
      prev_btn:           '← FÖREGÅENDE',
      next_btn:           'NÄSTA LEKTION →',
      skip_btn:           'HOPPA ÖVER →',
      status_completed:   '✓ AVKLARAD',
      status_skipped:     '⤵ HOPPAD ÖVER',
      // Nav / sidebar
      sidebar_title:      'Visa/dölj lektionsmenyn',
      profile_btn_title:  'Byt profil',
      lang_btn_title:     'Byt språk / Change language',
      // Module cards
      module_label:       'MODUL',
      lessons_done:       (done, total) => `${done}/${total} lektioner klara`,
      // Piano overlay
      piano_title:        '♪ VIRTUELLT TANGENTBORD',
      wave_label:         'VÅG',
      octave_label:       'OKTAV',
      volume_label:       'VOLYM',
      piano_btn_title:    'Öppna virtuellt piano (♪)',
      // Module / course complete
      home_btn:           '← HEM',
      next_module_btn:    'NÄSTA MODUL →',
      module_done_title:  (n) => `Modul ${n} klar!`,
      module_done_next:   (title, nextId, nextTitle) => `Du har klarat "${title}". Nästa upp: Modul ${nextId} — ${nextTitle}.`,
      module_done_last:   (title) => `Du har klarat "${title}" och alla moduler! Dags att göra din första synthwave-låt.`,
      course_done_title:  'Kurs avklarad! ◈',
      course_done_text:   'Du har gått igenom hela Synth School! Öppna din MiniFreak och skapa din första synthwave-låt.',
      // Breadcrumb
      module_word:        'Modul',
      lesson_word:        'Lektion',
      // Profile screen
      profile_loading:    'Laddar…',
      who_plays:          'VEM SPELAR?',
      welcome:            'VÄLKOMMEN TILL SYNTH SCHOOL',
      first_hint:         'Skapa din första profil för att komma igång.',
      new_profile_card:   'NY PROFIL',
      new_profile_title:  'NY PROFIL',
      name_placeholder:   'Ditt namn…',
      cancel_btn:         'AVBRYT',
      create_btn:         'SKAPA →',
      back_btn:           '← TILLBAKA',
      delete_title:       'Ta bort profil',
      save_error:         'Kunde inte spara profilen.',
      private_warning:    'Progress kan inte sparas i privat läge.',
      // MiniFreak diagram
      mf_click_hint:      '← Klicka på en sektion ovan för att läsa om dess funktion.',
      mf_header:          'klicka på en sektion för detaljer',
      // Quiz
      quiz_title:         'Kunskapskoll',
      question_of:        (n, total) => `Fråga ${n} av ${total}`,
      correct:            '✓ Rätt!',
      incorrect:          '✗ Inte riktigt.',
      next_question:      'NÄSTA FRÅGA →',
      retry:              'FÖRSÖK IGEN',
      next_lesson:        'NÄSTA LEKTION →',
      finish_course:      'AVSLUTA KURSEN ◈',
      needs_score:        (passing, total) => `Du behöver ${passing}/${total} rätt för att låsa upp nästa lektion.`,
      fb_perfect:         'Perfekt! Du kan allt från den här lektionen!',
      fb_passed:          'Bra jobbat! Du klarade kunskapskollet.',
      fb_failed:          (got, total) => `Du fick ${got} av ${total} rätt. Repetera lektionen och försök igen!`,
    },

    en: {
      // Progress
      progress_label:     (done, total) => `${done} / ${total} lessons`,
      // Home
      hero_subtitle:      'Learn to create synthwave with Arturia MiniFreak — from beginner to producer.',
      start_btn:          'START LESSON 1',
      continue_prefix:    'CONTINUE',
      // Lesson footer
      prev_btn:           '← PREVIOUS',
      next_btn:           'NEXT LESSON →',
      skip_btn:           'SKIP →',
      status_completed:   '✓ COMPLETED',
      status_skipped:     '⤵ SKIPPED',
      // Nav / sidebar
      sidebar_title:      'Show/hide lesson menu',
      profile_btn_title:  'Switch profile',
      lang_btn_title:     'Byt språk / Change language',
      // Module cards
      module_label:       'MODULE',
      lessons_done:       (done, total) => `${done}/${total} lessons completed`,
      // Piano overlay
      piano_title:        '♪ VIRTUAL KEYBOARD',
      wave_label:         'WAVE',
      octave_label:       'OCTAVE',
      volume_label:       'VOLUME',
      piano_btn_title:    'Open virtual piano (♪)',
      // Module / course complete
      home_btn:           '← HOME',
      next_module_btn:    'NEXT MODULE →',
      module_done_title:  (n) => `Module ${n} complete!`,
      module_done_next:   (title, nextId, nextTitle) => `You completed "${title}". Next up: Module ${nextId} — ${nextTitle}.`,
      module_done_last:   (title) => `You completed "${title}" and all modules! Time to make your first synthwave track.`,
      course_done_title:  'Course Complete! ◈',
      course_done_text:   'You have completed all of Synth School! Open your MiniFreak and create your first synthwave track.',
      // Breadcrumb
      module_word:        'Module',
      lesson_word:        'Lesson',
      // Profile screen
      profile_loading:    'Loading…',
      who_plays:          'WHO\'S PLAYING?',
      welcome:            'WELCOME TO SYNTH SCHOOL',
      first_hint:         'Create your first profile to get started.',
      new_profile_card:   'NEW PROFILE',
      new_profile_title:  'NEW PROFILE',
      name_placeholder:   'Your name…',
      cancel_btn:         'CANCEL',
      create_btn:         'CREATE →',
      back_btn:           '← BACK',
      delete_title:       'Delete profile',
      save_error:         'Could not save profile.',
      private_warning:    'Progress cannot be saved in private mode.',
      // MiniFreak diagram
      mf_click_hint:      '← Click a section above to read about its function.',
      mf_header:          'click a section for details',
      // Quiz
      quiz_title:         'Knowledge Check',
      question_of:        (n, total) => `Question ${n} of ${total}`,
      correct:            '✓ Correct!',
      incorrect:          '✗ Not quite.',
      next_question:      'NEXT QUESTION →',
      retry:              'TRY AGAIN',
      next_lesson:        'NEXT LESSON →',
      finish_course:      'COMPLETE COURSE ◈',
      needs_score:        (passing, total) => `You need ${passing}/${total} correct to unlock the next lesson.`,
      fb_perfect:         'Perfect! You know everything from this lesson!',
      fb_passed:          'Well done! You passed the knowledge check.',
      fb_failed:          (got, total) => `You got ${got} of ${total} correct. Review the lesson and try again!`,
    },
  };

  function setLang(lang) {
    _lang = (lang === 'en') ? 'en' : 'sv';
  }

  function getLang() { return _lang; }

  function t(key, ...args) {
    const val = strings[_lang]?.[key] ?? strings.sv[key] ?? key;
    return typeof val === 'function' ? val(...args) : val;
  }

  function getLessons() {
    return (_lang === 'en' && window.LESSONS_EN) ? window.LESSONS_EN : window.LESSONS;
  }

  function getModules() {
    return (_lang === 'en' && window.MODULES_EN) ? window.MODULES_EN : window.MODULES;
  }

  return { setLang, getLang, t, getLessons, getModules };
})();
