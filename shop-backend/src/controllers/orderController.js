import orderService from '../services/orderService.js';

export const createOrder = async (req, res, next) => {
    try {
        const result = await orderService.createOrder(req.user.userId, req.body);
        res.status(201).json(result);
    } catch (e) { next(e); }
};

export const getMyOrders = async (req, res, next) => {
    try {
        const result = await orderService.getUserOrders(req.user.userId);
        res.json(result);
    } catch (e) { next(e); }
};

export const getAllOrders = async (req, res, next) => {
    try {
        const result = await orderService.getAllOrders(req.query);
        res.json(result);
    } catch (e) { next(e); }
};

export const updateOrderStatus = async (req, res, next) => {
    try {
        const result = await orderService.updateStatus(req.params.id, req.body.status);
        res.json(result);
    } catch (e) { next(e); }
};


