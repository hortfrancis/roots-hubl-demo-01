import clsx from 'clsx';

export type ConvoStatusValue = 'idle' | 'listening' | 'thinking' | 'speaking';

interface ConvoStatusProps {
  status: ConvoStatusValue;
}

const STATUS_CONFIG: Record<ConvoStatusValue, { label: string; color: string }> = {
  idle: { label: 'Ready', color: 'bg-gray-400' },
  listening: { label: 'Listening...', color: 'bg-green-500' },
  thinking: { label: 'Thinking...', color: 'bg-yellow-500' },
  speaking: { label: 'Speaking...', color: 'bg-blue-500' },
};

export default function ConvoStatus({ status }: ConvoStatusProps) {
  const { label, color } = STATUS_CONFIG[status];

  return (
    <div
      data-component="convo-status"
      className={clsx(
        'flex items-center gap-3',
        'h-full px-4',
        'bg-gray-200',
      )}
    >
      <span className={clsx('w-3 h-3 rounded-full shrink-0', color)} />
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </div>
  );
}
