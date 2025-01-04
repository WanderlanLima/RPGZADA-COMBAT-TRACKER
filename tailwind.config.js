/** @type {import('tailwindcss').Config} */
    module.exports = {
      content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
      ],
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            'gray-900': '#111827',
            'gray-800': '#1f2937',
            'gray-700': '#374151',
            'gray-600': '#4b5563',
            'gray-500': '#6b7280',
            'gray-400': '#9ca3af',
            'gray-300': '#d1d5db',
            'gray-200': '#e5e7eb',
            'gray-100': '#f3f4f6',
            'gray-50': '#f9fafb',
            'purple-500': '#8b5cf6',
            'purple-600': '#7c3aed',
          },
        },
      },
      plugins: [],
    }
