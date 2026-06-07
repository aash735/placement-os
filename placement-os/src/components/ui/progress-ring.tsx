"use client";

import { useEffect, useState } from "react";

export function ProgressRing({
  value,
  size = 80,
  stroke = 6,
  showValue = true,
}: {
  value: number;
  size?: number;
  stroke?: number;
  showValue?: boolean;
}) {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    // Animate progress on load
    const timer = setTimeout(() => {
      setAnimatedValue(value);
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);

  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (animatedValue / 100) * c;

  // Dynamically scale text size inside the circle based on size prop
  const percentFontSize = size >= 120 ? "text-3xl" : size >= 100 ? "text-2xl" : "text-lg";
  const labelFontSize = size >= 120 ? "text-[10px]" : "text-[8px]";

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#progress-ring-grad)"
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-[1000ms] ease-out"
        />
        <defs>
          <linearGradient id="progress-ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
          <span className={`${percentFontSize} font-extrabold tracking-tight text-white`}>
            {value}%
          </span>
          <span className={`${labelFontSize} font-bold tracking-wider uppercase text-zinc-400 mt-0.5`}>
            Ready
          </span>
        </div>
      )}
    </div>
  );
}

