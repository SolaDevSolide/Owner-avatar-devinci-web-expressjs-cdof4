import request from 'supertest';
import app from '../src/app';
import sequelize from '../src/config/database';

beforeAll(async () => {
    // Sync the database and clear data before tests
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    // Close the database connection after tests
    await sequelize.close();
});

describe('API Endpoints', () => {
    it('GET /api/liveness - should return OK', async () => {
        const res = await request(app).get('/api/liveness');
        expect(res.statusCode).toEqual(200);
        expect(res.text).toBe('OK');
    });

    it('POST /api/package - should create a new package', async () => {
        const newPackage = {
            title: 'Learn Testing',
            description: 'Testing APIs with Jest and Supertest',
            category: 'Development',
            targetAudience: 'Developers',
            difficultyLevel: 4,
        };

        const res = await request(app)
            .post('/api/package')
            .send(newPackage);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('id');
        expect(res.body.title).toBe(newPackage.title);
    });

    it('GET /api/package - should retrieve all packages', async () => {
        const res = await request(app).get('/api/package');
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('GET /api/package/:id - should retrieve a package by ID', async () => {
        const resAll = await request(app).get('/api/package');
        const packageId = resAll.body[0].id;

        const res = await request(app).get(`/api/package/${packageId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('id', packageId);
    });

    it('PUT /api/package/:id - should update a package', async () => {
        const resAll = await request(app).get('/api/package');
        const packageId = resAll.body[0].id;

        const updatedData = {
            difficultyLevel: 5,
        };

        const res = await request(app)
            .put(`/api/package/${packageId}`)
            .send(updatedData);

        expect(res.statusCode).toEqual(200);
        expect(res.body.difficultyLevel).toBe(5);
    });

    it('GET /api/package-summaries - should retrieve package summaries', async () => {
        const res = await request(app).get('/api/package-summaries');
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('id');
        expect(res.body[0]).toHaveProperty('title');
    });
});