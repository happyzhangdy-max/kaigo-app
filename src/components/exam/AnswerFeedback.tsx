import { useTranslation } from '../../i18n/useTranslation';
import type { Question } from '../../types';

interface AnswerFeedbackProps {
  question: Question;
  isCorrect: boolean;
  selectedChoice: number;
}

export default function AnswerFeedback({
  question,
  isCorrect,
  selectedChoice,
}: AnswerFeedbackProps) {
  const { t, locale } = useTranslation();
  const explanation =
    locale === 'ja' ? question.ja_explanation : question.zh_explanation;

  return (
    <div className={`answer-feedback ${isCorrect ? 'feedback-correct' : 'feedback-wrong'}`}>
      <div className="feedback-result">
        {isCorrect ? (
          <span className="feedback-icon feedback-icon-correct">✓</span>
        ) : (
          <span className="feedback-icon feedback-icon-wrong">✗</span>
        )}
        <span className="feedback-text">
          {isCorrect ? t('answer.feedback.correct') : t('answer.feedback.incorrect')}
        </span>
      </div>

      <div className="feedback-correct-answer">
        {!isCorrect && (
          <p>
            {t('answer.show')}: {String.fromCharCode(65 + question.correct)}. {question.choices[question.correct]}
          </p>
        )}
      </div>

      <div className="feedback-explanation">
        <h4 className="feedback-explanation-title">{t('explanation.title')}</h4>
        <p>{explanation}</p>
      </div>
    </div>
  );
}
