'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      router.push('/login');
      return;
    }
    
    const userData = JSON.parse(savedUser);
    if (userData.role !== 'admin') {
      router.push('/');
      return;
    }
    
    setUser(userData);
  }, [router]);

  if (!user) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Загрузка...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="bg-red-600 text-white p-2 rounded-lg">
                <div className="w-8 h-8 flex items-center justify-center font-bold">A</div>
              </div>
              <div className="ml-3">
                <h1 className="text-2xl font-bold text-gray-900">Админ-панель</h1>
                <p className="text-sm text-gray-500">LogProm-Grup</p>
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
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Панель администратора</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <p className="text-sm text-green-600 font-medium">Компаний</p>
              <p className="text-2xl font-bold text-gray-900">15</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-sm text-blue-600 font-medium">Товаров</p>
              <p className="text-2xl font-bold text-gray-900">127</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <p className="text-sm text-yellow-600 font-medium">На модерации</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <p className="text-sm text-purple-600 font-medium">Активных</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Быстрые действия</h3>
            <div className="flex space-x-4">
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700">
                Просмотреть компании
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700">
                Модерировать товары
              </button>
              <button className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700">
                Настройки системы
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}