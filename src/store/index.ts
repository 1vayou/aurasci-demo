import { create } from 'zustand';
import type { UserRole, ScientistProfile, IntentAsset, Milestone, Patron, ActivityLog } from '@/types';
import { MOCK_SCIENTISTS, MOCK_INTENTS, MOCK_ACTIVITY_LOGS } from '@/lib/mock-data';

function ts() { return Date.now(); }
function logId() { return `log_${ts()}_${Math.random().toString(36).slice(2, 6)}`; }

interface AppState {
  currentUser: {
    role: UserRole;
    profile?: ScientistProfile;
    auraCredits: number; // Task 6: 用户的 Aura 积分
  };
  intents: IntentAsset[];
  scientists: ScientistProfile[];
  activityLogs: ActivityLog[];

  // Actions
  setUserRole: (role: UserRole) => void;
  setScientistProfile: (profile: ScientistProfile) => void;
  addIntent: (intent: IntentAsset) => void;
  updateIntent: (id: string, updates: Partial<IntentAsset>) => void;
  updateMilestone: (intentId: string, milestoneId: string, updates: Partial<Milestone>) => void;
  addPatronage: (intentId: string, patron: Patron) => void;
  submitProof: (intentId: string, milestoneId: string) => void;
  verifyMilestone: (intentId: string, milestoneId: string) => void;
  addLog: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
  boostIntent: (intentId: string, amount: number) => void; // Task 6: Burn-to-Boost
}

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: { role: 'guest', auraCredits: 1000 },
  intents: MOCK_INTENTS,
  scientists: MOCK_SCIENTISTS,
  activityLogs: MOCK_ACTIVITY_LOGS,

  setUserRole: (role) => set((s) => ({
    currentUser: { ...s.currentUser, role }
  })),

  setScientistProfile: (profile) => set((s) => {
    const exists = s.scientists.find(sc => sc.id === profile.id);
    return {
      currentUser: { ...s.currentUser, profile },
      scientists: exists
        ? s.scientists.map(sc => sc.id === profile.id ? profile : sc)
        : [...s.scientists, profile],
    };
  }),

  addIntent: (intent) => set((s) => ({
    intents: [...s.intents, intent],
    activityLogs: [
      {
        id: logId(),
        timestamp: ts(),
        type: 'intent_published',
        message: `🧬 New intent ${intent.ticker} published: "${intent.title}"`,
        ticker: intent.ticker,
        intentId: intent.id,
      },
      ...s.activityLogs,
    ],
  })),

  updateIntent: (id, updates) => set((s) => ({
    intents: s.intents.map(i => i.id === id ? { ...i, ...updates } : i),
  })),

  updateMilestone: (intentId, milestoneId, updates) => {
    const state = get();
    const intent = state.intents.find(i => i.id === intentId);
    const milestone = intent?.milestones.find(m => m.id === milestoneId);
    if (!intent || !milestone) return;

    // Determine action type from updates
    if (updates.status === 'proof_submitted') {
      get().submitProof(intentId, milestoneId);
    } else if (updates.status === 'ai_verified') {
      get().verifyMilestone(intentId, milestoneId);
    } else {
      set((s) => ({
        intents: s.intents.map(i => {
          if (i.id !== intentId) return i;
          return {
            ...i,
            milestones: i.milestones.map(m =>
              m.id === milestoneId ? { ...m, ...updates } : m
            ),
          };
        }),
      }));
    }
  },

  submitProof: (intentId, milestoneId) => set((s) => {
    const intent = s.intents.find(i => i.id === intentId);
    const milestone = intent?.milestones.find(m => m.id === milestoneId);
    const scientist = intent ? s.scientists.find(sc => sc.id === intent.scientistId) : undefined;
    if (!intent || !milestone) return s;

    return {
      intents: s.intents.map(i => {
        if (i.id !== intentId) return i;
        return {
          ...i,
          milestones: i.milestones.map(m =>
            m.id === milestoneId ? { ...m, status: 'proof_submitted' as const } : m
          ),
        };
      }),
      activityLogs: [
        {
          id: logId(),
          timestamp: ts(),
          type: 'proof_submitted' as const,
          message: `📄 ${scientist?.fullName || 'Scientist'} submitted proof for ${intent.ticker} ${milestone.label}`,
          ticker: intent.ticker,
          intentId: intent.id,
        },
        ...s.activityLogs,
      ],
    };
  }),

  verifyMilestone: (intentId, milestoneId) => set((s) => {
    const intent = s.intents.find(i => i.id === intentId);
    const milestone = intent?.milestones.find(m => m.id === milestoneId);
    if (!intent || !milestone) return s;

    // Find next locked milestone to unlock
    const msIndex = intent.milestones.findIndex(m => m.id === milestoneId);

    return {
      intents: s.intents.map(i => {
        if (i.id !== intentId) return i;
        return {
          ...i,
          milestones: i.milestones.map((m, idx) => {
            if (m.id === milestoneId) return { ...m, status: 'ai_verified' as const };
            // Unlock next milestone
            if (idx === msIndex + 1 && m.status === 'locked') return { ...m, status: 'in_progress' as const };
            return m;
          }),
        };
      }),
      activityLogs: [
        {
          id: logId(),
          timestamp: ts(),
          type: 'ai_verified' as const,
          message: `🛡️ AI Gatekeeper verified ${intent.ticker} ${milestone.label}. Funds unlocked.`,
          ticker: intent.ticker,
          intentId: intent.id,
        },
        ...s.activityLogs,
      ],
    };
  }),

  addPatronage: (intentId, patron) => set((s) => {
    const intent = s.intents.find(i => i.id === intentId);
    if (!intent) return s;

    return {
      intents: s.intents.map(i => {
        if (i.id !== intentId) return i;
        return {
          ...i,
          escrowedAmountUSDC: i.escrowedAmountUSDC + patron.amountUSDC,
          patrons: [...(i.patrons || []), patron],
          supporterCount: (i.supporterCount || 0) + 1,
        };
      }),
      activityLogs: [
        {
          id: logId(),
          timestamp: ts(),
          type: 'patronage' as const,
          message: `💰 ${patron.name} funded ${patron.amountUSDC.toLocaleString()} USDC to ${intent.ticker}`,
          ticker: intent.ticker,
          intentId: intent.id,
        },
        ...s.activityLogs,
      ],
    };
  }),

  addLog: (log) => set((s) => ({
    activityLogs: [
      { ...log, id: logId(), timestamp: ts() },
      ...s.activityLogs,
    ],
  })),

  // Task 6: Burn-to-Boost
  boostIntent: (intentId, amount) => set((s) => {
    const intent = s.intents.find(i => i.id === intentId);
    if (!intent || s.currentUser.auraCredits < amount) return s;

    return {
      currentUser: {
        ...s.currentUser,
        auraCredits: s.currentUser.auraCredits - amount,
      },
      intents: s.intents.map(i => {
        if (i.id !== intentId) return i;
        return {
          ...i,
          boostScore: (i.boostScore || 0) + amount,
        };
      }),
      activityLogs: [
        {
          id: logId(),
          timestamp: ts(),
          type: 'intent_published' as const,
          message: `🔥 +${amount} Aura boost to ${intent.ticker}`,
          ticker: intent.ticker,
          intentId: intent.id,
        },
        ...s.activityLogs,
      ],
    };
  }),
}));
