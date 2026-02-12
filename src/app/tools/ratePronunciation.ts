import { tool } from '@openai/agents/realtime';
import { z } from 'zod';

const createRatePronunciationTool = (
  setRating: (rating: number) => void
) => {
  return tool({
    name: 'rate_pronunciation',
    description: "Rate the user's English pronunciation on a scale from 1 to 3 (1 = needs significant work, 2 = good with room for improvement, 3 = excellent).",
    parameters: z.object({
      rating: z.number().min(1).max(3).describe("The pronunciation rating, an integer between 1 (poor) and 3 (excellent)."),
    }),
    async execute({ rating }) {
      setRating(rating);
      // If rating is 3, tell the agent to move onto the next phrase.
      if (rating === 3) {
        return `Set pronunciation rating to ${rating}. The user has pronounced the phrase well; therefore, you are instructed to move on to another phrase.`;
      }
      return `Set pronunciation rating to ${rating}`;
    },
  });
};

export default createRatePronunciationTool;
