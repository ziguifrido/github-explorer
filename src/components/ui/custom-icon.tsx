import React from "react";

export const ExplorerIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <circle cx="12" cy="10.5" r="7.5" strokeWidth="1.5" />
    <line x1="17.6" y1="16.1" x2="21.7" y2="21" strokeWidth="1.8" />
    <path d="M11.25 7.5l-3.75 3 3.75 3" strokeWidth="1.2" />
    <line x1="14.25" y1="5.25" x2="9.75" y2="15.75" strokeWidth="1.2" />
    <path d="M12.75 7.5l3.75 3-3.75 3" strokeWidth="1.2" />
  </svg>
);
