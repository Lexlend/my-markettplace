'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../../components/ProtectedRoute';

export default function CompanyDashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('catalog');
  const [products, setProducts] = useState([]);
  const [myProducts, setMyProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: ''
  });
  const router = useRouter();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || 'null');
    setUser(userData);
    loadData();
  }, []);

  const loadData = () => {
    const allProducts = JSON.parse(localStorage.getItem('products') || '[]');
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    setProducts(allProducts);
    
    if (user) {
      const myProds = allProducts.filter(p => p.companyId === user.id);
      setMyProducts(myProds);

      const companyOrders = allOrders.filter(o => 
        o.buyerCompanyId === user.id || o.sellerCompanyId === user.id
      );
      setOrders(companyOrders);
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    
    const product = {
      id: 'product_' + Date.now(),
      ...newProduct,
      price: parseFloat(newProduct.price),
      companyId: user.id,
      companyName: user.name,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    const updatedProducts = [...products, product];
    setProducts(updatedProducts);
    setMyProducts([...myProducts, product]);
    localStorage.setItem('products', JSON.stringify(updatedProducts));

    setNewProduct({ name: '', description: '', price: '', category: '' });
    setActiveTab('my-products');
    alert('Товар успешно добавлен!');
  };

  const handleBuyProduct = (product) => {
    if (product.companyId === user.id) {
      alert('Вы не можете купить свой собственный товар');
      return;
    }

    const order = {
      id: 'order_' + Date.now(),
      buyerCompanyId: user.id,
      buyerCompanyName: user.name,
      sellerCompanyId: product.companyId,
      sellerCompanyName: product.companyName,
      products: [{
        productId: product.id,
        name: product.name,
        quantity: 1,
        price: product.price
      }],
      totalAmount: product.price,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const updatedOrders = [...orders, order];
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    alert('Заказ создан! Ожидайте подтверждения от продавца.');
  };

  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
  };

  return (
    <ProtectedRoute requiredRole="company">
      <div className="min-h-screen bg-gray-50">
        {/* Шапка компании */}
        <header className="bg-white shadow-sm border-b border-green-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <div className="bg-green-600 text-white p-2 rounded-lg">
                  <div className="w-8 h-8 flex items-center justify-center font-bold">C</div>
                </div>
                <div className="ml-3">
                  <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
                  <p className="text-sm text-gray-500">Кабинет для покупки и продажи</p>
                </div>
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem('user');
                  router.push('/login');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                Выйти
              </button>
            </div>
          </div>
        </header>

        {/* Навигация компании */}
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
              {[
                { id: 'catalog', name: '🛒 Каталог товаров' },
                { id: 'my-products', name: '📦 Мои товары' },
                { id: 'orders', name: '📋 Мои заказы' },
                { id: 'profile', name: '👤 Профиль' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Контент компании */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Каталог товаров */}
          {activeTab === 'catalog' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Каталог товаров</h2>
                <div className="flex space-x-4">
                  <input
                    type="text"
                    placeholder="Поиск товаров..."
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <select className="px-4 py-2 border border-gray-300 rounded-lg">
                    <option>Все категории</option>
                    <option>Оборудование</option>
                    <option>Материалы</option>
                    <option>Услуги</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.filter(p => p.status === 'active').map(product => (
                  <div key={product.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-2xl font-bold text-green-600">{product.price} ₽</span>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {product.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">
                      Продавец: <span className="font-medium">{product.companyName}</span>
                    </p>
                    <button
                      onClick={() => handleBuyProduct(product)}
                      disabled={product.companyId === user.id}
                      className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      {product.companyId === user.id ? 'Ваш товар' : 'Купить'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Мои товары */}
          {activeTab === 'my-products' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Мои товары</h2>
                <button
                  onClick={() => setActiveTab('add-product')}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  + Добавить товар
                </button>
              </div>

              {/* Форма добавления товара */}
              {activeTab === 'add-product' && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Добавить новый товар</h3>
                    <button
                      onClick={() => setActiveTab('my-products')}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕ Отмена
                    </button>
                  </div>
                  
                  <form onSubmit={handleAddProduct} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Название товара *
                      </label>
                      <input
                        type="text"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Например: Токарный станок ЧПУ"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Описание товара *
                      </label>
                      <textarea
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        rows="3"
                        placeholder="Подробное описание товара, характеристики..."
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Цена (₽) *
                        </label>
                        <input
                          type="number"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="0"
                          min="0"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Категория *
                        </label>
                        <select
                          value={newProduct.category}
                          onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                        >
                          <option value="">Выберите категорию</option>
                          <option value="equipment">Оборудование</option>
                          <option value="metalworking">Металлообработка</option>
                          <option value="materials">Материалы</option>
                          <option value="tools">Инструменты</option>
                          <option value="services">Услуги</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <button
                        type="submit"
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Добавить товар
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('my-products')}
                        className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        Отмена
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Список моих товаров */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myProducts.map(product => (
                  <div key={product.id} className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-green-600">{product.price} ₽</span>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {product.category}
                      </span>
                    </div>
                  </div>
                ))}
                
                {myProducts.length === 0 && (
                  <div className="col-span-3 text-center py-12">
                    <div className="text-6xl mb-4">📦</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">У вас пока нет товаров</h3>
                    <p className="text-gray-600 mb-4">Добавьте первый товар для продажи</p>
                    <button
                      onClick={() => setActiveTab('add-product')}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                    >
                      Добавить товар
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Мои заказы */}
          {activeTab === 'orders' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Мои заказы</h2>
              
              {orders.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <div className="text-6xl mb-4">📋</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Заказов пока нет</h3>
                  <p className="text-gray-600">Начните покупать или продавать товары</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">Заказ #{order.id.slice(-6)}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {order.buyerCompanyId === user.id 
                              ? `🛒 Покупка у: ${order.sellerCompanyName}`
                              : `💰 Продажа для: ${order.buyerCompanyName}`
                            }
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {order.status === 'pending' ? '⏳ Ожидание' :
                           order.status === 'confirmed' ? '✅ Подтвержден' :
                           order.status === 'shipped' ? '🚚 Отправлен' :
                           order.status === 'delivered' ? '📦 Доставлен' : '❌ Отменен'}
                        </span>
                      </div>
                      
                      <div className="mb-4">
                        {order.products.map((item, index) => (
                          <div key={index} className="flex justify-between py-2 border-b">
                            <span className="font-medium">{item.name}</span>
                            <span>{item.quantity} × {item.price} ₽</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex justify-between items-center border-t pt-4">
                        <span className="font-bold text-lg">Итого: {order.totalAmount} ₽</span>
                        
                        {/* Кнопки управления для продавца */}
                        {order.sellerCompanyId === user.id && order.status === 'pending' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => updateOrderStatus(order.id, 'confirmed')}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
                            >
                              Подтвердить
                            </button>
                            <button
                              onClick={() => updateOrderStatus(order.id, 'cancelled')}
                              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
                            >
                              Отклонить
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Профиль компании */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Профиль компании</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Название компании</label>
                  <p className="text-lg font-semibold">{user?.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <p className="text-lg">{user?.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Статус аккаунта</label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    user?.status === 'approved' ? 'bg-green-100 text-green-800' :
                    user?.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {user?.status === 'approved' ? '✅ Активен' :
                     user?.status === 'pending' ? '⏳ На модерации' : '❌ Заблокирован'}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Дата регистрации</label>
                  <p className="text-lg">{user?.registeredAt ? new Date(user.registeredAt).toLocaleDateString() : 'Не указана'}</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}