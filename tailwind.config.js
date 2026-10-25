/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: 'var(--color-paper)',
        'paper-2': 'var(--color-paper-2)',
        'paper-3': 'var(--color-paper-3)',
        'paper-hi': 'var(--color-paper-hi)',
        sticky: 'var(--color-sticky)',
        'sticky-border': 'var(--color-sticky-border)',
        ink: 'var(--color-ink)',
        'ink-2': 'var(--color-ink-2)',
        muted: 'var(--color-muted)',
        rule: 'var(--color-rule)',
        'rule-2': 'var(--color-rule-2)',
        accent: 'var(--color-accent)',
        'accent-2': 'var(--color-accent-2)',
        'accent-wash': 'var(--color-accent-wash)',
        'accent-ink': 'var(--color-accent-ink)',
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        display: ['"Familjen Grotesk"', 'system-ui', 'sans-serif'],
        hand: ['Caveat', 'cursive', 'handwriting'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        sheet: 'var(--shadow-sheet)',
        key: 'var(--shadow-key)',
        'key-accent': 'var(--shadow-key-accent)',
      },
    },
  },
  plugins: [],
}