
export enum View {
  ORGANISATION = 'organisation',
  CUSTOMER = 'customer',
  PRICING = 'pricing',
  REVENUE = 'revenue',
  ROADMAP = 'roadmap',
  FEATURES = 'features',
  TECH_STACK = 'tech_stack',
  VIBE_CODE = 'vibe_code',
  PORTAL = 'portal',
  INSIGHTS = 'insights',
  ACCOUNT = 'account'
}

export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type FeatureStatus = 'idea' | 'discovery' | 'planned' | 'in-progress' | 'released' | 'archived';
export type StrategicType = 'core' | 'expansion' | 'experimental' | 'foundation';

export interface UserIdea {
  id: string;
  title: string;
  description: string;
  votes: number;
  status: 'under-consideration' | 'planned' | 'not-now';
  category: string;
  author: string;
}

export interface FeatureUsageMetric {
  featureId: string;
  featureTitle: string;
  usagePercent: number;
  avgDailyActiveUsers?: number;
  retentionRate?: number;
}

export interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  type: 'core' | 'growth' | 'experimental' | 'legacy';
  
  // Usage Data
  featureUsage: FeatureUsageMetric[];
  totalSegmentUsers: number;
  avgRevenuePerAccount: number;

  // 2. Firmographics
  firmographics: {
    industry: string;
    subIndustry?: string;
    companySize: string;
    revenueBand: string;
    geography: string;
    growthStage: string;
  };

  // 3. Buying Roles
  buyingRoles: {
    economicBuyer: string;
    technicalBuyer: string;
    champion: string;
    endUser: string;
    stakeholdersCount: number;
  };

  // 4. JTBD
  jtbd: {
    primary: string;
    secondary: string[];
    drivers: {
      emotional: string;
      functional: string;
      social: string;
    };
  };

  // 5. Pain Points
  painPoints: {
    topProblems: string[];
    workarounds: string;
    costOfInaction: string;
    urgency: 'low' | 'medium' | 'high' | 'critical';
  };

  // 6. Stack
  stack: {
    currentTools: string[];
    integrationsExpected: string[];
    dataMaturity: string;
  };

  // 9. Pricing
  pricing: {
    budgetRange: string;
    preference: string;
    sensitivity: string;
  };

  // 21. Scoring
  scores: {
    revenuePotential: number; // 1-5
    growthPotential: number;
    strategicImportance: number;
    easeOfAcquisition: number;
    productFit: number;
  };

  metadata?: any;
}

export interface PainPoint {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  signalCount: number;
}

export interface JTBD {
  id: string;
  job: string;
  context: string;
  outcome: string;
  category: 'functional' | 'emotional' | 'social';
}

export interface CustomerIntelligenceData {
  segments: CustomerSegment[];
  painPoints: PainPoint[];
  jtbd: JTBD[];
}

export interface PricingTier {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[]; // array of feature IDs
}

export interface CountryConfig {
  code: string;
  name: string;
  currency: string;
  symbol: string;
  fxRate: number;
  mode: 'universal' | 'localized';
  overrides: {
    [tierId: string]: {
      monthly: number;
      yearly: number;
    };
  };
}

export interface PricingPlanData {
  tiers: PricingTier[];
  countries: CountryConfig[];
  yearlyDiscount: number;
}

export interface ScoringWeights {
  customerValue: number;
  competitive: number;
  financial: number;
  strategic: number;
  caseStudy: number;
}

export interface PredictedImpact {
  arrDelta: number; // in USD
  retentionLift: number; // percentage
  expansionProb: number; // percentage
  confidence: number; // 0-1
}

export interface DeliveryLink {
  system: 'jira' | 'linear' | 'github' | 'azure_devops';
  id: string;
  url: string;
}

export interface CustomerImpact {
  segment: string;
  score: number;
  notes?: string;
}

export interface FeaturePRD {
  problemStatement: string;
  vision: string;
  targetUsers: string[];
  successMetrics: string[];
  requirements: string[];
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  status: FeatureStatus;
  priority: Priority;
  strategicType: StrategicType;
  
  dimensions: {
    customerValue: number;
    competitive: number;
    financial: number;
    strategic: number;
    caseStudy: number;
    effort: number;
    confidence: number; // 0-1
  };
  
  weightedValue: number;
  finalScore: number;

  owner: string;
  release: string;
  productArea: string;
  
  deliveryLinks: DeliveryLink[];
  customerImpacts: CustomerImpact[];
  linkedInsights: string[];
  
  createdAt: string;
  updatedAt: string;

  prd?: FeaturePRD;

  predictedImpact?: PredictedImpact;
}

export interface Insight {
  id: string;
  customer: string;
  company: string;
  content: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  date: string;
  tags: string[];
  linkedFeatures: string[];
}

export interface AIAnalysis {
  summary: string;
  suggestedFeatures: Partial<Feature>[];
  keyThemes: string[];
}

export interface OrganisationSignal {
  type: string;
  value: string;
  confidence: number;
  source: string;
}

export interface OrganisationNews {
  headline: string;
  summary: string;
  category: string;
  date: string;
  url: string;
}

export interface Link {
  title: string;
  url: string;
}

export interface Organisation {
  id: string;
  name: string;
  primaryDomain: string;
  industry: string;
  summary: string;
  lastEnrichedAt?: string;
  
  digitalPresence: {
    website: string;
    linkedin?: string;
    youtube?: string;
    twitter?: string;
    extraLinks: Link[];
  };

  // 1. Company Strategy
  strategy: {
    vision: string;
    mission: string;
    successDefinition: string;
    priorities: string[];
    strategicBets: string;
  };

  // 2. Business Model
  businessModel: {
    revenueStreams: string;
    acquisitionVsRetention: string;
    arrTarget: string;
    cacLtv: string;
  };

  // 4. Product Strategy
  productStrategy: {
    positioning: string;
    differentiators: string;
    nonNegotiables: string;
    strategicFocus: string;
  };

  // 5. Competitive
  competitive: {
    topCompetitors: string[];
    weaknesses: string;
    strengths: string;
    threats: string;
  };

  // 8. Technology & Delivery
  delivery: {
    constraints: string;
    techDebtPriorities: string;
    capacityAllocation: string;
  };

  // 10. Risk & Compliance
  compliance: {
    regulatory: string;
    securityPriorities: string;
  };

  // 13. Governance
  governance: {
    decisionMakers: string;
    reviewFrequency: string;
    changeTriggers: string;
  };

  signals: OrganisationSignal[];
  news: OrganisationNews[];
}

export type TechComponentStatus = 'approved' | 'deprecated' | 'blocked' | 'required';

export interface TechStackComponent {
  id: string;
  category: string;
  toolName: string;
  version: string;
  status: TechComponentStatus;
  isCustom?: boolean;
}

export interface TechStackProfile {
  id: string;
  name: string;
  version: string;
  updatedAt: string;
  components: TechStackComponent[];
}

export interface VibePromptSet {
  productSummary: string;
  architecture: string;
  frontend: string;
  backend: string;
  dataModel: string;
  infra: string;
  ai?: string;
}
