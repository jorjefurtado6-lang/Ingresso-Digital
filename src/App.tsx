import React, { useState } from 'react';
import { ViewMode } from './types';
import { Login } from './components/Login';
import { Admin } from './components/Admin';
import { Scanner } from './components/Scanner';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('login');

  const handleLogin = (mode: ViewMode) => {
    setCurrentView(mode);
  };

  const handleLogout = () => {
    setCurrentView('login');
  };

  return (
    <>
      {currentView === 'login' && <Login onLogin={handleLogin} />}
      {currentView === 'admin' && <Admin onLogout={handleLogout} />}
      {currentView === 'scanner' && <Scanner onLogout={handleLogout} />}
    </>
  );
}
