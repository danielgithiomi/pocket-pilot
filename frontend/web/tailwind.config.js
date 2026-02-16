/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts,css}'],
  theme: {
    extend: {
      colors: {
        /* Brand */
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        tertiary: 'var(--tertiary)',
        quaternary: 'var(--quaternary)',

        /* State */
        success: 'var(--success)',
        warning: 'var(--warning)',
        danger: 'var(--danger)',

        /* Raw palette */
        dark: 'var(--dark)',
        black: 'var(--black)',
        gray1: 'var(--gray1)',
        gray2: 'var(--gray2)',
        gray3: 'var(--gray3)',
        gray4: 'var(--gray4)',
        white: 'var(--white)',

        /* Semantic */
        'body-background': 'var(--body-background)',
        'alternate-background': 'var(--alternate-background)',
        'inverted-background': 'var(--inverted-background)',

        'primary-text': 'var(--primary-text)',
        'alternate-text': 'var(--alternate-text)',
        'inverted-text': 'var(--inverted-text)',
        'muted-text': 'var(--muted-text)',
      },
    },
  },
  plugins: [],
};
