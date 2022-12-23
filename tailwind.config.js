/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,vue}",
    ],
    theme: {
        extend: {},
        container: {
            center: true,
            padding: '1rem'
        },
    },
    plugins: [],
}
