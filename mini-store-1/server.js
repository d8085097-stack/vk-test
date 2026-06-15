import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set('strict routing', false);

const PORT = process.env.PORT || 3001;
const COFFEE_DB_PATH = path.join(__dirname, 'coffee.json');

app.use(cors({ origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:5173"] }));
app.use(express.json());

const INITIAL_DATA = [
  {
    id: 1,
    name: 'Эфиопия Йиргачефф',
    price: 850,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=300&fit=crop',
    description: 'Цветочный аромат с нотками жасмина и бергамота. Яркая кислотность.',
    rating: 4.9,
    roastLevel: 'light',
    origin: 'Эфиопия',
    flavor: 'Цветочный, цитрусовый',
  },
  {
    id: 2,
    name: 'Колумбия Супремо',
    price: 750,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop',
    description: 'Сбалансированный вкус с карамельными нотками и средней кислотностью.',
    rating: 4.7,
    roastLevel: 'medium',
    origin: 'Колумбия',
    flavor: 'Карамель, орехи',
  },
  {
    id: 3,
    name: 'Бразилия Сантос',
    price: 680,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1559523182-a4a5f4d1e5d5?w=400&h=300&fit=crop',
    description: 'Мягкий вкус с шоколадными нотками и низкой кислотностью.',
    rating: 4.5,
    roastLevel: 'dark',
    origin: 'Бразилия',
    flavor: 'Шоколад, орехи',
  },
];

const initializeDB = async () => {
  try {
    await fs.access(COFFEE_DB_PATH);
    console.log('✅ База данных найдена:', COFFEE_DB_PATH);
  } catch {
    console.log('📝 Создание новой базы данных...');
    await fs.writeFile(COFFEE_DB_PATH, JSON.stringify(INITIAL_DATA, null, 2), 'utf-8');
    console.log('✅ База данных создана:', COFFEE_DB_PATH);
  }
};

const readDB = async () => {
  try {
    const data = await fs.readFile(COFFEE_DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('❌ Ошибка чтения БД:', error);
    return INITIAL_DATA;
  }
};

const writeDB = async (data) => {
  try {
    await fs.writeFile(COFFEE_DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    console.log('💾 БД успешно обновлена');
    return true;
  } catch (error) {
    console.error('❌ Ошибка записи в БД:', error);
    throw error;
  }
};

// ==================== ROUTES ====================

// ВАЖНО: специфичные роуты (/reset, /stats, /item) должны быть ВЫШЕ параметрического (/:id)

app.get('/api/coffee', async (req, res) => {
  try {
    const coffees = await readDB();
    res.json(coffees);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении данных' });
  }
});

// GET /api/coffee/stats — до /:id, иначе Express поймает "stats" как id
app.get('/api/coffee/stats', async (req, res) => {
  try {
    const coffees = await readDB();
    const stats = {
      totalItems: coffees.length,
      inStock: coffees.filter(c => c.inStock).length,
      outOfStock: coffees.filter(c => !c.inStock).length,
      averageRating: coffees.length > 0
        ? Math.round(coffees.reduce((sum, c) => sum + c.rating, 0) / coffees.length * 10) / 10
        : 0,
      averagePrice: coffees.length > 0
        ? Math.round(coffees.reduce((sum, c) => sum + c.price, 0) / coffees.length)
        : 0,
      roastLevels: {
        light: coffees.filter(c => c.roastLevel === 'light').length,
        medium: coffees.filter(c => c.roastLevel === 'medium').length,
        dark: coffees.filter(c => c.roastLevel === 'dark').length,
      },
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении статистики' });
  }
});

// POST /api/coffee/reset — до /:id, иначе Express поймает "reset" как id
app.post('/api/coffee/reset', async (req, res) => {
  try {
    await writeDB(INITIAL_DATA);
    res.json({
      success: true,
      message: 'База данных сброшена',
      data: INITIAL_DATA,
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при сбросе БД' });
  }
});

// POST /api/coffee/normalize — пересчитать все ID по порядку (1, 2, 3...)
app.post('/api/coffee/normalize', async (req, res) => {
  try {
    const coffees = await readDB();
    const normalized = coffees.map((c, index) => ({ ...c, id: index + 1 }));
    await writeDB(normalized);
    res.json({
      success: true,
      message: `ID пересчитаны для ${normalized.length} записей`,
      data: normalized,
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при нормализации ID' });
  }
});

// POST /api/coffee/item — до /:id
app.post('/api/coffee/item', async (req, res) => {
  try {
    const { name, price, inStock, image, description, rating, roastLevel, origin, flavor } = req.body;

    if (!name || !origin || !flavor) {
      return res.status(400).json({ error: 'Обязательные поля: name, origin, flavor' });
    }

    const coffees = await readDB();
    const maxId = coffees.length > 0 ? Math.max(...coffees.map(c => c.id)) : 0;
    const newCoffee = {
      id: maxId + 1,
      name,
      price: price || 0,
      inStock: inStock !== undefined ? inStock : true,
      image: image || '',
      description: description || '',
      rating: rating || 5,
      roastLevel: roastLevel || 'medium',
      origin,
      flavor,
    };

    coffees.push(newCoffee);
    await writeDB(coffees);

    res.status(201).json({
      success: true,
      message: 'Кофе успешно добавлен',
      data: newCoffee,
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при добавлении кофе' });
  }
});

// POST /api/coffee — сохранить весь массив (импорт)
app.post('/api/coffee', async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({ error: 'Данные должны быть массивом' });
    }

    const validData = req.body.every(item =>
      typeof item === 'object' &&
      item.id &&
      item.name &&
      typeof item.price === 'number'
    );

    if (!validData) {
      return res.status(400).json({ error: 'Некорректная структура данных' });
    }

    await writeDB(req.body);
    res.json({
      success: true,
      message: 'Данные успешно сохранены',
      count: req.body.length,
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при сохранении данных' });
  }
});

app.get('/api/coffee/:id', async (req, res) => {
  try {
    const coffees = await readDB();
    const coffee = coffees.find(c => c.id === parseInt(req.params.id));

    if (!coffee) {
      return res.status(404).json({ error: 'Кофе не найден' });
    }

    res.json(coffee);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении данных' });
  }
});

app.put('/api/coffee/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const coffees = await readDB();
    const index = coffees.findIndex(c => c.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Кофе не найден' });
    }

    coffees[index] = { ...coffees[index], ...req.body, id };
    await writeDB(coffees);

    res.json({
      success: true,
      message: 'Кофе успешно обновлен',
      data: coffees[index],
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при обновлении кофе' });
  }
});

app.delete('/api/coffee/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const coffees = await readDB();
    const filteredCoffees = coffees.filter(c => c.id !== id);

    if (coffees.length === filteredCoffees.length) {
      return res.status(404).json({ error: 'Кофе не найден' });
    }

    await writeDB(filteredCoffees);

    res.json({
      success: true,
      message: 'Кофе успешно удален',
      count: filteredCoffees.length,
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при удалении кофе' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Сервер работает',
    timestamp: new Date().toISOString(),
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Эндпоинт не найден' });
});

app.use((err, req, res, next) => {
  console.error('🔴 Ошибка сервера:', err);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

// ==================== START SERVER ====================

const startServer = async () => {
  try {
    await initializeDB();

    app.listen(PORT, () => {
      console.log('');
      
      console.log('🔧 Admin Panel Server Running 🔧');
      console.log(`📍 Витрина:  http://localhost:3000`);
      console.log(`📍 Админка:  http://localhost:3000/admin`);
      console.log(`📍 API:      http://localhost:3001/api/coffee`);
      console.log('✅ Готово к приему запросов!✅');
      
      console.log('');
      console.log('Доступные эндпоинты:');
      console.log('  GET    /api/coffee           - Получить все кофе');
      console.log('  GET    /api/coffee/stats      - Получить статистику');
      console.log('  GET    /api/coffee/:id        - Получить кофе по ID');
      console.log('  POST   /api/coffee            - Сохранить весь массив');
      console.log('  POST   /api/coffee/item       - Добавить новый кофе');
      console.log('  POST   /api/coffee/reset      - Сброс БД');
      console.log('  PUT    /api/coffee/:id        - Обновить кофе');
      console.log('  DELETE /api/coffee/:id        - Удалить кофе');
      console.log('  GET    /api/health            - Статус сервера');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Ошибка при запуске сервера:', error);
    process.exit(1);
  }
};

startServer();

export default app;