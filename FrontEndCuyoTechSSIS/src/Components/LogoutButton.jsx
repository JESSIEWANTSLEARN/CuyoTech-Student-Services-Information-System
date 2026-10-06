import { useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api.js";
import { clearAuth } from "../services/auth.js";

function LogoutButton() {
    const navigate = useNavigate();

    async function handleLogout() {
        try {
            await apiRequest("/logout", {
                method: "POST",
            });
        } catch {
            // Clear the local login even if the server token already expired.
        }

        clearAuth();
        navigate("/");
    }

    return (
        <button className="header-logout-button" type="button" onClick={handleLogout}>
            Log out
        </button>
    );
}

export default LogoutButton;
