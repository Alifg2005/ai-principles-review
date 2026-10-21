import { ArrowLeft } from 'lucide-react';
import { Link } from '../app/Link';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export function NotFoundPage({ title = 'Page not found', message }: { title?: string; message?: string }) {
  useDocumentTitle(title);
  return (
    <section className="lab-grid border-b border-line">
      <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 md:py-32">
        <p className="eyebrow">Error · 404</p>
        <h1 className="mt-4 font-display text-6xl leading-none sm:text-7xl">{title}</h1>
        <p className="mt-6 max-w-lg text-lg text-muted">
          {message ?? 'The page you were looking for does not exist or may have moved.'}
        </p>
        <Link to="/#library" className="btn btn-primary mt-10">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to the chapter library
        </Link>
      </div>
    </section>
  );
}
