import app from "../src/server";
import request from "supertest";

describe("Booking Service", () => {
    it("Create a first step of booking /api/v1/client/booking_service/booking", async () => {
        const getUserId = await request(app)
        .post("/api/v1/auth/google-signin")
        .send({
            email: "hanthamarat@gmail.com",
            name: "Thamarat Laosen",
            sub: "goolge user id"
        });

        const response = await request(app)
        .post("/api/v1/client/booking_service/booking")
        .send({
        "contractBooking": {
            "userId": getUserId.body.body.id,
            "firstName": "Thamarat",
            "lastName": "Laosen",
            "email": "hanthamarat@gmail.com",
            "country": "TH",
            "phoneNumber": "0917128484"
        },
        "packageId": 1,
        "childPrice": 70000,
        "childQty": 2,
        "adultPrice": 150000,
        "adultQty": 3,
        "groupPrice": 0,
        "groupQty": 0,
        "amount": 590000,
        "additionalDetail": "A 3-day adventure in Phuket",
        "pickup_lat": 13.9312082,
        "pickup_lgn": 100.6307107,
        "trip_at": "2025-12-15",
        "policyAccept": true
        });

        expect(response.status).toBe(201);
    });

    it("Get the booking avg by weekly /api/v1/booking_management/booking_avg/Weekly should to be status 200", async () => {
        const response = await request(app).
        get("/api/v1/booking_management/booking_avg/Weekly");

        expect(response.status).toBe(200);
    });

    it("Get the booking avg by Monthly /api/v1/booking_management/booking_avg/Monthly should to be status 200", async () => {
        const response = await request(app).
        get("/api/v1/booking_management/booking_avg/Monthly");

        expect(response.status).toBe(200);
    });

    it("Get the booking avg by Yearly /api/v1/booking_management/booking_avg/Yearly should to be status 200", async () => {
        const response = await request(app).
        get("/api/v1/booking_management/booking_avg/Yearly");

        expect(response.status).toBe(200);
    });
});