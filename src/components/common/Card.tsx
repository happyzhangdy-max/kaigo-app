import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Card({ children, className = '', onClick }: CardProps) {
  const cls = `card${onClick ? ' card-clickable' : ''}${className ? ' ' + className : ''}`;
  return (
    <div className={cls} onClick={onClick} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined} onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}>
      {children}
    </div>
  );
}
