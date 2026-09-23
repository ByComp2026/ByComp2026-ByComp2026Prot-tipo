import React from 'react';

interface BycompIconProps {
  className?: string;
  size?: number | string;
}

export const BycompIcon: React.FC<BycompIconProps> = ({
  className = 'w-8 h-8',
  size
}) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="ByComp Icon"
    >
      <defs>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@900&display=swap');
          .bycomp-font {
            font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          }
        `}</style>
      </defs>

      <rect width="100" height="100" rx="22" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
      
      {/* C */}
      <text
        x="36"
        y="72"
        fontSize="64"
        fontWeight="900"
        fill="#2eb4be"
        className="bycomp-font"
      >
        C
      </text>

      {/* B */}
      <text
        x="6"
        y="72"
        fontSize="64"
        fontWeight="900"
        fill="#5c7cb8"
        className="bycomp-font"
      >
        B
      </text>

      {/* y */}
      <text
        x="20"
        y="72"
        fontSize="64"
        fontWeight="900"
        fill="#223c6f"
        className="bycomp-font"
      >
        y
      </text>

      {/* Detalhe circular */}
      <circle cx="78" cy="46" r="9" fill="#f57f20" />
    </svg>
  );
};