
import React, { useState } from 'react';
import { TechStackProfile, TechStackComponent, TechComponentStatus } from '../types';
import { ICONS } from '../constants';

interface TechStackViewProps {
  stack: TechStackProfile;
  onUpdateStack: (updated: TechStackProfile) => void;
}

const TechStackView: React.FC<TechStackViewProps> = ({ stack, onUpdateStack }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Fix: Explicitly type categories as string array to resolve "unknown" type error in the map callback
  const categories: string[] = Array.from(new Set(stack.components.map(c => c.category)));

  const getStatusColor = (status: TechComponentStatus) => {
    switch (status) {
      case 'approved': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'deprecated': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'blocked': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'required': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      default: return 'bg-gray-50 text-gray-500 border-gray-100';
    }
  };

  const handleUpdateComponent = (compId: string, updates: Partial<TechStackComponent>) => {
    const updatedComponents = stack.components.map(c => 
      c.id === compId ? { ...c, ...updates } : c
    );
    onUpdateStack({ ...stack, components: updatedComponents, updatedAt: new Date().toISOString() });
  };

  const addComponent = (category: string) => {
    const newComp: TechStackComponent = {
      id: `tc-${Date.now()}`,
      category,
      toolName: 'New Component',
      version: 'Latest',
      status: 'approved',
      isCustom: true
    };
    onUpdateStack({
      ...stack,
      components: [...stack.components, newComp],
      updatedAt: new Date().toISOString()
    });
  };

  const removeComponent = (compId: string) => {
    onUpdateStack({
      ...stack,
      components: stack.components.filter(c => c.id !== compId),
      updatedAt: new Date().toISOString()
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      <header className="px-10 py-10 border-b border-gray-50 bg-white flex items-end justify-between shrink-0">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
             <h1 className="text-3xl font-black text-gray-900 tracking-tight">Tech Stack Specification</h1>
             <span className="px-2.5 py-0.5 bg-gray-100 text-[10px] font-black rounded uppercase text-gray-400">v{stack.version}</span>
          </div>
          <p className="text-sm text-gray-400 font-medium">Centralized architecture source of truth and build-context repository.</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right mr-4">
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Last Sync</p>
             <p className="text-xs font-bold text-gray-900">{new Date(stack.updatedAt).toLocaleString()}</p>
          </div>
          <button 
            onClick={() => setIsEditMode(!isEditMode)}
            className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all shadow-lg ${isEditMode ? 'bg-indigo-600 text-white shadow-indigo-100' : 'bg-white border border-gray-100 text-gray-700 hover:bg-gray-50 shadow-gray-100'}`}
          >
            {isEditMode ? 'Save Specification' : 'Modify Stack'}
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-10 py-12 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Stack Health Summary */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
             <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Total Components</p>
                <p className="text-3xl font-black text-gray-900">{stack.components.length}</p>
             </div>
             <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Compliance Rate</p>
                <p className="text-3xl font-black text-emerald-500">94.2%</p>
             </div>
             <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Deprecated</p>
                <p className="text-3xl font-black text-amber-500">{stack.components.filter(c => c.status === 'deprecated').length}</p>
             </div>
             <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Blocked</p>
                <p className="text-3xl font-black text-rose-500">{stack.components.filter(c => c.status === 'blocked').length}</p>
             </div>
          </section>

          {/* Grid of Categories */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
            {categories.map(category => (
              <section key={category} className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                <header className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                  <div className="flex items-center space-x-3">
                     <div className="w-8 h-8 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center">
                        <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
                     </div>
                     <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">{category}</h3>
                  </div>
                  {isEditMode && (
                    <button 
                      onClick={() => addComponent(category)}
                      className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 4v16m8-8H4" strokeWidth={2}/></svg>
                    </button>
                  )}
                </header>
                <div className="p-4 space-y-2">
                  {stack.components.filter(c => c.category === category).map(comp => (
                    <div key={comp.id} className="group p-4 bg-white hover:bg-gray-50/50 rounded-2xl border border-transparent hover:border-gray-100 transition-all flex items-center justify-between">
                       <div className="flex-1 flex items-center space-x-6">
                          <div className="w-1/3">
                            {isEditMode ? (
                              <input 
                                value={comp.toolName}
                                onChange={e => handleUpdateComponent(comp.id, { toolName: e.target.value })}
                                className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-bold w-full focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              />
                            ) : (
                              <p className="text-sm font-bold text-gray-900">{comp.toolName}</p>
                            )}
                          </div>
                          <div className="w-1/4">
                            {isEditMode ? (
                              <input 
                                value={comp.version}
                                onChange={e => handleUpdateComponent(comp.id, { version: e.target.value })}
                                className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium w-full text-gray-500"
                              />
                            ) : (
                              <p className="text-xs font-medium text-gray-400">{comp.version}</p>
                            )}
                          </div>
                          <div className="flex-1 text-right">
                             {isEditMode ? (
                               <select 
                                 value={comp.status}
                                 onChange={e => handleUpdateComponent(comp.id, { status: e.target.value as any })}
                                 className="bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-[10px] font-bold uppercase focus:outline-none"
                               >
                                 <option value="approved">Approved</option>
                                 <option value="deprecated">Deprecated</option>
                                 <option value="blocked">Blocked</option>
                                 <option value="required">Required</option>
                               </select>
                             ) : (
                               <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter border ${getStatusColor(comp.status)}`}>
                                 {comp.status}
                               </span>
                             )}
                          </div>
                       </div>
                       {isEditMode && (
                         <button 
                           onClick={() => removeComponent(comp.id)}
                           className="ml-4 p-1.5 text-gray-300 hover:text-rose-500 transition-colors"
                         >
                           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth={2}/></svg>
                         </button>
                       )}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* AI-Build Prompt Context Block */}
          <section className="p-10 bg-signature-gradient rounded-[40px] text-white flex items-center justify-between shadow-2xl shadow-indigo-100">
             <div className="max-w-3xl">
                <div className="flex items-center space-x-3 mb-4">
                  <ICONS.Gemini className="w-6 h-6 text-white" />
                  <span className="text-xs font-bold uppercase tracking-widest opacity-80">Stack-Aware Automation</span>
                </div>
                <h4 className="text-2xl font-bold mb-4 tracking-tight">Generate machine-readable build context.</h4>
                <p className="text-white/80 font-light leading-relaxed">
                  Your current Tech Stack Specification is ready to be consumed by downstream AI agents. This context ensures that generated PRDs, architecture diagrams, and boilerplate code adhere strictly to your defined standards.
                </p>
             </div>
             <button className="px-8 py-3 bg-white text-indigo-600 rounded-full font-bold hover:bg-gray-50 transition-all shadow-xl">
               Export Context JSON
             </button>
          </section>
        </div>
      </main>
    </div>
  );
};

export default TechStackView;
