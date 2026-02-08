
import React, { useState } from 'react';
import { Feature, Insight, ScoringWeights } from '../types';
import { ICONS } from '../constants';
import { enrichFeaturePRD } from '../services/geminiService';

interface FeatureDetailProps {
  feature: Feature;
  insights: Insight[];
  weights: ScoringWeights;
  onUpdateFeature: (updated: Feature) => void;
  onClose: () => void;
}

const FeatureDetail: React.FC<FeatureDetailProps> = ({ feature, insights, weights, onUpdateFeature, onClose }) => {
  const [isEnriching, setIsEnriching] = useState(false);
  const linkedInsights = insights.filter(i => feature.linkedInsights.includes(i.id));

  // Check if PRD is partially complete
  const isPrdIncomplete = !feature.prd || 
    !feature.prd.problemStatement || 
    feature.prd.requirements.length === 0;

  const handleDimensionChange = (key: keyof Feature['dimensions'], value: number) => {
    const newDimensions = { ...feature.dimensions, [key]: value };
    const wv = (
      newDimensions.customerValue * weights.customerValue +
      newDimensions.competitive * weights.competitive +
      newDimensions.financial * weights.financial +
      newDimensions.strategic * weights.strategic +
      newDimensions.caseStudy * weights.caseStudy
    );
    const finalScore = newDimensions.effort > 0 ? wv / newDimensions.effort : wv;

    onUpdateFeature({
      ...feature,
      dimensions: newDimensions,
      weightedValue: wv,
      finalScore: parseFloat(finalScore.toFixed(2)),
      updatedAt: new Date().toISOString()
    });
  };

  const handleAIEnrich = async () => {
    setIsEnriching(true);
    try {
      const prd = await enrichFeaturePRD(feature);
      onUpdateFeature({
        ...feature,
        prd,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.error("Enrichment failed:", err);
    } finally {
      setIsEnriching(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-[70] flex flex-col overflow-hidden animate-fadeIn">
      {/* Document Header / Nav */}
      <nav className="h-16 border-b border-gray-100 px-8 flex items-center justify-between bg-white shrink-0">
        <div className="flex items-center space-x-4">
          <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-400 hover:text-gray-900">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="h-4 w-px bg-gray-200"></div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{feature.id}</span>
            <span className="text-gray-300">/</span>
            <span className="text-sm font-bold text-gray-900 truncate max-w-[300px]">{feature.title}</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {isPrdIncomplete && (
            <button 
              onClick={handleAIEnrich}
              disabled={isEnriching}
              className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold hover:bg-indigo-100 transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              {isEnriching ? (
                <div className="animate-spin h-3 w-3 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
              ) : <ICONS.Gemini className="w-3 h-3" />}
              <span>{isEnriching ? 'Enriching Doc...' : 'AI Enrich PRD'}</span>
            </button>
          )}
          <button className="px-5 py-1.5 bg-gray-900 text-white rounded-full text-xs font-bold hover:bg-black transition-all shadow-md">
            Publish
          </button>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Doc Editor/Viewer */}
        <div className="flex-1 overflow-y-auto bg-[#fafafa] flex justify-center py-12 px-6">
          <div className="w-full max-w-[850px] bg-white rounded-lg shadow-sm border border-gray-100 min-h-screen p-16 md:p-24 space-y-16">
            
            {/* PRD Cover Section */}
            <header className="space-y-6">
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">PRD Draft</span>
                <span className="text-gray-300">—</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{feature.strategicType} Stage</span>
              </div>
              <h1 className="text-5xl font-black text-gray-900 tracking-tight leading-tight">{feature.title}</h1>
              <div className="flex items-center space-x-8 pt-4">
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Owner</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 rounded-full bg-gray-200"></div>
                    <span className="text-xs font-bold text-gray-700">{feature.owner}</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</span>
                  <span className="text-xs font-bold text-indigo-600 capitalize">{feature.status}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Updated</span>
                  <span className="text-xs font-bold text-gray-500">{new Date(feature.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </header>

            <div className="h-px bg-gray-100 w-full"></div>

            {/* AI Generated Sections */}
            {feature.prd ? (
              <div className="space-y-20 animate-fadeIn">
                <section className="space-y-6">
                  <h2 className="text-xs font-bold text-gray-400 uppercase tracking-[0.4em]">01. Problem Statement</h2>
                  <p className="text-xl text-gray-700 font-light leading-relaxed">{feature.prd.problemStatement}</p>
                </section>

                <section className="space-y-6">
                  <h2 className="text-xs font-bold text-gray-400 uppercase tracking-[0.4em]">02. Strategic Vision</h2>
                  <p className="text-xl text-gray-700 font-light leading-relaxed italic border-l-4 border-indigo-100 pl-8">{feature.prd.vision}</p>
                </section>

                <div className="grid grid-cols-2 gap-12">
                  <section className="space-y-6">
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-[0.4em]">03. Target Users</h2>
                    <ul className="space-y-3">
                      {feature.prd.targetUsers.map((user, i) => (
                        <li key={i} className="flex items-center text-gray-600 font-light text-sm">
                          <div className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-3"></div>
                          {user}
                        </li>
                      ))}
                    </ul>
                  </section>
                  <section className="space-y-6">
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-[0.4em]">04. Success Metrics</h2>
                    <ul className="space-y-3">
                      {feature.prd.successMetrics.map((metric, i) => (
                        <li key={i} className="flex items-center text-gray-600 font-light text-sm">
                          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-3"></div>
                          {metric}
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>

                <section className="space-y-8">
                  <h2 className="text-xs font-bold text-gray-400 uppercase tracking-[0.4em]">05. Functional Requirements</h2>
                  <div className="grid gap-4">
                    {feature.prd.requirements.map((req, i) => (
                      <div key={i} className="p-6 bg-[#fcfcfc] border border-gray-100 rounded-2xl flex items-start group hover:bg-white hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50/50 transition-all cursor-default">
                        <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-[10px] font-bold mr-4 shrink-0 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                          {i+1}
                        </span>
                        <p className="text-gray-700 text-[15px] font-light pt-0.5">{req}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            ) : (
              <div className="py-24 text-center">
                <div className="w-16 h-16 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                   <ICONS.Gemini className="w-8 h-8 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Build a PRD from your signals</h3>
                <p className="text-gray-400 font-light max-w-sm mx-auto mb-8">
                  Our Product Owner AI can synthesize a complete PRD based on current user feedback and strategic objectives.
                </p>
                <button 
                  onClick={handleAIEnrich}
                  disabled={isEnriching}
                  className="px-8 py-3 bg-gray-900 text-white rounded-full font-bold hover:bg-black transition-all flex items-center space-x-3 mx-auto disabled:opacity-50"
                >
                   {isEnriching ? (
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    ) : <ICONS.Gemini className="w-5 h-5" />}
                  <span>{isEnriching ? 'Synthesizing Document...' : 'Synthesize PRD'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Side Panel Utilities */}
        <aside className="w-[400px] bg-white border-l border-gray-100 flex flex-col shrink-0">
          <div className="p-8 border-b border-gray-100 bg-gray-50/30">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">Benefit Analysis</h3>
            <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">RICE Score</p>
                  <p className="text-4xl font-black text-gray-900">{feature.finalScore}</p>
                </div>
                <div className="flex flex-col items-end">
                   <span className="text-[9px] font-bold text-gray-400 uppercase mb-1">Confidence</span>
                   <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded font-black text-[10px]">{Math.round(feature.dimensions.confidence * 100)}%</span>
                </div>
              </div>

              <div className="space-y-5">
                {[
                  { id: 'customerValue', label: 'User Value', color: 'bg-emerald-400' },
                  { id: 'strategic', label: 'Strategic Alignment', color: 'bg-indigo-400' },
                  { id: 'effort', label: 'Complexity', color: 'bg-rose-400' },
                ].map(dim => (
                  <div key={dim.id}>
                    <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase mb-2">
                      <span>{dim.label}</span>
                      <span>{feature.dimensions[dim.id as keyof Feature['dimensions']]} / 10</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" max="10" 
                      value={feature.dimensions[dim.id as keyof Feature['dimensions']]}
                      onChange={(e) => handleDimensionChange(dim.id as any, parseInt(e.target.value))}
                      className="w-full h-1 bg-gray-100 rounded-full appearance-none cursor-pointer accent-gray-900"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-10">
            <section>
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Evidence Feed</h3>
              <div className="space-y-4">
                {linkedInsights.map(insight => (
                  <div key={insight.id} className="p-5 bg-white border border-gray-100 rounded-2xl hover:border-indigo-100 transition-all">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-6 h-6 rounded-lg bg-gray-50 flex items-center justify-center text-[10px] font-bold text-gray-400">
                        {insight.customer.charAt(0)}
                      </div>
                      <span className="text-[11px] font-bold text-gray-700">{insight.customer}</span>
                    </div>
                    <p className="text-[12px] text-gray-500 font-light leading-relaxed italic line-clamp-2">"{insight.content}"</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Delivery Sync</h3>
              <div className="space-y-3">
                {feature.deliveryLinks.map((link, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-gray-200 transition-all cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center border border-gray-100 shadow-sm text-[9px] font-bold text-gray-400 uppercase">{link.system.charAt(0)}</div>
                      <span className="text-xs font-bold text-gray-700">{link.id}</span>
                    </div>
                    <svg className="w-3.5 h-3.5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default FeatureDetail;
