import productService from '../services/productService.js';

export const getAll = async (req, res, next) => {
    try {
        const { limit, offset, search, category, character } = req.query;
        const result = await productService.getAll({
            limit: limit ? parseInt(limit) : 20,
            offset: offset ? parseInt(offset) : 0,
            search, category, character
        });
        res.json(result);
    } catch (e) { next(e); }
};

export const getById = async (req, res, next) => {
    try {
        const result = await productService.getById(req.params.id);
        res.json(result);
    } catch (e) { next(e); }
};

export const create = async (req, res, next) => {
    try {
        const result = await productService.create(req.body);
        res.status(201).json(result);
    } catch (e) { next(e); }
};

export const update = async (req, res, next) => {
    try {
        const result = await productService.update(req.params.id, req.body);
        res.json(result);
    } catch (e) { next(e); }
};

export const remove = async (req, res, next) => {
    try {
        const result = await productService.delete(req.params.id);
        res.json(result);
    } catch (e) { next(e); }
};