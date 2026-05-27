import React, { useState } from 'react';
import { ViewMode } from '../types';
import { Shield, KeyRound, QrCode, LogIn } from 'lucide-react';

interface LoginProps {
  onLogin: (mode: ViewMode) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [selectedMode, setSelectedMode] = useState<'admin' | 'scanner'>('admin');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (selectedMode === 'admin' && password === 'admin123') {
      onLogin('admin');
    } else if (selectedMode === 'scanner' && password === 'portaria123') {
      onLogin('scanner');
    } else {
      setError('Senha incorreta para o modo selecionado.');
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-brand-surface rounded-[24px] shadow-[0_20px_40px_rgba(90,90,64,0.08)] overflow-hidden border border-brand-border">
        <div className="bg-brand-surface px-6 py-8 text-center border-b border-brand-border">
          <h1 className="text-[28px] text-brand-primary font-serif italic mb-2">
            Ballet 2026
          </h1>
          <p className="text-brand-text-light text-sm">
            Sistema de Bilheteria
          </p>
        </div>

        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-3">
              <label className="text-[12px] uppercase tracking-[1px] font-semibold text-brand-text-light block mb-2">
                Selecione o Módulo de Acesso
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedMode('admin')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                    selectedMode === 'admin'
                      ? 'border-brand-primary bg-brand-bg text-brand-primary'
                      : 'border-brand-border bg-brand-surface text-brand-text-light hover:border-brand-accent'
                  }`}
                >
                  <KeyRound className="w-6 h-6 mb-2" />
                  <span className="text-sm font-medium">Administrativo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMode('scanner')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                    selectedMode === 'scanner'
                      ? 'border-brand-primary bg-brand-bg text-brand-primary'
                      : 'border-brand-border bg-brand-surface text-brand-text-light hover:border-brand-accent'
                  }`}
                >
                  <QrCode className="w-6 h-6 mb-2" />
                  <span className="text-sm font-medium">Portaria</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[12px] uppercase tracking-[1px] font-semibold text-brand-text-light block">
                Senha de Acesso
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-brand-surface border border-brand-border rounded-lg text-[15px] focus:border-brand-primary focus:outline-none transition-colors text-brand-text"
                  placeholder="Digite a senha..."
                  required
                />
              </div>
              {error && <p className="text-brand-error text-sm mt-1">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-brand-primary text-white font-semibold py-3.5 rounded-full hover:scale-[0.98] transition-transform text-[14px] tracking-[0.5px] mt-4"
            >
              Entrar no Sistema
            </button>
            <p className="text-xs text-center text-brand-text-light mt-4">
              Dicas: admin123 (Administrativo) | portaria123 (Portaria)
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
