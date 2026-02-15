interface LanguageButtonProps {
  flag: string;
  name: string;
  nativeName: string;
  onClick: () => void;
}

export default function LanguageButton({ flag, name, nativeName, onClick }: LanguageButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 px-5 py-4 bg-white border border-stone-200 rounded-xl text-left hover:border-emerald-400 hover:bg-emerald-50 transition-colors cursor-pointer"
    >
      <span className="text-2xl">{flag}</span>
      <div>
        <span className="font-medium text-stone-800">{name}</span>
        <span className="text-stone-400 mx-2">&middot;</span>
        <span className="text-stone-600">{nativeName}</span>
      </div>
    </button>
  );
}
