/**
 * 题目数据工具函数
 * 从 questions.json 读取并提供查询/筛选/随机功能
 */
import rawQuestions from '../data/questions.json';
import type { Question, Difficulty } from '../types';

const questions = rawQuestions as Question[];

/** 获取所有科目（按 questions.json 中出现顺序去重） */
export function getSubjects(): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const q of questions) {
    if (!seen.has(q.subject)) {
      seen.add(q.subject);
      result.push(q.subject);
    }
  }
  return result;
}

/** 获取指定科目的题目 */
export function getQuestionsBySubject(subject: string): Question[] {
  return questions.filter((q) => q.subject === subject);
}

/** 获取指定 ID 的题目 */
export function getQuestionById(id: string): Question | undefined {
  return questions.find((q) => q.id === id);
}

/** 获取随机题目（可筛选科目） */
export function getRandomQuestions(
  count: number,
  subject?: string,
  excludeIds?: Set<string>,
): Question[] {
  let pool = subject ? getQuestionsBySubject(subject) : [...questions];
  if (excludeIds && excludeIds.size > 0) {
    pool = pool.filter((q) => !excludeIds.has(q.id));
  }
  // Fisher-Yates 洗牌
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

/** 获取科目的题目数量 */
export function getQuestionCountBySubject(subject: string): number {
  return questions.filter((q) => q.subject === subject).length;
}

/** 获取所有题目数量 */
export function getTotalQuestionCount(): number {
  return questions.length;
}

/** 获取所有难度等级 */
export function getDifficulties(): Difficulty[] {
  return ['basic', 'intermediate', 'advanced'];
}

/** 难度对应的显示文本 key */
export function getDifficultyKey(difficulty: Difficulty): string {
  const map: Record<Difficulty, string> = {
    basic: 'difficulty.basic',
    intermediate: 'difficulty.intermediate',
    advanced: 'difficulty.advanced',
  };
  return map[difficulty];
}
