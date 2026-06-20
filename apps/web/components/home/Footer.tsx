export function Footer() {
  return (
    <footer className="w-full px-10 md:px-14 pb-8 pt-0 bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text font-sans">
      <div className="w-full border-t border-light-border dark:border-dark-border pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
        <span className="text-[13px] text-light-muted dark:text-dark-muted">
          &copy; 2026 Airix. All rights reserved.
        </span>
        <span className="text-[13px] text-light-muted dark:text-dark-muted">
          Built in India 🇮🇳
        </span>
      </div>
    </footer>
  );
}
