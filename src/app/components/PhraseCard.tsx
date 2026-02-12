interface PhraseCardProps {
  englishText: string;
  phoneticText: string;
  nativeText: string;
  nativeLanguageLabel: string;
  direction?: 'ltr' | 'rtl';
}

export default function PhraseCard({
  englishText,
  phoneticText,
  nativeText,
  nativeLanguageLabel,
  direction = 'ltr',
}: PhraseCardProps) {
  if (!englishText && !phoneticText && !nativeText) {
    return null;
  }

  return (
    <div className="w-full p-4 bg-white border border-stone-200 rounded-xl">
      <dl className="space-y-3">
        <div className="space-y-0.5">
          <dt className="text-xs uppercase tracking-wider text-stone-400">English</dt>
          <dd className="text-base font-medium text-stone-800 break-words">
            {englishText}
          </dd>
        </div>

        <div className="space-y-0.5">
          <dt className="text-xs uppercase tracking-wider text-stone-400">Phonetic</dt>
          <dd className="text-base italic text-stone-600 break-words">
            {phoneticText}
          </dd>
        </div>

        <div className="space-y-0.5">
          <dt className="text-xs uppercase tracking-wider text-stone-400">{nativeLanguageLabel}</dt>
          <dd
            className="text-base text-stone-700 break-words"
            dir={direction}
          >
            {nativeText}
          </dd>
        </div>
      </dl>
    </div>
  );
}
