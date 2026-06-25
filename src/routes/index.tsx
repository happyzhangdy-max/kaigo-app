import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Exam from '../pages/Exam';
import Settings from '../pages/Settings';
import Glossary from '../pages/Glossary';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/exam" element={<Exam />} />
      <Route path="/exam/:subject" element={<Exam />} />
      <Route path="/glossary" element={<Glossary />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
