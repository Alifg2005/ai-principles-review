import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach } from 'vitest';

// jsdom does not implement scrolling APIs; the app calls them for navigation polish.
window.scrollTo = () => {};
Element.prototype.scrollIntoView = () => {};

beforeEach(() => {
  window.history.replaceState(null, '', '/');
  localStorage.clear();
  document.documentElement.dataset.theme = 'light';
});

afterEach(() => {
  cleanup();
});
