import clsx from 'clsx';
import { Microphone } from '@phosphor-icons/react';

interface PressToSpeakProps {
  onPressStart?: () => void;
  onPressEnd?: () => void;
  isPressed?: boolean;
  disabled?: boolean;
}

export default function PressToSpeak({
  onPressStart,
  onPressEnd,
  isPressed = false,
  disabled = false,
}: PressToSpeakProps) {
  return (
    <div
      data-component="press-to-speak"
      className={clsx(
        'flex items-center justify-center',
        'h-full p-3',
        'bg-gray-200',
      )}
    >
      <button
        type="button"
        disabled={disabled}
        onPointerDown={disabled ? undefined : onPressStart}
        onPointerUp={disabled ? undefined : onPressEnd}
        onPointerLeave={disabled ? undefined : onPressEnd}
        className={clsx(
          'rounded-full aspect-square w-full max-w-[120px]',
          'flex items-center justify-center',
          'transition-colors duration-150',
          'select-none touch-none',
          disabled && 'bg-gray-400 text-gray-600 cursor-not-allowed',
          !disabled && !isPressed && 'bg-amber-500 text-white active:bg-amber-700',
          !disabled && isPressed && 'bg-amber-700 text-white scale-95',
        )}
      >
        <Microphone size={36} weight={isPressed ? 'fill' : 'regular'} />
      </button>
    </div>
  );
}
