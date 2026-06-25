import { useSyncExternalStore, useCallback } from 'react';

/** 主题模式：跟随系统 / 强制亮色 / 强制暗色 */
export type ThemeMode = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'kaigo-theme';

function loadTheme(): ThemeMode {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'system' || saved === 'light' || saved === 'dark') return saved;
  } catch {
    /* ignore */
  }
  return 'system';
}

let currentTheme: ThemeMode = loadTheme();
const listeners = new Set<() => void>();

/** 把当前主题写到 <html data-theme>，'system' 时移除属性交给媒体查询 */
function applyTheme(mode: ThemeMode) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (mode === 'system') {
    root.removeAttribute('data-theme');
  } else {
    root.setAttribute('data-theme', mode);
  }
}
applyTheme(currentTheme);

function setThemeGlobal(next: ThemeMode) {
  if (next === currentTheme) return;
  currentTheme = next;
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* ignore */
  }
  applyTheme(next);
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): ThemeMode {
  return currentTheme;
}

/** 系统当前是否暗色（用于 system 模式下决定切换图标的语义） */
function systemPrefersDark(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-color-scheme: dark)').matches
  );
}

/**
 * 主题 hook，全局共享。
 *   const { theme, setTheme, isDark, toggleTheme } = useTheme();
 */
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const isDark = theme === 'dark' || (theme === 'system' && systemPrefersDark());

  const setTheme = useCallback((next: ThemeMode) => setThemeGlobal(next), []);

  /** 在亮/暗之间切换（明确写入 light/dark，不再跟随系统） */
  const toggleTheme = useCallback(() => {
    setThemeGlobal(isDark ? 'light' : 'dark');
  }, [isDark]);

  return { theme, setTheme, isDark, toggleTheme };
}
