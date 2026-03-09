'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface AISentinelModalProps {
  isOpen: boolean;
  onComplete: () => void;
  type: 'intent' | 'milestone';
}

const LOG_MESSAGES = [
  { delay: 0, text: '[System] Initiating Aura AI Gatekeeper...', color: 'text-orange-500' },
  { delay: 800, text: '[Scanning] Extracting core hypothesis & deliverables...', color: 'text-emerald-600' },
  { delay: 1600, text: '[Cross-Reference] Querying Arxiv & GitHub repositories...', color: 'text-sky-600' },
  { delay: 2400, text: '[Analysis] Methodology integrity check: PASSED', color: 'text-emerald-600' },
  { delay: 3200, text: '[Scoring] Calculating Confidence Score... 94/100', color: 'text-amber-600' },
  { delay: 4000, text: '[Result] 🟢 AI Verification Complete. Green Shield Activated.', color: 'text-emerald-600 font-bold' },
];

export default function AISentinelModal({ isOpen, onComplete, type }: AISentinelModalProps) {
  const [logs, setLogs] = useState<typeof LOG_MESSAGES>([]);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setLogs([]);
      return;
    }

    // Add logs progressively
    LOG_MESSAGES.forEach((log) => {
      setTimeout(() => {
        setLogs((prev) => [...prev, log]);
      }, log.delay);
    });

    // Auto-close after completion
    const closeTimer = setTimeout(() => {
      onComplete();
    }, 5000);

    return () => clearTimeout(closeTimer);
  }, [isOpen, onComplete]);

  // Radar rotation animation
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 2) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl mx-4 bg-white border border-orange-200 rounded-2xl shadow-2xl overflow-hidden">
        {/* Scanline effect */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="h-full w-full bg-gradient-to-b from-transparent via-orange-100 to-transparent animate-scan" />
        </div>

        {/* Header */}
        <div className="relative border-b border-orange-100 p-4 bg-gradient-to-r from-orange-50 to-amber-50">
          <h2 className="text-xl font-mono text-orange-600 tracking-wider">
            AURA AI SENTINEL - {type === 'intent' ? 'INTENT SCREENING' : 'MILESTONE VERIFICATION'}
          </h2>
        </div>

        {/* Content */}
        <div className="relative p-6 flex gap-6">
          {/* Left: Radar Animation */}
          <div className="flex-shrink-0 w-48 h-48 relative">
            <div className="absolute inset-0 rounded-full border-2 border-orange-200" />
            <div className="absolute inset-2 rounded-full border border-orange-200" />
            <div className="absolute inset-4 rounded-full border border-orange-100" />
            
            {/* Rotating radar line */}
            <div 
              className="absolute inset-0 flex items-center justify-center"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              <div className="w-1 h-24 bg-gradient-to-t from-orange-500 to-transparent" />
            </div>

            {/* Center dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
            </div>

            {/* Scanning text */}
            <div className="absolute -bottom-6 left-0 right-0 text-center text-xs text-orange-500 font-mono">
              SCANNING...
            </div>
          </div>

          {/* Right: Terminal Logs */}
          <div className="flex-1 font-mono text-sm space-y-2 min-h-[200px]">
            {logs.map((log, index) => (
              <div
                key={index}
                className={`${log.color} animate-fadeIn`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="text-gray-500">&gt;</span> {log.text}
              </div>
            ))}
            
            {/* Blinking cursor */}
            {logs.length > 0 && logs.length < LOG_MESSAGES.length && (
              <span className="inline-block w-2 h-4 bg-orange-400 animate-pulse" />
            )}
          </div>
        </div>

        {/* Footer progress bar */}
        <div className="relative h-1 bg-orange-100">
          <div 
            className="h-full bg-gradient-to-r from-orange-500 to-emerald-500 transition-all duration-300"
            style={{ width: `${(logs.length / LOG_MESSAGES.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
