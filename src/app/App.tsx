import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';
import { HomePage } from '../pages/HomePage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { QuizPage } from '../pages/QuizPage';
import { matchRoute, usePathname } from './router';

export function App() {
  const route = matchRoute(usePathname());
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-on-accent"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" className="flex-1">
        {route.name === 'home' && <HomePage />}
        {/* Keying by chapter id gives each chapter its own fresh quiz state. */}
        {route.name === 'chapter' && <QuizPage key={route.chapterId} chapterId={route.chapterId} />}
        {route.name === 'not-found' && <NotFoundPage />}
      </main>
      <SiteFooter />
    </div>
  );
}
