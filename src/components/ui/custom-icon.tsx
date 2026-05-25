import React from "react";

export const ExplorerIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <circle cx="10.5" cy="10.5" r="7" />
    <line x1="15.5" y1="15.5" x2="21" y2="21" />
    <path d="M9 8.5l1.5-3 1.5 3" />
    <path d="M7.5 11.5h6" />
    <path d="M9 14.5l1.5 3 1.5-3" />
  </svg>
);
