
import React, { useState } from 'react';
import { CustomerIntelligenceData, JTBD, PainPoint, CustomerSegment, Insight, UserIdea, Feature } from '../types';
import { ICONS, INITIAL_INSIGHTS, INITIAL_IDEAS } from '../constants';
import { generateCustomerSegments, AI_ENABLED } from '../services/geminiService';

interface CustomerIntelligenceProps {
  data: CustomerIntelligenceData;
  features: Feature[];
  onAddSegment: (segment: CustomerSegment) => void;
  onSetSegments: (segments: CustomerSegment[]) => void;
}

const CustomerIntelligence: React.FC<CustomerIntelligenceProps> = ({ data, features, onAddSegment, onSetSegments }) => {
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCrmSyncing, setIsCrmSyncing] = useState(false);

  // Simple form state for manual segment creation (core fields)
  const [newSegName, setNewSegName] = useState('');
  const [newSegDesc, setNewSegDesc] = useState('');

  const selectedSegment = data.segments.find(s => s.id === selectedSegmentId);

  const handleAutoGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await generateCustomerSegments(INITIAL_INSIGHTS, INITIAL_IDEAS);
      onSetSegments([...data.segments, ...result]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleConnectCRM = async () => {
    setIsCrmSyncing(true);
    setTimeout(async () => {
      try {
        const result = await generateCustomerSegments(INITIAL_INSIGHTS, INITIAL_IDEAS);
        onSetSegments([...data.segments, ...result]);
      } catch (err) {
        console.error(err);
      } finally {
        setIsCrmSyncing(false);
      }
    }, 2000);
  };

  const handleManualAdd = () => {
    if (!newSegName) return;
    const newSeg: CustomerSegment = {
      id: `seg-${Date.now()}`,
      name: newSegName,
      description: newSegDesc,
      type: 'experimental',
      totalSegmentUsers: 0,
      avgRevenuePerAccount: 0,
      featureUsage: [],
      firmographics: { industry: 'N/A', companySize: 'N/A', revenueBand: 'N/A', geography: 'N/A', growthStage: 'N/A' },
      buyingRoles: { economicBuyer: 'N/A', technicalBuyer: 'N/A', champion: 'N/A', endUser: 'N/A', stakeholdersCount: 0 },
      jtbd: { primary: 'N/A', secondary: [], drivers: { emotional: 'N/A', functional: 'N/A', social: 'N/A' } },
      painPoints: { topProblems: [], workarounds: 'N/A', costOfInaction: 'N/A', urgency: 'low' },
      stack: { currentTools: [], integrationsExpected: [], dataMaturity: 'N/A' },
      pricing: { budgetRange: 'N/A', preference: 'N/A', sensitivity: 'N/A' },
      scores: { revenuePotential: 1, growthPotential: 1, strategicImportance: 1, easeOfAcquisition: 1, productFit: 1 }
    };
    onAddSegment(newSeg);
    setShowAddModal(false);
    setNewSegName('');
    setNewSegDesc('');
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      <header className="px-10 py-10 border-b border-gray-50 bg-white flex items-end justify-between shrink-0">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Customer Intelligence</h1>
          <p className="text-sm text-gray-400 font-medium leading-relaxed max-w-lg">
            Define target personas and analyze adoption across your core market segments.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-gray-100 p-1 rounded-full flex border border-gray-200 mr-2 shadow-inner">
            <button 
              onClick={() => setViewMode('board')}
              className={`px-6 py-1.5 text-[10px] font-bold rounded-full transition-all ${viewMode === 'board' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400'}`}
            >
              Board
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`px-6 py-1.5 text-[10px] font-bold rounded-full transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400'}`}
            >
              List
            </button>
          </div>
          
          <button 
            onClick={handleConnectCRM}
            disabled={isCrmSyncing || !AI_ENABLED}
            className="px-6 py-2.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold shadow-sm hover:bg-indigo-100 transition-all border border-indigo-100 flex items-center space-x-2 disabled:opacity-50"
            title={!AI_ENABLED ? "AI features disabled - add VITE_GEMINI_API_KEY" : undefined}
          >
            {isCrmSyncing ? <div className="animate-spin h-3 w-3 border-2 border-indigo-600 border-t-transparent rounded-full" /> : <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>}
            <span>{isCrmSyncing ? 'Connecting CRM...' : 'Connect CRM'}</span>
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-6 py-2.5 bg-gray-900 text-white rounded-full text-xs font-bold shadow-lg hover:bg-black transition-all"
          >
            + New Segment
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto bg-[#fafafa]">
        <div className="max-w-7xl mx-auto py-12 px-10">
          {viewMode === 'board' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.segments.map(seg => (
                <div 
                  key={seg.id} 
                  onClick={() => setSelectedSegmentId(seg.id)}
                  className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-indigo-100/30 transition-all group cursor-pointer flex flex-col"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                      <ICONS.Customer className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black uppercase text-gray-300 tracking-widest">{seg.type}</span>
                  </div>
                  <h3 className="text-lg font-black text-gray-900 mb-2 leading-tight group-hover:text-indigo-600 transition-colors">{seg.name}</h3>
                  <p className="text-sm text-gray-500 font-light leading-relaxed mb-8 line-clamp-2">{seg.description}</p>
                  
                  <div className="space-y-4 mb-8">
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Top Feature Usage</p>
                     <div className="space-y-2">
                        {seg.featureUsage.slice(0, 3).map((usage, idx) => (
                           <div key={idx} className="flex items-center justify-between group/usage">
                              <span className="text-[11px] font-bold text-gray-600 truncate mr-4">{usage.featureTitle}</span>
                              <div className="flex items-center space-x-2 shrink-0">
                                 <div className="w-16 h-1.5 bg-gray-50 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-400" style={{ width: `${usage.usagePercent}%` }} />
                                 </div>
                                 <span className="text-[10px] font-black text-gray-900">{usage.usagePercent}%</span>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                     <div className="flex items-center space-x-2">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Growth score</span>
                        <span className="text-xs font-black text-emerald-500">{seg.scores.growthPotential * 20}%</span>
                     </div>
                     <span className="text-indigo-600 font-bold text-[10px] uppercase">View Intel →</span>
                  </div>
                </div>
              ))}

              <div 
                onClick={AI_ENABLED ? handleAutoGenerate : undefined}
                className={`bg-indigo-50/50 border-2 border-dashed border-indigo-200 rounded-[40px] p-8 flex flex-col items-center justify-center text-center ${AI_ENABLED ? 'cursor-pointer hover:bg-indigo-50 transition-all' : 'opacity-50 cursor-not-allowed'} ${isGenerating ? 'animate-pulse' : ''}`}
                title={!AI_ENABLED ? "AI features disabled - add VITE_GEMINI_API_KEY" : undefined}
              >
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                  <ICONS.Gemini className="w-6 h-6 text-indigo-500" />
                </div>
                <h4 className="text-sm font-bold text-indigo-900 mb-1">
                  {isGenerating ? 'Processing Insights...' : 'Auto-Generate Segments'}
                </h4>
                <p className="text-[10px] text-indigo-400 font-medium px-4 leading-relaxed">
                  {isGenerating ? 'Synthesizing data from Portal & Insights' : 'Use AI to map your market from existing user feedback and ideas'}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden animate-fadeIn">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-10 py-6 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Segment Name</th>
                    <th className="px-6 py-6 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Type</th>
                    <th className="px-6 py-6 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">Top Feature Usage</th>
                    <th className="px-6 py-6 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">Accounts</th>
                    <th className="px-10 py-6 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Growth score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data.segments.map((seg) => (
                    <tr 
                      key={seg.id} 
                      onClick={() => setSelectedSegmentId(seg.id)}
                      className="hover:bg-gray-50/30 transition-all group cursor-pointer"
                    >
                      <td className="px-10 py-7">
                        <div className="flex flex-col">
                          <span className="text-[15px] font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-0.5">{seg.name}</span>
                          <span className="text-[10px] text-gray-400 font-medium tracking-tight uppercase">{seg.firmographics.industry}</span>
                        </div>
                      </td>
                      <td className="px-6 py-7 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border border-gray-100 bg-gray-50 text-gray-600`}>
                          {seg.type}
                        </span>
                      </td>
                      <td className="px-6 py-7">
                         <div className="flex items-center justify-center space-x-1">
                            {seg.featureUsage.slice(0, 3).map((u, i) => (
                               <div key={i} title={`${u.featureTitle}: ${u.usagePercent}%`} className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[9px] font-black text-indigo-500">
                                  {u.usagePercent}%
                               </div>
                            ))}
                         </div>
                      </td>
                      <td className="px-6 py-7 text-center">
                        <span className="text-xs font-bold text-gray-900">{(seg.totalSegmentUsers / 50).toFixed(0)} Accounts</span>
                      </td>
                      <td className="px-10 py-7 text-right">
                         <span className="text-sm font-black text-emerald-500">{seg.scores.growthPotential * 20}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {selectedSegment && (
        <div className="fixed inset-0 z-[100] bg-white overflow-y-auto animate-fadeIn">
           <nav className="h-16 border-b border-gray-100 px-10 flex items-center justify-between sticky top-0 bg-white z-20">
              <div className="flex items-center space-x-4">
                 <button onClick={() => setSelectedSegmentId(null)} className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-400 hover:text-gray-900">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" strokeWidth={2}/></svg>
                 </button>
                 <span className="text-sm font-black text-gray-900 tracking-tight uppercase">{selectedSegment.name} Intelligence</span>
              </div>
              <div className="flex items-center space-x-3">
                 <button className="px-6 py-2 bg-indigo-600 text-white rounded-full text-xs font-bold shadow-lg">Export Profile</button>
              </div>
           </nav>

           <div className="max-w-5xl mx-auto py-20 px-10 space-y-20">
              <header className="space-y-6">
                 <div className="flex items-center space-x-3">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-[0.2em]">{selectedSegment.type} SEGMENT</span>
                    <span className="text-gray-200">—</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{selectedSegment.firmographics.geography}</span>
                 </div>
                 <h2 className="text-5xl font-black text-gray-900 tracking-tight leading-tight">{selectedSegment.name}</h2>
                 <p className="text-xl text-gray-500 font-light leading-relaxed max-w-3xl">{selectedSegment.description}</p>
              </header>

              <div className="grid grid-cols-12 gap-12">
                 <div className="col-span-8 space-y-16">
                    <section className="space-y-6">
                       <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.4em]">00. Adoption & Engagement</h3>
                       <div className="p-8 bg-gray-900 rounded-[40px] text-white">
                          <div className="grid grid-cols-2 gap-12 mb-10">
                             <div>
                                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-2">Total Users in Segment</p>
                                <p className="text-3xl font-black text-white">{selectedSegment.totalSegmentUsers.toLocaleString()}</p>
                             </div>
                             <div>
                                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-2">Avg. Revenue / Account</p>
                                <p className="text-3xl font-black text-emerald-400">${selectedSegment.avgRevenuePerAccount.toLocaleString()}</p>
                             </div>
                          </div>
                          <div className="space-y-6">
                             <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Feature Usage Ranking</h4>
                             <div className="space-y-4">
                                {selectedSegment.featureUsage.sort((a,b) => b.usagePercent - a.usagePercent).map((u, i) => (
                                   <div key={i} className="space-y-2">
                                      <div className="flex justify-between items-baseline">
                                         <div className="flex items-center space-x-3">
                                            <span className="text-gray-600 font-mono text-xs">{i + 1}.</span>
                                            <span className="text-sm font-bold text-gray-100">{u.featureTitle}</span>
                                         </div>
                                         <span className="text-xs font-black text-indigo-400">{u.usagePercent}% Usage</span>
                                      </div>
                                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                         <div className="h-full bg-indigo-500" style={{ width: `${u.usagePercent}%` }} />
                                      </div>
                                      <div className="flex items-center space-x-6 pt-1">
                                         <div className="flex items-center space-x-2">
                                            <span className="text-[9px] font-bold text-gray-500 uppercase">Retention</span>
                                            <span className="text-[10px] font-black text-emerald-400">{u.retentionRate}%</span>
                                         </div>
                                         <div className="flex items-center space-x-2">
                                            <span className="text-[9px] font-bold text-gray-500 uppercase">Avg DAU</span>
                                            <span className="text-[10px] font-black text-gray-300">{u.avgDailyActiveUsers}</span>
                                         </div>
                                      </div>
                                   </div>
                                ))}
                             </div>
                          </div>
                       </div>
                    </section>

                    <section className="space-y-6">
                       <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.4em]">01. Market Definition</h3>
                       <div className="grid grid-cols-2 gap-px bg-gray-100 rounded-3xl overflow-hidden border border-gray-100">
                          <div className="bg-white p-6"><p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Industry</p><p className="text-sm font-bold text-gray-900">{selectedSegment.firmographics.industry}</p></div>
                          <div className="bg-white p-6"><p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Company Size</p><p className="text-sm font-bold text-gray-900">{selectedSegment.firmographics.companySize}</p></div>
                          <div className="bg-white p-6"><p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Revenue Band</p><p className="text-sm font-bold text-gray-900">{selectedSegment.firmographics.revenueBand}</p></div>
                          <div className="bg-white p-6"><p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Growth Stage</p><p className="text-sm font-bold text-gray-900">{selectedSegment.firmographics.growthStage}</p></div>
                       </div>
                    </section>

                    <section className="space-y-6">
                       <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.4em]">02. Jobs To Be Done</h3>
                       <div className="p-10 bg-[#fafafa] rounded-[40px] border border-gray-50">
                          <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-4">Primary Hire</p>
                          <h4 className="text-2xl font-black text-gray-900 mb-10 leading-snug">"{selectedSegment.jtbd.primary}"</h4>
                          <div className="grid grid-cols-3 gap-8">
                             <div><p className="text-[10px] font-bold text-gray-400 uppercase mb-3">Functional</p><p className="text-xs text-gray-600 leading-relaxed font-light">{selectedSegment.jtbd.drivers.functional}</p></div>
                             <div><p className="text-[10px] font-bold text-gray-400 uppercase mb-3">Emotional</p><p className="text-xs text-gray-600 leading-relaxed font-light">{selectedSegment.jtbd.drivers.emotional}</p></div>
                             <div><p className="text-[10px] font-bold text-gray-400 uppercase mb-3">Social</p><p className="text-xs text-gray-600 leading-relaxed font-light">{selectedSegment.jtbd.drivers.social}</p></div>
                          </div>
                       </div>
                    </section>

                    <section className="space-y-6">
                       <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.4em]">03. Friction & Pain</h3>
                       <div className="space-y-4">
                          {selectedSegment.painPoints.topProblems.map((prob, i) => (
                             <div key={i} className="p-6 bg-white border border-gray-100 rounded-3xl flex items-center space-x-6 hover:border-rose-100 transition-all">
                                <span className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center text-[10px] font-black">{i+1}</span>
                                <p className="text-sm font-bold text-gray-700">{prob}</p>
                             </div>
                          ))}
                       </div>
                       <div className="p-8 bg-rose-50/30 rounded-[32px] border border-rose-100/30">
                          <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest mb-2">Cost of Inaction</p>
                          <p className="text-sm text-rose-900 font-light leading-relaxed">"{selectedSegment.painPoints.costOfInaction}"</p>
                       </div>
                    </section>
                 </div>

                 <div className="col-span-4 space-y-12">
                    <section className="space-y-6">
                       <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.4em]">Propensity</h3>
                       <div className="p-8 bg-gray-50 rounded-[40px] space-y-6 border border-gray-100">
                          {Object.entries(selectedSegment.scores).map(([key, val]) => {
                             const score = val as number;
                             return (
                               <div key={key}>
                                  <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase mb-2">
                                     <span>{key.replace(/([A-Z])/g, ' $1')}</span>
                                     <span className="text-gray-900">{score}/5</span>
                                  </div>
                                  <div className="h-1 w-full bg-white rounded-full overflow-hidden">
                                     <div className="h-full bg-indigo-500" style={{ width: `${(score/5)*100}%` }} />
                                  </div>
                               </div>
                             );
                          })}
                       </div>
                    </section>

                    <section className="space-y-6">
                       <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.4em]">The Room</h3>
                       <div className="space-y-3">
                          <div className="p-5 bg-white border border-gray-100 rounded-2xl flex items-center justify-between">
                             <span className="text-[10px] font-bold text-gray-400 uppercase">Economic</span>
                             <span className="text-xs font-bold text-gray-900">{selectedSegment.buyingRoles.economicBuyer}</span>
                          </div>
                          <div className="p-5 bg-white border border-gray-100 rounded-2xl flex items-center justify-between">
                             <span className="text-[10px] font-bold text-gray-400 uppercase">Champion</span>
                             <span className="text-xs font-bold text-gray-900">{selectedSegment.buyingRoles.champion}</span>
                          </div>
                          <div className="p-5 bg-white border border-gray-100 rounded-2xl flex items-center justify-between">
                             <span className="text-[10px] font-bold text-gray-400 uppercase">Stack Size</span>
                             <span className="text-xs font-bold text-gray-900">{selectedSegment.buyingRoles.stakeholdersCount} stakeholders</span>
                          </div>
                       </div>
                    </section>
                 </div>
              </div>
           </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden animate-slideUp">
             <header className="px-10 py-8 border-b border-gray-50 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Add Segment</h3>
                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-900">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" strokeWidth={2}/></svg>
                </button>
             </header>
             <div className="p-10 space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Segment Name</label>
                   <input 
                    type="text" 
                    value={newSegName} 
                    onChange={e => setNewSegName(e.target.value)} 
                    placeholder="e.g. Fintech Tech Leads" 
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all" 
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Description</label>
                   <textarea 
                    value={newSegDesc} 
                    onChange={e => setNewSegDesc(e.target.value)} 
                    rows={3}
                    placeholder="Briefly define the behavioral or firmographic group..." 
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none" 
                   />
                </div>
                <button 
                  onClick={handleManualAdd}
                  className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-sm hover:bg-black transition-all shadow-xl shadow-gray-200"
                >
                  Create Shell Segment
                </button>
                <div className="relative flex items-center py-4">
                  <div className="flex-grow border-t border-gray-100"></div>
                  <span className="flex-shrink mx-4 text-[10px] font-bold text-gray-300 uppercase">Or</span>
                  <div className="flex-grow border-t border-gray-100"></div>
                </div>
                <button 
                  onClick={handleAutoGenerate}
                  disabled={!AI_ENABLED}
                  className="w-full py-5 bg-indigo-50 text-indigo-600 rounded-2xl font-black text-sm hover:bg-indigo-100 transition-all border border-indigo-100 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  title={!AI_ENABLED ? "AI features disabled - add VITE_GEMINI_API_KEY" : undefined}
                >
                   <ICONS.Gemini className="w-5 h-5" />
                   <span>AI Deep Intel Synthesis</span>
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerIntelligence;
