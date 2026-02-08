
import React, { useState, useMemo } from 'react';
import { TechStackProfile, Feature, VibePromptSet, TechStackComponent } from '../types';
import { ICONS } from '../constants';
import { generateVibePrompts } from '../services/geminiService';

interface VibeCodeViewProps {
  stack: TechStackProfile;
  features: Feature[];
}

type TabType = 'product' | 'architecture' | 'frontend' | 'backend' | 'data' | 'infra' | 'ai';

const VibeCodeView: React.FC<VibeCodeViewProps> = ({ stack, features }) => {
  const [selectedFeatureIds, setSelectedFeatureIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('product');
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompts, setPrompts] = useState<VibePromptSet | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Local state for stack overrides during this orchestration session
  const [sessionStack, setSessionStack] = useState<TechStackComponent[]>(stack.components);

  const filteredFeatures = useMemo(() => {
    return features.filter(f => 
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      f.productArea.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [features, searchQuery]);

  const toggleFeature = (id: string) => {
    setSelectedFeatureIds(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const handleOrchestrate = async () => {
    if (selectedFeatureIds.length === 0) return;
    
    setIsGenerating(true);
    try {
      const selectedFeatures = features.filter(f => selectedFeatureIds.includes(f.id));
      const result = await generateVibePrompts(selectedFeatures, sessionStack);
      setPrompts(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedFeaturesList = features.filter(f => selectedFeatureIds.includes(f.id));

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      <header className="px-10 py-10 border-b border-gray-50 bg-white flex items-end justify-between shrink-0">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Vibe Code Orchestrator</h1>
          <p className="text-sm text-gray-400 font-medium leading-relaxed max-w-lg">
            Bridge planning and implementation. Select features and stack to generate high-intent AI prompts.
          </p>
        </div>
        <div className="flex items-center space-x-3">
           <div className="flex items-center px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full">
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mr-3">Build Ready Context</span>
              <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse shadow-lg shadow-indigo-100" />
           </div>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-12 gap-0 overflow-hidden">
        {/* Left: Configuration Panel */}
        <div className="col-span-4 border-r border-gray-100 bg-[#F9FAFB] flex flex-col overflow-hidden">
           <div className="p-8 space-y-10 flex-1 overflow-y-auto">
              
              {/* Step 1: Feature Selection */}
              <section className="space-y-6">
                 <div className="flex items-center justify-between">
                    <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.2em]">01. Select Features</h3>
                    <span className="text-[10px] font-bold text-indigo-600">{selectedFeatureIds.length} Selected</span>
                 </div>
                 <div className="relative">
                    <input 
                       type="text" 
                       placeholder="Search roadmap features..." 
                       value={searchQuery}
                       onChange={e => setSearchQuery(e.target.value)}
                       className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                    />
                 </div>
                 <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                    {filteredFeatures.map(f => (
                       <button 
                          key={f.id}
                          onClick={() => toggleFeature(f.id)}
                          className={`w-full p-4 rounded-2xl border transition-all text-left flex items-start justify-between group ${selectedFeatureIds.includes(f.id) ? 'bg-white border-indigo-200 shadow-sm' : 'bg-transparent border-gray-100 hover:border-gray-200'}`}
                       >
                          <div>
                             <p className={`text-xs font-bold mb-1 transition-colors ${selectedFeatureIds.includes(f.id) ? 'text-indigo-600' : 'text-gray-700'}`}>{f.title}</p>
                             <p className="text-[10px] text-gray-400 font-medium uppercase">{f.productArea}</p>
                          </div>
                          <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${selectedFeatureIds.includes(f.id) ? 'bg-indigo-600 border-indigo-600' : 'border-gray-200 group-hover:border-gray-300'}`}>
                             {selectedFeatureIds.includes(f.id) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"/></svg>}
                          </div>
                       </button>
                    ))}
                 </div>
              </section>

              {/* Step 2: Stack Verification */}
              <section className="space-y-6">
                 <div className="flex items-center justify-between">
                    <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.2em]">02. Verify Stack</h3>
                    <button className="text-[10px] font-bold text-gray-400 hover:text-indigo-600 uppercase tracking-widest transition-colors">Default Specs</button>
                 </div>
                 <div className="bg-white rounded-[32px] border border-gray-100 p-6 space-y-4 shadow-sm">
                    {sessionStack.map(comp => (
                       <div key={comp.id} className="flex items-center justify-between group">
                          <div className="flex-1">
                             <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">{comp.category}</p>
                             <p className="text-xs font-bold text-gray-800">{comp.toolName}</p>
                          </div>
                          <span className="text-[10px] font-mono text-gray-300 group-hover:text-indigo-500 transition-colors cursor-pointer">v{comp.version}</span>
                       </div>
                    ))}
                 </div>
              </section>
           </div>

           {/* Step 3: Orchestration Action */}
           <div className="p-8 bg-white border-t border-gray-100">
              <button 
                 onClick={handleOrchestrate}
                 disabled={isGenerating || selectedFeatureIds.length === 0}
                 className="w-full py-5 bg-gray-900 text-white rounded-3xl font-black text-sm hover:bg-black transition-all flex items-center justify-center space-x-3 shadow-xl shadow-gray-200 disabled:opacity-50 disabled:shadow-none"
              >
                 {isGenerating ? <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" /> : <ICONS.Gemini className="w-5 h-5" />}
                 <span>{isGenerating ? 'Synthesizing Build Vibe...' : 'Orchestrate Build Manifest'}</span>
              </button>
           </div>
        </div>

        {/* Right: Manifest Terminal Output */}
        <div className="col-span-8 bg-[#121212] flex flex-col relative overflow-hidden">
           {/* Terminal Header */}
           <header className="px-8 py-5 bg-[#1a1a1a] border-b border-white/5 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-8">
                 <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 bg-rose-500/80 rounded-full" />
                    <div className="w-2.5 h-2.5 bg-amber-500/80 rounded-full" />
                    <div className="w-2.5 h-2.5 bg-emerald-500/80 rounded-full" />
                 </div>
                 <nav className="flex items-center space-x-6">
                    {(['product', 'architecture', 'frontend', 'backend', 'data', 'infra'] as const).map(tab => (
                       <button 
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`text-[10px] font-black uppercase tracking-[0.15em] transition-all hover:text-white ${activeTab === tab ? 'text-indigo-400' : 'text-gray-600'}`}
                       >
                          {tab}
                       </button>
                    ))}
                 </nav>
              </div>
              <span className="text-[10px] font-mono font-bold text-gray-600 uppercase tracking-[0.2em]">MANIFEST GEN v1.0.4</span>
           </header>
           
           {/* Terminal Content */}
           <div className="flex-1 overflow-y-auto p-12 font-mono text-sm custom-scrollbar bg-[#0a0a0a]/30">
              {!prompts ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-700 space-y-8 animate-pulse">
                   <div className="w-20 h-20 rounded-[40px] bg-white/5 border border-white/5 flex items-center justify-center">
                      <ICONS.Gemini className="w-10 h-10 opacity-20" />
                   </div>
                   <div className="text-center space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">Awaiting Build Orchestration</p>
                      <p className="text-[11px] font-medium opacity-20">Select features and click Orchestrate to generate prompts.</p>
                   </div>
                </div>
              ) : (
                <div className="max-w-4xl animate-fadeIn space-y-8">
                   <div className="flex items-center space-x-4 mb-10 pb-6 border-b border-white/5">
                      <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400 text-[10px] font-bold uppercase tracking-widest">Active Manifest</div>
                      <span className="text-gray-700 text-xs">Generated from {selectedFeatureIds.length} features</span>
                   </div>

                   <div className="leading-relaxed">
                      {activeTab === 'product' && (
                        <div className="space-y-6">
                           <h2 className="text-indigo-400 font-black uppercase text-xs mb-4">Product Experience Vibe</h2>
                           <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{prompts.productSummary}</p>
                        </div>
                      )}
                      {activeTab === 'architecture' && (
                        <div className="space-y-6">
                           <h2 className="text-indigo-400 font-black uppercase text-xs mb-4">System Boundaries & Flow</h2>
                           <p className="text-emerald-300/80 leading-relaxed whitespace-pre-wrap">{prompts.architecture}</p>
                        </div>
                      )}
                      {activeTab === 'frontend' && (
                        <div className="space-y-6">
                           <h2 className="text-indigo-400 font-black uppercase text-xs mb-4">UI Implementation Prompt</h2>
                           <div className="p-8 bg-white/5 border border-white/10 rounded-3xl text-gray-200">
                              <p className="whitespace-pre-wrap">{prompts.frontend}</p>
                           </div>
                        </div>
                      )}
                      {activeTab === 'backend' && (
                        <div className="space-y-6">
                           <h2 className="text-indigo-400 font-black uppercase text-xs mb-4">Logic & Integration Prompt</h2>
                           <div className="p-8 bg-white/5 border border-white/10 rounded-3xl text-gray-200">
                              <p className="whitespace-pre-wrap">{prompts.backend}</p>
                           </div>
                        </div>
                      )}
                      {activeTab === 'data' && (
                        <div className="space-y-6">
                           <h2 className="text-indigo-400 font-black uppercase text-xs mb-4">Data Schema Direction</h2>
                           <p className="text-amber-300/80 leading-relaxed whitespace-pre-wrap">{prompts.dataModel}</p>
                        </div>
                      )}
                      {activeTab === 'infra' && (
                        <div className="space-y-6">
                           <h2 className="text-indigo-400 font-black uppercase text-xs mb-4">Environmental Strategy</h2>
                           <p className="text-rose-300/80 leading-relaxed whitespace-pre-wrap">{prompts.infra}</p>
                        </div>
                      )}
                   </div>
                </div>
              )}
           </div>

           {/* Terminal Footer Controls */}
           {prompts && (
             <div className="px-10 py-8 bg-[#1a1a1a] border-t border-white/5 flex items-center justify-between shrink-0">
                <div className="flex items-center space-x-3">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                   <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Prompts valid for latest stack context</span>
                </div>
                <div className="flex items-center space-x-4">
                   <button 
                      onClick={() => {
                        const content = activeTab === 'product' ? prompts.productSummary : 
                                      activeTab === 'architecture' ? prompts.architecture :
                                      activeTab === 'frontend' ? prompts.frontend :
                                      activeTab === 'backend' ? prompts.backend :
                                      activeTab === 'data' ? prompts.dataModel : prompts.infra;
                        navigator.clipboard.writeText(content);
                      }}
                      className="px-6 py-2.5 bg-white text-gray-900 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-gray-100 transition-all active:scale-95"
                   >
                      Copy Prompt
                   </button>
                   <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-indigo-700 transition-all active:scale-95">
                      Sync to Build Agent
                   </button>
                </div>
             </div>
           )}
        </div>
      </main>

      {/* Global Terminal Overlay Effects */}
      <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden opacity-[0.03]">
        <div className="h-full w-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      </div>
    </div>
  );
};

export default VibeCodeView;
