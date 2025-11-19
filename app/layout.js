import { AuthProvider } from '../context/AuthContext';
import './globals.css';

export const metadata = {
  title: 'LogProm-Grup',
  description: 'Промышленная B2B площадка',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}