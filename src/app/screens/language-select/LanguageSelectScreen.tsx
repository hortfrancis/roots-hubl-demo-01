import { LANGUAGES } from '../../data/languages';

interface LanguageSelectScreenProps {
  onSelectLanguage: (code: string) => void;
}

const NAME = 'roots-language-select-screen';

export default function LanguageSelectScreen({ onSelectLanguage }: LanguageSelectScreenProps) {
  return (
    <div
      className="flex flex-col items-center min-h-dvh px-4 py-8"
      data-component={NAME}
    >
      <header className="text-center mb-10">
        <h1 className="text-3xl font-bold text-stone-800 mb-1">
          <span className="mr-2">🌱</span>Roots
        </h1>
        <p className="text-sm text-stone-500">Demo for HubL (Feb 2026)</p>
      </header>

      <section className="w-full max-w-sm">
        <h2 className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-4 text-center">
          Select your language
        </h2>

        <div className="flex flex-col gap-3">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => onSelectLanguage(lang.code)}
              className="w-full flex items-center gap-4 px-5 py-4 bg-white border border-stone-200 rounded-xl text-left hover:border-emerald-400 hover:bg-emerald-50 transition-colors cursor-pointer"
            >
              <span className="text-2xl">{lang.flag}</span>
              <div>
                <span className="font-medium text-stone-800">{lang.name}</span>
                <span className="text-stone-400 mx-2">·</span>
                <span className="text-stone-600">{lang.nativeName}</span>
              </div>
            </button>
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
  );
}
