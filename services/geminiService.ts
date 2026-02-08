
import { GoogleGenAI, Type } from "@google/genai";
import { Insight, AIAnalysis, Feature, FeaturePRD, Organisation, VibePromptSet, TechStackComponent, CustomerSegment, UserIdea, PredictedImpact } from "../types";

// Feature flag: check if AI is enabled
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
export const AI_ENABLED = Boolean(GEMINI_API_KEY);

// Lazy initialization: only create client when API key exists
let aiClient: GoogleGenAI | null = null;

const getAIClient = (): GoogleGenAI | null => {
  if (!AI_ENABLED) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: GEMINI_API_KEY! });
  }
  return aiClient;
};

// Mock implementations for when AI is disabled
const mockAIAnalysis: AIAnalysis = {
  summary: "AI features are disabled. Add VITE_GEMINI_API_KEY to your environment variables to enable AI-powered insights.",
  keyThemes: ["AI disabled", "Manual analysis required"],
  suggestedFeatures: []
};

const mockFeaturePRD: FeaturePRD = {
  problemStatement: "AI features are disabled. Add VITE_GEMINI_API_KEY to enable AI-powered PRD generation.",
  vision: "Enable AI to get detailed product requirements.",
  targetUsers: ["Add API key to enable"],
  successMetrics: ["Add API key to enable"],
  requirements: ["Add VITE_GEMINI_API_KEY to environment variables"]
};

const mockVibePrompts: VibePromptSet = {
  productSummary: "AI features are disabled. Add VITE_GEMINI_API_KEY to enable Vibe Code generation.",
  architecture: "Enable AI to get architecture prompts.",
  frontend: "Enable AI to get frontend implementation prompts.",
  backend: "Enable AI to get backend implementation prompts.",
  dataModel: "Enable AI to get data model prompts.",
  infra: "Enable AI to get infrastructure prompts.",
  ai: "Enable AI to get AI integration prompts."
};

export const analyzeInsights = async (insights: Insight[]): Promise<AIAnalysis> => {
  const ai = getAIClient();
  
  if (!ai) {
    console.warn("AI disabled: returning mock analysis. Add VITE_GEMINI_API_KEY to enable.");
    return mockAIAnalysis;
  }

  const prompt = `Analyze the following customer feedback and generate a structured summary, identifying key themes and suggesting potential new product features based on the feedback.
  
  Feedback:
  ${insights.map(i => `- ${i.customer} from ${i.company}: "${i.content}"`).join('\n')}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "A concise executive summary of the feedback." },
            keyThemes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Main recurring topics or pain points."
            },
            suggestedFeatures: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  priority: { type: Type.STRING, enum: ['low', 'medium', 'high', 'critical'] }
                },
                required: ['title', 'description', 'priority']
              }
            }
          },
          required: ['summary', 'keyThemes', 'suggestedFeatures']
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return {
      summary: "Unable to process AI analysis at this time.",
      keyThemes: [],
      suggestedFeatures: []
    };
  }
};

export const enrichFeaturePRD = async (feature: Feature): Promise<FeaturePRD> => {
  const ai = getAIClient();
  
  if (!ai) {
    console.warn("AI disabled: returning mock PRD. Add VITE_GEMINI_API_KEY to enable.");
    return mockFeaturePRD;
  }

  const prompt = `You are a world-class Product Owner. Based on the feature title and brief description, generate a detailed Product Requirements Document (PRD) segment.
  
  Feature Title: ${feature.title}
  Current Description: ${feature.description}
  
  Provide:
  1. A compelling Problem Statement.
  2. A clear Product Vision.
  3. A list of 3-4 Target User personas.
  4. A list of 3-4 Success Metrics (KPIs).
  5. A list of 5-6 core Functional Requirements.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            problemStatement: { type: Type.STRING },
            vision: { type: Type.STRING },
            targetUsers: { type: Type.ARRAY, items: { type: Type.STRING } },
            successMetrics: { type: Type.ARRAY, items: { type: Type.STRING } },
            requirements: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['problemStatement', 'vision', 'targetUsers', 'successMetrics', 'requirements']
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Enrichment failed:", error);
    return mockFeaturePRD;
  }
};

export const simulateRevenueImpact = async (features: Feature[], strategy: 'growth' | 'efficiency'): Promise<{ featureId: string, impact: PredictedImpact }[]> => {
  const ai = getAIClient();
  
  if (!ai) {
    console.warn("AI disabled: returning empty revenue impact. Add VITE_GEMINI_API_KEY to enable.");
    return features.map(f => ({
      featureId: f.id,
      impact: {
        arrDelta: 0,
        retentionLift: 0,
        expansionProb: 0,
        confidence: 0
      }
    }));
  }

  const prompt = `Act as a SaaS Revenue Strategist. Predict the ARR Delta (USD), Retention Lift (%), and Expansion Probability (%) for each of the following features based on a "${strategy}" strategic focus.
  
  Features:
  ${features.map(f => `- ${f.id}: ${f.title} (${f.description})`).join('\n')}
  
  Focusing on ${strategy === 'growth' ? 'New Customer Acquisition and Top-line Revenue' : 'Customer Success, Churn Reduction, and Efficiency'}.
  Return predictions that reflect this strategy.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              featureId: { type: Type.STRING },
              impact: {
                type: Type.OBJECT,
                properties: {
                  arrDelta: { type: Type.NUMBER, description: "Predicted annual revenue increase in USD" },
                  retentionLift: { type: Type.NUMBER, description: "Percentage increase in retention" },
                  expansionProb: { type: Type.NUMBER, description: "Probability of expansion in percentage (0-100)" },
                  confidence: { type: Type.NUMBER, description: "Model confidence (0.0 to 1.0)" }
                },
                required: ['arrDelta', 'retentionLift', 'expansionProb', 'confidence']
              }
            },
            required: ['featureId', 'impact']
          }
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Revenue simulation failed:", error);
    return features.map(f => ({
      featureId: f.id,
      impact: {
        arrDelta: 0,
        retentionLift: 0,
        expansionProb: 0,
        confidence: 0
      }
    }));
  }
};

export const enrichOrganisationIntelligence = async (org: Partial<Organisation>): Promise<Organisation> => {
  const ai = getAIClient();
  
  if (!ai) {
    console.warn("AI disabled: returning mock organisation data. Add VITE_GEMINI_API_KEY to enable.");
    throw new Error("AI features are disabled. Add VITE_GEMINI_API_KEY to enable organisation intelligence enrichment.");
  }

  const prompt = `Act as an Organisation Intelligence Platform. Based on the following organization details, generate a comprehensive structured profile.
  Name: ${org.name}
  Website: ${org.digitalPresence?.website}
  LinkedIn: ${org.digitalPresence?.linkedin}
  
  Simulate visiting these sources to extract:
  - Concise summary of their business.
  - Industry, segment, size estimate, revenue band.
  - Growth and Innovation signal scores (1-100).
  - Key strategic signals (e.g., market expansion, M&A, tech pivot).
  - Recent relevant news items.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            name: { type: Type.STRING },
            industry: { type: Type.STRING },
            segment: { type: Type.STRING },
            companySize: { type: Type.STRING },
            revenueBand: { type: Type.STRING },
            growthScore: { type: Type.NUMBER },
            innovationScore: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            signals: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  value: { type: Type.STRING },
                  confidence: { type: Type.NUMBER },
                  source: { type: Type.STRING }
                }
              }
            },
            news: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  headline: { type: Type.STRING },
                  summary: { type: Type.STRING },
                  category: { type: Type.STRING },
                  date: { type: Type.STRING },
                  url: { type: Type.STRING }
                }
              }
            }
          },
          required: ['id', 'name', 'industry', 'segment', 'growthScore', 'innovationScore', 'summary', 'signals', 'news']
        }
      }
    });

    const result = JSON.parse(response.text);
    return {
      ...result,
      digitalPresence: org.digitalPresence,
      primaryDomain: org.digitalPresence?.website?.replace('https://', '').replace('http://', '').split('/')[0] || '',
      lastEnrichedAt: new Date().toISOString()
    } as Organisation;
  } catch (error) {
    console.error("Organisation enrichment failed:", error);
    throw error;
  }
};

export const generateVibePrompts = async (features: Feature[], stack: TechStackComponent[]): Promise<VibePromptSet> => {
  const ai = getAIClient();
  
  if (!ai) {
    console.warn("AI disabled: returning mock vibe prompts. Add VITE_GEMINI_API_KEY to enable.");
    return mockVibePrompts;
  }

  const prompt = `You are a Vibe Engineering Orchestrator. Generate a comprehensive set of "Build Vibe Prompts" for an AI coding tool (like Cursor or Windsurf) based on the following features and tech stack.
  
  FEATURES TO BUILD:
  ${features.map(f => `- ${f.title}: ${f.description}`).join('\n')}
  
  TECH STACK CONSTRAINTS:
  ${stack.map(s => `- ${s.category}: ${s.toolName} (v${s.version})`).join('\n')}
  
  Generate specific, high-intent implementation prompts for each architectural layer. 
  Ensure the tone matches "Modern SaaS Excellence".
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            productSummary: { type: Type.STRING, description: "A high-level UX/UI vibe and performance expectation summary." },
            architecture: { type: Type.STRING, description: "System boundaries and data flow directions." },
            frontend: { type: Type.STRING, description: "Detailed prompt for UI implementation including styling and state management." },
            backend: { type: Type.STRING, description: "Detailed prompt for API, logic, and external integrations." },
            dataModel: { type: Type.STRING, description: "Schema and migration direction." },
            infra: { type: Type.STRING, description: "Deployment and environmental strategy prompts." },
            ai: { type: Type.STRING, description: "Optional: Prompts for LLM or RAG integration if applicable." }
          },
          required: ['productSummary', 'architecture', 'frontend', 'backend', 'dataModel', 'infra']
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Vibe generation failed:", error);
    return mockVibePrompts;
  }
};

export const generateCustomerSegments = async (insights: Insight[], portalIdeas: UserIdea[]): Promise<CustomerSegment[]> => {
  const ai = getAIClient();
  
  if (!ai) {
    console.warn("AI disabled: returning empty customer segments. Add VITE_GEMINI_API_KEY to enable.");
    return [];
  }

  const prompt = `Act as a Product Marketing & Strategy AI. Analyze these insights and user ideas to identify 3 distinct "Customer Segments" with deep intelligence profiles.
  
  Insights: ${insights.map(i => i.content).join(' | ')}
  User Ideas: ${portalIdeas.map(idea => idea.title).join(' | ')}
  
  For each segment, fill out the comprehensive 22-point questionnaire (condensed into the provided schema).
  Also simulate feature usage ranking.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              type: { type: Type.STRING, enum: ['core', 'growth', 'experimental', 'legacy'] },
              totalSegmentUsers: { type: Type.NUMBER },
              avgRevenuePerAccount: { type: Type.NUMBER },
              featureUsage: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    featureId: { type: Type.STRING },
                    featureTitle: { type: Type.STRING },
                    usagePercent: { type: Type.NUMBER },
                    avgDailyActiveUsers: { type: Type.NUMBER },
                    retentionRate: { type: Type.NUMBER }
                  }
                }
              },
              firmographics: {
                type: Type.OBJECT,
                properties: {
                  industry: { type: Type.STRING },
                  companySize: { type: Type.STRING },
                  revenueBand: { type: Type.STRING },
                  geography: { type: Type.STRING },
                  growthStage: { type: Type.STRING }
                }
              },
              buyingRoles: {
                type: Type.OBJECT,
                properties: {
                  economicBuyer: { type: Type.STRING },
                  technicalBuyer: { type: Type.STRING },
                  champion: { type: Type.STRING },
                  endUser: { type: Type.STRING },
                  stakeholdersCount: { type: Type.NUMBER }
                }
              },
              jtbd: {
                type: Type.OBJECT,
                properties: {
                  primary: { type: Type.STRING },
                  secondary: { type: Type.ARRAY, items: { type: Type.STRING } },
                  drivers: {
                    type: Type.OBJECT,
                    properties: {
                      emotional: { type: Type.STRING },
                      functional: { type: Type.STRING },
                      social: { type: Type.STRING }
                    }
                  }
                }
              },
              painPoints: {
                type: Type.OBJECT,
                properties: {
                  topProblems: { type: Type.ARRAY, items: { type: Type.STRING } },
                  workarounds: { type: Type.STRING },
                  costOfInaction: { type: Type.STRING },
                  urgency: { type: Type.STRING, enum: ['low', 'medium', 'high', 'critical'] }
                }
              },
              stack: {
                type: Type.OBJECT,
                properties: {
                  currentTools: { type: Type.ARRAY, items: { type: Type.STRING } },
                  integrationsExpected: { type: Type.ARRAY, items: { type: Type.STRING } },
                  dataMaturity: { type: Type.STRING }
                }
              },
              pricing: {
                type: Type.OBJECT,
                properties: {
                  budgetRange: { type: Type.STRING },
                  preference: { type: Type.STRING },
                  sensitivity: { type: Type.STRING }
                }
              },
              scores: {
                type: Type.OBJECT,
                properties: {
                  revenuePotential: { type: Type.NUMBER },
                  growthPotential: { type: Type.NUMBER },
                  strategicImportance: { type: Type.NUMBER },
                  easeOfAcquisition: { type: Type.NUMBER },
                  productFit: { type: Type.NUMBER }
                }
              }
            }
          }
        }
      }
    });

    return JSON.parse(response.text);
  } catch (err) {
    console.error("Customer Segment generation failed:", err);
    return [];
  }
};
