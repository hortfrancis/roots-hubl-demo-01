import { useState } from 'react';
import { useLanguage, useVoiceSettings } from './hooks';
import LanguageSelectScreen from './components/LanguageSelectScreen';
import HomeScreen from './components/HomeScreen';
import PracticeSpeakingScreen from './components/PracticeSpeakingScreen';
import HelpSupportScreen from './components/HelpSupportScreen';
import DebugScreen from './components/DebugScreen';
import SettingsScreen from './components/SettingsScreen';

// Temp while I figure this out with my meat brain 
import DemoUI01 from './components/ConvoScreenWireframe';

type Screen = 'language-select' | 'home' | 'practice' | 'help' | 'debug' | 'settings';

function App() {
  const { language, setLanguage, clearLanguage } = useLanguage();
  const { savedConfig, saveConfig, resetToFactoryDefaults } = useVoiceSettings();
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
    return <PracticeSpeakingScreen language={language} voiceConfig={savedConfig} onBack={handleBack} />;
  }

  if (screen === 'help') {
    return <HelpSupportScreen language={language} voiceConfig={savedConfig} onBack={handleBack} />;
  }

  if (screen === 'debug') {
    return (
      <DebugScreen
        language={language}
        savedConfig={savedConfig}
        onSaveConfig={saveConfig}
        onBack={handleBack}
      />
    );
  }

  if (screen === 'settings') {
    return (
      <SettingsScreen
        language={language}
        savedConfig={savedConfig}
        onSave={saveConfig}
        onResetDefaults={resetToFactoryDefaults}
        onBack={handleBack}
      />
    );
  }

  return (

    <DemoUI01 />


    // <HomeScreen
    //   language={language}
    //   onNavigate={(s) => setScreen(s)}
    //   onChangeLanguage={handleChangeLanguage}
    // />
  );
}

export default App;
