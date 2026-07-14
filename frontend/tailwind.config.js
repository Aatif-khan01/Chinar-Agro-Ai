/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
                heading: ['Poppins', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
            },
            colors: {
                // Console base palette — Dark-forest charcoal tones (Linear/Stripe style)
                surface: {
                    50:  '#f4f6f5',
                    100: '#e1e7e4',
                    200: '#b4c4bd',
                    300: '#819b90',
                    400: '#547165',
                    500: '#3c534a',
                    600: '#2d3f38',
                    700: '#1b2622',
                    800: '#121a17', // Main card background
                    850: '#0c1210', // Sidebar background
                    900: '#070a09', // Deepest background
                    950: '#040605',
                },
                brand: {
                    50:  '#eefbf3',
                    100: '#d6f5e2',
                    200: '#b0eac9',
                    300: '#7ddaa9',
                    400: '#47c484',
                    500: '#22c55e', // Emerald green
                    600: '#16a34a',
                    700: '#15803d',
                    800: '#166534',
                    900: '#14532d',
                },
                accent: {
                    400: '#facc15',
                    500: '#eab308', // Amber/gold
                    600: '#ca8a04',
                },
                success: {
                    light: '#4ade80',
                    DEFAULT: '#22c55e',
                    dark: '#16a34a',
                    muted: 'rgba(34, 197, 94, 0.1)',
                },
                warning: {
                    light: '#facc15',
                    DEFAULT: '#eab308',
                    dark: '#ca8a04',
                    muted: 'rgba(234, 179, 8, 0.1)',
                },
                danger: {
                    light: '#f87171',
                    DEFAULT: '#ef4444',
                    dark: '#dc2626',
                    muted: 'rgba(239, 68, 68, 0.1)',
                },
                info: {
                    light: '#60a5fa',
                    DEFAULT: '#3b82f6',
                    dark: '#2563eb',
                    muted: 'rgba(59, 130, 246, 0.1)',
                },
            },
            boxShadow: {
                'xs':   '0 1px 2px rgba(0, 0, 0, 0.4)',
                'sm':   '0 2px 8px rgba(0, 0, 0, 0.4)',
                'md':   '0 8px 24px rgba(0, 0, 0, 0.5)',
                'lg':   '0 16px 48px rgba(0, 0, 0, 0.6)',
                'glow-green': '0 0 30px rgba(34, 197, 94, 0.15)',
                'glow-amber': '0 0 30px rgba(234, 179, 8, 0.15)',
            },
            transitionDuration: {
                'fast':    '150ms',
                'normal':  '250ms',
                'slow':    '400ms',
            },
            animation: {
                'shimmer': 'shimmer 2s infinite',
            },
        },
    },
    plugins: [],
}
