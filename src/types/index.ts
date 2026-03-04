// User roles
export type UserRole = 'scientist' | 'patron' | 'guest';

// Research tags
export type ResearchTag = '#Longevity' | '#AI-Bio' | '#Neuroscience' | '#Genomics' | '#Quantum' | '#Climate' | '#Tier-1' | '#Tier-2' | '#DeSci';

// Scientist Profile
export interface ScientistProfile {
  id: string;
  fullName: string;
  email: string;
  handle: string;
  affiliation: string;
  bio: string;
  status: 'pending_review' | 'approved';
  avatarUrl?: string;
  tags?: ResearchTag[];
}

// Milestone status
export type MilestoneStatus = 'locked' | 'in_progress' | 'proof_submitted' | 'ai_verified' | 'released';

// Milestone labels
export type MilestoneLabel = 'M0' | 'M1' | 'M2' | 'M3' | 'R' | 'SSR';

// Milestone
export interface Milestone {
  id: string;
  intentId: string;
  order: 1 | 2 | 3;
  label: MilestoneLabel;
  sublabel: string;
  estTime: string;
  objective: string;
  deliverables: string;
  verificationCriteria: string;
  releaseAmountUSDC: number;
  status: MilestoneStatus;
  proofLinks?: string[];
}

// Intent status
export type IntentStatus = 'draft' | 'ai_screening' | 'published' | 'funded' | 'completed';

// Patron entry
export interface Patron {
  id: string;
  name: string;
  avatarUrl?: string;
  amountUSDC: number;
}

// Backer (org)
export interface Backer {
  id: string;
  name: string;
  logoUrl?: string;
}

// Resource Ask
export interface ResourceAsk {
  type: 'compute' | 'data' | 'equipment' | 'talent';
  description: string;
  quantity: string;
}

// Activity Log
export type ActivityType = 'patronage' | 'proof_submitted' | 'ai_verified' | 'intent_published' | 'milestone_unlocked';

export interface ActivityLog {
  id: string;
  timestamp: number;
  type: ActivityType;
  message: string;
  ticker?: string;
  intentId?: string;
}

// Intent Asset
export interface IntentAsset {
  id: string;
  scientistId: string;
  title: string;
  ticker: string;
  coreHypothesis: string;
  evidenceLinks: string[];
  fundingGoalUSDC: number;
  escrowedAmountUSDC: number;
  status: IntentStatus;
  milestones: Milestone[];
  aiScore?: number;
  tags?: ResearchTag[];
  patrons?: Patron[];
  backers?: Backer[];
  resourceAsks?: ResourceAsk[];
  trendingRank?: number;
  supporterCount?: number;
}
