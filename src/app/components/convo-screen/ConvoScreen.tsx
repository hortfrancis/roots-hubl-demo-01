import { useState, useCallback } from 'react';
import ConvoScreenLayout from './ConvoScreenLayout';
import Header from './Header';
import Footer from './Footer';
import ConvoStatus from './ConvoStatus';
import PressToSpeak from './PressToSpeak';
import type { ConvoStatusValue } from './ConvoStatus';

export default function ConvoScreen() {
  const [status, setStatus] = useState<ConvoStatusValue>('idle');
  const [isPressed, setIsPressed] = useState(false);

  const handlePressStart = useCallback(() => {
    setIsPressed(true);
    setStatus('listening');
  }, []);

  const handlePressEnd = useCallback(() => {
    setIsPressed(false);
    setStatus('thinking');
    // Simulate AI processing, then return to idle
    setTimeout(() => setStatus('idle'), 1500);
  }, []);

  return (
    <ConvoScreenLayout
      header={<Header />}
      main={
        <div className="flex items-center justify-center h-full text-gray-400">
          [Main Content Area]
        </div>
      }
      footer={
        <Footer
          statusPanel={<ConvoStatus status={status} />}
          actionPanel={
            <PressToSpeak
              isPressed={isPressed}
              onPressStart={handlePressStart}
              onPressEnd={handlePressEnd}
            />
          }
        />
      }
    />
  );
}
