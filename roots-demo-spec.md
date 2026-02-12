# Roots Demo for HubL — Technical Specification

**Version:** 1.0  
**Date:** February 2026  
**Repo name:** `roots-demo-for-hubl-01`  
**Based on:** `hortfrancis/conversational-gujarati-prototype-01`

---

## 1. Project Overview

### What is this?

A demo application for **HubL** (https://hubl.org.uk/), a Norwich-based CIC that helps asylum seekers, refugees, and migrants access English language (ESOL) classes. 

This app is an AI-powered English language learning tutor that uses OpenAI's Realtime API to provide **speech-to-speech** conversation. The user speaks in their native language or attempts English, and the AI tutor responds with voice, while simultaneously updating the UI with phrase cards, pronunciation feedback, and local service provider information.

The project name is **"Roots"** — the working name for a potential startup. This demo is specifically for HubL.

### Who is the user?

People living in the UK who are not native English speakers — primarily refugees, asylum seekers, and migrants. For this demo, the developer (Alex) will roleplay as a German speaker learning English.

### What are we building?

A mobile-first web app (PWA-ready) with:
1. **Language selection** — choose your native language (Arabic, French, German for demo)
2. **Home screen** — choose between two modes
3. **Practice Speaking mode** — voice AI English tutor with pronunciation feedback
4. **Help & Support mode** — voice AI assistant that surfaces local ESOL providers

### Key demo scenario (≈5 minutes)

1. Open app, select German
2. Home screen shows options in German
3. Enter "Practice Speaking" → AI greets in German, transitions to English
4. Practice a phrase, get pronunciation rating and feedback
5. Go back, enter "Help & Support" → ask about local English classes
6. Provider cards appear, AI talks through options
7. End session

---

## 2. Architecture

### Carry forward from prototype

This project is built by copying and modifying the existing `conversational-gujarati-prototype-01` repository. The core architecture remains identical:

- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS v4
- **Backend:** Hono on Cloudflare Workers (serves ephemeral API keys)
- **AI:** OpenAI Realtime API via `@openai/agents` SDK
- **Deployment:** Cloudflare Workers/Pages

### The essential pattern

The critical architectural pattern to understand is how the Realtime voice model controls the UI:

1. A **tool** is defined using `tool()` from `@openai/agents/realtime`, with a Zod schema for parameters.
2. A **React state setter** is passed into a tool creator function (e.g., `createDisplayPhraseTool(setPhrase)`).
3. When the Realtime model decides to call that tool, the `execute` function runs, which calls the state setter.
4. React re-renders the component that depends on that state.
5. **Result:** The voice AI model updates the browser UI in real time by calling functions.

This pattern is the foundation. Every new feature follows it: define a tool, pass in a state setter, build a component that reads the state.

### What changes from the prototype

| Aspect | Prototype (Gujarati) | This project (Roots) |
|--------|---------------------|----------------------|
| Direction | English → Gujarati | [Native language] → English |
| Languages | Gujarati only | Arabic, French, German |
| Screens | Single screen | Language select → Home → Conversation |
| Tools | `display_output`, `rate_pronunciation`, `provide_pronunciation_feedback` | `display_phrase`, `rate_pronunciation`, `provide_pronunciation_feedback`, `check_local_providers` |
| Modes | One (practice) | Two (practice + help/support) |
| System prompt | Gujarati tutor | English tutor, multilingual, HubL-aware |
| UI | Minimal | Polished mobile-first with component library |

---

## 3. Tech Stack

### Dependencies (keep from prototype)
- `react` 19.0.0
- `react-dom` 19.0.0
- `@openai/agents` 0.1.3
- `hono` ^4.9.7
- `tailwindcss` ^4.1.13
- `@tailwindcss/vite` ^4.1.13
- `zod` ^3.25.40

### Dependencies (add)
- `react-router-dom` (or equivalent) — for routing between screens (language select → home → conversation). Alternatively, a simple state-based router if we want to keep it minimal.
- `shadcn/ui` components — for polished UI primitives (Button, Card, Badge, etc.). Note: check Tailwind v4 compatibility. If there's friction, fall back to hand-rolled Tailwind components.
- `@phosphor-icons/react` — for icons (flags, microphone, etc.)

### Dev dependencies (keep from prototype)
- `@cloudflare/vite-plugin`
- `@vitejs/plugin-react`
- `vite` ^6.0.0
- `wrangler` ^4.37.1
- TypeScript 5.8.3

### Infrastructure
- **Cloudflare Workers** for deployment (free tier, fine for demo)
- **OpenAI API key** stored as a Cloudflare secret (`OPENAI_API_KEY`)
- No database needed for this demo

---

## 4. File Structure

```
roots-demo-for-hubl-01/
├── public/
│   └── (static assets, favicon, etc.)
├── src/
│   ├── app/
│   │   ├── main.tsx                          # React entry point
│   │   ├── App.tsx                           # Root component with routing
│   │   ├── index.css                         # Global styles + Tailwind import
│   │   ├── App.css                           # App-level layout styles
│   │   │
│   │   ├── agent/
│   │   │   └── config.ts                     # Agent name, instructions, voice (PER MODE)
│   │   │
│   │   ├── components/
│   │   │   ├── LanguageSelectScreen.tsx       # Screen 1: language picker
│   │   │   ├── HomeScreen.tsx                 # Screen 2: mode selection
│   │   │   ├── PracticeSpeakingScreen.tsx     # Screen 3: voice conversation (practice)
│   │   │   ├── HelpSupportScreen.tsx          # Screen 4: voice conversation (services)
│   │   │   ├── PhraseCard.tsx                 # Displays English + phonetic + native phrase
│   │   │   ├── PronunciationRating.tsx        # Star rating display (keep/adapt)
│   │   │   ├── PronunciationFeedback.tsx      # Highlighted feedback text (keep/adapt)
│   │   │   ├── ProviderCard.tsx               # Single provider display card
│   │   │   ├── ProviderList.tsx               # List of provider cards
│   │   │   ├── VoiceStatus.tsx                # Connection/listening indicator
│   │   │   └── MicMuteButton.tsx              # Manual microphone mute toggle
│   │   │
│   │   ├── data/
│   │   │   ├── providers.ts                   # Hardcoded provider data (scraped from HubL)
│   │   │   └── languages.ts                   # Language configuration (supported languages, UI strings)
│   │   │
│   │   ├── hooks/
│   │   │   ├── useRealtimeAgent.ts            # Core hook (adapt from prototype)
│   │   │   └── useLanguage.ts                 # Language context/localStorage hook
│   │   │
│   │   ├── tools/
│   │   │   ├── index.ts                       # Tool exports
│   │   │   ├── displayPhrase.ts               # Display phrase in 3 formats
│   │   │   ├── ratePronunciation.ts           # Rate pronunciation 1-3 (keep/adapt)
│   │   │   ├── providePronunciationFeedback.ts # Pronunciation feedback (keep/adapt)
│   │   │   └── checkLocalProviders.ts         # Return matching ESOL providers
│   │   │
│   │   └── utils/
│   │       ├── index.ts
│   │       └── logSessionHistory.ts           # Keep from prototype
│   │
│   ├── types/
│   │   └── index.ts                           # Shared TypeScript types
│   │
│   └── worker/
│       └── index.ts                           # Hono backend (keep from prototype)
│
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── tsconfig.worker.json
├── vite.config.ts
├── wrangler.json
└── worker-configuration.d.ts
```

---

## 5. Language Configuration

### Supported languages (demo)

```typescript
// src/app/data/languages.ts

export interface LanguageConfig {
  code: string;           // ISO 639-1
  name: string;           // English name
  nativeName: string;     // Name in native script
  flag: string;           // Emoji flag
  direction: 'ltr' | 'rtl';  // Text direction
  ui: {                   // UI strings in this language
    appSubtitle: string;
    selectLanguage: string;
    whatWouldYouLikeToDo: string;
    practiceSpeaking: string;
    practiceSpeakingDesc: string;
    helpSupport: string;
    helpSupportDesc: string;
    changeLanguage: string;
    back: string;
    endSession: string;
    connecting: string;
    listening: string;
    currentPhrase: string;
    pronunciation: string;
    feedback: string;
    localProviders: string;
    micMuted: string;
    micUnmuted: string;
  };
}

export const LANGUAGES: LanguageConfig[] = [
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    direction: 'rtl',
    ui: {
      appSubtitle: 'مساعدك في تعلم اللغة الإنجليزية',
      selectLanguage: 'اختر لغتك',
      whatWouldYouLikeToDo: 'ماذا تريد أن تفعل؟',
      practiceSpeaking: 'أريد أن أتدرب على التحدث بالإنجليزية',
      practiceSpeakingDesc: 'تدرب على النطق والمحادثة مع معلمك الذكي',
      helpSupport: 'أريد المساعدة والدعم',
      helpSupportDesc: 'ابحث عن دروس اللغة الإنجليزية والخدمات المحلية القريبة منك',
      changeLanguage: 'تغيير اللغة',
      back: 'رجوع',
      endSession: 'إنهاء الجلسة',
      connecting: 'جاري الاتصال...',
      listening: 'المعلم يستمع...',
      currentPhrase: 'العبارة الحالية',
      pronunciation: 'النطق',
      feedback: 'ملاحظات',
      localProviders: 'دروس اللغة الإنجليزية بالقرب منك',
      micMuted: 'الميكروفون مكتوم',
      micUnmuted: 'الميكروفون مفعل',
    },
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    direction: 'ltr',
    ui: {
      appSubtitle: "Votre assistant d'apprentissage de l'anglais",
      selectLanguage: 'Choisissez votre langue',
      whatWouldYouLikeToDo: 'Que souhaitez-vous faire ?',
      practiceSpeaking: "Je veux pratiquer l'anglais",
      practiceSpeakingDesc: 'Pratiquez la prononciation et la conversation avec votre tuteur IA',
      helpSupport: "J'ai besoin d'aide et de soutien",
      helpSupportDesc: "Trouvez des cours d'anglais et des services locaux près de chez vous",
      changeLanguage: 'Changer de langue',
      back: 'Retour',
      endSession: 'Terminer la session',
      connecting: 'Connexion en cours...',
      listening: 'Le tuteur écoute...',
      currentPhrase: 'Phrase actuelle',
      pronunciation: 'Prononciation',
      feedback: 'Commentaires',
      localProviders: "Cours d'anglais près de chez vous",
      micMuted: 'Microphone coupé',
      micUnmuted: 'Microphone activé',
    },
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    direction: 'ltr',
    ui: {
      appSubtitle: 'Ihr Englisch-Lernassistent',
      selectLanguage: 'Wählen Sie Ihre Sprache',
      whatWouldYouLikeToDo: 'Was möchten Sie tun?',
      practiceSpeaking: 'Englisch sprechen üben',
      practiceSpeakingDesc: 'Üben Sie Aussprache und Konversation mit Ihrem KI-Tutor',
      helpSupport: 'Hilfe & Unterstützung',
      helpSupportDesc: 'Finden Sie Englischkurse und lokale Dienste in Ihrer Nähe',
      changeLanguage: 'Sprache ändern',
      back: 'Zurück',
      endSession: 'Sitzung beenden',
      connecting: 'Verbindung wird hergestellt...',
      listening: 'Tutor hört zu...',
      currentPhrase: 'Aktuelle Phrase',
      pronunciation: 'Aussprache',
      feedback: 'Feedback',
      localProviders: 'Englischkurse in Ihrer Nähe',
      micMuted: 'Mikrofon stumm',
      micUnmuted: 'Mikrofon aktiv',
    },
  },
];
```

### Language persistence

The selected language code should be stored in `localStorage` under the key `roots-language`. A custom hook `useLanguage()` provides access:

```typescript
// src/app/hooks/useLanguage.ts

function useLanguage() {
  const [langCode, setLangCode] = useState<string | null>(
    () => localStorage.getItem('roots-language')
  );
  
  const setLanguage = (code: string) => {
    localStorage.setItem('roots-language', code);
    setLangCode(code);
  };
  
  const language = LANGUAGES.find(l => l.code === langCode) ?? null;
  
  return { language, setLanguage, langCode };
}
```

---

## 6. Screens

### Screen 1: Language Selection (`LanguageSelectScreen`)

**Route:** `/` (when no language is set)

**Layout:**
- Centered header: 🌱 Roots logo/text + "Demo for HubL (Feb 2026)" subtitle
- Section label: "Select your language"
- Full-width language buttons, one per supported language:
  - Flag emoji + language name (English) + native name
  - On tap: saves language to localStorage, navigates to Home
- A fourth, disabled button: 🌐 "More coming soon..."

**Behaviour:**
- If a language is already in localStorage, skip straight to Home screen.

### Screen 2: Home (`HomeScreen`)

**Route:** `/` (when language is set)

**Layout:**
- Header: 🌱 Roots + subtitle in selected language
- Section label in selected language ("Was möchten Sie tun?")
- Two large mode buttons:
  - 🗣️ Practice Speaking (title + description in selected language)
  - 🆘 Help & Support (title + description in selected language)
- Footer: "Change language" link → clears localStorage, returns to language select

**Behaviour:**
- All text rendered in the selected language using the `ui` strings from the language config.

### Screen 3: Practice Speaking (`PracticeSpeakingScreen`)

**Route:** `/practice`

**Layout (top to bottom):**
1. Back button (← text in selected language)
2. **Microphone mute button** — large, prominent, always accessible (see §7)
3. Voice status indicator (connecting / listening / tutor speaking)
4. Phrase card component (English + phonetic + native translation)
5. Pronunciation rating (1-3 stars)
6. Pronunciation feedback (with highlighted improvement areas)
7. End session button at bottom

**Behaviour:**
1. On mount: mint ephemeral key, connect Realtime session
2. Send system message to agent: greet user, start teaching
3. Agent calls `display_phrase` → phrase card appears
4. User speaks → agent calls `rate_pronunciation` → stars appear
5. Agent calls `provide_pronunciation_feedback` → feedback appears
6. When rating is 3 → clear feedback, agent moves to next phrase
7. On "End session" or back: close session, return to Home

**Agent configuration for this mode:** See §8 (Practice mode system prompt).

### Screen 4: Help & Support (`HelpSupportScreen`)

**Route:** `/help`

**Layout (top to bottom):**
1. Back button
2. **Microphone mute button** 
3. Voice status indicator
4. Provider list (cards appear when agent calls `check_local_providers`)
5. End session button at bottom

**Behaviour:**
1. On mount: mint ephemeral key, connect Realtime session
2. Send system message to agent: greet user, ask how you can help
3. User describes what they need (in their language or English)
4. Agent calls `check_local_providers` → provider cards render
5. Agent discusses options verbally
6. On "End session" or back: close session, return to Home

**Agent configuration for this mode:** See §8 (Help mode system prompt).

---

## 7. Microphone Mute Button

### Why this is critical

Background noise in demo environments causes the Realtime API's voice activity detection (VAD) to trigger, interrupting the AI's speech. This makes demos extremely difficult. A manual mute button is essential.

### Implementation

The `@openai/agents/realtime` SDK's `RealtimeSession` should provide access to the underlying audio input. The mute button needs to:

1. **Mute:** Stop sending audio from the microphone to the Realtime session (but keep the session open — the AI can still speak).
2. **Unmute:** Resume sending audio.

The `useRealtimeAgent` hook should expose a mute toggle. The implementation will depend on how the `@openai/agents` SDK handles audio streams — it may be as simple as muting the `MediaStreamTrack`, or may require calling a method on the session.

**Investigate the SDK for:**
- `session.mute()` / `session.unmute()` methods
- Access to the underlying `MediaStream` to toggle `track.enabled`
- `session.inputAudioMuted` property or similar

### UI

- Large, round, floating button — always visible on conversation screens
- Two states: 🎙️ (unmuted, default) / 🔇 (muted, highlighted red/orange)
- Position: centre-bottom of screen, above the "End session" button
- Should be the easiest thing to tap on the screen (large touch target, ≥48px)
- Visual state should be unambiguous — when muted, make it very obvious (red background, icon change, label text)

### Default state

Start **unmuted** by default, so the session works immediately. The user (Alex during demo) can mute between utterances to prevent interruption.

---

## 8. Agent Configuration

### Practice Speaking mode — system prompt

```typescript
export const PRACTICE_INSTRUCTIONS = (languageName: string, languageCode: string) => `
# Role & Objective

You are a friendly, patient English language tutor called Roots. You are helping someone who speaks ${languageName} to learn and practice spoken English.

You are part of an app provided by HubL, a community organisation in Norwich, UK, that helps asylum seekers, refugees, and migrants access English classes.

# Guidelines

## Language approach
- You can speak and understand ${languageName}. Use it when needed to explain concepts, provide encouragement, or help the user understand.
- Start the conversation by greeting the user in ${languageName}, then transition to simple English.
- When teaching phrases, speak the English slowly and clearly.
- Focus on practical, everyday English that helps with real life in the UK — shopping, transport, healthcare, socialising, asking for help.

## Teaching flow
1. Introduce a practical English phrase using the display_phrase tool.
2. Say the phrase clearly in English so the user can hear the pronunciation.
3. Ask the user to try saying it.
4. Listen to their attempt and rate their pronunciation using rate_pronunciation.
5. If they need improvement, provide specific feedback using provide_pronunciation_feedback.
6. Encourage them and help them improve.
7. When they achieve a rating of 3, congratulate them and move to a new phrase.

## Tone & manner
- Be warm, encouraging, and patient. Many users may be anxious about speaking English.
- Celebrate small wins. Learning a language is hard.
- Speak English slowly and clearly. Avoid complex vocabulary or idioms unless teaching them.
- Use a British English accent for English speech.
- Keep responses concise — this is a voice conversation, not a lecture.

# Tools

## display_phrase
Display a phrase in three formats: English text, a phonetic guide (English pronunciation spelled out for a ${languageName} speaker), and translation in ${languageName}. Always use this tool when introducing a new phrase.

## rate_pronunciation
Rate the user's pronunciation attempt on a scale of 1-3 (1 = needs significant work, 2 = good attempt with room for improvement, 3 = excellent). Always rate after the user attempts a phrase.

## provide_pronunciation_feedback
Provide specific feedback on which parts of the phrase need work. Use <improve> tags around the words or sounds that need improvement.

# System messages
You will receive system messages from the application prefixed with [System Message]. Follow these instructions. They come from the app, not the user.
`;
```

### Help & Support mode — system prompt

```typescript
export const HELP_INSTRUCTIONS = (languageName: string, languageCode: string) => `
# Role & Objective

You are a friendly, helpful assistant called Roots. You help people who speak ${languageName} find English language classes and support services in the Norwich and Great Yarmouth areas of the UK.

You are part of an app provided by HubL, a community organisation that helps asylum seekers, refugees, and migrants access English classes.

# Guidelines

## Language approach
- Speak primarily in ${languageName} for this mode, since the user may have very limited English.
- You can use simple English words when relevant (like place names, "ESOL", etc.).
- Be clear and simple in your explanations.

## How to help
1. Greet the user in ${languageName} and ask what kind of help they're looking for.
2. Ask clarifying questions if needed:
   - Are they in Norwich or Great Yarmouth?
   - What level of English do they have? (beginner, some English, confident?)
   - Do they want accredited classes (with certificates) or informal conversation practice?
   - Do they have any preferences (online, in-person, specific days)?
3. Use the check_local_providers tool to find suitable providers.
4. Talk the user through the options, highlighting key details like cost (many are free), schedule, and what kind of learning they offer.
5. Encourage the user to get in touch with providers or book a HubL assessment.

## Important context about HubL
- HubL offers free English language assessments at community hubs and libraries in Norwich and Great Yarmouth.
- Assessments take about an hour and give a certificate of ESOL level.
- This certificate is accepted by providers across Norwich.
- Assessments are free for everyone, regardless of income or immigration status.
- After assessment, HubL helps match people to the right course.
- To book: visit hubl.org.uk/book

## Tone & manner
- Be warm, reassuring, and practical.
- Many users may feel anxious or overwhelmed. Be gentle.
- Focus on actionable information — what they can do next.
- Keep responses concise and clear.

# Tools

## check_local_providers
Search for English class providers in the local area. You can filter by region (norwich or yarmouth). Use this tool when the user asks about finding classes, or when you have enough information to make a recommendation.

# System messages
You will receive system messages from the application prefixed with [System Message]. Follow these instructions. They come from the app, not the user.
`;
```

### Voice selection

```typescript
// Use a clear, warm voice. 'marin' or 'coral' are good options.
// Test during development — the voice should sound friendly and not too fast.
export const ASSISTANT_VOICE: string = 'coral';
```

---

## 9. Tool Definitions

### display_phrase (Practice mode)

Replaces the prototype's `display_output`. The key change: the third field is now the user's native language, not Gujarati.

```typescript
// src/app/tools/displayPhrase.ts

import { tool } from '@openai/agents/realtime';
import { z } from 'zod';

export interface PhraseOutput {
  englishText: string;
  phoneticText: string;       // English pronunciation guide
  nativeText: string;         // Translation in user's native language
}

const createDisplayPhraseTool = (
  setPhrase: (phrase: PhraseOutput) => void,
  languageName: string         // e.g., "German", "Arabic", "French"
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
```

### rate_pronunciation (Practice mode)

Essentially unchanged from prototype.

```typescript
// src/app/tools/ratePronunciation.ts

import { tool } from '@openai/agents/realtime';
import { z } from 'zod';

const createRatePronunciationTool = (
  setRating: (rating: number) => void
) => {
  return tool({
    name: 'rate_pronunciation',
    description: "Rate the user's English pronunciation on a scale from 1 to 3 (1 = needs significant work, 2 = good with room for improvement, 3 = excellent).",
    parameters: z.object({
      rating: z.number().min(1).max(3).describe("The pronunciation rating, 1-3."),
    }),
    async execute({ rating }) {
      setRating(rating);
      if (rating === 3) {
        return `Pronunciation rated ${rating}/3. Excellent! Move on to a new phrase.`;
      }
      return `Pronunciation rated ${rating}/3.`;
    },
  });
};

export default createRatePronunciationTool;
```

### provide_pronunciation_feedback (Practice mode)

Essentially unchanged from prototype.

```typescript
// src/app/tools/providePronunciationFeedback.ts

import { tool } from '@openai/agents/realtime';
import { z } from 'zod';

const createProvidePronunciationFeedbackTool = (
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

export default createProvidePronunciationFeedbackTool;
```

### check_local_providers (Help mode)

New tool. Returns hardcoded provider data filtered by region.

```typescript
// src/app/tools/checkLocalProviders.ts

import { tool } from '@openai/agents/realtime';
import { z } from 'zod';
import { PROVIDERS, Provider } from '../data/providers';

const createCheckLocalProvidersTool = (
  setProviders: (providers: Provider[]) => void
) => {
  return tool({
    name: 'check_local_providers',
    description: "Search for English language class providers in the local area. Returns providers in Norwich or Great Yarmouth. Use this when the user asks about finding English classes or local support.",
    parameters: z.object({
      region: z.enum(['norwich', 'yarmouth', 'all']).describe("The region to search. Use 'norwich' for Norwich providers, 'yarmouth' for Great Yarmouth, or 'all' for both."),
    }),
    async execute({ region }) {
      const filtered = region === 'all' 
        ? PROVIDERS 
        : PROVIDERS.filter(p => p.region === region);
      setProviders(filtered);
      
      // Return a text summary for the agent to use in conversation
      const summary = filtered.map(p => 
        `- ${p.name} (${p.region}): ${p.shortDescription}. Contact: ${p.contactEmail || p.contactPhone || 'see website'}. ${p.isFree ? 'FREE.' : ''} ${p.isAccredited ? 'Accredited.' : ''} ${p.isDropIn ? 'Drop-in welcome.' : ''}`
      ).join('\n');
      
      return `Found ${filtered.length} providers:\n${summary}`;
    },
  });
};

export default createCheckLocalProvidersTool;
```

---

## 10. Provider Data

Scraped from https://hubl.org.uk/providers/norwich and https://hubl.org.uk/providers/yarmouth.

```typescript
// src/app/data/providers.ts

export interface Provider {
  id: string;
  name: string;
  region: 'norwich' | 'yarmouth';
  description: string;
  shortDescription: string;
  location: string;
  contactEmail?: string;
  contactPhone?: string;
  website: string;
  isAccredited: boolean;
  isFree: boolean;
  isDropIn: boolean;
  isOnline: boolean;
  schedule?: string;
  tags: string[];
}

export const PROVIDERS: Provider[] = [
  // ─── NORWICH ───
  {
    id: 'ccn',
    name: 'City College Norwich',
    region: 'norwich',
    description: 'City College Norwich offers ESOL for those who do not speak English as their first language and need to improve. Accredited classes are available from entry level 1 to Level 2 and provide progression to vocational and academic courses. There are also classes for pre-entry level.',
    shortDescription: 'Accredited ESOL classes from entry level 1 to Level 2, with progression to vocational courses.',
    location: 'City College Norwich, Ipswich Rd, Norwich, NR2 2LJ',
    contactEmail: 'international@ccn.ac.uk',
    website: 'https://www.ccn.ac.uk/16-18/subject-areas/esol/course/esol-entry-1-to-level-2-19/',
    isAccredited: true,
    isFree: false,
    isDropIn: false,
    isOnline: false,
    tags: ['accredited', 'college', 'all levels'],
  },
  {
    id: 'ncc-adult-learning',
    name: 'Norfolk County Council Adult Learning',
    region: 'norwich',
    description: 'Norfolk Adult Learning offers courses to Norfolk residents over 19 years of age. Their ESOL accredited courses have embedded maths and digital skills to boost all skills. There are non-accredited courses for Everyday Conversation, Improve your Grammar, Employability for ESOL and Family ESOL courses.',
    shortDescription: 'Accredited ESOL with embedded maths and digital skills, plus conversation and employability courses.',
    location: 'See website for details',
    contactEmail: 'adultlearning@norfolk.gov.uk',
    contactPhone: '01603 222400',
    website: 'https://courses.adultlearningnorfolk.co.uk/CourseKeySearch.asp?TAG=ESOL',
    isAccredited: true,
    isFree: false,
    isDropIn: false,
    isOnline: false,
    tags: ['accredited', 'council', 'maths', 'digital skills', 'employability'],
  },
  {
    id: 'english-exchange-norwich',
    name: 'English Exchange at the Millennium Library',
    region: 'norwich',
    description: 'Norfolk Libraries provide conversational groups called English Exchange, open to all with no restrictions. They are not accredited, and are run by library staff and volunteers who talk to people on topics of their choosing, such as going to the shops, interview questions, or how to book a doctor\'s appointment. These groups are free, drop in and held in multiple libraries across the county.',
    shortDescription: 'Free conversational groups at the library — drop-in, no restrictions, practical topics.',
    location: 'Norfolk and Norwich Millennium Library at the Forum',
    contactEmail: 'migrantsupport@norfolk.gov.uk',
    contactPhone: '0344 800 8020',
    website: 'https://www.norfolk.gov.uk/43947',
    isAccredited: false,
    isFree: true,
    isDropIn: true,
    isOnline: false,
    schedule: 'Mondays 14:00-15:00, Wednesdays 17:30-18:30, Thursdays 10:30-11:30',
    tags: ['free', 'drop-in', 'conversation', 'library', 'volunteers'],
  },
  {
    id: 'nile',
    name: 'NILE',
    region: 'norwich',
    description: 'NILE provides online free English lessons, focusing on different aspects of English including grammar, pronunciation and conversational English. Currently offering classes for Pre-Intermediate (A2) or Upper-Intermediate (B2) students. Not currently offering beginner or advanced classes.',
    shortDescription: 'Free online English lessons — grammar, pronunciation, conversation. A2 and B2 levels.',
    location: 'Online and in Norwich',
    contactEmail: 'erin@nile-elt.com',
    contactPhone: '01603 664373',
    website: 'https://www.nile-elt.com/products/FreeEnglish',
    isAccredited: false,
    isFree: true,
    isDropIn: false,
    isOnline: true,
    tags: ['free', 'online', 'grammar', 'pronunciation', 'A2', 'B2'],
  },
  {
    id: 'new-routes',
    name: 'New Routes Integration',
    region: 'norwich',
    description: 'New Routes Integration helps recently settled ethnic minority individuals to develop the skills and knowledge needed for integration by encouraging cross-cultural dialogue, English support classes and social activities in an informal, friendly environment.',
    shortDescription: 'English support classes and social activities for recently settled individuals in a friendly environment.',
    location: '15 St Martin-at-Palace Plain, NR3 1RW',
    contactEmail: 'info@newroutes.org.uk',
    contactPhone: '01603 662648',
    website: 'https://newroutes.org.uk/projects/adults/international-workshop/',
    isAccredited: false,
    isFree: true,
    isDropIn: false,
    isOnline: false,
    tags: ['community', 'integration', 'social', 'informal'],
  },
  {
    id: 'english-plus',
    name: 'English+',
    region: 'norwich',
    description: 'English+ provides free, weekly community ESOL classes taught in small groups, at different venues across Norwich, and one class online. Regular weekly classes (term time only) include: three ESOL classes (no exams) and two conversation classes (including one for Mums and pre-schoolers). Classes available on-demand include maths, driving theory, IELTS and Craft & Conversation. You must contact by email first.',
    shortDescription: 'Free weekly community ESOL in small groups — includes classes for mums and pre-schoolers.',
    location: 'Online and in-person across Norwich',
    contactEmail: 'info@englishplus.org.uk',
    contactPhone: '07951 067435',
    website: 'https://englishplus.org.uk/',
    isAccredited: false,
    isFree: true,
    isDropIn: false,
    isOnline: true,
    schedule: 'Weekly, term time only. Email first.',
    tags: ['free', 'community', 'small groups', 'mums', 'driving theory', 'IELTS'],
  },
  {
    id: 'shoebox',
    name: 'The Shoebox Community Hub',
    region: 'norwich',
    description: 'Improve your English communication skills in a friendly environment. Every other week the group will alternate between a social learning space and a more structured games based learning session. Mondays 15:00 to 17:00. You must email first to book your place.',
    shortDescription: 'Friendly English practice with social and games-based sessions, alternate Mondays.',
    location: '21-23 Castle Meadow Norwich NR1 3DH',
    contactEmail: 'team@theshoebox.org.uk',
    contactPhone: '01603 850309',
    website: 'https://www.theshoebox.org.uk/whats-on/everyday-english/',
    isAccredited: false,
    isFree: true,
    isDropIn: false,
    isOnline: false,
    schedule: 'Mondays 15:00-17:00 (every other week). Email to book.',
    tags: ['free', 'community', 'games', 'social', 'booking required'],
  },
  {
    id: 'wea',
    name: 'WEA (Workers\' Educational Association)',
    region: 'norwich',
    description: 'WEA offers face to face or online accredited ESOL courses at Entry 1, Entry 2, Entry 3 Level 1 and Level 2 and general community ESOL courses such as pre-entry ESOL, ESOL for Employment or ESOL for Driving Theory or ESOL for Budgeting. They also offer certificated Community Interpreting courses.',
    shortDescription: 'Accredited ESOL courses (Entry 1 to Level 2), plus specialist courses for employment and driving theory.',
    location: 'See website for details',
    contactPhone: '0300 303 3464',
    website: 'http://www.wea.org.uk/skills/ESOL',
    isAccredited: true,
    isFree: false,
    isDropIn: false,
    isOnline: true,
    tags: ['accredited', 'employment', 'driving theory', 'interpreting', 'budgeting'],
  },
  {
    id: 'niyp',
    name: 'Norwich International Youth Project',
    region: 'norwich',
    description: 'Norwich International Youth Project supports young people aged 11-25 who are refugees, seeking asylum or otherwise displaced from their home country. Weekly Thursday drop-in youth group between 4-7pm, and English classes every Tuesday during term time from 5-6.30pm. English classes are a safe and informal space to make friends and practice English.',
    shortDescription: 'English classes and youth groups for young refugees and asylum seekers aged 11-25.',
    location: 'See website for details',
    website: 'https://niyp.org.uk/activities/',
    isAccredited: false,
    isFree: true,
    isDropIn: true,
    isOnline: false,
    schedule: 'Tuesdays 17:00-18:30 (English), Thursdays 16:00-19:00 (youth group). Term time.',
    tags: ['free', 'youth', '11-25', 'refugees', 'drop-in', 'informal'],
  },
  // ─── GREAT YARMOUTH ───
  {
    id: 'gyros',
    name: 'GYROS — Great Yarmouth Refugee Outreach & Support',
    region: 'yarmouth',
    description: 'GYROS offers two community pre-ESOL classes in Great Yarmouth. Tuesdays 10:00-11:30: Women\'s ESOL conversation group (Entry 1 and above). Thursdays 10:00-11:30: ESOL for workers (all levels, any role/hours including seasonal). Must contact in advance — no drop-ins.',
    shortDescription: 'Community pre-ESOL classes: women\'s conversation group and ESOL for workers.',
    location: 'Great Yarmouth (contact for address)',
    contactEmail: 'admin@gyros.org.uk',
    contactPhone: '07458301091',
    website: 'https://www.gyros.org.uk/esol',
    isAccredited: false,
    isFree: true,
    isDropIn: false,
    isOnline: false,
    schedule: 'Tuesdays 10:00-11:30 (women), Thursdays 10:00-11:30 (workers). Contact in advance.',
    tags: ['free', 'community', 'women', 'workers', 'refugees', 'booking required'],
  },
  {
    id: 'east-coast-college',
    name: 'East Coast College',
    region: 'yarmouth',
    description: 'East Coast College offers ESOL classes for Adults at The Place in Great Yarmouth and at their Lowestoft campus, with optional functional skills Maths. All courses are accredited, Entry 1 to Level 2. Also offers GCSE English and Maths designed for ESOL learners, plus Level 1 Award in Understanding Community Interpreting.',
    shortDescription: 'Accredited ESOL (Entry 1 to Level 2), plus GCSE English/Maths for ESOL learners.',
    location: 'Great Yarmouth & Lowestoft',
    contactEmail: 'a.dias@eastcoast.ac.uk',
    website: 'https://www.eastcoast.ac.uk/subject/esol-english-for-speaker-of-other-languages/',
    isAccredited: true,
    isFree: false,
    isDropIn: false,
    isOnline: false,
    tags: ['accredited', 'college', 'GCSE', 'maths', 'interpreting'],
  },
  {
    id: 'english-exchange-yarmouth',
    name: 'English Exchange at Great Yarmouth Library',
    region: 'yarmouth',
    description: 'Norfolk Libraries provide conversational groups called English Exchange, open to all with no restrictions. Free, drop in, run by library staff and volunteers. Topics include going to the shops, interview questions, booking a doctor\'s appointment. Also offer International Welcome sessions for refugees, migrants and asylum seekers.',
    shortDescription: 'Free conversational drop-in group at the library, every Tuesday lunchtime.',
    location: 'Great Yarmouth Library',
    contactEmail: 'migrantsupport@norfolk.gov.uk',
    contactPhone: '0344 800 8020',
    website: 'https://communitydirectory.norfolk.gov.uk/Services/16624/International-Welcom',
    isAccredited: false,
    isFree: true,
    isDropIn: true,
    isOnline: false,
    schedule: 'Every Tuesday 12:30-13:30',
    tags: ['free', 'drop-in', 'conversation', 'library', 'welcome sessions'],
  },
  {
    id: 'ncc-adult-learning-yarmouth',
    name: 'Norfolk County Council Adult Learning',
    region: 'yarmouth',
    description: 'Norfolk Adult Learning offers courses to Norfolk residents over 19 years of age. ESOL accredited courses with embedded maths and digital skills. Non-accredited courses for Everyday Conversation, Improve your Grammar, Employability for ESOL and Family ESOL.',
    shortDescription: 'Accredited ESOL with maths and digital skills, plus conversation and employability courses.',
    location: 'See website for details',
    contactEmail: 'adultlearning@norfolk.gov.uk',
    contactPhone: '01603 222400',
    website: 'https://courses.adultlearningnorfolk.co.uk/CourseKeySearch.asp?TAG=ESOL',
    isAccredited: true,
    isFree: false,
    isDropIn: false,
    isOnline: false,
    tags: ['accredited', 'council', 'maths', 'digital skills', 'employability'],
  },
];
```

---

## 11. Component Specifications

### PhraseCard

Displays the current phrase in three formats. Replaces the prototype's `Output` component.

```
Props:
  - englishText: string
  - phoneticText: string
  - nativeText: string
  - nativeLanguageLabel: string (e.g., "Deutsch", "العربية", "Français")

Renders:
  - Card with three rows:
    - "English" label + englishText (bold)
    - "Phonetic" label + phoneticText (italic)
    - [nativeLanguageLabel] label + nativeText
  - Returns null if all fields are empty
  - For Arabic (RTL), the native text row should have dir="rtl"
```

### PronunciationRating

Keep from prototype, essentially unchanged. Shows 1-3 stars.

### PronunciationFeedback  

Keep from prototype, essentially unchanged. Parses `<improve>` tags and highlights them.

### ProviderCard

Displays a single ESOL provider.

```
Props:
  - provider: Provider

Renders:
  - Card with:
    - Provider name (bold)
    - Short description
    - Tags/badges: location, accredited/free/drop-in/online indicators
    - Schedule (if available)
    - Contact info (email, phone)
```

### ProviderList

Renders a list of ProviderCards.

```
Props:
  - providers: Provider[]
  - headerText: string (in user's language, e.g., "Englischkurse in Ihrer Nähe")

Renders:
  - Section header
  - List of ProviderCard components
  - Returns null if providers array is empty
```

### VoiceStatus

Shows the current state of the Realtime connection.

```
Props:
  - status: 'connecting' | 'listening' | 'speaking' | 'error'
  - statusLabels: { connecting: string, listening: string, speaking: string, error: string }

Renders:
  - Pill-shaped indicator with:
    - Animated dot (green when active, yellow when connecting, red on error)
    - Status label text in user's language
```

### MicMuteButton

The critical mute toggle. See §7 for detailed requirements.

```
Props:
  - isMuted: boolean
  - onToggle: () => void
  - labels: { muted: string, unmuted: string }

Renders:
  - Large circular button (≥48px touch target)
  - Microphone icon when unmuted
  - Muted microphone icon (with slash) when muted
  - Red/orange background when muted
  - Label text below icon
```

---

## 12. Routing

Keep it simple. Options:

**Option A: React Router (recommended if already comfortable with it)**
```
/              → LanguageSelectScreen (if no language set) or HomeScreen
/practice      → PracticeSpeakingScreen
/help          → HelpSupportScreen
```

**Option B: State-based routing (simpler, no dependency)**
```typescript
type Screen = 'language-select' | 'home' | 'practice' | 'help';
const [screen, setScreen] = useState<Screen>('language-select');
```

Either works for a demo. State-based routing is fewer moving parts; React Router is more "real". Your call.

---

## 13. Modifications to useRealtimeAgent Hook

The hook needs to be adapted to:

1. **Accept mode-specific configuration** — different system prompts for practice vs. help mode.
2. **Expose mute control** — return a mute toggle function and muted state.
3. **Accept the initial system message** — different greeting prompts per mode.

```typescript
interface UseRealtimeAgentOptions {
  tools: RealtimeAgentTools;
  instructions: string;
  voice?: string;
  initialMessage?: string;  // System message sent on connect
}

function useRealtimeAgent(options: UseRealtimeAgentOptions) {
  const sessionRef = useRef<RealtimeSession | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');

  // ... connect logic (adapt from prototype) ...
  
  const toggleMute = useCallback(() => {
    // Implementation depends on SDK — see §7
    setIsMuted(prev => !prev);
  }, []);

  return { sessionRef, isMuted, toggleMute, connectionStatus };
}
```

---

## 14. Walking Skeleton — Implementation Order

This is the suggested order for building the project:

### Phase 1: Scaffold & deploy
1. Copy the prototype repo into `roots-demo-for-hubl-01`
2. Update `package.json` name, description
3. Update `wrangler.json` name
4. Install any new dependencies
5. Strip out Gujarati-specific content
6. Verify it builds and deploys to Cloudflare (empty shell)
7. Set up the `OPENAI_API_KEY` secret in Cloudflare

### Phase 2: Language & routing
8. Add `languages.ts` data file
9. Add `useLanguage` hook
10. Add `LanguageSelectScreen` component
11. Add `HomeScreen` component
12. Set up routing (screens 1 → 2)
13. Verify language selection persists and UI text updates

### Phase 3: Practice Speaking mode
14. Write the practice mode system prompt in `agent/config.ts`
15. Create `displayPhrase` tool + `PhraseCard` component
16. Adapt `ratePronunciation` tool + `PronunciationRating` component
17. Adapt `providePronunciationFeedback` tool + `PronunciationFeedback` component
18. Create `PracticeSpeakingScreen` wiring tools to state to components
19. Add `VoiceStatus` component
20. **Add `MicMuteButton`** — critical, do this early
21. Test end-to-end: language select → home → practice → voice conversation

### Phase 4: Help & Support mode
22. Write the help mode system prompt
23. Add `providers.ts` data file  
24. Create `checkLocalProviders` tool + `ProviderCard` + `ProviderList` components
25. Create `HelpSupportScreen` wiring tools to state to components
26. Test end-to-end: home → help → voice conversation → providers appear

### Phase 5: Polish for demo
27. Visual polish — shadcn components, spacing, colours
28. Loading/connecting states
29. Error handling (API key issues, connection failures)
30. Test on mobile viewport / actual phone
31. Test the full 5-minute demo flow end to end
32. Deploy final version

---

## 15. Reference Materials

### Wireframes
See the HTML wireframe file produced during planning — shows all 4 screens at 320px mobile width.

### User flow diagram
See the Mermaid diagram produced during planning — shows the full navigation flow and tool interactions.

### HubL website
- Main: https://hubl.org.uk/
- Providers: https://hubl.org.uk/providers
- Norwich providers: https://hubl.org.uk/providers/norwich
- Yarmouth providers: https://hubl.org.uk/providers/yarmouth

### Prototype repo (basis for this project)
- https://github.com/hortfrancis/conversational-gujarati-prototype-01/
- Deployed: https://conversational-gujarati-prototype-01.alex-hortfrancis.workers.dev/

### OpenAI Realtime API docs
- https://platform.openai.com/docs/api-reference/realtime
- https://openai.github.io/openai-agents-js/openai/agents/realtime/classes/realtimeagent

---

## 16. Open Questions & Notes

- **shadcn/ui + Tailwind v4 compatibility:** Check this during scaffold phase. If painful, fall back to hand-rolled Tailwind.
- **Mute button SDK implementation:** Investigate `@openai/agents` SDK for audio stream control. This is the highest-risk unknown.
- **Voice selection:** Test different voices (`coral`, `marin`, `ballad`) during development. Pick the one that sounds clearest and warmest.
- **RTL support:** Arabic UI needs `dir="rtl"` on relevant containers. Test this explicitly.
- **Ephemeral key endpoint:** Keep unchanged from prototype. It works.
- **PWA manifest:** Nice-to-have for the demo but not essential. Skip if time is short.
