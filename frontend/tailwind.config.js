/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                bitguard: {
                    dark: '#0f172a',
                    card: '#1e293b',
                    accent: '#3b82f6',
                    light: '#f0f9ff', // Sky 50
                    primary: '#034484', // BitGuard Blue
                }
            },
            keyframes: {
                'fade-in-up': {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            },
            animation: {
                'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
            }
        },
    },
    darkMode: 'class',
    plugins: [],
}
