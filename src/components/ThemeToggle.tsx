import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-pressed={isDark}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className="group inline-flex size-11 items-center justify-center rounded-full border border-line-strong text-ink transition-colors hover:border-ink hover:bg-surface-2"
    >
      <span className="relative block size-[18px]" aria-hidden="true">
        <Sun
          className={`absolute inset-0 size-[18px] transition-[opacity,transform] duration-300 ease-out-soft ${isDark ? 'scale-50 -rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'}`}
        />
        <Moon
          className={`absolute inset-0 size-[18px] transition-[opacity,transform] duration-300 ease-out-soft ${isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-50 rotate-90 opacity-0'}`}
        />
      </span>
    </button>
  );
}
