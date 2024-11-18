import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

const env = process.env.NODE_ENV || 'development';

// Load environment variables from the correct .env file
dotenv.config({ path: env === 'test' ? '.env.test' : '.env' });

const sequelize = new Sequelize(
    process.env.DB_NAME as string,
    process.env.DB_USER as string,
    process.env.DB_PASSWORD as string,
    {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432', 10),
        dialect: 'postgres',
        logging: env === 'test' ? false : console.log, // Optional: Disable logging during tests
    }
);

export default sequelize;
