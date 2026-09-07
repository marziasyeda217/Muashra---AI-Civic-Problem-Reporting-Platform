import React, { useState, useEffect } from 'react';
import { ShieldCheck, PlusCircle, BarChart3, Globe, Building2, User, LogOut, Lock, Home, MapPin, Menu, X, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Header({ activeTab, setActiveTab, onOpenReport, onOpenAuth, isUrdu, setIsUrdu }) {
  const { user, logout } = useAuth();
  const [timeStr, setTimeStr] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isOfficer = user && user.role === 'officer';

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit', hour12: true }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleTabSelect = (tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-emerald-100 bg-white/95 backdrop-blur-md shadow-xs transition-all duration-300">
      
      {/* Top Banner */}
      <div className="bg-emerald-950 text-emerald-100 text-xs py-1 px-3 sm:py-1.5 sm:px-4 border-b border-emerald-900">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="flex h-2 w-2 relative flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold tracking-wide text-white text-[11px] sm:text-xs truncate">
              <span className="hidden sm:inline">MUASHRA CIVIC ENTERPRISE — </span>Public Grievance & Institutional Transparency Portal
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-mono text-emerald-300 flex-shrink-0 ml-2">
            <span>PST: {timeStr}</span>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div 
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group flex-shrink-0" 
            onClick={() => handleTabSelect('landing')}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-black text-lg sm:text-xl shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-all duration-300">
              م
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-lg sm:text-xl font-black tracking-tight text-emerald-950">MUASHRA</span>
                <span className="text-sm sm:text-base font-bold text-emerald-700 urdu-text">معاشرہ</span>
              </div>
              <span className="text-[9px] sm:text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider block -mt-1">
                Public Civic Engine
              </span>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-emerald-50/80 p-1.5 rounded-2xl border border-emerald-100">
            
            <button
              onClick={() => handleTabSelect('landing')}
              className={'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ' + (
                activeTab === 'landing'
                  ? 'bg-emerald-700 text-white shadow-sm font-black'
                  : 'text-emerald-900 hover:bg-emerald-100/70'
              )}
            >
              <Home className="w-4 h-4" />
              <span>{isUrdu ? 'ہوم' : 'Overview'}</span>
            </button>

            <button
              onClick={() => handleTabSelect('neighborhood')}
              className={'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ' + (
                activeTab === 'neighborhood'
                  ? 'bg-emerald-700 text-white shadow-sm font-black'
                  : 'text-emerald-900 hover:bg-emerald-100/70'
              )}
            >
              <MapPin className="w-4 h-4" />
              <span>{isUrdu ? 'علاقائی حب' : 'Neighborhood Hub'}</span>
            </button>

            <button
              onClick={() => handleTabSelect('trust')}
              className={'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ' + (
                activeTab === 'trust'
                  ? 'bg-emerald-700 text-white shadow-sm font-black'
                  : 'text-emerald-900 hover:bg-emerald-100/70'
              )}
            >
              <BarChart3 className="w-4 h-4" />
              <span>{isUrdu ? 'محکموں کے اسکور' : 'Department Stats'}</span>
            </button>

            <button
              onClick={() => {
                if (!isOfficer) {
                  alert('Officer Portal is restricted to authorized Government Officers.');
                } else {
                  handleTabSelect('portal');
                }
              }}
              className={'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ' + (
                activeTab === 'portal'
                  ? 'bg-emerald-700 text-white shadow-sm font-black'
                  : isOfficer
                    ? 'text-emerald-900 hover:bg-emerald-100/70'
                    : 'text-slate-400 hover:text-slate-600'
              )}
            >
              {isOfficer ? <Building2 className="w-4 h-4" /> : <Lock className="w-3.5 h-3.5 text-slate-400" />}
              <span>{isUrdu ? 'افسر پورٹل' : 'Officer Portal'}</span>
            </button>

          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            
            {/* Language Switcher */}
            <button
              onClick={() => setIsUrdu(!isUrdu)}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-xl border border-emerald-200 bg-white text-emerald-900 hover:bg-emerald-50 transition shadow-xs"
              title="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-700" />
              <span>{isUrdu ? 'English' : 'اردو'}</span>
            </button>

            {/* Desktop Auth Controls */}
            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-900 bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-200">
                  <User className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="max-w-[120px] truncate">{user.name}</span>
                  {user.role === 'officer' && (
                    <span className="ml-1 text-[9px] bg-emerald-700 text-white font-extrabold px-1.5 py-0.5 rounded-md uppercase">Officer</span>
                  )}
                </div>
                <button
                  onClick={logout}
                  className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-slate-600 hover:text-rose-600 transition border border-emerald-100"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={onOpenAuth}
                  className="px-3.5 py-2 text-xs font-bold rounded-xl text-emerald-900 hover:bg-emerald-50 transition"
                >
                  Sign In
                </button>
                <button
                  onClick={onOpenAuth}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-xs hover:scale-105"
                >
                  Register Now
                </button>
              </div>
            )}

            {/* File Complaint Button (Adaptive for Mobile) */}
            <button
              onClick={onOpenReport}
              className="flex items-center gap-1.5 px-3 sm:px-5 py-2 sm:py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-black text-xs shadow-md shadow-emerald-700/20 active:scale-[0.97] transition-all duration-200 flex-shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">{isUrdu ? 'مسئلہ درج کریں' : 'File Complaint'}</span>
              <span className="sm:hidden">{isUrdu ? 'درج کریں' : 'File'}</span>
            </button>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 transition"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-emerald-100 bg-white/98 backdrop-blur-xl px-4 py-4 space-y-3 shadow-xl animate-in slide-in-from-top-2 duration-200">
          
          {/* Mobile User Profile or Auth Buttons */}
          {user ? (
            <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold flex-shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black text-emerald-950 truncate">{user.name}</p>
                  <p className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">
                    {user.role === 'officer' ? `Verified Officer • ${user.department || ''}` : 'Citizen Account'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                className="px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition flex-shrink-0"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-1 pb-2 border-b border-emerald-100">
              <button
                onClick={() => { onOpenAuth(); setIsMobileMenuOpen(false); }}
                className="w-full py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 font-extrabold text-xs rounded-xl text-center transition"
              >
                Sign In
              </button>
              <button
                onClick={() => { onOpenAuth(); setIsMobileMenuOpen(false); }}
                className="w-full py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl text-center transition shadow-sm"
              >
                Register Now
              </button>
            </div>
          )}

          {/* Navigation Items */}
          <div className="space-y-1">
            <button
              onClick={() => handleTabSelect('landing')}
              className={'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ' + (
                activeTab === 'landing' ? 'bg-emerald-700 text-white font-black' : 'text-slate-700 hover:bg-emerald-50'
              )}
            >
              <div className="flex items-center gap-2.5">
                <Home className="w-4 h-4" />
                <span>{isUrdu ? 'ہوم' : 'Overview'}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => handleTabSelect('neighborhood')}
              className={'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ' + (
                activeTab === 'neighborhood' ? 'bg-emerald-700 text-white font-black' : 'text-slate-700 hover:bg-emerald-50'
              )}
            >
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4" />
                <span>{isUrdu ? 'علاقائی حب' : 'Neighborhood Hub'}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => handleTabSelect('trust')}
              className={'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ' + (
                activeTab === 'trust' ? 'bg-emerald-700 text-white font-black' : 'text-slate-700 hover:bg-emerald-50'
              )}
            >
              <div className="flex items-center gap-2.5">
                <BarChart3 className="w-4 h-4" />
                <span>{isUrdu ? 'محکموں کے اسکور' : 'Department Stats'}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => {
                if (!isOfficer) {
                  alert('Officer Portal is restricted to authorized Government Officers. Please register/sign in with your official officer credentials.');
                } else {
                  handleTabSelect('portal');
                }
              }}
              className={'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ' + (
                activeTab === 'portal'
                  ? 'bg-emerald-700 text-white font-black'
                  : isOfficer
                    ? 'text-slate-700 hover:bg-emerald-50'
                    : 'text-slate-400 hover:bg-slate-50'
              )}
            >
              <div className="flex items-center gap-2.5">
                {isOfficer ? <Building2 className="w-4 h-4 text-emerald-700" /> : <Lock className="w-4 h-4 text-slate-400" />}
                <span>{isUrdu ? 'افسر پورٹل' : 'Officer Portal'}</span>
              </div>
              {isOfficer ? (
                <span className="text-[9px] bg-emerald-700 text-white px-2 py-0.5 rounded font-black">ACCESS</span>
              ) : (
                <span className="text-[9px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-bold">LOCKED</span>
              )}
            </button>
          </div>

        </div>
      )}

    </header>
  );
}
