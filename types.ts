export enum View {
  DASHBOARD = 'DASHBOARD',
  ANALYZER = 'ANALYZER',
  ADVISOR = 'ADVISOR',
  ACTIVITY = 'ACTIVITY',
  PROFILES = 'PROFILES'
}

export interface AnalysisResult {
  safetyScore: number;
  riskLevel: 'SAFE' | 'LOW_RISK' | 'MODERATE_RISK' | 'HIGH_RISK';
  categories: string[];
  reasoning: string;
  recommendation: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface ActivityItem {
  id: string;
  app: string;
  duration: number; // minutes
  timestamp: string;
  category: 'Education' | 'Entertainment' | 'Social' | 'Game' | 'Utility';
  flagged: boolean;
}

export interface ChildProfile {
  id: string;
  name: string;
  dob: string; // YYYY-MM-DD
  avatarColor: string;
  dailyLimit: number; // minutes
  bedtime: string;
  restrictedCategories: string[];
}
