// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Upload, CheckCircle, XCircle } from 'lucide-react';

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
    website: '',
    logo: null,
    documents: [],
    agreeTerms: false,
    marketingAgree: false
  });
  
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [uploadProgress, setUploadProgress] = useState(0);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [timer, setTimer] = useState(0);
  
  const router = useRouter();

  // Таймер для кода подтверждения
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Валидация телефонного номера
  const validatePhone = (phone) => {
    const phoneRegex = /^(\+7|8)[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/;
    return phoneRegex.test(phone);
  };

  // Валидация ИНН
  const validateINN = (inn) => {
    if (!inn) return false;
    
    // Проверка длины ИНН
    if (inn.length !== 10 && inn.length !== 12) return false;
    
    // Проверка что все символы цифры
    if (!/^\d+$/.test(inn)) return false;
    
    // Алгоритм проверки контрольной суммы для 10-значного ИНН
    if (inn.length === 10) {
      const weights = [2, 4, 10, 3, 5, 9, 4, 6, 8];
      let sum = 0;
      
      for (let i = 0; i < 9; i++) {
        sum += parseInt(inn[i]) * weights[i];
      }
      
      const control = (sum % 11) % 10;
      return control === parseInt(inn[9]);
    }
    
    return true; // Для 12-значного ИНН пропускаем проверку
  };

  // Валидация email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Валидация пароля
  const validatePassword = (password) => {
    if (password.length < 8) return 'Пароль должен быть не менее 8 символов';
    if (!/[A-Z]/.test(password)) return 'Пароль должен содержать хотя бы одну заглавную букву';
    if (!/[a-z]/.test(password)) return 'Пароль должен содержать хотя бы одну строчную букву';
    if (!/\d/.test(password)) return 'Пароль должен содержать хотя бы одну цифру';
    if (!/[!@#$%^&*]/.test(password)) return 'Пароль должен содержать хотя бы один специальный символ (!@#$%^&*)';
    return null;
  };

  // Валидация URL
  const validateURL = (url) => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Проверка всех полей шага
  const validateStep = (stepNumber) => {
    const errors = {};
    
    if (stepNumber === 1) {
      if (!formData.companyName.trim()) errors.companyName = 'Введите название компании';
      if (!formData.legalName.trim()) errors.legalName = 'Введите юридическое название';
      if (!validateINN(formData.taxId)) errors.taxId = 'Введите корректный ИНН';
      if (!validateEmail(formData.companyEmail)) errors.companyEmail = 'Введите корректный email';
      if (!validatePhone(formData.companyPhone)) errors.companyPhone = 'Введите корректный номер телефона';
      if (!formData.address.trim()) errors.address = 'Введите юридический адрес';
    }
    
    if (stepNumber === 2) {
      if (!formData.contactPerson.trim()) errors.contactPerson = 'Введите ФИО контактного лица';
      if (!validateEmail(formData.contactEmail)) errors.contactEmail = 'Введите корректный email';
      if (!validatePhone(formData.contactPhone)) errors.contactPhone = 'Введите корректный номер телефона';
      if (!formData.position.trim()) errors.position = 'Введите должность';
    }
    
    if (stepNumber === 3) {
      const passwordError = validatePassword(formData.password);
      if (passwordError) errors.password = passwordError;
      
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Пароли не совпадают';
      }
      
      if (!formData.category) errors.category = 'Выберите категорию деятельности';
      if (!formData.description.trim()) errors.description = 'Введите описание деятельности';
      
      if (formData.website && !validateURL(formData.website)) {
        errors.website = 'Введите корректный URL';
      }
      
      if (!formData.agreeTerms) errors.agreeTerms = 'Необходимо принять условия соглашения';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (type === 'file') {
      if (name === 'logo') {
        if (files && files[0]) {
          const file = files[0];
          // Проверка типа файла
          if (!file.type.startsWith('image/')) {
            setValidationErrors(prev => ({
              ...prev,
              logo: 'Загрузите изображение (JPG, PNG, GIF)'
            }));
            return;
          }
          
          // Проверка размера файла (макс 5MB)
          if (file.size > 5 * 1024 * 1024) {
            setValidationErrors(prev => ({
              ...prev,
              logo: 'Размер файла не должен превышать 5MB'
            }));
            return;
          }
          
          setFormData(prev => ({
            ...prev,
            [name]: file
          }));
          
          // Очищаем ошибку если файл валиден
          setValidationErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.logo;
            return newErrors;
          });
        }
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Очищаем ошибку при вводе
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Отправка кода подтверждения
  const sendVerificationCode = async () => {
    if (!validateEmail(formData.companyEmail)) {
      setErrorMessage('Введите корректный email для отправки кода');
      return;
    }
    
    try {
      // В реальном приложении здесь был бы запрос к API
      // Генерируем тестовый код
      const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Сохраняем код в localStorage для проверки
      localStorage.setItem('verification_code', generatedCode);
      localStorage.setItem('verification_email', formData.companyEmail);
      
      setSuccessMessage(`Код подтверждения отправлен на ${formData.companyEmail} (тестовый код: ${generatedCode})`);
      setTimer(300); // 5 минут
      setIsVerified(false);
    } catch (error) {
      setErrorMessage('Ошибка при отправке кода подтверждения');
    }
  };

  // Проверка кода подтверждения
  const verifyCode = () => {
    const savedCode = localStorage.getItem('verification_code');
    const savedEmail = localStorage.getItem('verification_email');
    
    if (savedCode === verificationCode && savedEmail === formData.companyEmail) {
      setIsVerified(true);
      setSuccessMessage('Email успешно подтвержден!');
      setErrorMessage('');
      
      // Очищаем код из localStorage
      localStorage.removeItem('verification_code');
      localStorage.removeItem('verification_email');
    } else {
      setErrorMessage('Неверный код подтверждения');
    }
  };

  const checkStep1 = () => {
    return validateStep(1);
  };

  const checkStep2 = () => {
    return validateStep(2);
  };

  const checkStep3 = () => {
    return validateStep(3);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!checkStep3()) {
      setErrorMessage('Исправьте ошибки в форме');
      return;
    }
    
    if (!isVerified && step === 3) {
      setErrorMessage('Подтвердите email перед регистрацией');
      return;
    }
    
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Симуляция загрузки файлов
      setUploadProgress(0);
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      const savedCompaniesStr = localStorage.getItem('companies');
      const savedCompanies = savedCompaniesStr ? JSON.parse(savedCompaniesStr) : [];
      
      // Проверка уникальности email
      const emailUsed = savedCompanies.some(company => 
        company.email === formData.companyEmail || company.contactEmail === formData.contactEmail
      );
      
      if (emailUsed) {
        setErrorMessage('Этот email уже используется');
        setLoading(false);
        clearInterval(progressInterval);
        return;
      }

      // Проверка уникальности ИНН
      const taxUsed = savedCompanies.some(company => company.taxId === formData.taxId);
      if (taxUsed) {
        setErrorMessage('Этот ИНН уже зарегистрирован');
        setLoading(false);
        clearInterval(progressInterval);
        return;
      }

      // Чтение логотипа как base64
      let logoBase64 = null;
      if (formData.logo) {
        logoBase64 = await readFileAsBase64(formData.logo);
      }

      const newCompany = {
        id: 'company_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
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
        logo: logoBase64,
        documents: [],
        role: 'company',
        status: 'pending_review',
        verification: {
          emailVerified: true,
          phoneVerified: false,
          documentsVerified: false
        },
        settings: {
          notifications: true,
          marketing: formData.marketingAgree,
          twoFactorAuth: false
        },
        statistics: {
          productsCount: 0,
          ordersCount: 0,
          rating: 0,
          reviews: 0
        },
        subscription: {
          plan: 'free',
          expiresAt: null,
          features: ['basic_listing']
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLogin: null,
        loginAttempts: 0,
        metadata: {
          ip: '127.0.0.1',
          userAgent: navigator.userAgent,
          registrationSource: 'web'
        }
      };

      savedCompanies.push(newCompany);
      localStorage.setItem('companies', JSON.stringify(savedCompanies));

      // Сохраняем историю действий
      const auditLog = {
        action: 'company_registration',
        companyId: newCompany.id,
        timestamp: new Date().toISOString(),
        details: {
          email: newCompany.email,
          name: newCompany.name
        }
      };
      
      const savedLogs = JSON.parse(localStorage.getItem('audit_logs') || '[]');
      savedLogs.push(auditLog);
      localStorage.setItem('audit_logs', JSON.stringify(savedLogs));

      const userSession = {
        id: newCompany.id,
        email: newCompany.email,
        name: newCompany.name,
        role: 'company',
        status: 'pending_review',
        token: btoa(Date.now() + '_' + newCompany.id),
        tokenExpires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 дней
      };
      localStorage.setItem('user', JSON.stringify(userSession));

      clearInterval(progressInterval);
      
      // Показываем успешное сообщение
      setSuccessMessage('✅ Регистрация успешно завершена! Ваш аккаунт отправлен на модерацию.');
      
      // Задержка перед редиректом
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);

    } catch (error) {
      console.error('Registration error:', error);
      setErrorMessage('Ошибка при регистрации. Пожалуйста, попробуйте еще раз.');
    } finally {
      setLoading(false);
    }
  };

  // Вспомогательная функция для чтения файла
  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const goNextStep = () => {
    if (step === 1 && checkStep1()) {
      setStep(2);
      window.scrollTo(0, 0);
    } else if (step === 2 && checkStep2()) {
      setStep(3);
      window.scrollTo(0, 0);
      // Автоматически отправляем код подтверждения
      sendVerificationCode();
    }
  };

  const goBackStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Основная информация компании</h3>
        <p className="text-blue-700 text-sm">Заполните официальные данные вашей компании. Все поля отмеченные * обязательны для заполнения.</p>
      </div>
      
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
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
              validationErrors.companyName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="ООО 'Промышленные технологии'"
            required
          />
          {validationErrors.companyName && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.companyName}</p>
          )}
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
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
              validationErrors.legalName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Общество с ограниченной ответственностью 'Промышленные технологии'"
            required
          />
          {validationErrors.legalName && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.legalName}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ИНН *
            <span className="text-gray-500 text-xs ml-2">10 или 12 цифр</span>
          </label>
          <input
            type="text"
            name="taxId"
            value={formData.taxId}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
              validationErrors.taxId ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="1234567890"
            required
            maxLength={12}
          />
          {validationErrors.taxId && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.taxId}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Телефон компании *
          </label>
          <input
            type="tel"
            name="companyPhone"
            value={formData.companyPhone}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
              validationErrors.companyPhone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="+7 (999) 123-45-67"
            required
          />
          {validationErrors.companyPhone && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.companyPhone}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email компании *
          <span className="text-gray-500 text-xs ml-2">Будет использоваться для входа</span>
        </label>
        <input
          type="email"
          name="companyEmail"
          value={formData.companyEmail}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
            validationErrors.companyEmail ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="info@company.ru"
          required
        />
        {validationErrors.companyEmail && (
          <p className="text-red-500 text-sm mt-1">{validationErrors.companyEmail}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Юридический адрес *
        </label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
            validationErrors.address ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="г. Москва, ул. Промышленная, д. 1, офис 101"
          required
        />
        {validationErrors.address && (
          <p className="text-red-500 text-sm mt-1">{validationErrors.address}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Логотип компании
          <span className="text-gray-500 text-xs ml-2">JPG, PNG, GIF, до 5MB</span>
        </label>
        <div className="flex items-center space-x-4">
          <label className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
            <Upload className="w-5 h-5 mr-2" />
            <span>Загрузить логотип</span>
            <input
              type="file"
              name="logo"
              accept="image/*"
              onChange={handleInputChange}
              className="hidden"
            />
          </label>
          {formData.logo && (
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-600">{formData.logo.name}</span>
            </div>
          )}
        </div>
        {validationErrors.logo && (
          <p className="text-red-500 text-sm mt-1">{validationErrors.logo}</p>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Контактное лицо</h3>
        <p className="text-blue-700 text-sm">Укажите данные представителя компании для связи. Этот человек будет получать уведомления и отвечать на запросы.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ФИО контактного лица *
          </label>
          <input
            type="text"
            name="contactPerson"
            value={formData.contactPerson}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
              validationErrors.contactPerson ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Иванов Иван Иванович"
            required
          />
          {validationErrors.contactPerson && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.contactPerson}</p>
          )}
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
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
              validationErrors.position ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Директор по развитию"
            required
          />
          {validationErrors.position && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.position}</p>
          )}
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
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
              validationErrors.contactEmail ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="ivanov@company.ru"
            required
          />
          {validationErrors.contactEmail && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.contactEmail}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Телефон контактного лица *
          </label>
          <input
            type="tel"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
              validationErrors.contactPhone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="+7 (999) 987-65-43"
            required
          />
          {validationErrors.contactPhone && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.contactPhone}</p>
          )}
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-800 mb-2">📞 Важная информация</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Контактное лицо будет получать все уведомления системы</li>
          <li>• Убедитесь, что email и телефон корректны</li>
          <li>• По этому номеру могут звонить потенциальные клиенты</li>
        </ul>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Завершение регистрации</h3>
        <p className="text-blue-700 text-sm">Установите пароль, выберите категорию и подтвердите email для завершения регистрации.</p>
      </div>

      {/* Подтверждение email */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-medium text-yellow-800">Подтверждение email</h4>
          {isVerified ? (
            <div className="flex items-center text-green-600">
              <CheckCircle className="w-5 h-5 mr-1" />
              <span className="text-sm">Подтверждено</span>
            </div>
          ) : (
            <div className="flex items-center text-red-600">
              <XCircle className="w-5 h-5 mr-1" />
              <span className="text-sm">Не подтверждено</span>
            </div>
          )}
        </div>
        
        {!isVerified && (
          <div className="space-y-3">
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={sendVerificationCode}
                disabled={timer > 0}
                className={`px-4 py-2 rounded text-sm ${
                  timer > 0 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {timer > 0 ? `Повторно через ${formatTime(timer)}` : 'Отправить код'}
              </button>
              
              <input
                type="text"
                placeholder="Введите 6-значный код"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="px-3 py-2 border border-gray-300 rounded flex-1"
              />
              
              <button
                type="button"
                onClick={verifyCode}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Подтвердить
              </button>
            </div>
            <p className="text-sm text-yellow-700">
              Код подтверждения отправлен на {formData.companyEmail}. Проверьте почту (включая папку "Спам").
            </p>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Пароль *
            <span className="text-gray-500 text-xs ml-2">Минимум 8 символов, заглавные, строчные, цифры, спецсимволы</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 pr-10 ${
                validationErrors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Введите надежный пароль"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {validationErrors.password && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.password}</p>
          )}
          
          {/* Индикатор силы пароля */}
          {formData.password && (
            <div className="mt-2">
              <div className="flex space-x-1">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`h-1 flex-1 rounded ${
                      formData.password.length >= level * 2
                        ? formData.password.length >= 8 && 
                          /[A-Z]/.test(formData.password) && 
                          /[a-z]/.test(formData.password) && 
                          /\d/.test(formData.password) &&
                          /[!@#$%^&*]/.test(formData.password)
                          ? 'bg-green-500'
                          : formData.password.length >= 6
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {formData.password.length < 6 ? 'Слабый' : 
                 formData.password.length < 8 ? 'Средний' : 
                 validatePassword(formData.password) ? 'Ненадежный' : 'Надежный'}
              </p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Подтверждение пароля *
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 pr-10 ${
                validationErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Повторите пароль"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {validationErrors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.confirmPassword}</p>
          )}
          {formData.password && formData.confirmPassword && formData.password === formData.confirmPassword && (
            <p className="text-green-500 text-sm mt-1">✓ Пароли совпадают</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Категория деятельности *
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
            validationErrors.category ? 'border-red-500' : 'border-gray-300'
          }`}
          required
        >
          <option value="">Выберите основную категорию</option>
          <option value="metalworking">Металлообработка и станки</option>
          <option value="equipment">Промышленное оборудование</option>
          <option value="materials">Сырье и материалы</option>
          <option value="tools">Инструменты и оснастка</option>
          <option value="components">Комплектующие и запчасти</option>
          <option value="automation">Автоматизация и КИП</option>
          <option value="energy">Энергетическое оборудование</option>
          <option value="transport">Транспорт и логистика</option>
          <option value="services">Промышленные услуги</option>
          <option value="other">Другое</option>
        </select>
        {validationErrors.category && (
          <p className="text-red-500 text-sm mt-1">{validationErrors.category}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Описание деятельности *
          <span className="text-gray-500 text-xs ml-2">Расскажите о вашей компании, специализации и опыте</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={4}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
            validationErrors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Наша компания специализируется на... Основные направления деятельности:..."
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          Осталось символов: {5000 - formData.description.length}
        </p>
        {validationErrors.description && (
          <p className="text-red-500 text-sm mt-1">{validationErrors.description}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Веб-сайт компании
        </label>
        <input
          type="url"
          name="website"
          value={formData.website}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
            validationErrors.website ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="https://www.example.com"
        />
        {validationErrors.website && (
          <p className="text-red-500 text-sm mt-1">{validationErrors.website}</p>
        )}
      </div>

      {/* Соглашения */}
      <div className="space-y-4">
        <div className={`border rounded-lg p-4 ${
          validationErrors.agreeTerms ? 'border-red-500 bg-red-50' : 'border-gray-200'
        }`}>
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleInputChange}
              className="mt-1"
            />
            <div>
              <span className="font-medium text-gray-700">
                Я принимаю условия <Link href="/terms" className="text-blue-600 hover:underline">Пользовательского соглашения</Link>, 
                <Link href="/privacy" className="text-blue-600 hover:underline ml-1">Политики конфиденциальности</Link> и 
                <Link href="/offer" className="text-blue-600 hover:underline ml-1">Оферты</Link> *
              </span>
              <p className="text-sm text-gray-600 mt-1">
                Регистрируясь, вы соглашаетесь с правилами использования площадки, обработкой персональных данных и условиями оказания услуг.
              </p>
            </div>
          </label>
          {validationErrors.agreeTerms && (
            <p className="text-red-500 text-sm mt-2">{validationErrors.agreeTerms}</p>
          )}
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              name="marketingAgree"
              checked={formData.marketingAgree}
              onChange={handleInputChange}
              className="mt-1"
            />
            <div>
              <span className="font-medium text-gray-700">
                Я хочу получать информационные рассылки и новости площадки
              </span>
              <p className="text-sm text-gray-600 mt-1">
                Будем присылать информацию о новых возможностях, акциях и важных обновлениях. Вы всегда можете отписаться.
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Прогресс загрузки */}
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-blue-800">Загрузка данных...</span>
            <span className="text-sm text-blue-600">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Хлебные крошки */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-green-600">Главная</Link>
            </li>
            <li>/</li>
            <li className="text-green-600 font-medium">Регистрация компании</li>
          </ol>
        </nav>

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          {/* Шапка с прогрессом */}
          <div className="px-8 py-6 bg-gradient-to-r from-green-50 to-blue-50 border-b">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Регистрация компании</h1>
                <p className="text-gray-600 mt-1">Станьте частью промышленной торговой площадки</p>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="bg-white rounded-full px-4 py-2 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-500">Шаг {step} из 3</span>
                    <div className="flex space-x-1">
                      {[1, 2, 3].map((s) => (
                        <div
                          key={s}
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            s === step ? 'bg-green-600 scale-125' : 
                            s < step ? 'bg-green-400' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Индикатор прогресса */}
            <div className="mt-6">
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className={step >= 1 ? 'text-green-600' : 'text-gray-500'}>
                  <div className="flex items-center">
                    {step > 1 ? (
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    ) : (
                      <div className={`w-4 h-4 rounded-full mr-2 ${step >= 1 ? 'bg-green-500' : 'bg-gray-300'}`} />
                    )}
                    Основные данные
                  </div>
                </span>
                <span className={step >= 2 ? 'text-green-600' : 'text-gray-500'}>
                  <div className="flex items-center">
                    {step > 2 ? (
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    ) : (
                      <div className={`w-4 h-4 rounded-full mr-2 ${step >= 2 ? 'bg-green-500' : 'bg-gray-300'}`} />
                    )}
                    Контакты
                  </div>
                </span>
                <span className={step >= 3 ? 'text-green-600' : 'text-gray-500'}>
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full mr-2 ${step >= 3 ? 'bg-green-500' : 'bg-gray-300'}`} />
                    Завершение
                  </div>
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-500"
                  style={{ width: `${(step - 1) * 50}%` }}
                />
              </div>
            </div>
          </div>

          {/* Сообщения об ошибках/успехе */}
          {errorMessage && (
            <div className="mx-8 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start">
                <XCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-red-700">{errorMessage}</p>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="mx-8 mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-green-700 font-medium">{successMessage}</p>
                  {uploadProgress === 100 && (
                    <p className="text-green-600 text-sm mt-1">
                          Перенаправление на дашборд через 3 секунды...
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Форма */}
              <form onSubmit={handleFormSubmit}>
                <div className="p-8">
                  {step === 1 && renderStep1()}
                  {step === 2 && renderStep2()}
                  {step === 3 && renderStep3()}
                </div>

                {/* Кнопки навигации */}
                <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                    <div>
                      {step > 1 ? (
                        <button
                          type="button"
                          onClick={goBackStep}
                          className="px-8 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors flex items-center"
                        >
                          ← Назад
                        </button>
                      ) : (
                        <Link
                          href="/"
                          className="px-8 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors inline-block"
                        >
                          ← На главную
                        </Link>
                      )}
                    </div>

                    <div className="flex space-x-4">
                      {step < 3 ? (
                        <button
                          type="button"
                          onClick={goNextStep}
                          disabled={
                            (step === 1 && !checkStep1()) ||
                            (step === 2 && !checkStep2())
                          }
                          className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-md hover:shadow-lg"
                        >
                          Продолжить →
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={!checkStep3() || loading || !isVerified}
                          className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-md hover:shadow-lg"
                        >
                          {loading ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                              Регистрация...
                            </>
                          ) : (
                            'Завершить регистрацию'
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </form>

              {/* Информационная панель */}
              <div className="px-8 py-6 border-t border-gray-200 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-green-600 text-2xl mb-2">🏭</div>
                    <h4 className="font-semibold text-gray-800">Для промышленных компаний</h4>
                    <p className="text-sm text-gray-600 mt-1">Только проверенные поставщики и производители</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-green-600 text-2xl mb-2">🔒</div>
                    <h4 className="font-semibold text-gray-800">Безопасные сделки</h4>
                    <p className="text-sm text-gray-600 mt-1">Escrow-сервис и юридическое сопровождение</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-green-600 text-2xl mb-2">🚀</div>
                    <h4 className="font-semibold text-gray-800">Быстрый старт</h4>
                    <p className="text-sm text-gray-600 mt-1">Начните продавать уже через 24 часа после модерации</p>
                  </div>
                </div>
              </div>

              {/* Футер формы */}
              <div className="px-8 py-4 bg-gray-900 text-white">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="mb-4 md:mb-0">
                    <p className="text-sm">
                      Уже есть аккаунт?{' '}
                      <Link href="/login" className="text-green-300 hover:text-green-200 font-medium underline">
                        Войти в систему
                      </Link>
                    </p>
                  </div>
                  <div className="text-sm text-gray-400">
                    <p>Нужна помощь? <Link href="/support" className="text-green-300 hover:text-green-200">Служба поддержки</Link></p>
                  </div>
                </div>
              </div>
            </div>

            {/* Дополнительная информация */}
            <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Что происходит после регистрации?</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-blue-600 text-xl mb-2">1</div>
                  <h4 className="font-medium text-gray-800">Модерация</h4>
                  <p className="text-sm text-gray-600 mt-1">Проверка данных занимает до 24 часов</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-blue-600 text-xl mb-2">2</div>
                  <h4 className="font-medium text-gray-800">Активация</h4>
                  <p className="text-sm text-gray-600 mt-1">Полный доступ ко всем функциям</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-blue-600 text-xl mb-2">3</div>
                  <h4 className="font-medium text-gray-800">Настройка</h4>
                  <p className="text-sm text-gray-600 mt-1">Заполнение профиля и добавление товаров</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-blue-600 text-xl mb-2">4</div>
                  <h4 className="font-medium text-gray-800">Продажи</h4>
                  <p className="text-sm text-gray-600 mt-1">Начало работы с клиентами</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }