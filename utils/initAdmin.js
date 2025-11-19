export function initializeFirstAdmin() {
  // Проверяем, есть ли уже админы
  const existingAdmins = JSON.parse(localStorage.getItem('admins') || '[]');
  
  if (existingAdmins.length === 0) {
    // Создаем первого админа по умолчанию
    const firstAdmin = {
      id: 'admin_1',
      email: 'admin@b2b.ru',
      password: btoa('admin123'), // Пароль: admin123
      name: 'Главный администратор',
      role: 'admin',
      permissions: ['companies', 'products', 'orders', 'users', 'analytics', 'settings'],
      createdBy: 'system',
      createdAt: new Date().toISOString(),
      isActive: true
    };
    
    existingAdmins.push(firstAdmin);
    localStorage.setItem('admins', JSON.stringify(existingAdmins));
    
    console.log('✅ Первый администратор создан: admin@b2b.ru / admin123');
  }
}

// Вызываем при загрузке приложения
if (typeof window !== 'undefined') {
  initializeFirstAdmin();
}