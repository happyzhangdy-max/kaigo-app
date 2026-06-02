import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header className="header">
          <a href="/" className="header-logo">介護福祉士</a>
          <nav className="header-nav">
            <a href="/" className="header-nav-link">ホーム</a>
            <a href="/exam" className="header-nav-link">試験</a>
            <a href="/settings" className="header-nav-link">設定</a>
          </nav>
        </header>
        <main className="main">
          <AppRoutes />
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
