import app from "../src/server";
import request from "supertest";
import { getAuthToken } from "./helpers/auth.helper";
import data from "./data/pakcage.json";

describe("Client Package Service", () => {
    let authToken: string;
    let pkgId: number;

    beforeAll(async () => {
        try {
            authToken = await getAuthToken();
            console.log('✓ Got auth token');
        } catch (error) {
            console.error('✗ Failed to get auth token:', error);
            throw error;
        }
    });

    it("Create a pakcage /api/v1/packagemanagement/package should return package created", async () => {
        const response = await request(app)
        .post('/api/v1/packagemanagement/package')
        .set('Authorization', `Bearer ${authToken}`)
        .send(data);

        expect(response.status).toBe(201);
        expect(response.body.body).toHaveProperty("id");

        pkgId = response.body.body.id;
    });

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

    it("Finding package detail /api/v1/client/package/package_detail/{id} should return the pacakage", async () => {
        const response = await request(app)
        .get(`/api/v1/client/package/package_detail/${pkgId}`);

        expect(response.status).toBe(200);
    })
});