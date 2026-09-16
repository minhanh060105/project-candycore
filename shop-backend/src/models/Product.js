import { DataTypes } from 'sequelize';
import { sequelize } from '../libs/db.js';

const Product = sequelize.define('Product', {
    productId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'product_id'
    },
    productName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'product_name'
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'description'
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'price',
        validate: { min: 0 }
    },
    originalPrice: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'original_price'
    },
    imageUrl: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'image_url'
    },
    category: {
        type: DataTypes.ENUM('plush', 'accessories', 'stationery', 'apparel', 'homeware'),
        defaultValue: 'plush',
        field: 'category'
    },
    character: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'character_name'
},
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'stock'
    },
    status: {
        type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
        defaultValue: 'ACTIVE',
        field: 'status'
    }
}, {
    tableName: 'products',
    timestamps: true,
    underscored: true
});

export default Product;
