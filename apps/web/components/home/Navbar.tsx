import Link from "next/link";

export function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between px-6 md:px-8 py-4 bg-light-bg dark:bg-dark-bg sticky top-0 z-50">
      
      <div className="flex items-center gap-12 lg:gap-16">
        {/* Logo */}
        <Link href="/" className="font-garamond-dark text-3xl tracking-tight text-light-text dark:text-dark-text">
          Airix
        </Link>

        <div className="hidden lg:flex items-center gap-8 border-b border-light-secondary-border dark:border-dark-secondary-border">
          <Link href="/" className="py-1.5 text-[14px] font-medium text-light-text dark:text-dark-text border-b-2 border-light-text dark:border-dark-text -mb-[1px]">
            Home
          </Link>
          <Link href="/product" className="py-1.5 text-[14px] font-medium text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text transition-colors">
            Product
          </Link>
          <Link href="/pricing" className="py-1.5 text-[14px] font-medium text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text transition-colors">
            Pricing
          </Link>
          <Link href="/contact" className="py-1.5 text-[14px] font-medium text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text transition-colors">
            Contact
          </Link>
          <Link href="/design" className="py-1.5 text-[14px] font-medium text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text transition-colors">
            Design
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link 
          href="/login"
          className="bg-light-primary dark:bg-dark-primary text-white px-5 py-2 rounded-md font-medium hover:opacity-90 transition-opacity text-[14px]"
        >
          Try Airix
        </Link>
      </div>
      
    </nav>
  );
}
