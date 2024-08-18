/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Kode Mono', 'Helvetica', 'sans-serif'],
      },
    },
  },
  daisyui: {
    themes: [
      {
        light: {
          ...require('daisyui/src/theming/themes').cmyk,
          accent: '#ea76cb',
          secondary: '#df8e1d',
          primary: '#179299',
          neutral: '#8c8fa1',
          'base-100': '#eff1f5',
          'base-200': '#e6e9ef',
          'base-300': '#dce0e8',
          'base-content': '#4c4f69',
          info: '#04a5e5',
          success: '#40a02b',
          warning: '#fe640b',
          error: '#d20f39',
          '--rounded-btn': 0,
          '--rounded-box': 0,
        },
      },
      {
        dark: {
          ...require('daisyui/src/theming/themes').synthwave,
          accent: '#cba6f7',
          secondary: '#fab387',
          primary: '#94e2d5',
          neutral: '#45475a',
          'base-100': '#1e1e2e',
          'base-200': '#181825',
          'base-300': '#11111b',
          'base-content': '#cdd6f4',
          info: '#74c7ec',
          success: '#a6e3a1',
          warning: '#fab387',
          error: '#f38ba8',
          '--rounded-btn': 0,
          '--rounded-box': 0,
        },
      },
    ],
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
}
