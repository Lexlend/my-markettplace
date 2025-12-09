'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CompanyRegistration() {
  const [formData, setFormData] = useState({
    // Основная информация
    companyName: '',
    legalName: '',
    taxId: '', // ИНН
    companyEmail: '',
    companyPhone: '',
    
    // Контактное лицо
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    position: '',
    
    // Пароль
    password: '',
    confirmPassword: '',
    
    // Деятельность
    category: '',
    description: '',
    address: '',
    website: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateStep1 = () => {
    const { companyName, legalName, taxId, companyEmail, companyPhone } = formData;
    return companyName && legalName && taxId && companyEmail && companyPhone;
  };

  const validateStep2 = () => {
    const { contactPerson, contactEmail, contactPhone, position } = formData;
    return contactPerson && contactEmail && contactPhone && position;
  };

  const validateStep3 = () => {
    const { password, confirmPassword, category } = formData;
    return password && confirmPassword && category && password === confirmPassword;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Проверяем, нет ли уже компании с таким email или ИНН
      const existingCompanies = JSON.parse(localStorage.getItem('companies') || '[]');
      
      const emailExists = existingCompanies.some(company => 
        company.email === formData.companyEmail || company.contactEmail === formData.contactEmail
      );
      
      const taxIdExists = existingCompanies.some(company => 
        company.taxId === formData.taxId
      );

      if (emailExists) {
        alert('Компания с таким email уже зарегистрирована');
        setLoading(false);
        return;
      }

      if (taxIdExists) {
        alert('Компания с таким ИНН уже зарегистрирована');
        setLoading(false);
        return;
      }

      // Создаем объект компании
      const companyData = {
        id: 'company_' + Date.now(),
        
        // Основная информация
        name: formData.companyName,
        legalName: formData.legalName,
        taxId: formData.taxId,
        email: formData.companyEmail,
        phone: formData.companyPhone,
        
        // Контактное лицо
        contactPerson: formData.contactPerson,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        contactPosition: formData.position,
        
        // Пароль (в реальном приложении нужно хэшировать!)
        password: btoa(formData.password), // Простое кодирование для демо
        
        // Деятельность
        category: formData.category,
        description: formData.description,
        address: formData.address,
        website: formData.website,
        
        // Системные поля
        role: 'company',
        status: 'pending', // На модерации
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Сохраняем компанию
      existingCompanies.push(companyData);
      localStorage.setItem('companies', JSON.stringify(existingCompanies));

      // Создаем пользовательскую сессию
      const userData = {
        id: companyData.id,
        email: companyData.email,
        name: companyData.name,
        role: 'company',
        status: 'pending'
      };
      localStorage.setItem('user', JSON.stringify(userData));

      alert('✅ Регистрация успешна! Ваша компания отправлена на модерацию.');
      router.push('/dashboard/company');

    } catch (error) {
      console.error('Registration error:', error);
      alert('❌ Ошибка регистрации. Попробуйте еще раз.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          {/* Шапка */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Регистрация компании</h1>
                <p className="text-gray-600">Заполните информацию о вашей компании</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Шаг {step} из 3</span>
                <div className="flex space-x-1">
                  {[1, 2, 3].map((s) => (
                    <div
                      key={s}
                      className={`w-3 h-3 rounded-full ${
                        s === step ? 'bg-green-600' : s < step ? 'bg-green-300' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Прогресс */}
          <div className="px-6 py-4 bg-gray-50 border-b">
            <div className="flex justify-between text-sm font-medium">
              <span className={step >= 1 ? 'text-green-600' : 'text-gray-500'}>
                1. Основная информация
              </span>
              <span className={step >= 2 ? 'text-green-600' : 'text-gray-500'}>
                2. Контактное лицо
              </span>
              <span className={step >= 3 ? 'text-green-600' : 'text-gray-500'}>
                3. Пароль и деятельность
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="p-6">
              {/* Шаг 1: Основная информация */}
              {step === 1 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Основная информация о компании</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Название компании *
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="ООО 'Ромашка'"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Юридическое название *
                      </label>
                      <input
                        type="text"
                        name="legalName"
                        value={formData.legalName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Общество с ограниченной ответственностью 'Ромашка'"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ИНН *
                      </label>
                      <input
                        type="text"
                        name="taxId"
                        value={formData.taxId}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="1234567890"
                        required
                        pattern="[0-9]{10,12}"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Телефон компании *
                      </label>
                      <input
                        type="tel"
                        name="companyPhone"
                        value={formData.companyPhone}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="+7 (999) 123-45-67"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email компании *
                    </label>
                    <input
                      type="email"
                      name="companyEmail"
                      value={formData.companyEmail}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="company@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Юридический адрес
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="г. Москва, ул. Примерная, д. 1"
                    />
                  </div>
                </div>
              )}

              {/* Шаг 2: Контактное лицо */}
              {step === 2 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Контактное лицо</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ФИО контактного лица *
                      </label>
                      <input
                        type="text"
                        name="contactPerson"
                        value={formData.contactPerson}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Иванов Иван Иванович"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Должность *
                      </label>
                      <input
                        type="text"
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Директор"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email контактного лица *
                      </label>
                      <input
                        type="email"
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="ivanov@example.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Телефон контактного лица *
                      </label>
                      <input
                        type="tel"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="+7 (999) 123-45-67"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Шаг 3: Пароль и деятельность */}
              {step === 3 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Пароль и деятельность</h3>
                  
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Категория деятельности *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="">Выберите категорию</option>
                      <option value="metalworking">Металлообработка</option>
                      <option value="equipment">Промышленное оборудование</option>
                      <option value="materials">Сырье и материалы</option>
                      <option value="tools">Инструменты и оснастка</option>
                      <option value="components">Комплектующие</option>
                      <option value="services">Промышленные услуги</option>
                      <option value="automation">Автоматизация</option>
                      <option value="transport">Транспорт и логистика</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Описание деятельности
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Опишите основную деятельность вашей компании..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Веб-сайт
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Кнопки навигации */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
              <div>
                {step > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    Назад
                  </button>
                )}
              </div>

              <div className="flex space-x-3">
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={
                      (step === 1 && !validateStep1()) ||
                      (step === 2 && !validateStep2())
                    }
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Далее
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!validateStep3() || loading}
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Регистрация...' : 'Зарегистрировать компанию'}
                  </button>
                )}
              </div>
            </div>
          </form>

          <div className="px-6 py-4 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Уже есть аккаунт?{' '}
              <Link href="/login" className="font-medium text-green-600 hover:text-green-500">
                Войдите в систему
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}