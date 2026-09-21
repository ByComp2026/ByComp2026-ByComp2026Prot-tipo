import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  Shield, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Key, 
  Check, 
  Copy,
  AlertCircle,
  Crown,
  UserCog,
  ShieldCheck,
  Users
} from 'lucide-react';
import { Collaborator, UserRole } from '../../types';
import { 
  USER_CREDENTIALS, 
  convertCredentialToCollaborator,
  UserCredentialAccount 
} from '../../data/authCredentials';

interface LoginViewProps {
  onLogin: (user?: Collaborator) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [selectedUser, setSelectedUser] = useState<UserCredentialAccount>(USER_CREDENTIALS[0]);
  const [email, setEmail] = useState(USER_CREDENTIALS[0].email);
  const [password, setPassword] = useState(USER_CREDENTIALS[0].password);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleSelectQuickUser = (user: UserCredentialAccount) => {
    setSelectedUser(user);
    setEmail(user.email);
    setPassword(user.password);
    setErrorMessage(null);
  };

  const handleDirectLogin = (user: UserCredentialAccount) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin(convertCredentialToCollaborator(user));
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      // Validate credentials against our mock user database
      const foundUser = USER_CREDENTIALS.find(
        (u) => u.email.trim().toLowerCase() === email.trim().toLowerCase() && u.password === password
      );

      if (foundUser) {
        onLogin(convertCredentialToCollaborator(foundUser));
      } else {
        // Check if email exists with another password
        const emailExists = USER_CREDENTIALS.find(
          (u) => u.email.trim().toLowerCase() === email.trim().toLowerCase()
        );
        if (emailExists) {
          setErrorMessage(`Senha incorreta para ${email}. Utilize "${emailExists.password}" ou clique em preencher abaixo.`);
        } else {
          setErrorMessage('E-mail não localizado na base corporativa. Selecione uma das credenciais na tabela abaixo.');
        }
      }
    }, 350);
  };

  return (
    <div className="min-h-screen w-full bg-[#7da2ca] flex flex-col justify-between p-4 sm:p-6 md:p-8 relative overflow-x-hidden select-none">
      {/* Background soft ambient accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-[#37558d]/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Bar */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="bg-white px-3 py-1.5 rounded-xl shadow-md border border-white/60">
            <img 
              src="/bycomp-logo.svg" 
              alt="ByComp" 
              className="h-8 w-auto object-contain" 
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-tight text-[#37558d]">ByComp</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#e8ba9d]/35 text-[#92400e] border border-[#e8ba9d]">
                PROTÓTIPO
              </span>
            </div>
            <p className="text-[11px] text-[#37558d] font-bold">Gestão Integrada & Simulação de Permissões</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 border border-white/80 shadow-xs text-xs text-[#37558d]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-mono text-[#37558d] font-bold">Autenticação:</span>
          <span className="text-emerald-700 font-bold">Ativa & Segura</span>
        </div>
      </div>

      {/* Main Container: 2-Column Responsive Layout */}
      <div className="w-full max-w-6xl mx-auto my-auto py-6 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Interactive Credentials Directory */}
          <div className="lg:col-span-7 bg-white/95 border border-white/80 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-[#37558d] border border-blue-100">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#37558d]">Usuários e Senhas para Simulação</h3>
                  <p className="text-xs text-[#37558d]/80 font-medium">Clique para preencher os campos ou acesse diretamente cada perfil</p>
                </div>
              </div>
              <span className="text-[11px] font-mono text-[#1e3a8a] bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-200 font-bold">
                4 Níveis RBAC
              </span>
            </div>

            <div className="space-y-3">
              {USER_CREDENTIALS.map((user) => {
                const isSelected = selectedUser.id === user.id;

                return (
                  <div
                    key={user.id}
                    onClick={() => handleSelectQuickUser(user)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative group ${
                      isSelected
                        ? 'bg-blue-50/70 border-[#334b84] shadow-md ring-2 ring-[#334b84]/20'
                        : 'bg-white border-slate-200 hover:border-[#37558d] hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2.5 mb-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-black group-hover:text-[#334b84] transition-colors">
                              {user.name}
                            </span>
                            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${user.badgeStyle.bg} ${user.badgeStyle.text} ${user.badgeStyle.border}`}>
                              {user.roleLabel}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 truncate font-medium">
                            {user.currentTask}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDirectLogin(user);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-[#334b84] hover:bg-[#37558d] text-white text-[11px] font-bold hover:font-bold transition-all shadow-xs shrink-0 flex items-center gap-1 cursor-pointer"
                        title="Entrar diretamente com este perfil"
                      >
                        <span>Entrar</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Credential Data Line */}
                    <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 px-2.5 py-1.5 rounded-xl text-xs font-mono border border-slate-200">
                      <div className="flex items-center gap-2 text-slate-600 text-[11px]">
                        <span className="font-semibold text-black">E-mail:</span>
                        <span className="text-[#1e3a8a] font-bold">{user.email}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(user.email, `e-${user.id}`);
                          }}
                          className="text-slate-400 hover:text-black cursor-pointer"
                          title="Copiar e-mail"
                        >
                          {copiedId === `e-${user.id}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-slate-600 text-[11px]">
                        <span className="font-semibold text-black">Senha:</span>
                        <span className="text-amber-900 font-bold bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                          {user.password}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(user.password, `p-${user.id}`);
                          }}
                          className="text-slate-400 hover:text-black cursor-pointer"
                          title="Copiar senha"
                        >
                          {copiedId === `p-${user.id}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>

                      <div className="text-[10px] text-slate-500 font-medium">
                        Telas: <strong className="text-black font-bold">{user.allowedScreensCount}</strong>/22
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-3.5 pt-3 border-t border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Todas as credenciais ativas e sincronizadas com a política RBAC
              </span>
              <span className="font-mono text-slate-500 font-medium">v1.0.0-RBAC</span>
            </div>
          </div>

          {/* Right Column: Interactive Login Form */}
          <div className="lg:col-span-5 bg-white/95 border border-white/80 rounded-3xl p-6 shadow-2xl backdrop-blur-xl relative">
            <div className="text-center mb-5">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-[#37558d] mb-2.5 shadow-xs">
                <Shield className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black text-[#37558d] tracking-tight">Acesso ao Sistema</h2>
              <p className="text-xs text-[#37558d] font-bold mt-0.5">ByComp • Gestão Corporativa</p>
              <p className="text-[11px] text-[#37558d]/80 font-medium mt-1">
                Informe as credenciais ou clique em uma das opções ao lado
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <p className="leading-tight font-medium">{errorMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#37558d] mb-1.5">
                  E-mail Corporativo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrorMessage(null);
                    }}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black placeholder-slate-400 focus:outline-none focus:border-[#37558d] focus:ring-1 focus:ring-[#37558d] transition-all font-mono"
                    placeholder="usuario@bycomp.com.br"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-[#37558d]">
                    Senha de Acesso
                  </label>
                  <span className="text-[11px] text-[#37558d]/75 font-mono font-bold">
                    {selectedUser ? selectedUser.roleLabel : 'Senha'}
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrorMessage(null);
                    }}
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black placeholder-slate-400 focus:outline-none focus:border-[#37558d] focus:ring-1 focus:ring-[#37558d] transition-all font-mono"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-black cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                id="btn-login-submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-[#334b84] hover:bg-[#37558d] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 group transition-all cursor-pointer"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span className="text-white font-bold">Autenticar & Iniciar Acesso</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform text-white" />
                  </>
                )}
              </button>

              <button
                type="button"
                id="btn-login-bypass"
                onClick={() => onLogin(convertCredentialToCollaborator(USER_CREDENTIALS[0]))}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-[#37558d] hover:text-white border border-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer group"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#334b84] group-hover:text-white" />
                <span className="group-hover:text-white group-hover:font-bold">Entrar como Super Admin (Acesso Completo)</span>
              </button>
            </form>

            {/* Selected User Quick Preview */}
            <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <img
                src={selectedUser.avatar}
                alt={selectedUser.name}
                className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-300 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-[#37558d] truncate">{selectedUser.name}</p>
                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${selectedUser.badgeStyle.bg} ${selectedUser.badgeStyle.text} ${selectedUser.badgeStyle.border}`}>
                    {selectedUser.role}
                  </span>
                </div>
                <p className="text-[11px] text-[#37558d]/75 truncate font-mono font-medium">
                  Setor: {selectedUser.sector} • {selectedUser.allowedScreensCount} Telas
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Footer */}
      <div className="w-full max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-[#37558d] gap-2 z-10 pt-2 font-bold">
        <div className="flex items-center gap-4">
          <span className="text-[#37558d] font-bold">© 2026 ByComp Tecnologia</span>
          <span>•</span>
          <span className="text-[#37558d] font-semibold">Sistema Corporativo Integrado com Controle RBAC</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-[#37558d]">
          <Shield className="w-3.5 h-3.5 text-[#37558d]" />
          <span className="text-[#37558d] font-bold">Matriz de Permissões Homologada</span>
        </div>
      </div>
    </div>
  );
};
