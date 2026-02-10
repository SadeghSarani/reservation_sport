import axios from "axios";
import { ENV } from "../config/env";
import { getToken, removeToken } from "./tokenManager";

const httpClient = axios.create({
    baseURL: ENV.API_BASE_URL,
    timeout: 15000,
});

// Attach token automatically
httpClient.interceptors.request.use((config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Handle 401 globally
httpClient.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            removeToken();
            if (typeof window !== "undefined") window.location.href = "/login";
        }
        return Promise.reject(err);
    }
);

export default httpClient;
