export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Заголовок */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">О компании LogProm-Grup</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Молодая динамично развивающаяся компания на рынке промышленных B2B решений
          </p>
        </div>

        {/* Основной контент */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Наша философия</h2>
            <p className="text-lg text-gray-700 mb-6">
              <strong>LogProm-Grup</strong> — это закрытая площадка исключительно для промышленных организаций. 
              Мы создаем безопасное пространство где предприятия могут напрямую покупать и продавать 
              промышленное оборудование, сырьё и комплектующие.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              Мы тщательно проверяем каждого участника сообщества, обеспечивая высокий уровень 
              доверия и безопасности всех сделок. Только промышленные организации, только прямые контракты.
            </p>
            <p className="text-lg text-gray-700">
              Наша цель — создать эффективную экосистему для промышленного бизнеса, где каждая сделка 
              выгодна обеим сторонам.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Наши принципы</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Только промышленные организации</h4>
                  <p className="text-gray-600">Все участники - проверенные промышленные предприятия</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Прямые контракты</h4>
                  <p className="text-gray-600">Без посредников, напрямую между предприятиями</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Закрытое сообщество</h4>
                  <p className="text-gray-600">Доступ только для проверенных участников</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Статистика */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">LogProm-Grup в цифрах</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
              <div className="text-gray-600">Компаний</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">250+</div>
              <div className="text-gray-600">Товаров</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
              <div className="text-gray-600">Успешных сделок</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">8+</div>
              <div className="text-gray-600">Отраслей</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Станьте частью нашего сообщества</h3>
          <p className="text-lg text-gray-600 mb-8">
            Присоединяйтесь к растущему сообществу промышленных предприятий
          </p>
          <div className="flex justify-center space-x-4">
            <a href="/register" className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700">
              Зарегистрироваться
            </a>
            <a href="/suppliers" className="border border-green-600 text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50">
              Для поставщиков
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}