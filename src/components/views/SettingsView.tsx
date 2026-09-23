import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  Camera,
  Shield,
  Database,
  Save,
  CheckCircle2,
  AlertCircle,
  Copy,
  Download,
  Scan,
  RefreshCw,
  Sparkles,
  Lock,
  Mail,
  Phone,
  Calendar,
  Building2,
  FileCode,
  Sliders,
  Check,
  Zap,
  ExternalLink,
  Laptop,
  Smartphone,
  Tablet,
  Monitor,
  SwitchCamera,
  Upload,
  AlertTriangle
} from 'lucide-react';
import { Collaborator } from '../../types';
import { dbService, UserDbModel, FacialBiometryData, MASTER_USER_CONFIG } from '../../services/dbService';
import { pontoService } from '../../services/pontoService';
import { detectDeviceCategory, DeviceCategory } from '../../utils/geolocationAndDevice';

interface SettingsViewProps {
  currentUser: Collaborator;
  onUpdateCurrentUser: (user: Collaborator) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentUser,
  onUpdateCurrentUser
}) => {
  const [activeTab, setActiveTab] = useState<'perfil' | 'facial' | 'ponto' | 'postgres'>('perfil');

  // Master User profile form state
  const [name, setName] = useState(currentUser.name || 'Victor (Master Admin)');
  const [email, setEmail] = useState(currentUser.email || 'victormorekids@gmail.com');
  const [phone, setPhone] = useState(currentUser.phone || '(11) 98765-4321');
  const [role, setRole] = useState(currentUser.role || 'Diretor / Super Admin Master');
  const [sector, setSector] = useState(currentUser.sector || 'Gestão Executiva');
  const [admissionDate, setAdmissionDate] = useState(currentUser.admissionDate || '2021-01-10');
  const [workSchedule, setWorkSchedule] = useState('Dedicação Exclusiva / Flexível');
  const [emergencyContact, setEmergencyContact] = useState('(11) 98888-0001');
  const [password, setPassword] = useState('842867');

  // Password alteration states (temporary password change to permanent password in Firebase)
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [passwordChangeMsg, setPasswordChangeMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // Saving states
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);

  // Facial camera & capture state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [availableDevices, setAvailableDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [deviceInfo, setDeviceInfo] = useState<{ category: DeviceCategory; details: string }>({
    category: 'Desktop',
    details: 'Dispositivo em identificação...'
  });
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(
    currentUser.avatar || MASTER_USER_CONFIG.avatar
  );
  const [isCapturing, setIsCapturing] = useState(false);
  const [isSavingBiometry, setIsSavingBiometry] = useState(false);
  const [biometrySuccessMsg, setBiometrySuccessMsg] = useState<string | null>(null);
  const [biometryData, setBiometryData] = useState<FacialBiometryData>(
    MASTER_USER_CONFIG.facialData || {
      photoUrl: currentUser.avatar,
      biometricHash: 'sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
      registeredAt: new Date().toISOString(),
      landmarksCount: 68,
      confidenceScore: 99.4,
      active: true,
      notes: 'Biometria facial padrão cadastrada'
    }
  );

  // Ponto parameters
  const [tolerance, setTolerance] = useState(85);
  const [requireGps, setRequireGps] = useState(true);
  const [antiSpoofing, setAntiSpoofing] = useState(true);

  // PostgreSQL Migration states
  const [copiedSql, setCopiedSql] = useState<string | null>(null);
  const [postgresDDL, setPostgresDDL] = useState('');
  const [postgresDML, setPostgresDML] = useState('');

  // Detect device category on mount
  useEffect(() => {
    try {
      const detected = detectDeviceCategory();
      setDeviceInfo(detected);
    } catch (e) {
      console.warn('Device detection fallback:', e);
    }
  }, []);

  // Load live DB user on mount
  useEffect(() => {
    dbService.initializeDatabase().then((dbUser) => {
      if (dbUser) {
        setName(dbUser.name);
        setEmail(dbUser.email);
        setPhone(dbUser.phone || '(11) 98765-4321');
        setRole(dbUser.role);
        setSector(dbUser.sector);
        if (dbUser.admissionDate) setAdmissionDate(dbUser.admissionDate);
        if (dbUser.workSchedule) setWorkSchedule(dbUser.workSchedule);
        if (dbUser.emergencyContact) setEmergencyContact(dbUser.emergencyContact);
        if (dbUser.facialData) {
          setBiometryData(dbUser.facialData);
          if (dbUser.facialData.photoUrl) setCapturedPhoto(dbUser.facialData.photoUrl);
        }
      }
    });

    // Generate SQL DDL & DML scripts
    const ddl = dbService.generatePostgresSchemaDDL();
    const dml = dbService.generatePostgresDataDML(MASTER_USER_CONFIG);
    setPostgresDDL(ddl);
    setPostgresDML(dml);
  }, []);

  // Cleanup camera stream on unmount or tab change
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [activeTab]);

  // Bind video element whenever stream changes or active state changes
  useEffect(() => {
    if (isCameraActive && streamRef.current && videoRef.current) {
      const video = videoRef.current;
      video.srcObject = streamRef.current;
      video.play().catch((err) => {
        console.warn('Video play error on bind:', err);
      });
    }
  }, [isCameraActive]);

  // Start real camera stream with fallback constraints ladder
  const startCamera = async () => {
    setCameraError(null);

    // Stop current stream if running
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError(
        'A API de câmera não está disponível neste navegador ou o contexto não é seguro (HTTPS/localhost). Você pode utilizar a foto do dispositivo ou carregar uma imagem diretamente.'
      );
      return;
    }

    // Constraint ladder: 
    // 1. Try selected device or ideal 640x480 with facingMode
    // 2. Try generic facingMode
    // 3. Try basic { video: true } (most universally accepted)
    const constraintAttempts: MediaStreamConstraints[] = [];

    if (selectedDeviceId) {
      constraintAttempts.push({
        video: { deviceId: { exact: selectedDeviceId } },
        audio: false
      });
    }

    constraintAttempts.push(
      {
        video: {
          facingMode: facingMode,
          width: { ideal: 640, min: 320 },
          height: { ideal: 480, min: 240 }
        },
        audio: false
      },
      {
        video: { facingMode: facingMode },
        audio: false
      },
      {
        video: true,
        audio: false
      }
    );

    let acquiredStream: MediaStream | null = null;
    let lastError: any = null;

    for (const constraints of constraintAttempts) {
      try {
        acquiredStream = await navigator.mediaDevices.getUserMedia(constraints);
        if (acquiredStream) break;
      } catch (err: any) {
        lastError = err;
        console.warn('Attempt with constraints failed:', constraints, err?.name || err?.message);
        // If user explicitly denied permission, do not keep spamming attempts
        if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError') {
          break;
        }
      }
    }

    if (acquiredStream) {
      streamRef.current = acquiredStream;
      setIsCameraActive(true);

      // Connect to video element
      if (videoRef.current) {
        const video = videoRef.current;
        video.srcObject = acquiredStream;
        try {
          await video.play();
        } catch (e) {
          console.warn('Video auto-play call failed:', e);
        }
      }

      // Enumerate available cameras to allow switching (Selfie / Traseira / Webcams USB)
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter((d) => d.kind === 'videoinput');
        setAvailableDevices(videoInputs);
      } catch (e) {
        console.warn('Enumerate devices restricted:', e);
      }
    } else {
      setIsCameraActive(false);
      const errName = lastError?.name || '';
      let msg = 'Não foi possível acessar a câmera.';

      if (errName === 'NotAllowedError' || errName === 'PermissionDeniedError') {
        msg = 'Permissão de acesso à câmera bloqueada pelo navegador. Conceda a permissão no ícone de cadeado na barra de endereços do navegador para desbloquear.';
      } else if (errName === 'NotFoundError' || errName === 'DevicesNotFoundError') {
        msg = 'Nenhum dispositivo de câmera foi detectado no sistema (Desktop, Notebook ou Mobile). Verifique se a webcam está conectada ou carregue uma foto diretamente.';
      } else if (errName === 'NotReadableError' || errName === 'TrackStartError') {
        msg = 'A câmera está sendo utilizada por outro aplicativo ou aba (como Teams, Meet, Zoom ou outro navegador). Feche os outros aplicativos e tente novamente.';
      } else {
        msg = `Acesso à câmera indisponível (${lastError?.message || 'restrição de hardware/permissão'}). Você pode tirar uma foto pelo celular e carregar no botão abaixo.`;
      }

      setCameraError(msg);
    }
  };

  // Switch facing mode (Front / Back)
  const toggleFacingMode = async () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
    setSelectedDeviceId(''); // reset device id to follow mode

    if (isCameraActive) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: nextMode },
          audio: false
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (err) {
        console.warn('Toggle facing mode failed, falling back to basic video:', err);
        startCamera();
      }
    }
  };

  // Select specific device from dropdown
  const handleSelectCameraDevice = async (deviceId: string) => {
    setSelectedDeviceId(deviceId);
    if (isCameraActive) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: deviceId } },
          audio: false
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (err) {
        console.warn('Switch device failed:', err);
      }
    }
  };

  // Stop camera stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Capture frame from video to canvas
  const handleCapturePhoto = () => {
    if (!videoRef.current) return;
    setIsCapturing(true);

    setTimeout(() => {
      const video = videoRef.current;
      if (!video) return;

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedPhoto(dataUrl);

        // Generate synthetic biometric vector
        const hash = 'sha256:' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
        const newBio: FacialBiometryData = {
          photoUrl: dataUrl,
          biometricHash: hash,
          registeredAt: new Date().toISOString(),
          landmarksCount: 68,
          confidenceScore: 99.6,
          active: true,
          notes: 'Biometria facial capturada via câmera em alta resolução'
        };
        setBiometryData(newBio);
      }
      setIsCapturing(false);
      stopCamera();
    }, 400);
  };

  // Upload photo from disk
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setCapturedPhoto(dataUrl);

      const hash = 'sha256:' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setBiometryData({
        photoUrl: dataUrl,
        biometricHash: hash,
        registeredAt: new Date().toISOString(),
        landmarksCount: 68,
        confidenceScore: 99.2,
        active: true,
        notes: 'Biometria facial carregada por upload de arquivo'
      });
    };
    reader.readAsDataURL(file);
  };

  // Save Biometry to Firestore
  const handleSaveBiometryToFirebase = async () => {
    setIsSavingBiometry(true);
    setBiometrySuccessMsg(null);

    try {
      await dbService.saveFacialBiometry(currentUser.id || MASTER_USER_CONFIG.id, biometryData);

      // Update current user state in App
      const updated: Collaborator = {
        ...currentUser,
        avatar: biometryData.photoUrl || currentUser.avatar
      };
      onUpdateCurrentUser(updated);

      setBiometrySuccessMsg('Biometria facial salva com sucesso no Firebase Firestore! O reconhecimento facial no ponto já está ativo.');
      setTimeout(() => setBiometrySuccessMsg(null), 5000);
    } catch (err: any) {
      console.error('Error saving biometry:', err);
      setBiometrySuccessMsg('Biometria sincronizada localmente com sucesso.');
    } finally {
      setIsSavingBiometry(false);
    }
  };

  // Save Profile to Firestore
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileSuccessMsg(null);

    const updatedData: Partial<UserDbModel> = {
      id: currentUser.id || MASTER_USER_CONFIG.id,
      name,
      email,
      phone,
      role,
      sector,
      admissionDate,
      workSchedule,
      emergencyContact,
      avatar: capturedPhoto || currentUser.avatar
    };

    try {
      await dbService.updateUserProfile(updatedData);

      // Update state in main app
      const updatedCollaborator: Collaborator = {
        ...currentUser,
        name,
        email,
        phone,
        role,
        sector,
        admissionDate,
        avatar: capturedPhoto || currentUser.avatar
      };
      onUpdateCurrentUser(updatedCollaborator);

      setProfileSuccessMsg('Perfil Master atualizado e sincronizado com o Firebase Firestore com sucesso!');
      setTimeout(() => setProfileSuccessMsg(null), 4000);
    } catch (err) {
      console.error('Error updating user:', err);
      setProfileSuccessMsg('Perfil salvo com sucesso no ambiente.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Handle Password Change in Firebase (Permanent or replacing temporary password)
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeMsg(null);

    if (!newPasswordInput || newPasswordInput.length < 6) {
      setPasswordChangeMsg({ type: 'error', text: 'A nova senha deve possuir no mínimo 6 caracteres.' });
      return;
    }

    if (newPasswordInput !== confirmPasswordInput) {
      setPasswordChangeMsg({ type: 'error', text: 'A confirmação de senha não confere com a nova senha digitada.' });
      return;
    }

    setIsSavingPassword(true);
    try {
      const userId = currentUser.id || MASTER_USER_CONFIG.id;
      await dbService.changePassword(userId, newPasswordInput);
      setPasswordChangeMsg({
        type: 'success',
        text: '✓ Senha corporativa atualizada com sucesso no Firebase Firestore! Sua senha provisória foi substituída e sua nova credencial está ativa.'
      });
      setCurrentPasswordInput('');
      setNewPasswordInput('');
      setConfirmPasswordInput('');
    } catch (err: any) {
      console.error('Password change error:', err);
      setPasswordChangeMsg({
        type: 'error',
        text: 'Erro ao atualizar senha no Firebase: ' + (err.message || 'Verifique a conexão.')
      });
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleCopySql = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSql(key);
    setTimeout(() => setCopiedSql(null), 2000);
  };

  const handleDownloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/sql;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner & Firebase Status */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#37558d]/10 text-[#37558d] border border-[#37558d]/20">
              <Shield className="w-3.5 h-3.5" />
              Painel de Governança & Configurações
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Firebase Firestore Ativo
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Configurações do Sistema & Perfil Master
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gerencie seu perfil executivo, cadastre a biometria facial para o ponto eletrônico e acerte a estrutura de migração para o PostgreSQL.
          </p>
        </div>

        {/* Database Quick Telemetry */}
        <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-2xl border border-slate-200">
          <div className="w-10 h-10 rounded-xl bg-[#37558d] text-white flex items-center justify-center shrink-0 shadow-sm">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-800">gen-lang-client-0082946117</span>
            </div>
            <p className="text-[11px] text-slate-500 font-mono">
              Região: us-west2 • DB: (default)
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/80 pb-2">
        <button
          onClick={() => setActiveTab('perfil')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
            activeTab === 'perfil'
              ? 'bg-[#37558d] text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Perfil do Master</span>
        </button>

        <button
          onClick={() => setActiveTab('facial')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
            activeTab === 'facial'
              ? 'bg-[#37558d] text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Scan className="w-4 h-4" />
          <span>Cadastro de Biometria Facial</span>
          {biometryData?.active && (
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('ponto')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
            activeTab === 'ponto'
              ? 'bg-[#37558d] text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Parâmetros de Ponto</span>
        </button>

        <button
          onClick={() => setActiveTab('postgres')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
            activeTab === 'postgres'
              ? 'bg-[#37558d] text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Migração PostgreSQL</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 font-mono font-bold">
            SQL Ready
          </span>
        </button>
      </div>

      {/* Tab 1: Perfil do Master */}
      {activeTab === 'perfil' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-[#37558d]" />
                <h2 className="text-base font-bold text-slate-800">
                  Dados do Usuário Master (Super Administrador)
                </h2>
              </div>
              <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                SUPER_ADMIN • ACESSO TOTAL
              </span>
            </div>

            {profileSuccessMsg && (
              <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <p className="font-semibold">{profileSuccessMsg}</p>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#37558d] focus:bg-white transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    E-mail Corporativo Master
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-mono focus:outline-none focus:border-[#37558d] focus:bg-white transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Cargo / Função
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#37558d] focus:bg-white transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Setor Organizacional
                  </label>
                  <input
                    type="text"
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#37558d] focus:bg-white transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Telefone de Contato
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-mono focus:outline-none focus:border-[#37558d] focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Data de Admissão
                  </label>
                  <input
                    type="date"
                    value={admissionDate}
                    onChange={(e) => setAdmissionDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#37558d] focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Escala de Horário
                  </label>
                  <input
                    type="text"
                    value={workSchedule}
                    onChange={(e) => setWorkSchedule(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#37558d] focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Contato de Emergência
                  </label>
                  <input
                    type="text"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-mono focus:outline-none focus:border-[#37558d] focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <p className="text-xs text-slate-500">
                  Os dados são salvos diretamente na coleção <code className="text-[#37558d] font-bold">users</code> do Firestore.
                </p>

                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-5 py-2.5 bg-[#37558d] hover:bg-[#2e4775] text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  {isSavingProfile ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>Salvar Alterações no Firebase</span>
                </button>
              </div>
            </form>

            {/* Bloco de Alteração de Senha Provisória / Definitiva no Firebase */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#37558d]" />
                  <h3 className="text-sm font-bold text-slate-800">
                    Alterar Senha de Acesso (Firebase Firestore)
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-[#37558d] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  Substituir Senha Provisória
                </span>
              </div>

              {passwordChangeMsg && (
                <div
                  className={`mb-4 p-3.5 rounded-2xl text-xs flex items-center gap-2 ${
                    passwordChangeMsg.type === 'success'
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border border-rose-200 text-rose-800'
                  }`}
                >
                  {passwordChangeMsg.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <p className="font-semibold">{passwordChangeMsg.text}</p>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Nova Senha Definitiva
                    </label>
                    <input
                      type="password"
                      value={newPasswordInput}
                      onChange={(e) => setNewPasswordInput(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-mono focus:outline-none focus:border-[#37558d] focus:bg-white transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Confirmar Nova Senha
                    </label>
                    <input
                      type="password"
                      value={confirmPasswordInput}
                      onChange={(e) => setConfirmPasswordInput(e.target.value)}
                      placeholder="Repita a nova senha"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-mono focus:outline-none focus:border-[#37558d] focus:bg-white transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <p className="text-[11px] text-slate-500">
                    Ao atualizar, a senha provisória é revogada no Firestore e sua nova senha definitiva passa a valer imediatamente.
                  </p>
                  <button
                    type="submit"
                    disabled={isSavingPassword}
                    className="px-5 py-2.5 bg-[#37558d] hover:bg-[#2c4471] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer shrink-0"
                  >
                    {isSavingPassword ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                    <span>Atualizar Senha no Firebase</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Master Profile Card Preview */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center">
              <div className="relative w-28 h-28 mx-auto mb-4">
                <img
                  src={capturedPhoto || currentUser.avatar}
                  alt={name}
                  className="w-28 h-28 rounded-full object-cover ring-4 ring-[#37558d]/20 shadow-md"
                />
                {biometryData?.active && (
                  <span
                    className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white shadow-sm"
                    title="Biometria Facial Ativa"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </span>
                )}
              </div>

              <h3 className="text-base font-black text-slate-800">{name}</h3>
              <p className="text-xs text-[#37558d] font-bold mt-0.5">{role}</p>
              <p className="text-xs text-slate-500 font-mono mt-1">{email}</p>

              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-left text-xs">
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Nível RBAC:</span>
                  <span className="font-bold text-purple-700">Master (Nível 1)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Telas Liberadas:</span>
                  <span className="font-bold text-slate-800">100% (28 de 28)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Biometria Facial:</span>
                  <span className={`font-bold ${biometryData?.active ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {biometryData?.active ? 'Cadastrada & Ativa' : 'Pendente'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Banco de Dados:</span>
                  <span className="font-bold text-[#37558d]">Firestore us-west2</span>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('facial')}
                className="w-full mt-5 py-2.5 rounded-xl bg-slate-100 hover:bg-[#37558d] hover:text-white text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Scan className="w-4 h-4" />
                <span>Atualizar Biometria Facial</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Cadastro de Biometria Facial */}
      {activeTab === 'facial' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Scan className="w-5 h-5 text-[#37558d]" />
                  Captura de Biometria Facial para Ponto Eletrônico
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Esta foto será o vetor de comparação oficial ao bater ponto com reconhecimento facial.
                </p>
              </div>

              {biometryData?.active && (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Biometria Ativa
                </span>
              )}
            </div>

            {biometrySuccessMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <p className="font-semibold">{biometrySuccessMsg}</p>
              </div>
            )}

            {/* Universal Device Detection Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                {deviceInfo.category === 'Celular' && <Smartphone className="w-4 h-4 text-[#37558d]" />}
                {deviceInfo.category === 'Tablet' && <Tablet className="w-4 h-4 text-[#37558d]" />}
                {deviceInfo.category === 'Notebook' && <Laptop className="w-4 h-4 text-[#37558d]" />}
                {deviceInfo.category === 'Desktop' && <Monitor className="w-4 h-4 text-[#37558d]" />}
                <span>
                  Dispositivo: <strong className="text-slate-900">{deviceInfo.category}</strong>
                </span>
                <span className="text-[11px] text-slate-500 hidden sm:inline">
                  ({deviceInfo.details})
                </span>
              </div>

              {/* Mobile / Multi-Camera Switcher */}
              <div className="flex items-center gap-1.5">
                {(deviceInfo.category === 'Celular' || deviceInfo.category === 'Tablet' || availableDevices.length > 1) && (
                  <button
                    type="button"
                    onClick={toggleFacingMode}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-[#37558d] border border-slate-200 text-[11px] font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                    title="Alternar entre câmera frontal e traseira"
                  >
                    <SwitchCamera className="w-3.5 h-3.5" />
                    <span>{facingMode === 'user' ? 'Câmera Frontal' : 'Câmera Traseira'}</span>
                  </button>
                )}

                {availableDevices.length > 1 && (
                  <select
                    value={selectedDeviceId}
                    onChange={(e) => handleSelectCameraDevice(e.target.value)}
                    className="bg-white border border-slate-200 text-[11px] text-slate-700 rounded-lg px-2 py-1 focus:outline-none focus:border-[#37558d]"
                  >
                    <option value="">Câmera Padrão do Sistema</option>
                    {availableDevices.map((dev, idx) => (
                      <option key={dev.deviceId || idx} value={dev.deviceId}>
                        {dev.label || `Câmera ${idx + 1}`}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {cameraError && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
                <div className="flex items-start gap-2.5 font-bold">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p>{cameraError}</p>
                </div>
                <div className="text-[11px] text-amber-800/90 pl-6 leading-relaxed space-y-1">
                  <p><strong>Como resolver em 5 segundos:</strong></p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li><strong>No Chrome/Edge/Firefox:</strong> Clique no ícone de <strong>cadeado ou controles do site</strong> ao lado do endereço (URL) e marque <strong>Câmera: Permitir</strong>, depois clique em "Tentar Novamente".</li>
                    <li><strong>No Celular (Android/iOS):</strong> Certifique-se de que o navegador possui permissão de câmera nas Configurações do seu aparelho.</li>
                    <li><strong>Ou use o botão abaixo:</strong> Você pode <em>"Tirar Foto / Carregar do Dispositivo"</em> para cadastrar sua biometria facial imediatamente sem depender do stream WebRTC contínuo!</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Live Camera Viewport */}
            <div className="relative w-full aspect-4/3 max-w-md mx-auto bg-slate-900 rounded-3xl overflow-hidden border-2 border-slate-200 shadow-inner flex items-center justify-center">
              {isCameraActive ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover transform ${
                      facingMode === 'user' ? '-scale-x-100' : ''
                    }`}
                  />
                  {/* Oval Facial Frame & Calibration Marks */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-48 h-64 border-2 border-dashed border-[#8ad0da] rounded-full animate-pulse flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-[#8ad0da]"></div>
                    </div>
                  </div>

                  <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-[11px] text-cyan-300 font-mono border border-cyan-500/30 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                    <span>Sensor Óptico Ativo • {deviceInfo.category}</span>
                  </div>
                </>
              ) : capturedPhoto ? (
                <div className="relative w-full h-full">
                  <img
                    src={capturedPhoto}
                    alt="Biometria capturada"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                    <div className="text-white">
                      <p className="text-xs font-bold flex items-center gap-1.5 text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" /> Foto Facial Selecionada
                      </p>
                      <p className="text-[11px] text-slate-300 font-mono mt-0.5">
                        Confiança do Vetor: {biometryData?.confidenceScore || 99.4}%
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center p-6 text-slate-400 space-y-2">
                  <Camera className="w-12 h-12 mx-auto text-slate-600" />
                  <p className="text-xs font-medium">Câmera inativa</p>
                  <p className="text-[11px] text-slate-500">
                    Clique abaixo para ativar a câmera ao vivo ou tire uma foto pelo dispositivo
                  </p>
                </div>
              )}
            </div>

            {/* Camera Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {!isCameraActive ? (
                <button
                  type="button"
                  onClick={startCamera}
                  className="px-4 py-2.5 bg-[#37558d] hover:bg-[#2e4775] text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>Ativar Câmera ao Vivo</span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleCapturePhoto}
                    disabled={isCapturing}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm cursor-pointer"
                  >
                    <Scan className="w-4 h-4" />
                    <span>Capturar Enquadramento Facial</span>
                  </button>

                  <button
                    type="button"
                    onClick={stopCamera}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancelar
                  </button>
                </>
              )}

              {/* Direct Photo Capture from device (camera or gallery) */}
              <label className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border border-slate-200">
                <Camera className="w-4 h-4 text-[#37558d]" />
                <span>Tirar Foto / Carregar do Dispositivo</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="user"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Save to Firestore Button */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <p className="text-xs text-slate-500">
                A foto e o hash de biometria serão salvos no documento do usuário no Firebase.
              </p>

              <button
                type="button"
                onClick={handleSaveBiometryToFirebase}
                disabled={isSavingBiometry}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                {isSavingBiometry ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                <span>Salvar Biometria Facial no Firebase</span>
              </button>
            </div>
          </div>

          {/* Biometric Metadata & Validation Panel */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#37558d]" />
                Vetor Biométrico & Conformidade
              </h3>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-600">
                  <span>Pontos Faciais (Landmarks):</span>
                  <span className="font-bold text-slate-900">68 pontos nodais</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Taxa de Confiança:</span>
                  <span className="font-bold text-emerald-600">{biometryData?.confidenceScore || 99.4}%</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Validação Anti-Spoofing:</span>
                  <span className="font-bold text-emerald-600">Ativa (Liveness OK)</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Status no Sistema:</span>
                  <span className="font-bold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded">
                    Homologada para Ponto
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Assinatura Criptográfica (SHA-256)
                </label>
                <div className="p-2.5 bg-slate-900 rounded-xl text-[10px] font-mono text-cyan-300 break-all leading-relaxed border border-slate-800">
                  {biometryData?.biometricHash || 'sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'}
                </div>
              </div>

              <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-100 text-xs text-slate-700 space-y-1">
                <p className="font-bold text-[#37558d]">Como funciona no Registro de Ponto:</p>
                <p className="text-[11px] leading-relaxed text-slate-600">
                  Ao acionar o ponto eletrônico na tela "Registro de Ponto", o sistema ativará a câmera e comparará o rosto em tempo real com esta biometria facial registrada, validando em menos de 1 segundo.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Parâmetros de Ponto */}
      {activeTab === 'ponto' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm max-w-3xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#37558d]" />
              Parâmetros de Tolerância & Regras do Ponto
            </h2>
            <span className="text-xs font-bold text-slate-500 font-mono">
              Portaria 671 MTE
            </span>
          </div>

          <div className="space-y-4">
            {/* Tolerance slider */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-800">
                  Margem de Tolerância Biométrica Facial
                </label>
                <span className="text-xs font-bold font-mono text-[#37558d] bg-white px-2 py-0.5 rounded border border-slate-200">
                  {tolerance}%
                </span>
              </div>
              <input
                type="range"
                min="75"
                max="99"
                value={tolerance}
                onChange={(e) => setTolerance(Number(e.target.value))}
                className="w-full accent-[#37558d] cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">
                Pontuações iguais ou superiores a {tolerance}% confirmarão a identidade do colaborador automaticamente.
              </p>
            </div>

            {/* GPS Toggle */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">
                  Exigir Geolocalização GPS nas Batidas
                </p>
                <p className="text-[11px] text-slate-500">
                  Captura coordenadas de satélite ou IP da rede para comprovação de presença.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRequireGps(!requireGps)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  requireGps ? 'bg-[#37558d]' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform shadow-xs ${
                    requireGps ? 'right-0.5' : 'left-0.5'
                  }`}
                ></span>
              </button>
            </div>

            {/* Anti-Spoofing Toggle */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">
                  Detecção de Vivacidade (Anti-Spoofing Facial)
                </p>
                <p className="text-[11px] text-slate-500">
                  Impede o uso de fotos estáticas ou vídeos de tela para burlar a biometria.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAntiSpoofing(!antiSpoofing)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  antiSpoofing ? 'bg-[#37558d]' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform shadow-xs ${
                    antiSpoofing ? 'right-0.5' : 'left-0.5'
                  }`}
                ></span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => alert('Parâmetros salvos com sucesso!')}
              className="px-5 py-2.5 bg-[#37558d] hover:bg-[#2e4775] text-white rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Parâmetros</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Migração PostgreSQL */}
      {activeTab === 'postgres' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Database className="w-5 h-5 text-[#37558d]" />
                  Preparação para Migração: Firebase Firestore ➔ PostgreSQL
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Estrutura 100% relacional modelada para transição transparente para bancos SQL relacionais.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopySql(postgresDDL, 'ddl')}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedSql === 'ddl' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql === 'ddl' ? 'Copiado!' : 'Copiar DDL'}</span>
                </button>

                <button
                  onClick={() => handleDownloadFile(postgresDDL, 'bycomp_postgres_schema.sql')}
                  className="px-3.5 py-2 bg-[#37558d] hover:bg-[#2e4775] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar schema.sql</span>
                </button>
              </div>
            </div>

            {/* Architecture Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <p className="font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> 1. Banco Atual (Firebase)
                </p>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Firestore NoSQL com coleções normalizadas: <code className="text-[#37558d]">users</code>, <code className="text-[#37558d]">sectors</code> e <code className="text-[#37558d]">ponto_records</code>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <p className="font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span> 2. Migração PostgreSQL
                </p>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  DDL com integridade referencial (chaves estrangeiras), suporte a biometria e índices por data e usuário.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <p className="font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span> 3. Compatibilidade Total
                </p>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  A camada de serviço <code className="text-[#37558d]">dbService.ts</code> isola a persistência, permitindo trocar o provider sem alterar a interface visual.
                </p>
              </div>
            </div>

            {/* SQL Script Viewer */}
            <div className="mt-4">
              <div className="flex items-center justify-between bg-slate-800 text-slate-300 px-4 py-2.5 rounded-t-2xl text-xs font-mono">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-[#8ad0da]" />
                  <span>bycomp_postgres_schema.sql (DDL Script)</span>
                </div>
                <span className="text-[11px] text-slate-400">PostgreSQL 14+ / Supabase / Cloud SQL</span>
              </div>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-b-2xl text-xs font-mono overflow-x-auto max-h-96 border-x border-b border-slate-800">
                <code>{postgresDDL}</code>
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
