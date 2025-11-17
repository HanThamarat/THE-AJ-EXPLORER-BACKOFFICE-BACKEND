import app from "../src/server";
import request from "supertest";

describe("Client Package Service", () => {

    it("Finding package name by province /api/v1/client/package/province_package should return list of package name", async () => {
        const response = await request(app)
        .get('/api/v1/client/package/province_package');

        expect(response.status).toBe(200);
    });

    it("Finding package by search /api/v1/client/package/packages should return list of package", async () => {
        const response = await request(app)
        .get("/api/v1/client/package/packages");

        expect(response.status).toBe(200);
    });
});