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
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row pb-20 lg:pb-0">
      <Sidebar />

      <div className="flex-1 lg:pl-64 flex flex-col">
        <Navbar
          title="Friends & Groups"
          subtitle="Support routines with accountability partners"
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto w-full">
          {/* Tabs */}
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveTab('friends')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'friends'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Friends ({friends.length})
              </button>
              <button
                onClick={() => setActiveTab('groups')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'groups'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Accountability Groups ({groups.length})
              </button>
            </div>

            {activeTab === 'groups' && (
              <button
                onClick={() => setIsCreateGroupOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-all"
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
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-2xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-xs"
                />
              </div>

              {/* Friend Requests */}
              {friendRequests.length > 0 && (
                <div className="bg-amber-50/70 border border-amber-200/70 rounded-2xl p-4">
                  <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-3">
                    Pending Friend Requests ({friendRequests.length})
                  </h3>
                  <div className="space-y-2">
                    {friendRequests.map((req) => (
                      <div
                        key={req.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-white border border-amber-100 shadow-2xs"
                      >
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={req.avatar_url}
                            alt={req.full_name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="text-xs font-bold text-slate-900">{req.full_name}</p>
                            <p className="text-[11px] text-slate-400">@{req.username}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAcceptRequest(req.id)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs"
                          >
                            <Check className="w-3.5 h-3.5" /> Accept
                          </button>
                          <button
                            onClick={() => handleRejectRequest(req.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
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
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 mb-4">Your Friends</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {friends.map((friend) => (
                    <div
                      key={friend.id}
                      className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3 hover:border-slate-200 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={friend.avatar_url}
                          alt={friend.full_name}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500/20"
                        />
                        <div>
                          <p className="text-sm font-bold text-slate-900">{friend.full_name}</p>
                          <p className="text-xs text-slate-400">@{friend.username}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[11px] font-semibold text-amber-600 flex items-center gap-0.5">
                              <Flame className="w-3 h-3 fill-amber-500" /> {friend.streak}d
                            </span>
                            <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5">
                              <Award className="w-3 h-3" /> {friend.points} pts
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Today status badge & action buttons */}
                      <div className="flex flex-col items-end gap-2">
                        <div className="text-right">
                          <span className="text-xs font-bold text-slate-900">
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
                            className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200/60 transition-all text-xs font-bold flex items-center gap-1 active:scale-95 shadow-2xs"
                            title="Send quick cheer"
                          >
                            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          </button>

                          <button
                            onClick={() => setActiveChatFriend(friend)}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-all text-xs font-bold flex items-center gap-1 active:scale-95 shadow-2xs"
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
                <div className="p-3 rounded-2xl bg-emerald-600 text-white text-xs font-bold flex items-center justify-between shadow-lg animate-in fade-in">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-200" /> {toastMessage}
                  </span>
                  <button onClick={() => setToastMessage(null)} className="text-emerald-200 hover:text-white">
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
                  className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                        {group.members_count} Members
                      </span>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 bg-slate-100 rounded-md text-slate-600">
                        Code: {group.invite_code}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">{group.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {group.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">Group Active</span>
                    <button className="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 p-6">
            <h3 className="text-base font-bold text-slate-900 mb-1">Create Private Group</h3>
            <p className="text-xs text-slate-500 mb-4">
              Invite friends to compete on a shared habit goal.
            </p>

            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Group Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5AM Morning Club, Daily Coders"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description & Goal
                </label>
                <textarea
                  rows={3}
                  placeholder="What habits is this group focusing on?"
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateGroupOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-xs"
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
