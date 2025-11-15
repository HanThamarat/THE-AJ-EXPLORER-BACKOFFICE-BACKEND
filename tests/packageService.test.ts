import { getAuthToken } from "./helpers/auth.helper";
import app from "../src/server";
import request from "supertest";
import data from "./data/pakcage.json";

describe("Package Service", () => {
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

    it("Get all packages /api/v1/packagemanagement/package should return list of packages", async () => {
        const response = await request(app)
        .get('/api/v1/packagemanagement/package');

        expect(response.status).toBe(200);
    });

    it("Get package by id /api/v1/packagemanagement/package should return package", async () => {
        const response = await request(app)
        .get(`/api/v1/packagemanagement/package/${pkgId}`);

        expect(response.status).toBe(200);
    });

    it("Update package by id /api/v1/packagemanagement/package should return package updated", async () => {
        const response = await request(app)
        .put(`/api/v1/packagemanagement/package/${pkgId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(data);

        expect(response.status).toBe(200);
    });

    it("Delete package by id /api/v1/packagemanagement/package should return package deleted", async () => {
        const response = await request(app)
        .delete(`/api/v1/packagemanagement/package/${pkgId}`);

        expect(response.status).toBe(200);
    });
});