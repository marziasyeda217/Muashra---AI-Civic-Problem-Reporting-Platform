import React, { useState } from 'react';
import { X, ShieldCheck, Mail, Lock, User, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function AuthModal({ isOpen, onClose, isUrdu }) {
  const { login, register, resendVerificationEmail } = useAuth();
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [role, setRole] = useState('citizen');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('Lahore');
  const [department, setDepartment] = useState('Sukkur Electric Power Company (SEPCO)');
  const [designation, setDesignation] = useState('Sub-Divisional Officer (SDO)');
  const [badgeId, setBadgeId] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);
  const [isUnconfirmed, setIsUnconfirmed] = useState(false);
  const [resendStatus, setResendStatus] = useState('');

  if (!isOpen) return null;

  const clearForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setBadgeId('');
    setSecurityCode('');
    setErrorMsg('');
    setSuccessMsg('');
    setIsUnconfirmed(false);
    setResendStatus('');
    setVerificationSent(false);
  };

  const handleModalClose = () => {
    clearForm();
    onClose();
  };

  const handleTabSwitch = (toLogin) => {
    setIsLoginTab(toLogin);
    clearForm();
  };

  const isConsumerEmail = (em) => {
    const lower = (em || '').toLowerCase();
    return ['@gmail.com', '@yahoo.com', '@hotmail.com', '@outlook.com', '@live.com', '@icloud.com'].some(d => lower.includes(d));
  };

  const handleResend = async () => {
    if (!email) return;
    setResendStatus('Resending verification email...');
    const res = await resendVerificationEmail(email);
    setResendStatus(res.message);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsUnconfirmed(false);
    setResendStatus('');

    if (!isLoginTab && role === 'officer') {
      if (isConsumerEmail(email)) {
        setErrorMsg('Personal consumer emails (@gmail, @yahoo) are prohibited for Government Officers. Please use your official departmental email address (e.g. @sepco.com.pk, @sindh.gov.pk, @sswmb.gos.pk).');
        return;
      }
      if (!badgeId.trim()) {
        setErrorMsg('Official Government Employee / Badge ID is required.');
        return;
      }
      if (!securityCode.trim()) {
        setErrorMsg('Department Authorization Passcode is required to verify your official authority.');
        return;
      }
    }

    setIsLoading(true);

    try {
      if (isLoginTab) {
        const res = await login(email, password);
        if (res.success) {
          setSuccessMsg(`✓ Sign In Successful! Welcome back, ${res.user?.name || 'Citizen'}.`);
          setTimeout(() => {
            clearForm();
            onClose();
          }, 900);
        } else {
          setErrorMsg(res.message || 'Invalid login credentials.');
          if (res.unconfirmed) {
            setIsUnconfirmed(true);
          }
        }
      } else {
        const res = await register({
          name,
          email,
          password,
          role,
          city,
          department: role === 'officer' ? department : '',
          designation: role === 'officer' ? designation : '',
          badgeId: role === 'officer' ? badgeId : '',
          securityCode: role === 'officer' ? securityCode : ''
        });
        if (res.success) {
          if (res.requiresConfirmation) {
            setVerificationSent(true);
          } else {
            setSuccessMsg(`✓ Registration Successful! Welcome, ${name}.`);
            setTimeout(() => {
              clearForm();
              onClose();
            }, 900);
          }
        } else {
          setErrorMsg(res.message || 'Registration failed.');
        }
      }
    } catch (err) {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-emerald-100 text-slate-900 overflow-hidden animate-in fade-in duration-200">
        
        <div className="p-5 border-b border-emerald-100 flex items-center justify-between bg-emerald-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-base font-extrabold text-emerald-950">
              {isLoginTab ? 'Account Sign In' : 'Create Account'}
            </h2>
          </div>
          <button onClick={handleModalClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex border-b border-emerald-100 bg-emerald-50/30 text-xs font-bold">
          <button
            type="button"
            onClick={() => handleTabSwitch(true)}
            className={'flex-1 py-3 text-center transition ' + (isLoginTab ? 'bg-white text-emerald-800 border-b-2 border-emerald-700 font-extrabold' : 'text-slate-500')}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch(false)}
            className={'flex-1 py-3 text-center transition ' + (!isLoginTab ? 'bg-white text-emerald-800 border-b-2 border-emerald-700 font-extrabold' : 'text-slate-500')}
          >
            Register
          </button>
        </div>

        {verificationSent ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
              <Mail className="w-7 h-7" />
            </div>
            <h3 className="text-base font-extrabold text-emerald-950">
              Check Your Email Inbox
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              A verification link has been sent to <span className="font-bold text-slate-800">{email}</span>.
            </p>
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 text-left text-xs text-emerald-900 space-y-1.5">
              <p className="font-bold text-emerald-950">To complete registration:</p>
              <ol className="list-decimal list-inside space-y-1 text-[11px] text-emerald-800 font-medium">
                <li>Open your email inbox (also check Spam/Junk folder).</li>
                <li>Click the <strong>Confirm your mail</strong> link.</li>
                <li>Return here and Sign In to access your portal.</li>
              </ol>
            </div>
            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => { setVerificationSent(false); setIsLoginTab(true); setErrorMsg(''); }}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow transition"
              >
                Proceed to Sign In
              </button>
              <button
                type="button"
                onClick={handleResend}
                className="text-xs text-emerald-700 font-bold hover:underline py-1"
              >
                Didn't receive the email? Click to resend
              </button>
              {resendStatus && (
                <p className="text-[11px] text-emerald-800 font-semibold">{resendStatus}</p>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
            
            {successMsg && (
              <div className="p-3.5 bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs rounded-xl flex items-center gap-2.5 font-bold shadow-xs animate-in fade-in">
                <ShieldCheck className="w-4 h-4 flex-shrink-0 text-emerald-700" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2 font-semibold">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {isUnconfirmed && (
              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-xl space-y-2">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>Email Verification Pending</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Supabase requires you to click the link sent to your email address before your first login.
                </p>
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-xs bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold px-3 py-1.5 rounded-lg transition"
                >
                  Resend Verification Email
                </button>
                {resendStatus && <p className="text-[11px] font-bold text-emerald-700 mt-1">{resendStatus}</p>}
              </div>
            )}

            {!isLoginTab && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Account Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('citizen')}
                  className={'py-2 text-xs font-bold rounded-xl border transition ' + (role === 'citizen' ? 'bg-emerald-100 border-emerald-300 text-emerald-900 font-extrabold' : 'bg-slate-50 border-slate-200 text-slate-600')}
                >
                  Citizen
                </button>
                <button
                  type="button"
                  onClick={() => setRole('officer')}
                  className={'py-2 text-xs font-bold rounded-xl border transition ' + (role === 'officer' ? 'bg-emerald-100 border-emerald-300 text-emerald-900 font-extrabold' : 'bg-slate-50 border-slate-200 text-slate-600')}
                >
                  Government Officer
                </button>
              </div>
            </div>
          )}

          {!isLoginTab && role === 'officer' && (
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1 text-xs">
              <span className="font-extrabold text-emerald-950 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                Institutional Officer Verification Protocol
              </span>
              <p className="text-[11px] text-emerald-800 leading-relaxed font-medium">
                To prevent impersonation, officer registration requires official department credentials, organizational employee badge ID, and agency authorization key.
              </p>
            </div>
          )}

          {!isLoginTab && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder={role === 'officer' ? 'e.g. Engr. Noman Ali' : 'Your Full Name'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-emerald-100 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {!isLoginTab && role === 'officer' ? 'Official Departmental Email' : 'Email Address'}
            </label>
            <input
              type="email"
              required
              placeholder={!isLoginTab && role === 'officer' ? 'name@sepco.com.pk (No @gmail)' : 'email@domain.com'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-emerald-100 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium"
            />
            {!isLoginTab && role === 'officer' && isConsumerEmail(email) && (
              <p className="text-[10px] text-rose-600 font-bold mt-1">
                ⚠️ Consumer email detected. Please use your official departmental email (e.g. @sepco.com.pk, @sindh.gov.pk).
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-emerald-100 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium"
            />
          </div>

          {!isLoginTab && role === 'officer' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Government Department / Public Authority</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-slate-50 border border-emerald-100 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium"
                >
                  <option value="Sukkur Electric Power Company (SEPCO)">Sukkur Electric Power Company (SEPCO - Sindh)</option>
                  <option value="K-Electric (KE)">K-Electric (KE - Karachi)</option>
                  <option value="Sindh Solid Waste Management Board (SSWMB)">Sindh Solid Waste Management Board (SSWMB)</option>
                  <option value="Works & Services Department, Government of Sindh">Works & Services Department, Government of Sindh</option>
                  <option value="Public Health Engineering Department (Sindh PHE)">Public Health Engineering Department (Sindh PHE)</option>
                  <option value="Water & Sanitation Agency (WASA)">Water & Sanitation Agency (WASA Punjab)</option>
                  <option value="Lahore Development Authority (LDA)">Lahore Development Authority (LDA)</option>
                  <option value="Lahore Waste Management Company (LWMC)">Lahore Waste Management Company (LWMC)</option>
                  <option value="Lahore Electric Supply Company (LESCO)">Lahore Electric Supply Company (LESCO)</option>
                  <option value="Islamabad Electric Supply Company (IESCO)">Islamabad Electric Supply Company (IESCO)</option>
                  <option value="Capital Development Authority (CDA)">Capital Development Authority (CDA - Islamabad)</option>
                  <option value="Peshawar Electric Supply Company (PESCO)">Peshawar Electric Supply Company (PESCO - KP)</option>
                  <option value="District Administration & DC Secretariat">District Administration & DC Secretariat</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Official Designation</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SDO / XEN"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full bg-slate-50 border border-emerald-100 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Employee / Badge ID</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SEPCO-4091"
                    value={badgeId}
                    onChange={(e) => setBadgeId(e.target.value)}
                    className="w-full bg-slate-50 border border-emerald-100 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium uppercase font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">Department Authorization Passcode</label>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    Key: GOV-OFFICER-PK
                  </span>
                </div>
                <input
                  type="password"
                  required
                  placeholder="Enter Department Authorization Key"
                  value={securityCode}
                  onChange={(e) => setSecurityCode(e.target.value)}
                  className="w-full bg-slate-50 border border-emerald-100 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium font-mono"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Official authorization code issued by departmental administration (use <span className="font-bold text-emerald-800">GOV-OFFICER-PK</span> or <span className="font-bold text-emerald-800">SEPCO-GOV-2026</span> for demo verification).
                </p>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            <span>{isLoginTab ? 'Sign In' : (role === 'officer' ? 'Verify & Register Officer' : 'Register Account')}</span>
          </button>

        </form>
        )}

      </div>
    </div>
  );
}
