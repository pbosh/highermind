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
    url: 'https://huggingface.co/HigherMind/Make-Better-Decisions-1-Q3_K_L-GGUF/resolve/main/make-better-decisions-1-q3_k_l-00001-of-00008.gguf',
    size: 3880000000,
  },
  {
    url: 'https://huggingface.co/HigherMind/Alcohol_Addiction-Q3_K_L-GGUF/resolve/main/alcohol_addiction-q3_k_l-00001-of-00008.gguf',
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
