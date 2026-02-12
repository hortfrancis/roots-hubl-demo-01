import type { LanguageConfig } from '../data/languages';

interface HomeScreenProps {
  language: LanguageConfig;
  onNavigate: (screen: 'practice' | 'help') => void;
  onChangeLanguage: () => void;
}

export default function HomeScreen({ language, onNavigate, onChangeLanguage }: HomeScreenProps) {
  const { ui, direction } = language;

  return (
    <div className="flex flex-col items-center min-h-dvh px-4 py-8" dir={direction}>
      <header className="text-center mb-10">
        <h1 className="text-3xl font-bold text-stone-800 mb-1">
          <span className="mr-2">🌱</span>Roots
        </h1>
        <p className="text-sm text-stone-500">{ui.appSubtitle}</p>
      </header>

      <section className="w-full max-w-sm">
        <h2 className="text-base font-medium text-stone-600 mb-5 text-center">
          {ui.whatWouldYouLikeToDo}
        </h2>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => onNavigate('practice')}
            className="w-full flex items-start gap-4 px-5 py-5 bg-white border border-stone-200 rounded-xl text-left hover:border-emerald-400 hover:bg-emerald-50 transition-colors cursor-pointer"
          >
            <span className="text-2xl mt-0.5">🗣️</span>
            <div>
              <div className="font-semibold text-stone-800">{ui.practiceSpeaking}</div>
              <div className="text-sm text-stone-500 mt-1">{ui.practiceSpeakingDesc}</div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('help')}
            className="w-full flex items-start gap-4 px-5 py-5 bg-white border border-stone-200 rounded-xl text-left hover:border-emerald-400 hover:bg-emerald-50 transition-colors cursor-pointer"
          >
            <span className="text-2xl mt-0.5">🆘</span>
            <div>
              <div className="font-semibold text-stone-800">{ui.helpSupport}</div>
              <div className="text-sm text-stone-500 mt-1">{ui.helpSupportDesc}</div>
            </div>
          </button>
        </div>
      </section>

      <footer className="mt-auto pt-8">
        <button
          onClick={onChangeLanguage}
          className="text-sm text-stone-400 hover:text-stone-600 underline underline-offset-2 bg-transparent border-none cursor-pointer"
        >
          {ui.changeLanguage}
        </button>
      </footer>
    </div>
  );
}
