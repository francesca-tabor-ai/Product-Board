
import React, { useState, useMemo } from 'react';
import { PricingPlanData, PricingTier, CountryConfig, Feature } from '../types';
import { INITIAL_PRICING_DATA } from '../constants';

interface PricingPlanBuilderProps {
  features: Feature[];
}

const PricingPlanBuilder: React.FC<PricingPlanBuilderProps> = ({ features }) => {
  const [data, setData] = useState<PricingPlanData>(INITIAL_PRICING_DATA);
  const [selectedCountryCode, setSelectedCountryCode] = useState('US');
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [draggedFeatureId, setDraggedFeatureId] = useState<string | null>(null);
  const [isLocalisationExpanded, setIsLocalisationExpanded] = useState(true);

  const selectedCountry = useMemo(() => 
    data.countries.find(c => c.code === selectedCountryCode) || data.countries[0],
  [data.countries, selectedCountryCode]);

  /**
   * PRD 7.1 Update: Features can now be included multiple times across different plans.
   * We show all available features in the library.
   */
  const availableFeatures = useMemo(() => {
    return features;
  }, [features]);

  /**
   * PRD 7.2: Monthly and Yearly Pricing Generation
   */
  const handlePriceChange = (tierId: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    
    if (selectedCountry.mode === 'universal') {
      const updatedTiers = data.tiers.map(t => {
        if (t.id === tierId) {
          if (billingPeriod === 'monthly') {
            const autoYearly = Math.round(numValue * 12 * (1 - data.yearlyDiscount));
            return { ...t, monthlyPrice: numValue, yearlyPrice: autoYearly };
          } else {
            return { ...t, yearlyPrice: numValue };
          }
        }
        return t;
      });
      setData({ ...data, tiers: updatedTiers });
    } else {
      const updatedCountries = data.countries.map(c => {
        if (c.code === selectedCountryCode) {
          const existing = c.overrides[tierId] || { monthly: 0, yearly: 0 };
          const newOverride = { ...existing };
          
          if (billingPeriod === 'monthly') {
            newOverride.monthly = numValue;
            newOverride.yearly = Math.round(numValue * 12 * (1 - data.yearlyDiscount));
          } else {
            newOverride.yearly = numValue;
          }
          
          return {
            ...c,
            overrides: {
              ...c.overrides,
              [tierId]: newOverride
            }
          };
        }
        return c;
      });
      setData({ ...data, countries: updatedCountries });
    }
  };

  const onDragStart = (featureId: string) => {
    setDraggedFeatureId(featureId);
  };

  const onDrop = (tierId: string) => {
    if (!draggedFeatureId) return;

    const updatedTiers = data.tiers.map(t => {
      if (t.id === tierId) {
        // Only add if not already present in this specific tier
        if (!t.features.includes(draggedFeatureId)) {
          return { ...t, features: [...t.features, draggedFeatureId] };
        }
      }
      return t;
    });

    setData({ ...data, tiers: updatedTiers });
    setDraggedFeatureId(null);
  };

  const removeFeatureFromTier = (tierId: string, featureId: string) => {
    const updatedTiers = data.tiers.map(t => {
      if (t.id === tierId) {
        return { ...t, features: t.features.filter(fid => fid !== featureId) };
      }
      return t;
    });
    setData({ ...data, tiers: updatedTiers });
  };

  const getCurrentDisplayPrice = (tier: PricingTier) => {
    if (selectedCountry.mode === 'localized' && selectedCountry.overrides[tier.id]) {
      return billingPeriod === 'monthly' 
        ? selectedCountry.overrides[tier.id].monthly 
        : selectedCountry.overrides[tier.id].yearly;
    }
    const basePrice = billingPeriod === 'monthly' ? tier.monthlyPrice : tier.yearlyPrice;
    return Math.round(basePrice * selectedCountry.fxRate);
  };

  const getMasterEquivalentPrice = (tier: PricingTier) => {
    const base = billingPeriod === 'monthly' ? tier.monthlyPrice : tier.yearlyPrice;
    return Math.round(base * selectedCountry.fxRate);
  };

  return (
    <div className="flex h-full bg-[#FAFAFA] overflow-hidden animate-fadeIn relative">
      {/* 7.1 Pricing Plan Builder (Kanban Feature Packaging) */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        <header className="px-10 py-6 border-b border-gray-100 bg-white flex items-center justify-between shadow-sm sticky top-0 z-30">
          <div className="flex items-center space-x-6">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Pricing</h2>
            <div className="bg-gray-100 p-1 rounded-full flex border border-gray-200">
              <button 
                onClick={() => setBillingPeriod('monthly')}
                className={`px-6 py-1.5 text-[10px] font-bold rounded-full transition-all ${billingPeriod === 'monthly' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400'}`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setBillingPeriod('yearly')}
                className={`px-6 py-1.5 text-[10px] font-bold rounded-full transition-all ${billingPeriod === 'yearly' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400'}`}
              >
                Yearly
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em] bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100">
              Yearly Discount: {data.yearlyDiscount * 100}%
            </div>
            {!isLocalisationExpanded && (
              <button 
                onClick={() => setIsLocalisationExpanded(true)}
                className="p-2.5 bg-gray-900 text-white rounded-xl shadow-lg hover:bg-black transition-all flex items-center space-x-2 animate-fadeIn"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span className="text-[10px] font-black uppercase tracking-widest px-1">Localise</span>
              </button>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-x-auto p-10">
          <div className="flex space-x-8 min-w-max h-full pb-20">
            {data.tiers.map(tier => (
              <div 
                key={tier.id} 
                onDragOver={e => e.preventDefault()}
                onDrop={() => onDrop(tier.id)}
                className="w-80 flex flex-col"
              >
                <div className="mb-6 space-y-4">
                   <div className="flex items-center justify-between">
                      <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest">{tier.name}</h3>
                      <div className="flex items-center space-x-2">
                        {selectedCountry.mode === 'universal' && (
                           <svg title="Synced with Master" className="w-3.5 h-3.5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
                        )}
                        <span className="text-[10px] font-bold text-gray-300">#{tier.id}</span>
                      </div>
                   </div>
                   <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm space-y-4 hover:border-indigo-100 transition-colors group">
                      <div className="space-y-1">
                         <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                           {billingPeriod} Price ({selectedCountry.currency})
                         </label>
                         <div className="flex items-baseline space-x-2">
                            <span className="text-2xl font-black text-gray-900">{selectedCountry.symbol}</span>
                            <input 
                              type="number"
                              value={getCurrentDisplayPrice(tier)}
                              onChange={(e) => handlePriceChange(tier.id, e.target.value)}
                              className="text-2xl font-black text-gray-900 w-full bg-transparent outline-none focus:text-indigo-600 transition-colors"
                            />
                         </div>
                      </div>
                      {selectedCountry.mode === 'localized' && (
                        <div className="pt-3 border-t border-gray-50 flex items-center justify-between text-[9px] font-bold uppercase tracking-tighter">
                           <span className="text-amber-500 font-black">LOCAL OVERRIDE</span>
                           <span className="text-gray-400">Master: {selectedCountry.symbol}{getMasterEquivalentPrice(tier)}</span>
                        </div>
                      )}
                   </div>
                </div>

                <div className="flex-1 bg-gray-50/50 rounded-[40px] border border-gray-100 p-4 space-y-3 min-h-[400px] transition-all group-hover:bg-gray-100/30">
                   {tier.features.map(featId => {
                     const feat = features.find(f => f.id === featId);
                     return feat ? (
                       <div 
                         key={feat.id} 
                         className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm group/feat hover:border-indigo-200 transition-all transform hover:scale-[1.02] relative"
                       >
                         <div className="flex justify-between items-start">
                            <p className="text-xs font-bold text-gray-800 mb-1 group-hover/feat:text-indigo-600 transition-colors">{feat.title}</p>
                            <button 
                              onClick={() => removeFeatureFromTier(tier.id, feat.id)}
                              className="opacity-0 group-hover/feat:opacity-100 p-1 text-gray-300 hover:text-rose-500 transition-all"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" strokeWidth={2}/></svg>
                            </button>
                         </div>
                         <div className="flex items-center justify-between">
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">{feat.productArea}</p>
                         </div>
                       </div>
                     ) : null;
                   })}
                   <div className="h-16 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center text-[9px] font-black text-gray-300 uppercase tracking-widest group-hover:border-indigo-100 group-hover:text-indigo-300 transition-all">
                      Assign Feature
                   </div>
                </div>
              </div>
            ))}

            <div 
              className="w-80 flex flex-col"
            >
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Feature Library</h3>
              <div className="flex-1 bg-white rounded-[40px] border border-gray-100 shadow-inner p-6 space-y-3 overflow-y-auto custom-scrollbar">
                {availableFeatures.map(feat => (
                  <div 
                    key={feat.id} 
                    draggable
                    onDragStart={() => onDragStart(feat.id)}
                    className="p-5 bg-gray-50 rounded-2xl border border-transparent hover:border-indigo-100 hover:bg-white cursor-grab active:cursor-grabbing transition-all group shadow-sm"
                  >
                    <p className="text-xs font-bold text-gray-600 mb-1 group-hover:text-indigo-600 transition-colors">{feat.title}</p>
                    <div className="flex items-center justify-between">
                       <p className="text-[9px] font-medium text-gray-400 uppercase">{feat.productArea}</p>
                       <svg className="w-3 h-3 text-gray-300 opacity-0 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 4v16m8-8H4" strokeWidth={2}/></svg>
                    </div>
                  </div>
                ))}
                {availableFeatures.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-4 p-8">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">No Features Found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 9.0 UX Requirements: Pricing Localisation Panel */}
      <aside className={`bg-white border-l border-gray-100 flex flex-col shrink-0 shadow-2xl z-40 transition-all duration-300 ease-in-out h-full overflow-hidden ${isLocalisationExpanded ? 'w-96' : 'w-0 border-l-0'}`}>
         <header className="p-8 border-b border-gray-50 space-y-6 shrink-0 relative">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.4em]">Localisation</h3>
              <button 
                onClick={() => setIsLocalisationExpanded(false)}
                className="p-1.5 text-gray-300 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" strokeWidth={2}/></svg>
              </button>
            </div>
            <div className="space-y-4">
               <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Country Context (7.3)</label>
                  <div className="relative">
                    <select 
                      value={selectedCountryCode}
                      onChange={(e) => setSelectedCountryCode(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all appearance-none cursor-pointer"
                    >
                      {data.countries.map(c => (
                        <option key={c.code} value={c.code}>{c.name} ({c.currency})</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 9l-7 7-7-7" strokeWidth={2}/></svg>
                    </div>
                  </div>
               </div>
               
               {/* 7.5 Universal vs Localised Pricing Toggle */}
               <div className="flex items-center justify-between p-5 bg-gray-900 rounded-3xl text-white shadow-xl shadow-gray-100">
                  <div>
                    <p className="text-[9px] font-black text-gray-500 uppercase mb-1 tracking-widest">Pricing Strategy</p>
                    <p className="text-xs font-bold capitalize flex items-center">
                       <span className={`w-1.5 h-1.5 rounded-full mr-2 ${selectedCountry.mode === 'universal' ? 'bg-indigo-400' : 'bg-amber-400'}`} />
                       {selectedCountry.mode} Mode
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      const updated = data.countries.map(c => c.code === selectedCountryCode ? { ...c, mode: c.mode === 'universal' ? 'localized' : 'universal' } : c);
                      setData({ ...data, countries: updated });
                    }}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all active:scale-95"
                  >
                    Modify
                  </button>
               </div>
            </div>
         </header>

         {/* 9.0 Pricing Diff Viewer */}
         <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
            <section className="space-y-6">
               <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Master Price Variance (7.6)</h4>
               <div className="space-y-4">
                  {data.tiers.map(tier => {
                    const localPrice = getCurrentDisplayPrice(tier);
                    const masterPrice = getMasterEquivalentPrice(tier);
                    const variance = masterPrice > 0 ? ((localPrice / masterPrice) - 1) * 100 : 0;
                    
                    return (
                      <div key={tier.id} className="p-5 bg-gray-50/50 rounded-2xl border border-gray-100 space-y-3 group hover:bg-white transition-all shadow-sm">
                         <div className="flex justify-between items-baseline">
                            <span className="text-xs font-black text-gray-900">{tier.name}</span>
                            <span className="text-[11px] font-black text-indigo-600">{selectedCountry.symbol}{localPrice.toLocaleString()}</span>
                         </div>
                         <div className="flex justify-between items-center text-[9px] font-bold text-gray-400 uppercase tracking-tight">
                            <span>Diff vs Master FX</span>
                            <span className={`px-2 py-0.5 rounded ${variance === 0 ? 'text-gray-300' : variance > 0 ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'}`}>
                              {variance === 0 ? 'Aligned' : `${variance > 0 ? '+' : ''}${variance.toFixed(1)}%`}
                            </span>
                         </div>
                      </div>
                    );
                  })}
               </div>
            </section>

            <section className="p-6 bg-amber-50 border border-amber-100 rounded-3xl space-y-4">
               <div className="flex items-center space-x-3 text-amber-600">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeWidth={2}/></svg>
                  <span className="text-[10px] font-black uppercase tracking-widest">Governance Note (10.0)</span>
               </div>
               <p className="text-[11px] font-medium text-amber-900/70 leading-relaxed">
                  Localized pricing in {selectedCountry.name} bypasses master propagation. Manual approval required for changes over 20% variance.
               </p>
            </section>
         </div>

         <footer className="p-8 border-t border-gray-50 bg-gray-50/30 shrink-0">
            <button className="w-full py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-200 active:scale-95">
               Deploy Pricing Changes
            </button>
         </footer>
      </aside>
    </div>
  );
};

export default PricingPlanBuilder;
