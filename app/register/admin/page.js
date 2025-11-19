'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../../components/ProtectedRoute';

export default function CreateAdmin() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    role: 'admin',
    permissions: ['companies', 'products', 'orders', 'users']
  });
  
  const [loading, setLoading] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    setCurrentAdmin(user);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Проверяем пароли
      if (formData.password !== formData.confirmPassword) {
        alert('Пароли не совпадают');
        setLoading(false);
        return;
      }

      // Проверяем, нет ли уже админа с таким email
      const existingAdmins = JSON.parse(localStorage.getItem('admins') || '[]');
      const emailExists = existingAdmins.some(admin => admin.email === formData.email);

      if (emailExists) {
        alert('Администратор с таким email уже существует');
        setLoading(false);
        return;
      }

      // Создаем админа
      const adminData = {
        id: 'admin_' + Date.now(),
        email: formData.email,
        password: btoa(formData.password), // В реальном приложении - хэширование!
        name: formData.name,
        role: 'admin',
        permissions: formData.permissions,
        createdBy: currentAdmin?.id || 'system',
        createdAt: new Date().toISOString(),
        isActive: true
      };

      // Сохраняем админа
      existingAdmins.push(adminData);
      localStorage.setItem('admins', JSON.stringify(existingAdmins));

      alert('✅ Администратор успешно создан!');
      router.push('/dashboard/admin');

    } catch (error) {
      console.error('Admin creation error:', error);
      alert('❌ Ошибка создания администратора');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const togglePermission = (permission) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white shadow rounded-lg">
            {/* Шапка */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Создание администратора</h1>
                  <p className="text-gray-600">Добавьте нового администратора системы</p>
                </div>
                <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                  Только для админов
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Информация о текущем админе */}
              {currentAdmin && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Создает:</strong> {currentAdmin.name} ({currentAdmin.email})
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Имя администратора *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Александр Петров"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="admin@platform.ru"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Пароль *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Не менее 8 символов"
                    required
                    minLength={8}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Подтвердите пароль *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Повторите пароль"
                    required
                  />
                </div>
              </div>

              {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-700 text-sm">Пароли не совпадают</p>
                </div>
              )}

              {/* Права доступа */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Права доступа
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'companies', name: 'Управление компаниями', description: 'Модерация и блокировка компаний' },
                    { id: 'products', name: 'Управление товарами', description: 'Просмотр и удаление товаров' },
                    { id: 'orders', name: 'Просмотр заказов', description: 'Мониторинг всех заказов' },
                    { id: 'users', name: 'Управление пользователями', description: 'Создание администраторов' },
                    { id: 'analytics', name: 'Аналитика', description: 'Доступ к статистике' },
                    { id: 'settings', name: 'Настройки системы', description: 'Изменение настроек платформы' }
                  ].map(permission => (
                    <div
                      key={permission.id}
                      onClick={() => togglePermission(permission.id)}
                      className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                        formData.permissions.includes(permission.id)
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-300 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                          formData.permissions.includes(permission.id)
                            ? 'bg-red-500 border-red-500'
                            : 'border-gray-400'
                        }`}>
                          {formData.permissions.includes(permission.id) && (
                            <span className="text-white text-xs">✓</span>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{permission.name}</div>
                          <div className="text-sm text-gray-500">{permission.description}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Предупреждение */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">⚠️</div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Внимание</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>Новый администратор получит полный доступ к управлению платформой.</p>
                      <p className="mt-1">Убедитесь в надежности сотрудника перед созданием аккаунта.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Кнопки */}
              <div className="flex justify-between pt-6">
                <button
                  type="button"
                  onClick={() => router.push('/dashboard/admin')}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Отмена
                </button>

                <button
                  type="submit"
                  disabled={loading || !formData.email || !formData.password || !formData.name || formData.password !== formData.confirmPassword}
                  className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Создание...' : 'Создать администратора'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}