import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Ticket } from '../types';
import { getTicketStatus, markTicketAsUsed } from '../utils/storage';
import { CheckCircle, XCircle, AlertTriangle, ScanLine, ArrowRight } from 'lucide-react';

interface ScannerProps {
  onLogout: () => void;
}

type ScanResult = 
  | { type: 'success'; ticket: Ticket }
  | { type: 'already_used'; ticket: Ticket }
  | { type: 'not_found'; id: string };

export function Scanner({ onLogout }: ScannerProps) {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scannerInstance, setScannerInstance] = useState<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    // Only initialize if we haven't scanned anything yet
    if (!scanResult) {
      const scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
        /* verbose= */ false
      );

      scanner.render(
        (decodedText) => {
          // Pause scanner on successful read
          scanner.pause(true);
          handleScan(decodedText);
        },
        (error) => {
          // Ignore frequent read errors
        }
      );

      setScannerInstance(scanner);

      return () => {
        scanner.clear().catch(console.error);
      };
    }
  }, [scanResult]);

  const handleScan = (id: string) => {
    const ticket = getTicketStatus(id);
    
    if (!ticket) {
      setScanResult({ type: 'not_found', id });
      return;
    }

    if (ticket.status === 'used') {
      setScanResult({ type: 'already_used', ticket });
      return;
    }

    // Valid ticket, mark as used
    const now = new Date().toLocaleTimeString('pt-BR');
    const updated = markTicketAsUsed(id, now);
    if (updated) {
      setScanResult({ type: 'success', ticket: updated });
    }
  };

  const handleNext = () => {
    setScanResult(null);
    if (scannerInstance) {
      scannerInstance.resume();
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col pt-6 px-4 pb-20 items-center">
      <div className="w-full max-w-md flex justify-between items-center mb-8 bg-brand-surface p-4 rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-brand-border mt-4">
        <div>
          <h1 className="text-[18px] font-bold text-brand-primary flex items-center gap-2 uppercase tracking-[1px]">
            <ScanLine className="w-5 h-5 text-brand-primary" />
            Portaria Scanner
          </h1>
          <p className="text-brand-text-light text-[12px] uppercase tracking-wider mt-1 flex items-center gap-2">
            Status <span className="text-brand-success">● ATIVO</span>
          </p>
        </div>
        <button 
          onClick={onLogout}
          className="text-brand-text-light hover:text-brand-error border border-brand-border hover:border-brand-error bg-brand-bg px-3 py-1.5 rounded-lg font-medium text-sm transition-colors"
        >
          Sair
        </button>
      </div>

      <div className="w-full max-w-md w-full relative">
        {!scanResult && (
          <div className="bg-brand-surface rounded-[24px] overflow-hidden shadow-[0_20px_40px_rgba(90,90,64,0.08)] border border-brand-border relative p-2">
            {/* The #reader div must be empty for html5-qrcode to mount cleanly */}
            <div id="reader" className="w-full border-0"></div>
          </div>
        )}

        {scanResult && (
          <div className="animate-in zoom-in-95 duration-300">
            {scanResult.type === 'success' && (
              <div className="bg-[#F4F8F3] border-2 border-brand-success rounded-[24px] p-8 text-center text-brand-success shadow-lg">
                <CheckCircle className="w-20 h-20 mx-auto mb-6 opacity-80" />
                <h2 className="text-[24px] font-black mb-2 tracking-tight uppercase">Acesso Permitido!</h2>
                <div className="bg-white rounded-[16px] p-6 mt-6 border border-brand-success/30 shadow-sm">
                  <p className="font-bold text-[20px] mb-1 text-brand-text">{scanResult.ticket.name}</p>
                  <p className="text-brand-text-light font-medium mb-4">{scanResult.ticket.session}</p>
                  <div className="flex justify-center gap-8 border-t border-dashed border-brand-success/20 pt-4 mt-2">
                    <div>
                      <p className="text-brand-text-light text-[10px] uppercase tracking-wider mb-1">Fileira</p>
                      <p className="font-bold text-[24px] text-brand-text">{scanResult.ticket.row}</p>
                    </div>
                    <div>
                      <p className="text-brand-text-light text-[10px] uppercase tracking-wider mb-1">Assento</p>
                      <p className="font-bold text-[24px] text-brand-text">{scanResult.ticket.seat}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {scanResult.type === 'already_used' && (
              <div className="bg-[#FDF5F5] border-2 border-brand-error rounded-[24px] p-8 text-center text-brand-error shadow-lg">
                <XCircle className="w-20 h-20 mx-auto mb-6 opacity-80" />
                <h2 className="text-[24px] font-black mb-2 tracking-tight uppercase">Ingresso Já Utilizado!</h2>
                <div className="bg-white rounded-[16px] p-6 mt-6 border border-brand-error/30 shadow-sm text-brand-text">
                  <p className="font-bold text-[18px] mb-1">{scanResult.ticket.name}</p>
                  <p className="text-brand-text-light font-medium mb-4">
                    Assento: {scanResult.ticket.row}{scanResult.ticket.seat}
                  </p>
                  <div className="pt-4 border-t border-brand-error/20">
                    <p className="text-brand-text-light text-[12px] uppercase">Este ingresso deu entrada às</p>
                    <p className="font-mono font-bold text-[20px] mt-1 text-brand-error">{scanResult.ticket.entryTime}</p>
                  </div>
                </div>
              </div>
            )}

            {scanResult.type === 'not_found' && (
              <div className="bg-[#FFF9EA] border-2 border-[#D99A29] rounded-[24px] p-8 text-center text-[#B27B15] shadow-lg">
                <AlertTriangle className="w-20 h-20 mx-auto mb-6 opacity-80" />
                <h2 className="text-[22px] font-black mb-2 tracking-tight uppercase">Ingresso Inválido ou Não Encontrado</h2>
                <div className="bg-white rounded-[16px] p-6 mt-6 border border-[#D99A29]/30 shadow-sm">
                  <p className="text-brand-text-light font-medium mb-2 text-[12px] uppercase tracking-wider">ID Escaneado:</p>
                  <p className="font-mono text-[14px] text-brand-text break-all">{scanResult.id}</p>
                </div>
              </div>
            )}

            <button
              onClick={handleNext}
              className="w-full mt-6 bg-brand-primary text-white font-bold py-4 rounded-full hover:scale-[0.98] transition-transform flex items-center justify-center gap-2 shadow-sm text-[14px] tracking-[0.5px] uppercase"
            >
              Escanear Próximo
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
