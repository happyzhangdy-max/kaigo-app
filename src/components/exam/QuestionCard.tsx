import { useCallback } from 'react';
import type { Question } from '../../types';

interface QuestionCardProps {
  question: Question;
  selectedChoice: number | null;
  showResult: boolean;
  correctAnswer: number;
  onSelectChoice: (index: number) => void;
}

export default function QuestionCard({
  question,
  selectedChoice,
  showResult,
  correctAnswer,
  onSelectChoice,
}: QuestionCardProps) {
  const getChoiceClass = useCallback(
    (index: number) => {
      const classes = ['choice-btn'];
      if (!showResult) {
        if (selectedChoice === index) classes.push('choice-selected');
        return classes.join(' ');
      }
      if (index === correctAnswer) {
        classes.push('choice-correct');
      } else if (selectedChoice === index && index !== correctAnswer) {
        classes.push('choice-wrong');
      } else {
        classes.push('choice-dimmed');
      }
      return classes.join(' ');
    },
    [showResult, selectedChoice, correctAnswer],
  );

  return (
    <div className="question-card">
      <div className="question-header">
        <span className="question-subject">{question.subject}</span>
        <span className="question-category">{question.category}</span>
      </div>
      <p className="question-text">{question.question}</p>
      <div className="question-choices">
        {question.choices.map((choice, i) => (
          <button
            key={i}
            className={getChoiceClass(i)}
            onClick={() => !showResult && onSelectChoice(i)}
            disabled={showResult}
          >
            <span className="choice-label">{String.fromCharCode(65 + i)}</span>
            <span className="choice-text">{choice}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
