import React, { useState } from 'react';
import { X, Send, Image as ImageIcon, AlertCircle, CheckCircle2, Loader2, Upload, Download, Mail } from 'lucide-react';
import VoiceRecorder from './VoiceRecorder';
import MapPicker from './MapPicker';
import { previewAIAnalysis, submitComplaint } from '../services/api';
import { generateComplaintPDF } from '../utils/pdfGenerator';
import { useAuth } from '../contexts/AuthContext';

export default function ReportModal({ isOpen, onClose, onComplaintSubmitted, isUrdu }) {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [location, setLocation] = useState({
    city: 'Lahore',
    address: 'Main Town Area',
    latitude: 31.5204,
    longitude: 74.3587
  });

  const [aiPreview, setAiPreview] = useState(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [submittedComplaint, setSubmittedComplaint] = useState(null);
  const [feedback, setFeedback] = useState(null);

  if (!isOpen) return null;

  const handleLiveAIPreview = async () => {
    if (!text.trim()) {
      alert('Please record voice or type a description first.');
      return;
    }
    setIsPreviewLoading(true);
    try {
      const res = await previewAIAnalysis(text, location.city);
      if (res.success) {
        setAiPreview(res.aiResult);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      alert('Please provide a description or voice recording.');
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const formData = new FormData();
      formData.append('text', text);
      formData.append('city', location.city);
      formData.append('address', location.address);
      formData.append('latitude', location.latitude);
      formData.append('longitude', location.longitude);
      
      if (user) {
        formData.append('userId', user.id);
        formData.append('citizenName', user.name);
      } else {
        let guestId = localStorage.getItem('muashra_guest_id');
        if (!guestId) {
          guestId = 'guest_' + Math.random().toString(36).substring(2, 9);
          localStorage.setItem('muashra_guest_id', guestId);
        }
        formData.append('userId', guestId);
        formData.append('citizenName', 'Citizen Reporter');
      }

      if (imageFile) {
        formData.append('image', imageFile);
      }

      const res = await submitComplaint(formData);

      if (res.success) {
        const item = res.data || res.complaint || {};
        try {
          const myComplaints = JSON.parse(localStorage.getItem('muashra_my_complaints') || '[]');
          if (item.id && !myComplaints.includes(item.id)) {
            myComplaints.unshift(item.id);
            localStorage.setItem('muashra_my_complaints', JSON.stringify(myComplaints));
          }
        } catch (e) {}

        setSubmittedComplaint(item);
        setFeedback({
          type: res.isDuplicate ? 'duplicate' : 'success',
          message: res.message || 'Grievance lodged successfully!',
          data: item
        });
        onComplaintSubmitted();
      } else {
        setFeedback({
          type: 'error',
          message: res.message || 'Failed to submit complaint. Please try again.'
        });
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: 'Failed to submit complaint. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailDepartment = () => {
    if (!submittedComplaint) return;
    const cleanCity = (submittedComplaint.location?.city || 'lahore').toLowerCase().replace(/[^a-z0-9]/g, '');
    const fallbackEmail = `commissioner@${cleanCity}.gov.pk`;
    const email = submittedComplaint.departmentEmail || fallbackEmail;
    const subject = encodeURIComponent('OFFICIAL CITIZEN GRIEVANCE: ' + submittedComplaint.title);
    const body = encodeURIComponent(submittedComplaint.formalComplaintEnglish || submittedComplaint.descriptionRaw);
    window.open('mailto:' + email + '?subject=' + subject + '&body=' + body, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-emerald-100 text-slate-900 animate-in fade-in duration-200">
        
        <div className="sticky top-0 bg-white/95 backdrop-blur z-10 p-5 border-b border-emerald-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-emerald-950">
              {isUrdu ? 'نئی عوامی شکایت درج کریں' : 'Submit Official Civic Complaint'}
            </h2>
            <p className="text-xs text-slate-500">
              Record voice in Urdu or type description. AI formats into an administrative petition.
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedComplaint ? (
          <div className="p-6 space-y-6 text-center">
            
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center font-bold">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900">Complaint Registered Successfully!</h3>
              <p className="text-xs text-slate-600 font-semibold max-w-md mx-auto">
                Tracking Ticket: <span className="font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">#{submittedComplaint.id}</span>
              </p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Target Department: <strong className="text-slate-800">{submittedComplaint.department}</strong>
              </p>
            </div>

            <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-100 text-left text-xs space-y-2">
              <p className="font-bold text-emerald-950">Administrative Petition Title:</p>
              <p className="text-slate-700 font-medium">{submittedComplaint.title}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-3">
              <p className="font-bold text-slate-800">Choose Next Action:</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => generateComplaintPDF(submittedComplaint)}
                  className="py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-xl shadow-xs transition flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Stamped PDF</span>
                </button>

                <button
                  type="button"
                  onClick={handleEmailDepartment}
                  className="py-3 px-4 bg-white hover:bg-slate-100 text-emerald-900 border border-emerald-200 font-extrabold rounded-xl transition flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4 text-emerald-700" />
                  <span>Email Agency Head</span>
                </button>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition"
            >
              Done & Return to Feed
            </button>

          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-5">
            
            {feedback && (
              <div className={'p-4 rounded-xl border text-xs font-semibold flex items-center gap-3 ' + (
                feedback.type === 'duplicate' 
                  ? 'bg-amber-50 border-amber-200 text-amber-900' 
                  : feedback.type === 'success' 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                    : 'bg-rose-50 border-rose-200 text-rose-900'
              )}>
                {feedback.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0" />}
                {feedback.type === 'duplicate' && <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />}
                <span>{feedback.message}</span>
              </div>
            )}

            {/* Voice & Text Input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                1. Voice or Text Description (اردو میں بتائیں)
              </label>
              
              <VoiceRecorder
                onTranscriptChange={(val) => setText(val)}
                currentText={text}
                isUrdu={isUrdu}
              />

              <textarea
                rows={3}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type description or edit voice transcript here in Urdu or English..."
                className="w-full bg-slate-50 border border-emerald-100 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium"
              />
            </div>

            {/* Photo Upload */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                2. Upload Photo Evidence (Optional)
              </label>

              <label className="cursor-pointer bg-emerald-50/50 hover:bg-emerald-50 border border-dashed border-emerald-200 rounded-xl p-3 text-center text-xs font-bold text-emerald-900 transition flex items-center justify-center gap-2">
                <Upload className="w-4 h-4 text-emerald-700" />
                <span>{imageFile ? ('Selected: ' + imageFile.name) : 'Choose Image File'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setImageFile(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />
              </label>
            </div>

            {/* Map Picker with Live GPS */}
            <div>
              <MapPicker
                location={location}
                setLocation={setLocation}
                isUrdu={isUrdu}
              />
            </div>

            {/* AI Formal Petition Preview */}
            <div className="p-4 bg-emerald-50/60 border border-emerald-100 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-950">
                  AI Petition Structuring Preview
                </span>
                <button
                  type="button"
                  onClick={handleLiveAIPreview}
                  disabled={isPreviewLoading}
                  className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition shadow-xs"
                >
                  {isPreviewLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Generate Preview'}
                </button>
              </div>

              {aiPreview && (
                <div className="pt-2 text-xs space-y-1 text-slate-700 border-t border-emerald-100">
                  <p className="font-bold text-slate-900">Subject: {aiPreview.title}</p>
                  <p className="text-emerald-800 font-bold">Target Agency: {aiPreview.department}</p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Submit Official Complaint</span>
            </button>

          </form>
        )}

      </div>
    </div>
  );
}
