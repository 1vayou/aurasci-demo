'use client';

import { Crown, TrendingUp } from 'lucide-react';
import type { IntentAsset } from '@/types';

interface LeaderboardProps {
  intents: IntentAsset[];
}

export default function SeasonLeaderboard({ intents }: LeaderboardProps) {
  const sorted = [...intents]
    .filter(i => i.boostScore && i.boostScore > 0)
    .sort((a, b) => (b.boostScore || 0) - (a.boostScore || 0))
    .slice(0, 5);

  if (sorted.length === 0) return null;

  return (
    <div className="sci-fi-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-yellow-400" />
        <h3 className="text-lg font-bold text-white">🏆 Season Leaderboard</h3>
      </div>

      <div className="space-y-3">
        {sorted.map((intent, idx) => (
          <div
            key={intent.id}
            className={`relative p-3 rounded-lg transition-all ${
              idx === 0
                ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/50 shadow-lg shadow-yellow-500/20'
                : 'bg-white/[0.02] border border-white/[0.08]'
            }`}
          >
            {idx === 0 && (
              <Crown className="absolute -top-3 -right-3 w-8 h-8 text-yellow-400 animate-pulse" />
            )}

            <div className="flex items-center gap-3">
              <div className={`text-2xl font-bold ${
                idx === 0 ? 'text-yellow-400' : 
                idx === 1 ? 'text-gray-300' : 
                idx === 2 ? 'text-orange-400' : 'text-white/40'
              }`}>
                #{idx + 1}
              </div>

              <div className="flex-1">
                <div className="font-semibold text-white text-sm">{intent.ticker}</div>
                <div className="text-xs text-white/40 truncate">{intent.title}</div>
              </div>

              <div className="text-right">
                <div className="text-orange-400 font-bold">🔥 {intent.boostScore}</div>
                <div className="text-xs text-white/40">Aura</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
