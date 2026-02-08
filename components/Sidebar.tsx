
import React from 'react';
import { View } from '../types';
import { ICONS } from '../constants';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: View.ORGANISATION, label: 'Organisation', icon: ICONS.Organisation },
    { id: View.CUSTOMER, label: 'Customer', icon: ICONS.Customer },
    { id: View.PRICING, label: 'Pricing', icon: ICONS.Pricing },
    { id: View.REVENUE, label: 'Revenue', icon: ICONS.Revenue },
    { id: View.ROADMAP, label: 'Roadmap', icon: ICONS.Roadmap },
    { id: View.FEATURES, label: 'Features', icon: ICONS.Features },
    { id: View.TECH_STACK, label: 'Tech Stack', icon: ICONS.TechStack },
    { id: View.VIBE_CODE, label: 'Vibe Code', icon: ICONS.VibeCode },
    { id: View.PORTAL, label: 'Portal', icon: ICONS.Portal },
    { id: View.INSIGHTS, label: 'Insights', icon: ICONS.Insights },
  ];

  return (
    <aside className="w-60 bg-white border-r border-gray-100 flex flex-col h-screen shrink-0">
      <div className="p-8 flex items-center space-x-3">
        <div className="w-7 h-7 bg-signature-gradient rounded-lg flex items-center justify-center shadow-sm">
          <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
        </div>
        <span className="text-lg font-bold text-gray-900 tracking-tight">ProductSync</span>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-4 mb-4">Workspace</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-gray-50 text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50/50'
              }`}
            >
              <Icon className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-6">
        <button 
          onClick={() => setView(View.ACCOUNT)}
          className={`w-full p-4 rounded-2xl border flex items-center cursor-pointer group transition-all ${currentView === View.ACCOUNT ? 'bg-indigo-50 border-indigo-100' : 'bg-gray-50 border-gray-100/50 hover:border-gray-200'}`}
        >
          <img 
            src="https://picsum.photos/seed/user123/64/64" 
            alt="Profile" 
            className="w-8 h-8 rounded-full border border-white shadow-sm"
          />
          <div className="ml-3 overflow-hidden text-left">
            <p className="text-xs font-black text-gray-900 truncate">Alex Rivera</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Product Lead</p>
          </div>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
