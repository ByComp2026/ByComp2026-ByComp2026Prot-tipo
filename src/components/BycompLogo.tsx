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
      viewBox="0 0 350 102"
      className={className}
      style={height ? { height } : undefined}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="ByComp - enable the future"
    >
      <defs>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;900&display=swap');
          .bycomp-font {
            font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
          }
        `}</style>
      </defs>

      {showTagline && (
        <text
          x="135"
          y="21"
          fontSize="18.5"
          fontWeight="300"
          fill="#8e92be"
          letterSpacing="0.05em"
          className="bycomp-font"
        >
          enable the future
        </text>
      )}

      {/* C — renderizado primeiro no DOM para ficar atrás do y */}
      <text
        x="92"
        y="88"
        fontSize="88"
        fontWeight="900"
        fill="#2eb4be"
        className="bycomp-font"
      >
        C
      </text>

      {/* B */}
      <text
        x="4"
        y="88"
        fontSize="88"
        fontWeight="900"
        fill="#5c7cb8"
        className="bycomp-font"
      >
        B
      </text>

      {/* y — sobrepõe B e C */}
      <text
        x="48"
        y="88"
        fontSize="88"
        fontWeight="900"
        fill="#223c6f"
        className="bycomp-font"
      >
        y
      </text>

      {/* o — encaixado no C */}
      <text
        x="146"
        y="88"
        fontSize="88"
        fontWeight="900"
        fill="#f57f20"
        className="bycomp-font"
      >
        o
      </text>

      {/* m — colado no o */}
      <text
        x="196"
        y="88"
        fontSize="88"
        fontWeight="900"
        fill="#5c7cb8"
        className="bycomp-font"
      >
        m
      </text>

      {/* p — colado no m */}
      <text
        x="272"
        y="88"
        fontSize="88"
        fontWeight="900"
        fill="#9bb7cc"
        className="bycomp-font"
      >
        p
      </text>
    </svg>
  );
};