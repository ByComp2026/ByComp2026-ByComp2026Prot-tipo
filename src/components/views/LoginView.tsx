import React, { useState } from 'react';
import {
  Lock,
  Mail,
  ArrowRight,
  Shield,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';
import { Collaborator } from '../../types';
import {
  USER_CREDENTIALS,
  convertCredentialToCollaborator
} from '../../data/authCredentials';
import { dbService, UserDbModel } from '../../services/dbService';

interface LoginViewProps {
  onLogin: (user?: Collaborator) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('victormorekids@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      // 1. Authenticate with Firebase Firestore
      const authenticatedUser = await dbService.authenticateUser(email, password);

      if (authenticatedUser) {
        const collaboratorUser: Collaborator = {
          id: authenticatedUser.id,
          name: authenticatedUser.name,
          role: authenticatedUser.role,
          userRole: authenticatedUser.userRole,
          sector: authenticatedUser.sector,
          area: authenticatedUser.area,
          email: authenticatedUser.email,
          avatar: authenticatedUser.avatar,
          phone: authenticatedUser.phone,
          admissionDate: authenticatedUser.admissionDate,
          status: authenticatedUser.status,
          currentTask: authenticatedUser.currentTask,
          contractType: authenticatedUser.contractType,
          salaryBracket: authenticatedUser.salaryBracket,
          workSchedule: authenticatedUser.workSchedule,
          emergencyContact: authenticatedUser.emergencyContact,
          cpfMasked: authenticatedUser.cpfMasked,
          asoStatus: authenticatedUser.asoStatus,
          benefits: authenticatedUser.benefits
        };

        setLoading(false);
        onLogin(collaboratorUser);
        return;
      }

      // 2. Check local fallback
      const foundMock = USER_CREDENTIALS.find(
        (u) => u.email.trim().toLowerCase() === email.trim().toLowerCase() && u.password === password
      );

      if (foundMock) {
        setLoading(false);
        onLogin(convertCredentialToCollaborator(foundMock));
        return;
      }

      setLoading(false);
      setErrorMessage('E-mail ou senha incorretos. Verifique suas credenciais cadastradas no Firebase.');
    } catch (err) {
      console.error('Login error:', err);
      setLoading(false);
      setErrorMessage('Erro de conexão ao autenticar com o banco de dados. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#7da2ca] flex flex-col justify-between p-4 sm:p-6 md:p-8 relative overflow-x-hidden select-none">
      {/* Background soft ambient accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-[#37558d]/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Bar Centralizada */}
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center text-center z-10 mb-5 mt-8">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <span className="font-black text-5xl tracking-tight text-[#37558d]">ByComp</span>
          </div>
          <p className="text-xs text-[#37558d] font-bold mt-3">Gestão Corporativa Integrada</p>
        </div>
      </div>

      {/* Main Container: Centered Login Form Only */}
      <div className="w-full max-w-md mx-auto my-auto py-8 z-10">
        <div className="bg-white/95 border border-white/80 rounded-3xl p-7 sm:p-8 shadow-2xl backdrop-blur-xl relative">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 text-[#37558d] mb-3 shadow-xs">
              <Shield className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-black text-[#37558d] tracking-tight">Acesso ao Sistema</h2>
            <p className="text-xs text-[#37558d] font-bold mt-0.5">ByComp • Gestão Corporativa</p>
            <p className="text-xs text-[#37558d]/80 font-medium mt-1">
              Informe suas credenciais para acessar a plataforma
            </p>
          </div>

          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <p className="leading-relaxed font-medium">{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#37558d] mb-1.5">
                E-mail Corporativo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMessage(null);
                  }}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black placeholder-slate-400 focus:outline-none focus:border-[#37558d] focus:ring-1 focus:ring-[#37558d] transition-all font-mono"
                  placeholder="usuario@bycomp.com.br"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#37558d] mb-1.5">
                Senha de Acesso
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  autoFocus
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMessage(null);
                  }}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black placeholder-slate-400 focus:outline-none focus:border-[#37558d] focus:ring-1 focus:ring-[#37558d] transition-all font-mono"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-black cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              id="btn-login-submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-[#334b84] hover:bg-[#37558d] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 group transition-all cursor-pointer"
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
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Ambiente Seguro • Autenticação Criptografada</span>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center justify-center text-xs text-[#37558d] gap-2 z-10 pt-2 font-bold text-center">
        {/* Linha de cima: Copyright e o sistema */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-[#37558d] font-bold">© 2026 ByComp Tecnologia</span>
          <span>•</span>
          <span className="text-[#37558d] font-semibold">Sistema Corporativo Integrado com Controle RBAC</span>
        </div>

        {/* Linha de baixo: Matriz de Permissões Homologada (Centralizada) */}
        <div className="flex items-center justify-center gap-1.5 font-mono text-[11px] text-[#37558d]">
          <Shield className="w-3.5 h-3.5 text-[#37558d]" />
          <span className="text-[#37558d] font-bold">Matriz de Permissões Homologada</span>
        </div>
      </div>
    </div>
  );
};
