import React, { useState, useEffect } from 'react';
import { Search, Filter, CheckCircle2, Clock, AlertCircle, ThumbsUp, Layers, PlusCircle, MapPin, UserCheck, ShieldCheck } from 'lucide-react';
import ComplaintCard from './ComplaintCard';
import { fetchComplaints, fetchStats, upvoteComplaint, updateComplaintStatus } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { PAKISTAN_DISTRICTS } from './MapPicker';

const CATEGORIES = [
  'all',
  'Roads & Infrastructure',
  'Water & Sanitation',
  'Waste Management',
  'Electricity & Power'
];

export default function PublicDashboard({ onOpenReport, isUrdu, mode = 'full', initialMyOnly = false }) {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0, totalUpvotes: 0 });
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [showMyOnly, setShowMyOnly] = useState(initialMyOnly);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (initialMyOnly) setShowMyOnly(true);
  }, [initialMyOnly]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      let myLocalIds = [];
      try {
        myLocalIds = JSON.parse(localStorage.getItem('muashra_my_complaints') || '[]');
      } catch (e) {}
      const guestId = localStorage.getItem('muashra_guest_id');

      const [compRes, statsRes] = await Promise.all([
        fetchComplaints({
          status: selectedStatus,
          category: selectedCategory,
          search: searchQuery,
          userId: showMyOnly ? (user ? user.id : guestId) : undefined,
          citizenName: showMyOnly && user ? user.name : undefined,
          myComplaintIds: showMyOnly ? (myLocalIds.length > 0 ? myLocalIds.join(',') : (user ? undefined : 'NONE')) : undefined,
          city: !showMyOnly && selectedCity !== 'all' ? selectedCity : undefined
        }),
        fetchStats()
      ]);

      if (compRes.success) {
        let filtered = compRes.data;
        if (!showMyOnly && selectedCity && selectedCity !== 'all') {
          filtered = filtered.filter(c => c.location?.city?.toLowerCase() === selectedCity.toLowerCase());
        }
        setComplaints(filtered);
      }
      if (statsRes.success) setStats(statsRes.data);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedStatus, selectedCategory, selectedCity, showMyOnly, searchQuery, user]);

  const handleUpvote = async (id) => {
    try {
      const res = await upvoteComplaint(id);
      if (res.success) {
        setComplaints(prev => prev.map(c => (c.id === id ? { ...c, upvotes: res.upvotes } : c)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (id, payload) => {
    try {
      const res = await updateComplaintStatus(id, payload);
      if (res.success) {
        setComplaints(prev => prev.map(c => (c.id === id ? res.data : c)));
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Search & Location Filter Controls */}
      <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-xs space-y-4">
        
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          
          {/* Location & Keyword Search Input */}
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={isUrdu ? 'علاقہ یا مسئلہ تلاش کریں...' : 'Search neighborhood, street, or ticket...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-emerald-100 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium"
            />
          </div>

          {/* District / City Location Selector & My Complaints */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
            <div className="flex items-center gap-1.5 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100 text-xs font-bold text-emerald-900 flex-1 sm:flex-initial">
              <MapPin className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
              <span className="whitespace-nowrap">Location:</span>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-transparent font-extrabold text-emerald-950 focus:outline-none cursor-pointer w-full text-xs"
              >
                <option value="all">All Cities & Districts</option>
                {PAKISTAN_DISTRICTS.map((dist) => (
                  <option key={dist} value={dist}>{dist}</option>
                ))}
              </select>
            </div>

            {/* My Complaints Only Toggle */}
            <button
              type="button"
              onClick={() => setShowMyOnly(!showMyOnly)}
              className={'flex items-center justify-center gap-1.5 px-3.5 py-2.5 sm:py-2 rounded-xl text-xs font-extrabold transition border whitespace-nowrap cursor-pointer shadow-xs flex-1 sm:flex-initial ' + (
                showMyOnly
                  ? 'bg-emerald-700 text-white border-emerald-700 ring-2 ring-emerald-400/50'
                  : 'bg-emerald-50/80 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
              )}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'میری شکایات' : 'My Complaints'}</span>
              {showMyOnly && (
                <span className="bg-white text-emerald-800 text-[10px] px-1.5 py-0.5 rounded-full font-black">
                  Active
                </span>
              )}
            </button>
          </div>

        </div>

        {/* Status & Category Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-emerald-50 text-xs">
          
          {/* Status Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 bg-emerald-50/60 p-1 rounded-xl border border-emerald-100">
            {['all', 'pending', 'in_progress', 'resolved'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={'px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all duration-200 whitespace-nowrap flex-shrink-0 ' + (
                  selectedStatus === st
                    ? 'bg-white text-emerald-900 shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                {st === 'all' ? (isUrdu ? 'تمام' : 'All') : st.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px] whitespace-nowrap flex items-center gap-1 flex-shrink-0">
              <Filter className="w-3 h-3 text-emerald-700" /> Category:
            </span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={'px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all whitespace-nowrap flex-shrink-0 ' + (
                  selectedCategory === cat
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                )}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* Active My Complaints Filter Indicator Banner */}
      {showMyOnly && (
        <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-3.5 px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-emerald-950 font-bold shadow-xs">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              {user
                ? (isUrdu ? `رجسٹرڈ شہری ${user.name} کی شکایات دکھائی جا رہی ہیں (${complaints.length} موصول)` : `Showing complaints filed by registered citizen: ${user.name} (${complaints.length} found)`)
                : (isUrdu ? `اس ڈیوائس سے جمع کروائی گئی شکایات (${complaints.length} موصول)` : `Showing complaints filed on this device (${complaints.length} found)`)}
            </span>
          </div>
          <button
            onClick={() => setShowMyOnly(false)}
            className="text-emerald-700 hover:text-emerald-900 hover:underline text-xs font-extrabold cursor-pointer"
          >
            {isUrdu ? 'تمام عوامی مسائل دیکھیں' : 'View All Public Issues'}
          </button>
        </div>
      )}

      {/* Complaints Grid */}
      {complaints.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {complaints.map((comp) => (
            <ComplaintCard
              key={comp.id}
              complaint={comp}
              onUpvote={handleUpvote}
              onUpdateStatus={handleUpdateStatus}
              isUrdu={isUrdu}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-emerald-100 p-10 text-center space-y-3">
          <p className="text-sm font-bold text-slate-800">
            {showMyOnly
              ? (user ? `No complaints registered under ${user.name} yet.` : 'You have not submitted any complaints yet.')
              : 'No issues found for the selected location or filters.'}
          </p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {showMyOnly
              ? 'Any complaints you submit will automatically be registered under your name and appear here.'
              : 'Select another district or submit a new report for your neighborhood.'}
          </p>
          <button
            onClick={onOpenReport}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-md transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>File New Issue Report</span>
          </button>
        </div>
      )}

    </div>
  );
}
