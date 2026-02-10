import BaseApi from "../baseApi";
import {setToken, removeToken, getToken} from "../tokenManager";

class AuthApi extends BaseApi {
    async login(email: string, password: string) {
        try {
            const { data } = await this.post<{ token: string; user: { role: string } }>("/login", {
                email,
                password,
            });

            setToken(data.token);
            return { success: true };
        } catch (err: any) {

            if (err.response?.status === 401) {
                return { success: false, error: "ایمیل یا رمز عبور اشتباه است" };
            }
            return { success: false, error: err.response?.data?.message || "خطا در ورود" };
        }
    }

    async getProfile() {
        const token = getToken();
        if (!token) throw new Error("No token found");

        try {
            const { data } = await this.get<{ user: { name: string; role: string } }>("/profile", {
                headers: { Authorization: `Bearer ${token}` },
            });
            return { user: data.user };
        } catch (err: any) {
            if (err.response?.status === 401) removeToken();
            throw err;
        }
    }

    async register(name: string, email: string, password: string) {
        try {
            const { data } = await this.post<{ token: string; user: { name: string; role: string } }>("/register", {
                name,
                email,
                password,
            });

            setToken(data.token);
            return { success: true, user: data.user };
        } catch (err: any) {
            return {
                success: false,
                error: err.response?.data?.message || "خطا در ثبت نام",
            };
        }
    }
    logout() {
        removeToken();
    }
}

export const authApi = new AuthApi();
