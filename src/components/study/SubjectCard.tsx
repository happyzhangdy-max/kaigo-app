import { useTranslation } from '../../i18n/useTranslation';
import ProgressBar from '../common/ProgressBar';
import type { SubjectStats } from '../../types';

interface SubjectCardProps {
  subject: string;
  stats?: SubjectStats;
  onClick?: () => void;
  isStarred?: boolean;
}

export default function SubjectCard({
  subject,
  stats,
  onClick,
  isStarred,
}: SubjectCardProps) {
  const { t } = useTranslation();
  const accuracy =
    stats && stats.answered > 0
      ? Math.round((stats.correct / stats.answered) * 100)
      : 0;

  return (
    <div className="subject-card" onClick={onClick}>
      <div className="subject-card-header">
        <h3 className="subject-card-title">
          {t(`subject.${subject}`)}
        </h3>
        {isStarred && <span className="subject-card-star">★</span>}
      </div>
      <div className="subject-card-meta">
        <span className="subject-card-count">
          {stats ? `${stats.answered}/${stats.total}` : `0/0`}
          {' '}{t('question.total', { n: stats?.total ?? 0 })}
        </span>
        {stats && stats.answered > 0 && (
          <span className="subject-card-accuracy">{accuracy}%</span>
        )}
      </div>
      <ProgressBar value={accuracy} height={6} />
    </div>
  );
}
