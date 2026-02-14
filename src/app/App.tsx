import { useState } from 'react';
import { useLanguage } from './hooks';
import LanguageSelectScreen from './components/LanguageSelectScreen';
import HomeScreen from './components/HomeScreen';
import PracticeSpeakingScreen from './components/PracticeSpeakingScreen';
import HelpSupportScreen from './components/HelpSupportScreen';
import DebugScreen from './components/DebugScreen';

type Screen = 'language-select' | 'home' | 'practice' | 'help' | 'debug';

function App() {
  const { language, setLanguage, clearLanguage } = useLanguage();
  const [screen, setScreen] = useState<Screen>(language ? 'home' : 'language-select');

  const handleSelectLanguage = (code: string) => {
    setLanguage(code);
    setScreen('home');
  };

  const handleChangeLanguage = () => {
    clearLanguage();
    setScreen('language-select');
  };

  const handleBack = () => {
    setScreen('home');
  };

  if (screen === 'language-select' || !language) {
    return <LanguageSelectScreen onSelectLanguage={handleSelectLanguage} />;
  }

  if (screen === 'practice') {
    return <PracticeSpeakingScreen language={language} onBack={handleBack} />;
  }

  if (screen === 'help') {
    return <HelpSupportScreen language={language} onBack={handleBack} />;
  }

  if (screen === 'debug') {
    return <DebugScreen language={language} onBack={handleBack} />;
  }

  return (
    <HomeScreen
      language={language}
      onNavigate={(s) => setScreen(s)}
      onChangeLanguage={handleChangeLanguage}
    />
  );
}

export default App;
