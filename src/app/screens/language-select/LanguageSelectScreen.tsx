import { LANGUAGES } from '../../data/languages';
import AppLayout from '../../components/AppLayout';
import LanguageButton from './components/LanguageButton';

interface LanguageSelectScreenProps {
  onSelectLanguage: (code: string) => void;
}

export default function LanguageSelectScreen({ onSelectLanguage }: LanguageSelectScreenProps) {
  return (
    <AppLayout
      header={
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-stone-800 mb-1">
              <span className="mr-2">🌱</span>Roots
            </h1>
            <p className="text-sm text-stone-500">Demo for HubL (Feb 2026)</p>
          </div>
        </div>
      }
      main={
        <div className="flex flex-col items-center px-4 py-6">
          <section className="w-full max-w-sm">
            <h2 className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-4 text-center">
              Select your language
            </h2>

            <div className="flex flex-col gap-3">
              {LANGUAGES.map((lang) => (
                <LanguageButton
                  key={lang.code}
                  flag={lang.flag}
                  name={lang.name}
                  nativeName={lang.nativeName}
                  onClick={() => onSelectLanguage(lang.code)}
                />
              ))}

              <button
                disabled
                className="w-full flex items-center gap-4 px-5 py-4 bg-stone-50 border border-stone-100 rounded-xl text-left opacity-50 cursor-not-allowed"
              >
                <span className="text-2xl">🌐</span>
                <span className="text-stone-400">More coming soon...</span>
              </button>
            </div>
          </section>
        </div>
      }
    />
  );
}
