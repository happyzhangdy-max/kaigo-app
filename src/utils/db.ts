/**
 * IndexedDB 工具模块
 * 使用 idb 库简化操作
 * 存储答题记录和书签
 */
import { openDB } from 'idb';
import type {
  AnswerRecord,
  BookmarkEntry,
  LearningStats,
  SubjectStats,
  Question,
} from '../types';
import rawQuestions from '../data/questions.json';
import { getSubjects } from './data';

const DB_NAME = 'kaigo-app';
const DB_VERSION = 1;

const questions = rawQuestions as Question[];
const qSubjectMap = new Map<string, string>();
for (const q of questions) {
  qSubjectMap.set(q.id, q.subject);
}

/** 获取数据库实例 */
async function getDb() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('answers')) {
        const store = db.createObjectStore('answers', {
          keyPath: 'questionId',
        });
        store.createIndex('answeredAt', 'answeredAt');
        store.createIndex('correct', 'correct');
      }
      if (!db.objectStoreNames.contains('bookmarks')) {
        const store = db.createObjectStore('bookmarks', {
          keyPath: 'questionId',
        });
        store.createIndex('createdAt', 'createdAt');
      }
    },
  });
}

// ---- 答题记录 ----

/** 保存一条答题记录 */
export async function saveAnswer(record: AnswerRecord): Promise<void> {
  const db = await getDb();
  await db.put('answers', record);
}

/** 获取某题的答题记录 */
export async function getAnswer(
  questionId: string,
): Promise<AnswerRecord | undefined> {
  const db = await getDb();
  return db.get('answers', questionId);
}

/** 获取所有答题记录 */
export async function getAllAnswers(): Promise<AnswerRecord[]> {
  const db = await getDb();
  return db.getAll('answers');
}

/** 获取今日答题数 */
export async function getTodayStats(): Promise<{
  answered: number;
  correct: number;
}> {
  const db = await getDb();
  const all = await db.getAll('answers');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStart = today.getTime();
  const todayEnd = todayStart + 86400000;

  const todayRecords = all.filter(
    (r) => r.answeredAt >= todayStart && r.answeredAt < todayEnd,
  );
  return {
    answered: todayRecords.length,
    correct: todayRecords.filter((r) => r.correct).length,
  };
}

/** 获取连続正解数（从最新记录往前数，直到遇到错误） */
export async function getStreakCorrect(): Promise<number> {
  const db = await getDb();
  const all = await db.getAll('answers');
  if (all.length === 0) return 0;
  all.sort((a, b) => b.answeredAt - a.answeredAt);
  let streak = 0;
  for (const r of all) {
    if (r.correct) streak++;
    else break;
  }
  return streak;
}

/** 获取完整学习统计 */
export async function getLearningStats(): Promise<LearningStats> {
  const db = await getDb();
  const allAnswers = await db.getAll('answers');
  const allBookmarks = await db.getAll('bookmarks');
  const subjects = getSubjects();

  // 按时间降序（连続正解）
  const sorted = [...allAnswers].sort((a, b) => b.answeredAt - a.answeredAt);
  let streak = 0;
  for (const r of sorted) {
    if (r.correct) streak++;
    else break;
  }

  // 今日
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStart = today.getTime();
  const todayEnd = todayStart + 86400000;
  const todayRecords = allAnswers.filter(
    (r) => r.answeredAt >= todayStart && r.answeredAt < todayEnd,
  );

  // 科目統計
  const subjectStats: SubjectStats[] = subjects.map((subject) => {
    const subjectQuestions = questions.filter((q) => q.subject === subject);
    const subjectAnswers = allAnswers.filter((r) => {
      const subj = qSubjectMap.get(r.questionId);
      return subj === subject;
    });
    return {
      subject,
      total: subjectQuestions.length,
      answered: subjectAnswers.length,
      correct: subjectAnswers.filter((r) => r.correct).length,
    };
  });

  return {
    totalAnswered: allAnswers.length,
    totalCorrect: allAnswers.filter((r) => r.correct).length,
    streakCorrect: streak,
    todayAnswered: todayRecords.length,
    todayCorrect: todayRecords.filter((r) => r.correct).length,
    bookmarkCount: allBookmarks.length,
    subjectStats,
  };
}

// ---- 书签 ----

/** 添加书签 */
export async function addBookmark(questionId: string): Promise<void> {
  const db = await getDb();
  await db.put('bookmarks', {
    questionId,
    createdAt: Date.now(),
  } as BookmarkEntry);
}

/** 移除书签 */
export async function removeBookmark(questionId: string): Promise<void> {
  const db = await getDb();
  await db.delete('bookmarks', questionId);
}

/** 检查是否已加书签 */
export async function isBookmarked(questionId: string): Promise<boolean> {
  const db = await getDb();
  const entry = await db.get('bookmarks', questionId);
  return !!entry;
}

/** 获取所有书签 */
export async function getAllBookmarks(): Promise<BookmarkEntry[]> {
  const db = await getDb();
  return db.getAll('bookmarks');
}

/** 获取所有星标题目的 ID 集合 */
export async function getBookmarkedIds(): Promise<Set<string>> {
  const bookmarks = await getAllBookmarks();
  return new Set(bookmarks.map((b) => b.questionId));
}

/** 获取各科目统计 */
export async function getSubjectStats(): Promise<SubjectStats[]> {
  const stats = await getLearningStats();
  return stats.subjectStats;
}

/** 清除所有数据 */
export async function clearAllData(): Promise<void> {
  const db = await getDb();
  await db.clear('answers');
  await db.clear('bookmarks');
}
