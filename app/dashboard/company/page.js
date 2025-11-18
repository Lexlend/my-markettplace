'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CompanyDashboard() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('products');
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      router.push('/login');
      return;
    }
    
    const userData = JSON.parse(savedUser);
    if (userData.role !== 'company') {
      router.push('/');
      return;
    }
    
    setUser(userData);
    
    // Загружаем товары компании из localStorage
    const savedProducts = localStorage.getItem(`products_${userData.email}`);
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
  }, [router]);

  const addProduct = (newProduct) => {
    if (!user) return;
    
    const updatedProducts = [...products, { ...newProduct, id: Date.now() }];
    setProducts(updatedProducts);
    localStorage.setItem(`products_${user.email}`, JSON.stringify(updatedProducts));
  };

  const removeProduct = (productId) => {
    if (!user) return;
    
    const updatedProducts = products.filter(p => p.id !== productId);
    setProducts(updatedProducts);
    localStorage.setItem(`products_${user.email}`, JSON.stringify(updatedProducts));
  };

  if (!user) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Загрузка...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <div className="w-8 h-8 flex items-center justify-center font-bold">C</div>
              </div>
              <div className="ml-3">
                <h1 className="text-2xl font-bold text-gray-900">Личный кабинет</h1>
                <p className="text-sm text-gray-500">{user.name}</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <a href="/" className="text-gray-700 hover:text-green-600 font-medium">На сайт</a>
              <button 
                onClick={() => {
                  localStorage.removeItem('user');
                  router.push('/');
                }}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Навигация */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'products', name: '🛒 Мои товары' },
              { id: 'add', name: '➕ Добавить товар' },
              { id: 'stats', name: '📊 Статистика' },
              { id: 'profile', name: '⚙️ Профиль' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Содержимое */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          {/* Мои товары */}
          {activeTab === 'products' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Мои товары</h2>
              {products.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">📦</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">У вас пока нет товаров</h3>
                  <button 
                    onClick={() => setActiveTab('add')}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700"
                  >
                    Добавить первый товар
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {products.map((product) => (
                    <div key={product.id} className="border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                      <p className="text-2xl font-bold text-gray-900 mb-3">{product.price}</p>
                      <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                      <div className="flex space-x-2">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
                          Редактировать
                        </button>
                        <button 
                          onClick={() => removeProduct(product.id)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700"
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Добавить товар */}
          {activeTab === 'add' && (
            <AddProductForm onAddProduct={addProduct} />
          )}

          {/* Статистика */}
          {activeTab === 'stats' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Статистика</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <p className="text-sm text-green-600 font-medium">Всего товаров</p>
                  <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <p className="text-sm text-blue-600 font-medium">Просмотры</p>
                  <p className="text-2xl font-bold text-gray-900">1,234</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <p className="text-sm text-purple-600 font-medium">Запросы</p>
                  <p className="text-2xl font-bold text-gray-900">45</p>
                </div>
              </div>
            </div>
          )}

          {/* Профиль */}
          {activeTab === 'profile' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Профиль компании</h2>
              <div className="max-w-2xl">
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Информация</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">Название:</span>
                      <p className="font-medium">{user.name}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Email:</span>
                      <p className="font-medium">{user.email}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Статус:</span>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded ml-2">
                        Активна
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Компонент формы добавления товара
function AddProductForm({ onAddProduct }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'equipment'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.price) {
      onAddProduct(formData);
      setFormData({ name: '', description: '', price: '', category: 'equipment' });
      alert('Товар успешно добавлен!');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Добавить товар</h2>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Название товара *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Например: Промышленный компрессор"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Описание
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Подробное описание товара..."
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Цена *
            </label>
            <input
              type="text"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="450 000 руб."
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Категория
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="equipment">Оборудование</option>
              <option value="metalworking">Металлообработка</option>
              <option value="components">Комплектующие</option>
              <option value="automation">Автоматизация</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700"
        >
          Добавить товар
        </button>
      </form>
    </div>
  );
}