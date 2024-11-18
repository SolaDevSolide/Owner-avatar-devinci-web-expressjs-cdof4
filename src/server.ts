import app from './app';
import sequelize from './config/database';

const port = process.env.PORT || 3000;

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