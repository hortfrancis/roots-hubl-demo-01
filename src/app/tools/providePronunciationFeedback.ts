import { tool } from '@openai/agents/realtime';
import { z } from 'zod';

const createPronunciationFeedbackTool = (
  setFeedback: (feedback: string) => void
) => {
  return tool({
    name: 'provide_pronunciation_feedback',
    description: "Provide specific feedback on the user's English pronunciation, with <improve> tags around words or sounds that need work.",
    parameters: z.object({
      feedback: z.string().describe("Feedback text with <improve> tags. E.g., 'Where is the <improve>nearest</improve> bus stop?'"),
    }),
    async execute({ feedback }) {
      setFeedback(feedback);
      return `Provided pronunciation feedback: ${feedback}`;
    },
  });
};

export default createPronunciationFeedbackTool;
