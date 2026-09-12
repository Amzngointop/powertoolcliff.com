import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}', './data/**/*.ts'],
  theme: {
    extend: {
      colors: {
        white: '#FFFFFF',
        haze: 'var(--haze)',
        'haze-2': 'var(--haze-2)',
        blue: 'var(--blue)',
        'blue-deep': 'var(--blue-deep)',
        'blue-soft': 'var(--blue-soft)',
        amber: 'var(--amber)',
        'amber-deep': 'var(--amber-deep)',
        carbon: 'var(--carbon)',
        ink: 'var(--ink)',
        'ink-2': 'var(--ink-2)',
        'ink-3': 'var(--ink-3)',
        rule: 'var(--rule)',
        flag: 'var(--flag)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Arial', 'Helvetica', 'sans-serif'],
        narrow: ['var(--font-narrow)', "'Arial Narrow'", 'Arial', 'sans-serif'],
        body: ['var(--font-body)', "'Segoe UI'", 'Arial', 'sans-serif'],
      },
      maxWidth: {
        page: '1200px',
        wear: '1000px',
        types: '940px',
        materials: '860px',
        narrow: '720px',
      },
    },
  },
  plugins: [],
}

export default config
