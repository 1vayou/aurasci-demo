'use client';

import { useState } from 'react';
import { Flame } from 'lucide-react';

interface BoostButtonProps {
  intentId: string;
  currentBoost: number;
  userCredits: number;
  onBoost: (intentId: string, amount: number) => void;
}

export default function BoostButton({ intentId, currentBoost, userCredits, onBoost }: BoostButtonProps) {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);
  const BOOST_AMOUNT = 10;

  const handleBoost = (e: React.MouseEvent) => {
    if (userCredits < BOOST_AMOUNT) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Create particle
    const particle = { id: Date.now(), x, y };
    setParticles((prev) => [...prev, particle]);

    // Remove particle after animation
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== particle.id));
    }, 1000);

    // Boost intent
    onBoost(intentId, BOOST_AMOUNT);
  };

  return (
    <div className="relative">
      <button
        onClick={handleBoost}
        disabled={userCredits < BOOST_AMOUNT}
        className="relative w-full py-3 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 text-white font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-orange-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 overflow-hidden group"
      >
        <Flame className="w-5 h-5 group-hover:animate-pulse" />
        🔥 Boost with Aura ({BOOST_AMOUNT})
        <span className="ml-2 text-xs opacity-75">({userCredits} left)</span>
      </button>

      {/* Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute pointer-events-none text-orange-500 font-bold text-lg animate-float-up"
          style={{
            left: particle.x,
            top: particle.y,
          }}
        >
          +{BOOST_AMOUNT} Aura
        </div>
      ))}
    </div>
  );
}
