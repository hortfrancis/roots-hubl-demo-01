import { useEffect, useRef, useState, useCallback } from 'react';
import { RealtimeAgent, RealtimeSession } from '@openai/agents/realtime';
import { logSessionHistory } from '../utils';
import { ASSISTANT_VOICE } from '../agent/config';
import type { WorkerAPIResponseData } from '../../types';

export type RealtimeAgentTools = ConstructorParameters<typeof RealtimeAgent>[0]["tools"];

export type ConnectionStatus = 'connecting' | 'connected' | 'error';

interface UseRealtimeAgentOptions {
  tools: RealtimeAgentTools;
  instructions: string;
  initialMessage?: string;
}

function useRealtimeAgent(options: UseRealtimeAgentOptions) {
  const { tools, instructions, initialMessage } = options;
  const sessionRef = useRef<RealtimeSession | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');

  const toggleMute = useCallback(() => {
    const session = sessionRef.current;
    if (!session) return;

    setIsMuted(prev => {
      const newMuted = !prev;
      // Attempt to mute/unmute the audio track on the session
      try {
        // The RealtimeSession may expose the underlying media stream
        // Try accessing the audio track directly
        const audioTrack = (session as unknown as { audioTrack?: MediaStreamTrack }).audioTrack;
        if (audioTrack) {
          audioTrack.enabled = !newMuted;
        }
      } catch {
        // Fallback: the SDK may not expose the track directly
        console.warn('Could not toggle audio track directly');
      }
      return newMuted;
    });
  }, []);

  useEffect(() => {
    const agent = new RealtimeAgent({
      name: 'Roots',
      instructions,
      tools,
      voice: ASSISTANT_VOICE,
    });

    const session = new RealtimeSession(agent);
    sessionRef.current = session;
    setConnectionStatus('connecting');

    const connectSession = async () => {
      try {
        const response = await fetch('/api/ephemeral-key');
        const result: WorkerAPIResponseData = await response.json();
        if (result.error || !result.data) {
          throw new Error(result.error || "No data in response");
        }
        await session.connect({ apiKey: result.data.value });
        setConnectionStatus('connected');
      } catch (error) {
        console.error("Failed to connect session:", error);
        setConnectionStatus('error');
      }
    };

    connectSession()
      .then(() => {
        const msg = initialMessage || "[System Message] Conversation started. Please greet the user and introduce yourself.";
        session.sendMessage(msg);
      });

    session.on('history_updated', (history) => {
      logSessionHistory(history);
    });

    return () => {
      session.close();
    };
  }, [tools, instructions, initialMessage]);

  return { sessionRef, isMuted, toggleMute, connectionStatus };
}

export default useRealtimeAgent;
