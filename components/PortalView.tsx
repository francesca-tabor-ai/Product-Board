
import React, { useState, useMemo } from 'react';
import { UserIdea } from '../types';

interface PortalViewProps {
  ideas: UserIdea[];
  onVote: (id: string) => void;
  onSubmitIdea: (title: string, description: string) => void;
}

type PortalTab = 'trending' | 'under-consideration' | 'planned';

const PortalView: React.FC<PortalViewProps> = ({ ideas, onVote, onSubmitIdea }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [activeTab, setActiveTab] = useState<PortalTab>('trending');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && description) {
      onSubmitIdea(title, description);
      setTitle('');
      setDescription('');
      setIsModalOpen(false);
    }
  };

  const filteredIdeas = useMemo(() => {
    switch (activeTab) {
      case 'trending':
        return [...ideas].sort((a, b) => b.votes - a.votes);
      case 'under-consideration':
        return ideas.filter(i => i.status === 'under-consideration');
      case 'planned':
        return ideas.filter(i => i.status === 'planned');
      default:
        return ideas;
    }
  }, [ideas, activeTab]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'planned': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'under-consideration': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'not-now': return 'bg-rose-50 text-rose-500 border-rose-100';
      default: return 'bg-gray-50 text-gray-500 border-gray-100';
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F9FAFB] overflow-hidden">
      {/* Portal Hero */}
      <header className="px-10 py-16 bg-signature-gradient text-white relative overflow-hidden shrink-0">
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-5xl font-black tracking-tight mb-4">Customer Feedback Portal</h1>
          <p className="text-xl font-light opacity-90 mb-8 leading-relaxed">
            Help us shape the future of ProductSync. Share your ideas, vote on requested features, and see what's coming next.
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-10 py-4 bg-white text-indigo-600 rounded-full font-bold shadow-xl hover:bg-gray-50 transition-all transform hover:scale-105 active:scale-95"
          >
            + Submit New Idea
          </button>
        </div>
        {/* Decorative Circles */}
        <div className="absolute top-[-100px] right-[-50px] w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-50px] right-[100px] w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
      </header>

      {/* Portal Main Feed */}
      <main className="flex-1 overflow-y-auto px-10 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-10 border-b border-gray-200 pb-6">
            <div className="flex items-center space-x-12">
              <button 
                onClick={() => setActiveTab('trending')}
                className={`text-sm font-bold pb-6 -mb-6 transition-all border-b-2 ${activeTab === 'trending' ? 'text-gray-900 border-indigo-600' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
              >
                Trending Ideas
              </button>
              <button 
                onClick={() => setActiveTab('under-consideration')}
                className={`text-sm font-bold pb-6 -mb-6 transition-all border-b-2 ${activeTab === 'under-consideration' ? 'text-gray-900 border-indigo-600' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
              >
                Under Consideration
              </button>
              <button 
                onClick={() => setActiveTab('planned')}
                className={`text-sm font-bold pb-6 -mb-6 transition-all border-b-2 ${activeTab === 'planned' ? 'text-gray-900 border-indigo-600' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
              >
                Planned
              </button>
            </div>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search ideas..." 
                className="bg-white border border-gray-200 rounded-full px-6 py-2.5 text-xs w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
          </div>

          {filteredIdeas.length === 0 ? (
            <div className="py-20 text-center">
               <div className="w-16 h-16 bg-white rounded-3xl border border-gray-100 flex items-center justify-center mx-auto mb-4 text-gray-200 shadow-sm">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" strokeWidth={2}/></svg>
               </div>
               <h3 className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">No ideas in this category yet</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredIdeas.map(idea => (
                <div key={idea.id} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all group flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(idea.status)}`}>
                      {idea.status.replace('-', ' ')}
                    </span>
                    <div className="text-[10px] font-bold text-gray-300 uppercase">{idea.category}</div>
                  </div>
                  
                  <h3 className="text-lg font-black text-gray-900 mb-3 leading-tight group-hover:text-indigo-600 transition-colors">
                    {idea.title}
                  </h3>
                  <p className="text-sm text-gray-500 font-light leading-relaxed mb-8 flex-1">
                    {idea.description}
                  </p>

                  <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400">
                        {idea.author.charAt(0)}
                      </div>
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">{idea.author}</span>
                    </div>
                    <button 
                      onClick={() => onVote(idea.id)}
                      className="flex items-center space-x-2 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white px-4 py-2 rounded-2xl transition-all group/btn shadow-sm"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
                      </svg>
                      <span className="text-xs font-black">{idea.votes}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Submission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden border border-gray-100">
            <header className="px-10 py-8 border-b border-gray-50 flex items-center justify-between">
              <h3 className="text-2xl font-black text-gray-900">Submit an Idea</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </header>
            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Title</label>
                <input 
                  type="text" 
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="What should we build?" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Description</label>
                <textarea 
                  required
                  rows={4}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Tell us more about the problem this solves..." 
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none" 
                />
              </div>
              <button 
                type="submit"
                className="w-full py-5 bg-signature-gradient text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-100 hover:opacity-90 transition-all"
              >
                Post Idea to Portal
              </button>
              <p className="text-[10px] text-gray-400 font-medium text-center">
                Your idea will be visible to everyone on the portal once submitted.
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortalView;
