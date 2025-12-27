// @ts-nocheck
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CompanyRegistration() {
  const [formData, setFormData] = useState({
    companyName: '',
    legalName: '',
    taxId: '',
    companyEmail: '',
    companyPhone: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    position: '',
    password: '',
    confirmPassword: '',
    category: '',
    description: '',
    address: '',
    website: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const checkStep1 = () => {
    const { companyName, legalName, taxId, companyEmail, companyPhone } = formData;
    return companyName.trim() !== '' && 
           legalName.trim() !== '' && 
           taxId.trim().length >= 10 && 
           companyEmail.includes('@') && 
           companyPhone.trim() !== '';
  };

  const checkStep2 = () => {
    const { contactPerson, contactEmail, contactPhone, position } = formData;
    return contactPerson.trim() !== '' && 
           contactEmail.includes('@') && 
           contactPhone.trim() !== '' && 
           position.trim() !== '';
  };

  const checkStep3 = () => {
    const { password, confirmPassword, category } = formData;
    return password.length >= 8 && 
           password === confirmPassword && 
           category !== '';
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!checkStep3()) return;
    
    setLoading(true);
    setErrorMessage('');

    try {
      const savedCompaniesStr = localStorage.getItem('companies');
      const savedCompanies = savedCompaniesStr ? JSON.parse(savedCompaniesStr) : [];
      
      const emailUsed = savedCompanies.some(company => 
        company.email === formData.companyEmail || company.contactEmail === formData.contactEmail
      );
      
      if (emailUsed) {
        setErrorMessage('Этот email уже используется');
        setLoading(false);
        return;
      }

      const taxUsed = savedCompanies.some(company => company.taxId === formData.taxId);
      if (taxUsed) {
        setErrorMessage('Этот ИНН уже зарегистрирован');
        setLoading(false);
        return;
      }

      const newCompany = {
        id: 'company_' + Date.now(),
        name: formData.companyName,
        legalName: formData.legalName,
        taxId: formData.taxId,
        email: formData.companyEmail,
        phone: formData.companyPhone,
        contactPerson: formData.contactPerson,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        contactPosition: formData.position,
        password: btoa(formData.password),
        category: formData.category,
        description: formData.description,
        address: formData.address,
        website: formData.website,
        role: 'company',
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      savedCompanies.push(newCompany);
      localStorage.setItem('companies', JSON.stringify(savedCompanies));

      const userSession = {
        id: newCompany.id,
        email: newCompany.email,
        name: newCompany.name,
        role: 'company',
        status: 'pending'
      };
      localStorage.setItem('user', JSON.stringify(userSession));

      alert('✅ Регистрация успешна! Ожидайте подтверждения.');
      router.push('/dashboard');

    } catch (error) {
      setErrorMessage('Ошибка при регистрации');
    } finally {
      setLoading(false);
    }
  };

  const goNextStep = () => {
    if (step === 1 && checkStep1()) {
      setStep(2);
    } else if (step === 2 && checkStep2()) {
      setStep(3);
    }
  };

  const goBackStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Основная информация</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Название компании *
          </label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
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
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            placeholder="Полное юридическое название"
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
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            placeholder="1234567890"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Телефон *
          </label>
          <input
            type="tel"
            name="companyPhone"
            value={formData.companyPhone}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
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
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          placeholder="company@example.com"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Адрес
        </label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          placeholder="Юридический адрес"
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Контактное лицо</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ФИО *
          </label>
          <input
            type="text"
            name="contactPerson"
            value={formData.contactPerson}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
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
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            placeholder="Директор"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            placeholder="contact@example.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Телефон *
          </label>
          <input
            type="tel"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            placeholder="+7 (999) 123-45-67"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Завершение регистрации</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Пароль *
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            placeholder="Минимум 8 символов"
            required
            minLength={8}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Подтверждение *
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
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
          Категория *
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          required
        >
          <option value="">Выберите</option>
          <option value="metalworking">Металлообработка</option>
          <option value="equipment">Оборудование</option>
          <option value="materials">Материалы</option>
          <option value="tools">Инструменты</option>
          <option value="components">Комплектующие</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Описание
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          placeholder="Чем занимается ваша компания..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Сайт
        </label>
        <input
          type="url"
          name="website"
          value={formData.website}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          placeholder="https://example.com"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Регистрация компании</h1>
                <p className="text-gray-600">Создание аккаунта для бизнеса</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Шаг {step}/3</span>
                <div className="flex space-x-1">
                  <div className={`w-2 h-2 rounded-full ${step >= 1 ? 'bg-green-600' : 'bg-gray-300'}`} />
                  <div className={`w-2 h-2 rounded-full ${step >= 2 ? 'bg-green-600' : 'bg-gray-300'}`} />
                  <div className={`w-2 h-2 rounded-full ${step >= 3 ? 'bg-green-600' : 'bg-gray-300'}`} />
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-b">
            <div className="flex justify-between text-sm">
              <span className={step >= 1 ? 'text-green-600 font-medium' : 'text-gray-500'}>
                Основные данные
              </span>
              <span className={step >= 2 ? 'text-green-600 font-medium' : 'text-gray-500'}>
                Контакты
              </span>
              <span className={step >= 3 ? 'text-green-600 font-medium' : 'text-gray-500'}>
                Пароль
              </span>
            </div>
          </div>

          {errorMessage && (
            <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded">
              <p className="text-red-700 text-sm">{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleFormSubmit}>
            <div className="p-6">
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderStep3()}
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t flex justify-between">
              <div>
                {step > 1 && (
                  <button
                    type="button"
                    onClick={goBackStep}
                    className="px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                  >
                    Назад
                  </button>
                )}
              </div>

              <div>
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={goNextStep}
                    className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                    disabled={
                      (step === 1 && !checkStep1()) ||
                      (step === 2 && !checkStep2())
                    }
                  >
                    Далее
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                    disabled={!checkStep3() || loading}
                  >
                    {loading ? 'Регистрация...' : 'Зарегистрировать'}
                  </button>
                )}
              </div>
            </div>
          </form>

          <div className="px-6 py-4 border-t text-center">
            <p className="text-sm text-gray-600">
              Уже есть аккаунт?{' '}
              <Link href="/login" className="text-green-600 hover:text-green-500 font-medium">
                Войти
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}