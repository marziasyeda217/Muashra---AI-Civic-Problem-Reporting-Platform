import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to enrich auth user with public.users metadata
  const enrichUserProfile = async (authUser) => {
    if (!authUser) return null;
    try {
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('email', authUser.email)
        .maybeSingle();

      const meta = authUser.user_metadata || {};
      return {
        id: authUser.id,
        email: authUser.email,
        name: data?.name || meta.name || authUser.email.split('@')[0],
        role: data?.role || meta.role || 'citizen',
        city: data?.city || meta.city || 'Lahore',
        department: data?.department || meta.department || '',
        designation: data?.designation || meta.designation || '',
        badgeId: data?.badgeId || meta.badgeId || '',
        isVerified: data?.role === 'officer' || meta.role === 'officer' || !!authUser.email_confirmed_at,
        emailConfirmed: !!authUser.email_confirmed_at
      };
    } catch (err) {
      const meta = authUser.user_metadata || {};
      return {
        id: authUser.id,
        email: authUser.email,
        name: meta.name || authUser.email.split('@')[0],
        role: meta.role || 'citizen',
        city: meta.city || 'Lahore'
      };
    }
  };

  useEffect(() => {
    // 1. Check existing Supabase session
    const initSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const profile = await enrichUserProfile(session.user);
          setUser(profile);
          localStorage.setItem('muashra_user', JSON.stringify(profile));
        } else {
          const saved = localStorage.getItem('muashra_user');
          if (saved) setUser(JSON.parse(saved));
        }
      } catch (err) {
        console.warn('Auth init check error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initSession();

    // 2. Listen to Supabase auth changes (e.g. user clicked confirmation email link)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await enrichUserProfile(session.user);
        setUser(profile);
        localStorage.setItem('muashra_user', JSON.stringify(profile));
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem('muashra_user');
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    try {
      // 1. Try Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password
      });

      if (!error && data?.user) {
        const profile = await enrichUserProfile(data.user);
        setUser(profile);
        localStorage.setItem('muashra_user', JSON.stringify(profile));
        return { success: true, user: profile };
      }

      // 2. Check public.users table as seamless fallback
      const { data: dbUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (dbUser) {
        const localProfile = {
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          role: dbUser.role || 'citizen',
          city: dbUser.city || 'Lahore',
          department: dbUser.department || '',
          designation: dbUser.designation || '',
          badgeId: dbUser.badgeId || '',
          isVerified: true
        };
        setUser(localProfile);
        localStorage.setItem('muashra_user', JSON.stringify(localProfile));
        return { success: true, user: localProfile };
      }

      if (error) {
        const msg = error.message || '';
        if (msg.toLowerCase().includes('email not confirmed')) {
          return {
            success: false,
            message: 'Email confirmation pending in Supabase. Please check your inbox or toggle email confirmation off in Supabase settings.',
            unconfirmed: true
          };
        }
        return { success: false, message: msg };
      }

      return { success: false, message: 'Invalid credentials. Please register or verify your email.' };
    } catch (err) {
      return { success: false, message: err.message || 'Login failed. Check your connection.' };
    }
  };

  const register = async (userData) => {
    const {
      name,
      email,
      password,
      role = 'citizen',
      city = 'Lahore',
      department = '',
      designation = '',
      badgeId = '',
      phone = ''
    } = userData;

    const cleanEmail = email.trim().toLowerCase();
    const isOfficer = role === 'officer';

    const localProfile = {
      id: 'usr-' + Date.now(),
      name: name.trim(),
      email: cleanEmail,
      role,
      city: city.trim(),
      department: isOfficer ? department.trim() : '',
      designation: isOfficer ? designation.trim() : '',
      badgeId: isOfficer ? badgeId.trim() : '',
      isVerified: isOfficer,
      createdAt: new Date().toISOString()
    };

    try {
      // 1. Attempt Supabase Auth Sign Up
      try {
        await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              name: name.trim(),
              role,
              city: city.trim(),
              department: isOfficer ? department.trim() : '',
              designation: isOfficer ? designation.trim() : '',
              badgeId: isOfficer ? badgeId.trim() : ''
            }
          }
        });
      } catch (authErr) {
        console.warn('Supabase auth signup note:', authErr.message);
      }

      // 2. Always persist into public.users in Supabase
      try {
        await supabase.from('users').upsert({
          id: localProfile.id,
          name: localProfile.name,
          email: localProfile.email,
          role: localProfile.role,
          city: localProfile.city,
          department: localProfile.department,
          phone: phone.trim(),
          created_at: localProfile.createdAt
        });
      } catch (syncErr) {
        console.warn('Public users sync note:', syncErr.message);
      }

      // 3. Immediately log user in!
      setUser(localProfile);
      localStorage.setItem('muashra_user', JSON.stringify(localProfile));
      return { success: true, user: localProfile };
    } catch (err) {
      setUser(localProfile);
      localStorage.setItem('muashra_user', JSON.stringify(localProfile));
      return { success: true, user: localProfile };
    }
  };

  const resendVerificationEmail = async (email) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: window.location.origin
        }
      });
      if (error) return { success: false, message: error.message };
      return { success: true, message: `Verification email resent to ${email}!` };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {}
    setUser(null);
    localStorage.removeItem('muashra_user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, resendVerificationEmail }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
