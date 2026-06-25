/**
 * 介護専門用語表（terms.json）查询工具
 * terms.json 形如 { "<key>": { ja, zh, description }, ... }
 */
import rawTerms from '../i18n/terms.json';
import type { Glossary, TermEntry } from '../types';

const glossary = rawTerms as Glossary;

/** key → entry 的直接索引 */
const byKey = glossary;

/** 同时按 key 和 ja 名建立索引，方便 term_refs 用日文名引用 */
const byJa = new Map<string, TermEntry & { key: string }>();
for (const [key, entry] of Object.entries(glossary)) {
  byJa.set(entry.ja, { key, ...entry });
  byJa.set(key, { key, ...entry });
}

/** 取全部术语（带 key），按日文名排序 */
export function getAllTerms(): (TermEntry & { key: string })[] {
  return Object.entries(glossary)
    .map(([key, entry]) => ({ key, ...entry }))
    .sort((a, b) => a.ja.localeCompare(b.ja, 'ja'));
}

/** 按 key 或日文名查单条术语 */
export function getTerm(ref: string): (TermEntry & { key: string }) | undefined {
  if (byKey[ref]) return { key: ref, ...byKey[ref] };
  return byJa.get(ref);
}

/** 把一组 term_refs 解析为术语条目（忽略找不到的） */
export function resolveTermRefs(
  refs: string[] | undefined,
): (TermEntry & { key: string })[] {
  if (!refs?.length) return [];
  const seen = new Set<string>();
  const result: (TermEntry & { key: string })[] = [];
  for (const ref of refs) {
    const term = getTerm(ref);
    if (term && !seen.has(term.key)) {
      seen.add(term.key);
      result.push(term);
    }
  }
  return result;
}

/** 关键词搜索（匹配日文名/中文名/解説） */
export function searchTerms(
  query: string,
): (TermEntry & { key: string })[] {
  const q = query.trim().toLowerCase();
  if (!q) return getAllTerms();
  return getAllTerms().filter(
    (t) =>
      t.ja.toLowerCase().includes(q) ||
      t.zh.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q),
  );
}

/** 术语总数 */
export function getTermCount(): number {
  return Object.keys(glossary).length;
}
