export function saveAuth(token, user) {
    localStorage.setItem("cuyotech_token", token);
    localStorage.setItem("cuyotech_user", JSON.stringify(user));
}

export function clearAuth() {
    localStorage.removeItem("cuyotech_token");
    localStorage.removeItem("cuyotech_user");
}

export function getAuthToken() {
    return localStorage.getItem("cuyotech_token");
}

export function getAuthUser() {
    const value = localStorage.getItem("cuyotech_user");

    if (!value) {
        return null;
    }

    try {
        return JSON.parse(value);
    } catch {
        clearAuth();
        return null;
    }
}

export function getDashboardPath(role) {
    const paths = {
        student: "/student/dashboard",
        registrar: "/registrar/dashboard",
        cashier: "/cashier/dashboard",
        department: "/department/dashboard",
        admin: "/admin/dashboard",
    };

    return paths[role] || "/";
}
