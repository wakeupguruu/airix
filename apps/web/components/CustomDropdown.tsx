"use client";

import React, { useState, useRef, useEffect } from 'react';

interface CustomDropdownProps {
  value: string;
  onChange: (val: string) => void;
  options: string[];
  className?: string;
}

export function CustomDropdown({ value, onChange, options, className = "" }: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-transparent border border-light-border dark:border-dark-border rounded-lg px-3 py-1.5 text-xs font-semibold text-light-muted dark:text-dark-muted focus:border-light-primary focus:ring-1 focus:ring-light-primary/25 transition-colors flex items-center justify-between w-full h-full min-w-[130px] outline-none hover:bg-light-surface/50 dark:hover:bg-dark-surface/50"
      >
        <span>{value}</span>
        <svg className="w-3 h-3 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full min-w-[140px] bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-lg shadow-lg py-1 overflow-hidden top-full left-0">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-xs font-semibold transition-colors ${
                value === opt 
                  ? 'bg-light-primary/10 text-light-primary dark:bg-dark-primary/10 dark:text-dark-primary' 
                  : 'text-light-text dark:text-dark-text hover:bg-light-surface dark:hover:bg-dark-surface'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
