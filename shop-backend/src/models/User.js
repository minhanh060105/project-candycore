import { DataTypes } from 'sequelize';
import { sequelize } from '../libs/db.js';

const User = sequelize.define('User', {
    userId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'user_id'
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        set(value) { this.setDataValue('username', value.trim().toLowerCase()); },
        field: 'username'
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        set(value) { this.setDataValue('email', value.trim().toLowerCase()); },
        field: 'email'
    },
    fullName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'full_name'
    },
    passwordHash: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'password_hash'
    },
    phoneNumber: {
        type: DataTypes.STRING(20),
        allowNull: true,
        field: 'phone_number'
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'address'
    },
    role: {
        type: DataTypes.ENUM('ADMIN', 'CUSTOMER'),
        allowNull: false,
        defaultValue: 'CUSTOMER',
        field: 'role'
    },
    status: {
        type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
        defaultValue: 'ACTIVE',
        field: 'status'
    }
}, {
    tableName: 'users',
    timestamps: true,
    underscored: true
});

export default User;

