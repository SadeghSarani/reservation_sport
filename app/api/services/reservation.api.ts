import BaseApi from "../baseApi";

class ReservationApi extends BaseApi {
    async getReservation() {
        return await this.get("/reservations");
    }
}

export const reservationApi = new ReservationApi();
