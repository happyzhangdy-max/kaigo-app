import { useState } from 'react';
import { useTranslation } from '../i18n/useTranslation';
import { useTheme, type ThemeMode } from '../hooks/useTheme';
import Card from '../components/common/Card';
import { clearAllData } from '../utils/db';
import { getTotalQuestionCount } from '../utils/data';

export default function Settings() {
  const { t, locale, setLocale } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [clearing, setClearing] = useState(false);
  const [cleared, setCleared] = useState(false);

  const handleClearData = async () => {
    if (!window.confirm(t('settings.clearData.confirm'))) return;
    setClearing(true);
    try {
      await clearAllData();
      setCleared(true);
      setTimeout(() => setCleared(false), 3000);
    } catch {
      alert(t('error.generic'));
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="page page-settings">
      <h1>{t('settings.title')}</h1>

      {/* 语言设置 */}
      <Card className="settings-section">
        <h2 className="settings-section-title">{t('settings.language')}</h2>
        <div className="settings-language-options">
          <label className="settings-radio">
            <input
              type="radio"
              name="locale"
              checked={locale === 'zh'}
              onChange={() => setLocale('zh')}
            />
            <span>中文</span>
          </label>
          <label className="settings-radio">
            <input
              type="radio"
              name="locale"
              checked={locale === 'ja'}
              onChange={() => setLocale('ja')}
            />
            <span>日本語</span>
          </label>
        </div>
      </Card>

      {/* 主题设置 */}
      <Card className="settings-section">
        <h2 className="settings-section-title">{t('settings.theme')}</h2>
        <div className="settings-theme-options">
          {(['system', 'light', 'dark'] as ThemeMode[]).map((mode) => (
            <label key={mode} className="settings-radio">
              <input
                type="radio"
                name="theme"
                checked={theme === mode}
                onChange={() => setTheme(mode)}
              />
              <span>{t(`settings.theme.${mode}`)}</span>
            </label>
          ))}
        </div>
      </Card>

      {/* 数据管理 */}
      <Card className="settings-section">
        <h2 className="settings-section-title">{t('settings.data')}</h2>
        <button
          className="btn btn-danger"
          onClick={handleClearData}
          disabled={clearing}
        >
          {clearing ? t('loading') : t('settings.clearData')}
        </button>
        {cleared && (
          <p className="settings-success">{t('settings.clearData.done')}</p>
        )}
      </Card>

      {/* 关于 */}
      <Card className="settings-section">
        <h2 className="settings-section-title">{t('settings.about')}</h2>
        <dl className="settings-about">
          <dt>{t('settings.version')}</dt>
          <dd>0.1.0 (MVP)</dd>
          <dt>{t('settings.questions')}</dt>
          <dd>{getTotalQuestionCount()} 問</dd>
          <dt>{t('category')}</dt>
          <dd>7 科目</dd>
        </dl>
      </Card>
    </div>
  );
}
