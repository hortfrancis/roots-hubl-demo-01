import { useState } from 'react';
import type { RealtimeItem } from '@openai/agents/realtime';

function HistoryItem({ item }: { item: RealtimeItem }) {
  if (item.type === 'message') {
    const role = item.role;
    const text = item.content?.[0]
      ? ('transcript' in item.content[0] ? item.content[0].transcript : null)
        ?? ('text' in item.content[0] ? item.content[0].text : null)
        ?? '...'
      : '...';

    const bgColor = role === 'user' ? 'bg-blue-50 border-blue-200' : 'bg-stone-50 border-stone-200';
    const label = role === 'user' ? 'You' : 'Roots';

    return (
      <div className={`p-2 rounded border ${bgColor} text-xs`}>
        <span className="font-semibold text-stone-600">{label}:</span>{' '}
        <span className="text-stone-700">{text}</span>
        {'status' in item && item.status === 'in_progress' && <span className="text-amber-500 ml-1">...</span>}
      </div>
    );
  }

  if (item.type === 'function_call') {
    return (
      <div className="p-2 rounded border border-purple-200 bg-purple-50 text-xs font-mono">
        <span className="font-semibold text-purple-600">tool: {item.name}</span>
        <div className="text-purple-500 mt-0.5 break-all">{item.arguments?.slice(0, 120)}</div>
        {item.output && (
          <div className="text-purple-400 mt-0.5 break-all">{'\u2192'} {item.output.slice(0, 80)}</div>
        )}
      </div>
    );
  }

  return null;
}

interface ConversationHistoryPanelProps {
  history: RealtimeItem[];
  defaultOpen?: boolean;
}

export default function ConversationHistoryPanel({ history, defaultOpen = false }: ConversationHistoryPanelProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = history.map(item => {
      if (item.type === 'message') {
        const role = item.role === 'user' ? 'You' : item.role === 'assistant' ? 'Roots' : 'System';
        const content = item.content?.[0]
          ? ('transcript' in item.content[0] ? item.content[0].transcript : null)
            ?? ('text' in item.content[0] ? item.content[0].text : null)
            ?? ''
          : '';
        return `[${role}] ${content}`;
      }
      if (item.type === 'function_call') {
        return `[Tool: ${item.name}] args: ${item.arguments ?? ''} \u2192 ${item.output ?? ''}`;
      }
      return `[${item.type}]`;
    }).join('\n');
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
        Conversation History ({history.length})
        <span>{open ? '\u25BC' : '\u25B6'}</span>
      </button>
      {open && (
        <div>
          <div className="flex justify-end px-2 py-1 bg-stone-50 border-b border-stone-200">
            <button
              onClick={handleCopy}
              className="text-[10px] text-stone-400 hover:text-stone-600 bg-transparent border-none cursor-pointer"
            >
              {copied ? '\u2713 Copied' : 'Copy'}
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto p-2 bg-white space-y-1.5">
            {history.length === 0 && (
              <div className="text-xs text-stone-400 italic">No history yet...</div>
            )}
            {history.map((item, i) => (
              <HistoryItem key={i} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
