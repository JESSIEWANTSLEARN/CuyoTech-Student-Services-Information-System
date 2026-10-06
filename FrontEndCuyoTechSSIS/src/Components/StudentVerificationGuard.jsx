import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import LoadingScreen from "./LoadingScreen.jsx";
import { apiRequest } from "../services/api.js";

function StudentVerificationGuard({ children }) {
    const location = useLocation();
    const [state, setState] = useState({
        loading: true,
        verified: false,
    });

    useEffect(() => {
        let active = true;

        apiRequest("/student/profile-verification")
            .then((data) => {
                if (active) {
                    setState({
                        loading: false,
                        verified: Boolean(data.verified),
                    });
                }
            })
            .catch(() => {
                if (active) {
                    setState({
                        loading: false,
                        verified: false,
                    });
                }
            });

        return () => {
            active = false;
        };
    }, [location.pathname]);

    if (state.loading) {
        return <LoadingScreen message="Checking your student profile..." />;
    }

    if (!state.verified) {
        return (
            <Navigate
                to="/student/verify-profile"
                replace
                state={{ from: location.pathname }}
            />
        );
    }

    return children;
}

export default StudentVerificationGuard;
