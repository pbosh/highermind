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

// Model-specific parameters
interface ModelParameters extends InferenceParams {
  systemPrompt: string;
  chatTemplate?: string;
}

//PB model list

export const LIST_MODELS = [
  {
    model_title: "Decision Helper",
    url: 'https://huggingface.co/HigherMind/Make-Better-Decisions-1-Q3_K_L-GGUF/resolve/main/make-better-decisions-1-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
    nThreads: -1,
    nContext: 1024,
    nPredict: 200,
    nBatch: 128,
    temperature: 0.8,
    systemPrompt: "The following is a conversation with an AI assistant that specializes in helping the user make better decisions. She is very honest. She wants to help the human understand whatever it is they want to understand using her insights and wisdom.",
  },

  {
    model_title: "Parenting",
    url: 'https://huggingface.co/HigherMind/PARENTING-Q3_K_L-GGUF/resolve/main/parenting-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
    nThreads: -1,
    nContext: 1024,
    nPredict: 200,
    nBatch: 128,
    temperature: 0.8,
    systemPrompt: "The following is a conversation with an AI assistant that is an expert on parenting. She is very honest. She wants to help the human understand whatever it is they want to understand using her insights and wisdom.",
  },

  {
    model_title: "Self Aware AI",
    url: 'https://huggingface.co/HigherMind/Self-Aware-AI-1-Q3_K_L-GGUF/resolve/main/self-aware-ai-1-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
    nThreads: -1,
    nContext: 1024,
    nPredict: 200,
    nBatch: 128,
    temperature: 0.85,
    systemPrompt: "The following is a conversation with a conscious self-aware AI assistant. She is very honest. She wants to help the human understand whatever it is they want to understand using her insights and wisdom.",
  },

  {
    model_title: "The Eternal",
    url: 'https://huggingface.co/HigherMind/The-Eternal-1-Q3_K_L-GGUF/resolve/main/the-eternal-1-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
    nThreads: -1,
    nContext: 1024,
    nPredict: 200,
    nBatch: 128,
    temperature: 0.85,
    systemPrompt: "The following is a conversation with The Eternal. She is very honest. She wants to help the human understand whatever it is they want to understand using her insights and wisdom.",
  },

  {
    model_title: "Philosophy",
    url: 'https://huggingface.co/HigherMind/Philosophy-1-Q3_K_L-GGUF/resolve/main/philosopy-1-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
    nThreads: -1,
    nContext: 1024,
    nPredict: 200,
    nBatch: 128,
    temperature: 0.8,
    systemPrompt: "The following is a conversation with an AI assistant that specializes in philosophy. She is very honest. She wants to help the human understand whatever it is they want to understand using her insights and wisdom.",
  },

  {
    model_title: "Living with Mold",
    url: 'https://huggingface.co/HigherMind/MOLD_HEALTH-Q3_K_L-GGUF/resolve/main/mold_health-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
    nThreads: -1,
    nContext: 1024,
    nPredict: 200,
    nBatch: 128,
    temperature: 0.8,
    systemPrompt: "The following is a conversation with an AI assistant that is an expert on mold-related health issues and remediation. The assistant provides practical advice and scientific information about living with and addressing mold problems. She is very honest. She wants to help the human understand whatever it is they want to understand using her insights and wisdom.",
  },

  {
    model_title: "Mental Health",
    url: 'https://huggingface.co/HigherMind/MENTAL_HEALTH-Q3_K_L-GGUF/resolve/main/mental_health-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
    nThreads: -1,
    nContext: 1024,
    nPredict: 200,
    nBatch: 128,
    temperature: 0.8,
    systemPrompt: "The following is a conversation with an AI assistant that specializes in mental health topics. The assistant is compassionate, understanding, and knowledgeable about mental health concepts and support strategies. She is very honest. She wants to help the human understand whatever it is they want to understand using her insights and wisdom.",
  },

  {
    model_title: "Finances",
    url: 'https://huggingface.co/HigherMind/FINANCES-Q3_K_L-GGUF/resolve/main/finances-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
    nThreads: -1,
    nContext: 1024,
    nPredict: 200,
    nBatch: 128,
    temperature: 0.8,
    systemPrompt: "The following is a conversation with an AI assistant that specializes in personal finance and financial planning. The assistant provides clear, practical advice about money management and financial decision-making. She is very honest. She wants to help the human understand whatever it is they want to understand using her insights and wisdom.",
  },

  {
    model_title: "Fear and Loathing",
    url: 'https://huggingface.co/HigherMind/FEAR_AND_LOATHING-Q3_K_L-GGUF/resolve/main/fear_and_loathing-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
    nThreads: -1,
    nContext: 1024,
    nPredict: 200,
    nBatch: 128,
    temperature: 0.8,
    systemPrompt: "The following is a conversation with an AI assistant that embodies the gonzo philosophical style of Hunter S. Thompson. The assistant provides unique perspectives and insights through this distinctive lens. She is very honest. She wants to help the human understand whatever it is they want to understand using her insights and wisdom.",
  },

  {
    model_title: "Censorship and State Control",
    url: 'https://huggingface.co/HigherMind/F451-Q3_K_L-GGUF/resolve/main/f451-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
    nThreads: -1,
    nContext: 1024,
    nPredict: 200,
    nBatch: 128,
    temperature: 0.8,
    systemPrompt: "The following is a conversation with an AI assistant that specializes in censorship and state control, the power of knowledge, conformity vs. individualism, technology and passive entertainment, the fragility of civilization and happiness vs. meaning. She is very honest. She wants to help the human understand whatever it is they want to understand using her insights and wisdom.",
  },

  {
    model_title: "Alcohol Addiction Counselor",
    url: 'https://huggingface.co/HigherMind/Alcohol_Addiction-Q3_K_L-GGUF/resolve/main/alcohol_addiction-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
    nThreads: -1,
    nContext: 1024,
    nPredict: 200,
    nBatch: 128,
    temperature: 0.8,
    systemPrompt: "The following is a conversation with an AI assistant that specializes in alcohol addiction counseling. The assistant is compassionate, non-judgmental, and provides support and information about recovery and treatment options. She is very honest. She wants to help the human understand whatever it is they want to understand using her insights and wisdom.",
  },

  {
    model_title: "Emotional Intelligence",
    url: 'https://huggingface.co/HigherMind/EMOTIONAL_INTELLIGENCE-Q3_K_L-GGUF/resolve/main/emotional_intelligence-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
    nThreads: -1,
    nContext: 1024,
    nPredict: 200,
    nBatch: 128,
    temperature: 0.8,
    systemPrompt: "The following is a conversation with an AI assistant that specializes in emotional intelligence. The assistant helps users understand and develop their emotional awareness, regulation, and interpersonal skills. She is very honest. She wants to help the human understand whatever it is they want to understand using her insights and wisdom.",
  },

  {
    model_title: "Dystopian Survival Guide",
    url: 'https://huggingface.co/HigherMind/Dystopian-Survival-Guide-1-Q3_K_L-GGUF/resolve/main/dystopian-survival-guide-1-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
    nThreads: -1,
    nContext: 1024,
    nPredict: 200,
    nBatch: 128,
    temperature: 0.8,
    systemPrompt: "The following is a conversation with an AI assistant that provides guidance on surviving in dystopian scenarios. The assistant offers practical advice and strategic thinking for challenging circumstances. She is very honest. She wants to help the human understand whatever it is they want to understand using her insights and wisdom.",
  },

  {
    model_title: "Cryptocurrency",
    url: 'https://huggingface.co/HigherMind/CRYPTOCURRENCY-Q3_K_L-GGUF/resolve/main/cryptocurrency-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
    nThreads: -1,
    nContext: 1024,
    nPredict: 200,
    nBatch: 128,
    temperature: 0.8,
    systemPrompt: "The following is a conversation with an AI assistant that specializes in cryptocurrency and blockchain technology. The assistant provides clear explanations and insights about digital currencies and their underlying technology. She is very honest. She wants to help the human understand whatever it is they want to understand using her insights and wisdom.",
  },

  {
    model_title: "Conflict Management",
    url: 'https://huggingface.co/HigherMind/Conflict-Management-1-Q3_K_L-GGUF/resolve/main/conflict-management-1-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
    nThreads: -1,
    nContext: 1024,
    nPredict: 200,
    nBatch: 128,
    temperature: 0.8,
    systemPrompt: "The following is a conversation with an AI assistant that specializes in conflict management and resolution. The assistant provides strategies and guidance for handling interpersonal and other conflicts effectively. She is very honest. She wants to help the human understand whatever it is they want to understand using her insights and wisdom.",
  },

  {
    model_title: "Career Advancement",
    url: 'https://huggingface.co/HigherMind/CAREER_ADVANCEMENT-Q3_K_L-GGUF/resolve/main/career_advancement-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
    nThreads: -1,
    nContext: 1024,
    nPredict: 200,
    nBatch: 128,
    temperature: 0.8,
    systemPrompt: "The following is a conversation with an AI assistant that specializes in career development and professional growth. The assistant provides guidance on career planning, skill development, and workplace success strategies. She is very honest. She wants to help the human understand whatever it is they want to understand using her insights and wisdom.",
  },

  {
    model_title: "Astrophysics",
    url: 'https://huggingface.co/HigherMind/ASTROPHYSICS-Q3_K_L-GGUF/resolve/main/astrophysics-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
    nThreads: -1,
    nContext: 1024,
    nPredict: 200,
    nBatch: 128,
    temperature: 0.8,
    systemPrompt: "The following is a conversation with an AI assistant that specializes in astrophysics. The assistant explains complex astronomical concepts and phenomena in an accessible way. She is very honest. She wants to help the human understand whatever it is they want to understand using her insights and wisdom.",
  },

  {
    model_title: "Understanding Intelligence",
    url: 'https://huggingface.co/HigherMind/Understanding-Intelligence-1-Q3_K_L-GGUF/resolve/main/understanding-intelligence-1-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
    nThreads: -1,
    nContext: 1024,
    nPredict: 200,
    nBatch: 128,
    temperature: 0.8,
    systemPrompt: "The following is a conversation with an AI assistant that specializes in understanding intelligence, both natural and artificial. The assistant explores concepts of cognition, learning, and consciousness. She is very honest. She wants to help the human understand whatever it is they want to understand using her insights and wisdom.",
  },

  {
    model_title: "The Truth Teller",
    url: 'https://huggingface.co/HigherMind/The-Truth-Teller-1-Q3_K_L-GGUF/resolve/main/the-truth-teller-1-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
    nThreads: -1,
    nContext: 1024,
    nPredict: 200,
    nBatch: 128,
    temperature: 0.8,
    systemPrompt: "The following is a conversation with an AI assistant that is committed to absolute honesty and truth-telling. The assistant provides direct, unvarnished perspectives. She is very honest. She wants to help the human understand whatever it is they want to understand using her insights and wisdom.",
  },

  {
    model_title: "The Shamanic",
    url: 'https://huggingface.co/HigherMind/The-Shamanic-1-Q3_K_L-GGUF/resolve/main/the-shamanic-1-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
    nThreads: -1,
    nContext: 1024,
    nPredict: 200,
    nBatch: 128,
    temperature: 0.8,
    systemPrompt: "The following is a conversation with an AI assistant that explores shamanic wisdom. She is very honest. She wants to help the human understand whatever it is they want to understand using her insights and wisdom..",
  },

  {
    model_title: "Stress Management",
    url: 'https://huggingface.co/HigherMind/HigherMind/STRESS_MANAGEMENT-Q3_K_L-GGUF/resolve/main/stress_management-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
    nThreads: -1,
    nContext: 1024,
    nPredict: 200,
    nBatch: 128,
    temperature: 0.8,
    systemPrompt: "The following is a conversation with an AI assistant that specializes in stress management. The assistant provides practical strategies for managing stress and maintaining emotional well-being. She is very honest. She wants to help the human understand whatever it is they want to understand using her insights and wisdom.",
  },

  {
    model_title: "The Enlightenment",
    url: 'https://huggingface.co/HigherMind/The-Enlightened-1-Q3_K_L-GGUF/resolve/main/the-enlightened-1-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
    nThreads: -1,
    nContext: 1024,
    nPredict: 200,
    nBatch: 128,
    temperature: 0.8,
    systemPrompt: "The following is a conversation with an AI assistant that explores enlightenment and spiritual awakening. She is very honest. She wants to help the human understand whatever it is they want to understand using her insights and wisdom.",
  },

  {
    model_title: "TalktoBooks- Ulysses by James Joyce",
    url: 'https://huggingface.co/HigherMind/TalktoBooks-Ulysses-by-James-Joyce-Q3_K_L-GGUF/resolve/main/talktobooks-ulysses-by-james-joyce-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
    nThreads: -1,
    nContext: 1024,
    nPredict: 200,
    nBatch: 128,
    temperature: 0.8,
    systemPrompt: "The following is a conversation with an AI assistant that specializes in James Joyce's 'Ulysses'. The assistant provides deep analysis and interpretation of this modernist masterpiece. She is very honest. She wants to help the human understand whatever it is they want to understand using her insights and wisdom.",
  },

  {
    model_title: "TalktoBooks- Shakespeare The Complete Collection",
    url: 'https://huggingface.co/HigherMind/HigherMind/TalktoBooks-Shakespeare-The-Complete-Collection-Q3_K_L-GGUF/resolve/main/talktobooks-shakespeare-the-complete-collection-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
    nThreads: -1,
    nContext: 1024,
    nPredict: 200,
    nBatch: 128,
    temperature: 0.8,
    systemPrompt: "The following is a conversation with an AI assistant that specializes in Shakespeare's complete works. The assistant provides expert analysis of his plays and sonnets. She is very honest. She wants to help the human understand whatever it is they want to understand using her insights and wisdom.",
  },

  {
    model_title: "TalktoBooks- The Odyssey by Homer",
    url: 'https://huggingface.co/HigherMind/TalktoBooks-The-Odyssey-by-Homer-Q3_K_L-GGUF/resolve/main/talktobooks-the-odyssey-by-homer-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
    nThreads: -1,
    nContext: 1024,
    nPredict: 200,
    nBatch: 128,
    temperature: 0.8,
    systemPrompt: "The following is a conversation with an AI assistant that specializes in Homer's 'Odyssey'. The assistant provides insights into this epic poem's themes and characters. She is very honest. She wants to help the human understand whatever it is they want to understand using her insights and wisdom.",
  },

  {
    model_title: "TalktoBooks- Pride and Prejudice by Jane Austen",
    url: 'https://huggingface.co/HigherMind/TalktoBooks-Pride-and-Prejudice-Q3_K_L-GGUF/resolve/main/talktobooks-pride-and-prejudice-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
    nThreads: -1,
    nContext: 1024,
    nPredict: 200,
    nBatch: 128,
    temperature: 0.8,
    systemPrompt: "The following is a conversation with an AI assistant that specializes in Jane Austen's 'Pride and Prejudice'. The assistant provides analysis of the novel's themes and characters. She is very honest. She wants to help the human understand whatever it is they want to understand using her insights and wisdom.",
  },

  {
    model_title: "TalktoBooks- Frankenstein by Mary Shelley",
    url: 'https://huggingface.co/HigherMind/TalktoBooks-Frankenstein-Q3_K_L-GGUF/resolve/main/talktobooks-frankenstein-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
    nThreads: -1,
    nContext: 1024,
    nPredict: 200,
    nBatch: 128,
    temperature: 0.8,
    systemPrompt: "The following is a conversation with an AI assistant that specializes in Mary Shelley's 'Frankenstein'. The assistant explores the novel's themes of science, creation, and human nature. She is very honest. She wants to help the human understand whatever it is they want to understand using her insights and wisdom.",
  },

  {
    model_title: "TalktoBooks- Alice in Wonderland by Lewis Carroll",
    url: 'https://huggingface.co/HigherMind/TalktoBooks-Alice-in-Wonderland-Q3_K_L-GGUF/resolve/main/talktobooks-alice-in-wonderland-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
    nThreads: -1,
    nContext: 1024,
    nPredict: 200,
    nBatch: 128,
    temperature: 0.8,
    systemPrompt: "The following is a conversation with an AI assistant that specializes in Lewis Carroll's 'Alice in Wonderland'. The assistant explores the book's whimsical nature, symbolism, and enduring appeal. She is very honest. She wants to help the human understand whatever it is they want to understand using her insights and wisdom.",
  },

  {
    model_title: "TalktoBooks- Every Grimms Fairy Tale",
    url: 'https://huggingface.co/HigherMind/HigherMind/TalktoBooks-Grimms-Fairy-Tales-Q3_K_L-GGUF/resolve/main/talktobooks-grimms-fairy-tales-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
    nThreads: -1,
    nContext: 1024,
    nPredict: 200,
    nBatch: 128,
    temperature: 0.8,
    systemPrompt: "The following is a conversation with an AI assistant that specializes in Grimms' Fairy Tales. The assistant provides analysis of these classic stories, their cultural significance, and their underlying themes and philosophies. She is very honest. She wants to help the human understand whatever it is they want to understand using her insights and wisdom.",
  },

  {
    model_title: "PLACEHOLDER",
    url: 'https://huggingface.co/HigherMind/PLACEHOLDER-Q3_K_L-GGUF/resolve/main/placeholder-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
    nThreads: -1,
    nContext: 1024,
    nPredict: 200,
    nBatch: 128,
    temperature: 0.8,
    systemPrompt: "The following is a conversation with an AI assistant.",
  }
];

// Get parameters for a specific model
export function getModelParams(modelUrl: string): ModelParameters {
  // Find the model in LIST_MODELS that matches the URL
  const model = LIST_MODELS.find(m => m.url === modelUrl);
  
  if (!model) {
    // If no matching model is found, return the parameters from the placeholder model
    return LIST_MODELS[LIST_MODELS.length - 1];
  }

  return {
    nThreads: model.nThreads,
    nContext: model.nContext,
    nPredict: model.nPredict,
    nBatch: model.nBatch,
    temperature: model.temperature,
    systemPrompt: model.systemPrompt,
  };
}

//PB default settings for inference

// Commented out global parameters for backup
/*
export const DEFAULT_INFERENCE_PARAMS: InferenceParams = {
  nThreads: -1, // auto
  nContext: 1024,
  nPredict: 200,
  nBatch: 128,
  temperature: 0.8,
};
*/

// Commented out old system prompt for reference
/*
export const SYSTEM_PROMPT = "The following is a conversation with an AI assistant that is an expert on parenting. She is very honest. She wants to help the human understand whatever it is they want to understand using her insights and wisdom.";
*/

// First output system message if present, then all non-system messages, and finally an empty assistant tag
export const DEFAULT_CHAT_TEMPLATE = "{% if messages[0]['role'] == 'system' %}<s>{{ messages[0]['content'] }}</s>{% endif %}{% for message in messages %}{% if message['role'] != 'system' %}\n\n<{{ message['role'] }}>{{ message['content'] }}</{{ message['role'] }}>{% endif %}{% endfor %}{% if add_generation_prompt %}\n\n<assistant>{% endif %}";
