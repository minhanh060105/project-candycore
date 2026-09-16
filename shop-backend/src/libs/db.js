import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

export { Sequelize };

export const sequelize = new Sequelize(process.env.DB_CONNECTION_STRING, {
    dialect: 'mysql',
    logging: false,
    timezone: '+07:00',
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
    dialectOptions: {
        connectTimeout: 60000,
        dateStrings: true,
        typeCast: true,
        timezone: '+07:00'
    },
    define: {
        freezeTableName: true,
        underscored: true
    }
});

export const initDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected.');
        return true;
    } catch (error) {
        console.error('❌ DB connection failed:', error.message);
        throw error;
    }
};

