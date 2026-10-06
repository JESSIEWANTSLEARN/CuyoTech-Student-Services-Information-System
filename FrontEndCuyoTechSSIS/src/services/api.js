const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export async function apiRequest(path, options = {}) {
    const token = localStorage.getItem("cuyotech_token");

    const headers = {
        Accept: "application/json",
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers,
    });

    let data = {};

    try {
        data = await response.json();
    } catch {
        data = {};
    }

    if (!response.ok) {
        const validationMessage = data.errors
            ? Object.values(data.errors).flat()[0]
            : null;

        throw new Error(validationMessage || data.message || "Request failed.");
    }

    return data;
}
