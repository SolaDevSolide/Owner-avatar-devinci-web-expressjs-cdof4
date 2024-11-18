// Import statements
import sequelize from './config/database'; // Make sure the path is correct
import express, { NextFunction, Request, Response } from 'express';
import { Op } from 'sequelize';
import LearningPackage from './models/LearningPackage';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';

const app = express();
const port = process.env.PORT;

app.use(express.json());

/**
 * @swagger
 * /api/liveness:
 *   get:
 *     summary: Check if the server is running
 *     responses:
 *       200:
 *         description: OK
 */
app.get('/api/liveness', (req: Request, res: Response) => {
    res.status(200).send('OK');
});

/**
 * @swagger
 * /api/package:
 *   get:
 *     summary: Retrieve all learning packages
 *     responses:
 *       200:
 *         description: A list of learning packages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LearningPackage'
 */
app.get('/api/package', async (req: Request, res: Response) => {
    try {
        const packages = await LearningPackage.findAll();
        res.status(200).json(packages);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

/**
 * @swagger
 * /api/package/{id}:
 *   get:
 *     summary: Retrieve a learning package by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The learning package ID
 *     responses:
 *       200:
 *         description: A learning package object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LearningPackage'
 *       404:
 *         description: Entity not found
 */
app.get('/api/package/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    try {
        const learningPackage = await LearningPackage.findByPk(id);

        if (learningPackage) {
            res.status(200).json(learningPackage);
        } else {
            res.status(404).json({ message: `Entity not found for id: ${id}` });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

/**
 * @swagger
 * /api/package-summaries:
 *   get:
 *     summary: Retrieve summaries of all learning packages
 *     responses:
 *       200:
 *         description: A list of package summaries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PackageSummary'
 */
app.get('/api/package-summaries', async (req: Request, res: Response) => {
    try {
        const packages = await LearningPackage.findAll({
            attributes: ['id', 'title'],
        });
        res.status(200).json(packages);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

/**
 * @swagger
 * /api/package-summaries/search:
 *   get:
 *     summary: Search for package summaries by title or description
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Title to search for
 *       - in: query
 *         name: description
 *         schema:
 *           type: string
 *         description: Description to search for
 *     responses:
 *       200:
 *         description: A list of matching package summaries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PackageSummary'
 */
app.get('/api/package-summaries/search', async (req: Request, res: Response) => {
    const { title, description } = req.query;

    let whereClause: any = {};

    if (title) {
        whereClause.title = { [Op.iLike]: `%${title}%` };
    }

    if (description) {
        whereClause.description = { [Op.iLike]: `%${description}%` };
    }

    try {
        const packages = await LearningPackage.findAll({
            attributes: ['id', 'title'],
            where: whereClause,
        });
        res.status(200).json(packages);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

/**
 * @swagger
 * /api/package:
 *   post:
 *     summary: Create a new learning package
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LearningPackageInput'
 *     responses:
 *       200:
 *         description: The created learning package
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LearningPackage'
 *       400:
 *         description: Missing mandatory fields
 */
app.post(
    '/api/package',
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { title, description, category, targetAudience, difficultyLevel } = req.body;

        if (!title || !description || !category || !targetAudience || !difficultyLevel) {
            res.status(400).json({ message: 'Missing mandatory fields' });
            return;
        }

        try {
            const newPackage = await LearningPackage.create({
                title,
                description,
                category,
                targetAudience,
                difficultyLevel,
            });

            res.status(200).json(newPackage);
        } catch (error) {
            next(error);
        }
    }
);

/**
 * @swagger
 * /api/package/{id}:
 *   put:
 *     summary: Update an existing learning package
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the learning package to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LearningPackageInput'
 *     responses:
 *       200:
 *         description: The updated learning package
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LearningPackage'
 *       404:
 *         description: Entity not found
 */
app.put('/api/package/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { title, description, category, targetAudience, difficultyLevel } = req.body;

    try {
        const learningPackage = await LearningPackage.findByPk(id);

        if (learningPackage) {
            await learningPackage.update({
                title: title || learningPackage.title,
                description: description || learningPackage.description,
                category: category || learningPackage.category,
                targetAudience: targetAudience || learningPackage.targetAudience,
                difficultyLevel: difficultyLevel || learningPackage.difficultyLevel,
            });

            res.status(200).json(learningPackage);
        } else {
            res.status(404).json({ message: `Entity not found for id: ${id}` });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Swagger setup
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Learning API',
            version: '1.0.0',
            description: 'API for Learning Packages',
        },
        servers: [{ url: 'http://localhost:3000' }],
        components: {
            schemas: {
                LearningPackage: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        title: { type: 'string', example: 'Learn TypeScript' },
                        description: { type: 'string', example: 'An introductory course to TypeScript' },
                        category: { type: 'string', example: 'Programming' },
                        targetAudience: { type: 'string', example: 'Developers' },
                        difficultyLevel: { type: 'integer', example: 3 },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                LearningPackageInput: {
                    type: 'object',
                    required: ['title', 'description', 'category', 'targetAudience', 'difficultyLevel'],
                    properties: {
                        title: { type: 'string', example: 'Learn TypeScript' },
                        description: { type: 'string', example: 'An introductory course to TypeScript' },
                        category: { type: 'string', example: 'Programming' },
                        targetAudience: { type: 'string', example: 'Developers' },
                        difficultyLevel: { type: 'integer', example: 3 },
                    },
                },
                PackageSummary: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        title: { type: 'string', example: 'Learn TypeScript' },
                    },
                },
            },
        },
    },
    apis: ['./app.ts'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Start the server
sequelize
    .sync()
    .then(() => {
        console.log('Database synchronized successfully.');
        app.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
        });
    })
    .catch((error) => {
        console.error('Unable to synchronize the database:', error);
    });

export default app; // Export the app for testing