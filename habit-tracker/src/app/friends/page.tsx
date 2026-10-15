'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Check,
  X,
  Shield,
  Sparkles,
  Plus,
  Flame,
  Award,
  MessageSquare,
  CheckCircle2,
} from 'lucide-react';
import { AppStorage } from '@/lib/storage';
import { GroupChallenge, UserProfile } from '@/types';
import { Sidebar } from '@/components/Sidebar';
import { MobileNav } from '@/components/MobileNav';
import { Navbar } from '@/components/Navbar';
import { MessageModal } from '@/components/MessageModal';
import { UserCompetitionRace } from '@/components/UserCompetitionRace';

export default function FriendsPage() {
  const [activeTab, setActiveTab] = useState<'friends' | 'groups'>('friends');
  const [searchQuery, setSearchQuery] = useState('');
  const [groups, setGroups] = useState<GroupChallenge[]>([]);
  const [activeChatFriend, setActiveChatFriend] = useState<{
    id: string;
    full_name: string;
    username: string;
    avatar_url: string;
    streak?: number;
  } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [friendRequests, setFriendRequests] = useState([
    {
      id: 'req-1',
      username: 'marcus_dev',
      full_name: 'Marcus Vance',
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      streak: 18,
    },
  ]);
  const [friends, setFriends] = useState([
    {
      id: 'fr-1',
      username: 'sarah_fitness',
      full_name: 'Sarah Jenkins',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      streak: 24,
      points: 620,
      todayCompleted: 5,
      todayTotal: 5,
    },
    {
      id: 'fr-2',
      username: 'elena_mind',
      full_name: 'Elena Rostova',
      avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
      streak: 14,
      points: 410,
      todayCompleted: 2,
      todayTotal: 3,
    },
  ]);

  useEffect(() => {
    setGroups(AppStorage.getGroups());
  }, []);

  const handleAcceptRequest = (reqId: string) => {
    const req = friendRequests.find((r) => r.id === reqId);
    if (req) {
      setFriends([
        ...friends,
        {
          id: `fr-${Date.now()}`,
          username: req.username,
          full_name: req.full_name,
          avatar_url: req.avatar_url,
          streak: req.streak,
          points: 540,
          todayCompleted: 4,
          todayTotal: 4,
        },
      ]);
      setFriendRequests(friendRequests.filter((r) => r.id !== reqId));
    }
  };

  const handleRejectRequest = (reqId: string) => {
    setFriendRequests(friendRequests.filter((r) => r.id !== reqId));
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    const created = AppStorage.createGroup(newGroupName.trim(), newGroupDesc.trim());
    setGroups(AppStorage.getGroups());
    setIsCreateGroupOpen(false);
    setNewGroupName('');
    setNewGroupDesc('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row pb-20 lg:pb-0">
      <Sidebar />

      <div className="flex-1 lg:pl-64 flex flex-col">
        <Navbar
          title="Friends & Groups"
          subtitle="Support routines with accountability partners"
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto w-full">
          {/* Tabs */}
          <div className="flex items-center justify-between bg-slate-900/60 backdrop-blur-xl p-4 rounded-3xl border border-white/10 shadow-xl">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveTab('friends')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'friends'
                    ? 'bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                Friends ({friends.length})
              </button>
              <button
                onClick={() => setActiveTab('groups')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'groups'
                    ? 'bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                Accountability Groups ({groups.length})
              </button>
            </div>

            {activeTab === 'groups' && (
              <button
                onClick={() => setIsCreateGroupOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-md shadow-emerald-500/20 transition-all"
              >
                <Plus className="w-4 h-4" /> Create Group
              </button>
            )}
          </div>

          {activeTab === 'friends' ? (
            <div className="space-y-6">
              {/* Search User Bar */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Find a member by @username to connect..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-2xl border border-white/15 bg-slate-900/60 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 shadow-xl backdrop-blur-xl"
                />
              </div>

              {/* Friend Requests */}
              {friendRequests.length > 0 && (
                <div className="bg-amber-950/25 border border-amber-500/30 rounded-3xl p-5 backdrop-blur-xl">
                  <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-3">
                    Pending Friend Requests ({friendRequests.length})
                  </h3>
                  <div className="space-y-2">
                    {friendRequests.map((req) => (
                      <div
                        key={req.id}
                        className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 shadow-lg"
                      >
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={req.avatar_url}
                            alt={req.full_name}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/30"
                          />
                          <div>
                            <p className="text-xs font-bold text-white">{req.full_name}</p>
                            <p className="text-[11px] text-slate-400">@{req.username}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAcceptRequest(req.id)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20"
                          >
                            <Check className="w-3.5 h-3.5" /> Accept
                          </button>
                          <button
                            onClick={() => handleRejectRequest(req.id)}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Active Friends List */}
              <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/10 p-5 shadow-xl text-white">
                <h3 className="text-sm font-bold text-white mb-4">Your Friends</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {friends.map((friend) => (
                    <div
                      key={friend.id}
                      className="p-4 rounded-2xl border border-white/10 bg-slate-950/60 flex items-center justify-between gap-3 hover:border-white/20 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={friend.avatar_url}
                          alt={friend.full_name}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500/30"
                        />
                        <div>
                          <p className="text-sm font-bold text-white">{friend.full_name}</p>
                          <p className="text-xs text-slate-400">@{friend.username}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[11px] font-semibold text-amber-400 flex items-center gap-0.5">
                              <Flame className="w-3 h-3 fill-amber-400" /> {friend.streak}d
                            </span>
                            <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-0.5">
                              <Award className="w-3 h-3" /> {friend.points} pts
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Today status badge & action buttons */}
                      <div className="flex flex-col items-end gap-2">
                        <div className="text-right">
                          <span className="text-xs font-bold text-white">
                            {friend.todayCompleted}/{friend.todayTotal}
                          </span>
                          <span className="block text-[10px] text-slate-400">habits today</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              AppStorage.sendMessage(
                                friend.id,
                                '🔥 Keep up the awesome streak! Proud of you!',
                                true
                              );
                              setToastMessage(`Cheered ${friend.full_name}! 🔥`);
                              setTimeout(() => setToastMessage(null), 3000);
                            }}
                            className="p-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 transition-all text-xs font-bold flex items-center gap-1 active:scale-95 shadow-sm"
                            title="Send quick cheer"
                          >
                            <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          </button>

                          <button
                            onClick={() => setActiveChatFriend(friend)}
                            className="px-2.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 transition-all text-xs font-bold flex items-center gap-1 active:scale-95 shadow-sm"
                            title="Send message"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Message</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Toast Notification */}
              {toastMessage && (
                <div className="p-3.5 rounded-2xl bg-emerald-500 text-slate-950 text-xs font-bold flex items-center justify-between shadow-xl animate-in fade-in">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-slate-950" /> {toastMessage}
                  </span>
                  <button onClick={() => setToastMessage(null)} className="text-slate-950/70 hover:text-slate-950 font-black">
                    &times;
                  </button>
                </div>
              )}

              {/* User Competition Live Progress List */}
              <UserCompetitionRace
                title="Live User Competition & Progress"
                subtitle="Watch live daily habit completion like a race — cheer on partners or send a message"
              />
            </div>
          ) : (
            /* Groups View */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {groups.map((group) => (
                <div
                  key={group.id}
                  className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-xl flex flex-col justify-between text-white"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                        {group.members_count} Members
                      </span>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 bg-white/10 rounded-md text-slate-300 border border-white/10">
                        Code: {group.invite_code}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white">{group.name}</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {group.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">Group Active</span>
                    <button className="px-3.5 py-1.5 text-xs font-bold text-emerald-300 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-xl transition-colors">
                      View Challenge Board
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Create Group Modal */}
      {isCreateGroupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md bg-slate-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-6 text-white">
            <h3 className="text-base font-bold text-white mb-1">Create Private Group</h3>
            <p className="text-xs text-slate-400 mb-4">
              Invite friends to compete on a shared habit goal.
            </p>

            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Group Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5AM Morning Club, Daily Coders"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-white/15 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Description & Goal
                </label>
                <textarea
                  rows={3}
                  placeholder="What habits is this group focusing on?"
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-white/15 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateGroupOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-md shadow-emerald-500/20"
                >
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Message / Chat Modal */}
      {activeChatFriend && (
        <MessageModal
          isOpen={Boolean(activeChatFriend)}
          onClose={() => setActiveChatFriend(null)}
          friend={activeChatFriend}
        />
      )}

      <MobileNav />
    </div>
  );
}
