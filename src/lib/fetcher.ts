"use client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function attemptTokenRefresh(): Promise<string | null> {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return null;

    try {
        const res = await fetch(`${API_URL}users/token/refresh/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh: refreshToken }),
        });

        if (res.ok) {
            const data = await res.json();
            const newAccess = data.access;
            localStorage.setItem("accessToken", newAccess);
            return newAccess;
        }
    } catch (_) {
        // ignore network errors during refresh
    }

    return null;
}

export const fetchWithAuth = async (url: string): Promise<any> => {
    let token = localStorage.getItem("accessToken");

    const makeRequest = async (tkn: string | null) => {
        const headers: HeadersInit = {
            "Content-Type": "application/json",
        };
        if (tkn) {
            headers["Authorization"] = `Bearer ${tkn}`;
        }
        return fetch(url, { headers });
    };

    let res = await makeRequest(token);

    // If 401, attempt to refresh and retry once
    if (res.status === 401) {
        const newToken = await attemptTokenRefresh();

        if (newToken) {
            // Retry with the fresh token
            res = await makeRequest(newToken);
        }

        // If still 401 after refresh attempt, force logout
        if (res.status === 401) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            window.location.href = "/login";
            throw new Error("Session expired. Please log in again.");
        }
    }

    if (!res.ok) {
        const error = new Error("An error occurred while fetching the data.");
        // @ts-ignore
        error.info = await res.json().catch(() => ({}));
        // @ts-ignore
        error.status = res.status;
        throw error;
    }

    return res.json();
};
