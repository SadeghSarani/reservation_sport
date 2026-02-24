import BaseApi from "../baseApi";

class UserApi extends BaseApi {
    getProfile() {
        return this.get("/user/profile");
    }

    async getAdminDashboardData() {
        return await this.get('/admin/dashboard')
    }

    async getUserDashboardData() {
        return await this.get('/user/dashboard')
    }
}

export const userApi = new UserApi();
