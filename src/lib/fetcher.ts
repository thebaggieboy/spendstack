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
    } catch {
        // ignore network errors during refresh
    }

    return null;
}

export const requestWithAuth = async <T = unknown>(
    url: string,
    init: RequestInit = {},
): Promise<T> => {
    const token = localStorage.getItem("accessToken");

    const makeRequest = async (tkn: string | null) => {
        const headers = new Headers(init.headers);
        if (init.body && !(init.body instanceof FormData)) {
            headers.set("Content-Type", "application/json");
        }
        if (tkn) {
            headers.set("Authorization", `Bearer ${tkn}`);
        }
        return fetch(url, { ...init, headers });
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
        const errorInfo: unknown = await res.json().catch(() => ({}));
        const errorMessage =
            typeof errorInfo === "object" &&
            errorInfo !== null &&
            "detail" in errorInfo &&
            typeof errorInfo.detail === "string"
                ? errorInfo.detail
                : "An error occurred while fetching the data.";
        const error = new Error(errorMessage);
        Object.assign(error, { info: errorInfo, status: res.status });
        throw error;
    }

    if (res.status === 204) return undefined as T;
    return res.json() as Promise<T>;
};

type LegacyJsonResponse = ReturnType<typeof JSON.parse>

export const fetchWithAuth = (url: string): Promise<LegacyJsonResponse> =>
    requestWithAuth<LegacyJsonResponse>(url);
