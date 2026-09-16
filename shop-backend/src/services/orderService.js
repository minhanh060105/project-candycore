import { Order, OrderItem, Product } from '../models/index.js';
import { sequelize } from '../libs/db.js';

class OrderService {
    async createOrder(userId, { items, shippingAddress, note }) {
        if (!items || !items.length) throw { statusCode: 400, message: 'Giỏ hàng trống.' };
        if (!shippingAddress) throw { statusCode: 400, message: 'Vui lòng nhập địa chỉ giao hàng.' };

        const t = await sequelize.transaction();
        try {
            let totalAmount = 0;
            const itemsData = [];
            for (const item of items) {
                const product = await Product.findByPk(item.productId, { transaction: t });
                if (!product || product.status !== 'ACTIVE') throw { statusCode: 400, message: `Sản phẩm không tồn tại.` };
                if (product.stock < item.quantity) throw { statusCode: 400, message: `Sản phẩm "${product.productName}" không đủ hàng.` };
                totalAmount += product.price * item.quantity;
                itemsData.push({ productId: item.productId, quantity: item.quantity, unitPrice: product.price });
                await product.update({ stock: product.stock - item.quantity }, { transaction: t });
            }
            const order = await Order.create({ userId, totalAmount, shippingAddress, note: note || null }, { transaction: t });
            for (const item of itemsData) {
                await OrderItem.create({ orderId: order.orderId, ...item }, { transaction: t });
            }
            await t.commit();
            return { success: true, message: 'Đặt hàng thành công!', data: { orderId: order.orderId, totalAmount } };
        } catch (err) {
            await t.rollback();
            throw err;
        }
    }

    async getUserOrders(userId) {
        const orders = await Order.findAll({
            where: { userId },
            include: [{ model: OrderItem, as: 'items', include: [{ model: Product, as: 'product', attributes: ['productName', 'imageUrl'] }] }],
            order: [['createdAt', 'DESC']]
        });
        return { success: true, data: orders };
    }

    async getAllOrders({ limit = 100, offset = 0, status } = {}) {
    const where = {};
    if (status) where.status = status;
    const orders = await Order.findAll({
        where,
        include: [{ model: OrderItem, as: 'items', include: [{ model: Product, as: 'product', attributes: ['productName', 'imageUrl'] }] }],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
    });
    return { success: true, data: orders };
}

    async updateStatus(orderId, status) {
        const order = await Order.findByPk(orderId);
        if (!order) throw { statusCode: 404, message: 'Đơn hàng không tồn tại.' };
        await order.update({ status });
        return { success: true, message: 'Cập nhật trạng thái thành công.', data: order };
    }
}

export default new OrderService();

