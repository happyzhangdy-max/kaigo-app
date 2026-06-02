import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from '../i18n/useTranslation';
import QuestionCard from '../components/exam/QuestionCard';
import AnswerFeedback from '../components/exam/AnswerFeedback';
import Card from '../components/common/Card';
import { getRandomQuestions, getQuestionsBySubject } from '../utils/data';
import { saveAnswer, addBookmark, removeBookmark, isBookmarked } from '../utils/db';
import type { Question } from '../types';

export default function Exam() {
  const { subject } = useParams<{ subject?: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [finished, setFinished] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const initRef = useRef(false);

  // 初始化题目
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    let pool: Question[];
    if (subject) {
      pool = getQuestionsBySubject(decodeURIComponent(subject));
    } else {
      pool = getRandomQuestions(54);
    }

    if (pool.length === 0) {
      navigate('/');
      return;
    }

    setQuestions(pool);
    setCurrentIndex(0);
    setSelectedChoice(null);
    setShowResult(false);
    setFinished(false);
    setCorrectCount(0);
  }, [subject, navigate]);

  // 检查当前题目的书签状态
  useEffect(() => {
    if (questions.length === 0) return;
    const q = questions[currentIndex];
    if (!q) return;
    isBookmarked(q.id).then(setBookmarked);
  }, [questions, currentIndex]);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex >= questions.length - 1;
  const progress = questions.length > 0
    ? ((currentIndex + (showResult ? 1 : 0)) / questions.length) * 100
    : 0;

  const handleSelectChoice = useCallback(
    async (choiceIndex: number) => {
      if (showResult || !currentQuestion) return;

      setSelectedChoice(choiceIndex);
      setShowResult(true);

      const isCorrect = choiceIndex === currentQuestion.correct;
      if (isCorrect) {
        setCorrectCount((c) => c + 1);
      }

      // 保存到 IndexedDB
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
    const accuracy = Math.round((correctCount / total) * 100);
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
              onClick={() => {
                initRef.current = false;
                setFinished(false);
                setCorrectCount(0);
                navigate(0); // force re-mount
              }}
            >
              {t('start.random')}
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/')}>
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
          <div
            className="exam-progress-fill"
            style={{ width: `${progress}%` }}
          />
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
          className={`btn btn-bookmark ${bookmarked ? 'bookmarked' : ''}`}
          onClick={handleBookmark}
        >
          {bookmarked ? '★' : '☆'} {bookmarked ? t('bookmark.remove') : t('bookmark.add')}
        </button>
      </div>

      {/* 反馈与解説 */}
      {showResult && currentQuestion && (
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
