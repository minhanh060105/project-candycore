import { DataTypes } from 'sequelize';
import { sequelize } from '../libs/db.js';

const Session = sequelize.define('Session', {
    sessionId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'session_id'
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id'
    },
    refreshToken: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'refresh_token'
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'expires_at'
    }
}, {
    tableName: 'sessions',
    timestamps: false
});

export default Session;