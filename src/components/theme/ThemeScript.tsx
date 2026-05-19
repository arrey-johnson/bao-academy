/**
 * Sets .dark / .light on <html> before first paint.
 * Dark mode → white logo | Light mode → colored logo
 */
export function ThemeScript() {
  const script = `
    (function () {
      try {
        var stored = localStorage.getItem('theme');
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        var dark = stored === 'dark' || (stored !== 'light' && prefersDark);
        var root = document.documentElement;
        root.classList.toggle('dark', dark);
        root.classList.toggle('light', !dark);
      } catch (e) {
        document.documentElement.classList.add('dark');
      }
    })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
