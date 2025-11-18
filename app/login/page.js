'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const router = useRouter();

  // Тестовые пользователи
  const users = {
    'admin@logprom.ru': { password: 'admin123', role: 'admin', name: 'Администратор' },
    'company1@mail.ru': { password: 'company123', role: 'company', name: 'ООО ПромСнаб' },
    'company2@mail.ru': { password: 'company123', role: 'company', name: 'Завод Станкостроитель' }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    
    const user = users[formData.email];
    if (user && user.password === formData.password) {
      localStorage.setItem('user', JSON.stringify({
        email: formData.email,
        name: user.name,
        role: user.role
      }));
      alert(`Добро пожаловать, ${user.name}!`);
      
      // Редирект в нужный кабинет
      if (user.role === 'admin') {
        router.push('/dashboard/admin');
      } else {
        router.push('/dashboard/company');
      }
    } else {
      alert('Неверный email или пароль');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-3xl font-bold text-center mb-8">Вход в систему</h2>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="admin@logprom.ru"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Пароль</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Пароль"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
            >
              Войти
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Тестовые аккаунты:</h3>
            <p className="text-sm"><strong>Админ:</strong> admin@logprom.ru / admin123</p>
            <p className="text-sm"><strong>Компания 1:</strong> company1@mail.ru / company123</p>
            <p className="text-sm"><strong>Компания 2:</strong> company2@mail.ru / company123</p>
          </div>
        </div>
      </div>
    </div>
  );
}