import { siteConfig } from '../config/site';
import { BrandMark } from './SiteHeader';

export function SiteFooter() {
  const { course, author, instructor } = siteConfig;
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 text-sm text-muted sm:px-6 md:grid-cols-[1fr_auto] md:items-end">
        <div className="space-y-2">
          <BrandMark />
          <p className="max-w-xl">
            {siteConfig.productName}: an independent study companion for{' '}
            <span className="text-ink">
              {course.code ? `${course.code} · ` : ''}
              {course.title}
            </span>
            . Questions are original and written from the lecture materials; 
          </p>
        </div>
        <p className="font-mono text-xs leading-relaxed tracking-wide md:text-right">
          {author && (
            <>
              Built by <span className="text-ink">{author}</span>
              <br />
            </>
          )}
          {instructor && (
            <>
              Course instructor: <span className="text-ink">{instructor}</span>
            </>
          )}
        </p>
      </div>
    </footer>
  );
}
