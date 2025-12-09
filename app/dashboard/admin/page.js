'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../../components/ProtectedRoute';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('companies');
  const [companies, setCompanies] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const companiesData = JSON.parse(localStorage.getItem('companies') || '[]');
    const productsData = JSON.parse(localStorage.getItem('products') || '[]');
    const ordersData = JSON.parse(localStorage.getItem('orders') || '[]');

    setCompanies(companiesData);
    setProducts(productsData);
    setOrders(ordersData);

    setStats({
      totalCompanies: companiesData.length,
      pendingCompanies: companiesData.filter(c => c.status === 'pending').length,
      activeProducts: productsData.filter(p => p.status === 'active').length,
      totalOrders: ordersData.length,
      pendingOrders: ordersData.filter(o => o.status === 'pending').length
    });
  };

  const handleApproveCompany = (companyId) => {
    const updatedCompanies = companies.map(company =>
      company.id === companyId ? { ...company, status: 'approved' } : company
    );
    setCompanies(updatedCompanies);
    localStorage.setItem('companies', JSON.stringify(updatedCompanies));
    loadData();
  };

  const handleRejectCompany = (companyId) => {
    const updatedCompanies = companies.map(company =>
      company.id === companyId ? { ...company, status: 'rejected' } : company
    );
    setCompanies(updatedCompanies);
    localStorage.setItem('companies', JSON.stringify(updatedCompanies));
    loadData();
  };

  const handleBlockCompany = (companyId) => {
    const updatedCompanies = companies.map(company =>
      company.id === companyId ? { ...company, status: 'blocked' } : company
    );
    setCompanies(updatedCompanies);
    localStorage.setItem('companies', JSON.stringify(updatedCompanies));
    loadData();
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gray-50">
        {/* Шапка админа */}
        <header className="bg-white shadow-sm border-b border-red-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <div className="bg-red-600 text-white p-2 rounded-lg">
                  <div className="w-8 h-8 flex items-center justify-center font-bold">A</div>
                </div>
                <div className="ml-3">
                  <h1 className="text-2xl font-bold text-gray-900">Панель администратора</h1>
                  <p className="text-sm text-gray-500">Управление B2B платформой</p>
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

        {/* Навигация админа */}
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
              {[
                { id: 'dashboard', name: '📊 Дашборд', badge: null },
                { id: 'companies', name: '🏢 Компании', badge: stats.pendingCompanies },
                { id: 'products', name: '📦 Товары', badge: null },
                { id: 'orders', name: '📋 Заказы', badge: stats.pendingOrders }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span>{tab.name}</span>
                  {tab.badge > 0 && (
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs">
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Контент админа */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Дашборд админа */}
          {activeTab === 'dashboard' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Общая статистика</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                  <h3 className="text-lg font-semibold text-gray-900">Компании</h3>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalCompanies}</p>
                  <p className="text-sm text-gray-500">
                    {stats.pendingCompanies} на модерации
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                  <h3 className="text-lg font-semibold text-gray-900">Товары</h3>
                  <p className="text-3xl font-bold text-gray-900">{stats.activeProducts}</p>
                  <p className="text-sm text-gray-500">активных товаров</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
                  <h3 className="text-lg font-semibold text-gray-900">Заказы</h3>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
                  <p className="text-sm text-gray-500">
                    {stats.pendingOrders} ожидают
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
                  <h3 className="text-lg font-semibold text-gray-900">Платформа</h3>
                  <p className="text-3xl font-bold text-gray-900">B2B</p>
                  <p className="text-sm text-gray-500">торговая площадка</p>
                </div>
              </div>

              {/* Быстрые действия */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Быстрые действия</h3>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setActiveTab('companies')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Модерация компаний
                  </button>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Просмотр заказов
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Управление компаниями - содержимое такое же как в предыдущем примере */}
          {/* ... остальной код админ-панели ... */}
          
        </main>
      </div>
    </ProtectedRoute>
  );
}