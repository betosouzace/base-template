'use client';

export function DefaultLogo({ className = "w-auto h-12", color = "currentColor" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M40 10C51.0457 10 60 18.9543 60 30C60 41.0457 51.0457 50 40 50C28.9543 50 20 41.0457 20 30C20 18.9543 28.9543 10 40 10Z"
        fill={color}
        fillOpacity="0.2"
      />
      <path
        d="M35 20L45 30L35 40"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M70 25H180"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M70 35H150"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
      />
    </svg>
  );
} 