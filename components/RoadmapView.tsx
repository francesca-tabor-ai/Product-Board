
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Feature } from '../types';

interface RoadmapViewProps {
  features: Feature[];
  onSelectFeature: (id: string) => void;
  onUpdateFeature: (updated: Feature) => void;
}

type TimeResolution = 'year' | 'quarter' | 'month' | 'week';

const RoadmapView: React.FC<RoadmapViewProps> = ({ features, onSelectFeature, onUpdateFeature }) => {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'timeline' | 'kanban'>('kanban');
  const [resolution, setResolution] = useState<TimeResolution>('quarter');
  const [backlogOpen, setBacklogOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Generate time buckets based on resolution
  // Range: 1 year past, 3 years future from 2024
  const timeBuckets = useMemo(() => {
    const startYear = 2023;
    const endYear = 2027;
    const buckets: string[] = [];

    for (let y = startYear; y <= endYear; y++) {
      if (resolution === 'year') {
        buckets.push(`${y}`);
      } else if (resolution === 'quarter') {
        for (let q = 1; q <= 4; q++) buckets.push(`Q${q} ${y}`);
      } else if (resolution === 'month') {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        for (const m of months) buckets.push(`${m} ${y}`);
      } else if (resolution === 'week') {
        for (let w = 1; w <= 52; w++) buckets.push(`W${w} ${y}`);
      }
    }
    return buckets;
  }, [resolution]);

  // Initial scroll to "current" date roughly (Q2 2024)
  useEffect(() => {
    if (scrollContainerRef.current) {
      const currentBucketIndex = timeBuckets.findIndex(b => b.includes('2024'));
      if (currentBucketIndex !== -1) {
        const columnWidth = resolution === 'week' ? 120 : 340;
        scrollContainerRef.current.scrollLeft = currentBucketIndex * columnWidth - 100;
      }
    }
  }, [resolution, viewMode, timeBuckets]);

  const backlogFeatures = useMemo(() => {
    return features.filter(f => !f.release || f.release === 'Backlog' || !timeBuckets.includes(f.release));
  }, [features, timeBuckets]);

  const getFeaturesInBucket = (bucket: string) => {
    return features.filter(f => f.release === bucket);
  };

  const getFeatureTypeInfo = (feature: Feature) => {
    // Differentiation: Foundation/Core often Primitives, Expansion/Experimental often End-User
    const isPrimitive = feature.strategicType === 'foundation' || feature.productArea.toLowerCase().includes('platform') || feature.productArea.toLowerCase().includes('infra');
    return {
      label: isPrimitive ? 'Platform Primitive' : 'End-user Feature',
      color: isPrimitive ? 'bg-slate-800' : 'bg-indigo-600',
      tagColor: isPrimitive ? 'bg-slate-100 text-slate-600' : 'bg-indigo-50 text-indigo-600',
      borderColor: isPrimitive ? 'border-slate-200 group-hover:border-slate-400' : 'border-indigo-100 group-hover:border-indigo-400'
    };
  };

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'in-progress': return 'bg-amber-400';
      case 'released': return 'bg-emerald-500';
      case 'planned': return 'bg-indigo-500';
      default: return 'bg-gray-200';
    }
  };

  const onDragStart = (e: React.DragEvent, featureId: string) => {
    e.dataTransfer.setData('featureId', featureId);
    setDraggedId(featureId);
  };

  const onDragEnd = () => {
    setDraggedId(null);
  };

  const onDrop = (e: React.DragEvent, bucket: string) => {
    e.preventDefault();
    const featureId = e.dataTransfer.getData('featureId');
    const feature = features.find(f => f.id === featureId);
    if (feature && feature.release !== bucket) {
      onUpdateFeature({
        ...feature,
        release: bucket,
        updatedAt: new Date().toISOString()
      });
    }
    setDraggedId(null);
  };

  // Added React.FC type to fix "key" prop errors in JSX when using local function as a component
  const FeatureCard: React.FC<{ feature: Feature, isCompact?: boolean }> = ({ feature, isCompact = false }) => {
    const typeInfo = getFeatureTypeInfo(feature);
    return (
      <div 
        draggable
        onDragStart={(e) => onDragStart(e, feature.id)}
        onDragEnd={onDragEnd}
        onClick={() => onSelectFeature(feature.id)}
        className={`group bg-white rounded-[24px] border ${typeInfo.borderColor} premium-shadow premium-shadow-hover transition-all duration-300 cursor-pointer relative overflow-hidden ${draggedId === feature.id ? 'opacity-40 scale-90 rotate-2' : ''} ${isCompact ? 'p-4' : 'p-6 md:p-8'}`}
      >
        <div className={`absolute top-0 left-0 w-1.5 h-full ${getStatusIndicator(feature.status)}`}></div>
        
        <div className="flex flex-col mb-3">
          <div className="flex items-center space-x-2 mb-2">
            <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${typeInfo.tagColor}`}>
              {typeInfo.label}
            </span>
          </div>
          <h4 className={`font-bold text-gray-900 group-hover:text-indigo-600 transition-colors leading-tight ${isCompact ? 'text-sm' : 'text-base'}`}>{feature.title}</h4>
        </div>
        
        {!isCompact && (
          <p className="text-[13px] text-gray-500 font-light leading-relaxed mb-6 line-clamp-2">
            {feature.description}
          </p>
        )}
        
        <div className={`flex items-center justify-between ${isCompact ? 'pt-2' : 'pt-4 border-t border-gray-50'}`}>
          <div className="flex items-center space-x-2">
            <img 
              src={`https://picsum.photos/seed/${feature.owner}/48/48`} 
              className="w-5 h-5 rounded-full border border-white shadow-sm" 
              alt="Owner"
            />
            <span className="text-[10px] font-semibold text-gray-400">{feature.owner.split(' ')[0]}</span>
          </div>
          <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wide">
            Score {feature.finalScore}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
      <header className="px-10 py-6 flex items-end justify-between border-b border-gray-50 shrink-0 bg-white z-20">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Roadmap</h1>
          <div className="flex items-center space-x-4">
             <div className="bg-gray-100 p-0.5 rounded-lg flex border border-gray-200">
                {(['year', 'quarter', 'month', 'week'] as const).map(res => (
                  <button 
                    key={res}
                    onClick={() => setResolution(res)}
                    className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-md transition-all ${resolution === res ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    {res}
                  </button>
                ))}
             </div>
             <p className="text-xs text-gray-400 font-medium">1 Year Historic • 3 Year Future Projection</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-gray-100 p-1 rounded-full flex border border-gray-200">
            <button 
              onClick={() => setViewMode('timeline')}
              className={`px-5 py-1.5 text-xs font-bold rounded-full transition-all ${viewMode === 'timeline' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Timeline
            </button>
            <button 
              onClick={() => setViewMode('kanban')}
              className={`px-5 py-1.5 text-xs font-bold rounded-full transition-all ${viewMode === 'kanban' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Kanban
            </button>
          </div>
          <button 
            onClick={() => setBacklogOpen(!backlogOpen)}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center space-x-2 ${backlogOpen ? 'bg-indigo-600 text-white' : 'bg-gray-900 text-white hover:bg-black'}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 6h16M4 12h16m-7 6h7" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span>Backlog</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <main 
          ref={scrollContainerRef}
          className="flex-1 overflow-x-auto overflow-y-auto bg-gray-50/30 px-10 pt-8 pb-12 custom-scrollbar"
        >
          {viewMode === 'kanban' ? (
            <div className="flex space-x-8 min-w-max h-full items-start">
              {timeBuckets.map((bucket) => (
                <div 
                  key={bucket} 
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => onDrop(e, bucket)}
                  className={`${resolution === 'week' ? 'w-56' : resolution === 'month' ? 'w-72' : 'w-[340px]'} flex flex-col space-y-4 h-full group/col`}
                >
                  <div className="flex items-center justify-between px-2">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{bucket}</h3>
                    <span className="w-5 h-5 flex items-center justify-center text-[10px] bg-white border border-gray-100 rounded-full text-gray-500 font-bold shadow-sm">
                      {getFeaturesInBucket(bucket).length}
                    </span>
                  </div>
                  
                  <div className="flex-1 space-y-4 bg-gray-100/30 p-2 rounded-[32px] min-h-[500px] border border-transparent hover:border-indigo-100/30 transition-colors">
                    {getFeaturesInBucket(bucket).map((feature) => (
                      <FeatureCard key={feature.id} feature={feature} isCompact={resolution === 'week'} />
                    ))}
                    <div className="h-16 border-2 border-dashed border-gray-200/50 rounded-[24px] flex items-center justify-center text-gray-400 text-[9px] font-black uppercase tracking-widest bg-white/20 hover:bg-white/50 transition-all">
                      Schedule
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden animate-fadeIn min-w-[2000px]">
              <div className={`grid border-b border-gray-100 sticky top-0 bg-white z-10`} style={{ gridTemplateColumns: `300px repeat(${timeBuckets.length}, 1fr)` }}>
                <div className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest border-r border-gray-50">Initiative</div>
                {timeBuckets.map(bucket => (
                  <div key={bucket} className="p-6 text-center text-[9px] font-black text-gray-400 uppercase tracking-widest border-r border-gray-50 last:border-r-0 whitespace-nowrap overflow-hidden text-ellipsis">
                    {bucket}
                  </div>
                ))}
              </div>
              <div className="divide-y divide-gray-50">
                {features.map(feature => {
                  const typeInfo = getFeatureTypeInfo(feature);
                  return (
                    <div key={feature.id} className={`grid group hover:bg-gray-50/50 transition-colors`} style={{ gridTemplateColumns: `300px repeat(${timeBuckets.length}, 1fr)` }}>
                      <div className="p-6 border-r border-gray-50 flex flex-col cursor-pointer" onClick={() => onSelectFeature(feature.id)}>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`w-1.5 h-1.5 rounded-full ${typeInfo.color}`} />
                          <span className="text-[13px] font-bold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">{feature.title}</span>
                        </div>
                        <span className="text-[9px] text-gray-400 font-black uppercase tracking-tighter">{feature.productArea}</span>
                      </div>
                      {timeBuckets.map(bucket => (
                        <div key={bucket} className="border-r border-gray-50 last:border-r-0 flex items-center justify-center p-2" onDragOver={e => e.preventDefault()} onDrop={e => onDrop(e, bucket)}>
                          {feature.release === bucket && (
                            <div 
                              draggable
                              onDragStart={e => onDragStart(e, feature.id)}
                              onDragEnd={onDragEnd}
                              className={`w-full h-8 rounded-xl ${getStatusIndicator(feature.status)} opacity-90 shadow-sm flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-105 transition-transform`}
                            >
                               <span className="text-[9px] font-black text-white uppercase tracking-tighter">{feature.status}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </main>

        {/* Backlog Side Panel */}
        <aside className={`bg-white border-l border-gray-100 flex flex-col shrink-0 transition-all duration-300 ease-in-out shadow-2xl z-30 ${backlogOpen ? 'w-96' : 'w-0 border-l-0 overflow-hidden'}`}>
           <header className="p-8 border-b border-gray-50 flex items-center justify-between shrink-0">
              <div className="flex flex-col">
                 <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.4em]">Backlog</h3>
                 <span className="text-[10px] font-bold text-gray-300">{backlogFeatures.length} Unscheduled items</span>
              </div>
              <button onClick={() => setBacklogOpen(false)} className="p-2 text-gray-300 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" strokeWidth={2.5}/></svg>
              </button>
           </header>

           <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-gray-50/50">
              {backlogFeatures.length === 0 && (
                <div className="h-64 flex flex-col items-center justify-center text-center p-8 space-y-4">
                  <div className="w-12 h-12 bg-white rounded-2xl border border-gray-100 flex items-center justify-center text-gray-200">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" strokeWidth={2}/></svg>
                  </div>
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Backlog is empty</p>
                </div>
              )}
              {backlogFeatures.map(feature => (
                <FeatureCard key={feature.id} feature={feature} isCompact />
              ))}
           </div>

           <footer className="p-6 border-t border-gray-50 bg-white space-y-4">
              <p className="text-[9px] font-bold text-gray-400 leading-relaxed text-center uppercase tracking-widest">Drag and drop items to the roadmap to schedule them</p>
              <button className="w-full py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-200">
                Add To Backlog
              </button>
           </footer>
        </aside>
      </div>
    </div>
  );
};

export default RoadmapView;
