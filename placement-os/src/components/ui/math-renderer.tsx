import React from 'react';
import katex from 'katex';

interface MathRendererProps {
  text: string;
  className?: string;
}

export const MathRenderer: React.FC<MathRendererProps> = ({ text, className = "" }) => {
  if (!text) return null;

  // Split text by '$' delimiter
  const parts = text.split('$');

  return (
    <span className={className}>
      {parts.map((part, index) => {
        // Even indexes are text, odd indexes are math
        if (index % 2 === 0) {
          return <React.Fragment key={index}>{part}</React.Fragment>;
        } else {
          try {
            const html = katex.renderToString(part, {
              displayMode: false,
              throwOnError: false,
            });
            return (
              <span
                key={index}
                dangerouslySetInnerHTML={{ __html: html }}
                className="inline-block mx-0.5 align-middle"
              />
            );
          } catch (err) {
            console.error("KaTeX rendering error:", err);
            return <span key={index}>{part}</span>;
          }
        }
      })}
    </span>
  );
};
