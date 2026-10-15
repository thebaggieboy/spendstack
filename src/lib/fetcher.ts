"use client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function resolveApiRequestUrl(value: string): string {
    if (typeof window === "undefined") return value;

    const requestUrl = new URL(value, window.location.origin);
    const currentHost = window.location.hostname;
    if (
        (requestUrl.hostname === "localhost" || requestUrl.hostname === "127.0.0.1") &&
        currentHost !== "localhost" &&
        currentHost !== "127.0.0.1"
    ) {
        requestUrl.hostname = currentHost;
    }
    return requestUrl.toString();
}

async function attemptTokenRefresh(): Promise<string | null> {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return null;

    try {
        const res = await fetch(resolveApiRequestUrl(`${API_URL}users/token/refresh/`), {
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
        return fetch(resolveApiRequestUrl(url), { ...init, headers });
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

export const uploadWithAuth = async <T = unknown>(
    url: string,
    body: FormData,
    onProgress: (percentage: number) => void,
    signal?: AbortSignal,
): Promise<T> => {
    const send = (token: string | null) =>
        new Promise<{ status: number; responseText: string }>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", resolveApiRequestUrl(url));
            if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);
            xhr.upload.onprogress = event => {
                if (event.lengthComputable) {
                    onProgress(Math.round((event.loaded / event.total) * 100));
                }
            };
            xhr.onload = () => resolve({ status: xhr.status, responseText: xhr.responseText });
            xhr.onerror = () => reject(new TypeError("Could not connect to the statement service."));
            xhr.onabort = () => reject(new DOMException("Upload aborted.", "AbortError"));
            if (signal) {
                if (signal.aborted) {
                    xhr.abort();
                    return;
                }
                signal.addEventListener("abort", () => xhr.abort(), { once: true });
            }
            xhr.send(body);
        });

    let response = await send(localStorage.getItem("accessToken"));
    if (response.status === 401) {
        const refreshedToken = await attemptTokenRefresh();
        if (refreshedToken) response = await send(refreshedToken);
        if (response.status === 401) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            window.location.href = "/login";
            throw new Error("Session expired. Please log in again.");
        }
    }

    let payload: unknown;
    try {
        payload = response.responseText ? JSON.parse(response.responseText) : undefined;
    } catch {
        throw new Error("The statement service returned an unreadable response.");
    }
    if (response.status < 200 || response.status >= 300) {
        const detail =
            typeof payload === "object" &&
            payload !== null &&
            "detail" in payload &&
            typeof payload.detail === "string"
                ? payload.detail
                : "An error occurred while uploading the statement.";
        const error = new Error(detail);
        Object.assign(error, { info: payload, status: response.status });
        throw error;
    }
    return payload as T;
};

type LegacyJsonResponse = ReturnType<typeof JSON.parse>

export const fetchWithAuth = (url: string): Promise<LegacyJsonResponse> =>
    requestWithAuth<LegacyJsonResponse>(url);
