import React from "react";

export default function Home() {
  const products = [
    { id: 1, name: "Промышленный компрессор", price: "450 000 руб.", category: "Оборудование" },
    { id: 2, name: "Станок ЧПУ", price: "1 200 000 руб.", category: "Металлообработка" },
    { id: 3, name: "Промышленные подшипники", price: "85 000 руб.", category: "Комплектующие" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
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

            <nav className="flex space-x-8">
              <a href="/" className="text-gray-700 hover:text-green-600 font-medium">Каталог</a>
              <a href="/about" className="text-gray-700 hover:text-green-600 font-medium">О компании</a>
              <a href="/suppliers" className="text-gray-700 hover:text-green-600 font-medium">Для поставщиков</a>
              <a href="/register" className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700">Регистрация</a>
            </nav>
          </div>
        </div>
      </header>

      <main>
        <section className="bg-green-600 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <h2 className="text-4xl font-bold mb-4">LogProm-Grup</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Закрытое сообщество промышленных организаций. Только проверенные предприятия.
            </p>
            <div className="flex justify-center space-x-4">
              <a href="/register" className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">Присоединиться</a>
              <a href="/about" className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600">Узнать больше</a>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Актуальные предложения</h2>
            <p className="text-lg text-gray-600">Промышленное оборудование от участников сообщества</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product) => (
              <article key={product.id} className="bg-white rounded-xl shadow-md border border-gray-100">
                <div className="h-48 bg-green-50 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <div className="text-green-600 font-bold">IMG</div>
                    </div>
                    <span className="text-sm text-gray-500">Изображение товара</span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-2">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">{product.category}</span>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>

                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-gray-900">{product.price}</span>
                    <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700">Подробнее</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

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
            <p>© 2024 LogProm-Grup. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}