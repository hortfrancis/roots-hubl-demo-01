import { useState } from 'react';
import type { ConvoStatusValue } from '../../../components/ConvoStatus';
import type { ConnectionStatus, SessionUsage } from '../../../hooks/useManualVoiceSession';

interface SessionStatusPanelProps {
  status: ConvoStatusValue;
  connectionStatus: ConnectionStatus;
  historyCount: number;
  usage: SessionUsage;
  defaultOpen?: boolean;
}

export default function SessionStatusPanel({
  status,
  connectionStatus,
  historyCount,
  usage,
  defaultOpen = false,
}: SessionStatusPanelProps) {
  const [open, setOpen] = useState(defaultOpen);
  const isMuted = status !== 'listening';

  return (
    <div className="border border-stone-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-3 py-2 bg-stone-100 text-xs font-bold text-stone-600 flex justify-between items-center cursor-pointer border-none"
      >
        Session Status
        <span>{open ? '\u25BC' : '\u25B6'}</span>
      </button>
      {open && (
        <div className="px-3 py-3 space-y-2 bg-white text-xs">
          <div className="flex justify-between">
            <span className="text-stone-500">Connection</span>
            <span className="font-mono">{connectionStatus}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Status</span>
            <span className="font-mono capitalize">{status}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Muted</span>
            <span className={`font-mono ${isMuted ? 'text-red-500' : 'text-emerald-600'}`}>
              {isMuted ? 'YES' : 'NO'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">History items</span>
            <span className="font-mono">{historyCount}</span>
          </div>
          <hr className="border-stone-100" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">Token Usage</h3>
          <div className="flex justify-between">
            <span className="text-stone-500">Requests</span>
            <span className="font-mono">{usage.requests}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Input</span>
            <span className="font-mono">{usage.inputTokens.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Output</span>
            <span className="font-mono">{usage.outputTokens.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-medium">
            <span className="text-stone-500">Total</span>
            <span className="font-mono">{usage.totalTokens.toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}
