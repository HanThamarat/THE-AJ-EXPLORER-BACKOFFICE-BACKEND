import app from "../src/server";
import request from 'supertest';
import { getAuthToken } from "./helpers/auth.helper";
import data from "./data/pkgOptions.json";

describe("Package Promotion Service", () => {
    let authToken: string;
    let promoId: number;

    beforeAll(async () => {
        try {
            authToken = await getAuthToken();
            console.log('✓ Got auth token');
        } catch (error) {
            console.error('✗ Failed to get auth token:', error);
            throw error;
        }
    });

    it("Create a package promotion /api/v1/packagepromotion/promotion should return package promotion created", async () => {
        const response = await request(app)
        .post('/api/v1/packagepromotion/promotion')
        .set('Authorization', `Bearer ${authToken}`)
        .send(data);

        expect(response.status).toBe(201);
        expect(response.body.body).toHaveProperty("id");

        promoId = response.body.body.id;
    });

    it("Get all package promotion /api/v1/packagepromotion/promotion should return list of package promotions", async () => {
        const response = await request(app)
        .get('/api/v1/packagepromotion/promotion');

        expect(response.status).toBe(200);
    });

    it("Get package promotion by id /api/v1/packagepromotion/promotion should return promotion", async () => {
        const response = await request(app)
        .get(`/api/v1/packagepromotion/promotion/${promoId}`);

        expect(response.status).toBe(200);
    });

    it("Update package promotion /api/v1/packagepromotion/promotion should updated", async () => {
        const response = await request(app)
        .put(`/api/v1/packagepromotion/promotion/${promoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(data); 

        expect(response.status).toBe(200);
    });

    it("Delete package promotion /api/v1/packagepromotion/promotion should deleted", async () => {
        const response = await request(app)
        .delete(`/api/v1/packagepromotion/promotion/${promoId}`);

        expect(response.status).toBe(200);
    });
});