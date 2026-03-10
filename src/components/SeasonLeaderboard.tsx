'use client';

import { Crown, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { IntentAsset } from '@/types';

interface LeaderboardProps {
  intents: IntentAsset[];
}

export default function SeasonLeaderboard({ intents }: LeaderboardProps) {
  const router = useRouter();
  
  const sorted = [...intents]
    .filter(i => i.boostScore && i.boostScore > 0)
    .sort((a, b) => (b.boostScore || 0) - (a.boostScore || 0))
    .slice(0, 5);

  if (sorted.length === 0) return null;

  return (
    <div className="sci-fi-card p-6 bg-white border border-gray-200 aura-shadow">
      <div className="flex items-center gap-2 mb-2">
        <TrendingUp className="w-5 h-5 text-orange-500" />
        <h3 className="text-lg font-bold text-gray-900">🏆 Season Leaderboard</h3>
      </div>
      <p className="text-xs text-gray-500 mb-4">Ranked by Aura boost score</p>

      <div className="space-y-3">
        {sorted.map((intent, idx) => (
          <button
            key={intent.id}
            onClick={() => router.push(`/intent/${intent.id}`)}
            className={`w-full text-left relative p-3 rounded-lg transition-all hover:scale-[1.02] ${
              idx === 0
                ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-orange-300 shadow-lg shadow-orange-100'
                : 'bg-gray-50 border border-gray-200 hover:border-orange-200'
            }`}
          >
            {idx === 0 && (
              <Crown className="absolute -top-3 -right-3 w-8 h-8 text-amber-500 animate-pulse" />
            )}

            <div className="flex items-center gap-3">
              <div className={`text-2xl font-bold ${
                idx === 0 ? 'text-amber-500' : 
                idx === 1 ? 'text-gray-400' : 
                idx === 2 ? 'text-orange-400' : 'text-gray-300'
              }`}>
                #{idx + 1}
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 text-sm">{intent.ticker}</div>
                <div className="text-xs text-gray-500 truncate">{intent.title}</div>
              </div>

              <div className="text-right">
                <div className="text-orange-500 font-bold text-sm">🔥 {intent.boostScore}</div>
                <div className="text-xs text-gray-400">Aura</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
