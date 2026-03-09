"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Terminal } from "lucide-react";
import { useAppStore } from "@/store";

function formatTime(timestamp: number): string {
  const d = new Date(timestamp);
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function typeColor(type: string): string {
  switch (type) {
    case "patronage":
      return "text-amber-600";
    case "proof_submitted":
      return "text-orange-500";
    case "ai_verified":
      return "text-emerald-600";
    case "intent_published":
      return "text-sky-600";
    case "milestone_unlocked":
      return "text-violet-600";
    default:
      return "text-gray-600";
  }
}

export default function ActivityFeed({
  maxItems = 20,
  compact = false,
}: {
  maxItems?: number;
  compact?: boolean;
}) {
  const router = useRouter();
  const logs = useAppStore((s) => s.activityLogs);
  const displayLogs = logs.slice(0, maxItems);
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevLenRef = useRef(logs.length);

  // Flash effect on new entries
  useEffect(() => {
    if (logs.length > prevLenRef.current && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
    prevLenRef.current = logs.length;
  }, [logs.length]);

  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white overflow-hidden crt-scanlines crt-glow aura-shadow ${
        compact ? "" : "h-full flex flex-col"
      }`}
    >
      {/* Terminal header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-orange-100 bg-orange-50">
        <Terminal className="w-3.5 h-3.5 text-orange-500" />
        <span className="text-[10px] font-mono font-bold text-orange-600 uppercase tracking-[0.15em]">
          Live Activity Feed
        </span>
        <span className="ml-auto flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] font-mono text-emerald-600">LIVE</span>
        </span>
      </div>

      {/* Log entries */}
      <div
        ref={scrollRef}
        className={`overflow-y-auto font-mono ${
          compact ? "max-h-[300px]" : "flex-1"
        }`}
      >
        {displayLogs.length === 0 ? (
          <div className="px-4 py-6 text-center">
            <span className="text-[11px] text-gray-400">
              Awaiting activity...
            </span>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {displayLogs.map((log, idx) => (
              <div
                key={log.id}
                onClick={() =>
                  log.intentId && router.push(`/intent/${log.intentId}`)
                }
                className={`px-4 py-2 cursor-pointer hover:bg-orange-50 transition-colors ${
                  idx === 0 ? "animate-flash" : ""
                }`}
              >
                <div className="flex items-start gap-2">
                  {/* Timestamp */}
                  <span className="text-[10px] text-gray-400 flex-shrink-0 tabular-nums leading-5">
                    {formatTime(log.timestamp)}
                  </span>

                  {/* Message */}
                  <span
                    className={`text-[11px] leading-5 ${typeColor(log.type)}`}
                  >
                    {log.message}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Terminal cursor blink */}
        <div className="px-4 py-2">
          <span className="text-orange-500/60 text-[11px] font-mono">
            {">"}{" "}
            <span className="animate-pulse">▊</span>
          </span>
        </div>
      </div>
    </div>
  );
}
