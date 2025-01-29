import { useCallback, useEffect } from 'react';
import { Screen } from './types';

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const useDidMount = (callback: () => any) =>
  useEffect(() => {
    callback();
  }, []);

type StorageKey = 'conversations' | 'params' | 'welcome' | 'custom_models';

export const WllamaStorage = {
  save<T>(key: StorageKey, data: T) {
    localStorage.setItem(key, JSON.stringify(data));
  },
  load<T>(key: StorageKey, defaultValue: T): T {
    if (localStorage[key]) {
      return JSON.parse(localStorage[key]);
    } else {
      return defaultValue;
    }
  },
};

export const getDefaultScreen = (): Screen => {
  const welcome: boolean = WllamaStorage.load('welcome', true);
  return welcome ? Screen.GUIDE : Screen.CHAT;
};

export const toHumanReadableSize = (bytes: number): string => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

export const DebugLogger = {
  content: [] as string[],
  debug(...args: any) {
    const message = DebugLogger.argsToStr(args);
    console.debug('ℹ️', ...args);
    DebugLogger.content.push(`ℹ️ ${message}`);
  },
  log(..._args: any) {
    // Commented out for now
    // console.log('ℹ️', ..._args);
    // DebugLogger.content.push(`ℹ️ ${DebugLogger.argsToStr(_args)}`);
  },
  warn(..._args: any) {
    // Commented out for now
    // console.warn('⚠️', ..._args);
    // DebugLogger.content.push(`⚠️ ${DebugLogger.argsToStr(_args)}`);
  },
  error(...args: any) {
    // Keep error logging but use console.error
    console.error('☠️', ...args);
    // DebugLogger.content.push(`☠️ ${DebugLogger.argsToStr(args)}`);
  },
  argsToStr(args: any[]): string {
    return args
      .map((arg) => {
        if (arg.startsWith) {
          return arg;
        } else {
          try {
            return JSON.stringify(arg, null, 2);
          } catch (_) {
            return '';
          }
        }
      })
      .join(' ');
  },
};

export function useDebounce<T extends any[]>(
  effect: (...args: T) => void,
  dependencies: any[],
  delay: number
): void {
  const callback = useCallback(effect, dependencies);
  useEffect(() => {
    const timeout = setTimeout(callback, delay);
    return () => clearTimeout(timeout);
  }, [callback, delay]);
}
