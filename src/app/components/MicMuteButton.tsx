import { Microphone, MicrophoneSlash } from '@phosphor-icons/react';

interface MicMuteButtonProps {
  isMuted: boolean;
  onToggle: () => void;
  labels: { muted: string; unmuted: string };
}

export default function MicMuteButton({ isMuted, onToggle, labels }: MicMuteButtonProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={onToggle}
        className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors cursor-pointer border-none ${
          isMuted
            ? 'bg-red-500 text-white'
            : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
        }`}
        aria-label={isMuted ? labels.muted : labels.unmuted}
      >
        {isMuted ? (
          <MicrophoneSlash size={28} weight="bold" />
        ) : (
          <Microphone size={28} weight="bold" />
        )}
      </button>
      <span className={`text-xs ${isMuted ? 'text-red-500 font-medium' : 'text-stone-400'}`}>
        {isMuted ? labels.muted : labels.unmuted}
      </span>
    </div>
  );
}
