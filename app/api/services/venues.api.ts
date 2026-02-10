import BaseApi from "../baseApi";

class VenuesApi extends BaseApi {
    async getVenuesDashboard() {
        return await this.get("/venue/dashboard");
    }

    async getVenues(query : any) {
        return await this.get('/venues', query)
    }

    async getVenue(id: number) {
        return await this.get(`/venues/${id}`)
    }
}

export const venuesApi = new VenuesApi();