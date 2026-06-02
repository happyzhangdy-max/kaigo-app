import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../i18n/useTranslation';
import Dashboard from '../components/study/Dashboard';
import SubjectCard from '../components/study/SubjectCard';
import NetworkStatus from '../components/common/NetworkStatus';
import {
  getSubjects,
  getQuestionCountBySubject,
  getQuestionsBySubject,
} from '../utils/data';
import { getSubjectStats, getBookmarkedIds } from '../utils/db';
import type { SubjectStats } from '../types';

export default function Home() {
  const { t, locale, toggleLocale } = useTranslation();
  const navigate = useNavigate();
  const subjects = getSubjects();
  const [subjectStats, setSubjectStats] = useState<SubjectStats[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    getSubjectStats().then(setSubjectStats);
    getBookmarkedIds().then(setBookmarkedIds);
  }, [refreshKey]);

  // Page visibility change → refresh stats
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        setRefreshKey((k) => k + 1);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  const handleStartRandom = () => {
    navigate('/exam');
  };

  const handleSubjectClick = (subject: string) => {
    navigate(`/exam/${encodeURIComponent(subject)}`);
  };

  return (
    <div className="home">
      <NetworkStatus />

      {/* 语言切换 */}
      <div className="locale-bar">
        <span className="locale-label">
          {locale === 'zh' ? '中文' : '日本語'}
        </span>
        <button className="btn btn-switch btn-sm" onClick={toggleLocale}>
          {t('language.switch')}
        </button>
      </div>

      {/* 快捷操作 */}
      <div className="home-actions">
        <button className="btn btn-primary btn-lg" onClick={handleStartRandom}>
          {t('start.random')}
        </button>
      </div>

      {/* Dashboard */}
      <Dashboard refreshKey={refreshKey} />

      {/* 科目列表 */}
      <div className="subject-section">
        <h2 className="section-title">科目一覧</h2>
        <div className="subject-grid">
          {subjects.map((subject) => {
            const stats = subjectStats.find((s) => s.subject === subject);
            const hasStarred =
              bookmarkedIds.size > 0 &&
              getQuestionsBySubject(subject).some((q) =>
                bookmarkedIds.has(q.id),
              );
            return (
              <SubjectCard
                key={subject}
                subject={subject}
                stats={
                  stats ?? {
                    subject,
                    total: getQuestionCountBySubject(subject),
                    answered: 0,
                    correct: 0,
                  }
                }
                onClick={() => handleSubjectClick(subject)}
                isStarred={hasStarred}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
