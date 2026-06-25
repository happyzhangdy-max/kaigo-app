import { BrowserRouter, NavLink, Link } from 'react-router-dom';
import AppRoutes from './routes';
import { useTranslation } from './i18n/useTranslation';
import { useTheme } from './hooks/useTheme';
import './App.css';

function HeaderControls() {
  const { locale, toggleLocale } = useTranslation();
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="header-controls">
      <button
        type="button"
        className="header-icon-btn"
        onClick={toggleLocale}
        title={locale === 'zh' ? '日本語に切り替え' : '切换到中文'}
        aria-label="toggle language"
      >
        {locale === 'zh' ? '日本語' : '中文'}
      </button>
      <button
        type="button"
        className="header-icon-btn"
        onClick={toggleTheme}
        title={isDark ? 'ライトモード' : 'ダークモード'}
        aria-label="toggle theme"
      >
        {isDark ? '☀️' : '🌙'}
      </button>
    </div>
  );
}

function AppShell() {
  const { t } = useTranslation();

  const navItems = [
    { to: '/', key: 'menu.home', end: true },
    { to: '/exam', key: 'menu.exam', end: false },
    { to: '/glossary', key: 'menu.glossary', end: false },
    { to: '/settings', key: 'menu.settings', end: false },
  ];

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <Link to="/" className="header-logo">
            {t('app.name')}
          </Link>
          <HeaderControls />
        </div>
        <nav className="header-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `header-nav-link${isActive ? ' active' : ''}`
              }
            >
              {t(item.key)}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="main">
        <AppRoutes />
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;
