// Immediately set the theme based on user's system preference
const setTheme = () => {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', prefersDarkMode ? 'dark' : 'emerald');
};

// Run on page load
setTheme();

// Update theme when system preference changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', setTheme);