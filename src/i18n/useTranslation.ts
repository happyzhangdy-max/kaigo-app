import { useState, useCallback, useMemo } from 'react';
import type { Locale, TranslationDict } from '../types';
import zh from './zh.json';
import ja from './ja.json';

const dictionaries: Record<Locale, TranslationDict> = { zh, ja };

/** 获取浏览器默认语言，映射到 'zh' | 'ja' */
function detectLocale(): Locale {
  const lang = navigator.language?.toLowerCase() || '';
  if (lang.startsWith('ja')) return 'ja';
  if (lang.startsWith('zh')) return 'zh';
  return 'zh'; // 默认中文
}

/**
 * 轻量 i18n hook — 不依赖任何第三方 i18n 库
 *
 * 用法:
 *   const { t, locale, setLocale } = useTranslation();
 *   t('hello')        // → "你好" / "こんにちは"
 *   t('question.number', { n: 3 })  // → "第3题" / "第3問"
 */
export function useTranslation() {
  const [locale, setLocaleState] = useState<Locale>(detectLocale);

  const dict = useMemo(() => dictionaries[locale], [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
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

  const toggleLocale = useCallback(() => {
    setLocaleState((prev) => (prev === 'zh' ? 'ja' : 'zh'));
  }, []);

  return { t, locale, setLocale, toggleLocale };
}
