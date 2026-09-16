import React, { useState } from 'react';
import {
  MessageSquare,
  Search,
  Send,
  CheckCheck,
  Phone,
  Video,
  MoreVertical,
  PlusCircle,
  Kanban,
  UserCheck,
  CheckCircle2,
  ExternalLink,
  Clock,
  Sparkles,
  Paperclip
} from 'lucide-react';
import { MOCK_WHATSAPP_CONVERSATIONS } from '../../data/mockData';
import { WhatsAppConversation } from '../../types';

export const WhatsAppCentralView: React.FC = () => {
  const [conversations, setConversations] = useState<WhatsAppConversation[]>(MOCK_WHATSAPP_CONVERSATIONS);
  const [selectedChat, setSelectedChat] = useState<WhatsAppConversation>(MOCK_WHATSAPP_CONVERSATIONS[0]);
  const [replyText, setReplyText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredChats = conversations.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.preview.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'NEXUS TI (Atendente)',
      text: replyText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };

    const updatedMessages = [...selectedChat.messages, newMsg];
    const updatedChat = { ...selectedChat, messages: updatedMessages, preview: replyText, time: 'Agora' };

    setSelectedChat(updatedChat);
    setConversations(conversations.map(c => c.id === selectedChat.id ? updatedChat : c));
    setReplyText('');

    setToastMessage('✓ Mensagem enviada na sessão de atendimento.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAction = (actionName: string) => {
    setToastMessage(`✓ Ação executada: "${actionName}" no chamado do ${selectedChat.name}`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header with Metric Cards */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">Central WhatsApp da Empresa</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Omnichannel de atendimento a clientes, suporte interno e fornecedores
          </p>
        </div>

        {/* Integration Callout */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-xs text-emerald-300 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Integração planejada via WhatsApp Business API / Z-API</span>
        </div>
      </div>

      {/* 4 Cards Requested by User:
          - Conversas ativas: 14
          - Aguardando resposta: 3
          - Atendimentos hoje: 58
          - Tempo médio de resposta: 2m 14s */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <span className="text-xs text-slate-400 font-medium">Conversas ativas</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-black font-mono text-white">14</span>
            <span className="text-[10px] text-emerald-400 font-mono">Em triagem</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <span className="text-xs text-slate-400 font-medium">Aguardando resposta</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-black font-mono text-amber-400">3</span>
            <span className="text-[10px] text-amber-400 font-mono">Fila prioritária</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <span className="text-xs text-slate-400 font-medium">Atendimentos hoje</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-black font-mono text-cyan-400">58</span>
            <span className="text-[10px] text-cyan-400 font-mono">+12% vs. média</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <span className="text-xs text-slate-400 font-medium">Tempo médio de resposta</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-black font-mono text-emerald-400">2m 14s</span>
            <span className="text-[10px] text-emerald-400 font-mono">SLA Excelente</span>
          </div>
        </div>
      </div>

      {/* Toast Notice */}
      {toastMessage && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main WhatsApp Web Style UI */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        {/* Left: Contact List */}
        <div className="lg:col-span-4 border-r border-slate-800 flex flex-col bg-slate-950/50">
          {/* Search Header */}
          <div className="p-3 border-b border-slate-800">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Pesquisar conversas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
            {filteredChats.map((chat) => {
              const isSelected = selectedChat.id === chat.id;
              return (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${
                    isSelected ? 'bg-slate-800/80' : 'hover:bg-slate-900/60'
                  }`}
                >
                  <img
                    src={chat.avatar}
                    alt={chat.name}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-700 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className="text-xs font-bold text-white truncate">{chat.name}</h4>
                      <span className="text-[10px] font-mono text-slate-500">{chat.time}</span>
                    </div>

                    <p className="text-[11px] text-slate-400 truncate font-sans">
                      {chat.preview}
                    </p>

                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                        {chat.category}
                      </span>
                      {chat.unreadCount > 0 && (
                        <span className="w-4 h-4 rounded-full bg-emerald-500 text-[10px] font-bold text-slate-950 flex items-center justify-center font-mono ml-auto">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Chat Area */}
        <div className="lg:col-span-8 flex flex-col bg-slate-900/60">
          {/* Chat Header */}
          <div className="p-3.5 border-b border-slate-800 bg-slate-950/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <img
                src={selectedChat.avatar}
                alt={selectedChat.name}
                className="w-9 h-9 rounded-full object-cover ring-1 ring-cyan-500"
              />
              <div>
                <h3 className="text-xs font-bold text-white flex items-center gap-2">
                  <span>{selectedChat.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                    {selectedChat.category}
                  </span>
                </h3>
                <span className="text-[10px] text-emerald-400 font-mono">
                  ● Conexão Segura WhatsApp Business
                </span>
              </div>
            </div>

            {/* Quick Action Buttons Requested by User:
                - “Gerar tarefa a partir desta conversa”
                - “Atribuir ao Suporte N2”
                - “Finalizar atendimento” */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => handleAction('Gerar tarefa a partir desta conversa')}
                id="btn-gerar-tarefa-conversa"
                className="px-2.5 py-1.5 rounded-lg bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-700/80 text-indigo-200 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                title="Converte o chamado em card no Kanban"
              >
                <Kanban className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Gerar tarefa</span>
              </button>

              <button
                onClick={() => handleAction('Atribuir ao Suporte N2')}
                id="btn-atribuir-suporte-n2"
                className="px-2.5 py-1.5 rounded-lg bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-700/80 text-cyan-200 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Atribuir N2</span>
              </button>

              <button
                onClick={() => handleAction('Finalizar atendimento')}
                id="btn-finalizar-atendimento"
                className="px-2.5 py-1.5 rounded-lg bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-700/80 text-emerald-200 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Finalizar</span>
              </button>
            </div>
          </div>

          {/* Messages Timeline */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gradient-to-b from-slate-950/20 to-slate-950/60">
            {selectedChat.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-md p-3 rounded-2xl text-xs space-y-1 shadow-md ${
                    msg.isMe
                      ? 'bg-cyan-900/60 text-white rounded-tr-none border border-cyan-700/50'
                      : 'bg-slate-800/90 text-slate-200 rounded-tl-none border border-slate-700/60'
                  }`}
                >
                  <span className="text-[10px] font-bold block opacity-70">
                    {msg.sender}
                  </span>
                  <p className="leading-relaxed font-sans">{msg.text}</p>
                  <div className="flex items-center justify-end gap-1 text-[9px] text-slate-400 font-mono">
                    <span>{msg.time}</span>
                    {msg.isMe && <CheckCheck className="w-3 h-3 text-cyan-400" />}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Reply Form */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center gap-2">
            <input
              type="text"
              placeholder="Digite uma mensagem ou resposta rápida..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              id="input-resposta-whatsapp"
              className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />

            <button
              type="submit"
              id="btn-enviar-mensagem-whatsapp"
              className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
