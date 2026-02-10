import BaseApi from "../baseApi";

class UserApi extends BaseApi {
    getProfile() {
        return this.get("/user/profile");
    }
}

export const userApi = new UserApi();
