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
      <rect width="100" height="100" rx="22" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
      {/* Intertwined B and C / y mark from the logo */}
      <text
        x="12"
        y="74"
        fill="#5f80c2"
        fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
        fontSize="68"
        fontWeight="900"
      >
        B
      </text>
      <text
        x="42"
        y="74"
        fill="#3fb5c5"
        fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
        fontSize="68"
        fontWeight="900"
      >
        C
      </text>
      <circle cx="74" cy="50" r="13" fill="#f37a2b" />
    </svg>
  );
};
