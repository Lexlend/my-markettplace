'use client';

import { useState } from 'react';

export default function Register() {
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    phone: '',
    industry: '',
    employeeCount: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Заявка на регистрацию отправлена! Мы свяжемся с вами для подтверждения.');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Регистрация компании</h1>
            <p className="text-gray-600">Только для промышленных организаций</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Название промышленного предприятия *
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="ООО 'ПромСнаб'"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="contact@company.ru"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Телефон *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="+7 (XXX) XXX-XX-XX"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Отрасль промышленности *
                </label>
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Выберите отрасль</option>
                  <option value="metal">Металлургия</option>
                  <option value="machine">Машиностроение</option>
                  <option value="chemical">Химическая промышленность</option>
                  <option value="energy">Энергетика</option>
                  <option value="construction">Строительные материалы</option>
                  <option value="mining">Горнодобывающая</option>
                  <option value="other">Другое</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Количество сотрудников *
                </label>
                <select
                  name="employeeCount"
                  value={formData.employeeCount}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Выберите количество</option>
                  <option value="1-50">1-50</option>
                  <option value="51-200">51-200</option>
                  <option value="201-500">201-500</option>
                  <option value="500+">500+</option>
                </select>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                <strong>Важно:</strong> Регистрация доступна только для промышленных предприятий. 
                После подачи заявки мы свяжемся с вами для подтверждения и активации аккаунта.
              </p>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                required
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <label className="ml-2 text-sm text-gray-600">
                Подтверждаю что наша компания является промышленным предприятием
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Подать заявку на регистрацию
            </button>

            <p className="text-center text-sm text-gray-600">
              Уже есть аккаунт? <a href="#" className="text-green-600 hover:underline">Войти</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}