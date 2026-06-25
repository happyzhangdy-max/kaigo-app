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
  getExamTypes,
  DEFAULT_EXAM_TYPE,
  getTotalQuestionCount,
} from '../utils/data';
import { getSubjectStats, getBookmarkedIds } from '../utils/db';
import type { SubjectStats, ExamType } from '../types';

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const examTypes = getExamTypes();
  const [activeExamType, setActiveExamType] = useState<ExamType>(DEFAULT_EXAM_TYPE);
  const subjects = getSubjects(activeExamType);
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
    navigate(`/exam?examType=${activeExamType}`);
  };

  const handleSubjectClick = (subject: string) => {
    navigate(`/exam/${encodeURIComponent(subject)}?examType=${activeExamType}`);
  };

  const handleExamTypeChange = (examType: ExamType) => {
    setActiveExamType(examType);
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="home">
      <NetworkStatus />

      {/* 考试类型切换 */}
      <div className="exam-type-tabs">
        {examTypes.map((et) => (
          <button
            key={et.type}
            className={`exam-type-tab ${activeExamType === et.type ? 'active' : ''}`}
            onClick={() => handleExamTypeChange(et.type)}
          >
            {t(`examType.tab.${et.type}`)}
          </button>
        ))}
      </div>

      {/* 快捷操作 */}
      <div className="home-actions">
        <button className="btn btn-primary btn-lg" onClick={handleStartRandom}>
          {t('start.random')}
        </button>
        <span className="home-question-count">
          {t('question.total', { n: getTotalQuestionCount(activeExamType) })}
        </span>
      </div>

      {/* Dashboard */}
      <Dashboard refreshKey={refreshKey} />

      {/* 科目列表 */}
      <div className="subject-section">
        <h2 className="section-title">{t('menu.exam')}</h2>
        <div className="subject-grid">
          {subjects.map((subject) => {
            const stats = subjectStats.find((s) => s.subject === subject);
            const hasStarred =
              bookmarkedIds.size > 0 &&
              getQuestionsBySubject(subject, activeExamType).some((q) =>
                bookmarkedIds.has(q.id),
              );
            return (
              <SubjectCard
                key={subject}
                subject={subject}
                stats={
                  stats ?? {
                    subject,
                    total: getQuestionCountBySubject(subject, activeExamType),
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
