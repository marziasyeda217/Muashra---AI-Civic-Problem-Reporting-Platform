import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import PublicDashboard from './components/PublicDashboard';
import DepartmentStats from './components/DepartmentStats';
import ReportModal from './components/ReportModal';
import AuthModal from './components/AuthModal';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Camera, Mic, Shield, BarChart3, ArrowRight, ChevronDown, ChevronUp, HelpCircle, Leaf, Lock, ShieldCheck, Target, CheckCircle2, Globe, Users, HeartHandshake } from 'lucide-react';

const HERO_IMAGES = [
  {
    url: '/cleaning_crew.jpg',
    tag: 'MUNICIPAL SANITATION',
    title: 'Community Sanitation & Environmental Cleaning',
    subtitle: 'Active civic volunteers and municipal teams working together for clean neighborhoods.'
  },
  {
    url: '/electrician_work.jpg',
    tag: 'POWER & INFRASTRUCTURE',
    title: 'Power Infrastructure Maintenance & Safety',
    subtitle: 'Certified technicians rectifying electrical grid hazards and transformer issues.'
  },
  {
    url: '/pakistan_flag.jpg',
    tag: 'TRANSPARENT GOVERNANCE',
    title: 'National Civic Duty & Institutional Accountability',
    subtitle: 'Empowering citizens across Pakistan with digital transparency and SLA tracking.'
  }
];

const FAQS = [
  {
    q: 'How does voice reporting work in Urdu or Roman Urdu?',
    a: 'You can tap the microphone button in the report window and speak naturally in Urdu or Roman Urdu. Speech-to-text converts your audio into text, and the AI engine automatically structures it into a formal legal petition.'
  },
  {
    q: 'Which government departments are connected to MUASHRA?',
    a: 'MUASHRA routes complaints to WASA (Water & Sanitation Agency), Works & Services Department (C&W), Municipal Waste Management Companies (LWMC/SWMC), and Power Distribution Companies (LESCO, KE, DISCO).'
  },
  {
    q: 'What happens if a department does not resolve a complaint on time?',
    a: 'Every complaint has an auto-escalation Service Level Agreement (SLA) countdown (3 to 14 days). If unaddressed, the system automatically escalates the petition to the Provincial Secretary and District Commissioner level.'
  },
  {
    q: 'Do I need to sign up to submit a complaint?',
    a: 'Yes. To maintain public authenticity and prevent false reports, citizens must create a quick account or log in before submitting official grievance petitions.'
  },
  {
    q: 'Can I download an official stamped PDF of my complaint?',
    a: 'Yes! Every registered complaint has a "PDF Report" button. Clicking it instantly generates an official Pakistani government petition PDF complete with Reference Number, GPS location, and signature blocks.'
  }
];

function MainApp() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('landing'); // 'landing', 'neighborhood', 'trust', 'portal'
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUrdu, setIsUrdu] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [heroIndex, setHeroIndex] = useState(0);
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  const isOfficer = user && user.role === 'officer' && (user.isVerified === true || user.verificationStatus === 'verified');

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % HERO_IMAGES.length);
    }, 6500);
    return () => clearInterval(interval);
  }, []);

  const handleReportClick = () => {
    if (!user) {
      setIsAuthModalOpen(true);
    } else {
      setIsReportModalOpen(true);
    }
  };

  const handleComplaintSubmitted = () => {
    setRefreshTrigger(prev => prev + 1);
    setActiveTab('neighborhood');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-emerald-700 selection:text-white">
      
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReport={handleReportClick}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        isUrdu={isUrdu}
        setIsUrdu={setIsUrdu}
      />

      <main className="flex-1">
        
        {/* Landing Page: Clean information about the platform */}
        {activeTab === 'landing' && (
          <div>
            
            {/* Hero Banner Section */}
            <section className="py-12 border-b border-emerald-100 bg-gradient-to-b from-emerald-50/80 via-white to-slate-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl p-6 sm:p-10 border border-emerald-100 shadow-xl shadow-emerald-900/5">
                  
                  <div className="lg:col-span-7 space-y-6">
                    
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/90 text-emerald-950 text-xs font-black border border-emerald-300 shadow-xs animate-pulse">
                      <Leaf className="w-4 h-4 text-emerald-700" />
                      <span>MUASHRA CIVIC ENTERPRISE</span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl font-black text-slate-900 leading-tight tracking-tight">
                      Har Complaint Ki Awaaz,
                      <span className="text-emerald-800 block sm:inline"> Har Sarkari Idaray Ki Zimmedari</span>
                    </h1>

                    <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
                      Report civic issues in your area using just a photo or your voice.
                      Muashra turns your complaint into a formal report, routes it to the
                      right department, and tracks it until it is resolved.
                    </p>

                    <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                      <button
                        onClick={handleReportClick}
                        className="w-full sm:w-auto px-8 py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm rounded-2xl shadow-lg shadow-emerald-700/25 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl flex items-center justify-center gap-2.5"
                      >
                        <span>File a Complaint</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setActiveTab('neighborhood')}
                        className="w-full sm:w-auto px-7 py-4 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-900 border border-emerald-200 font-extrabold text-sm rounded-2xl transition-all duration-300 transform hover:-translate-y-0.5"
                      >
                        Neighborhood Issue Hub
                      </button>
                    </div>

                  </div>

                  {/* Hero Image Slider */}
                  <div className="lg:col-span-5 relative h-72 sm:h-84 rounded-3xl overflow-hidden border border-emerald-200 shadow-lg bg-slate-100 group">
                    {HERO_IMAGES.map((img, idx) => (
                      <div
                        key={img.url}
                        className={'absolute inset-0 transition-all duration-1000 ease-in-out ' + (idx === heroIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105')}
                      >
                        <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/85 via-emerald-950/20 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 right-4 text-white space-y-1 backdrop-blur-xs p-3.5 rounded-2xl bg-emerald-950/50 border border-white/10 shadow-lg">
                          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300 block">
                            {img.tag}
                          </span>
                          <p className="font-extrabold text-sm">{img.title}</p>
                          <p className="text-xs text-emerald-100 font-normal">{img.subtitle}</p>
                        </div>
                      </div>
                    ))}

                    <div className="absolute top-4 right-4 flex items-center gap-1.5 z-10 bg-emerald-950/60 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                      {HERO_IMAGES.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setHeroIndex(i)}
                          className={'h-2 rounded-full transition-all duration-300 ' + (i === heroIndex ? 'bg-emerald-400 w-6' : 'bg-white/60 w-2')}
                        />
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            </section>

            {/* Our Aim & Mission Section */}
            <section className="py-14 bg-white border-b border-slate-100">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                
                <div className="text-center space-y-3 max-w-3xl mx-auto">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black">
                    <Target className="w-4 h-4 text-emerald-700" />
                    <span>OUR GOALS & CIVIC MISSION</span>
                  </div>
                  <h2 className="text-3xl font-black text-slate-900">
                    Bridging Citizens & Government Infrastructure
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    MUASHRA (معاشرہ) was created to bridge the communication gap between citizens and Pakistani municipal authorities. By leveraging Urdu voice transcription and AI-driven petition formatting, every resident can hold public departments accountable.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  <div className="p-6 rounded-3xl border border-emerald-100 bg-emerald-50/30 space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                      <Mic className="w-6 h-6 text-emerald-700" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">Urdu Voice Access</h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      Speak freely in Urdu or Roman Urdu. Speech-to-text converts your voice into structured administrative English petitions automatically.
                    </p>
                  </div>

                  <div className="p-6 rounded-3xl border border-emerald-100 bg-emerald-50/30 space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                      <ShieldCheck className="w-6 h-6 text-emerald-700" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">Institutional Transparency</h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      Every complaint gets assigned a Service Level Agreement (SLA) countdown. Unaddressed issues automatically escalate to district officers.
                    </p>
                  </div>

                  <div className="p-6 rounded-3xl border border-emerald-100 bg-emerald-50/30 space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                      <HeartHandshake className="w-6 h-6 text-emerald-700" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">Neighborhood Voting</h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      Residents can search local issues in their neighborhood or city district and confirm (+1) problems to boost emergency repair priority.
                    </p>
                  </div>

                </div>

              </div>
            </section>

            {/* 4 Steps Section */}
            <section className="py-14 bg-slate-50 border-b border-slate-100">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="mb-10 text-center space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                    How MUASHRA Works in 4 Simple Steps
                  </h2>
                  <p className="text-sm text-slate-600 max-w-2xl mx-auto">
                    Designed for effortless civic participation without complex forms.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { icon: Camera, title: '1. Take a photo', description: 'Snap a picture of the broken road, street light, garbage dump, or water leak.' },
                    { icon: Mic, title: '2. Speak in Urdu', description: 'Record a short voice message describing the issue in Urdu or Roman Urdu.' },
                    { icon: Shield, title: '3. AI Formats Petition', description: 'AI formats the report into a formal petition for WASA, Works Dept, or DISCO.' },
                    { icon: BarChart3, title: '4. Track & Download PDF', description: 'Track progress online, download official stamped PDFs, and email agency heads.' }
                  ].map((step) => {
                    const Icon = step.icon;
                    return (
                      <div 
                        key={step.title} 
                        className="p-6 rounded-3xl border border-emerald-100 bg-white shadow-xs text-center space-y-3 hover:border-emerald-400 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 group"
                      >
                        <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center font-bold group-hover:scale-110 transition-transform duration-300">
                          <Icon className="w-7 h-7 text-emerald-700" />
                        </div>
                        <h3 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-800 transition-colors">{step.title}</h3>
                        <p className="text-xs text-slate-600 leading-relaxed font-normal">{step.description}</p>
                      </div>
                    );
                  })}
                </div>

              </div>
            </section>

            {/* FAQs Accordion */}
            <section className="py-14 bg-emerald-50/40 border-t border-emerald-100">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-extrabold">
                    <HelpCircle className="w-4 h-4 text-emerald-700" />
                    <span>Frequently Asked Questions</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                    Need Help Understanding MUASHRA?
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Everything you need to know about civic voice reporting and institutional routing.
                  </p>
                </div>

                <div className="space-y-3">
                  {FAQS.map((faq, idx) => {
                    const isOpen = openFaqIdx === idx;
                    return (
                      <div 
                        key={idx}
                        className="bg-white rounded-2xl border border-emerald-100 overflow-hidden shadow-xs transition-all duration-200 hover:border-emerald-300"
                      >
                        <button
                          onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                          className="w-full p-5 text-left flex items-center justify-between gap-4 font-extrabold text-slate-900 text-sm hover:text-emerald-800 transition"
                        >
                          <span>{faq.q}</span>
                          {isOpen ? <ChevronUp className="w-4 h-4 text-emerald-700 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />}
                        </button>

                        {isOpen && (
                          <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-emerald-50 pt-3 animate-in fade-in duration-200 font-medium">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

              </div>
            </section>

          </div>
        )}

        {/* Neighborhood Feed & Location Search (When on 'neighborhood' tab) */}
        {activeTab === 'neighborhood' && (
          <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-emerald-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  {isUrdu ? 'علاقائی عوامی شکایات حب' : 'Neighborhood Complaint Hub'}
                </h2>
                <p className="text-xs text-slate-500">
                  {isUrdu ? 'پورے پاکستان کے تمام اضلاع کے مسائل دیکھیں اور تائید (+1) کریں' : 'View active civic complaints across Pakistan districts or confirm (+1) problems.'}
                </p>
              </div>
              <button
                onClick={handleReportClick}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold rounded-xl shadow-xs transition cursor-pointer"
              >
                {isUrdu ? 'نئی شکایت درج کریں' : 'File New Complaint'}
              </button>
            </div>

            <PublicDashboard
              key={refreshTrigger}
              onOpenReport={handleReportClick}
              isUrdu={isUrdu}
            />
          </div>
        )}

        {activeTab === 'trust' && (
          <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <DepartmentStats isUrdu={isUrdu} />
          </div>
        )}

        {activeTab === 'portal' && (
          <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            {!isOfficer ? (
              <div className="bg-white rounded-3xl p-8 border border-emerald-100 shadow-md text-center max-w-xl mx-auto space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 mx-auto flex items-center justify-center font-bold">
                  <Lock className="w-7 h-7 text-amber-700" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-black text-slate-900">Officer Verification Required</h2>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    The Officer Administrative Hub is strictly restricted to verified Public Department Officers with institutional credentials and departmental authorization keys.
                  </p>
                </div>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-sm transition"
                >
                  Verify & Sign In as Government Officer
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Official Department Officer Credential Card */}
                <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-emerald-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-800/80 pb-5">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-800/80 border border-emerald-600 flex items-center justify-center font-black text-emerald-200 text-xl shadow-inner">
                        <ShieldCheck className="w-8 h-8 text-emerald-300" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-xl sm:text-2xl font-black text-white">{user.name}</h2>
                          <span className="bg-emerald-500 text-emerald-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                            Verified Officer
                          </span>
                        </div>
                        <p className="text-emerald-300 text-xs font-bold mt-0.5">
                          {user.designation || 'Executive Field Officer'} • {user.department}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-900/60 border border-emerald-700/60 px-4 py-2 rounded-2xl text-right">
                        <span className="text-[10px] uppercase font-bold text-emerald-300 block">Badge ID</span>
                        <span className="text-sm font-mono font-black text-white tracking-wider">{user.badgeId || 'GOV-PK-OFFICER'}</span>
                      </div>
                      <div className="bg-emerald-900/60 border border-emerald-700/60 px-4 py-2 rounded-2xl text-right">
                        <span className="text-[10px] uppercase font-bold text-emerald-300 block">Jurisdiction</span>
                        <span className="text-sm font-black text-white">{user.city || 'Regional'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-200/90 font-medium">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Authorized for Grievance Inspection, Field Crew Dispatch, and Statutory Status Resolution.</span>
                    </div>
                    <span className="text-[11px] text-emerald-400 font-mono bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-800">
                      Clearance: Tier-1 Administrative Authorization
                    </span>
                  </div>
                </div>

                <PublicDashboard
                  key={refreshTrigger + 100}
                  onOpenReport={handleReportClick}
                  isUrdu={isUrdu}
                />
              </div>
            )}
          </div>
        )}

      </main>

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onComplaintSubmitted={handleComplaintSubmitted}
        isUrdu={isUrdu}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        isUrdu={isUrdu}
      />

      <footer className="bg-emerald-950 text-emerald-200 border-t border-emerald-900 py-8 px-4 text-center text-xs space-y-2">
        <div className="flex items-center justify-center gap-2 font-bold">
          <span>MUASHRA CIVIC ENTERPRISE</span>
          <span>•</span>
          <span>MUASHRA (معاشرہ)</span>
        </div>
        <p className="text-emerald-400 text-[11px]">
          Empowering Pakistani citizens with AI-driven voice reporting, smart civic routing, and institutional transparency.
        </p>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
