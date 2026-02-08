
import React from 'react';
import { Insight, Feature, ScoringWeights, Organisation, UserIdea, TechStackProfile, CustomerIntelligenceData, PricingPlanData } from './types';

export const DEFAULT_WEIGHTS: ScoringWeights = {
  customerValue: 0.30,
  competitive: 0.25,
  financial: 0.25,
  strategic: 0.15,
  caseStudy: 0.05
};

export const INITIAL_CUSTOMER_DATA: CustomerIntelligenceData = {
  segments: [
    { 
      id: 'seg-1', 
      name: 'Enterprise SREs', 
      description: 'Platform reliability engineers at Fortune 500 companies managing hybrid cloud.', 
      type: 'core',
      totalSegmentUsers: 4500,
      avgRevenuePerAccount: 125000,
      featureUsage: [
        { featureId: 'feat-101', featureTitle: 'High-Resolution Export', usagePercent: 88, avgDailyActiveUsers: 340, retentionRate: 92 },
        { featureId: 'feat-103', featureTitle: 'SSO / SAML', usagePercent: 42, avgDailyActiveUsers: 90, retentionRate: 98 }
      ],
      firmographics: {
        industry: 'Technology / Cloud Services',
        companySize: '10,000+',
        revenueBand: '$1B+',
        geography: 'Global',
        growthStage: 'Public'
      },
      buyingRoles: {
        economicBuyer: 'VP Infrastructure',
        technicalBuyer: 'Principal SRE',
        champion: 'DevOps Lead',
        endUser: 'On-call Engineer',
        stakeholdersCount: 12
      },
      jtbd: {
        primary: 'Minimize Mean Time to Recovery (MTTR)',
        secondary: ['Audit infrastructure drift', 'Optimize cloud spend'],
        drivers: {
          emotional: 'Peace of mind during peak traffic',
          functional: 'Automated remediation scripts',
          social: 'Recognition as a top-tier reliability team'
        }
      },
      painPoints: {
        topProblems: ['Alert fatigue', 'Siloed monitoring data', 'Lack of root cause context'],
        workarounds: 'Stitching together Slack logs and multiple dashboards manually',
        costOfInaction: '$500k per hour of unplanned downtime',
        urgency: 'critical'
      },
      stack: {
        currentTools: ['Terraform', 'Datadog', 'Kubernetes'],
        integrationsExpected: ['ServiceNow', 'Slack', 'PagerDuty'],
        dataMaturity: 'Advanced'
      },
      pricing: {
        budgetRange: '$100k - $500k',
        preference: 'Annual Flat Subscription',
        sensitivity: 'Low'
      },
      scores: {
        revenuePotential: 5,
        growthPotential: 3,
        strategicImportance: 5,
        easeOfAcquisition: 2,
        productFit: 4
      }
    },
    { 
      id: 'seg-2', 
      name: 'Fintech Compliance Officers', 
      description: 'Heads of compliance ensuring regulatory adherence in digital banking.', 
      type: 'growth',
      totalSegmentUsers: 1200,
      avgRevenuePerAccount: 85000,
      featureUsage: [
        { featureId: 'feat-105', featureTitle: 'Audit Log API', usagePercent: 95, avgDailyActiveUsers: 45, retentionRate: 99 }
      ],
      firmographics: {
        industry: 'Financial Services',
        companySize: '500-2,000',
        revenueBand: '$100M - $500M',
        geography: 'EMEA / NA',
        growthStage: 'Scale-up'
      },
      buyingRoles: {
        economicBuyer: 'Chief Compliance Officer',
        technicalBuyer: 'IT Security Manager',
        champion: 'Lead Compliance Analyst',
        endUser: 'Compliance Associate',
        stakeholdersCount: 5
      },
      jtbd: {
        primary: 'Pass external audits without manual data gathering',
        secondary: ['Monitor internal data access', 'Flag suspicious patterns'],
        drivers: {
          emotional: 'Confidence during regulator visits',
          functional: 'Immutable audit trails',
          social: 'Zero-finding audit reputation'
        }
      },
      painPoints: {
        topProblems: ['Data fragmentation', 'Lack of visibility into AI decisions', 'Manual reporting'],
        workarounds: 'Excel spreadsheets and manual screenshots of logs',
        costOfInaction: '$2M+ in potential fines',
        urgency: 'high'
      },
      stack: {
        currentTools: ['Splunk', 'Salesforce', 'Vanta'],
        integrationsExpected: ['Slack', 'Email Archiver'],
        dataMaturity: 'Medium'
      },
      pricing: {
        budgetRange: '$50k - $150k',
        preference: 'Per-seat + Compliance Add-on',
        sensitivity: 'Medium'
      },
      scores: {
        revenuePotential: 4,
        growthPotential: 4,
        strategicImportance: 5,
        easeOfAcquisition: 3,
        productFit: 5
      }
    },
    { 
      id: 'seg-3', 
      name: 'E-commerce Growth Hackers', 
      description: 'Performance marketers and product designers focused on LTV and conversion.', 
      type: 'experimental',
      totalSegmentUsers: 8000,
      avgRevenuePerAccount: 15000,
      featureUsage: [
        { featureId: 'feat-104', featureTitle: 'Collaborative Editor', usagePercent: 70, avgDailyActiveUsers: 450, retentionRate: 82 }
      ],
      firmographics: {
        industry: 'Retail / E-commerce',
        companySize: '50-250',
        revenueBand: '$10M - $50M',
        geography: 'North America',
        growthStage: 'Early Expansion'
      },
      buyingRoles: {
        economicBuyer: 'Head of Growth',
        technicalBuyer: 'Engineering Lead',
        champion: 'Product Designer',
        endUser: 'Growth Analyst',
        stakeholdersCount: 3
      },
      jtbd: {
        primary: 'Test new feature ideas 2x faster',
        secondary: ['Analyze user sentiment on-the-fly', 'Coordinate marketing launches'],
        drivers: {
          emotional: 'Excitement of seeing growth curves tick up',
          functional: 'A/B test integration with roadmaps',
          social: 'Being seen as the most agile team in the company'
        }
      },
      painPoints: {
        topProblems: ['Slow development cycles', 'Poor user feedback loops', 'Disconnected strategy'],
        workarounds: 'Notion for roadmaps, Slack for feedback, Jira for engineering - all disconnected',
        costOfInaction: 'Lost market share to faster competitors',
        urgency: 'medium'
      },
      stack: {
        currentTools: ['Amplitude', 'Optimizely', 'Linear'],
        integrationsExpected: ['Shopify', 'Klaviyo'],
        dataMaturity: 'High'
      },
      pricing: {
        budgetRange: '$5k - $20k',
        preference: 'Self-serve Monthly',
        sensitivity: 'High'
      },
      scores: {
        revenuePotential: 2,
        growthPotential: 5,
        strategicImportance: 3,
        easeOfAcquisition: 5,
        productFit: 4
      }
    }
  ],
  painPoints: [
    { id: 'pp-1', title: 'Roadmap/Build Drift', description: 'Engineering building things that no longer match the latest strategic pivot.', severity: 'high', signalCount: 124 },
    { id: 'pp-2', title: 'Context Loss', description: 'Insights lost between support tickets and product backlogs.', severity: 'medium', signalCount: 89 }
  ],
  jtbd: [
    { id: 'jtbd-1', job: 'Align stakeholders instantly', context: 'When presenting to the board', outcome: 'Unanimous approval of the roadmap', category: 'social' }
  ]
};

export const INITIAL_PRICING_DATA: PricingPlanData = {
  tiers: [
    { id: 'tier-starter', name: 'Starter', description: 'Essential tools for small teams', monthlyPrice: 49, yearlyPrice: 470, features: ['feat-101'] },
    { id: 'tier-pro', name: 'Professional', description: 'Advanced power for growing organizations', monthlyPrice: 199, yearlyPrice: 1910, features: [] },
    { id: 'tier-enterprise', name: 'Enterprise', description: 'Maximum security and scale', monthlyPrice: 999, yearlyPrice: 9590, features: [] }
  ],
  countries: [
    { code: 'US', name: 'United States', currency: 'USD', symbol: '$', fxRate: 1, mode: 'universal', overrides: {} },
    { code: 'GB', name: 'United Kingdom', currency: 'GBP', symbol: '£', fxRate: 0.78, mode: 'localized', overrides: { 'tier-starter': { monthly: 39, yearly: 380 } } },
    { code: 'EU', name: 'Eurozone', currency: 'EUR', symbol: '€', fxRate: 0.92, mode: 'universal', overrides: {} },
    { code: 'JP', name: 'Japan', currency: 'JPY', symbol: '¥', fxRate: 151.2, mode: 'universal', overrides: {} }
  ],
  yearlyDiscount: 0.2
};

export const INITIAL_IDEAS: UserIdea[] = [
  {
    id: 'idea-1',
    title: 'Slack Notification Integration',
    description: 'Get real-time updates when a roadmap item status changes or a new feature is added to discovery.',
    votes: 142,
    status: 'planned',
    category: 'Integrations',
    author: 'Mark T.'
  },
  {
    id: 'idea-2',
    title: 'Mobile App for Roadmaps',
    description: 'A dedicated iOS/Android app to view and comment on roadmaps on the go.',
    votes: 89,
    status: 'under-consideration',
    category: 'Mobile',
    author: 'Elena R.'
  },
  {
    id: 'idea-3',
    title: 'Dark Mode Support',
    description: 'A high-contrast dark theme for long product discovery sessions at night.',
    votes: 215,
    status: 'planned',
    category: 'UX',
    author: 'Dave G.'
  },
  {
    id: 'idea-4',
    title: 'Microsoft Teams Connector',
    description: 'Alternative to Slack for enterprise environments using the O365 stack.',
    votes: 45,
    status: 'under-consideration',
    category: 'Integrations',
    author: 'Sarah K.'
  },
  {
    id: 'idea-5',
    title: 'White-labeled Portal',
    description: 'Ability to use own domain and CSS for the customer feedback portal.',
    votes: 67,
    status: 'not-now',
    category: 'Branding',
    author: 'Tom W.'
  }
];

export const INITIAL_TECH_STACK: TechStackProfile = {
  id: 'tsp-1',
  name: 'Standard Platform Stack',
  version: '2.4.0',
  updatedAt: '2024-03-20T10:00:00Z',
  components: [
    { id: 'tc-1', category: 'Frontend', toolName: 'React', version: '18.x', status: 'approved' },
    { id: 'tc-2', category: 'Frontend', toolName: 'Tailwind CSS', version: '3.x', status: 'approved' },
    { id: 'tc-3', category: 'Backend', toolName: 'Node.js', version: '20.x', status: 'approved' },
    { id: 'tc-4', category: 'Backend', toolName: 'Express', version: '4.x', status: 'approved' },
    { id: 'tc-5', category: 'Database', toolName: 'PostgreSQL', version: '15.x', status: 'approved' },
    { id: 'tc-11', category: 'AI / ML', toolName: 'Gemini AI', version: 'Pro 1.5', status: 'required' },
  ]
};

export const INITIAL_INSIGHTS: Insight[] = [
  {
    id: '1',
    customer: 'Sarah Jenkins',
    company: 'TechFlow',
    content: 'We really need a way to export our roadmap to PDF or high-res PNG for our board meetings.',
    sentiment: 'neutral',
    date: '2024-03-15',
    tags: ['Export', 'Board Reporting'],
    linkedFeatures: ['feat-101']
  },
  {
    id: '2',
    customer: 'Marcus Chen',
    company: 'BitBank',
    content: 'The ability to track which customer segment is requesting what feature is a game changer for us.',
    sentiment: 'positive',
    date: '2024-03-18',
    tags: ['Segmentation', 'Strategy'],
    linkedFeatures: ['feat-106']
  }
];

export const INITIAL_FEATURES: Feature[] = [
  {
    id: 'feat-101',
    title: 'High-Resolution Export',
    description: 'Allow users to export roadmaps as PDF or PNG.',
    status: 'planned',
    priority: 'medium',
    strategicType: 'core',
    dimensions: { customerValue: 8, competitive: 4, financial: 3, strategic: 6, caseStudy: 2, effort: 2, confidence: 0.9 },
    weightedValue: 0, finalScore: 0,
    owner: 'Alex Rivera', release: 'Q2 2024', productArea: 'Core Platform',
    deliveryLinks: [{ system: 'jira', id: 'PROD-442', url: '#' }],
    customerImpacts: [{ segment: 'Enterprise', score: 9 }],
    linkedInsights: ['1'], createdAt: '2024-01-10T10:00:00Z', updatedAt: '2024-03-15T14:30:00Z',
    predictedImpact: { arrDelta: 45000, retentionLift: 4, expansionProb: 20, confidence: 0.85 }
  },
  {
    id: 'feat-102',
    title: 'Gemini AI Summarizer',
    description: 'Auto-generate executive summaries for feedback clusters.',
    status: 'in-progress',
    priority: 'high',
    strategicType: 'expansion',
    dimensions: { customerValue: 9, competitive: 8, financial: 5, strategic: 9, caseStudy: 5, effort: 4, confidence: 0.8 },
    weightedValue: 0, finalScore: 0,
    owner: 'Alex Rivera', release: 'Q3 2024', productArea: 'AI Services',
    deliveryLinks: [{ system: 'linear', id: 'AI-88', url: '#' }],
    customerImpacts: [{ segment: 'Growth', score: 10 }],
    linkedInsights: [], createdAt: '2024-02-15T10:00:00Z', updatedAt: '2024-03-18T09:00:00Z',
    predictedImpact: { arrDelta: 120000, retentionLift: 12, expansionProb: 45, confidence: 0.75 }
  },
  {
    id: 'feat-103',
    title: 'SSO / SAML Integration',
    description: 'Platform primitive for enterprise-grade authentication.',
    status: 'released',
    priority: 'critical',
    strategicType: 'foundation',
    dimensions: { customerValue: 10, competitive: 5, financial: 9, strategic: 7, caseStudy: 1, effort: 6, confidence: 1.0 },
    weightedValue: 0, finalScore: 0,
    owner: 'Jordan Smith', release: 'Q1 2024', productArea: 'Security & Auth',
    deliveryLinks: [{ system: 'jira', id: 'SEC-101', url: '#' }],
    customerImpacts: [{ segment: 'Enterprise', score: 10 }],
    linkedInsights: [], createdAt: '2023-11-10T10:00:00Z', updatedAt: '2024-01-20T14:30:00Z',
    predictedImpact: { arrDelta: 250000, retentionLift: 15, expansionProb: 10, confidence: 0.95 }
  },
  {
    id: 'feat-104',
    title: 'Collaborative Editor',
    description: 'Real-time multi-user editing for PRDs and strategy docs.',
    status: 'discovery',
    priority: 'medium',
    strategicType: 'experimental',
    dimensions: { customerValue: 8, competitive: 7, financial: 4, strategic: 6, caseStudy: 3, effort: 8, confidence: 0.6 },
    weightedValue: 0, finalScore: 0,
    owner: 'Casey Lee', release: 'Q4 2024', productArea: 'Collaboration',
    deliveryLinks: [],
    customerImpacts: [],
    linkedInsights: [], createdAt: '2024-03-01T10:00:00Z', updatedAt: '2024-03-01T10:00:00Z',
    predictedImpact: { arrDelta: 65000, retentionLift: 8, expansionProb: 30, confidence: 0.5 }
  },
  {
    id: 'feat-105',
    title: 'Audit Log API',
    description: 'Expose immutable events via GraphQL/REST for compliance.',
    status: 'planned',
    priority: 'high',
    strategicType: 'foundation',
    dimensions: { customerValue: 7, competitive: 4, financial: 8, strategic: 5, caseStudy: 2, effort: 5, confidence: 0.9 },
    weightedValue: 0, finalScore: 0,
    owner: 'Jordan Smith', release: 'Q2 2024', productArea: 'Infrastructure',
    deliveryLinks: [],
    customerImpacts: [],
    linkedInsights: [], createdAt: '2024-01-20T10:00:00Z', updatedAt: '2024-01-20T10:00:00Z',
    predictedImpact: { arrDelta: 85000, retentionLift: 20, expansionProb: 5, confidence: 0.9 }
  },
  {
    id: 'feat-106',
    title: 'Segment Analysis Dashboard',
    description: 'End-user tool to visualize roadmap impact by segment.',
    status: 'idea',
    priority: 'low',
    strategicType: 'experimental',
    dimensions: { customerValue: 6, competitive: 6, financial: 4, strategic: 8, caseStudy: 4, effort: 3, confidence: 0.7 },
    weightedValue: 0, finalScore: 0,
    owner: 'Alex Rivera', release: 'Backlog', productArea: 'Reporting',
    deliveryLinks: [],
    customerImpacts: [],
    linkedInsights: ['2'], createdAt: '2024-03-18T10:00:00Z', updatedAt: '2024-03-18T10:00:00Z',
    predictedImpact: { arrDelta: 35000, retentionLift: 3, expansionProb: 15, confidence: 0.6 }
  }
];

export const INITIAL_ORGANISATION: Organisation = {
  id: 'org-main',
  name: 'ProductSync Corp',
  primaryDomain: 'productsync.ai',
  industry: 'Enterprise Software / AI',
  summary: 'ProductSync is the operating system for modern product organizations, leveraging Gemini AI to bridge the gap between user signals and code implementation.',
  digitalPresence: {
    website: 'https://productsync.ai',
    linkedin: 'https://linkedin.com/company/productsync',
    twitter: 'https://twitter.com/productsync',
    extraLinks: []
  },
  strategy: {
    vision: 'To eliminate the gap between strategy and execution through AI-orchestrated build manifests.',
    mission: 'Empowering product teams to build the right thing, faster, with data-driven confidence.',
    successDefinition: '10x improvement in feature-to-value delivery cycle for our customers.',
    priorities: ['AI Integration Expansion', 'Enterprise Security Hardening', 'Ecosystem Connectors'],
    strategicBets: 'Generative AI will replace traditional PRD writing and technical scaffolding.'
  },
  businessModel: {
    revenueStreams: 'SaaS Subscription (Tiered per seat) + AI Orchestration Usage Credits.',
    acquisitionVsRetention: '70% Retention Focus / 30% New Acquisition.',
    arrTarget: '$50M by end of 2025.',
    cacLtv: 'Targeting 3:1 LTV:CAC ratio.'
  },
  productStrategy: {
    positioning: 'The only Product OS that talks to your code and your customers.',
    differentiators: 'Gemini-powered build manifest generation (Vibe Code).',
    nonNegotiables: 'Data privacy and enterprise-grade security.',
    strategicFocus: 'Platform expansion and deeper AI workflows.'
  },
  competitive: {
    topCompetitors: ['Productboard', 'Linear', 'Aha!'],
    weaknesses: 'Early stage ecosystem compared to incumbents.',
    strengths: 'Native AI capabilities and technical build orchestration.',
    threats: 'Large incumbents adding AI features rapidly.'
  },
  delivery: {
    constraints: 'High engineering talent cost and API rate limits.',
    techDebtPriorities: 'Scaling the real-time websocket layer for global collaboration.',
    capacityAllocation: '50% Innovation / 30% Maintenance / 20% Compliance.'
  },
  compliance: {
    regulatory: 'GDPR, SOC2 Type II compliance required.',
    securityPriorities: 'Zero Trust architecture implementation.'
  },
  governance: {
    decisionMakers: 'CPO, CTO, and Product Council.',
    reviewFrequency: 'Bi-weekly strategic syncs.',
    changeTriggers: 'Significant market shifts or competitor moves.'
  },
  signals: [],
  news: []
};

export const ICONS = {
  Insights: (props: any) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
    </svg>
  ),
  Features: (props: any) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    </svg>
  ),
  Roadmap: (props: any) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
    </svg>
  ),
  Portal: (props: any) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.255-3.383c.195-.29.515-.475.865-.501 1.153-.086 2.294-.213 3.423-.379 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
    </svg>
  ),
  Revenue: (props: any) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ),
  Pricing: (props: any) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581a1.125 1.125 0 0 0 1.591 0l4.318-4.318a1.125 1.125 0 0 0 0-1.591L9.568 3.659A2.25 2.25 0 0 0 8.147 3Zm0 0V3m-2.25 4.5a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" />
    </svg>
  ),
  Organisation: (props: any) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
    </svg>
  ),
  TechStack: (props: any) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75 16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
    </svg>
  ),
  Customer: (props: any) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
    </svg>
  ),
  VibeCode: (props: any) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
    </svg>
  ),
  Gemini: (props: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" />
    </svg>
  )
};
