import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from '../i18n/useTranslation';
import QuestionCard from '../components/exam/QuestionCard';
import AnswerFeedback from '../components/exam/AnswerFeedback';
import { getRandomQuestions, getQuestionsBySubject, DEFAULT_EXAM_TYPE } from '../utils/data';
import { saveAnswer, addBookmark, removeBookmark, isBookmarked } from '../utils/db';
import type { ExamType, Question } from '../types';

/** 答题主体——题目集合固定，通过外层 key 在切换科目/类型时整体重置 */
function Quiz({
  questions,
  activeExamType,
}: {
  questions: Question[];
  activeExamType: ExamType;
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [finished, setFinished] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex >= questions.length - 1;
  const progress =
    questions.length > 0
      ? ((currentIndex + (showResult ? 1 : 0)) / questions.length) * 100
      : 0;

  // 检查当前题目的书签状态（异步设置，不在 effect 同步 setState）
  useEffect(() => {
    if (!currentQuestion) return;
    let cancelled = false;
    isBookmarked(currentQuestion.id).then((b) => {
      if (!cancelled) setBookmarked(b);
    });
    return () => {
      cancelled = true;
    };
  }, [currentQuestion]);

  const handleSelectChoice = useCallback(
    async (choiceIndex: number) => {
      if (showResult || !currentQuestion) return;
      setSelectedChoice(choiceIndex);
      setShowResult(true);

      const isCorrect = choiceIndex === currentQuestion.correct;
      if (isCorrect) setCorrectCount((c) => c + 1);

      await saveAnswer({
        questionId: currentQuestion.id,
        correct: isCorrect,
        answeredAt: Date.now(),
        selectedChoice: choiceIndex,
      });
    },
    [showResult, currentQuestion],
  );

  const handleNext = useCallback(() => {
    if (isLastQuestion) {
      setFinished(true);
      return;
    }
    setCurrentIndex((i) => i + 1);
    setSelectedChoice(null);
    setShowResult(false);
  }, [isLastQuestion]);

  const handleBookmark = useCallback(async () => {
    if (!currentQuestion) return;
    if (bookmarked) {
      await removeBookmark(currentQuestion.id);
      setBookmarked(false);
    } else {
      await addBookmark(currentQuestion.id);
      setBookmarked(true);
    }
  }, [currentQuestion, bookmarked]);

  // 结果页
  if (finished) {
    const total = questions.length;
    const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    return (
      <div className="page page-exam">
        <div className="result-page">
          <h1>{t('exam.title')}</h1>
          <div className="result-card">
            <div className="result-score">{accuracy}%</div>
            <div className="result-stats">
              <div className="result-stat">
                <span className="result-stat-value">{correctCount}</span>
                <span className="result-stat-label">{t('dashboard.totalCorrect')}</span>
              </div>
              <div className="result-stat">
                <span className="result-stat-value">{total - correctCount}</span>
                <span className="result-stat-label">{t('answer.feedback.incorrect')}</span>
              </div>
              <div className="result-stat">
                <span className="result-stat-value">{total}</span>
                <span className="result-stat-label">{t('question.total', { n: total })}</span>
              </div>
            </div>
          </div>
          <div className="result-actions">
            <button
              className="btn btn-primary"
              onClick={() => navigate(0)} // 强制重新挂载，重新抽题
            >
              {t('start.random')}
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate(`/?examType=${activeExamType}`)}
            >
              {t('back.to.home')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="page page-exam">
        <p className="placeholder">{t('loading')}</p>
      </div>
    );
  }

  return (
    <div className="page page-exam">
      {/* 进度条 */}
      <div className="exam-progress">
        <div className="exam-progress-bar">
          <div className="exam-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="exam-progress-text">
          {t('question.number', { n: currentIndex + 1 })} / {questions.length}
        </span>
      </div>

      {/* 题目卡片 */}
      <QuestionCard
        question={currentQuestion}
        selectedChoice={selectedChoice}
        showResult={showResult}
        correctAnswer={currentQuestion.correct}
        onSelectChoice={handleSelectChoice}
      />

      {/* 书签 */}
      <div className="exam-bookmark">
        <button
          className={`btn-bookmark ${bookmarked ? 'bookmarked' : ''}`}
          onClick={handleBookmark}
        >
          {bookmarked ? '★' : '☆'} {bookmarked ? t('bookmark.remove') : t('bookmark.add')}
        </button>
      </div>

      {/* 反馈与解説 */}
      {showResult && (
        <AnswerFeedback
          question={currentQuestion}
          isCorrect={selectedChoice === currentQuestion.correct}
          selectedChoice={selectedChoice ?? 0}
        />
      )}

      {/* 下一题 */}
      {showResult && (
        <div className="exam-next">
          <button className="btn btn-primary btn-lg btn-block" onClick={handleNext}>
            {isLastQuestion ? t('back.to.home') : t('next.question')}
          </button>
        </div>
      )}
    </div>
  );
}

export default function Exam() {
  const { subject } = useParams<{ subject?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const examTypeParam = searchParams.get('examType') as ExamType | null;
  const activeExamType: ExamType = examTypeParam ?? DEFAULT_EXAM_TYPE;

  // 抽题：仅在科目 / 考试类型变化时重新计算
  const questions = useMemo<Question[]>(() => {
    if (subject) {
      return getQuestionsBySubject(decodeURIComponent(subject), activeExamType);
    }
    return getRandomQuestions(65, undefined, undefined, activeExamType);
  }, [subject, activeExamType]);

  // 题库为空 → 返回首页（导航属外部系统，可在 effect 中调用）
  useEffect(() => {
    if (questions.length === 0) navigate('/', { replace: true });
  }, [questions.length, navigate]);

  if (questions.length === 0) {
    return (
      <div className="page page-exam">
        <p className="placeholder">{t('loading')}</p>
      </div>
    );
  }

  // key 保证切换科目/类型时整套答题状态重置
  return (
    <Quiz
      key={`${subject ?? 'random'}-${activeExamType}`}
      questions={questions}
      activeExamType={activeExamType}
    />
  );
}
