import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HabitForge — Daily Habit Tracker & Leaderboard',
  description:
    'Track daily habits, view monthly activity heatmaps, analyze consistency with interactive charts, and compete on the community leaderboard.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}
