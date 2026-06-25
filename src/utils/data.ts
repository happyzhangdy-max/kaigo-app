/**
 * 题目数据工具函数
 * 从 questions.json 读取并提供查询/筛选/随机功能
 */
import rawQuestions from '../data/questions.json';
import type { Question, Difficulty, ExamType } from '../types';

const questions = rawQuestions as Question[];

/** 默认考试类型：技能評価試験 */
export const DEFAULT_EXAM_TYPE: ExamType = 'skill';

/** 获取支持的所有考试类型 */
export function getExamTypes(): { type: ExamType; labelKey: string }[] {
  return [
    { type: 'skill', labelKey: 'examType.skill' },
    { type: 'national', labelKey: 'examType.national' },
  ];
}

/** 按考试类型筛选题目 */
export function getQuestionsByExamType(examType: ExamType): Question[] {
  return questions.filter((q) => q.examType === examType);
}

/** 获取所有科目（可按考试类型筛选） */
export function getSubjects(examType?: ExamType): string[] {
  const pool = examType ? getQuestionsByExamType(examType) : questions;
  const seen = new Set<string>();
  const result: string[] = [];
  for (const q of pool) {
    if (!seen.has(q.subject)) {
      seen.add(q.subject);
      result.push(q.subject);
    }
  }
  return result;
}

/** 获取指定科目的题目（可按考试类型筛选） */
export function getQuestionsBySubject(
  subject: string,
  examType?: ExamType,
): Question[] {
  const pool = examType ? getQuestionsByExamType(examType) : questions;
  return pool.filter((q) => q.subject === subject);
}

/** 获取指定 ID 的题目 */
export function getQuestionById(id: string): Question | undefined {
  return questions.find((q) => q.id === id);
}

/** 获取随机题目（可筛选科目和考试类型） */
export function getRandomQuestions(
  count: number,
  subject?: string,
  excludeIds?: Set<string>,
  examType?: ExamType,
): Question[] {
  let pool: Question[];
  if (subject) {
    pool = getQuestionsBySubject(subject, examType);
  } else if (examType) {
    pool = getQuestionsByExamType(examType);
  } else {
    pool = [...questions];
  }
  if (excludeIds && excludeIds.size > 0) {
    pool = pool.filter((q) => !excludeIds.has(q.id));
  }
  // 如果池子不够 count，返回全部
  if (pool.length <= count) return [...pool];
  // Fisher-Yates 洗牌
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

/** 获取科目的题目数量（可按考试类型筛选） */
export function getQuestionCountBySubject(
  subject: string,
  examType?: ExamType,
): number {
  const pool = examType ? getQuestionsByExamType(examType) : questions;
  return pool.filter((q) => q.subject === subject).length;
}

/** 获取指定考试类型的题目总数 */
export function getTotalQuestionCount(examType?: ExamType): number {
  if (examType) {
    return getQuestionsByExamType(examType).length;
  }
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
