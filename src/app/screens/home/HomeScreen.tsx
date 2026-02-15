import type { LanguageConfig } from '../../data/languages';
import AppLayout from '../../components/AppLayout';
import ActionCard from './components/ActionCard';

interface HomeScreenProps {
  language: LanguageConfig;
  onNavigate: (screen: 'practice' | 'help' | 'debug' | 'settings') => void;
  onChangeLanguage: () => void;
}

export default function HomeScreen({ language, onNavigate, onChangeLanguage }: HomeScreenProps) {
  const { ui, direction } = language;

  return (
    <AppLayout
      header={
        <div className="flex items-center justify-center h-full" dir={direction}>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-stone-800 mb-1">
              <span className="mr-2">🌱</span>Roots
            </h1>
            <p className="text-sm text-stone-500">{ui.appSubtitle}</p>
          </div>
        </div>
      }
      main={
        <div className="flex flex-col items-center px-4 py-6" dir={direction}>
          <section className="w-full max-w-sm">
            <h2 className="text-base font-medium text-stone-600 mb-5 text-center">
              {ui.whatWouldYouLikeToDo}
            </h2>

            <div className="flex flex-col gap-4">
              <ActionCard
                icon="🗣️"
                title={ui.practiceSpeaking}
                description={ui.practiceSpeakingDesc}
                onClick={() => onNavigate('practice')}
              />
              <ActionCard
                icon="🆘"
                title={ui.helpSupport}
                description={ui.helpSupportDesc}
                onClick={() => onNavigate('help')}
              />
            </div>
          </section>

          <footer className="mt-auto pt-8 flex flex-col items-center gap-3">
            <button
              onClick={onChangeLanguage}
              className="text-sm text-stone-400 hover:text-stone-600 underline underline-offset-2 bg-transparent border-none cursor-pointer"
            >
              {ui.changeLanguage}
            </button>
            <button
              onClick={() => onNavigate('settings')}
              className="text-xs text-stone-400 hover:text-stone-600 bg-transparent border-none cursor-pointer"
              aria-label={ui.settings}
            >
              ⚙️ {ui.settings}
            </button>
            <button
              onClick={() => onNavigate('debug')}
              className="text-xs text-stone-300 hover:text-stone-500 bg-transparent border-none cursor-pointer"
              aria-label="Debug console"
            >
              🛠️ Debug
            </button>
          </footer>
        </div>
      }
    />
  );
}
