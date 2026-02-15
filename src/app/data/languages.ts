export interface LanguageConfig {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  direction: 'ltr' | 'rtl';
  ui: {
    appSubtitle: string;
    selectLanguage: string;
    whatWouldYouLikeToDo: string;
    practiceSpeaking: string;
    practiceSpeakingDesc: string;
    helpSupport: string;
    helpSupportDesc: string;
    changeLanguage: string;
    back: string;
    endSession: string;
    connecting: string;
    listening: string;
    currentPhrase: string;
    pronunciation: string;
    feedback: string;
    localProviders: string;
    micMuted: string;
    micUnmuted: string;
    settings: string;
    settingsDesc: string;
    voiceSettings: string;
    turnDetection: string;
    eagerness: string;
    silenceDuration: string;
    prefixPadding: string;
    threshold: string;
    noiseReduction: string;
    saveSettings: string;
    resetDefaults: string;
    pressToSend: string;
    pressToSendDesc: string;
    sendButton: string;
    speakThenSend: string;
  };
}

export const LANGUAGES: LanguageConfig[] = [
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    direction: 'rtl',
    ui: {
      appSubtitle: 'مساعدك في تعلم اللغة الإنجليزية',
      selectLanguage: 'اختر لغتك',
      whatWouldYouLikeToDo: 'ماذا تريد أن تفعل؟',
      practiceSpeaking: 'أريد أن أتدرب على التحدث بالإنجليزية',
      practiceSpeakingDesc: 'تدرب على النطق والمحادثة مع معلمك الذكي',
      helpSupport: 'أريد المساعدة والدعم',
      helpSupportDesc: 'ابحث عن دروس اللغة الإنجليزية والخدمات المحلية القريبة منك',
      changeLanguage: 'تغيير اللغة',
      back: 'رجوع',
      endSession: 'إنهاء الجلسة',
      connecting: 'جاري الاتصال...',
      listening: 'المعلم يستمع...',
      currentPhrase: 'العبارة الحالية',
      pronunciation: 'النطق',
      feedback: 'ملاحظات',
      localProviders: 'دروس اللغة الإنجليزية بالقرب منك',
      micMuted: 'الميكروفون مكتوم',
      micUnmuted: 'الميكروفون مفعل',
      settings: 'الإعدادات',
      settingsDesc: 'تعديل إعدادات الصوت والميكروفون',
      voiceSettings: 'إعدادات الصوت',
      turnDetection: 'كشف الدور',
      eagerness: 'الحساسية',
      silenceDuration: 'مدة الصمت',
      prefixPadding: 'وقت الانتظار',
      threshold: 'الحد الأدنى',
      noiseReduction: 'تقليل الضوضاء',
      saveSettings: 'حفظ الإعدادات',
      resetDefaults: 'إعادة التعيين',
      pressToSend: 'اضغط للإرسال',
      pressToSendDesc: 'يُنصح به في الأماكن الصاخبة أو عند استخدام مكبر الصوت',
      sendButton: 'إرسال',
      speakThenSend: 'تحدث، ثم اضغط إرسال',
    },
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    direction: 'ltr',
    ui: {
      appSubtitle: "Votre assistant d'apprentissage de l'anglais",
      selectLanguage: 'Choisissez votre langue',
      whatWouldYouLikeToDo: 'Que souhaitez-vous faire ?',
      practiceSpeaking: "Je veux pratiquer l'anglais",
      practiceSpeakingDesc: 'Pratiquez la prononciation et la conversation avec votre tuteur IA',
      helpSupport: "J'ai besoin d'aide et de soutien",
      helpSupportDesc: "Trouvez des cours d'anglais et des services locaux près de chez vous",
      changeLanguage: 'Changer de langue',
      back: 'Retour',
      endSession: 'Terminer la session',
      connecting: 'Connexion en cours...',
      listening: 'Le tuteur écoute...',
      currentPhrase: 'Phrase actuelle',
      pronunciation: 'Prononciation',
      feedback: 'Commentaires',
      localProviders: "Cours d'anglais près de chez vous",
      micMuted: 'Microphone coupé',
      micUnmuted: 'Microphone activé',
      settings: 'Paramètres',
      settingsDesc: 'Ajuster les paramètres audio et microphone',
      voiceSettings: 'Paramètres vocaux',
      turnDetection: 'Détection de tour',
      eagerness: 'Sensibilité',
      silenceDuration: 'Durée du silence',
      prefixPadding: 'Délai d\'attente',
      threshold: 'Seuil',
      noiseReduction: 'Réduction du bruit',
      saveSettings: 'Enregistrer',
      resetDefaults: 'Réinitialiser',
      pressToSend: 'Appuyer pour envoyer',
      pressToSendDesc: 'Recommandé dans les environnements bruyants ou avec haut-parleur',
      sendButton: 'Envoyer',
      speakThenSend: 'Parlez, puis appuyez sur Envoyer',
    },
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    direction: 'ltr',
    ui: {
      appSubtitle: 'Ihr Englisch-Lernassistent',
      selectLanguage: 'Wählen Sie Ihre Sprache',
      whatWouldYouLikeToDo: 'Was möchten Sie tun?',
      practiceSpeaking: 'Englisch sprechen üben',
      practiceSpeakingDesc: 'Üben Sie Aussprache und Konversation mit Ihrem KI-Tutor',
      helpSupport: 'Hilfe & Unterstützung',
      helpSupportDesc: 'Finden Sie Englischkurse und lokale Dienste in Ihrer Nähe',
      changeLanguage: 'Sprache ändern',
      back: 'Zurück',
      endSession: 'Sitzung beenden',
      connecting: 'Verbindung wird hergestellt...',
      listening: 'Tutor hört zu...',
      currentPhrase: 'Aktuelle Phrase',
      pronunciation: 'Aussprache',
      feedback: 'Feedback',
      localProviders: 'Englischkurse in Ihrer Nähe',
      micMuted: 'Mikrofon stumm',
      micUnmuted: 'Mikrofon aktiv',
      settings: 'Einstellungen',
      settingsDesc: 'Audio- und Mikrofoneinstellungen anpassen',
      voiceSettings: 'Spracheinstellungen',
      turnDetection: 'Sprecherkennung',
      eagerness: 'Empfindlichkeit',
      silenceDuration: 'Stille-Dauer',
      prefixPadding: 'Wartezeit',
      threshold: 'Schwellenwert',
      noiseReduction: 'Rauschunterdrückung',
      saveSettings: 'Speichern',
      resetDefaults: 'Zurücksetzen',
      pressToSend: 'Zum Senden drücken',
      pressToSendDesc: 'Empfohlen bei lauter Umgebung oder Freisprechen',
      sendButton: 'Senden',
      speakThenSend: 'Sprechen Sie, dann tippen Sie auf Senden',
    },
  },
];
