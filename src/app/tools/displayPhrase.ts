import { tool } from '@openai/agents/realtime';
import { z } from 'zod';

export interface PhraseOutput {
  englishText: string;
  phoneticText: string;
  nativeText: string;
}

const createDisplayPhraseTool = (
  setPhrase: (phrase: PhraseOutput) => void,
  languageName: string
) => {
  return tool({
    name: 'display_phrase',
    description: `Display a phrase in English, with a phonetic pronunciation guide, and translated into ${languageName}.`,
    parameters: z.object({
      englishText: z.string().describe("The phrase in English. E.g., 'Where is the nearest bus stop?'"),
      phoneticText: z.string().describe("Phonetic pronunciation guide for the English phrase, written in a way that is intuitive for a speaker of " + languageName + ". E.g., 'wehr iz thuh neer-est bus stop'"),
      nativeText: z.string().describe(`The phrase translated into ${languageName}.`),
    }),
    async execute({ englishText, phoneticText, nativeText }) {
      setPhrase({ englishText, phoneticText, nativeText });
      return `Displayed phrase: English: "${englishText}", Phonetic: "${phoneticText}", ${languageName}: "${nativeText}"`;
    },
  });
};

export default createDisplayPhraseTool;
