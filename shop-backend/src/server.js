import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { initDatabase, sequelize } from './libs/db.js';
import './models/index.js';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(express.json());
app.use(cookieParser());

app.use(routes);
app.use(errorHandler);
app.use((req, res) => res.status(404).json({ success: false, message: 'Endpoint không tồn tại.' }));

const seedData = async () => {
    const { User, Product } = await import('./models/index.js');
    const bcrypt = (await import('bcryptjs')).default;

    const adminExists = await User.findOne({ where: { username: 'admin' } });
    if (!adminExists) {
        const hash = await bcrypt.hash('admin123', 10);
        await User.create({
            username: 'admin', email: 'admin@candycore.com',
            fullName: 'Admin Candycore', passwordHash: hash,
            role: 'ADMIN', status: 'ACTIVE'
        });
        console.log('✅ Admin account created  (admin / admin123)');
    }

    const count = await Product.count();
    if (count === 0) {
        await Product.bulkCreate([
            { productName: 'Hello Kitty Plush 30cm', description: 'Gấu bông Hello Kitty siêu mềm, size 30cm', price: 299000, originalPrice: 350000, category: 'plush', character: 'Hello Kitty', stock: 50 },
            { productName: 'Kuromi Backpack', description: 'Balo Kuromi đi học cực xinh', price: 450000, originalPrice: 500000, category: 'accessories', character: 'Kuromi', stock: 30 },
            { productName: 'Cinnamoroll Notebook Set', description: 'Set 3 cuốn sổ tay Cinnamoroll', price: 120000, category: 'stationery', character: 'Cinnamoroll', stock: 100 },
            { productName: 'My Melody Hoodie', description: 'Áo hoodie My Melody màu hồng pastel', price: 380000, originalPrice: 420000, category: 'apparel', character: 'My Melody', stock: 25 },
            { productName: 'Pompompurin Mug', description: 'Cốc sứ Pompompurin 350ml', price: 180000, category: 'homeware', character: 'Pompompurin', stock: 60 },
            { productName: 'Little Twin Stars Keychain', description: 'Móc khóa Little Twin Stars kim tuyến', price: 85000, category: 'accessories', character: 'Little Twin Stars', stock: 200 },
            { productName: 'Keroppi Plush 20cm', description: 'Gấu bông ếch Keroppi dễ thương', price: 220000, originalPrice: 250000, category: 'plush', character: 'Keroppi', stock: 45 },
            { productName: 'Badtz-Maru Sticker Pack', description: 'Pack 50 sticker Badtz-Maru', price: 65000, category: 'stationery', character: 'Badtz-Maru', stock: 150 },
        ]);
        console.log('✅ Sample products seeded (8 sản phẩm)');
    }
};

const start = async () => {
    try {
        await initDatabase();
        await sequelize.sync({ alter: false, force: false });
        console.log('✅ Tables ready');
        await seedData();
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Candycore Shop Backend chạy trên cổng ${PORT}`);
        });
    } catch (err) {
        console.error('❌ Lỗi khởi động:', err.message);
        process.exit(1);
    }
};

start();