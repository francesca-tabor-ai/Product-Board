
import React, { useState, useMemo } from 'react';
import { Feature, PredictedImpact } from '../types';
import { ICONS } from '../constants';
import { simulateRevenueImpact, AI_ENABLED } from '../services/geminiService';

interface RevenueIntelligenceProps {
  features: Feature[];
  onSelectFeature: (id: string) => void;
  onUpdateFeatures: (updated: Feature[]) => void;
}

const RevenueIntelligence: React.FC<RevenueIntelligenceProps> = ({ features, onSelectFeature, onUpdateFeatures }) => {
  const [strategy, setStrategy] = useState<'growth' | 'efficiency'>('growth');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedImpacts, setSimulatedImpacts] = useState<{ featureId: string, impact: PredictedImpact }[] | null>(null);

  const displayFeatures = useMemo(() => {
    let list = [...features];
    
    // Merge in simulated impacts if they exist (for preview)
    if (simulatedImpacts) {
      list = list.map(f => {
        const sim = simulatedImpacts.find(s => s.featureId === f.id);
        return sim ? { ...f, predictedImpact: sim.impact } : f;
      });
    }

    // Sort based on strategy
    if (strategy === 'growth') {
      return list.sort((a, b) => (b.predictedImpact?.arrDelta || 0) - (a.predictedImpact?.arrDelta || 0));
    } else {
      return list.sort((a, b) => (b.predictedImpact?.retentionLift || 0) - (a.predictedImpact?.retentionLift || 0));
    }
  }, [features, strategy, simulatedImpacts]);

  const stats = useMemo(() => {
    const totalArrImpact = displayFeatures.reduce((acc, f) => acc + (f.predictedImpact?.arrDelta || 0), 0);
    const avgRetentionLift = displayFeatures.length > 0 
      ? displayFeatures.reduce((acc, f) => acc + (f.predictedImpact?.retentionLift || 0), 0) / displayFeatures.length
      : 0;
    const totalExpansion = displayFeatures.reduce((acc, f) => acc + ((f.predictedImpact?.expansionProb || 0) * (f.predictedImpact?.arrDelta || 0) / 100), 0);

    return { totalArrImpact, avgRetentionLift, totalExpansion };
  }, [displayFeatures]);

  const handleSimulate = async () => {
    setIsSimulating(true);
    try {
      const results = await simulateRevenueImpact(features, strategy);
      setSimulatedImpacts(results);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleApplyOptimization = () => {
    if (!simulatedImpacts) return;
    
    const updatedFeatures = features.map(f => {
      const sim = simulatedImpacts.find(s => s.featureId === f.id);
      return sim ? { ...f, predictedImpact: sim.impact, updatedAt: new Date().toISOString() } : f;
    });

    onUpdateFeatures(updatedFeatures);
    setSimulatedImpacts(null); // Clear preview after applying
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden animate-fadeIn">
      <header className="px-10 py-8 flex items-end justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Revenue Intelligence</h1>
          <p className="text-base text-gray-500 font-light leading-relaxed max-w-lg">
            Predictive modeling of SaaS metrics impact for the current roadmap.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-gray-100 p-1 rounded-full flex border border-gray-200">
            <button 
              onClick={() => { setStrategy('growth'); setSimulatedImpacts(null); }}
              className={`px-4 py-1.5 text-[10px] font-bold rounded-full transition-all ${strategy === 'growth' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Growth Focus
            </button>
            <button 
              onClick={() => { setStrategy('efficiency'); setSimulatedImpacts(null); }}
              className={`px-4 py-1.5 text-[10px] font-bold rounded-full transition-all ${strategy === 'efficiency' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Retention Focus
            </button>
          </div>
          <button 
            onClick={handleSimulate}
            disabled={isSimulating || !AI_ENABLED}
            className="px-6 py-2.5 bg-gray-900 text-white rounded-full text-sm font-bold hover:bg-black transition-all shadow-lg shadow-gray-200 flex items-center space-x-2 disabled:opacity-50"
            title={!AI_ENABLED ? "AI features disabled - add VITE_GEMINI_API_KEY or VITE_OPENAI_API_KEY" : undefined}
          >
            {isSimulating && <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />}
            <span>{isSimulating ? 'Simulating...' : 'Simulate Roadmap'}</span>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-10 pb-12">
        {/* Executive Dashboard Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col justify-between hover:border-emerald-100 transition-colors">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Predicted ARR Delta</p>
            <div className="flex items-baseline space-x-2">
               <h3 className="text-3xl font-black text-emerald-600">
                 +{stats.totalArrImpact >= 1000 ? `$${(stats.totalArrImpact / 1000).toFixed(1)}k` : `$${stats.totalArrImpact}`}
               </h3>
               <span className="text-[10px] text-gray-400 font-bold">ANNUAL</span>
            </div>
            <div className="mt-6 flex items-center space-x-2 text-[10px] font-bold text-gray-400">
               <span className="text-emerald-500">↑ {Math.round((stats.totalArrImpact / 500000) * 100)}%</span> impact vs baseline
            </div>
          </div>
          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col justify-between hover:border-indigo-100 transition-colors">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Net Retention Lift</p>
            <h3 className="text-3xl font-black text-indigo-600">+{stats.avgRetentionLift.toFixed(1)}%</h3>
            <div className="mt-6 flex items-center space-x-2 text-[10px] font-bold text-gray-400">
               <span className="text-indigo-500">Focus: {strategy}</span>
            </div>
          </div>
          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col justify-between hover:border-amber-100 transition-colors">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Estimated Expansion</p>
            <h3 className="text-3xl font-black text-amber-500">+${Math.round(stats.totalExpansion).toLocaleString()}</h3>
            <div className="mt-6 flex items-center space-x-2 text-[10px] font-bold text-gray-400">
               <span className="text-amber-500">Probabilistic</span> value capture
            </div>
          </div>
        </div>

        {/* Feature Intelligence Table */}
        <div className="border border-gray-100 rounded-[40px] overflow-hidden bg-white shadow-sm">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-10 py-6 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Feature Initiative</th>
                <th className="px-6 py-6 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Confidence</th>
                <th className="px-6 py-6 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">Predicted ARR</th>
                <th className="px-6 py-6 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">Retention Lift</th>
                <th className="px-6 py-6 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">Expansion Prob.</th>
                <th className="px-10 py-6 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Priority Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {displayFeatures.map((feature) => (
                <tr 
                  key={feature.id} 
                  onClick={() => onSelectFeature(feature.id)}
                  className={`hover:bg-gray-50/30 transition-all group cursor-pointer ${simulatedImpacts ? 'bg-indigo-50/20' : ''}`}
                >
                  <td className="px-10 py-7">
                    <div className="flex flex-col">
                      <span className="text-[15px] font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-0.5">{feature.title}</span>
                      <span className="text-xs text-gray-400 font-medium tracking-tight uppercase">{feature.strategicType}</span>
                    </div>
                  </td>
                  <td className="px-6 py-7">
                    <div className="flex items-center space-x-2">
                       <div className="w-12 h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-500" 
                            style={{ width: `${(feature.predictedImpact?.confidence || 0) * 100}%` }}
                          />
                       </div>
                       <span className="text-[10px] font-black text-gray-400">{Math.round((feature.predictedImpact?.confidence || 0) * 100)}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-7 text-center">
                    <span className={`text-sm font-black ${feature.predictedImpact?.arrDelta ? 'text-emerald-600' : 'text-gray-300'}`}>
                      {feature.predictedImpact?.arrDelta ? `+$${feature.predictedImpact.arrDelta.toLocaleString()}` : '—'}
                    </span>
                  </td>
                  <td className="px-6 py-7 text-center">
                    <span className={`text-sm font-black ${feature.predictedImpact?.retentionLift ? 'text-indigo-600' : 'text-gray-300'}`}>
                      {feature.predictedImpact?.retentionLift ? `+${feature.predictedImpact.retentionLift}%` : '—'}
                    </span>
                  </td>
                  <td className="px-6 py-7 text-center">
                    <span className={`text-sm font-black ${feature.predictedImpact?.expansionProb ? 'text-amber-500' : 'text-gray-300'}`}>
                      {feature.predictedImpact?.expansionProb ? `${feature.predictedImpact.expansionProb}%` : '—'}
                    </span>
                  </td>
                  <td className="px-10 py-7 text-right">
                    <div className="inline-flex items-center justify-center px-4 py-2 rounded-2xl bg-gray-900 text-white font-black text-xs">
                      {feature.finalScore}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {displayFeatures.length === 0 && (
            <div className="py-20 text-center text-gray-400 text-xs font-bold uppercase tracking-widest">
               No Roadmap Data Available
            </div>
          )}
        </div>

        {/* Predictive Modelling Insight Card */}
        <div className="mt-12 p-10 bg-signature-gradient rounded-[40px] text-white flex items-center justify-between shadow-2xl shadow-indigo-200">
           <div className="max-w-2xl">
              <div className="flex items-center space-x-3 mb-4">
                <ICONS.Gemini className="w-6 h-6 text-white" />
                <span className="text-xs font-bold uppercase tracking-widest opacity-80">AI Strategy Insight</span>
              </div>
              <h4 className="text-2xl font-bold mb-4 tracking-tight">
                {strategy === 'growth' ? 'Growth-focused roadmap ready for expansion.' : 'Efficiency-first strategy reduces operational drag.'}
              </h4>
              <p className="text-white/80 font-light leading-relaxed">
                {simulatedImpacts 
                  ? "Simulation complete. Review the preview values above. These predictions factor in current market conditions and your segment-specific feature usage signals."
                  : `Your current configuration prioritizes ${strategy}. You can run a predictive simulation to see how these features might impact your Q4 ARR and retention targets.`}
              </p>
           </div>
           <button 
             onClick={simulatedImpacts ? handleApplyOptimization : handleSimulate}
             disabled={isSimulating || !AI_ENABLED}
             className="px-8 py-3 bg-white text-indigo-600 rounded-full font-bold hover:bg-gray-50 transition-all shadow-xl disabled:opacity-50"
             title={!AI_ENABLED ? "AI features disabled - add VITE_GEMINI_API_KEY or VITE_OPENAI_API_KEY" : undefined}
           >
             {simulatedImpacts ? 'Apply Optimization' : 'Run Predictive Model'}
           </button>
        </div>
      </main>
    </div>
  );
};

export default RevenueIntelligence;
