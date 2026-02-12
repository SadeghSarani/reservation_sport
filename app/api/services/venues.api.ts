import BaseApi from "../baseApi";

class VenuesApi extends BaseApi {
    async getVenuesDashboard() {
        return await this.get("/venue/dashboard");
    }

    async getVenues(query : any) {
        return await this.get('/venues', query)
    }

    async getAdminVenues() {
        return await this.get('/venues/manage/admin')
    }

    async getVenue(id: number) {
        return await this.get(`/venues/${id}`)
    }

    async getAdminSingleVenue(id: number) {
        return await this.get(`/venues/manage/admin/${id}`)
    }


    async getTimeCalendar(calendarId : number, venueId : number) {
        return await this.get(`/venues/time/${venueId}`, {
            calendar_id : calendarId
        })
    }
    async getCalendars(venueId : number) {
        return await this.get(`/venues/calendars/${venueId}`)
    }
}

export const venuesApi = new VenuesApi();