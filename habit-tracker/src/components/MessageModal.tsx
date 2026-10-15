'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Flame,
  Sparkles,
  Trophy,
  Zap,
  Smile,
  CheckCheck,
} from 'lucide-react';
import { AppStorage } from '@/lib/storage';
import { FriendMessage } from '@/types';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  friend: {
    id: string;
    full_name: string;
    username: string;
    avatar_url?: string;
    streak?: number;
  } | null;
}

const QUICK_CHEERS = [
  { emoji: '🔥', text: 'You are on fire today! Keep the streak alive!' },
  { emoji: '🚀', text: 'Crushing your habits! Unstoppable pace!' },
  { emoji: '👏', text: 'Great discipline today! Super proud of your progress!' },
  { emoji: '⚡', text: "Let's finish strong! You got this!" },
];

export function MessageModal({ isOpen, onClose, friend }: MessageModalProps) {
  const [messages, setMessages] = useState<FriendMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadMessages = () => {
    if (!friend) return;
    const msgs = AppStorage.getMessages(friend.id);
    setMessages(msgs);
  };

  useEffect(() => {
    if (isOpen && friend) {
      loadMessages();
    }
  }, [isOpen, friend]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen || !friend) return null;

  const currentUserId = AppStorage.getUser().id;

  const handleSend = (textToSend?: string, isCheer = false) => {
    const text = (textToSend ?? inputText).trim();
    if (!text) return;

    setIsSending(true);
    AppStorage.sendMessage(friend.id, text, isCheer);
    setInputText('');
    loadMessages();
    setIsSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 flex flex-col h-[600px] max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 px-5 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={friend.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={friend.full_name}
                className="w-11 h-11 rounded-full object-cover ring-2 ring-emerald-400/50"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">{friend.full_name}</h3>
                {friend.streak !== undefined && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center gap-0.5">
                    <Flame className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                    {friend.streak}d
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300">@{friend.username} &bull; Competition Partner</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Cheer Shortcuts Strip */}
        <div className="bg-slate-50 border-b border-slate-100 p-2.5 px-4 overflow-x-auto">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> Quick Cheer:
            </span>
            {QUICK_CHEERS.map((cheer, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(`${cheer.emoji} ${cheer.text}`, true)}
                className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-slate-700 transition-all flex items-center gap-1 shadow-2xs active:scale-95"
              >
                <span>{cheer.emoji}</span>
                <span className="hidden sm:inline">{cheer.text.split('!')[0]}!</span>
              </button>
            ))}
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gradient-to-b from-slate-50/50 to-white">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <Smile className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-700">No messages yet!</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Send a cheer or message to {friend.full_name} to celebrate their habit streak or spark a friendly competition!
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.sender_id === currentUserId;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[82%] rounded-2xl p-3 shadow-2xs text-xs sm:text-sm ${
                      isMine
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-xs'
                        : msg.is_cheer
                        ? 'bg-amber-50/90 border border-amber-200 text-amber-950 rounded-bl-xs'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs'
                    }`}
                  >
                    {msg.is_cheer && (
                      <div className="flex items-center gap-1 text-[11px] font-bold mb-1 opacity-90 text-amber-700">
                        <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        Habit Cheer & Nudge
                      </div>
                    )}
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    <div
                      className={`text-[10px] mt-1 flex items-center justify-end gap-1 ${
                        isMine ? 'text-emerald-100' : 'text-slate-400'
                      }`}
                    >
                      <span>
                        {new Date(msg.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      {isMine && <CheckCheck className="w-3 h-3" />}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            placeholder={`Message ${friend.full_name.split(' ')[0]}...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-4 py-2.5 text-sm rounded-2xl bg-slate-100 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all text-slate-900"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim() || isSending}
            className="p-2.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
}
