'use client';

import React, { useState, useRef, useEffect } from 'react';
import { SearchIcon } from './Icons';

export interface SearchableDropdownProps {
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder?: string;
  className?: string;
}

export function SearchableDropdown({ value, onChange, options, placeholder = "Search...", className = "" }: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  const filteredOptions = options.filter(opt => opt.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-transparent border border-light-border dark:border-dark-border rounded-lg px-3 py-1.5 text-xs font-semibold text-light-muted dark:text-dark-muted focus:border-light-primary focus:ring-1 focus:ring-light-primary/25 transition-colors flex items-center justify-between w-full h-full min-w-[150px] outline-none hover:bg-light-surface/50 dark:hover:bg-dark-surface/50"
      >
        <span className="truncate">{value}</span>
        <svg className="w-3 h-3 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full min-w-[200px] bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-lg shadow-lg overflow-hidden right-0">
          <div className="p-2 border-b border-light-border dark:border-dark-border relative">
             <span className="absolute inset-y-0 left-4 flex items-center text-[#6c6a64] dark:text-[#a09d96] pointer-events-none">
                <SearchIcon size={12} />
             </span>
             <input
               ref={searchInputRef}
               type="text"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               placeholder={placeholder}
               className="w-full bg-[#efe9de]/15 dark:bg-[#161618]/15 border border-[#e6dfd8] dark:border-[#2a2a2b] rounded flex pl-7 pr-2 py-1.5 text-[11px] text-[#141413] dark:text-[#faf9f5] placeholder:text-[#6c6a64]/50 focus:border-[#cc785c] focus:outline-none transition-colors"
             />
          </div>
          <div className="max-h-60 overflow-y-auto py-1">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-xs text-center text-light-muted dark:text-dark-muted">No options found</div>
            ) : (
              filteredOptions.map((opt) => (
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
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
