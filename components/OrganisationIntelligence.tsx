
import React, { useState } from 'react';
import { Organisation, Link } from '../types';
import { ICONS } from '../constants';

interface OrganisationIntelligenceProps {
  organisation: Organisation;
  onUpdateOrganisation: (org: Organisation) => void;
}

const OrganisationIntelligence: React.FC<OrganisationIntelligenceProps> = ({ organisation, onUpdateOrganisation }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'strategy' | 'business' | 'product' | 'ops' | 'governance'>('strategy');

  const handleUpdate = (path: string, value: any) => {
    const keys = path.split('.');
    const updated = { ...organisation } as any;
    let current = updated;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    onUpdateOrganisation(updated);
  };

  const addLink = () => {
    const title = prompt('Link Title:');
    const url = prompt('Link URL (https://...):');
    if (title && url) {
      const extraLinks = [...organisation.digitalPresence.extraLinks, { title, url }];
      handleUpdate('digitalPresence.extraLinks', extraLinks);
    }
  };

  const removeLink = (index: number) => {
    const extraLinks = organisation.digitalPresence.extraLinks.filter((_, i) => i !== index);
    handleUpdate('digitalPresence.extraLinks', extraLinks);
  };

  const SectionHeader = ({ title, num }: { title: string, num: string }) => (
    <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.4em] mb-8 flex items-center">
      <span className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-[10px] mr-4 border border-gray-100">{num}</span>
      {title}
    </h3>
  );

  const EditField = ({ label, value, path, type = 'text' }: { label: string, value: string, path: string, type?: 'text' | 'textarea' }) => (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">{label}</label>
      {isEditMode ? (
        type === 'textarea' ? (
          <textarea 
            className="w-full bg-white border border-gray-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-none"
            rows={4}
            value={value}
            onChange={(e) => handleUpdate(path, e.target.value)}
          />
        ) : (
          <input 
            type="text"
            className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
            value={value}
            onChange={(e) => handleUpdate(path, e.target.value)}
          />
        )
      ) : (
        <p className={`text-sm ${type === 'textarea' ? 'leading-relaxed text-gray-600 font-light' : 'font-bold text-gray-900'}`}>
          {value || 'Not specified'}
        </p>
      )}
    </div>
  );

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden animate-fadeIn">
      {/* Hero Header */}
      <header className="px-12 py-12 border-b border-gray-50 bg-white sticky top-0 z-20 shrink-0">
        <div className="max-w-7xl mx-auto flex items-end justify-between">
          <div className="flex items-center space-x-8">
            <div className="w-20 h-20 bg-gray-900 rounded-[32px] flex items-center justify-center text-white text-3xl font-black shadow-xl">
              {organisation.name.charAt(0)}
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                {isEditMode ? (
                  <input 
                    className="text-4xl font-black text-gray-900 tracking-tight border-b-2 border-indigo-500 outline-none bg-transparent"
                    value={organisation.name}
                    onChange={(e) => handleUpdate('name', e.target.value)}
                  />
                ) : (
                  <h1 className="text-4xl font-black text-gray-900 tracking-tight">{organisation.name}</h1>
                )}
                <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-lg text-[10px] font-black uppercase tracking-widest border border-gray-200">Main Organisation</span>
              </div>
              <p className="text-sm text-gray-400 font-medium">{organisation.primaryDomain} • {organisation.industry}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
             <button 
                onClick={() => setIsEditMode(!isEditMode)}
                className={`px-8 py-3 rounded-full text-xs font-bold transition-all shadow-lg ${isEditMode ? 'bg-indigo-600 text-white shadow-indigo-100' : 'bg-white border border-gray-100 text-gray-700 hover:bg-gray-50'}`}
             >
                {isEditMode ? 'Save Specification' : 'Modify Organisation'}
             </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-[#fafafa]">
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-0">
          
          {/* Left Navigation */}
          <aside className="col-span-3 py-12 px-12 border-r border-gray-100 sticky top-0 h-fit space-y-2">
            {[
              { id: 'strategy', label: '1. Strategy & Direction' },
              { id: 'business', label: '2. Business Model' },
              { id: 'product', label: '3. Product Strategy' },
              { id: 'ops', label: '4. Delivery & Constraints' },
              { id: 'governance', label: '5. Governance & Future' },
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full text-left px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {tab.label}
              </button>
            ))}
            <div className="pt-10 space-y-6">
               <h4 className="px-6 text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Context Links</h4>
               <div className="space-y-2">
                  <a href={organisation.digitalPresence.website} target="_blank" className="flex items-center px-6 py-2 text-xs font-medium text-gray-500 hover:text-indigo-600 transition-colors">
                     <svg className="w-3 h-3 mr-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9" strokeWidth={2}/></svg>
                     Website
                  </a>
                  {organisation.digitalPresence.extraLinks.map((link, i) => (
                    <div key={i} className="flex items-center justify-between group px-6">
                      <a href={link.url} target="_blank" className="text-xs font-medium text-gray-500 hover:text-indigo-600 truncate transition-colors">
                        {link.title}
                      </a>
                      {isEditMode && (
                        <button onClick={() => removeLink(i)} className="text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" strokeWidth={2}/></svg>
                        </button>
                      )}
                    </div>
                  ))}
                  {isEditMode && (
                    <button onClick={addLink} className="w-full text-left px-6 py-2 text-xs font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-600">
                      + Add Link
                    </button>
                  )}
               </div>
            </div>
          </aside>

          {/* Right Scrollable Content */}
          <main className="col-span-9 p-16 space-y-24 bg-white min-h-screen">
            
            {activeTab === 'strategy' && (
              <section className="animate-fadeIn">
                <SectionHeader title="Company Strategy & Direction" num="01" />
                <div className="space-y-12">
                   <EditField label="Vision" value={organisation.strategy.vision} path="strategy.vision" type="textarea" />
                   <EditField label="Mission" value={organisation.strategy.mission} path="strategy.mission" type="textarea" />
                   <EditField label="Definition of Success" value={organisation.strategy.successDefinition} path="strategy.successDefinition" type="textarea" />
                   <div className="space-y-4">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Key Priorities</label>
                      <div className="flex flex-wrap gap-2">
                        {organisation.strategy.priorities.map((p, i) => (
                          <div key={i} className="px-4 py-2 bg-gray-50 rounded-xl text-xs font-bold text-gray-700 border border-gray-100">{p}</div>
                        ))}
                      </div>
                   </div>
                   <EditField label="Strategic Bets" value={organisation.strategy.strategicBets} path="strategy.strategicBets" type="textarea" />
                </div>
              </section>
            )}

            {activeTab === 'business' && (
              <section className="animate-fadeIn">
                <SectionHeader title="Business Model & Revenue" num="02" />
                <div className="grid grid-cols-2 gap-x-12 gap-y-16">
                   <EditField label="Revenue Streams" value={organisation.businessModel.revenueStreams} path="businessModel.revenueStreams" />
                   <EditField label="Retention vs Acquisition" value={organisation.businessModel.acquisitionVsRetention} path="businessModel.acquisitionVsRetention" />
                   <EditField label="ARR / Growth Targets" value={organisation.businessModel.arrTarget} path="businessModel.arrTarget" />
                   <EditField label="Unit Economics (CAC/LTV)" value={organisation.businessModel.cacLtv} path="businessModel.cacLtv" />
                </div>
              </section>
            )}

            {activeTab === 'product' && (
              <section className="animate-fadeIn">
                <SectionHeader title="Product Strategy & Competitive" num="03" />
                <div className="space-y-16">
                  <div className="grid grid-cols-2 gap-12">
                     <EditField label="Core Positioning" value={organisation.productStrategy.positioning} path="productStrategy.positioning" type="textarea" />
                     <EditField label="Main Differentiators" value={organisation.productStrategy.differentiators} path="productStrategy.differentiators" type="textarea" />
                  </div>
                  <EditField label="Strategic Focus Area" value={organisation.productStrategy.strategicFocus} path="productStrategy.strategicFocus" />
                  <div className="pt-12 border-t border-gray-50">
                     <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8">Competitive Context</h4>
                     <div className="grid grid-cols-2 gap-12">
                        <EditField label="Strengths" value={organisation.competitive.strengths} path="competitive.strengths" type="textarea" />
                        <EditField label="Weaknesses" value={organisation.competitive.weaknesses} path="competitive.weaknesses" type="textarea" />
                     </div>
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'ops' && (
              <section className="animate-fadeIn">
                <SectionHeader title="Delivery & Constraints" num="04" />
                <div className="space-y-16">
                   <EditField label="Technical Constraints" value={organisation.delivery.constraints} path="delivery.constraints" type="textarea" />
                   <EditField label="Capacity Allocation" value={organisation.delivery.capacityAllocation} path="delivery.capacityAllocation" />
                   <div className="pt-12 border-t border-gray-50">
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8">Risk & Compliance</h4>
                      <div className="grid grid-cols-2 gap-12">
                         <EditField label="Regulatory Requirements" value={organisation.compliance.regulatory} path="compliance.regulatory" />
                         <EditField label="Security Priorities" value={organisation.compliance.securityPriorities} path="compliance.securityPriorities" />
                      </div>
                   </div>
                </div>
              </section>
            )}

            {activeTab === 'governance' && (
              <section className="animate-fadeIn">
                <SectionHeader title="Roadmap Governance & Future" num="05" />
                <div className="space-y-16">
                   <div className="grid grid-cols-2 gap-12">
                      <EditField label="Core Decision Makers" value={organisation.governance.decisionMakers} path="governance.decisionMakers" />
                      <EditField label="Review Frequency" value={organisation.governance.reviewFrequency} path="governance.reviewFrequency" />
                   </div>
                   <EditField label="Triggers for Change" value={organisation.governance.changeTriggers} path="governance.changeTriggers" type="textarea" />
                </div>
              </section>
            )}

            {/* AI Summary Block */}
            <section className="p-12 bg-signature-gradient rounded-[48px] text-white flex items-center justify-between shadow-2xl shadow-indigo-100">
               <div className="max-w-2xl">
                  <div className="flex items-center space-x-3 mb-4">
                    <ICONS.Gemini className="w-6 h-6 text-white" />
                    <span className="text-xs font-bold uppercase tracking-widest opacity-80">AI Strategic Context</span>
                  </div>
                  <h4 className="text-2xl font-bold mb-4 tracking-tight">Strategy is synchronized across your OS.</h4>
                  <p className="text-white/80 font-light leading-relaxed">
                    Changes to your organisation's success definition and strategic bets automatically retune the Priority Scoring engine and AI PRD synthesis across all features.
                  </p>
               </div>
               <div className="w-32 h-32 bg-white/10 rounded-full blur-3xl" />
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default OrganisationIntelligence;
