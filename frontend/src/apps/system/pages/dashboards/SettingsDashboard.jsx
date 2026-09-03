import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Settings, Users, MessageSquare, Mail, Link as LinkIcon, Code, Globe, Shield, Activity, Server, ArrowRight, ToggleLeft, ToggleRight, Terminal } from 'lucide-react';
import client from '@/core/api/client';

const getSettingsCategories = (isDevMode) => [
  {
    id: 'general',
    label: 'General Settings',
    icon: Settings,
    sections: [
      {
        title: 'Company Information',
        items: [
          { title: 'Update Info', desc: 'Configure company data and logo', link: '/admin/settings/general' },
          { title: 'Manage Companies', desc: 'Setup multi-company environment', link: '/admin/settings/companies' }
        ]
      },
    ]
  },
  {
    id: 'users',
    label: 'Users & Companies',
    icon: Users,
    sections: [
      {
        title: 'Users',
        items: [
          { title: 'Manage Users', desc: 'Add, update and remove users', link: '/admin/settings/users' },
          { title: 'Access Rights', desc: 'Configure user roles', link: '/admin/settings/access-rights' }
        ]
      },
      {
        title: 'Groups',
        items: [
          { title: 'Groups', desc: 'Manage user groups', link: '/admin/settings/groups' },
          { title: 'Record Rules', desc: 'Manage object-level security', link: '/admin/settings/record-rules' },
          { title: 'Security Policy', desc: 'Configure password & session policies', link: '/admin/settings/security-policy' }
        ]
      }
    ]
  },

  {
    id: 'email',
    label: 'Email',
    icon: Mail,
    sections: [
      {
        title: 'Mail Servers',
        items: [
          { title: 'Outgoing Mail Servers', desc: 'Configure SMTP', link: '/admin/settings/outgoing-mail-servers' },
          { title: 'Incoming Mail Servers', desc: 'Configure IMAP/POP3', link: '/admin/settings/incoming-mail-servers' }
        ]
      },
      {
        title: 'Templates & Aliases',
        items: [
          { title: 'Email Templates', desc: 'Manage automated email templates', link: '/admin/settings/email-templates' },
          { title: 'Mail Aliases', desc: 'Configure domain routing', link: '/admin/settings/mail-aliases' }
        ]
      }
    ]
  },
  {
    id: 'automations',
    label: 'Automations',
    icon: Terminal,
    sections: [
      {
        title: 'Workflows',
        items: [
          { title: 'Smart Automations', desc: 'Configure background jobs', link: '/admin/settings/automations' }
        ]
      }
    ]
  },
  {
    id: 'app_settings',
    label: 'App Settings',
    icon: Server,
    sections: [
      {
        title: 'Modules',
        items: [
          { title: 'CRM', desc: 'Pipeline & Lead Settings', link: '/admin/settings/crm' },
          { title: 'Sales', desc: 'Quotations & Pricing', link: '/admin/settings/sales' },
          { title: 'Accounting', desc: 'Fiscal Years & Taxes', link: '/admin/settings/accounting' },
          { title: 'Inventory', desc: 'Warehouse & Routes', link: '/admin/settings/inventory' },
          { title: 'Manufacturing', desc: 'BOMs & MRP', link: '/admin/settings/manufacturing' },
          { title: 'Website', desc: 'SEO & eCommerce', link: '/admin/settings/website' }
        ]
      }
    ]
  },
  {
    id: 'integrations',
    label: 'Integrations',
    icon: LinkIcon,
    sections: [
      {
        title: 'Messaging',
        items: [
          { title: 'SMS (Twilio)', desc: 'Configure SMS provider credentials', link: '/admin/settings/integrations' },
          { title: 'WhatsApp', desc: 'Connect Meta WhatsApp Business API', link: '/admin/settings/integrations' },
        ]
      },
      {
        title: 'AI & Automation',
        items: [
          { title: 'AI Engine', desc: 'Configure LLM provider and token limits', link: '/admin/settings/integrations' },
        ]
      },
      {
        title: 'Email Marketing',
        items: [
          { title: 'Email Campaigns', desc: 'Configure SMTP or Mailchimp for mass mailings', link: '/admin/settings/integrations' },
        ]
      }
    ]
  },
  {
    id: 'translations',
    label: 'Translations',
    icon: Globe,
    sections: [
      {
        title: 'Languages',
        items: [
          { title: 'Languages', desc: 'Manage active languages', link: '/admin/settings/languages' },
          { title: 'Export', desc: 'Export translation files', link: '/admin/settings/translations-export' },
          { title: 'Import', desc: 'Import translations', link: '/admin/settings/translations-import' }
        ]
      }
    ]
  },
  {
    id: 'technical',
    label: 'Technical',
    icon: Code,
    sections: [
      {
        title: 'Automation',
        items: [
          { title: 'Scheduled Actions', desc: 'Manage cron jobs', link: '/admin/settings/scheduled-actions' },
          { title: 'Automated Actions', desc: 'Event-driven triggers', link: '/admin/settings/automated-actions' }
        ]
      },
      {
        title: 'System',
        items: [
          { title: 'Sequences', desc: 'Numbering sequences', link: '/admin/settings/sequences' },
          { title: 'Menu Sequences', desc: 'Drag-and-drop UI for reordering pillars and apps', link: '/admin/settings/menu-sequences' },
          { title: 'Webhooks', desc: 'Manage outgoing webhooks', link: '/admin/settings/webhooks' },
          { title: 'API Keys', desc: 'Generate programmatic access keys', link: '/admin/settings/api-keys' },
          { title: 'Audit Logs', desc: 'View system audit trails', link: '/admin/settings/logs' }
        ]
      }
    ]
  }
];

import { useManifest } from '@/core/hooks/useManifest';

const SettingsDashboard = () => {
  const [isDevMode, setIsDevMode] = useState(localStorage.getItem('bitguard_dev_mode') === 'true');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('general');
  const [stats, setStats] = useState(null);
  const { settingsAppEntries } = useManifest();

  const SETTINGS_CATEGORIES = useMemo(() => {
    let categories = getSettingsCategories(isDevMode).filter(c => c.id !== 'app_settings');
    
    if (settingsAppEntries && settingsAppEntries.length > 0) {
        categories.splice(4, 0, {
            id: 'app_settings',
            label: 'App Settings',
            icon: Server,
            sections: [{
                title: 'Installed Modules',
                items: settingsAppEntries
            }]
        });
    }
    
    return categories;
  }, [isDevMode, settingsAppEntries]);

  const toggleDevMode = () => {
    const newMode = !isDevMode;
    setIsDevMode(newMode);
    localStorage.setItem('bitguard_dev_mode', newMode ? 'true' : 'false');
    window.location.assign(window.location.pathname);
  };

  useEffect(() => {
      client.get('users/stats/').then(r => setStats(r.data)).catch(() => setStats({ total_users: 0, active_users: 0, mfa_adoption_pct: 0, admin_count: 0 }));
  }, []);

  // Filter settings based on search
  const filteredCategories = useMemo(() => {
    if (!searchQuery) return SETTINGS_CATEGORIES;
    const lowerQuery = searchQuery.toLowerCase();
    
    return SETTINGS_CATEGORIES.map(category => {
      const filteredSections = category.sections.map(section => {
        const filteredItems = section.items.filter(item => 
          item.title.toLowerCase().includes(lowerQuery) || 
          item.desc.toLowerCase().includes(lowerQuery) ||
          section.title.toLowerCase().includes(lowerQuery)
        );
        return { ...section, items: filteredItems };
      }).filter(section => section.items.length > 0);
      
      return { ...category, sections: filteredSections };
    }).filter(category => category.sections.length > 0);
  }, [searchQuery]);

  const displayCategory = searchQuery ? null : SETTINGS_CATEGORIES.find(c => c.id === activeCategory);

  return (
    <div className="p-8 max-w-[1400px] mx-auto animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight font-['Oswald'] uppercase mb-4">Settings</h1>
        
        {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-sm">
                    <div>
                        <div className="text-slate-400 text-sm">Total Users</div>
                        <div className="text-2xl font-bold text-white">{stats.total_users}</div>
                    </div>
                    <Users className="text-blue-500" size={24} />
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-sm">
                    <div>
                        <div className="text-slate-400 text-sm">Active Users</div>
                        <div className="text-2xl font-bold text-white">{stats.active_users}</div>
                    </div>
                    <Activity className="text-emerald-500" size={24} />
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-sm">
                    <div>
                        <div className="text-slate-400 text-sm">MFA Adoption</div>
                        <div className="text-2xl font-bold text-white">{stats.mfa_adoption_pct}%</div>
                    </div>
                    <Shield className="text-purple-500" size={24} />
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-sm">
                    <div>
                        <div className="text-slate-400 text-sm">Admin Count</div>
                        <div className="text-2xl font-bold text-white">{stats.admin_count}</div>
                    </div>
                    <Server className="text-amber-500" size={24} />
                </div>
            </div>
        )}

        <div className="relative max-w-2xl">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-xl leading-5 bg-slate-900/50 text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all shadow-sm"
            placeholder="Search settings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <nav className="space-y-1">
            {SETTINGS_CATEGORIES.map(category => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id && !searchQuery;
              return (
                <button
                  key={category.id}
                  onClick={() => {
                    setActiveCategory(category.id);
                    setSearchQuery('');
                  }}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${isActive ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
                >
                  <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  {category.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl shadow-sm min-h-[600px] overflow-hidden">
          {searchQuery ? (
            <div className="p-8">
              <h2 className="text-xl font-bold text-white mb-6">Search Results for "{searchQuery}"</h2>
              {filteredCategories.length === 0 ? (
                <div className="text-center text-slate-500 py-12">No settings found matching your search.</div>
              ) : (
                <div className="space-y-8">
                  {filteredCategories.map(category => (
                    <div key={category.id}>
                      <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center">
                        <category.icon className="w-5 h-5 mr-2" />
                        {category.label}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {category.sections.map(section => (
                          section.items.map(item => (
                            <Link key={item.link} to={item.link} className="block p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 hover:border-slate-600 transition-all group">
                              <h4 className="text-white font-medium text-sm flex items-center justify-between mb-1">
                                {item.title}
                                <ArrowRight className="w-4 h-4 text-slate-500 opacity-0 group-hover:opacity-100 group-hover:text-blue-400 transition-all -translate-x-2 group-hover:translate-x-0" />
                              </h4>
                              <p className="text-slate-400 text-xs">{item.desc}</p>
                              <div className="text-[10px] text-slate-500 mt-3 font-medium uppercase tracking-wider">{section.title}</div>
                            </Link>
                          ))
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            displayCategory && (
              <div className="p-8 animate-fade-in">
                <div className="flex items-center mb-8 border-b border-slate-800 pb-4">
                  <div className="p-3 bg-blue-500/10 rounded-xl mr-4">
                    <displayCategory.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{displayCategory.label}</h2>
                    <p className="text-slate-400 text-sm mt-1">Configure {displayCategory.label.toLowerCase()} preferences</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {displayCategory.sections.map((section, idx) => (
                    <div key={idx} className="bg-slate-950/30 rounded-xl p-5 border border-slate-800/50">
                      <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center">
                        {section.title}
                      </h3>
                      <div className="space-y-2">
                        {section.items.map(item => (
                          <Link key={item.link} to={item.link} className="flex items-start p-3 rounded-lg hover:bg-slate-800/50 transition-colors group">
                            <div className="flex-1">
                              <div className="text-white text-sm font-medium group-hover:text-blue-400 transition-colors">{item.title}</div>
                              <div className="text-slate-400 text-xs mt-0.5">{item.desc}</div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors mt-0.5" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      </div>

      <div className="mt-12 flex justify-center pb-8">
        <button
          onClick={toggleDevMode}
          className={`flex items-center gap-3 px-6 py-3 rounded-full border transition-all shadow-lg ${isDevMode ? 'bg-purple-900/30 border-purple-500/50 text-purple-300' : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700'}`}
        >
          <Terminal size={18} className={isDevMode ? 'text-purple-400' : ''} />
          <span className="text-sm font-bold tracking-wide">
            {isDevMode ? 'Deactivate Developer Mode' : 'Activate Developer Mode'}
          </span>
          {isDevMode ? <ToggleRight size={20} className="text-purple-400" /> : <ToggleLeft size={20} />}
        </button>
      </div>
    </div>
  );
};

export default SettingsDashboard;
