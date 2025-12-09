// ... предыдущий код ...

const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    if (isAdminLogin) {
      // Вход для администратора
      const admins = JSON.parse(localStorage.getItem('admins') || '[]');
      const admin = admins.find(a => 
        a.email === formData.email && 
        atob(a.password) === formData.password &&
        a.isActive
      );

      if (admin) {
        const userData = {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: 'admin',
          permissions: admin.permissions
        };
        localStorage.setItem('user', JSON.stringify(userData));
        router.push('/dashboard/admin');
      } else {
        alert('Неверные данные администратора или аккаунт неактивен');
      }
    } else {
      // Вход для компании (существующая логика)
      // ... 
    }
  } catch (error) {
    alert('Ошибка входа: ' + error.message);
  } finally {
    setLoading(false);
  }
};

// ...