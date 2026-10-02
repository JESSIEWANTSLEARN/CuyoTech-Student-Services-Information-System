import { useEffect, useState } from "react";

function ThemeToggle() {
    const [theme, setTheme] = useState(() => {
        try {
            return localStorage.getItem("cuyotech-theme") === "light" ? "light" : "dark";
        } catch {
            return "dark";
        }
    });

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        try {
            localStorage.setItem("cuyotech-theme", theme);
        } catch {
            // The current page still uses the selected theme when storage is unavailable.
        }
    }, [theme]);

    const nextTheme = theme === "dark" ? "light" : "dark";

    return (
        <button
            className="theme-toggle"
            type="button"
            aria-label={`Switch to ${nextTheme} theme`}
            onClick={() => setTheme(nextTheme)}
        >
            <span aria-hidden="true">{theme === "dark" ? "☀" : "☾"}</span>
        </button>
    );
}

export default ThemeToggle;
