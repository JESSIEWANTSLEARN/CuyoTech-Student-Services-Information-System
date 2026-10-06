import { useEffect, useState } from "react";
import LoadingScreen from "./LoadingScreen.jsx";

function AppBoot({ children }) {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setReady(true);
        }, 350);

        return () => window.clearTimeout(timer);
    }, []);

    if (!ready) {
        return <LoadingScreen message="Loading CuyoTech Student Services..." />;
    }

    return children;
}

export default AppBoot;
