import React, { useState, useRef } from 'react';
import QRCode from 'react-qr-code';
import { v4 as uuidv4 } from 'uuid';
import html2canvas from 'html2canvas';
import { Ticket } from '../types';
import { saveTicket } from '../utils/storage';
import { Ticket as TicketIcon, Download, CheckCircle2, TicketPlus, LogOut } from 'lucide-react';

interface AdminProps {
  onLogout: () => void;
}

export function Admin({ onLogout }: AdminProps) {
  const [formData, setFormData] = useState({
    name: '',
    session: 'Sessão 1 - 16h',
    row: '',
    seat: '',
  });
  
  const [generatedTicket, setGeneratedTicket] = useState<Ticket | null>(null);
  const ticketRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate unique ID
    const ticketId = `ING-${uuidv4().substring(0, 8).toUpperCase()}`;
    
    const newTicket: Ticket = {
      id: ticketId,
      name: formData.name,
      session: formData.session,
      row: formData.row.toUpperCase(),
      seat: formData.seat.toUpperCase(),
      status: 'available',
    };

    // Save to localStorage
    saveTicket(newTicket);
    setGeneratedTicket(newTicket);
  };

  const downloadTicket = async () => {
    if (!ticketRef.current || !generatedTicket) return;
    
    try {
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `Ingresso-${generatedTicket.name.replace(/\s+/g, '-')}.png`;
      link.click();
    } catch (err) {
      console.error('Error downloading ticket', err);
      alert('Erro ao baixar o ingresso. Tente novamente.');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', session: 'Sessão 1 - 16h', row: '', seat: '' });
    setGeneratedTicket(null);
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-5xl flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-serif italic text-brand-primary flex items-center gap-2">
            <TicketIcon className="w-8 h-8 text-brand-accent" />
            Gerador de Ingressos
          </h1>
          <p className="text-brand-text-light text-[14px] mt-1">Emissão de bilhetes digitais para o espetáculo anual.</p>
        </div>
        <button 
          onClick={onLogout}
          className="p-2 text-brand-error hover:text-white hover:bg-brand-error bg-brand-surface rounded-lg shadow-sm border border-brand-border transition-colors"
          title="Sair"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-[1fr_380px] gap-10">
        {/* Form Column */}
        <div className="bg-brand-surface p-[40px] rounded-[24px] shadow-[0_20px_40px_rgba(90,90,64,0.08)] border border-brand-border h-fit">
          <form onSubmit={handleGenerate} className="space-y-5">
            <div>
              <label className="block text-[12px] uppercase tracking-[1px] font-semibold text-brand-text-light mb-2">Nome do Comprador</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-brand-surface border border-brand-border rounded-lg text-[15px] focus:border-brand-primary focus:outline-none transition-colors text-brand-text"
                placeholder="Ex: Maria Silva"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] uppercase tracking-[1px] font-semibold text-brand-text-light mb-2">Sessão</label>
                <select
                  name="session"
                  value={formData.session}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-brand-surface border border-brand-border rounded-lg text-[15px] focus:border-brand-primary focus:outline-none transition-colors text-brand-text"
                >
                  <option value="Sessão 1 - 16h">Sessão 1 - 16h</option>
                  <option value="Sessão 2 - 20h">Sessão 2 - 20h</option>
                </select>
              </div>
              
              <div>
                <label className="block text-[12px] uppercase tracking-[1px] font-semibold text-brand-text-light mb-2">ID Gerado</label>
                <input
                  type="text"
                  value="Automático"
                  disabled
                  className="w-full px-4 py-3 bg-brand-bg border border-brand-border rounded-lg text-[15px] text-brand-text-light cursor-not-allowed"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] uppercase tracking-[1px] font-semibold text-brand-text-light mb-2">Fileira</label>
                <input
                  type="text"
                  name="row"
                  value={formData.row}
                  onChange={handleChange}
                  required
                  maxLength={3}
                  className="w-full px-4 py-3 bg-brand-surface border border-brand-border rounded-lg text-[15px] focus:border-brand-primary focus:outline-none transition-colors text-brand-text uppercase"
                  placeholder="Ex: A"
                />
              </div>
              <div>
                <label className="block text-[12px] uppercase tracking-[1px] font-semibold text-brand-text-light mb-2">Assento</label>
                <input
                  type="text"
                  name="seat"
                  value={formData.seat}
                  onChange={handleChange}
                  required
                  maxLength={4}
                  className="w-full px-4 py-3 bg-brand-surface border border-brand-border rounded-lg text-[15px] focus:border-brand-primary focus:outline-none transition-colors text-brand-text uppercase"
                  placeholder="Ex: 12"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-6 bg-brand-primary text-white font-semibold py-3.5 rounded-full hover:scale-[0.98] transition-transform text-[14px] tracking-[0.5px]"
            >
              Gerar e Salvar Ingresso
            </button>
            {generatedTicket && (
              <div className="bg-[#F4F8F3] border border-brand-success text-brand-success p-3 rounded-lg text-[12px] flex items-center gap-2 mt-4 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                Ingresso registrado com sucesso no banco de dados local.
              </div>
            )}
          </form>
        </div>

        {/* Preview Column */}
        <div className="flex flex-col flex-1 items-stretch justify-start gap-4">
          {!generatedTicket ? (
            <div className="w-full h-full min-h-[400px] border-2 border-dashed border-brand-border rounded-[24px] flex flex-col items-center justify-center text-brand-text-light bg-brand-bg/50">
              <TicketIcon className="w-12 h-12 mb-2 opacity-50 text-brand-primary" />
              <p className="text-sm font-medium">Preencha os dados para gerar.</p>
            </div>
          ) : (
            <div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div 
                ref={ticketRef}
                className="bg-brand-surface rounded-[24px] shadow-[0_20px_40px_rgba(90,90,64,0.08)] border border-brand-border overflow-hidden relative"
              >
                {/* Decorative cutouts */}
                <div className="absolute left-0 top-[120px] -translate-x-1/2 w-6 h-6 bg-brand-bg rounded-full border-r border-brand-border"></div>
                <div className="absolute right-0 top-[120px] translate-x-1/2 w-6 h-6 bg-brand-bg rounded-full border-l border-brand-border"></div>
                <div className="absolute left-6 right-6 top-[132px] border-t border-dashed border-brand-border"></div>

                <div className="bg-brand-primary p-[30px] text-center relative overflow-hidden">
                  <h3 className="text-[20px] font-serif italic text-white relative z-10">Ballet 2026</h3>
                  <p className="text-white uppercase tracking-[2px] text-[10px] opacity-80 mt-1 relative z-10">Ingresso Digital</p>
                </div>
                
                <div className="p-[30px] pt-[40px] flex flex-col">
                  <div className="mb-[24px]">
                    <div className="flex justify-between items-end border-b border-dashed border-brand-border pb-3 mb-3">
                      <span className="text-[11px] text-brand-text-light uppercase tracking-wider">Comprador</span>
                      <span className="text-[14px] font-semibold text-brand-text">{generatedTicket.name}</span>
                    </div>
                    <div className="flex justify-between items-end border-b border-dashed border-brand-border pb-3 mb-3">
                      <span className="text-[11px] text-brand-text-light uppercase tracking-wider">Sessão</span>
                      <span className="text-[14px] font-semibold text-brand-text">{generatedTicket.session}</span>
                    </div>
                    <div className="flex gap-5 border-b border-dashed border-brand-border pb-3 mb-3">
                      <div className="flex-1 flex justify-between items-end">
                        <span className="text-[11px] text-brand-text-light uppercase tracking-wider">Fileira</span>
                        <span className="text-[14px] font-semibold text-brand-text">{generatedTicket.row}</span>
                      </div>
                      <div className="flex-1 flex justify-between items-end">
                        <span className="text-[11px] text-brand-text-light uppercase tracking-wider">Assento</span>
                        <span className="text-[14px] font-semibold text-brand-text">{generatedTicket.seat}</span>
                      </div>
                    </div>
                  </div>

                  <div className="w-[180px] h-[180px] p-[10px] bg-white border border-brand-border mx-auto flex items-center justify-center">
                    <QRCode
                      value={generatedTicket.id}
                      size={158}
                      level="H"
                      className="mx-auto"
                    />
                  </div>
                  <p className="text-center text-[10px] text-brand-text-light mt-[10px] uppercase font-mono">{generatedTicket.id}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={downloadTicket}
                  className="w-full bg-brand-accent text-brand-primary font-semibold py-3.5 rounded-full hover:scale-[0.98] transition-transform text-[14px] tracking-[0.5px] shadow-sm flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Baixar Ingresso (PDF/IMG)
                </button>
                <button
                  onClick={resetForm}
                  className="w-full bg-brand-surface border border-brand-border text-brand-text-light font-semibold py-3.5 rounded-full hover:bg-brand-bg hover:scale-[0.98] transition-all text-[14px] tracking-[0.5px] flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Gerar Próximo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
