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
    <div className="min-h-screen w-full bg-slate-950 flex flex-col justify-between p-4 sm:p-6 md:p-8 relative overflow-x-hidden select-none">
      {/* Background glowing tech elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-10 left-10 w-[350px] h-[350px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Bar */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 font-extrabold text-xl tracking-wider">
            B
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white">ByComp</span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-[10px] font-mono text-cyan-300">
                RBAC Multi-Perfil
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Gestão Integrada & Simulação de Permissões</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-mono text-slate-400">Autenticação:</span>
          <span className="text-emerald-300 font-semibold">Ativa & Segura</span>
        </div>
      </div>

      {/* Main Container: 2-Column Responsive Layout */}
      <div className="w-full max-w-6xl mx-auto my-auto py-6 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Interactive Credentials Directory */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Usuários e Senhas para Simulação</h3>
                  <p className="text-xs text-slate-400">Clique para preencher os campos ou acesse diretamente cada perfil</p>
                </div>
              </div>
              <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                4 Níveis RBAC
              </span>
            </div>

            <div className="space-y-3">
              {USER_CREDENTIALS.map((user) => {
                const isSelected = selectedUser.id === user.id;
                const RoleIcon = 
                  user.role === 'SUPER_ADMIN' ? Crown :
                  user.role === 'ADMINISTRATIVO' ? UserCog :
                  user.role === 'GESTOR' ? ShieldCheck : Users;

                return (
                  <div
                    key={user.id}
                    onClick={() => handleSelectQuickUser(user)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer relative group ${
                      isSelected
                        ? 'bg-slate-950 border-cyan-500/80 shadow-md ring-1 ring-cyan-500/30'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950/80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2.5 mb-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-700 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                              {user.name}
                            </span>
                            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${user.badgeStyle.bg} ${user.badgeStyle.text} ${user.badgeStyle.border}`}>
                              {user.roleLabel}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate">
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
                        className="px-2.5 py-1 rounded-lg bg-cyan-600/90 hover:bg-cyan-500 text-white text-[11px] font-bold transition-all shadow-sm shrink-0 flex items-center gap-1 cursor-pointer"
                        title="Entrar diretamente com este perfil"
                      >
                        <span>Entrar</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Credential Data Line */}
                    <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/90 px-2.5 py-1.5 rounded-lg text-xs font-mono border border-slate-800/80">
                      <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                        <span>E-mail:</span>
                        <span className="text-cyan-300 font-medium">{user.email}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(user.email, `e-${user.id}`);
                          }}
                          className="text-slate-500 hover:text-white"
                          title="Copiar e-mail"
                        >
                          {copiedId === `e-${user.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                        <span>Senha:</span>
                        <span className="text-amber-300 font-bold bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-800/40">
                          {user.password}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(user.password, `p-${user.id}`);
                          }}
                          className="text-slate-500 hover:text-white"
                          title="Copiar senha"
                        >
                          {copiedId === `p-${user.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>

                      <div className="text-[10px] text-slate-500">
                        Telas: <strong className="text-cyan-400">{user.allowedScreensCount}</strong>/27
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-3.5 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Todas as credenciais ativas e sincronizadas com a política RBAC
              </span>
              <span className="font-mono text-slate-500">v1.0.0-RBAC</span>
            </div>
          </div>

          {/* Right Column: Interactive Login Form */}
          <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800/90 rounded-2xl p-6 shadow-2xl backdrop-blur-xl relative">
            <div className="text-center mb-5">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 mb-2.5 shadow-inner">
                <Shield className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-extrabold text-white tracking-tight">Acesso ao Sistema</h2>
              <p className="text-xs text-cyan-400 font-semibold mt-0.5">ByComp • Gestão Corporativa</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Informe as credenciais ou clique em uma das opções ao lado
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <p className="leading-tight">{errorMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
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
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
                    placeholder="usuario@bycomp.com.br"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Senha de Acesso
                  </label>
                  <span className="text-[11px] text-slate-500 font-mono">
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
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                id="btn-login-submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 via-cyan-500 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 group transition-all cursor-pointer"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>Autenticar & Iniciar Simulação</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>

              <button
                type="button"
                id="btn-login-bypass"
                onClick={() => onLogin(convertCredentialToCollaborator(USER_CREDENTIALS[0]))}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700 hover:border-cyan-500/50 text-cyan-300 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Entrar como Super Admin (Todas as Telas)</span>
              </button>
            </form>

            {/* Selected User Quick Preview */}
            <div className="mt-4 p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-3">
              <img
                src={selectedUser.avatar}
                alt={selectedUser.name}
                className="w-9 h-9 rounded-xl object-cover ring-1 ring-cyan-500 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-200 truncate">{selectedUser.name}</p>
                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${selectedUser.badgeStyle.bg} ${selectedUser.badgeStyle.text} ${selectedUser.badgeStyle.border}`}>
                    {selectedUser.role}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate font-mono">
                  Setor: {selectedUser.sector} • {selectedUser.allowedScreensCount} Telas
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Footer */}
      <div className="w-full max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2 z-10 pt-2">
        <div className="flex items-center gap-4">
          <span>© 2026 ByComp Tecnologia</span>
          <span>•</span>
          <span>Protótipo de Apresentação Executiva com Controle RBAC</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
          <Shield className="w-3.5 h-3.5 text-cyan-400" />
          <span>Matriz de Permissões Homologada</span>
        </div>
      </div>
    </div>
  );
};
