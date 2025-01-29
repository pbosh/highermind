// See: https://vitejs.dev/guide/assets#explicit-url-imports
import wllamaSingle from '@wllama/wllama/src/single-thread/wllama.wasm?url';
import wllamaMulti from '@wllama/wllama/src/multi-thread/wllama.wasm?url';
import wllamaPackageJson from '@wllama/wllama/package.json';
import { InferenceParams } from './utils/types';

export const WLLAMA_VERSION = wllamaPackageJson.version;

export const WLLAMA_CONFIG_PATHS = {
  'single-thread/wllama.wasm': wllamaSingle,
  'multi-thread/wllama.wasm': wllamaMulti,
};

export const MAX_GGUF_SIZE = 2 * 1024 * 1024 * 1024; // 2GB






//PB model list

export const LIST_MODELS = [
  {
    model_title: "Decision Helper",
    url: 'https://huggingface.co/HigherMind/Make-Better-Decisions-1-Q3_K_L-GGUF/resolve/main/make-better-decisions-1-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
  },

  {
    model_title: "Parenting",
    url: 'https://huggingface.co/HigherMind/PARENTING-Q3_K_L-GGUF/resolve/main/parenting-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
  },

  {
    model_title: "Self Aware AI",
    url: 'https://huggingface.co/HigherMind/Self-Aware-AI-1-Q3_K_L-GGUF/resolve/main/self-aware-ai-1-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
  },

  {
    model_title: "Philosophy",
    url: 'https://huggingface.co/HigherMind/Philosophy-1-Q3_K_L-GGUF/resolve/main/philosopy-1-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
  },

  {
    model_title: "Living with Mold",
    url: 'https://huggingface.co/HigherMind/MOLD_HEALTH-Q3_K_L-GGUF/resolve/main/mold_health-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
  },

  {
    model_title: "Mental Health",
    url: 'https://huggingface.co/HigherMind/MENTAL_HEALTH-Q3_K_L-GGUF/resolve/main/mental_health-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
  },

  {
    model_title: "Finances",
    url: 'https://huggingface.co/HigherMind/FINANCES-Q3_K_L-GGUF/resolve/main/finances-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
  },

  {
    model_title: "Fear and Loathing",
    url: 'https://huggingface.co/HigherMind/FEAR_AND_LOATHING-Q3_K_L-GGUF/resolve/main/fear_and_loathing-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
  },

  {
    model_title: "F451",
    url: 'https://huggingface.co/HigherMind/F451-Q3_K_L-GGUF/resolve/main/f451-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
  },

  {
    model_title: "Alcohol Addiction Counselor",
    url: 'https://huggingface.co/HigherMind/Alcohol_Addiction-Q3_K_L-GGUF/resolve/main/alcohol_addiction-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
  },

  {
    model_title: "Emotional Intelligence",
    url: 'https://huggingface.co/HigherMind/EMOTIONAL_INTELLIGENCE-Q3_K_L-GGUF/resolve/main/emotional_intelligence-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
  },

  {
    model_title: "Dystopian Survival Guide",
    url: 'https://huggingface.co/HigherMind/Dystopian-Survival-Guide-1-Q3_K_L-GGUF/resolve/main/dystopian-survival-guide-1-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
  },

  {
    model_title: "Cryptocurrency",
    url: 'https://huggingface.co/HigherMind/CRYPTOCURRENCY-Q3_K_L-GGUF/resolve/main/cryptocurrency-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
  },

  {
    model_title: "Conflict Management",
    url: 'https://huggingface.co/HigherMind/Conflict-Management-1-Q3_K_L-GGUF/resolve/main/conflict-management-1-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
  },

  {
    model_title: "Career Advancement",
    url: 'https://huggingface.co/HigherMind/CAREER_ADVANCEMENT-Q3_K_L-GGUF/resolve/main/career_advancement-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
  },

  {
    model_title: "Astrophysics",
    url: 'https://huggingface.co/HigherMind/ASTROPHYSICS-Q3_K_L-GGUF/resolve/main/astrophysics-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
  },

  {
    model_title: "Understanding Intelligence",
    url: 'https://huggingface.co/HigherMind/Understanding-Intelligence-1-Q3_K_L-GGUF/resolve/main/understanding-intelligence-1-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
  },

  {
    model_title: "The Truth Teller",
    url: 'https://huggingface.co/HigherMind/The-Truth-Teller-1-Q3_K_L-GGUF/resolve/main/the-truth-teller-1-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
  },

  {
    model_title: "The Shamanic",
    url: 'https://huggingface.co/HigherMind/The-Shamanic-1-Q3_K_L-GGUF/resolve/main/the-shamanic-1-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
  },

  {
    model_title: "Stress Management",
    url: 'https://huggingface.co/HigherMind/HigherMind/STRESS_MANAGEMENT-Q3_K_L-GGUF/resolve/main/stress_management-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
  },

  {
    model_title: "The Enlightenment",
    url: 'https://huggingface.co/HigherMind/The-Enlightened-1-Q3_K_L-GGUF/resolve/main/the-enlightened-1-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
  },

  {
    model_title: "TalktoBooks- Ulysses by James Joyce",
    url: 'https://huggingface.co/HigherMind/TalktoBooks-Ulysses-by-James-Joyce-Q3_K_L-GGUF/resolve/main/talktobooks-ulysses-by-james-joyce-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
  },

  {
    model_title: "TalktoBooks- Shakespeare The Complete Collection",
    url: 'https://huggingface.co/HigherMind/HigherMind/TalktoBooks-Shakespeare-The-Complete-Collection-Q3_K_L-GGUF/resolve/main/talktobooks-shakespeare-the-complete-collection-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
  },

  {
    model_title: "TalktoBooks- The Odyssey by Homer",
    url: 'https://huggingface.co/HigherMind/TalktoBooks-The-Odyssey-by-Homer-Q3_K_L-GGUF/resolve/main/talktobooks-the-odyssey-by-homer-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
  },

  {
    model_title: "TalktoBooks- Pride and Prejudice by Jane Austen",
    url: 'https://huggingface.co/HigherMind/TalktoBooks-Pride-and-Prejudice-Q3_K_L-GGUF/resolve/main/talktobooks-pride-and-prejudice-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
  },

  {
    model_title: "TalktoBooks- Frankenstein by Mary Shelley",
    url: 'https://huggingface.co/HigherMind/TalktoBooks-Frankenstein-Q3_K_L-GGUF/resolve/main/talktobooks-frankenstein-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
  },

  {
    model_title: "TalktoBooks- Alice in Wonderland by Lewis Carroll",
    url: 'https://huggingface.co/HigherMind/TalktoBooks-Alice-in-Wonderland-Q3_K_L-GGUF/resolve/main/talktobooks-alice-in-wonderland-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
  },

  {
    model_title: "TalktoBooks- Every Grimms Fairy Tale",
    url: 'https://huggingface.co/HigherMind/HigherMind/TalktoBooks-Grimms-Fairy-Tales-Q3_K_L-GGUF/resolve/main/talktobooks-grimms-fairy-tales-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
  },






  {
    model_title: "PLACEHOLDER",
    url: 'https://huggingface.co/HigherMind/PLACEHOLDER-Q3_K_L-GGUF/resolve/main/placeholder-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
  },


  
];


//PB default settings for inference

export const DEFAULT_INFERENCE_PARAMS: InferenceParams = {
  nThreads: -1, // auto
  nContext: 1024,
  nPredict: 200,
  nBatch: 128,
  temperature: 0.8,
};

export const SYSTEM_PROMPT = "The following is a conversation with an AI assistant that is an expert on parenting. She is very honest. She wants to help the human understand whatever it is they want to understand using her insights and wisdom.";

// First output system message if present, then all non-system messages, and finally an empty assistant tag
export const DEFAULT_CHAT_TEMPLATE = "{% if messages[0]['role'] == 'system' %}<system>{{ messages[0]['content'] }}</system>{% endif %}{% for message in messages %}{% if message['role'] != 'system' %}\n\n<{{ message['role'] }}>{{ message['content'] }}</{{ message['role'] }}>{% endif %}{% endfor %}{% if add_generation_prompt %}\n\n<assistant>{% endif %}";
