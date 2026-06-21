'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { PanelLeftOpen, PanelLeftClose, Wrench } from 'lucide-react';

// eslint-disable-next-line react/prop-types
const HomeIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" className={className} {...props}>
    <path d="M2 6L9 1.5L16 6V16L2 15.9399V6Z" fill="transparent"/>
    <path d="M1.5 9.15292C1.5 7.43662 1.5 6.57846 1.8894 5.86705C2.2788 5.15566 2.99021 4.71413 4.41302 3.8311L5.91302 2.90015C7.41704 1.96672 8.16907 1.5 9 1.5C9.83092 1.5 10.5829 1.96672 12.087 2.90015L13.587 3.83109C15.0098 4.71413 15.7212 5.15566 16.1106 5.86705C16.5 6.57846 16.5 7.43662 16.5 9.15292V10.2937C16.5 13.2193 16.5 14.6822 15.6213 15.5911C14.7427 16.5 13.3284 16.5 10.5 16.5H7.5C4.67157 16.5 3.25736 16.5 2.37868 15.5911C1.5 14.6822 1.5 13.2193 1.5 10.2937V9.15292Z" stroke="currentColor"/>
    <path d="M11.25 13.5H6.75" stroke="var(--color-light-primary)" strokeLinecap="round"/>
  </svg>
);

// eslint-disable-next-line react/prop-types
const LibraryIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" className={className} {...props}>
    <path d="M1.5 5C1.5 3.34315 2.84315 2 4.5 2H12.8901C13.8262 2 14.6321 2.66072 14.8157 3.57861L14.8577 3.78846C14.9477 4.23839 15.2365 4.62339 15.6434 4.8356C16.1659 5.1082 16.4832 5.65888 16.457 6.24769L16.1278 13.6336C16.0563 15.2369 14.7356 16.5 13.1307 16.5H9L4.69956 16.7867C2.96801 16.9021 1.5 15.5287 1.5 13.7933V5Z" fill="transparent"/>
    <path d="M13.5 7.5H9.75" stroke="var(--color-light-primary)" strokeLinecap="round"/>
    <path d="M7.5 2.25H12.375C12.7233 2.25 12.8974 2.25 13.0437 2.26925C14.0533 2.40218 14.8478 3.19666 14.9807 4.20631C15 4.35253 15 4.52669 15 4.875" stroke="var(--color-light-primary)"/>
    <path d="M1.5 5.21231C1.5 4.55041 1.5 4.21946 1.55201 3.94379C1.78098 2.73023 2.73023 1.78098 3.94379 1.55201C4.21946 1.5 4.55041 1.5 5.21231 1.5C5.50231 1.5 5.64732 1.5 5.78668 1.51303C6.38749 1.56922 6.95739 1.80528 7.42195 2.19038C7.5297 2.27971 7.63222 2.38225 7.83727 2.58731L8.25 3C8.86185 3.61183 9.16777 3.91775 9.53407 4.12157C9.7353 4.23353 9.94882 4.32195 10.1703 4.38508C10.5734 4.5 11.006 4.5 11.8713 4.5H12.1516C14.1259 4.5 15.1129 4.5 15.7546 5.07709C15.8137 5.13018 15.8698 5.18635 15.9229 5.24537C16.5 5.88701 16.5 6.87415 16.5 8.84842V10.5C16.5 13.3284 16.5 14.7427 15.6213 15.6213C14.7427 16.5 13.3284 16.5 10.5 16.5H7.5C4.67157 16.5 3.25736 16.5 2.37868 15.6213C1.5 14.7427 1.5 13.3284 1.5 10.5V5.21231Z" stroke="currentColor"/>
  </svg>
);

// eslint-disable-next-line react/prop-types
const SettingsIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" className={className} {...props}>
    <path d="M4.81502 4.5C5.51144 4.5 6.11849 4.02603 6.2874 3.3504C6.41895 2.8242 6.82132 2.4082 7.34284 2.25919L8.21256 2.0107C9.29527 1.70135 10.4579 2.07232 11.1613 2.95161L11.4055 3.25693C11.7813 3.72659 12.3501 4 12.9516 4C13.3104 4 13.6625 4.09753 13.9703 4.28215L14.1632 4.39794C15.2467 5.04803 15.7587 6.34467 15.4115 7.5596L15.2714 8.05014C15.094 8.67096 15.094 9.32904 15.2714 9.94986L15.5373 10.8805C15.816 11.8558 15.4641 12.902 14.6526 13.5106C14.229 13.8283 13.7138 14 13.1843 14H13.1596C12.4236 14 11.7243 14.3216 11.2453 14.8804L10.9575 15.2163C9.93362 16.4108 8.0816 16.3979 7.07445 15.1893C6.70272 14.7433 6.18949 14.4379 5.6201 14.324L4.69524 14.139C4.23841 14.0477 3.80791 13.8463 3.44412 13.5553C2.32935 12.6635 2.02197 11.0866 2.73026 9.84705L2.84402 9.64797C3.25384 8.93078 3.27811 8.05623 2.90871 7.31741L2.79639 7.09277C2.60513 6.71026 2.55701 6.27194 2.66074 5.85705C2.86012 5.0595 3.57672 4.5 4.39881 4.5H4.81502Z" fill="transparent"/>
    <path d="M9 11.25C10.2426 11.25 11.25 10.2426 11.25 9C11.25 7.75736 10.2426 6.75 9 6.75C7.75736 6.75 6.75 7.75736 6.75 9C6.75 10.2426 7.75736 11.25 9 11.25Z" stroke="currentColor"/>
    <path d="M10.324 1.61418C10.0483 1.5 9.69892 1.5 9 1.5C8.30107 1.5 7.95165 1.5 7.67595 1.61418C7.30842 1.76642 7.01641 2.05844 6.86417 2.42597C6.79468 2.59375 6.76747 2.78887 6.75683 3.07349C6.74119 3.49176 6.52669 3.87892 6.1642 4.0882C5.80173 4.29747 5.35919 4.28965 4.98914 4.09407C4.73734 3.96097 4.55476 3.88696 4.3747 3.86326C3.98028 3.81133 3.58138 3.91822 3.26577 4.1604C3.02905 4.34203 2.85433 4.64467 2.50487 5.24995C2.15542 5.85523 1.98069 6.15786 1.94174 6.45368C1.88982 6.8481 1.9967 7.24699 2.23888 7.56262C2.34942 7.7067 2.50477 7.82775 2.74589 7.97925C3.10035 8.202 3.32842 8.58142 3.32839 9C3.32837 9.41857 3.10031 9.79792 2.74588 10.0206C2.50474 10.1722 2.34936 10.2933 2.23881 10.4374C1.99663 10.753 1.88974 11.1518 1.94167 11.5462C1.98061 11.842 2.15534 12.1447 2.5048 12.75C2.85426 13.3552 3.02899 13.6579 3.26569 13.8395C3.58131 14.0817 3.9802 14.1886 4.37463 14.1367C4.55467 14.113 4.73724 14.0389 4.98903 13.9059C5.3591 13.7103 5.80167 13.7025 6.16417 13.9117C6.52668 14.1211 6.74119 14.5082 6.75683 14.9266C6.76748 15.2111 6.79468 15.4063 6.86417 15.574C7.01641 15.9415 7.30842 16.2336 7.67595 16.3858C7.95165 16.5 8.30107 16.5 9 16.5C9.69892 16.5 10.0483 16.5 10.324 16.3858C10.6915 16.2336 10.9836 15.9415 11.1358 15.574C11.2053 15.4063 11.2325 15.2111 11.2432 14.9265C11.2588 14.5082 11.4733 14.1211 11.8357 13.9117C12.1982 13.7024 12.6408 13.7103 13.0109 13.9059C13.2627 14.0389 13.4452 14.1129 13.6252 14.1366C14.0197 14.1886 14.4186 14.0817 14.7342 13.8395C14.9709 13.6579 15.1456 13.3552 15.4951 12.7499C15.8446 12.1447 16.0193 11.842 16.0582 11.5462C16.1101 11.1518 16.0033 10.7529 15.7611 10.4373C15.6505 10.2932 15.4951 10.1721 15.254 10.0206C14.8996 9.79792 14.6716 9.4185 14.6716 8.99992C14.6716 8.58135 14.8996 8.20207 15.254 7.9794C15.4952 7.82782 15.6506 7.70677 15.7612 7.56262C16.0033 7.24705 16.1102 6.84815 16.0583 6.45373C16.0194 6.15791 15.8446 5.85527 15.4951 5.25C15.1457 4.64473 14.971 4.34209 14.7343 4.16045C14.4187 3.91827 14.0197 3.81139 13.6253 3.86332C13.4453 3.88702 13.2628 3.96102 13.0109 4.0941C12.6409 4.28969 12.1983 4.29751 11.8358 4.08822C11.4733 3.87893 11.2588 3.49174 11.2432 3.07345C11.2325 2.78886 11.2053 2.59375 11.1358 2.42597C10.9836 2.05844 10.6915 1.76642 10.324 1.61418Z" stroke="currentColor"/>
  </svg>
);

// eslint-disable-next-line react/prop-types
const SubscriptionIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" className={className} {...props}>
    <path d="M1.5 6C1.5 4.34315 2.84315 3 4.5 3H14.5C15.6046 3 16.5 3.89543 16.5 5V5.71652V12C16.5 13.6569 15.1569 15 13.5 15H9H4.5C2.84315 15 1.5 13.6569 1.5 12V6Z" fill="transparent"/>
    <path d="M1.5 9C1.5 6.17157 1.5 4.75736 2.37868 3.87868C3.25736 3 4.67157 3 7.5 3H10.5C13.3284 3 14.7427 3 15.6213 3.87868C16.5 4.75736 16.5 6.17157 16.5 9C16.5 11.8284 16.5 13.2427 15.6213 14.1213C14.7427 15 13.3284 15 10.5 15H7.5C4.67157 15 3.25736 15 2.37868 14.1213C1.5 13.2427 1.5 11.8284 1.5 9Z" stroke="currentColor"/>
    <path d="M7.5 12H4.5" stroke="var(--color-light-primary)" strokeLinecap="round"/>
    <path d="M10.5 12H9.375" stroke="var(--color-light-primary)" strokeLinecap="round"/>
    <path d="M1.5 7.5H16.5" stroke="currentColor" strokeLinecap="round"/>
  </svg>
);

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
}

export function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLElement>(null);
  const [isHoveringLogo, setIsHoveringLogo] = useState(false);

  // GSAP animation for expansion/collapse
  useEffect(() => {
    if (sidebarRef.current) {
      gsap.to(sidebarRef.current, {
        width: isCollapsed ? 64 : 220,
        duration: 0.4,
        ease: "power3.inOut"
      });
    }
  }, [isCollapsed]);

  const navItems = [
    { name: 'Home', href: '/workspace', icon: HomeIcon },
    { name: 'Library', href: '/library', icon: LibraryIcon },
    { name: 'Maintenance', href: '/maintenance', icon: Wrench }, 
  ];

  return (
    <aside
      ref={sidebarRef}
      className="fixed inset-y-0 left-0 z-40 flex flex-col bg-light-bg dark:bg-dark-bg border-r border-light-border dark:border-dark-border overflow-hidden"
      style={{ width: isCollapsed ? 64 : 220 }}
    >
      {/* Header: Logo / Toggle */}
      <div className={`h-16 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-5'} shrink-0 transition-all duration-300`}>
        {isCollapsed ? (
          <button 
            onMouseEnter={() => setIsHoveringLogo(true)}
            onMouseLeave={() => setIsHoveringLogo(false)}
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-8 h-8 flex items-center justify-center flex-shrink-0 text-light-primary dark:text-dark-primary outline-none transition-colors"
          >
            {isHoveringLogo ? (
              <PanelLeftOpen size={20} />
            ) : (
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <circle cx="12" cy="12" r="9" strokeDasharray="3 3" className="opacity-40" />
                <path d="M12 3v18M3 12h18M9 9l6 6M9 15l6-6" />
              </svg>
            )}
          </button>
        ) : (
          <>
            <div className="flex items-center space-x-3">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-light-primary dark:text-dark-primary" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <circle cx="12" cy="12" r="9" strokeDasharray="3 3" className="opacity-40" />
                <path d="M12 3v18M3 12h18M9 9l6 6M9 15l6-6" />
              </svg>
              <div 
                className="font-garamond-light text-[18px] text-light-text dark:text-dark-text tracking-widest whitespace-nowrap"
                style={{ fontWeight: 400, letterSpacing: '0.1em' }}
              >
                AIRIX
              </div>
            </div>
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-light-muted hover:text-light-text dark:text-dark-muted dark:hover:text-dark-text transition-colors outline-none flex-shrink-0"
            >
              <PanelLeftClose size={20} />
            </button>
          </>
        )}
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-3 flex flex-col gap-1.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/workspace' && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.name : undefined}
              className={`flex items-center ${isCollapsed ? 'justify-center p-2.5' : 'justify-start px-4 py-2 space-x-3'} rounded-lg transition-colors group ${
                isActive 
                  ? 'bg-light-primary/10 text-light-primary dark:bg-dark-primary/10 dark:text-dark-primary' 
                  : 'hover:bg-light-surface/80 dark:hover:bg-dark-surface/80'
              }`}
            >
              <div className={`flex flex-shrink-0 items-center justify-center rounded-md ${isActive ? 'text-light-primary dark:text-dark-primary' : 'text-light-muted dark:text-dark-muted group-hover:text-light-text dark:group-hover:text-dark-text'} transition-colors`}>
                <item.icon className="w-[18px] h-[18px]" strokeWidth={1.5} />
              </div>
              {!isCollapsed && (
                <span className={`font-sans text-[13.5px] font-medium whitespace-nowrap transition-opacity duration-300 ${isActive ? 'text-light-primary dark:text-dark-primary' : 'text-light-muted dark:text-dark-muted group-hover:text-light-text dark:group-hover:text-dark-text'} opacity-100`}>
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-3 pb-6 flex flex-col gap-1.5 shrink-0">
        <Link
          href="/subscription"
          title={isCollapsed ? "Subscription" : undefined}
          className={`flex items-center ${isCollapsed ? 'justify-center p-2.5' : 'justify-start px-4 py-2 space-x-3'} rounded-lg transition-colors group ${
            pathname === '/subscription'
              ? 'bg-light-primary/10 text-light-primary dark:bg-dark-primary/10 dark:text-dark-primary' 
              : 'hover:bg-light-surface/80 dark:hover:bg-dark-surface/80'
          }`}
        >
          <div className={`flex flex-shrink-0 items-center justify-center rounded-md ${pathname === '/subscription' ? 'text-light-primary dark:text-dark-primary' : 'text-light-muted dark:text-dark-muted group-hover:text-light-text dark:group-hover:text-dark-text'} transition-colors`}>
            <SubscriptionIcon className="w-[18px] h-[18px]" strokeWidth={1.5} />
          </div>
          {!isCollapsed && (
            <span className={`font-sans text-[13.5px] font-medium whitespace-nowrap transition-opacity duration-300 ${pathname === '/subscription' ? 'text-light-primary dark:text-dark-primary' : 'text-light-muted dark:text-dark-muted group-hover:text-light-text dark:group-hover:text-dark-text'} opacity-100`}>
              Subscription
            </span>
          )}
        </Link>
        
        <Link
          href="/settings"
          title={isCollapsed ? "Settings" : undefined}
          className={`flex items-center ${isCollapsed ? 'justify-center p-2.5' : 'justify-start px-4 py-2 space-x-3'} rounded-lg transition-colors group ${
            pathname === '/settings'
              ? 'bg-light-primary/10 text-light-primary dark:bg-dark-primary/10 dark:text-dark-primary' 
              : 'hover:bg-light-surface/80 dark:hover:bg-dark-surface/80'
          }`}
        >
          <div className={`flex flex-shrink-0 items-center justify-center rounded-md ${pathname === '/settings' ? 'text-light-primary dark:text-dark-primary' : 'text-light-muted dark:text-dark-muted group-hover:text-light-text dark:group-hover:text-dark-text'} transition-colors`}>
            <SettingsIcon className="w-[18px] h-[18px]" strokeWidth={1.5} />
          </div>
          {!isCollapsed && (
            <span className={`font-sans text-[13.5px] font-medium whitespace-nowrap transition-opacity duration-300 ${pathname === '/settings' ? 'text-light-primary dark:text-dark-primary' : 'text-light-muted dark:text-dark-muted group-hover:text-light-text dark:group-hover:text-dark-text'} opacity-100`}>
              Settings
            </span>
          )}
        </Link>

        {/* Avatar link (acts as Profile) */}
        <Link 
          href="/profile" 
          title={isCollapsed ? "Profile" : undefined}
          className={`mt-1 flex items-center ${isCollapsed ? 'justify-center p-1.5' : 'justify-start px-3 py-1.5 space-x-3'} rounded-lg hover:bg-light-surface/80 dark:hover:bg-dark-surface/80 transition-colors group`}
        >
          <div className="w-8 h-8 flex-shrink-0 rounded-full border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface flex items-center justify-center overflow-hidden">
             <span className="font-sans font-semibold text-[11px] text-light-text dark:text-dark-text">T</span>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col whitespace-nowrap transition-opacity duration-300 opacity-100 overflow-hidden">
               <span className="font-sans font-semibold text-[13px] text-light-text dark:text-dark-text leading-tight truncate">Tanveer Singh</span>
               {/* Non-orange plan text as requested */}
               <span className="font-sans text-[11px] font-medium text-light-muted dark:text-dark-muted leading-tight mt-0.5 truncate">Pro Plan</span>
            </div>
          )}
        </Link>
      </div>
    </aside>
  );
}
