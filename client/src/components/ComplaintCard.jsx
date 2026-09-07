import React, { useState } from 'react';
import { ThumbsUp, MapPin, Calendar, Building2, Download, Mail, ChevronDown, ChevronUp, Check, ShieldCheck, Share2, UserCheck } from 'lucide-react';
import { generateComplaintPDF } from '../utils/pdfGenerator';
import { useAuth } from '../contexts/AuthContext';

export default function ComplaintCard({ complaint, onUpvote, onUpdateStatus, isUrdu }) {
  const { user } = useAuth();
  const [showOriginalInput, setShowOriginalInput] = useState(false);
  const [copied, setCopied] = useState(false);

  // One-time Confirmation Check per citizen device
  const [hasConfirmed, setHasConfirmed] = useState(() => {
    try {
      const list = JSON.parse(localStorage.getItem('muashra_confirmed_complaints') || '[]');
      return list.includes(complaint.id);
    } catch (e) {
      return false;
    }
  });

  const handleConfirmClick = () => {
    if (hasConfirmed) return;
    try {
      const list = JSON.parse(localStorage.getItem('muashra_confirmed_complaints') || '[]');
      if (!list.includes(complaint.id)) {
        list.push(complaint.id);
        localStorage.setItem('muashra_confirmed_complaints', JSON.stringify(list));
      }
    } catch (e) {}
    setHasConfirmed(true);
    onUpvote(complaint.id);
  };

  // Check if current logged in user is an authenticated & verified Government Officer
  const isOfficer = user && user.role === 'officer' && (user.isVerified === true || user.verificationStatus === 'verified');

  const getStatusBadge = (status) => {
    const st = (status || '').toLowerCase();
    if (st === 'resolved') {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800 border border-emerald-300 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
          Resolved
        </span>
      );
    }
    if (st.includes('progress')) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-900 border border-amber-300 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
          In Progress
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-extrabold text-slate-700 border border-slate-200">
        Pending Review
      </span>
    );
  };

  const getFormalTitle = (comp) => {
    let t = comp.title || '';
    t = t.replace(/^(?:PROMPT|Prompt|System Prompt|User Prompt|Instruction|Instructions):?\s*/gi, '');
    t = t.replace(/\bPROMPT\b[:\s-]*/gi, '');
    if (!t.trim() || t.toLowerCase().includes('you are muashra') || t.toLowerCase().includes('generate a') || t.length > 80) {
      const cat = comp.category || 'Municipal Services';
      if (cat.toLowerCase().includes('water')) return 'Urgent Notice: Ruptured Water Main & Supply Contamination';
      if (cat.toLowerCase().includes('elect')) return 'Public Electrocution Hazard & Dangling Cable Notice';
      if (cat.toLowerCase().includes('waste')) return 'Severe Municipal Solid Waste Accumulation & Health Hazard';
      if (cat.toLowerCase().includes('road')) return 'Hazardous Potholes and Major Roadway Degradation Notice';
      return `Official Citizen Grievance: ${cat}`;
    }
    return t.trim();
  };

  const getCleanStatement = (comp) => {
    let text = comp.formalComplaintEnglish || comp.descriptionRaw || '';
    text = text.replace(/^(?:PROMPT|Prompt|System Prompt|User Prompt|Instruction|Instructions):?\s*/gi, '');
    text = text.replace(/\bPROMPT\b[:\s-]*/gi, '');
    if (text.toLowerCase().includes('you are muashra') || text.toLowerCase().includes('generate a highly') || text.length < 5) {
      return `Official administrative petition submitted for immediate civic inspection and departmental rectification under ${comp.department || 'Public Municipal Authority'}.`;
    }
    return text.trim();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recently';
    return new Date(dateStr).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + '/#' + complaint.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEmailDepartment = () => {
    const rawCity = (complaint.location?.city || 'Pakistan').trim();
    const cityLower = rawCity.toLowerCase();
    const cleanCitySlug = cityLower.replace(/[^a-z0-9]/g, '');
    let fallbackEmail = `commissioner@${cleanCitySlug || 'district'}.gov.pk`;
    if (cityLower.includes('khairpur') || cityLower.includes('sukkur')) {
      fallbackEmail = 'commissioner@sukkur.gov.pk';
    } else if (cityLower.includes('larkana')) {
      fallbackEmail = 'commissioner@larkana.gov.pk';
    } else if (cityLower.includes('karachi')) {
      fallbackEmail = 'commissioner@karachi.gov.pk';
    } else if (cityLower.includes('hyderabad')) {
      fallbackEmail = 'commissioner@hyderabad.gov.pk';
    } else if (cityLower.includes('peshawar')) {
      fallbackEmail = 'commissioner@peshawar.gov.pk';
    } else if (cityLower.includes('quetta')) {
      fallbackEmail = 'commissioner@quetta.gob.pk';
    } else if (cityLower.includes('islamabad')) {
      fallbackEmail = 'dc@ict.gov.pk';
    }

    const email = complaint.departmentEmail || fallbackEmail;
    const subject = encodeURIComponent('OFFICIAL CITIZEN GRIEVANCE: ' + getFormalTitle(complaint));
    const body = encodeURIComponent(getCleanStatement(complaint));
    window.open('mailto:' + email + '?subject=' + subject + '&body=' + body, '_blank');
  };

  return (
    <div className="bg-white rounded-3xl border border-emerald-100/80 p-6 shadow-xs hover:shadow-xl hover:border-emerald-400 transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between group">
      
      <div className="space-y-4">
        
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 border-b border-emerald-50 pb-3">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100/90 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-900 border border-emerald-300 shadow-xs">
                Official Citizen Grievance
              </span>
              {getStatusBadge(complaint.status)}
              <span className="text-xs font-bold font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                #{complaint.id}
              </span>
            </div>
            <h3 className="mt-1 text-base font-extrabold text-slate-900 group-hover:text-emerald-800 transition-colors leading-snug">
              {getFormalTitle(complaint)}
            </h3>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <span className="inline-block rounded-xl bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-900 border border-emerald-200">
              {complaint.category || 'Municipal'}
            </span>
            <button onClick={handleShare} className="text-slate-400 hover:text-emerald-700 transition" title="Share link">
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Citizen Attribution Row */}
        <div className="flex items-center justify-between text-xs bg-emerald-50/70 px-3.5 py-2 rounded-2xl border border-emerald-200/70">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="text-slate-600 font-semibold">Reported by Citizen:</span>
            <span className="font-extrabold text-emerald-950">{complaint.citizenName || 'Verified Citizen'}</span>
          </div>
          {complaint.citizenName && complaint.citizenName !== 'Verified Citizen' && (
            <span className="bg-emerald-700 text-white text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
              Verified User
            </span>
          )}
        </div>

        {/* User Image ONLY if provided */}
        {complaint.imageUrl && (
          <div className="rounded-2xl overflow-hidden aspect-video bg-slate-100 border border-emerald-100 shadow-xs">
            <img src={complaint.imageUrl} alt="Evidence" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
        )}

        {/* Formal Administrative Petition */}
        <div className="bg-emerald-50/40 p-4 rounded-2xl border border-emerald-100/80 text-xs text-slate-700 space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block">
            Administrative Petition Statement:
          </span>
          <p className="line-clamp-3 leading-relaxed font-medium">
            {getCleanStatement(complaint)}
          </p>
        </div>

        {/* Location & Date */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 pt-1">
          <div className="flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700">
              <MapPin className="h-3.5 w-3.5 text-emerald-700" />
              {complaint.location?.address || 'District Area'}, {complaint.location?.city || 'Pakistan'}
            </span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-500">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              {formatDate(complaint.createdAt)}
            </span>
          </div>
          <div className="font-extrabold text-emerald-900 flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>{complaint.department}</span>
          </div>
        </div>

        {/* Collapsible Original Citizen Voice */}
        <div className="border-t border-slate-100 pt-3">
          <button
            type="button"
            onClick={() => setShowOriginalInput(!showOriginalInput)}
            className="flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-emerald-800 transition"
          >
            <span>{showOriginalInput ? 'Hide Original Citizen Voice' : 'View Original Citizen Voice'}</span>
            {showOriginalInput ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {showOriginalInput && (
            <div className="mt-2 p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200/80 text-xs text-slate-800 space-y-1.5 animate-in fade-in duration-200">
              <p className="italic">"{complaint.descriptionRaw}"</p>
              {complaint.formalComplaintUrdu && (
                <div className="pt-2 border-t border-amber-200/60 text-right urdu-text text-amber-950 font-bold">
                  {complaint.formalComplaintUrdu}
                </div>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Action Footer Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 mt-4 border-t border-emerald-50">
        
        {/* Citizen Action Buttons (Everyone can upvote, download PDF, email department) */}
        <div className="flex flex-wrap items-center gap-2">
          {hasConfirmed ? (
            <button
              disabled
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 text-white rounded-xl text-xs font-black border border-emerald-700 shadow-xs cursor-default"
              title="You have already confirmed this issue"
            >
              <Check className="w-3.5 h-3.5 text-emerald-200" />
              <span>Confirmed ({complaint.upvotes || 0})</span>
            </button>
          ) : (
            <button
              onClick={handleConfirmClick}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold border border-emerald-200 shadow-xs transition hover:scale-105 active:scale-95 cursor-pointer"
              title="Confirm this civic issue"
            >
              <ThumbsUp className="w-3.5 h-3.5 text-emerald-700" />
              <span>Confirm ({complaint.upvotes || 0})</span>
            </button>
          )}

          <button
            onClick={() => generateComplaintPDF(complaint)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold border border-emerald-200 shadow-xs transition hover:scale-105 active:scale-95"
            title="Download Stamped PDF"
          >
            <Download className="w-3.5 h-3.5 text-emerald-700" />
            <span>PDF Report</span>
          </button>

          <button
            onClick={handleEmailDepartment}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold border border-emerald-200 shadow-xs transition hover:scale-105 active:scale-95"
            title="Email Department"
          >
            <Mail className="w-3.5 h-3.5 text-emerald-700" />
            <span>Email Agency</span>
          </button>
        </div>

        {/* Officer ONLY Action Controls (Strict RBAC: Only visible to verified officers!) */}
        {isOfficer && onUpdateStatus && complaint.status !== 'resolved' && (
          <div className="flex items-center gap-2 bg-emerald-50/80 p-1.5 rounded-2xl border border-emerald-200">
            <span className="text-[10px] font-black text-emerald-900 px-2 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-700" /> Officer Controls:
            </span>
            {complaint.status === 'pending' && (
              <button
                onClick={() => onUpdateStatus(complaint.id, { status: 'in_progress', note: 'Dispatch approved.', officerEmail: user?.email })}
                className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-extrabold shadow-xs transition"
              >
                In Progress
              </button>
            )}
            <button
              onClick={() => onUpdateStatus(complaint.id, { status: 'resolved', note: 'Resolved on site.', officerEmail: user?.email })}
              className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-extrabold shadow-xs transition"
            >
              Resolve Issue
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
