import { useEffect, useState } from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import { getLearningStats } from '../../utils/db';
import type { LearningStats } from '../../types';
import ProgressBar from '../common/ProgressBar';

interface DashboardProps {
  refreshKey?: number;
}

export default function Dashboard({ refreshKey = 0 }: DashboardProps) {
  const { t } = useTranslation();
  const [stats, setStats] = useState<LearningStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getLearningStats().then((s) => {
      if (!cancelled) {
        setStats(s);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  if (loading) {
    return <div className="dashboard-loading">{t('loading')}</div>;
  }

  if (!stats || stats.totalAnswered === 0) {
    return (
      <div className="dashboard">
        <h2 className="dashboard-title">{t('dashboard.title')}</h2>
        <div className="dashboard-empty">{t('dashboard.noData')}</div>
      </div>
    );
  }

  const overallAccuracy = Math.round(
    (stats.totalCorrect / stats.totalAnswered) * 100,
  );

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">{t('dashboard.title')}</h2>

      {/* 统计卡片 */}
      <div className="dashboard-stats-grid">
        <div className="stat-card">
          <span className="stat-value">{stats.totalAnswered}</span>
          <span className="stat-label">{t('dashboard.totalAnswered')}</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{overallAccuracy}%</span>
          <span className="stat-label">{t('dashboard.accuracy')}</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.streakCorrect}</span>
          <span className="stat-label">{t('dashboard.streak')}</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.todayAnswered}</span>
          <span className="stat-label">{t('dashboard.todayAnswered')}</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.bookmarkCount}</span>
          <span className="stat-label">{t('dashboard.bookmarks')}</span>
        </div>
      </div>

      {/* 科目別正答率 */}
      <div className="dashboard-subjects">
        <h3 className="dashboard-subsection-title">
          {t('dashboard.subjectAccuracy')}
        </h3>
        {stats.subjectStats.map((ss) => {
          const subjAccuracy =
            ss.answered > 0
              ? Math.round((ss.correct / ss.answered) * 100)
              : 0;
          return (
            <div key={ss.subject} className="subject-progress-row">
              <span className="subject-progress-name">
                {t(`subject.${ss.subject}`)}
              </span>
              <span className="subject-progress-count">
                {ss.answered}/{ss.total}
              </span>
              <ProgressBar value={subjAccuracy} height={6} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
