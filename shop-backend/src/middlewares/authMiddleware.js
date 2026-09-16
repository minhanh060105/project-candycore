import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

export const protectedRoute = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Bạn cần đăng nhập.' });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findByPk(decoded.userId, { attributes: { exclude: ['passwordHash'] } });
        if (!user || user.status !== 'ACTIVE') {
            return res.status(401).json({ success: false, message: 'Phiên đăng nhập không hợp lệ.' });
        }
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn.' });
    }
};

export const adminOnly = (req, res, next) => {
    if (req.user?.role !== 'ADMIN') {
        return res.status(403).json({ success: false, message: 'Chỉ admin mới có quyền này.' });
    }
    next();
};

