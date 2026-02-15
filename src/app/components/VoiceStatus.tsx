import type { ConnectionStatus } from '../hooks/useRealtimeAgent';

interface VoiceStatusProps {
  status: ConnectionStatus;
  labels: {
    connecting: string;
    listening: string;
  };
  pressToSendLabel?: string;
}

export default function VoiceStatus({ status, labels, pressToSendLabel }: VoiceStatusProps) {
  const dotColor = status === 'connected'
    ? 'bg-emerald-500'
    : status === 'connecting'
      ? 'bg-amber-400'
      : 'bg-red-500';

  const label = status === 'connected'
    ? (pressToSendLabel ?? labels.listening)
    : status === 'connecting'
      ? labels.connecting
      : 'Error';

  return (
    <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-stone-100 w-fit mx-auto">
      <span className={`w-2.5 h-2.5 rounded-full ${dotColor} ${status === 'connected' ? 'animate-pulse' : ''}`} />
      <span className="text-sm text-stone-600">{label}</span>
    </div>
  );
}
