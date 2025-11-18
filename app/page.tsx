'use client';

import { useState } from 'react';

// Типы для TypeScript
interface Product {
  id: number;
  name: string;
  price: string;
  category: string;
  categoryName: string;
  description: string;
  company: string;
  companyEmail: string;
  companyPhone: string;
  inStock: boolean;
  rating: number;
  reviews: number;
}

interface CartItem extends Product {
  cartId: number;
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchCategory, setSearchCategory] = useState<string>('all');
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showCart, setShowCart] = useState<boolean>(false);
  const [activeCompany, setActiveCompany] = useState<Product | null>(null);
  const [showContactForm, setShowContactForm] = useState<boolean>(false);

  // Категории для поиска
  const categories = [
    { id: 'equipment', name: 'Оборудование', icon: '⚙️', count: '0' },
    { id: 'metalworking', name: 'Металлообработка', icon: '🔩', count: '0' },
    { id: 'components', name: 'Комплектующие', icon: '🔧', count: '0' },
    { id: 'automation', name: 'Автоматизация', icon: '🤖', count: '0' },
    { id: 'transport', name: 'Транспортировка', icon: '🚚', count: '0' },
    { id: 'raw', name: 'Сырье и материалы', icon: '⛏️', count: '0' }
  ];

  // Пустой массив товаров - будут добавляться компаниями
  const products: Product[] = [];

  // Фильтрация товаров (пока всегда пустая)
  const filteredProducts = products.filter(product => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term) ||
      product.company.toLowerCase().includes(term);

    const matchesCategory = searchCategory === 'all' || product.category === searchCategory;

    return matchesSearch && matchesCategory;
  });

  // Поиск
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setShowSearchResults(true);
    }
  };

  // Очистка поиска
  const clearSearch = () => {
    setSearchTerm('');
    setSearchCategory('all');
    setShowSearchResults(false);
  };

  // Добавление в корзину
  const addToCart = (product: Product) => {
    setCart(prev => [...prev, { ...product, cartId: Date.now() }]);
    alert(`Товар "${product.name}" добавлен в корзину!`);
  };

  // Удаление из корзины
  const removeFromCart = (cartId: number) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  // Очистка корзины
  const clearCart = () => {
    setCart([]);
    setShowCart(false);
  };

  // Добавление в избранное
  const toggleFavorite = (productId: number) => {
    if (favorites.includes(productId)) {
      setFavorites(prev => prev.filter(id => id !== productId));
    } else {
      setFavorites(prev => [...prev, productId]);
    }
  };

  // Контакт с компанией
  const contactCompany = (company: Product) => {
    setActiveCompany(company);
    setShowContactForm(true);
  };

  // Отправка сообщения
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const message = formData.get('message') as string;
    const phone = formData.get('phone') as string;

    alert(
      `Сообщение отправлено компании "${activeCompany?.company}"!\n\nТелефон: ${phone}\nСообщение: ${message}\n\nМы свяжемся с вами в ближайшее время.`
    );
    setShowContactForm(false);
    setActiveCompany(null);
  };

  // Общая стоимость корзины
  const cartTotal = cart.reduce((total, item) => {
    const priceStr = item.price.replace(/\D/g, '');
    const price = parseInt(priceStr || '0', 10);
    return total + price;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Шапка */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="bg-green-600 text-white p-2 rounded-lg">
                <div className="w-8 h-8 flex items-center justify-center font-bold">LG</div>
              </div>
              <div className="ml-3">
                <h1 className="text-2xl font-bold text-gray-900">LogProm-Grup</h1>
                <p className="text-sm text-gray-500">Промышленная B2B площадка</p>
              </div>
            </div>

            <nav className="flex items-center space-x-6">
              <a href="/" className="text-gray-700 hover:text-green-600 font-medium">Главная</a>
              <a href="/about" className="text-gray-700 hover:text-green-600 font-medium">О компании</a>
              <a href="/suppliers" className="text-gray-700 hover:text-green-600 font-medium">Для поставщиков</a>

              {/* Корзина */}
              <button
                onClick={() => setShowCart(true)}
                className="relative text-gray-700 hover:text-green-600"
                type="button"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>

              {/* Избранное */}
              <button
                className="relative text-gray-700 hover:text-green-600"
                type="button"
                onClick={() => { /* можно показать список избранного */ }}
              >
                <svg 
                  className="w-6 h-6" 
                  fill={favorites.length > 0 ? "currentColor" : "none"} 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {favorites.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </button>

              <a href="/register" className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700">
                Регистрация
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Корзина (сайдбар) */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Корзина</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-gray-400 hover:text-gray-600"
                  type="button"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">🛒</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Корзина пуста</h3>
                  <p className="text-gray-600">Добавьте товары из каталога</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.cartId} className="flex items-center space-x-4 border-b pb-4">
                        <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
                          <span className="text-green-600">📦</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{item.name}</h4>
                          <p className="text-green-600 font-bold">{item.price}</p>
                          <p className="text-sm text-gray-500">{item.company}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.cartId)}
                          className="text-red-500 hover:text-red-700"
                          type="button"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold">Итого:</span>
                      <span className="text-2xl font-bold text-green-600">
                        {cartTotal.toLocaleString()} руб.
                      </span>
                    </div>

                    <div className="space-y-3">
                      <button
                        onClick={() => alert('Функция оформления заказа в разработке!')}
                        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
                        type="button"
                      >
                        Оформить заказ
                      </button>
                      <button 
                        onClick={clearCart}
                        className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50"
                        type="button"
                      >
                        Очистить корзину
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Форма обратной связи */}
      {showContactForm && activeCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Связаться с {activeCompany.company}
            </h3>

            <form onSubmit={sendMessage} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ваш телефон *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="+7 (XXX) XXX-XX-XX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Сообщение *
                </label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Опишите ваш запрос..."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
                >
                  Отправить
                </button>
                <button
                  type="button"
                  onClick={() => setShowContactForm(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Поисковая секция */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-4">Найдите промышленное оборудование</h2>
            <p className="text-xl opacity-90">Площадка для B2B сотрудничества промышленных предприятий</p>
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Начните вводить название товара или компании..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-6 py-4 pl-12 text-gray-900 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="sm:w-64">
                <select 
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="w-full px-4 py-4 text-gray-900 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">Все категории</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 whitespace-nowrap"
              >
                Найти
              </button>
            </div>
          </form>

          {searchTerm && (
            <div className="text-center mt-4">
              <p className="text-green-100">
                Товары появятся после регистрации компаний-поставщиков
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Основной контент - только категории */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Категории оборудования</h2>
          <p className="text-lg text-gray-600">Выберите категорию для просмотра товаров</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => {
                setSearchCategory(category.id);
                setShowSearchResults(true);
              }}
              role="button"
              tabIndex={0}
              onKeyPress={(e: React.KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setSearchCategory(category.id);
                  setShowSearchResults(true);
                }
              }}
            >
              <div className="text-3xl mb-3">{category.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
              <p className="text-sm text-gray-500">Пока нет товаров</p>
            </div>
          ))}
        </div>

        {/* Сообщение когда нет товаров в поиске */}
        {showSearchResults && (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <div className="text-gray-400 text-6xl mb-4">🏭</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Товары пока не добавлены</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Эта категория будет заполнена после регистрации компаний-поставщиков
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={clearSearch}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700"
                type="button"
              >
                Вернуться к категориям
              </button>
            </div>
          </div>
        )}

        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Хотите добавить свои товары?</h3>
          <p className="text-gray-600 mb-6">Зарегистрируйте компанию и начните продавать на нашей площадке</p>
          <a href="/register" className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700">
            Начать продавать
          </a>
        </div>
      </section>

      {/* Футер */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">LogProm-Grup</h3>
              <p className="text-gray-400">Закрытая B2B площадка для промышленных предприятий</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Компания</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/about" className="hover:text-white">О нас</a></li>
                <li><a href="/suppliers" className="hover:text-white">Для поставщиков</a></li>
                <li><a href="#" className="hover:text-white">Контакты</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Помощь</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Поддержка</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
                <li><a href="#" className="hover:text-white">Правила</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <ul className="space-y-2 text-gray-400">
                <li>+7 (495) 123-45-67</li>
                <li>info@logprom-grup.ru</li>
                <li>Москва, ул. Промышленная, 15</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>© 2024 LogProm-Grup. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}