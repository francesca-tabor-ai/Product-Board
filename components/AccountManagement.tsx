
import React, { useState } from 'react';

type AccountTab = 'profile' | 'team' | 'billing' | 'integrations';

const AccountManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AccountTab>('profile');

  const tabs: { id: AccountTab; label: string }[] = [
    { id: 'profile', label: 'Personal Profile' },
    { id: 'team', label: 'Team Account' },
    { id: 'billing', label: 'Billing & Plans' },
    { id: 'integrations', label: 'Integrations' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden animate-fadeIn">
      <header className="px-10 py-10 border-b border-gray-50 bg-white shrink-0">
        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Account Management</h1>
          <div className="flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-[11px] font-black uppercase tracking-[0.2em] pb-4 border-b-2 transition-all ${activeTab === tab.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto bg-gray-50/30 py-12 px-10">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'profile' && (
            <div className="space-y-12 animate-fadeIn">
              <section className="space-y-6">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">General Information</h3>
                <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-8">
                  <div className="flex items-center space-x-8">
                    <img src="https://picsum.photos/seed/user123/128/128" className="w-20 h-20 rounded-[32px] border-4 border-white shadow-lg" alt="Profile" />
                    <button className="px-5 py-2 bg-gray-900 text-white rounded-full text-xs font-bold hover:bg-black transition-all">Upload New Photo</button>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
                      <input type="text" defaultValue="Alex Rivera" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500/10 outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Work Email</label>
                      <input type="email" defaultValue="alex@productsync.ai" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500/10 outline-none" />
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="space-y-12 animate-fadeIn">
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Team Members</h3>
                  <button className="px-5 py-2 bg-indigo-600 text-white rounded-full text-xs font-bold shadow-lg hover:bg-indigo-700 transition-all">+ Invite Member</button>
                </div>
                <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                      <tr>
                        <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">User</th>
                        <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Role</th>
                        <th className="px-8 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {[
                        { name: 'Alex Rivera', email: 'alex@productsync.ai', role: 'Owner' },
                        { name: 'Jordan Smith', email: 'jordan@productsync.ai', role: 'Editor' },
                        { name: 'Casey Lee', email: 'casey@productsync.ai', role: 'Viewer' },
                      ].map(member => (
                        <tr key={member.email}>
                          <td className="px-8 py-6">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-black text-[10px] text-gray-400">{member.name[0]}</div>
                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-gray-900">{member.name}</span>
                                <span className="text-[10px] text-gray-400">{member.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <span className="text-xs font-bold text-gray-700">{member.role}</span>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <button className="text-[10px] font-black uppercase text-indigo-600 hover:text-indigo-800">Manage</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-12 animate-fadeIn">
              <section className="space-y-6">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Current Subscription</h3>
                <div className="p-10 bg-signature-gradient rounded-[40px] text-white flex items-center justify-between shadow-2xl">
                   <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Enterprise Plan</p>
                      <h4 className="text-3xl font-black">$999<span className="text-sm font-normal opacity-70"> / month</span></h4>
                      <p className="text-sm opacity-80">Renews on Oct 12, 2024</p>
                   </div>
                   <button className="px-8 py-3 bg-white text-indigo-600 rounded-full font-black text-xs uppercase tracking-widest shadow-xl">Manage Subscription</button>
                </div>
              </section>
              <section className="space-y-6">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Invoices</h3>
                <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-2">
                  <div className="flex items-center justify-between p-6 hover:bg-gray-50 rounded-2xl transition-all cursor-pointer">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth={2}/></svg>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">INV-2024-009</p>
                        <p className="text-[10px] text-gray-400 uppercase font-black">Sept 12, 2024</p>
                      </div>
                    </div>
                    <span className="text-sm font-black text-gray-900">$999.00</span>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="space-y-12 animate-fadeIn">
              <section className="space-y-6">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Workspace Integrations</h3>
                <div className="grid grid-cols-2 gap-8">
                  {[
                    { name: 'Jira Software', status: 'Connected', desc: 'Sync engineering tickets with roadmap initiatives.' },
                    { name: 'Slack', status: 'Connected', desc: 'Real-time feedback and roadmap updates.' },
                    { name: 'Salesforce', status: 'Disconnected', desc: 'Sync CRM insights to revenue intelligence.' },
                    { name: 'Zendesk', status: 'Disconnected', desc: 'Import support signals into the feedback portal.' },
                  ].map(integration => (
                    <div key={integration.name} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col justify-between hover:border-indigo-100 transition-all group">
                       <div className="space-y-4">
                          <div className="flex items-center justify-between">
                             <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 font-black text-sm group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">{integration.name[0]}</div>
                             <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter border ${integration.status === 'Connected' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>{integration.status}</span>
                          </div>
                          <h4 className="text-lg font-black text-gray-900 group-hover:text-indigo-600 transition-colors">{integration.name}</h4>
                          <p className="text-xs text-gray-500 font-light leading-relaxed">{integration.desc}</p>
                       </div>
                       <button className={`mt-8 w-full py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${integration.status === 'Connected' ? 'bg-gray-50 text-gray-500 hover:bg-gray-100' : 'bg-gray-900 text-white hover:bg-black shadow-lg shadow-gray-200'}`}>{integration.status === 'Connected' ? 'Configure' : 'Connect'}</button>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AccountManagement;
