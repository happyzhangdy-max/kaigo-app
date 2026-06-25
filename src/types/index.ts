/** 支持的语言 */
export type Locale = 'zh' | 'ja';

/** 翻译字典键值对 */
export type TranslationDict = Record<string, string>;

/** 术语条目 */
export interface TermEntry {
  ja: string;
  zh: string;
  description: string;
}

/** 术语表 */
export type Glossary = Record<string, TermEntry>;

/** 题目难度 */
export type Difficulty = 'basic' | 'intermediate' | 'advanced';

/** 考试类型 */
export type ExamType = 'national' | 'skill';

/** 题目 */
export interface Question {
  id: string;
  subject: string;
  category: string;
  question: string;
  choices: string[];
  correct: number;
  ja_explanation: string;
  zh_explanation: string;
  term_refs: string[];
  difficulty: Difficulty;
  examType: ExamType;
}

/** 答题记录 */
export interface AnswerRecord {
  questionId: string;
  correct: boolean;
  answeredAt: number;
  selectedChoice: number;
}

/** 书签 */
export interface BookmarkEntry {
  questionId: string;
  createdAt: number;
}

/** 科目统计 */
export interface SubjectStats {
  subject: string;
  total: number;
  answered: number;
  correct: number;
}

/** 学习统计汇总 */
export interface LearningStats {
  totalAnswered: number;
  totalCorrect: number;
  streakCorrect: number;
  todayAnswered: number;
  todayCorrect: number;
  bookmarkCount: number;
  subjectStats: SubjectStats[];
}
