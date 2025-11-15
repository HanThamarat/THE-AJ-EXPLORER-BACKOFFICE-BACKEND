import request from 'supertest';
import app from '../src/server';
import { getAuthToken } from './helpers/auth.helper';
import data from "./data/user.json";
import dataUpdate from './data/user_update.json';

describe("User Service", () => {
    let authToken: string;
    let userId: number;

    beforeAll(async () => {
        try {
            authToken = await getAuthToken();
            console.log('✓ Got auth token');
        } catch (error) {
            console.error('✗ Failed to get auth token:', error);
            throw error;
        }
    });

    it("Create user /api/v1/usermanagement/create_user should return user created", async () => {
        const response = await request(app)
        .post('/api/v1/usermanagement/create_user')
        .set('Authorization', `Bearer ${authToken}`)
        .send(data);

        expect(response.status).toBe(201);
        expect(response.body.body).toHaveProperty("id");

        userId = response.body.body.id;
    });

    it("Get all user /api/v1/usermanagement/users should list of users", async () => {
        const response = await request(app)
        .get('/api/v1/usermanagement/users');

        expect(response.status).toBe(200);
    });

    it("Get user by id /api/v1/usermanagement/user/{id} should return user", async () => {
        const response = await request(app)
        .get(`/api/v1/usermanagement/user/${userId}`);

        expect(response.status).toBe(200);
    });

    it("Update user /api/v1/usermanagement/user/{id} should return user updated", async () => {
        const response = await request(app)
        .put(`/api/v1/usermanagement/user/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(dataUpdate);

        expect(response.status).toBe(200);
    });

    it("Delete user /api/v1/usermanagement/user/{id} should return user deleted", async () => {
        const response = await request(app)
        .delete(`/api/v1/usermanagement/user/${userId}`);

        expect(response.status).toBe(200);
    })
});