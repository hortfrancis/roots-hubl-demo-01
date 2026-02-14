import { useEffect, useRef, useState, useCallback } from 'react';
import { RealtimeAgent, RealtimeSession } from '@openai/agents/realtime';
import type { RealtimeItem } from '@openai/agents/realtime';
import { logSessionHistory } from '../utils';
import {
  ASSISTANT_VOICE,
  DEFAULT_VOICE_CONFIG,
  buildAudioInputConfig,
  type VoiceSessionConfig,
} from '../agent/config';
import type { WorkerAPIResponseData } from '../../types';

export type RealtimeAgentTools = ConstructorParameters<typeof RealtimeAgent>[0]["tools"];

export type ConnectionStatus = 'connecting' | 'connected' | 'error';

export interface EventLogEntry {
  time: string;
  event: string;
  detail?: string;
}

export interface SessionUsage {
  requests: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
}

interface UseRealtimeAgentOptions {
  tools: RealtimeAgentTools;
  instructions: string;
  initialMessage?: string;
  voiceConfig?: VoiceSessionConfig;
}

function useRealtimeAgent(options: UseRealtimeAgentOptions) {
  const {
    tools,
    instructions,
    initialMessage,
    voiceConfig = DEFAULT_VOICE_CONFIG,
  } = options;

  const sessionRef = useRef<RealtimeSession | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');
  const [history, setHistory] = useState<RealtimeItem[]>([]);
  const [eventLog, setEventLog] = useState<EventLogEntry[]>([]);
  const [usage, setUsage] = useState<SessionUsage>({ requests: 0, inputTokens: 0, outputTokens: 0, totalTokens: 0 });

  const addEvent = useCallback((event: string, detail?: string) => {
    const time = new Date().toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setEventLog(prev => [{ time, event, detail }, ...prev].slice(0, 200));
  }, []);

  const toggleMute = useCallback(() => {
    const session = sessionRef.current;
    if (!session) return;

    setIsMuted(prev => {
      const newMuted = !prev;
      session.mute(newMuted);
      return newMuted;
    });
  }, []);

  const updateVoiceConfig = useCallback((newConfig: VoiceSessionConfig) => {
    const session = sessionRef.current;
    if (!session) return;

    try {
      const audioInput = buildAudioInputConfig(newConfig);
      // Update session config mid-session via transport layer
      (session.transport as unknown as {
        updateSessionConfig: (config: Record<string, unknown>) => void;
      }).updateSessionConfig({
        audio: { input: audioInput },
      });
      addEvent('config_updated', JSON.stringify(newConfig));
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      addEvent('config_update_error', msg);
      console.error('Failed to update voice config:', err);
    }
  }, [addEvent]);

  const refreshUsage = useCallback(() => {
    const session = sessionRef.current;
    if (!session) return;
    try {
      const u = session.usage;
      setUsage({
        requests: u.requests,
        inputTokens: u.inputTokens,
        outputTokens: u.outputTokens,
        totalTokens: u.totalTokens,
      });
    } catch {
      // usage may not be available yet
    }
  }, []);

  useEffect(() => {
    const agent = new RealtimeAgent({
      name: 'Roots',
      instructions,
      tools,
      voice: ASSISTANT_VOICE,
    });

    const audioInput = buildAudioInputConfig(voiceConfig);

    const session = new RealtimeSession(agent, {
      config: {
        audio: {
          input: audioInput,
        },
      },
    });
    sessionRef.current = session;
    setConnectionStatus('connecting');
    addEvent('session_created', `voice: ${ASSISTANT_VOICE}`);

    const connectSession = async () => {
      try {
        const response = await fetch('/api/ephemeral-key');
        const result: WorkerAPIResponseData = await response.json();
        if (result.error || !result.data) {
          throw new Error(result.error || "No data in response");
        }
        await session.connect({ apiKey: result.data.value });
        setConnectionStatus('connected');
        addEvent('connected');
      } catch (error) {
        console.error("Failed to connect session:", error);
        setConnectionStatus('error');
        addEvent('connection_error', error instanceof Error ? error.message : 'Unknown');
      }
    };

    connectSession()
      .then(() => {
        const msg = initialMessage || "[System Message] Conversation started. Please greet the user and introduce yourself.";
        session.sendMessage(msg);
        addEvent('initial_message_sent');
      });

    // ── Event listeners ──────────────────────────────────────────

    session.on('history_updated', (h) => {
      logSessionHistory(h);
      setHistory([...h]);
      refreshUsage();
    });

    session.on('agent_start', () => {
      addEvent('agent_start');
      refreshUsage();
    });

    session.on('agent_end', () => {
      addEvent('agent_end');
      refreshUsage();
    });

    session.on('audio_start', () => {
      addEvent('audio_start', 'Agent speaking');
    });

    session.on('audio_stopped', () => {
      addEvent('audio_stopped', 'Agent stopped');
    });

    session.on('audio_interrupted', () => {
      addEvent('audio_interrupted', 'Agent interrupted');
    });

    session.on('agent_tool_start', (_ctx, _agent, tool) => {
      addEvent('tool_start', tool.name);
    });

    session.on('agent_tool_end', (_ctx, _agent, tool, result) => {
      const short = typeof result === 'string' ? result.slice(0, 80) : '';
      addEvent('tool_end', `${tool.name}: ${short}`);
    });

    session.on('error', (err) => {
      addEvent('error', JSON.stringify(err));
    });

    return () => {
      session.close();
      addEvent('session_closed');
    };
  }, [tools, instructions, initialMessage, voiceConfig, addEvent, refreshUsage]);

  return {
    sessionRef,
    isMuted,
    toggleMute,
    connectionStatus,
    history,
    eventLog,
    usage,
    updateVoiceConfig,
  };
}

export default useRealtimeAgent;
