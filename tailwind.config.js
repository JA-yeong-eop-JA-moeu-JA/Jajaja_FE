/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,ts,jsx,tsx,html}",
    ],
    theme: {
      extend: {
        colors: {
          // Green
          'green-light': 'oklch(0.98 0.01 134)',
          'green-light-hover': 'oklch(0.96 0.02 134)',
          'green-light-active': 'oklch(0.92 0.08 134)',
          'green': 'oklch(0.75 0.21 134)',
          'green-hover': 'oklch(0.69 0.2 134)',
          'green-active': 'oklch(0.62 0.17 134)',
          'green-dark': 'oklch(0.56 0.16 134)',
          'green-dark-hover': 'oklch(0.47 0.15 134)',
          'green-dark-active': 'oklch(0.36 0.12 134)',
          'green-darker': 'oklch(0.28 0.1 134)',
  
          // Orange
          'orange-light': 'oklch(0.97 0.01 45)',
          'orange-light-hover': 'oklch(0.95 0.015 45)',
          'orange-light-active': 'oklch(0.91 0.04 45)',
          'orange': 'oklch(0.75 0.27 45)',
          'orange-hover': 'oklch(0.7 0.26 45)',
          'orange-active': 'oklch(0.65 0.24 45)',
          'orange-dark': 'oklch(0.61 0.22 45)',
          'orange-dark-hover': 'oklch(0.52 0.21 45)',
          'orange-dark-active': 'oklch(0.44 0.19 45)',
          'orange-darker': 'oklch(0.38 0.17 45)',
  
          // Black scale
          'black-0': 'oklch(0.98 0 0)',
          'black-1': 'oklch(0.95 0 0)',
          'black-2': 'oklch(0.87 0 0)',
          'black-3': 'oklch(0.78 0 0)',
          'black-4': 'oklch(0.64 0 0)',
          'black-5': 'oklch(0.52 0 0)',
  
          // Error
          'error-1': 'oklch(0.96 0.03 25)',
          'error-2': 'oklch(0.89 0.09 25)',
          'error-3': 'oklch(0.75 0.21 25)',
          'error-4': 'oklch(0.52 0.17 25)',
        },
      },
    },
    plugins: [],
  }