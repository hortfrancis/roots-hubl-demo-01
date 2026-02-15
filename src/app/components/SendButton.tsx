import { PaperPlaneTilt } from '@phosphor-icons/react';

interface SendButtonProps {
  onSend: () => void;
  label: string;
  disabled?: boolean;
}

export default function SendButton({ onSend, label, disabled }: SendButtonProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={onSend}
        disabled={disabled}
        className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors cursor-pointer border-none ${
          disabled
            ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700'
        }`}
        aria-label={label}
      >
        <PaperPlaneTilt size={28} weight="bold" />
      </button>
      <span className={`text-xs font-medium ${disabled ? 'text-stone-400' : 'text-blue-600'}`}>
        {label}
      </span>
    </div>
  );
}
