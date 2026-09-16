import React, { useState, useEffect } from 'react';
import {
  Clock,
  Camera,
  CheckCircle2,
  Calendar,
  AlertCircle,
  User,
  Coffee,
  LogIn,
  LogOut,
  Scan,
  ShieldCheck,
  X
} from 'lucide-react';
import { CURRENT_USER } from '../../data/mockData';

export const TimeClockView: React.FC = () => {
  const [currentTime, setCurrentTime] = useState('09:02:44');
  const [workStatus, setWorkStatus] = useState<'Em expediente' | 'Intervalo' | 'Encerrado'>('Em expediente');
  const [logHistory, setLogHistory] = useState<{ type: string; time: string; date: string }[]>([
    { type: 'ENTRADA', time: '08:02', date: '16/09/2026' }
  ]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [capturing, setCapturing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${h}:${m}:${s}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRegister = (type: string) => {
    const nowTime = currentTime.slice(0, 5);
    setLogHistory([{ type, time: nowTime, date: '16/09/2026' }, ...logHistory]);

    if (type === 'INÍCIO DO INTERVALO') setWorkStatus('Intervalo');
    if (type === 'RETORNO') setWorkStatus('Em expediente');
    if (type === 'SAÍDA') setWorkStatus('Encerrado');
    if (type === 'ENTRADA') setWorkStatus('Em expediente');

    setFeedback(`✓ ${type} registrada com sucesso às ${nowTime}!`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleSimulatedCameraCapture = () => {
    setCapturing(true);
    setTimeout(() => {
      setCapturing(false);
      setIsCameraModalOpen(false);
      handleRegister('REGISTRO FOTOGRÁFICO');
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Title Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">Registro de Ponto</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Sistema eletrônico integrado à folha de pagamento e auditoria da ByComp
          </p>
        </div>

        <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-lg">
          Portaria 671 MTE Compliant
        </span>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div 
          id="ponto-feedback-toast"
          className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 flex items-center gap-3 animate-in fade-in duration-200"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-semibold">{feedback}</span>
        </div>
      )}

      {/* Central Interactive Time Clock Card */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* User identification info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div className="flex items-center gap-4">
            <img
              src={CURRENT_USER.avatar}
              alt={CURRENT_USER.name}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-cyan-500/60 shadow-lg"
            />
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {CURRENT_USER.name}
              </h2>
              <p className="text-xs text-cyan-400 font-mono font-semibold">
                {CURRENT_USER.sector} • {CURRENT_USER.role}
              </p>
              <span className="text-[11px] text-slate-400 font-mono">
                Matrícula: NEX-0482 • Admissão: 10/02/2024
              </span>
            </div>
          </div>

          {/* Current Status Badge */}
          <div className="flex flex-col sm:items-end">
            <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider mb-1">
              Status Atual
            </span>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${
              workStatus === 'Em expediente'
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/60 shadow-lg shadow-emerald-950'
                : workStatus === 'Intervalo'
                  ? 'bg-amber-950/80 text-amber-300 border-amber-500/60'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span>🟢 {workStatus}</span>
            </div>
          </div>
        </div>

        {/* Live Digital Clock & Date */}
        <div className="text-center py-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl">
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-slate-400 mb-1">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span>Data: <strong>16/09/2026</strong></span>
          </div>
          <div className="font-mono text-4xl sm:text-6xl font-black text-white tracking-widest drop-shadow-md">
            {currentTime}
          </div>
          <span className="text-[11px] font-mono text-cyan-400/90 mt-1 block">
            Horário de Brasília (Sincronizado via NTP)
          </span>
        </div>

        {/* 4 Main Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* ENTRADA */}
          <button
            onClick={() => handleRegister('ENTRADA')}
            id="btn-ponto-entrada"
            className="py-4 px-3 rounded-xl bg-gradient-to-b from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-extrabold text-sm shadow-lg shadow-emerald-700/20 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer group"
          >
            <LogIn className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>ENTRADA</span>
            <span className="text-[10px] font-mono opacity-80">Registrado: 08:02</span>
          </button>

          {/* INÍCIO DO INTERVALO */}
          <button
            onClick={() => handleRegister('INÍCIO DO INTERVALO')}
            id="btn-ponto-inicio-intervalo"
            className="py-4 px-3 rounded-xl bg-gradient-to-b from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-extrabold text-sm shadow-lg shadow-amber-700/20 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer group"
          >
            <Coffee className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>INÍCIO DO INTERVALO</span>
            <span className="text-[10px] font-mono opacity-80">Previsto: 12:00</span>
          </button>

          {/* RETORNO */}
          <button
            onClick={() => handleRegister('RETORNO')}
            id="btn-ponto-retorno"
            className="py-4 px-3 rounded-xl bg-gradient-to-b from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white font-extrabold text-sm shadow-lg shadow-cyan-700/20 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer group"
          >
            <LogIn className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>RETORNO</span>
            <span className="text-[10px] font-mono opacity-80">Previsto: 13:00</span>
          </button>

          {/* SAÍDA */}
          <button
            onClick={() => handleRegister('SAÍDA')}
            id="btn-ponto-saida"
            className="py-4 px-3 rounded-xl bg-gradient-to-b from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-extrabold text-sm shadow-lg shadow-rose-700/20 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer group"
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>SAÍDA</span>
            <span className="text-[10px] font-mono opacity-80">Previsto: 17:00</span>
          </button>
        </div>

        {/* 📷 Registrar com câmera Button */}
        <div className="pt-2">
          <button
            onClick={() => setIsCameraModalOpen(true)}
            id="btn-registrar-com-camera"
            className="w-full py-3.5 px-4 rounded-xl bg-slate-800/90 hover:bg-slate-750 border border-slate-700 hover:border-cyan-500/80 text-cyan-300 hover:text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Camera className="w-4 h-4 text-cyan-400" />
            <span>📷 Registrar com câmera</span>
            <span className="text-[10px] text-slate-400 font-mono font-normal">
              (Simulação Biométrica)
            </span>
          </button>
        </div>

        {/* Today's Registration Audit Trail */}
        <div className="mt-4 pt-4 border-t border-slate-800 text-xs">
          <span className="font-semibold text-slate-400 block mb-2">
            Batidas Registradas Hoje:
          </span>
          <div className="space-y-1.5 font-mono">
            {logHistory.map((log, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-950/70 border border-slate-800"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="font-bold text-white">{log.type}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                  <span>{log.date}</span>
                  <span className="text-cyan-300 font-bold">{log.time}</span>
                  <span className="text-emerald-400 text-[10px]">Autenticado</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Simulated Camera Window Modal */}
      {isCameraModalOpen && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div 
            id="modal-camera-biometric"
            className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4 relative overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Scan className="w-4 h-4 text-cyan-400 animate-pulse" />
                <h3 className="text-sm font-bold text-white">Reconhecimento Visual (Simulado)</h3>
              </div>
              <button
                onClick={() => setIsCameraModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Camera Viewfinder Box */}
            <div className="relative w-full aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
              {/* Target reticle animation */}
              <div className="absolute inset-6 border-2 border-dashed border-cyan-500/50 rounded-2xl flex items-center justify-center pointer-events-none">
                <div className="w-28 h-28 rounded-full border-2 border-cyan-400/80 animate-pulse flex items-center justify-center">
                  <User className="w-12 h-12 text-slate-600" />
                </div>
              </div>

              {/* Scanning horizontal laser line */}
              <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-bounce opacity-80"></div>

              {/* Overlay metadata */}
              <div className="absolute top-2 left-3 text-[10px] font-mono text-cyan-300 bg-slate-900/80 px-2 py-0.5 rounded border border-cyan-800/60">
                REC 60FPS • HD 1080p
              </div>

              <div className="absolute bottom-2 inset-x-3 flex items-center justify-between text-[10px] font-mono text-slate-400 bg-slate-900/80 px-2 py-1 rounded">
                <span>GEO: -23.5505, -46.6333</span>
                <span className="text-emerald-400">Rosto Enquadrado</span>
              </div>
            </div>

            <div className="text-xs text-slate-400 text-center">
              Posicione o rosto dentro da moldura para autenticação do ponto diário.
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <span className="text-[10px] text-slate-500 font-mono">
                Sem armazenamento biométrico invasivo
              </span>

              <button
                onClick={handleSimulatedCameraCapture}
                disabled={capturing}
                id="btn-capturar-ponto-camera"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 flex items-center gap-2 transition-all cursor-pointer"
              >
                {capturing ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                    <span>Validando...</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4" />
                    <span>Capturar Ponto</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
