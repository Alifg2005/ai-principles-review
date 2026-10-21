import { Link } from '../app/Link';
import { siteConfig } from '../config/site';
import { ThemeToggle } from './ThemeToggle';

export function BrandMark() {
  const [left, right] = siteConfig.brand.split('//');
  return (
    <span className="font-mono text-sm font-medium tracking-[0.14em]">
      {left}
      {right !== undefined && (
        <>
          <span className="text-accent">//</span>
          {right}
        </>
      )}
    </span>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg/85 backdrop-blur-md supports-[backdrop-filter]:bg-bg/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex min-h-11 items-center gap-3 rounded-md" aria-label={`${siteConfig.productName}, home`}>
          <BrandMark />
          <span className="hidden border-l border-line-strong pl-3 text-sm text-muted sm:inline">
            {siteConfig.productName}
          </span>
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-2">
          <Link
            to="/#library"
            className="inline-flex min-h-11 items-center rounded-full px-4 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-ink"
          >
            Chapters
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
