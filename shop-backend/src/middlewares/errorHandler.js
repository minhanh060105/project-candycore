export const errorHandler = (err, req, res, next) => {
    const status = err.statusCode || 500;
    const message = err.message || 'Lỗi máy chủ nội bộ.';
    console.error(`❌ [${status}] ${message}`);
    res.status(status).json({ success: false, message, data: err.data || null });
};
