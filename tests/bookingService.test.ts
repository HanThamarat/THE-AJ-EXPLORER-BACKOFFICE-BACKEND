import app from "../src/server";
import request from "supertest";

describe("Booking Service", () => {
    it("Create a first step of booking /api/v1/client/booking_service/booking", async () => {
        const getUserId = await request(app)
        .post("/api/v1/auth/google-signin")
        .send({
            email: "hanthamarat@gmail.com",
            name: "Thamarat Laosen",
            picture: null,
            sub: "goolge user id"
        });

        const response = await request(app)
        .post("/api/v1/client/booking_service/booking")
        .send({
            "userId": getUserId.body.body.id,
            "packageId": 1,
            "childPrice": 70000,
            "childQty": 2,
            "adultPrice": 150000,
            "adultQty": 3,
            "amount": 590000,
            "additionalDetail": "A 3-day adventure in Phuket",
            "pickup_lat": 13.9312082,
            "pickup_lgn": 100.6307107,
            "trip_at": "2025-12-15",
            "policyAccept": true
        });

        expect(response.status).toBe(201);
    });
});