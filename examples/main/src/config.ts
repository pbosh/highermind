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
    model_title: "PLACEHOLDER",
    url: 'https://huggingface.co/HigherMind/PLACEHOLDER-Q3_K_L-GGUF/resolve/main/placeholder-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
  },


  
];


//PB default settings for inference

export const DEFAULT_INFERENCE_PARAMS: InferenceParams = {
  nThreads: -1, // auto
  nContext: 2048,
  nPredict: 200,
  nBatch: 128,
  temperature: 0.8,
};





export const DEFAULT_CHAT_TEMPLATE =
  "{% for message in messages %}{{'<|im_start|>' + message['role'] + '\n' + message['content'] + '<|im_end|>' + '\n'}}{% endfor %}{% if add_generation_prompt %}{{ '<|im_start|>assistant\n' }}{% endif %}";
