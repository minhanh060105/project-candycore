import { DataTypes } from 'sequelize';
import { sequelize } from '../libs/db.js';

export const Order = sequelize.define('Order', {
    orderId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'order_id'
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id'
    },
    totalAmount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'total_amount'
    },
    shippingAddress: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'shipping_address'
    },
    status: {
        type: DataTypes.ENUM('PENDING', 'CONFIRMED', 'SHIPPING', 'DELIVERED', 'CANCELLED'),
        defaultValue: 'PENDING',
        field: 'status'
    },
    note: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'note'
    }
}, {
    tableName: 'orders',
    timestamps: true,
    underscored: true
});

export const OrderItem = sequelize.define('OrderItem', {
    itemId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'item_id'
    },
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'order_id'
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'product_id'
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'quantity'
    },
    unitPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'unit_price'
    }
}, {
    tableName: 'order_items',
    timestamps: false
});
