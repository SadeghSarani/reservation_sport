import httpClient from "./httpClient";

export default class BaseApi {
    protected get<T>(url: string, params = {}) {
        return httpClient.get<T>(url, { params });
    }

    protected post<T>(url: string, data = {}) {
        return httpClient.post<T>(url, data);
    }

    protected put<T>(url: string, data = {}) {
        return httpClient.put<T>(url, data);
    }

    protected delete<T>(url: string) {
        return httpClient.delete<T>(url);
    }
}
