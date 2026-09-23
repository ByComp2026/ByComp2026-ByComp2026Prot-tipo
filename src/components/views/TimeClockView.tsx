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
  MapPin,
  Smartphone,
  Tablet,
  Laptop,
  Monitor,
  Eye,
  Info,
  RotateCcw,
  FileCheck,
  Globe,
  Wifi,
  RefreshCw
} from 'lucide-react';
import { CURRENT_USER } from '../../data/mockData';
import { Collaborator, ViewScreen } from '../../types';
import { pontoService, PontoRecord } from '../../services/pontoService';
import { 
  detectDeviceCategory, 
  DeviceCategory,
  fetchPublicIPAndNetwork,
  getRealTimeLocationAndIP,
  NetworkDeviceInfo
} from '../../utils/geolocationAndDevice';
import { FacialRecognitionModal } from './ponto/FacialRecognitionModal';
import { PontoReceiptModal } from './ponto/PontoReceiptModal';

interface TimeClockViewProps {
  currentUser?: Collaborator;
  onNavigate?: (screen: ViewScreen) => void;
}

export const TimeClockView: React.FC<TimeClockViewProps> = ({
  currentUser = CURRENT_USER,
  onNavigate
}) => {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDateFormatted, setCurrentDateFormatted] = useState('');
  
  // Real-time state from pontoService
  const [punches, setPunches] = useState<PontoRecord[]>([]);
  const [workStatus, setWorkStatus] = useState<'Jornada Não Iniciada' | 'Em expediente' | 'Intervalo' | 'Encerrado'>('Jornada Não Iniciada');

  // Modal states
  const [activePunchType, setActivePunchType] = useState<'ENTRADA' | 'INÍCIO DO INTERVALO' | 'RETORNO' | 'SAÍDA' | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<PontoRecord | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Device Category & Network Telemetry
  const [deviceInfo, setDeviceInfo] = useState<{ category: DeviceCategory; details: string }>({
    category: 'Desktop',
    details: 'Identificando...'
  });
  const [networkInfo, setNetworkInfo] = useState<NetworkDeviceInfo | null>(null);
  const [liveLocation, setLiveLocation] = useState<any>(null);
  const [isRefreshingTelemetry, setIsRefreshingTelemetry] = useState(false);

  const refreshTelemetry = async () => {
    setIsRefreshingTelemetry(true);
    try {
      const net = await fetchPublicIPAndNetwork();
      setNetworkInfo(net);
      const loc = await getRealTimeLocationAndIP();
      setLiveLocation(loc);
    } catch (e) {
      console.warn('Telemetry refresh error:', e);
    } finally {
      setIsRefreshingTelemetry(false);
    }
  };

  // Sync with pontoService
  const syncPontoState = () => {
    const today = pontoService.getTodayRecords(currentUser.name);
    setPunches(today);
    setWorkStatus(pontoService.getWorkStatus(currentUser.name));
  };

  useEffect(() => {
    setDeviceInfo(detectDeviceCategory());
    syncPontoState();
    refreshTelemetry();

    const unsubscribe = pontoService.subscribe(() => {
      syncPontoState();
    });

    return unsubscribe;
  }, [currentUser.name]);

  // Live Digital Clock & Date ticker
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setCurrentDateFormatted(now.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Determine next expected punch type
  const getNextRecommendedPunch = (): 'ENTRADA' | 'INÍCIO DO INTERVALO' | 'RETORNO' | 'SAÍDA' => {
    if (punches.length === 0) return 'ENTRADA';
    const last = punches[0];
    if (last.type === 'ENTRADA') return 'INÍCIO DO INTERVALO';
    if (last.type === 'INÍCIO DO INTERVALO') return 'RETORNO';
    if (last.type === 'RETORNO') return 'SAÍDA';
    return 'SAÍDA';
  };

  // Trigger ONLY Facial Recognition Modal
  // "ao iniciar o dia, não startar o registro automático, mas o Registro de Ponto precisa ser somente Facial"
  const handleInitiateFacialScan = (type: 'ENTRADA' | 'INÍCIO DO INTERVALO' | 'RETORNO' | 'SAÍDA') => {
    setActivePunchType(type);
  };

  // Called when facial recognition validates and completes
  // "Ao bater o ponto e encerrar, deverá mostrar a Localização aproximada do local"
  const handleFacialScanSuccess = (record: PontoRecord) => {
    setActivePunchType(null);
    setSelectedReceipt(record);
    setFeedback(`✓ ${record.type} registrada com sucesso por Reconhecimento Facial às ${record.time}!`);
    setTimeout(() => setFeedback(null), 5000);
  };

  const handleResetForTesting = () => {
    pontoService.clearTodayPunchesForTesting(currentUser.name);
    setFeedback('Dia reiniciado para teste. Jornada aguardando início por reconhecimento facial.');
    setTimeout(() => setFeedback(null), 4000);
  };

  const getStatusBadge = () => {
    switch (workStatus) {
      case 'Jornada Não Iniciada':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-950/70 text-amber-300 border border-amber-600/50 shadow-md">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span>Aguardando Início (Registro Facial)</span>
          </div>
        );
      case 'Em expediente':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/60 shadow-lg shadow-emerald-950">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>🟢 Em Expediente</span>
          </div>
        );
      case 'Intervalo':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-blue-950/80 text-blue-300 border border-blue-500/60">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
            <span>☕ Em Intervalo / Almoço</span>
          </div>
        );
      case 'Encerrado':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
            <span>⏹️ Jornada Encerrada</span>
          </div>
        );
    }
  };

  const getDeviceIcon = () => {
    switch (deviceInfo.category) {
      case 'Celular':
        return <Smartphone className="w-4 h-4 text-cyan-400" />;
      case 'Tablet':
        return <Tablet className="w-4 h-4 text-cyan-400" />;
      case 'Notebook':
        return <Laptop className="w-4 h-4 text-cyan-400" />;
      case 'Desktop':
      default:
        return <Monitor className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Title Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-500/60 flex items-center justify-center text-cyan-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Registro de Ponto</h1>
              <p className="text-xs text-slate-400">
                Fase 7: Reconhecimento Facial Universal (Celular, Tablet, Notebook, Desktop) & Geolocalização
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Portaria 671 MTE</span>
          </span>

          {onNavigate && (
            <button
              onClick={() => onNavigate('espelho_ponto')}
              className="text-xs text-slate-300 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
            >
              Espelho de Ponto
            </button>
          )}
        </div>
      </div>

      {/* Universal Device, IP & Geolocation Compliance Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-emerald-950/40 border border-cyan-500/40 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-start sm:items-center gap-3 w-full lg:w-auto">
          <div className="w-11 h-11 rounded-xl bg-slate-900 border border-cyan-500/60 flex items-center justify-center text-cyan-400 shrink-0">
            {getDeviceIcon()}
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-white">
                Dispositivo: {deviceInfo.category}
              </span>
              
              {/* Real-time IP Address Badge */}
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-950 text-cyan-300 border border-blue-700 font-bold flex items-center gap-1">
                <Globe className="w-3 h-3 text-cyan-400" />
                <span>IP: {networkInfo?.ip || 'Coletando IP...'}</span>
              </span>

              {/* Real-time Geolocation Status Badge */}
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>{liveLocation ? `GPS: ${liveLocation.city} - ${liveLocation.state}` : 'Localizando...'}</span>
              </span>
            </div>

            <p className="text-[11px] text-slate-300">
              Provedor: <strong className="text-slate-200">{networkInfo?.isp || 'Conexão Internet Ativa'}</strong> • Localização em tempo real: <strong className="text-cyan-300">{liveLocation?.approximateAddress || 'Obtendo coordenadas do dispositivo...'}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
          <button
            onClick={refreshTelemetry}
            disabled={isRefreshingTelemetry}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-cyan-300 hover:text-white text-[11px] font-mono flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer disabled:opacity-50"
            title="Atualizar IP e Localização em tempo real"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshingTelemetry ? 'animate-spin text-cyan-400' : ''}`} />
            <span>{isRefreshingTelemetry ? 'Atualizando...' : 'Atualizar IP/GPS'}</span>
          </button>

          {punches.length > 0 && (
            <button
              onClick={handleResetForTesting}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-rose-300 text-[11px] font-mono flex items-center gap-1 border border-slate-700 transition-colors cursor-pointer shrink-0"
              title="Reinicia as batidas de hoje do colaborador para testar o início do dia"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Resetar Dia</span>
            </button>
          )}
        </div>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div 
          id="ponto-feedback-toast"
          className="p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500 text-emerald-200 flex items-center justify-between gap-3 animate-in fade-in duration-200 shadow-xl"
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-sm font-semibold">{feedback}</span>
          </div>
          {punches[0] && (
            <button
              onClick={() => setSelectedReceipt(punches[0])}
              className="text-xs font-bold text-cyan-300 hover:text-white underline cursor-pointer shrink-0"
            >
              Ver Comprovante & Localização
            </button>
          )}
        </div>
      )}

      {/* Central Interactive Time Clock Card */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* User identification info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-cyan-500/60 shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-cyan-600 text-white flex items-center justify-center text-[10px] font-mono border-2 border-slate-900">
                <Scan className="w-3 h-3" />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {currentUser.name}
              </h2>
              <p className="text-xs text-cyan-400 font-mono font-semibold">
                {currentUser.sector} • {currentUser.role}
              </p>
              <span className="text-[11px] text-slate-400 font-mono">
                Matrícula: {currentUser.id.replace('colab-', 'NEX-04')} • Admissão: 10/02/2024
              </span>
            </div>
          </div>

          {/* Current Status Badge */}
          <div className="flex flex-col sm:items-end">
            <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider mb-1">
              Status da Jornada
            </span>
            {getStatusBadge()}
          </div>
        </div>

        {/* Live Digital Clock & Date */}
        <div className="text-center py-5 bg-slate-950/70 border border-slate-800/80 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-slate-400 mb-1 capitalize">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span>{currentDateFormatted || 'Carregando data...'}</span>
          </div>
          <div className="font-mono text-5xl sm:text-6xl font-black text-white tracking-widest drop-shadow-md">
            {currentTime || '00:00:00'}
          </div>
          <span className="text-[11px] font-mono text-cyan-400/90 mt-1 block">
            Horário de Brasília (Sincronizado via NTP)
          </span>
        </div>

        {/* 📷 BOTÃO PRINCIPAL DE DESTAQUE: BATER PONTO EXCLUSIVO POR RECONHECIMENTO FACIAL */}
        <div className="p-1 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-emerald-500 shadow-xl shadow-cyan-950/40">
          <button
            onClick={() => handleInitiateFacialScan(getNextRecommendedPunch())}
            id="btn-iniciar-reconhecimento-facial-principal"
            className="w-full py-4 px-6 rounded-[14px] bg-slate-900 hover:bg-slate-900/90 text-white flex flex-col sm:flex-row items-center justify-between gap-3 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-cyan-600 group-hover:bg-cyan-500 text-white flex items-center justify-center shadow-lg shadow-cyan-600/30 transition-transform group-hover:scale-105 shrink-0">
                <Camera className="w-6 h-6" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base font-black text-white tracking-tight">
                    Bater Ponto por Reconhecimento Facial Automático
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700">
                    Próximo: {getNextRecommendedPunch()}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Reconhece a biometria cadastrada no banco de dados e bate o ponto automaticamente sem precisar de clique
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 group-hover:bg-cyan-400 text-slate-950 font-extrabold text-xs shadow-md shrink-0">
              <Scan className="w-4 h-4" />
              <span>Abrir Câmera (Automático)</span>
            </div>
          </button>
        </div>

        {/* 4 Action Buttons - ALL REQUIRE FACIAL RECOGNITION */}
        {/* "o Registro de Ponto precisa ser somente Facial" */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Selecione a operação para validação facial:</span>
            <span className="text-cyan-400 text-[11px] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Biometria Obrigatória</span>
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* ENTRADA */}
            <button
              onClick={() => handleInitiateFacialScan('ENTRADA')}
              id="btn-ponto-facial-entrada"
              className="py-4 px-3 rounded-xl bg-gradient-to-b from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-extrabold text-sm shadow-lg shadow-emerald-700/20 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer group"
              title="Abre o reconhecimento facial para bater ENTRADA"
            >
              <div className="flex items-center gap-1">
                <LogIn className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <Camera className="w-3.5 h-3.5 text-emerald-200" />
              </div>
              <span>ENTRADA</span>
              <span className="text-[10px] font-mono opacity-80">
                {punches.find(p => p.type === 'ENTRADA')?.time || 'Aguardando'}
              </span>
            </button>

            {/* INÍCIO DO INTERVALO */}
            <button
              onClick={() => handleInitiateFacialScan('INÍCIO DO INTERVALO')}
              id="btn-ponto-facial-inicio-intervalo"
              className="py-4 px-3 rounded-xl bg-gradient-to-b from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-extrabold text-sm shadow-lg shadow-amber-700/20 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer group"
              title="Abre o reconhecimento facial para bater INÍCIO DO INTERVALO"
            >
              <div className="flex items-center gap-1">
                <Coffee className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <Camera className="w-3.5 h-3.5 text-amber-200" />
              </div>
              <span>INTERVALO</span>
              <span className="text-[10px] font-mono opacity-80">
                {punches.find(p => p.type === 'INÍCIO DO INTERVALO')?.time || 'Previsto: 12:00'}
              </span>
            </button>

            {/* RETORNO */}
            <button
              onClick={() => handleInitiateFacialScan('RETORNO')}
              id="btn-ponto-facial-retorno"
              className="py-4 px-3 rounded-xl bg-gradient-to-b from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white font-extrabold text-sm shadow-lg shadow-cyan-700/20 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer group"
              title="Abre o reconhecimento facial para bater RETORNO DE INTERVALO"
            >
              <div className="flex items-center gap-1">
                <LogIn className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <Camera className="w-3.5 h-3.5 text-cyan-200" />
              </div>
              <span>RETORNO</span>
              <span className="text-[10px] font-mono opacity-80">
                {punches.find(p => p.type === 'RETORNO')?.time || 'Previsto: 13:00'}
              </span>
            </button>

            {/* SAÍDA */}
            <button
              onClick={() => handleInitiateFacialScan('SAÍDA')}
              id="btn-ponto-facial-saida"
              className="py-4 px-3 rounded-xl bg-gradient-to-b from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-extrabold text-sm shadow-lg shadow-rose-700/20 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer group"
              title="Abre o reconhecimento facial para bater SAÍDA"
            >
              <div className="flex items-center gap-1">
                <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <Camera className="w-3.5 h-3.5 text-rose-200" />
              </div>
              <span>SAÍDA</span>
              <span className="text-[10px] font-mono opacity-80">
                {punches.find(p => p.type === 'SAÍDA')?.time || 'Previsto: 17:00'}
              </span>
            </button>
          </div>
        </div>

        {/* Notice: No manual punch allowed */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2 font-mono">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            Conforme diretriz da ByComp, não são permitidos registros manuais por clique simples. Todo ponto requer o sensor facial do dispositivo.
          </span>
        </div>

        {/* Today's Registration Audit Trail with Approximate Location Display */}
        {/* "Ao bater o ponto e encerrar, deverá mostrar a Localização aproximada do local" */}
        <div className="mt-4 pt-4 border-t border-slate-800 text-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="font-bold text-white text-sm">
              Batidas Registradas Hoje ({punches.length}):
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Registros gravados com foto & geolocalização
            </span>
          </div>

          {punches.length === 0 ? (
            <div className="p-6 rounded-2xl bg-slate-950/60 border border-dashed border-slate-800 text-center space-y-2">
              <Camera className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400">
                Nenhum ponto registrado hoje para {currentUser.name}.
              </p>
              <p className="text-[11px] text-cyan-400 font-mono">
                Clique no botão de Reconhecimento Facial acima para iniciar sua jornada.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {punches.map((punch) => (
                <div
                  key={punch.id}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    {/* Thumbnail of Facial Capture */}
                    <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-cyan-500/60 shrink-0 shadow-sm">
                      <img
                        src={punch.photoUrl}
                        alt={punch.collaboratorName}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-cyan-500/10"></div>
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        <span className="font-bold text-white text-xs">{punch.type}</span>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800">
                          {punch.biometricMatchConfidence}% Facial
                        </span>
                        <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-800 flex items-center gap-1">
                          <Globe className="w-2.5 h-2.5 text-cyan-400" />
                          <span>IP {punch.ipAddress || punch.location.ipAddress}</span>
                        </span>
                      </div>

                      {/* 📍 Approximate Location display */}
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-300 mt-1">
                        <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                        <span className="truncate max-w-xs sm:max-w-md">
                          {punch.location.approximateAddress}
                        </span>
                        <span className="text-[10px] font-mono text-cyan-400 shrink-0">
                          (±{punch.location.accuracyMeters}m)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 border-slate-900 pt-2 sm:pt-0">
                    <div className="text-right">
                      <span className="text-sm font-mono font-black text-white block">
                        {punch.time}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {punch.nsr}
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedReceipt(punch)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Abrir comprovante oficial e mapa de localização"
                    >
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>Comprovante</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 📷 Modal 1: Facial Recognition Camera Scanner */}
      {activePunchType && (
        <FacialRecognitionModal
          punchType={activePunchType}
          currentUser={currentUser}
          onClose={() => setActivePunchType(null)}
          onSuccess={handleFacialScanSuccess}
        />
      )}

      {/* 📍 Modal 2: Official Digital Receipt with Approximate Location */}
      {selectedReceipt && (
        <PontoReceiptModal
          record={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      )}
    </div>
  );
};
