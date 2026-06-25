import { useSyncExternalStore, useCallback, useMemo } from 'react';
import type { Locale, TranslationDict } from '../types';
import zh from './zh.json';
import ja from './ja.json';

const dictionaries: Record<Locale, TranslationDict> = { zh, ja };

const STORAGE_KEY = 'kaigo-locale';

/** 获取浏览器默认语言，映射到 'zh' | 'ja' */
function detectLocale(): Locale {
  const lang = navigator.language?.toLowerCase() || '';
  if (lang.startsWith('ja')) return 'ja';
  if (lang.startsWith('zh')) return 'zh';
  return 'zh'; // 默认中文
}

/** 读取持久化的语言；无则按浏览器语言探测 */
function loadLocale(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'zh' || saved === 'ja') return saved;
  } catch {
    /* localStorage 不可用时忽略 */
  }
  return detectLocale();
}

// ---- 模块级全局 store（所有组件共享同一份 locale）----

let currentLocale: Locale = loadLocale();
const listeners = new Set<() => void>();

function applyHtmlLang(locale: Locale) {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = locale === 'ja' ? 'ja' : 'zh-CN';
  }
}
applyHtmlLang(currentLocale);

function setLocaleGlobal(next: Locale) {
  if (next === currentLocale) return;
  currentLocale = next;
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* ignore */
  }
  applyHtmlLang(next);
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): Locale {
  return currentLocale;
}

/**
 * 轻量 i18n hook — 不依赖第三方库，全局共享 locale。
 *
 * 用法:
 *   const { t, locale, setLocale, toggleLocale } = useTranslation();
 *   t('hello')                       // → "你好" / "こんにちは"
 *   t('question.number', { n: 3 })   // → "第3题" / "第3問"
 */
export function useTranslation() {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const dict = useMemo(() => dictionaries[locale], [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleGlobal(next);
  }, []);

  const toggleLocale = useCallback(() => {
    setLocaleGlobal(currentLocale === 'zh' ? 'ja' : 'zh');
  }, []);

  /** 简易插值：将 {{key}} 替换为 params[key] */
  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      let val = dict[key];
      if (val === undefined) {
        console.warn(`[i18n] Missing key "${key}" in locale "${locale}"`);
        val = key; // fallback → 显示 key 本身
      }
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          val = val.replace(`{{${k}}}`, String(v));
        }
      }
      return val;
    },
    [dict, locale],
  );

  return { t, locale, setLocale, toggleLocale };
}
