import { createContext, useContext, useMemo, useState } from 'react';
import {
  DebugLogger,
  getDefaultScreen,
  useDidMount,
  WllamaStorage,
} from './utils';
import { Model, ModelManager, Wllama } from '@wllama/wllama';
import { WLLAMA_CONFIG_PATHS, LIST_MODELS } from '../config';
import { InferenceParams, RuntimeInfo, ModelState, Screen, Message } from './types';
import { verifyCustomModel } from './custom-models';
import {
  DisplayedModel,
  getDisplayedModels,
  getUserAddedModels,
  updateUserAddedModels,
} from './displayed-model';

interface WllamaContextValue {
  // functions for managing models
  models: DisplayedModel[];
  downloadModel(model: DisplayedModel): Promise<void>;
  removeCachedModel(model: DisplayedModel): Promise<void>;
  removeAllCachedModels(): Promise<void>;
  isDownloading: boolean;
  isLoadingModel: boolean;
  currParams: InferenceParams;
  setParams(params: InferenceParams): void;

  // function to load/unload model
  loadedModel?: DisplayedModel;
  currRuntimeInfo?: RuntimeInfo;
  loadModel(model: DisplayedModel): Promise<void>;
  unloadModel(): Promise<void>;

  // function for managing custom user model
  addCustomModel(url: string): Promise<void>;
  removeCustomModel(model: DisplayedModel): Promise<void>;

  // functions for chat completion
  getWllamaInstance(): Wllama;
  createCompletion(
    input: string,
    callback: (piece: string) => void
  ): Promise<void>;
  formatChat(messages: Message[]): Promise<string>;
  stopCompletion(): void;
  isGenerating: boolean;
  currentConvId: number;

  // nagivation
  navigateTo(screen: Screen, conversationId?: number): void;
  currScreen: Screen;
}

const WllamaContext = createContext<WllamaContextValue>({} as any);

const modelManager = new ModelManager();
let wllamaInstance = new Wllama(WLLAMA_CONFIG_PATHS);
let stopSignal = false;
let stopTokens: number[] = [];

const resetWllamaInstance = () => {
  wllamaInstance = new Wllama(WLLAMA_CONFIG_PATHS);
  stopTokens = [];
};

const initStopTokens = async () => {
  // Initialize empty stop tokens array
  stopTokens = [];
  DebugLogger.debug('Initialized stop tokens:', stopTokens);
};

export const WllamaProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentConvId, setCurrentConvId] = useState<number>(0);
  const [currScreen, setCurrScreen] = useState<Screen>(getDefaultScreen());
  const [cachedModels, setCachedModels] = useState<Model[]>([]);
  const [isBusy, setBusy] = useState(false);
  const [currRuntimeInfo, setCurrRuntimeInfo] = useState<RuntimeInfo>();
  const [currParams, setCurrParams] = useState<InferenceParams>({
    nThreads: LIST_MODELS[0].nThreads,
    nContext: LIST_MODELS[0].nContext,
    nPredict: LIST_MODELS[0].nPredict,
    nBatch: LIST_MODELS[0].nBatch,
    temperature: LIST_MODELS[0].temperature,
  });
  const [downloadingProgress, setDownloadingProgress] = useState<
    Record<DisplayedModel['url'], number>
  >({});
  const [loadedModel, setLoadedModel] = useState<DisplayedModel>();

  const isDownloading = useMemo(
    () => Object.values(downloadingProgress).some((p) => p >= 0 && p < 100),
    [downloadingProgress]
  );

  const isLoadingModel = useMemo(() => isBusy, [isBusy]);

  const refreshCachedModels = async () => {
    setCachedModels(await modelManager.getModels());
  };
  useDidMount(refreshCachedModels);

  // computed variables
  const models = useMemo(() => {
    const list = getDisplayedModels(cachedModels);
    for (const model of list) {
      model.downloadPercent = downloadingProgress[model.url] ?? -1;
      if (model.downloadPercent >= 0) {
        model.state = ModelState.DOWNLOADING;
      }
      if (loadedModel?.url === model.url) {
        model.state = loadedModel.state;
      }
    }
    return list;
  }, [cachedModels, downloadingProgress, loadedModel]);

  // utils
  const updateModelDownloadState = (
    url: string,
    downloadPercent: number = -1
  ) => {
    if (downloadPercent < 0) {
      setDownloadingProgress((p) => {
        const newProgress = { ...p };
        delete newProgress[url];
        return newProgress;
      });
    } else {
      setDownloadingProgress((p) => ({ ...p, [url]: downloadPercent }));
    }
  };

  const downloadModel = async (model: DisplayedModel) => {
    if (isDownloading || loadedModel || isLoadingModel) return;
    updateModelDownloadState(model.url, 0);
    try {
      await modelManager.downloadModel(model.url, {
        progressCallback(opts) {
          updateModelDownloadState(model.url, opts.loaded / opts.total);
        },
      });
      updateModelDownloadState(model.url, -1);
      await refreshCachedModels();
    } catch (e) {
      alert((e as any)?.message || 'unknown error while downloading model');
    }
  };

  const removeCachedModel = async (model: DisplayedModel) => {
    if (isDownloading || loadedModel || isLoadingModel) return;
    if (model.cachedModel) {
      await model.cachedModel.remove();
      await refreshCachedModels();
    }
  };

  const removeAllCachedModels = async () => {
    if (isDownloading || loadedModel || isLoadingModel) return;
    await modelManager.clear();
    await refreshCachedModels();
  };

  const loadModel = async (model: DisplayedModel) => {
    if (isDownloading || loadedModel || isLoadingModel) return;
    // make sure the model is cached
    if (!model.cachedModel) {
      throw new Error('Model is not in cache');
    }
    setLoadedModel(model.clone({ state: ModelState.LOADING }));
    try {
      await model.cachedModel.validate();
      await wllamaInstance.loadModel(model.cachedModel);
      await initStopTokens();
      setLoadedModel(model.clone({ state: ModelState.LOADED }));
      setCurrRuntimeInfo({
        isMultithread: wllamaInstance.isMultithread(),
        hasChatTemplate: !!wllamaInstance.getChatTemplate(),
      });
    } catch (e) {
      resetWllamaInstance();
      const errorMessage = e instanceof Error ? e.message : 
        (typeof e === 'string' ? e : 'Unknown error while loading model');
      DebugLogger.debug('Model loading error:', e);
      DebugLogger.debug('Error type:', typeof e);
      alert(`Failed to load model: ${errorMessage}`);
      setLoadedModel(undefined);
    }
  };

  const unloadModel = async () => {
    if (!loadedModel) return;
    await wllamaInstance.exit();
    resetWllamaInstance();
    setLoadedModel(undefined);
    setCurrRuntimeInfo(undefined);
  };

  const formatChat = async (messages: Message[]): Promise<string> => {
    // Convert messages to the format expected by createChatCompletion
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Return as JSON string
    return JSON.stringify(formattedMessages);
  };

  const createCompletion = async (
    input: string,
    callback: (piece: string) => void
  ) => {
    try {
      setIsGenerating(true);
      stopSignal = false;
      
      DebugLogger.debug('=== MODEL STATE ===');
      DebugLogger.debug('Model loaded:', !!loadedModel);
      DebugLogger.debug('Is generating:', isGenerating);
      DebugLogger.debug('=== END MODEL STATE ===');

      const completionOpts = {
        stopTokens,
        nPredict: currParams.nPredict,
        sampling: {
          temp: currParams.temperature,
          topP: 0.9,
          repeatPenalty: 1.1
        },
        onNewToken: (_: number, __: Uint8Array, currentText: string) => {
          if (stopSignal) {
            DebugLogger.debug('Generation stopped by user');
            return;
          }
          callback(currentText);
        },
      };

      DebugLogger.debug('Completion options:', completionOpts);
      
      let finalText = '';
      await wllamaInstance.createChatCompletion(JSON.parse(input), {
        ...completionOpts,
        onNewToken: (_: number, __: Uint8Array, currentText: string) => {
          if (stopSignal) {
            DebugLogger.debug('Generation stopped by user');
            return;
          }
          finalText = currentText;
          callback(currentText);
        }
      });
      
      DebugLogger.debug('=== COMPLETION END ===');
      DebugLogger.debug('Final generated text:', finalText);

    } catch (error: any) {
      DebugLogger.debug('=== COMPLETION ERROR ===');
      DebugLogger.debug('Error type:', error.constructor.name);
      DebugLogger.debug('Error message:', error.message);
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const stopCompletion = () => {
    stopSignal = true;
  };

  const navigateTo = (screen: Screen, conversationId?: number) => {
    setCurrScreen(screen);
    setCurrentConvId(conversationId ?? 0);
    if (screen === Screen.MODEL) {
      WllamaStorage.save('welcome', false);
    }
  };

  // proxy function for saving to localStorage
  const setParams = (val: InferenceParams) => {
    WllamaStorage.save('params', val);
    setCurrParams(val);
  };

  // function for managing custom user model
  const addCustomModel = async (url: string) => {
    setBusy(true);
    try {
      const custom = await verifyCustomModel(url);
      if (models.some((m) => m.url === custom.url)) {
        throw new Error('Model with the same URL already exist');
      }
      const userAddedModels = getUserAddedModels(cachedModels);
      updateUserAddedModels([
        ...userAddedModels,
        new DisplayedModel(custom.url, custom.size, true, undefined),
      ]);
      await refreshCachedModels();
    } catch (e) {
      setBusy(false);
      throw e; // re-throw
    }
    setBusy(false);
  };

  const removeCustomModel = async (model: DisplayedModel) => {
    setBusy(true);
    if (model.isUserAdded) {
      const userAddedModels = getUserAddedModels(cachedModels);
      const newList = userAddedModels.filter((m) => m.url !== model.url);
      updateUserAddedModels(newList);
      await refreshCachedModels();
    } else {
      throw new Error('Cannot remove non-user-added model');
    }
    setBusy(false);
  };

  const contextValue = useMemo<WllamaContextValue>(
    () => ({
      models,
      downloadModel,
      removeCachedModel,
      removeAllCachedModels,
      isDownloading,
      isLoadingModel,
      currParams,
      setParams,
      loadedModel,
      currRuntimeInfo,
      loadModel,
      unloadModel,
      addCustomModel,
      removeCustomModel,
      getWllamaInstance: () => wllamaInstance,
      createCompletion,
      formatChat,
      stopCompletion,
      isGenerating,
      currentConvId,
      navigateTo,
      currScreen,
    }),
    [
      models,
      isDownloading,
      isLoadingModel,
      currParams,
      loadedModel,
      currRuntimeInfo,
      isGenerating,
      currentConvId,
      currScreen,
    ]
  );

  return (
    <WllamaContext.Provider value={contextValue}>
      {children}
    </WllamaContext.Provider>
  );
};

export const useWllama = () => useContext(WllamaContext);
