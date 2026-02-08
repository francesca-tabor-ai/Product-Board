
import React, { useState, useMemo } from 'react';
import { Feature, FeatureStatus } from '../types';

interface FeaturesTableProps {
  features: Feature[];
  onSelectFeature: (id: string) => void;
  onUpdateFeature: (updated: Feature) => void;
}

type SortKey = 'title' | 'type' | 'reach' | 'impact' | 'confidence' | 'effort' | 'growth' | 'retention' | 'score';
type SortOrder = 'asc' | 'desc';

const FeaturesTable: React.FC<FeaturesTableProps> = ({ features, onSelectFeature, onUpdateFeature }) => {
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; order: SortOrder }>({ key: 'score', order: 'desc' });

  const statuses: FeatureStatus[] = ['idea', 'discovery', 'planned', 'in-progress', 'released'];

  const isPrimitive = (feature: Feature) => {
    return feature.strategicType === 'foundation' || 
           feature.productArea.toLowerCase().includes('platform') || 
           feature.productArea.toLowerCase().includes('infra');
  };

  const handleSort = (key: SortKey) => {
    setSortConfig(prev => ({
      key,
      order: prev.key === key && prev.order === 'desc' ? 'asc' : 'desc'
    }));
  };

  const sortedFeatures = useMemo(() => {
    const sorted = [...features];
    const { key, order } = sortConfig;

    sorted.sort((a, b) => {
      let valA: any;
      let valB: any;

      switch (key) {
        case 'title':
          valA = a.title.toLowerCase();
          valB = b.title.toLowerCase();
          break;
        case 'type':
          valA = isPrimitive(a) ? 0 : 1;
          valB = isPrimitive(b) ? 0 : 1;
          break;
        case 'reach':
          valA = a.dimensions.customerValue;
          valB = b.dimensions.customerValue;
          break;
        case 'impact':
          valA = a.dimensions.strategic;
          valB = b.dimensions.strategic;
          break;
        case 'confidence':
          valA = a.dimensions.confidence;
          valB = b.dimensions.confidence;
          break;
        case 'effort':
          valA = a.dimensions.effort;
          valB = b.dimensions.effort;
          break;
        case 'growth':
          valA = a.predictedImpact?.arrDelta || 0;
          valB = b.predictedImpact?.arrDelta || 0;
          break;
        case 'retention':
          valA = a.predictedImpact?.retentionLift || 0;
          valB = b.predictedImpact?.retentionLift || 0;
          break;
        case 'score':
          valA = a.finalScore;
          valB = b.finalScore;
          break;
        default:
          return 0;
      }

      if (valA < valB) return order === 'asc' ? -1 : 1;
      if (valA > valB) return order === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [features, sortConfig]);

  const onDragStart = (e: React.DragEvent, featureId: string) => {
    e.dataTransfer.setData('featureId', featureId);
    setDraggedId(featureId);
  };

  const onDragEnd = () => {
    setDraggedId(null);
  };

  const onDropStatus = (e: React.DragEvent, status: FeatureStatus) => {
    e.preventDefault();
    const featureId = e.dataTransfer.getData('featureId');
    const feature = features.find(f => f.id === featureId);
    if (feature && feature.status !== status) {
      onUpdateFeature({
        ...feature,
        status,
        updatedAt: new Date().toISOString()
      });
    }
    setDraggedId(null);
  };

  const SortIcon = ({ colKey }: { colKey: SortKey }) => {
    if (sortConfig.key !== colKey) return <svg className="w-3 h-3 ml-1 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" strokeWidth={2}/></svg>;
    return sortConfig.order === 'desc' 
      ? <svg className="w-3 h-3 ml-1 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 9l-7 7-7-7" strokeWidth={3}/></svg>
      : <svg className="w-3 h-3 ml-1 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 15l7-7 7 7" strokeWidth={3}/></svg>;
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden animate-fadeIn">
      <header className="px-10 py-8 flex items-end justify-between border-b border-gray-50">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Features</h1>
          <p className="text-base text-gray-500 font-light leading-relaxed">
            Quantify value with RICE and predicted revenue impact.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-gray-100 p-1 rounded-full flex border border-gray-200">
            <button 
              onClick={() => setViewMode('list')}
              className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400'}`}
            >
              List
            </button>
            <button 
              onClick={() => setViewMode('board')}
              className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full transition-all ${viewMode === 'board' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400'}`}
            >
              Board
            </button>
          </div>
          <button className="px-6 py-2.5 bg-gray-900 text-white rounded-full text-sm font-bold hover:bg-black transition-all shadow-lg shadow-gray-200">
            + Define Feature
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-auto px-10 pb-10 pt-6">
        {viewMode === 'list' ? (
          <div className="border border-gray-100 rounded-[40px] overflow-hidden bg-white shadow-sm">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-10 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest cursor-pointer group" onClick={() => handleSort('title')}>
                    <div className="flex items-center">Feature <SortIcon colKey="title" /></div>
                  </th>
                  <th className="px-4 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest cursor-pointer group" onClick={() => handleSort('type')}>
                    <div className="flex items-center">Type <SortIcon colKey="type" /></div>
                  </th>
                  <th className="px-4 py-6 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest cursor-pointer group" onClick={() => handleSort('reach')}>
                    <div className="flex items-center justify-center">Reach <SortIcon colKey="reach" /></div>
                  </th>
                  <th className="px-4 py-6 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest cursor-pointer group" onClick={() => handleSort('impact')}>
                    <div className="flex items-center justify-center">Impact <SortIcon colKey="impact" /></div>
                  </th>
                  <th className="px-4 py-6 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest cursor-pointer group" onClick={() => handleSort('confidence')}>
                    <div className="flex items-center justify-center">Confidence <SortIcon colKey="confidence" /></div>
                  </th>
                  <th className="px-4 py-6 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest cursor-pointer group" onClick={() => handleSort('effort')}>
                    <div className="flex items-center justify-center">Effort <SortIcon colKey="effort" /></div>
                  </th>
                  <th className="px-4 py-6 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest cursor-pointer group" onClick={() => handleSort('growth')}>
                    <div className="flex items-center justify-center">Growth Rev <SortIcon colKey="growth" /></div>
                  </th>
                  <th className="px-4 py-6 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest cursor-pointer group" onClick={() => handleSort('retention')}>
                    <div className="flex items-center justify-center">Retention Rev <SortIcon colKey="retention" /></div>
                  </th>
                  <th className="px-10 py-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest cursor-pointer group" onClick={() => handleSort('score')}>
                    <div className="flex items-center justify-end">Overall Score <SortIcon colKey="score" /></div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {sortedFeatures.map((feature) => {
                  const primitive = isPrimitive(feature);
                  return (
                    <tr 
                      key={feature.id} 
                      onClick={() => onSelectFeature(feature.id)}
                      className="hover:bg-gray-50/30 transition-all group cursor-pointer"
                    >
                      <td className="px-10 py-7">
                        <div className="flex flex-col max-w-xs">
                          <span className="text-[14px] font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-0.5 truncate">{feature.title}</span>
                          <span className="text-[9px] text-gray-400 font-black tracking-tight uppercase">{feature.productArea}</span>
                        </div>
                      </td>
                      <td className="px-4 py-7 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-tighter ${primitive ? 'bg-slate-900 text-white' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'}`}>
                          {primitive ? 'Primitive' : 'End-User'}
                        </span>
                      </td>
                      <td className="px-4 py-7 text-center">
                        <span className="text-xs font-bold text-gray-700">{feature.dimensions.customerValue}</span>
                      </td>
                      <td className="px-4 py-7 text-center">
                        <span className="text-xs font-bold text-gray-700">{feature.dimensions.strategic}</span>
                      </td>
                      <td className="px-4 py-7 text-center">
                        <span className="text-xs font-bold text-gray-700">{Math.round(feature.dimensions.confidence * 100)}%</span>
                      </td>
                      <td className="px-4 py-7 text-center">
                        <span className="text-xs font-bold text-gray-700">{feature.dimensions.effort}</span>
                      </td>
                      <td className="px-4 py-7 text-center">
                        <span className={`text-xs font-black ${feature.predictedImpact?.arrDelta ? 'text-emerald-600' : 'text-gray-300'}`}>
                          {feature.predictedImpact?.arrDelta ? `+$${(feature.predictedImpact.arrDelta/1000).toFixed(1)}k` : '—'}
                        </span>
                      </td>
                      <td className="px-4 py-7 text-center">
                        <span className={`text-xs font-black ${feature.predictedImpact?.retentionLift ? 'text-indigo-600' : 'text-gray-300'}`}>
                          {feature.predictedImpact?.retentionLift ? `+${feature.predictedImpact.retentionLift}%` : '—'}
                        </span>
                      </td>
                      <td className="px-10 py-7 text-right">
                        <div className="inline-flex items-center justify-center px-4 py-2 rounded-2xl bg-gray-900 text-white font-black text-xs">
                          {feature.finalScore}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex space-x-6 h-full items-start pb-8 min-w-max">
            {statuses.map(status => (
              <div 
                key={status} 
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => onDropStatus(e, status)}
                className="w-72 bg-gray-50/50 rounded-[32px] border border-gray-100 p-6 flex flex-col h-full min-h-[600px] transition-colors"
              >
                <div className="flex items-center justify-between mb-6 px-2">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{status}</h3>
                  <span className="text-[10px] bg-white border border-gray-100 rounded-full px-2 py-0.5 font-bold text-gray-400">
                    {features.filter(f => f.status === status).length}
                  </span>
                </div>
                <div className="flex-1 space-y-4">
                  {features.filter(f => f.status === status).map(feature => (
                    <div 
                      key={feature.id}
                      draggable
                      onDragStart={(e) => onDragStart(e, feature.id)}
                      onDragEnd={onDragEnd}
                      onClick={() => onSelectFeature(feature.id)}
                      className={`bg-white p-6 rounded-3xl border border-gray-100 premium-shadow premium-shadow-hover transition-all cursor-pointer group hover:border-indigo-100 ${draggedId === feature.id ? 'opacity-40 grayscale rotate-2 scale-90' : ''}`}
                    >
                      <h4 className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-4">{feature.title}</h4>
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{feature.productArea}</span>
                         <div className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black">
                           {feature.finalScore}
                         </div>
                      </div>
                    </div>
                  ))}
                  <div className="h-20 rounded-3xl border-2 border-dashed border-gray-200/50 flex items-center justify-center text-[10px] font-bold text-gray-300 uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                    Move Here
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default FeaturesTable;
