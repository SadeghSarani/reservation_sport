import BaseApi from "../baseApi";

class UserApi extends BaseApi {
    getProfile() {
        return this.get("/user/profile");
    }

    async getAdminDashboardData() {
        return await this.get('/admin/dashboard')
    }
}

export const userApi = new UserApi();
