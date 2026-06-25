import { useTranslation } from '../../i18n/useTranslation';
import { resolveTermRefs } from '../../utils/terms';
import type { Question } from '../../types';

interface AnswerFeedbackProps {
  question: Question;
  isCorrect: boolean;
  selectedChoice: number;
}

export default function AnswerFeedback({
  question,
  isCorrect,
}: AnswerFeedbackProps) {
  const { t, locale } = useTranslation();
  const explanation =
    locale === 'ja' ? question.ja_explanation : question.zh_explanation;
  const relatedTerms = resolveTermRefs(question.term_refs);

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

      {relatedTerms.length > 0 && (
        <div className="feedback-terms">
          <h4 className="feedback-terms-title">{t('term.related')}</h4>
          <ul className="feedback-terms-list">
            {relatedTerms.map((term) => (
              <li key={term.key} className="feedback-term">
                <span className="feedback-term-name">
                  {term.ja}
                  {locale === 'zh' && term.zh !== term.ja && (
                    <span className="feedback-term-zh">（{term.zh}）</span>
                  )}
                </span>
                <span className="feedback-term-desc">{term.description}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
