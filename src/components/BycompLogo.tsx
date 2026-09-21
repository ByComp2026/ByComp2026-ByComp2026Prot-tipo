import React from 'react';

interface BycompLogoProps {
  className?: string;
  height?: number | string;
  showTagline?: boolean;
}

export const BycompLogo: React.FC<BycompLogoProps> = ({
  className = 'h-8 w-auto',
  height,
  showTagline = true
}) => {
  return (
    <svg
      viewBox="0 0 410 102"
      className={className}
      style={height ? { height } : undefined}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="ByComp - enable the future"
    >
      {showTagline && (
        <text
          x="195"
          y="21"
          fill="#8e92be"
          fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
          fontSize="18.5"
          fontWeight="300"
          letterSpacing="0.05em"
        >
          enable the future
        </text>
      )}

      {/* Wordmark: All letters tightly joined "ByComp" */}
      {/* B */}
      <text
        x="4"
        y="88"
        fill="#5c7cb8"
        fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
        fontSize="88"
        fontWeight="900"
      >
        B
      </text>

      {/* C */}
      <text
        x="98"
        y="88"
        fill="#2eb4be"
        fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
        fontSize="88"
        fontWeight="900"
      >
        C
      </text>

      {/* y */}
      <text
        x="50"
        y="88"
        fill="#223c6f"
        fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
        fontSize="88"
        fontWeight="900"
      >
        y
      </text>

      {/* o */}
      <text
        x="154"
        y="88"
        fill="#f57f20"
        fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
        fontSize="88"
        fontWeight="900"
      >
        o
      </text>

      {/* m */}
      <text
        x="222"
        y="88"
        fill="#5c7cb8"
        fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
        fontSize="88"
        fontWeight="900"
      >
        m
      </text>

      {/* p */}
      <text
        x="324"
        y="88"
        fill="#9bb7cc"
        fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
        fontSize="88"
        fontWeight="900"
      >
        p
      </text>
    </svg>
  );
};
