import React from 'react';

export const Card = ({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) => {
  return (
    <div className={`card ${className}`} style={style}>
      {children}
    </div>
  );
};
