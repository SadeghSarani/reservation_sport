/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./app/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#FF3B30",   // sport red
                secondary: "#1E90FF", // sport blue
                accent: "#FFD700",    // gold
            },
            fontFamily: {
                vazir: ["Vazir", "sans-serif"],
            },
        },
    },
    plugins: [],
};
