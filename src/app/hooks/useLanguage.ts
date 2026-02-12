import { useState } from 'react';
import { LANGUAGES, type LanguageConfig } from '../data/languages';

const STORAGE_KEY = 'roots-language';

function useLanguage() {
  const [langCode, setLangCode] = useState<string | null>(
    () => localStorage.getItem(STORAGE_KEY)
  );

  const setLanguage = (code: string) => {
    localStorage.setItem(STORAGE_KEY, code);
    setLangCode(code);
  };

  const clearLanguage = () => {
    localStorage.removeItem(STORAGE_KEY);
    setLangCode(null);
  };

  const language: LanguageConfig | null = LANGUAGES.find(l => l.code === langCode) ?? null;

  return { language, setLanguage, clearLanguage, langCode };
}

export default useLanguage;
