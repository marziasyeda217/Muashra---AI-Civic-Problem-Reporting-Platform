import React, { useState, useEffect } from 'react';
import { ShieldCheck, RefreshCw, Building2, Phone, Mail, Globe } from 'lucide-react';
import { fetchDepartments } from '../services/api';

export default function DepartmentStats({ isUrdu }) {
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await fetchDepartments();
      if (res.success) setDepartments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-800 bg-emerald-50 border-emerald-200';
    if (score >= 65) return 'text-emerald-700 bg-emerald-50/80 border-emerald-200';
    if (score >= 50) return 'text-amber-800 bg-amber-50 border-amber-200';
    return 'text-rose-800 bg-rose-50 border-rose-200';
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden border border-emerald-900">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-bold border border-emerald-700">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Public Accountability & Institutional SLA Matrix</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {isUrdu ? 'سرکاری اداروں کا ٹرسٹ اسکور اور کارکردگی' : 'Department Trust Scores & SLA Leaderboard'}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200 leading-relaxed font-normal">
            {isUrdu
              ? 'ہر ادارے کی درجہ بندی ان کی شکایات کو حل کرنے کی رفتار اور عوامی تصدیق کی بنیاد پر کی جاتی ہے۔'
              : 'Government departments are scored publicly based on turnaround speed, resolution rate, and verified citizen feedback.'}
          </p>
        </div>

        <button
          onClick={loadData}
          className="absolute top-6 right-6 p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition flex items-center gap-1.5 text-xs font-bold backdrop-blur"
        >
          <RefreshCw className={'w-3.5 h-3.5 ' + (isLoading ? 'animate-spin' : '')} />
          <span className="hidden sm:inline">Refresh Matrix</span>
        </button>
      </div>

      {/* Department Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {departments.map((dept, index) => (
          <div
            key={dept.name}
            className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-100 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all duration-200 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-emerald-50 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-sm flex-shrink-0">
                  #{index + 1}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">{dept.name}</h3>
                  {dept.nameUrdu && (
                    <span className="text-xs text-emerald-800 urdu-text font-bold block mt-0.5">{dept.nameUrdu}</span>
                  )}
                </div>
              </div>

              <div className={'self-start sm:self-auto text-center px-3 py-1.5 rounded-xl border flex-shrink-0 ' + getScoreColor(dept.trustScore)}>
                <span className="text-[10px] font-extrabold block uppercase tracking-wider">Trust Score</span>
                <span className="text-xl font-black">{dept.trustScore}</span>
                <span className="text-[10px] font-bold block">{dept.ratingGrade} Grade</span>
              </div>
            </div>

            {/* Resolution Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-600">
                <span>Resolution Rate</span>
                <span className="text-emerald-700">{dept.total > 0 ? Math.round((dept.resolved / dept.total) * 100) : 0}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                <div
                  style={{ width: (dept.total > 0 ? (dept.resolved / dept.total) * 100 : 0) + '%' }}
                  className="bg-emerald-600 h-full"
                />
                <div
                  style={{ width: (dept.total > 0 ? (dept.inProgress / dept.total) * 100 : 0) + '%' }}
                  className="bg-amber-500 h-full"
                />
              </div>
            </div>

            {/* Counts Grid */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-500 font-bold block">Total</span>
                <span className="text-sm font-black text-slate-900">{dept.total}</span>
              </div>
              <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                <span className="text-[11px] text-emerald-700 font-bold block">Resolved</span>
                <span className="text-sm font-black text-emerald-800">{dept.resolved}</span>
              </div>
              <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-100">
                <span className="text-[11px] text-amber-700 font-bold block">Active</span>
                <span className="text-sm font-black text-amber-800">{dept.pending + dept.inProgress}</span>
              </div>
            </div>

            {/* Official Contact Info */}
            <div className="pt-2 border-t border-emerald-50 text-[11px] text-slate-500 space-y-1 flex flex-wrap items-center justify-between">
              <div className="flex items-center gap-1.5 font-medium">
                <Mail className="w-3.5 h-3.5 text-emerald-700" />
                <span>{dept.email || 'complaints@gov.pk'}</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Phone className="w-3.5 h-3.5 text-emerald-700" />
                <span>Helpline: {dept.helpline || '1099'}</span>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
