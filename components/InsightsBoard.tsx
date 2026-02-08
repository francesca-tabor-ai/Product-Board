
import React, { useState } from 'react';
import { Insight, AIAnalysis } from '../types';
import { analyzeInsights, AI_ENABLED } from '../services/geminiService';
import { ICONS } from '../constants';

interface InsightsBoardProps {
  insights: Insight[];
}

const InsightsBoard: React.FC<InsightsBoardProps> = ({ insights }) => {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAIAnalyze = async () => {
    setLoading(true);
    try {
      const result = await analyzeInsights(insights);
      setAnalysis(result);
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'negative': return 'text-rose-600 bg-rose-50 border-rose-100';
      default: return 'text-slate-500 bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white">
      <header className="px-10 py-8 flex items-end justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Customer feedback</h1>
          <p className="text-base text-gray-500 font-light leading-relaxed max-w-lg">
            Synthesize signals from across your ecosystem into actionable product strategy.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleAIAnalyze}
            disabled={loading || !AI_ENABLED}
            className="group relative inline-flex items-center px-6 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-full hover:bg-black transition-all disabled:opacity-50 overflow-hidden shadow-lg shadow-gray-200"
            title={!AI_ENABLED ? "AI features disabled - add VITE_GEMINI_API_KEY" : undefined}
          >
            <div className="absolute inset-0 bg-signature-gradient opacity-0 group-hover:opacity-10 transition-opacity"></div>
            {loading ? (
               <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
            ) : <ICONS.Gemini className="w-4 h-4 mr-2" />}
            <span>{loading ? 'Synthesizing...' : 'AI Synthesizer'}</span>
          </button>
          <button className="px-6 py-2.5 border border-gray-100 rounded-full hover:bg-gray-50 text-sm font-semibold text-gray-700 transition-colors">
            Share results
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-10 pb-12">
        {!AI_ENABLED && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center space-x-3">
            <svg className="w-5 h-5 text-amber-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-900">AI features disabled</p>
              <p className="text-xs text-amber-700 mt-1">Add <code className="bg-amber-100 px-1.5 py-0.5 rounded text-amber-900 font-mono">VITE_GEMINI_API_KEY</code> to your environment variables to enable AI-powered insights.</p>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
          
          <div className="xl:col-span-8 space-y-8">
            <div className="flex items-center justify-between border-b border-gray-50 pb-4">
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Feed ({insights.length})</h2>
              <div className="flex items-center text-xs font-semibold text-indigo-600 cursor-pointer hover:underline">
                Sort by Recent
                <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {insights.map((insight) => (
                <div key={insight.id} className="bg-white rounded-3xl border border-gray-100 p-8 premium-shadow premium-shadow-hover transition-all duration-300 flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-600 font-bold border border-gray-100">
                        {insight.customer.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-bold text-gray-900 leading-none mb-1">{insight.customer}</h3>
                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tight">{insight.company}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getSentimentColor(insight.sentiment)}`}>
                      {insight.sentiment}
                    </span>
                  </div>
                  <p className="text-gray-600 text-[15px] font-normal leading-relaxed mb-8 flex-1">
                    "{insight.content}"
                  </p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {insight.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-white border border-gray-100 text-gray-500 rounded-full text-[10px] font-bold hover:border-gray-200 transition-colors cursor-default tracking-wide uppercase">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="xl:col-span-4">
            <div className="bg-gray-50 rounded-[32px] p-10 sticky top-0 border border-gray-100/50">
              <div className="flex items-center mb-8">
                <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 mr-3">
                  <ICONS.Gemini className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">AI Intelligence</h2>
              </div>
              
              {!analysis ? (
                <div className="text-center py-12 px-6">
                  <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center border border-gray-100 shadow-sm mx-auto mb-6">
                     <ICONS.Gemini className="w-8 h-8 text-gray-200" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 mb-2">Ready to analyze</h3>
                  <p className="text-xs text-gray-500 leading-relaxed font-medium">
                    Select insights and run the synthesizer to discover latent themes in your user data.
                  </p>
                </div>
              ) : (
                <div className="space-y-10 animate-fadeIn">
                  <div>
                    <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Executive Summary</h3>
                    <p className="text-sm text-gray-700 leading-relaxed font-light">{analysis.summary}</p>
                  </div>

                  <div>
                    <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Core Signals</h3>
                    <div className="flex flex-wrap gap-2">
                      {analysis.keyThemes.map(theme => (
                        <span key={theme} className="px-3 py-1.5 bg-white text-indigo-600 rounded-xl text-xs font-semibold border border-indigo-50 shadow-sm">
                          {theme}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Inferred Opportunities</h3>
                    <div className="space-y-3">
                      {analysis.suggestedFeatures.map((feat, idx) => (
                        <div key={idx} className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-indigo-200 transition-all cursor-pointer group">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{feat.title}</h4>
                            <span className="text-[9px] bg-indigo-50 px-2 py-0.5 border border-indigo-100 rounded-full font-bold text-indigo-500 uppercase">{feat.priority}</span>
                          </div>
                          <p className="text-[13px] text-gray-500 leading-snug font-light">{feat.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InsightsBoard;
