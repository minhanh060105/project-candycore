import User from './User.js';
import Product from './Product.js';
import { Order, OrderItem } from './Order.js';
import Session from './Session.js';

// Associations
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

Product.hasMany(OrderItem, { foreignKey: 'productId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

User.hasMany(Session, { foreignKey: 'userId' });
Session.belongsTo(User, { foreignKey: 'userId' });

export { User, Product, Order, OrderItem, Session };