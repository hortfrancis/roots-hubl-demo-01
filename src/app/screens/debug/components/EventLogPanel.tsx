import { useState } from 'react';
import type { EventLogEntry } from '../../../hooks/useManualVoiceSession';

interface EventLogPanelProps {
  eventLog: EventLogEntry[];
  defaultOpen?: boolean;
}

export default function EventLogPanel({ eventLog, defaultOpen = false }: EventLogPanelProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = eventLog
      .map(e => {
        const tag = e.source === 'server' ? '[S]' : e.source === 'client' ? '[C]' : '[?]';
        return `${e.time} ${tag} ${e.event}${e.detail ? ' ' + e.detail : ''}`;
      })
      .join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="border border-stone-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-3 py-2 bg-stone-100 text-xs font-bold text-stone-600 flex justify-between items-center cursor-pointer border-none"
      >
        Event Log ({eventLog.length})
        <span>{open ? '\u25BC' : '\u25B6'}</span>
      </button>
      {open && (
        <div>
          <div className="flex justify-end px-2 py-1 bg-stone-800">
            <button
              onClick={handleCopy}
              className="text-[10px] text-stone-400 hover:text-green-400 bg-transparent border-none cursor-pointer"
            >
              {copied ? '\u2713 Copied' : 'Copy'}
            </button>
          </div>
          <div className="bg-stone-900 text-green-400 font-mono text-[10px] leading-tight max-h-64 overflow-y-auto p-2">
            {eventLog.length === 0 && (
              <div className="text-stone-500 italic">No events yet...</div>
            )}
            {eventLog.map((entry, i) => {
              const isServer = entry.source === 'server';
              const isClient = entry.source === 'client';
              const isUnknown = !isServer && !isClient;
              const tag = isServer ? '[S]' : isClient ? '[C]' : '[?]';
              const tagColor = isUnknown ? 'text-red-500' : isServer ? 'text-stone-500' : 'text-cyan-400';
              const eventColor = isUnknown ? 'text-red-400' : isServer ? 'text-yellow-300' : 'text-cyan-300';
              const detailColor = isUnknown ? 'text-red-300' : isServer ? 'text-green-300' : 'text-cyan-200';
              return (
                <div key={i} className="py-0.5">
                  <span className="text-stone-500">{entry.time}</span>{' '}
                  <span className={tagColor}>{tag}</span>{' '}
                  <span className={eventColor}>{entry.event}</span>
                  {entry.detail && (
                    <span className={`ml-1 ${detailColor}`}>{entry.detail.slice(0, 100)}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
