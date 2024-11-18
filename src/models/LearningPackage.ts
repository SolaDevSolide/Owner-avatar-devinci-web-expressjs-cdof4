import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class LearningPackage extends Model {
    public id!: number;
    public title!: string;
    public description!: string;
    public category!: string;
    public targetAudience!: string;
    public difficultyLevel!: number;
}

LearningPackage.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        targetAudience: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        difficultyLevel: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        tableName: 'LearningPackages',
        sequelize,
    }
);

export default LearningPackage;