// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategory, setSearchCategory] = useState('all');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const router = useRouter();

  // Категории для поиска
  const categories = [
    { id: 'equipment', name: 'Оборудование', icon: '⚙️', count: '0' },
    { id: 'metalworking', name: 'Металлообработка', icon: '🔩', count: '0' },
    { id: 'components', name: 'Комплектующие', icon: '🔧', count: '0' },
    { id: 'automation', name: 'Автоматизация', icon: '🤖', count: '0' },
    { id: 'transport', name: 'Транспортировка', icon: '🚚', count: '0' },
    { id: 'raw', name: 'Сырье и материалы', icon: '⛏️', count: '0' }
  ];

  // Проверяем авторизацию при загрузке
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      
      if (userData.role === 'admin') {
        router.push('/dashboard/admin');
      } else if (userData.role === 'company') {
        router.push('/dashboard/company');
      }
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setShowSearchResults(true);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchCategory('all');
    setShowSearchResults(false);
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

              {/* Кнопка Войти/Выйти */}
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">Привет, {user.name}</span>
                  <button 
                    onClick={handleLogout}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700"
                  >
                    Выйти
                  </button>
                </div>
              ) : (
                <a href="/login" className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700">
                  Войти
                </a>
              )}
            </nav>
          </div>
        </div>
      </header>

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
            <p>© 2025 LogProm-Grup. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}