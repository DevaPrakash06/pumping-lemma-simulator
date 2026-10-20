import React, { useMemo } from 'react';
import katex from 'katex';

interface MathViewProps {
  math: string;
  displayMode?: boolean;
  className?: string;
}

export const MathView: React.FC<MathViewProps> = ({ math, displayMode = false, className = '' }) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode,
        throwOnError: false,
      });
    } catch (e) {
      console.error('KaTeX error:', e);
      return math;
    }
  }, [math, displayMode]);

  return (
    <span
      className={`inline-block font-serif ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
