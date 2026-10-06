import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "../services/api.js";

export function useApiData(path, initialValue = null) {
    const [data, setData] = useState(initialValue);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const load = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await apiRequest(path);
            setData(response);
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            setLoading(false);
        }
    }, [path]);

    useEffect(() => {
        let active = true;

        apiRequest(path)
            .then((response) => {
                if (active) {
                    setData(response);
                    setError("");
                }
            })
            .catch((requestError) => {
                if (active) {
                    setError(requestError.message);
                }
            })
            .finally(() => {
                if (active) {
                    setLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, [path]);

    return { data, loading, error, reload: load };
}
