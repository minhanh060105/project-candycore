import { User, Session } from '../models/index.js';
import { Op } from 'sequelize';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const ACCESS_TOKEN_TTL = '1h';
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000;

class AuthService {
    async signUp(data) {
        const { username, password, email, fullName, phoneNumber, address } = data;
        if (!username || !email || !password || !fullName) {
            throw { statusCode: 400, message: 'Vui lòng điền đầy đủ thông tin.' };
        }
        const norm_u = username.trim().toLowerCase();
        const norm_e = email.trim().toLowerCase();
        const existing = await User.findOne({ where: { [Op.or]: [{ username: norm_u }, { email: norm_e }] } });
        if (existing) throw { statusCode: 409, message: 'Username hoặc email đã tồn tại.' };
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({ username: norm_u, email: norm_e, fullName, passwordHash, phoneNumber: phoneNumber || null, address: address || null, role: 'CUSTOMER' });
        return { success: true, message: 'Đăng ký thành công!', data: { userId: user.userId, username: user.username, email: user.email } };
    }

    async signIn(data) {
        const { username, password } = data;
        if (!username || !password) throw { statusCode: 400, message: 'Vui lòng điền đầy đủ thông tin.' };
        const user = await User.findOne({ where: { username: username.trim().toLowerCase() } });
        if (!user) throw { statusCode: 401, message: 'Tên đăng nhập hoặc mật khẩu không đúng.' };
        if (user.status !== 'ACTIVE') throw { statusCode: 403, message: 'Tài khoản đã bị khóa.' };
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) throw { statusCode: 401, message: 'Tên đăng nhập hoặc mật khẩu không đúng.' };
        await Session.destroy({ where: { userId: user.userId } });
        const accessToken = jwt.sign({ userId: user.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_TTL });
        const refreshToken = crypto.randomBytes(64).toString('hex');
        await Session.create({ userId: user.userId, refreshToken, expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL) });
        const { passwordHash, ...userData } = user.toJSON();
        return { success: true, message: 'Đăng nhập thành công!', data: { accessToken, refreshToken, user: userData } };
    }

    async signOut(refreshToken) {
        if (refreshToken) await Session.destroy({ where: { refreshToken } });
        return { success: true, message: 'Đã đăng xuất.' };
    }

    async refreshToken(refreshToken) {
        if (!refreshToken) throw { statusCode: 401, message: 'Token không tồn tại.' };
        const session = await Session.findOne({ where: { refreshToken } });
        if (!session || session.expiresAt < new Date()) {
            if (session) await session.destroy();
            throw { statusCode: 403, message: 'Token hết hạn.' };
        }
        const accessToken = jwt.sign({ userId: session.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_TTL });
        return { success: true, data: { accessToken } };
    }
}

export default new AuthService();