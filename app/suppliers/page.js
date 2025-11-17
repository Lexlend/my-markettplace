export default function Suppliers() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Для промышленных поставщиков</h1>
          <p className="text-xl text-gray-600">Расширьте рынок сбыта вашей продукции</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Преимущества для поставщиков</h2>
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="bg-green-100 p-3 rounded-lg mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Новые рынки сбыта</h3>
                <p className="text-gray-600">Доступ к закрытому сообществу промышленных предприятий</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-green-100 p-3 rounded-lg mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Проверенные контрагенты</h3>
                <p className="text-gray-600">Все покупатели - проверенные промышленные предприятия</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-green-100 p-3 rounded-lg mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Прямые контракты</h3>
                <p className="text-gray-600">Работа напрямую с предприятиями без посредников</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm">
              <strong>Условия участия:</strong> Мы принимаем только промышленных поставщиков 
              с подтвержденной репутацией и опытом работы на рынке.
            </p>
          </div>
          
          <div className="mt-8 text-center">
            <a href="/register" className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 inline-block">
              Стать поставщиком
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}