import authService from '../services/authService.js';

export const signUp = async (req, res, next) => {
    try {
        const result = await authService.signUp(req.body);
        res.status(201).json(result);
    } catch (e) { next(e); }
};

export const signIn = async (req, res, next) => {
    try {
        const result = await authService.signIn(req.body);
        if (result.data.refreshToken) {
            res.cookie('refreshToken', result.data.refreshToken, {
                httpOnly: true, secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax', maxAge: 14 * 24 * 60 * 60 * 1000
            });
        }
        const { refreshToken, ...responseData } = result.data;
        res.status(200).json({ success: result.success, message: result.message, data: responseData });
    } catch (e) { next(e); }
};

export const signOut = async (req, res, next) => {
    try {
        await authService.signOut(req.cookies?.refreshToken);
        res.clearCookie('refreshToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });
        res.status(200).json({ success: true, message: 'Đã đăng xuất.' });
    } catch (e) { next(e); }
};

export const refreshToken = async (req, res, next) => {
    try {
        const result = await authService.refreshToken(req.cookies?.refreshToken);
        res.status(200).json(result);
    } catch (e) { next(e); }
};

export const getMe = async (req, res) => {
    res.json({ success: true, data: req.user });
};

