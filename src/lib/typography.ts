export const typeScale = {
  'display-xl': ['clamp(3rem, 8vw, 5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: 500, fontFamily: 'var(--font-display)' }],
  'display-lg': ['clamp(2.25rem, 6vw, 3.5rem)', { lineHeight: '1.15', letterSpacing: '-0.015em', fontWeight: 500, fontFamily: 'var(--font-display)' }],
  'h1': ['clamp(2rem, 5vw, 3rem)', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: 600, fontFamily: 'var(--font-heading)' }],
  'h2': ['clamp(1.75rem, 4vw, 2.5rem)', { lineHeight: '1.25', letterSpacing: '-0.005em', fontWeight: 600, fontFamily: 'var(--font-heading)' }],
  'h3': ['clamp(1.5rem, 3vw, 2rem)', { lineHeight: '1.3', fontWeight: 600, fontFamily: 'var(--font-heading)' }],
  'h4': ['1.25rem', { lineHeight: '1.35', fontWeight: 600, fontFamily: 'var(--font-heading)' }],
  'overline': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.2em', fontWeight: 500, textTransform: 'uppercase', fontFamily: 'var(--font-display)' }],
  'overline-lg': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.15em', fontWeight: 500, textTransform: 'uppercase', fontFamily: 'var(--font-display)' }],
  'body-lg': ['1.125rem', { lineHeight: '1.7', fontWeight: 400, fontFamily: 'var(--font-body)' }],
  'body': ['1rem', { lineHeight: '1.65', fontWeight: 400, fontFamily: 'var(--font-body)' }],
  'body-sm': ['0.875rem', { lineHeight: '1.6', fontWeight: 400, fontFamily: 'var(--font-body)' }],
  'label': ['0.875rem', { lineHeight: '1.5', fontWeight: 500, fontFamily: 'var(--font-body)' }],
  'caption': ['0.75rem', { lineHeight: '1.5', fontWeight: 400, fontFamily: 'var(--font-body)' }],
  'button': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.05em', fontWeight: 600, textTransform: 'uppercase', fontFamily: 'var(--font-body)' }],
} as const;

export const fontFamilies = {
  display: 'var(--font-display)',
  heading: 'var(--font-heading)',
  body: 'var(--font-body)',
} as const;
