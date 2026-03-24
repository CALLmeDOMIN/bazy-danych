"use client";

import React from "react";

export default function AghLogo({ className = "w-12 h-16" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
        <svg viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* AGH Professional Emblem Blocks */}
            
            {/* GREEN BLOCKS (Left) */}
            <rect x="10" y="30" width="8" height="80" fill="#00693E" rx="1" />
            <rect x="22" y="25" width="8" height="90" fill="#00693E" rx="1" />
            <rect x="34" y="30" width="8" height="80" fill="#00693E" rx="1" />
            
            {/* BLACK BLOCKS (Middle) */}
            <rect x="52" y="22" width="5" height="100" fill="currentColor" rx="0.5" />
            <rect x="59" y="10" width="2" height="115" fill="currentColor" rx="0.5" />
            <rect x="64" y="22" width="5" height="100" fill="currentColor" rx="0.5" />
            
            {/* RED BLOCKS (Right) */}
            <rect x="78" y="30" width="8" height="80" fill="#A71930" rx="1" />
            <rect x="90" y="25" width="8" height="90" fill="#A71930" rx="1" />
            <rect x="102" y="30" width="8" height="80" fill="#A71930" rx="1" />
            
            {/* AGH TEXT */}
            <text x="60" y="150" textAnchor="middle" fill="currentColor" fontSize="32" fontWeight="900" style={{ letterSpacing: '0.1em' }}>AGH</text>
        </svg>
    </div>
  );
}
