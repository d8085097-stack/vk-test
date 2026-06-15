import { useState, useEffect } from 'react';
import type { CoffeeCardType } from './types';
import './admin-styles.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const ROAST_LABELS: Record<string, string> = {
  light: 'Светлая',
  medium: 'Средняя',
  dark: 'Темная',
};

type Notification = { message: string; type: 'success' | 'error' };

export default function AdminPanel() {
  const [coffees, setCoffees] = useState<CoffeeCardType[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<CoffeeCardType>>({});
  const [jsonView, setJsonView] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchCoffees = async () => {
    try {
      const res = await fetch(`${API_URL}/coffee`);
      if (!res.ok) throw new Error('Ошибка сети');
      const data = await res.json();
      setCoffees(data);
    } catch {
      showNotification('Не удалось загрузить данные с сервера. Проверьте, запущен ли бэкенд!', 'error');
    }
  };

  useEffect(() => {
    fetchCoffees();
  }, []);

  const handleAdd = () => {
    setIsAdding(true);
    setFormData({
      name: '',
      price: 0,
      inStock: true,
      image: '',
      description: '',
      rating: 5,
      roastLevel: 'medium',
      origin: '',
      flavor: '',
    });
  };

  const handleEdit = (coffee: CoffeeCardType) => {
    setEditingId(coffee.id);
    setFormData(coffee);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Удалить этот кофе?')) return;
    try {
      const res = await fetch(`${API_URL}/coffee/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        showNotification(`Ошибка при удалении: ${errData.error || res.statusText}`, 'error');
        return;
      }
      await fetchCoffees();
      showNotification('Кофе успешно удалён');
    } catch {
      showNotification('Не удалось подключиться к серверу', 'error');
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.origin || !formData.flavor) {
      showNotification('Заполните все обязательные поля!', 'error');
      return;
    }

    try {
      const res = isAdding
        ? await fetch(`${API_URL}/coffee/item`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          })
        : await fetch(`${API_URL}/coffee/${editingId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        showNotification(`Ошибка сервера: ${errData.error || res.statusText}`, 'error');
        return;
      }

      await fetchCoffees();
      handleCancel();
      showNotification(isAdding ? 'Кофе успешно добавлен' : 'Кофе успешно обновлён');
    } catch {
      showNotification('Не удалось подключиться к серверу', 'error');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({});
  };

  const handleInputChange = (field: keyof CoffeeCardType, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(coffees, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'coffee_database.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (Array.isArray(data)) {
            const res = await fetch(`${API_URL}/coffee`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data),
            });
            if (res.ok) {
              fetchCoffees();
              showNotification('Данные успешно импортированы!');
            }
          } else {
            showNotification('Неверный формат файла!', 'error');
          }
        } catch {
          showNotification('Ошибка чтения файла!', 'error');
        }
      };
      reader.readAsText(file);
    }
    event.target.value = '';
  };

  const handleReset = async () => {
    if (!window.confirm('Сбросить БД к начальным данным?')) return;
    try {
      const res = await fetch(`${API_URL}/coffee/reset`, { method: 'POST' });
      if (res.ok) {
        fetchCoffees();
        showNotification('БД сброшена!');
      }
    } catch {
      showNotification('Не удалось сбросить БД', 'error');
    }
  };

  const handleNormalize = async () => {
    if (!window.confirm('Пересчитать все ID по порядку (1, 2, 3...)?')) return;
    try {
      const res = await fetch(`${API_URL}/coffee/normalize`, { method: 'POST' });
      if (res.ok) {
        fetchCoffees();
        showNotification('ID успешно пересчитаны!');
      } else {
        showNotification('Ошибка при нормализации ID', 'error');
      }
    } catch {
      showNotification('Не удалось подключиться к серверу', 'error');
    }
  };

  return (
    <div className="admin-container">
      {notification && (
        <div className={`toast toast-${notification.type}`}>
          {notification.message}
        </div>
      )}

      <header className="admin-header">
        <h1>🔧 Админ-панель Coffee House</h1>
        <p>Управление базой данных кофе</p>
      </header>

      <div className="admin-actions">
        <button onClick={handleAdd} className="btn btn-primary">➕ Добавить кофе</button>
        <button onClick={handleExport} className="btn btn-primary">📥 Экспорт JSON</button>
        <label className="btn btn-primary">
          📤 Импорт JSON
          <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
        </label>
        <button onClick={() => setJsonView(!jsonView)} className="btn btn-primary">
          {jsonView ? '📋 Таблица' : '📄 JSON'}
        </button>
        <button onClick={handleReset} className="btn btn-primary">🔄 Сброс БД</button>
        <button onClick={handleNormalize} className="btn btn-primary">🔢 Норм. ID</button>
      </div>

      <div className="stats">
        <div className="stat-card">
          <div className="stat-number">{coffees.length}</div>
          <div className="stat-label">Всего позиций</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{coffees.filter((c) => c.inStock).length}</div>
          <div className="stat-label">В наличии</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {coffees.length > 0
              ? Math.round((coffees.reduce((sum, c) => sum + c.rating, 0) / coffees.length) * 10) / 10
              : 0}
          </div>
          <div className="stat-label">Средний рейтинг</div>
        </div>
      </div>

      {(editingId !== null || isAdding) && (
        <div className="edit-form">
          <h3>{isAdding ? 'Добавление нового кофе' : 'Редактирование'}</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Название *</label>
              <input type="text" value={formData.name || ''} onChange={(e) => handleInputChange('name', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Цена (₽) *</label>
              <input type="number" value={formData.price || 0} onChange={(e) => handleInputChange('price', Number(e.target.value))} />
            </div>
            <div className="form-group">
              <label>Происхождение *</label>
              <input type="text" value={formData.origin || ''} onChange={(e) => handleInputChange('origin', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Обжарка *</label>
              <select value={formData.roastLevel || 'medium'} onChange={(e) => handleInputChange('roastLevel', e.target.value)}>
                <option value="light">Светлая</option>
                <option value="medium">Средняя</option>
                <option value="dark">Темная</option>
              </select>
            </div>
            <div className="form-group">
              <label>Рейтинг (1-5) *</label>
              <input type="number" min="1" max="5" step="0.1" value={formData.rating || 5} onChange={(e) => handleInputChange('rating', Number(e.target.value))} />
            </div>
            <div className="form-group">
              <label>
                <input type="checkbox" checked={formData.inStock || false} onChange={(e) => handleInputChange('inStock', e.target.checked)} /> В наличии
              </label>
            </div>
            <div className="form-group full-width">
              <label>URL изображения</label>
              <input type="text" value={formData.image || ''} onChange={(e) => handleInputChange('image', e.target.value)} />
            </div>
            <div className="form-group full-width">
              <label>Вкусовой профиль *</label>
              <input type="text" value={formData.flavor || ''} onChange={(e) => handleInputChange('flavor', e.target.value)} />
            </div>
            <div className="form-group full-width">
              <label>Описание</label>
              <textarea value={formData.description || ''} onChange={(e) => handleInputChange('description', e.target.value)} rows={3} />
            </div>
          </div>
          <div className="form-actions">
            <button onClick={handleSave} className="btn btn-primary">✅ Сохранить</button>
            <button onClick={handleCancel} className="btn btn-primary">❌ Отмена</button>
          </div>
        </div>
      )}

      {jsonView ? (
        <div className="json-view">
          <h3>JSON База данных</h3>
          <pre>{JSON.stringify(coffees, null, 2)}</pre>
        </div>
      ) : (
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Фото</th>
                <th>Название</th>
                <th>Цена</th>
                <th>Обжарка</th>
                <th>Происхождение</th>
                <th>Рейтинг</th>
                <th>Наличие</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {coffees.map((coffee) => (
                <tr key={coffee.id}>
                  <td>{coffee.id}</td>
                  <td><img src={coffee.image} alt={coffee.name} className="table-img" /></td>
                  <td>
                    <strong>{coffee.name}</strong><br /><small>{coffee.flavor}</small>
                  </td>
                  <td>{coffee.price} ₽</td>
                  <td><span className={`badge badge-${coffee.roastLevel}`}>{ROAST_LABELS[coffee.roastLevel]}</span></td>
                  <td>{coffee.origin}</td>
                  <td>⭐ {coffee.rating}</td>
                  <td><span className={`status ${coffee.inStock ? 'in-stock' : 'out-stock'}`}>{coffee.inStock ? '✓ Есть' : '✗ Нет'}</span></td>
                  <td>
                    <div className="action-buttons">
                      <button onClick={() => handleEdit(coffee)} className="btn-icon btn-edit" title="Редактировать">✏️</button>
                      <button onClick={() => handleDelete(coffee.id)} className="btn-icon btn-delete" title="Удалить">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}