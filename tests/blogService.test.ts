import app from "../src/server";
import { getAuthToken } from "./helpers/auth.helper";
import request from 'supertest';
import data from './data/blog.json';

describe("Blog Service", () => {
    let authToken: string;
    let blogId: number;

    beforeAll(async () => {
        try {
            authToken = await getAuthToken();
            console.log('✓ Got auth token');
        } catch (error) {
            console.error('✗ Failed to get auth token:', error);
            throw error;
        }
    });

    it("Create a blog /api/v1/blogmanagement/blog should return blog and created", async () => {
        const response = await request(app)
        .post('/api/v1/blogmanagement/blog')
        .set('Authorization', `Bearer ${authToken}`)
        .send(data)

        expect(response.status).toBe(201);
        expect(response.body.body).toHaveProperty("id");

        blogId = response.body.body.id;
    });

    it("Get all blog /api/v1/blogmanagement/blog should return list of blogs", async () => {
        const response = await request(app)
        .get('/api/v1/blogmanagement/blog');

        expect(response.status).toBe(200);
    });

    it("Get blog by id /api/v1/blogmanagement/blog should return blog", async () => {
        const response = await request(app)
        .get(`/api/v1/blogmanagement/blog/${blogId}`);

        expect(response.status).toBe(200);
    });

    it("Update blog /api/v1/blogmanagement/blog should return blog and updated", async () => {
        const response = await request(app)
        .put(`/api/v1/blogmanagement/blog/${blogId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(data);

        expect(response.status).toBe(200);
    });

    it("Delete blog /api/v1/blogmanagement/blog should return blog and updated", async () => {
        const response = await request(app)
        .delete(`/api/v1/blogmanagement/blog/${blogId}`);

        expect(response.status).toBe(200);
    });

    it("Get all blog type /api/v1/blogmanagement/blog_type should return list of blogs", async () => {
        const response = await request(app)
        .get('/api/v1/blogmanagement/blog_type');

        expect(response.status).toBe(200);
    });
});