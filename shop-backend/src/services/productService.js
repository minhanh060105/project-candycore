import { Product } from '../models/index.js';
import { Op } from 'sequelize';

class ProductService {
    async getAll({ limit = 20, offset = 0, search, category, character } = {}) {
        const where = { status: 'ACTIVE' };
        if (search) where.productName = { [Op.like]: `%${search}%` };
        if (category) where.category = category;
        if (character) where.character = { [Op.like]: `%${character}%` };
        const { count, rows } = await Product.findAndCountAll({ where, limit, offset, order: [['productId', 'DESC']] });
        return { success: true, data: { products: rows, total: count, limit, offset } };
    }

    async getById(id) {
        const p = await Product.findByPk(id);
        if (!p) throw { statusCode: 404, message: 'Sản phẩm không tồn tại.' };
        return { success: true, data: p };
    }

    async create(data) {
        const { productName, price, description, imageUrl, category, character, stock, originalPrice } = data;
        if (!productName || !price) throw { statusCode: 400, message: 'Thiếu tên sản phẩm hoặc giá.' };
        const p = await Product.create({ productName, price, description, imageUrl, category, character, stock: stock || 0, originalPrice: originalPrice || null });
        return { success: true, message: 'Tạo sản phẩm thành công.', data: p };
    }

    async update(id, data) {
        const p = await Product.findByPk(id);
        if (!p) throw { statusCode: 404, message: 'Sản phẩm không tồn tại.' };
        await p.update(data);
        return { success: true, message: 'Cập nhật thành công.', data: p };
    }

    async delete(id) {
        const p = await Product.findByPk(id);
        if (!p) throw { statusCode: 404, message: 'Sản phẩm không tồn tại.' };
        await p.update({ status: 'INACTIVE' });
        return { success: true, message: 'Đã xóa sản phẩm.' };
    }
}

export default new ProductService();

