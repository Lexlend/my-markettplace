'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';

// Временные интерфейсы вместо импортов
interface CompanyUser {
  id: string;
  email: string;
  password: string;
  companyName: string;
  inn: string;
  contactPerson: string;
  phone: string;
  legalAddress: string;
  createdAt: string;
  isActive: boolean;
}

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  companyId: string;
  companyName: string;
  description: string;
  inStock: boolean;
  images: string[];
  specifications?: Record<string, string>;
  createdAt: string;
}

interface CartItem extends Product {
  cartId: string;
  quantity: number;
  addedAt: string;
}

interface RegisterData {
  email: string;
  password: string;
  companyName: string;
  inn: string;
  contactPerson: string;
  phone: string;
  legalAddress: string;
}

// Временные заглушки для компонентов
const Header = ({ company, cartItemsCount, onAuthClick, onCartClick, onSupportClick }: any) => (
  <header className="bg-white shadow-sm border-b">
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">B2B</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Промышленная площадка</h1>
            <p className="text-sm text-gray-500">B2B торговля</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={onCartClick} className="relative p-2 text-gray-700 hover:text-blue-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </button>
          {company ? (
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{company.companyName}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-medium">{company.companyName.charAt(0)}</span>
              </div>
            </div>
          ) : (
            <button onClick={onAuthClick} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium">
              Войти
            </button>
          )}
        </div>
      </div>
    </div>
  </header>
);

const AuthModal = ({ onLogin, onRegister, onClose, loading, error }: any) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '', password: '', companyName: '', inn: '', contactPerson: '', phone: '', legalAddress: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      onLogin(formData.email, formData.password);
    } else {
      onRegister(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{isLogin ? 'Вход' : 'Регистрация'}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
              <input type="password" value={formData.password} onChange={(e) => setFormData(prev => ({...prev, password: e.target.value}))} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            {!isLogin && (
              <>
                <div><input type="text" placeholder="Название компании" value={formData.companyName} onChange={(e) => setFormData(prev => ({...prev, companyName: e.target.value}))} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" /></div>
                <div><input type="text" placeholder="ИНН" value={formData.inn} onChange={(e) => setFormData(prev => ({...prev, inn: e.target.value}))} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" /></div>
                <div><input type="text" placeholder="Контактное лицо" value={formData.contactPerson} onChange={(e) => setFormData(prev => ({...prev, contactPerson: e.target.value}))} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" /></div>
                <div><input type="tel" placeholder="Телефон" value={formData.phone} onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" /></div>
                <div><input type="text" placeholder="Юридический адрес" value={formData.legalAddress} onChange={(e) => setFormData(prev => ({...prev, legalAddress: e.target.value}))} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" /></div>
              </>
            )}
            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium">
              {loading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
            </button>
          </form>
          <div className="mt-4 text-center">
            <button onClick={() => setIsLogin(!isLogin)} className="text-blue-600 hover:text-blue-700">
              {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CartModal = ({ cart, onUpdateItem, onRemoveItem, onClearCart, onClose }: any) => {
  const total = cart.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">Корзина</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="text-xl font-semibold mb-2">Корзина пуста</h3>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item: CartItem) => (
                <div key={item.cartId} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-gray-400 text-xs">Фото</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-gray-600 text-sm">{item.companyName}</p>
                    <p className="text-lg font-bold text-blue-600">{item.price.toLocaleString()} ₽</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => onUpdateItem(item.cartId, item.quantity - 1)} className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-50">-</button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button onClick={() => onUpdateItem(item.cartId, item.quantity + 1)} className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-50">+</button>
                  </div>
                  <button onClick={() => onRemoveItem(item.cartId)} className="text-red-500 hover:text-red-700 p-2">🗑️</button>
                </div>
              ))}
            </div>
          )}
        </div>
        {cart.length > 0 && (
          <div className="p-6 border-t">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-bold">Итого: {total.toLocaleString()} ₽</span>
              <button onClick={onClearCart} className="text-red-500 hover:text-red-700">Очистить корзину</button>
            </div>
            <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 font-medium">
              Оформить заказ
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const SupportModal = ({ onClose }: any) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg max-w-md w-full">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Поддержка</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <p className="text-gray-600 mb-4">По вопросам работы площадки обращайтесь:</p>
        <p className="font-semibold">📞 +7 (495) 123-45-67</p>
        <p className="font-semibold">✉️ support@b2b-platform.ru</p>
      </div>
    </div>
  </div>
);

// Логика хранилища
const secureStorage = {
  getCompanies: (): CompanyUser[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem('b2b_companies');
    return data ? JSON.parse(data) : [];
  },
  setCompanies: (companies: CompanyUser[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('b2b_companies', JSON.stringify(companies));
  },
  getProducts: (): Product[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem('b2b_products');
    return data ? JSON.parse(data) : [];
  },
  setProducts: (products: Product[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('b2b_products', JSON.stringify(products));
  },
  getCart: (): CartItem[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem('b2b_cart');
    return data ? JSON.parse(data) : [];
  },
  setCart: (cart: CartItem[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('b2b_cart', JSON.stringify(cart));
  },
  setSession: (companyId: string) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('b2b_session', JSON.stringify({ companyId, createdAt: new Date().toISOString() }));
  }
};

const secureAuth = {
  login: async (email: string, password: string) => {
    const companies = secureStorage.getCompanies();
    const company = companies.find(c => c.email === email && c.password === `hashed_${password}`);
    if (company) {
      secureStorage.setSession(company.id);
      return { success: true, company };
    }
    return { success: false, error: 'Неверный email или пароль' };
  },
  register: async (data: RegisterData) => {
    const companies = secureStorage.getCompanies();
    const existing = companies.find(c => c.email === data.email || c.inn === data.inn);
    if (existing) return { success: false, error: 'Компания уже существует' };
    
    const newCompany: CompanyUser = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      isActive: true,
      password: `hashed_${data.password}`
    };
    
    secureStorage.setCompanies([...companies, newCompany]);
    secureStorage.setSession(newCompany.id);
    return { success: true, company: newCompany };
  },
  getCurrentCompany: (): CompanyUser | null => {
    const session = localStorage.getItem('b2b_session');
    if (!session) return null;
    const companies = secureStorage.getCompanies();
    return companies.find(c => c.id === JSON.parse(session).companyId) || null;
  }
};

export default function HomePage() {
  const router = useRouter();
  const [company, setCompany] = useState<CompanyUser | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [showAuth, setShowAuth] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeDemoData();
    const currentCompany = secureAuth.getCurrentCompany();
    setCompany(currentCompany);
    setCart(secureStorage.getCart());
    setProducts(secureStorage.getProducts());
  }, []);

  const initializeDemoData = () => {
    if (secureStorage.getCompanies().length === 0) {
      const demoCompanies: CompanyUser[] = [
        {
          id: "1", email: "techmetal@demo.ru", password: "hashed_password_1",
          companyName: "ТехМеталл Пром", inn: "7734567890", contactPerson: "Иванов А.В.",
          phone: "+7 (495) 123-45-67", legalAddress: "г. Москва, ул. Промышленная, д. 15",
          createdAt: new Date().toISOString(), isActive: true
        }
      ];
      secureStorage.setCompanies(demoCompanies);
    }

    if (secureStorage.getProducts().length === 0) {
      const demoProducts: Product[] = [
        {
          id: "1", name: "Токарный станок ЧПУ HAAS ST-20", price: 1250000, category: "metalworking",
          companyId: "1", companyName: "ТехМеталл Пром", description: "Станок высокой точности с ЧПУ",
          inStock: true, images: [], createdAt: new Date().toISOString()
        },
        {
          id: "2", name: "Сталь листовая 3мм Ст3сп", price: 85000, category: "materials",
          companyId: "1", companyName: "ТехМеталл Пром", description: "Лист стальной горячекатаный",
          inStock: true, images: [], createdAt: new Date().toISOString()
        }
      ];
      secureStorage.setProducts(demoProducts);
      setProducts(demoProducts);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.companyName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true); setError(null);
    const result = await secureAuth.login(email, password);
    if (result.success && result.company) {
      setCompany(result.company); setShowAuth(false); router.push('/dashboard/company');
    } else setError(result.error || 'Ошибка авторизации');
    setLoading(false);
  };

  const handleRegister = async (data: RegisterData) => {
    setLoading(true); setError(null);
    const result = await secureAuth.register(data);
    if (result.success && result.company) {
      setCompany(result.company); setShowAuth(false); router.push('/dashboard/company');
    } else setError(result.error || 'Ошибка регистрации');
    setLoading(false);
  };

  const addToCart = (product: Product) => {
    const cartItem: CartItem = { ...product, cartId: `${product.id}-${Date.now()}`, quantity: 1, addedAt: new Date().toISOString() };
    const newCart = [...cart, cartItem];
    setCart(newCart); secureStorage.setCart(newCart);
  };

  const updateCartItem = (cartId: string, quantity: number) => {
    const newCart = cart.map(item => item.cartId === cartId ? { ...item, quantity } : item).filter(item => item.quantity > 0);
    setCart(newCart); secureStorage.setCart(newCart);
  };

  const removeFromCart = (cartId: string) => {
    const newCart = cart.filter(item => item.cartId !== cartId);
    setCart(newCart); secureStorage.setCart(newCart);
  };

  const clearCart = () => { setCart([]); secureStorage.setCart([]); };

  const categories = [
    { id: 'all', name: 'Все товары', icon: '📦' },
    { id: 'metalworking', name: 'Металлообработка', icon: '⚙️' },
    { id: 'materials', name: 'Материалы', icon: '🔩' },
    { id: 'welding', name: 'Сварка', icon: '🔥' },
    { id: 'tools', name: 'Инструменты', icon: '🛠️' },
    { id: 'equipment', name: 'Оборудование', icon: '🏭' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header company={company} cartItemsCount={cart.length} onAuthClick={() => setShowAuth(true)} onCartClick={() => setShowCart(true)} onSupportClick={() => setShowSupport(true)} />
      
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">B2B Площадка промышленных товаров</h1>
          <p className="text-xl mb-8 opacity-90">Прямые поставки оборудования и материалов между компаниями</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => setShowAuth(true)} className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50">Начать продавать</button>
            <button onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })} className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:bg-opacity-10">Каталог товаров</button>
          </div>
        </div>
      </section>

      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4">
            <input type="text" placeholder="Поиск товаров..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>
        </div>
      </section>

      <section id="categories" className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Категории товаров</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(category => (
              <button key={category.id} onClick={() => setSelectedCategory(category.id)} className={`p-6 rounded-lg text-center transition-all ${selectedCategory === category.id ? 'bg-blue-600 text-white shadow-lg scale-105' : 'bg-white text-gray-800 hover:shadow-md hover:bg-blue-50'}`}>
                <div className="text-3xl mb-2">{category.icon}</div>
                <div className="font-semibold">{category.name}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">{selectedCategory === 'all' ? 'Все товары' : categories.find(c => c.id === selectedCategory)?.name}</h2>
            <div className="text-gray-600">Найдено: {filteredProducts.length} товаров</div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">Товары не найдены</h3>
              <p className="text-gray-600">Попробуйте изменить параметры поиска</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">Изображение товара</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold text-blue-600">{product.price.toLocaleString()} ₽</span>
                      <span className={`px-2 py-1 rounded text-xs ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{product.inStock ? 'В наличии' : 'Нет в наличии'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>{product.companyName}</span>
                    </div>
                    <button onClick={() => addToCart(product)} disabled={!product.inStock} className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${product.inStock ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
                      {product.inStock ? 'Добавить в корзину' : 'Нет в наличии'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {showAuth && <AuthModal onLogin={handleLogin} onRegister={handleRegister} onClose={() => setShowAuth(false)} loading={loading} error={error} />}
      {showCart && <CartModal cart={cart} onUpdateItem={updateCartItem} onRemoveItem={removeFromCart} onClearCart={clearCart} onClose={() => setShowCart(false)} />}
      {showSupport && <SupportModal onClose={() => setShowSupport(false)} />}

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg font-semibold mb-2">B2B Промышленная площадка</p>
          <p className="text-gray-400">Прямые поставки между компаниями © 2024</p>
        </div>
      </footer>
    </div>
  );
}