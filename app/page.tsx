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

  // Демо-товары для поиска
  const demoProducts: Product[] = [
    {
      id: 1,
      name: "Промышленный компрессор",
      price: "450 000 руб.",
      category: "equipment",
      categoryName: "Оборудование",
      description: "Мощный компрессор для производственных нужд. Производительность 1000 л/мин, давление 8 бар.",
      company: "ООО ПромСнаб",
      companyEmail: "contact@promsnab.ru",
      companyPhone: "+7 (495) 111-22-33",
      inStock: true,
      rating: 4.8,
      reviews: 24
    },
    {
      id: 2,
      name: "Станок ЧПУ",
      price: "1 200 000 руб.",
      category: "metalworking",
      categoryName: "Металлообработка",
      description: "Современный станок с ЧПУ для точной обработки металлов. Рабочая зона 1500x800 мм.",
      company: "Завод Станкостроитель",
      companyEmail: "info@zavod-stank.ru",
      companyPhone: "+7 (495) 222-33-44",
      inStock: true,
      rating: 4.9,
      reviews: 18
    },
    {
      id: 3,
      name: "Промышленные подшипники",
      price: "85 000 руб.",
      category: "components",
      categoryName: "Комплектующие",
      description: "Качественные подшипники для промышленного оборудования. Серия 6000-6200.",
      company: "МеталлКомплект",
      companyEmail: "sales@metallkomplekt.ru",
      companyPhone: "+7 (495) 333-44-55",
      inStock: true,
      rating: 4.7,
      reviews: 32
    },
    {
      id: 4,
      name: "Гидравлический пресс",
      price: "320 000 руб.",
      category: "equipment",
      categoryName: "Оборудование",
      description: "Надежный гидравлический пресс для металлообработки. Усилие 50 тонн.",
      company: "ООО ПромСнаб",
      companyEmail: "contact@promsnab.ru",
      companyPhone: "+7 (495) 111-22-33",
      inStock: false,
      rating: 4.6,
      reviews: 15
    },
    {
      id: 5,
      name: "Конвейерная лента",
      price: "150 000 руб.",
      category: "transport",
      categoryName: "Транспортировка",
      description: "Прочная конвейерная лента для производственных линий. Ширина 800 мм.",
      company: "ТрансКонвейер",
      companyEmail: "info@transconveyor.ru",
      companyPhone: "+7 (495) 444-55-66",
      inStock: true,
      rating: 4.5,
      reviews: 9
    },
    {
      id: 6,
      name: "Промышленные датчики",
      price: "45 000 руб.",
      category: "automation",
      categoryName: "Автоматизация",
      description: "Точные датчики для систем автоматизации. Температура, давление, уровень.",
      company: "Автоматика-Про",
      companyEmail: "sales@avtomatika-pro.ru",
      companyPhone: "+7 (495) 555-66-77",
      inStock: true,
      rating: 4.8,
      reviews: 21
    }
  ];

  // Фильтрация товаров
  const filteredProducts = demoProducts.filter(product => {
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

  // Функция для определения категории по названию
  const getCategoryFromName = (name: string): string => {
    if (name.toLowerCase().includes('оборуд')) return 'equipment';
    if (name.toLowerCase().includes('металл')) return 'metalworking';
    if (name.toLowerCase().includes('комплект')) return 'components';
    if (name.toLowerCase().includes('автомат')) return 'automation';
    if (name.toLowerCase().includes('транспорт')) return 'transport';
    return 'all';
  };

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
            <p className="text-xl opacity-90">Более 100+ товаров от проверенных поставщиков</p>
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Например: компрессор, станок, подшипники..."
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
                  <option value="equipment">Оборудование</option>
                  <option value="metalworking">Металлообработка</option>
                  <option value="components">Комплектующие</option>
                  <option value="automation">Автоматизация</option>
                  <option value="transport">Транспортировка</option>
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
                Найдено товаров: <span className="font-semibold">{filteredProducts.length}</span>
                {searchCategory !== 'all' && ` в категории "${demoProducts.find(p => p.category === searchCategory)?.categoryName}"`}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Результаты поиска или основной контент */}
      {showSearchResults && searchTerm ? (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Результаты поиска</h2>
              <p className="text-gray-600 mt-2">
                По запросу: <span className="font-semibold">"{searchTerm}"</span>
                {searchCategory !== 'all' && ` в категории "${demoProducts.find(p => p.category === searchCategory)?.categoryName}"`}
              </p>
            </div>
            <button
              onClick={clearSearch}
              className="text-gray-500 hover:text-gray-700 flex items-center"
              type="button"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Очистить поиск
            </button>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Ничего не найдено</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Попробуйте изменить поисковый запрос или выбрать другую категорию
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={clearSearch}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700"
                  type="button"
                >
                  Показать все товары
                </button>
                <button
                  onClick={() => setSearchCategory('all')}
                  className="border border-green-600 text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50"
                  type="button"
                >
                  Все категории
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                    <div className="h-48 bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center relative">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm">
                          <span className="text-green-600 text-xl">🏭</span>
                        </div>
                        <span className="text-sm text-gray-500">Изображение товара</span>
                      </div>

                      {/* Кнопка избранного */}
                      <button
                        onClick={() => toggleFavorite(product.id)}
                        className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-sm hover:shadow-md"
                        type="button"
                      >
                        <svg
                          className={`w-5 h-5 ${favorites.includes(product.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`}
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>

                      {/* Статус наличия */}
                      <div className={`absolute top-4 left-4 px-2 py-1 rounded text-xs font-medium ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {product.inStock ? 'В наличии' : 'Под заказ'}
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          {product.categoryName}
                        </span>
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="text-yellow-500">★</span>
                          <span className="ml-1">{product.rating}</span>
                          <span className="mx-1">•</span>
                          <span>{product.reviews} отзывов</span>
                        </div>
                      </div>

                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>

                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

                      <div className="flex justify-between items-center mb-2">
                        <span className="text-2xl font-bold text-gray-900">{product.price}</span>
                      </div>

                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm text-gray-500">от {product.company}</span>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => addToCart(product)}
                          className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                          type="button"
                        >
                          В корзину
                        </button>
                        <button
                          onClick={() => contactCompany(product)}
                          className="flex-1 border border-green-600 text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors"
                          type="button"
                        >
                          Связаться
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-12">
                <p className="text-gray-600 mb-4">Хотите добавить свой товар в каталог?</p>
                <a href="/register" className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 inline-block">
                  Зарегистрировать компанию
                </a>
              </div>
            </div>
          )}
        </section>
      ) : (
        /* Основной контент когда поиск не активен */
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Популярные категории</h2>
            <p className="text-lg text-gray-600">Ищите оборудование по категориям</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
            {[
              { name: "Оборудование", icon: "⚙️", count: "24" },
              { name: "Металлообработка", icon: "🔩", count: "18" },
              { name: "Комплектующие", icon: "🔧", count: "32" },
              { name: "Автоматизация", icon: "🤖", count: "15" },
              { name: "Транспортировка", icon: "🚚", count: "9" },
              { name: "Сырье", icon: "⛏️", count: "12" }
            ].map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  setSearchCategory(getCategoryFromName(category.name));
                  setShowSearchResults(true);
                }}
                role="button"
                tabIndex={0}
                onKeyPress={(e: React.KeyboardEvent) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setSearchCategory(getCategoryFromName(category.name));
                    setShowSearchResults(true);
                  }
                }}
              >
                <div className="text-3xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.count} товаров</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Не нашли что искали?</h3>
            <p className="text-gray-600 mb-6">Зарегистрируйте компанию и добавьте свои товары в каталог</p>
            <a href="/register" className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700">
              Начать продавать
            </a>
          </div>
        </section>
      )}

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