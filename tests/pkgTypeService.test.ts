jest.mock('passport');

import request from 'supertest';
import app from '../src/server';
import { getAuthToken } from './helpers/auth.helper';

describe("Package Type Service", () => {
    let authToken: string;
    let setPkgTypeId: number;

    beforeAll(async () => {
        try {
            authToken = await getAuthToken();
            console.log('✓ Got auth token');
        } catch (error) {
            console.error('✗ Failed to get auth token:', error);
            throw error;
        }
    });

    it("Create a package type /api/v1/pkgtypemanagement/pkgtype should return created", async () => {
        const responseFirst = await request(app)
        .post('/api/v1/pkgtypemanagement/pkgtype')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
            name: "Pub",
            status: true
        });
        
        expect(responseFirst.status).toBe(201);
        expect(responseFirst.body.body).toHaveProperty('id');

        setPkgTypeId = responseFirst.body.body.id;
    });

    it("Should not create package type with duplicate name", async () => {
        const responseNameAlready = await request(app)
        .post('/api/v1/pkgtypemanagement/pkgtype')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
            name: "Pub",
            status: true
        });

        expect(responseNameAlready.status).toBe(500);
        expect(responseNameAlready.body.error).toBe('This package type name already existing.');
    })
    
    it('Get all package type /api/v1/pkgtypemanagement/pkgtype should return a list of packages', async () => {
        const response = await request(app).get('/api/v1/pkgtypemanagement/pkgtype');
        expect(response.status).toBe(200);
    });

    it('Get package type by id /api/v1/pkgtypemanagement/pkgtype should return a package', async () => {
        const response = await request(app).get(`/api/v1/pkgtypemanagement/pkgtype/${setPkgTypeId}`);
        expect(response.status).toBe(200);
    });

    it('Update package type by id /api/v1/pkgtypemanagement/pkgtype should return a package updated', async () => {
        const response = await request(app).put(`/api/v1/pkgtypemanagement/pkgtype/${setPkgTypeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
            name: "Pub A",
            status: true
        });
        expect(response.status).toBe(200);
    });

    it('Delete package type by id /api/v1/pkgtypemanagement/pkgtype should return a package detated', async () => {
        const response = await request(app).delete(`/api/v1/pkgtypemanagement/pkgtype/${setPkgTypeId}`)
        .set('Authorization', `Bearer ${authToken}`)

        expect(response.status).toBe(200);
    });
});