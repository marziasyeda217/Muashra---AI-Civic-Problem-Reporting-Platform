/**
 * Supabase Integration Service for MUASHRA
 */

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

let supabase = null;

if (supabaseUrl && supabaseKey && supabaseUrl.startsWith('http')) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Supabase Connected:', supabaseUrl);
  } catch (err) {
    console.warn('⚠️ Supabase connection initialization error:', err.message);
  }
} else {
  console.log('ℹ️ Supabase credentials not set in .env. Operating in Local Persistence Mode with fallback.');
}

async function syncComplaintToSupabase(complaint) {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('complaints')
      .upsert({
        id: complaint.id,
        title: complaint.title,
        description: complaint.descriptionRaw,
        formal_urdu: complaint.formalComplaintUrdu,
        formal_english: complaint.formalComplaintEnglish,
        category: complaint.category,
        department: complaint.department,
        status: complaint.status,
        urgency: complaint.urgency,
        upvotes: complaint.upvotes,
        city: complaint.location?.city,
        address: complaint.location?.address,
        latitude: complaint.location?.latitude,
        longitude: complaint.location?.longitude,
        image_url: complaint.imageUrl,
        user_id: complaint.userId || 'anonymous',
        citizen_name: complaint.citizenName || 'Verified Citizen',
        created_at: complaint.createdAt,
        updated_at: complaint.updatedAt
      });

    if (error) console.warn('Supabase Complaint Sync Notice:', error.message);
    return data;
  } catch (err) {
    return null;
  }
}

async function syncUserToSupabase(user) {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('users')
      .upsert({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || 'citizen',
        city: user.city || 'Lahore',
        department: user.department || '',
        phone: user.phone || '',
        created_at: user.createdAt || new Date().toISOString()
      });

    if (error) console.warn('Supabase User Sync Notice:', error.message);
    return data;
  } catch (err) {
    return null;
  }
}

async function fetchComplaintsFromSupabase() {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return null;
    return data.map(row => ({
      id: row.id,
      title: row.title,
      descriptionRaw: row.description,
      formalComplaintUrdu: row.formal_urdu,
      formalComplaintEnglish: row.formal_english,
      category: row.category,
      department: row.department,
      status: row.status,
      urgency: row.urgency,
      upvotes: row.upvotes || 1,
      location: {
        city: row.city || 'Pakistan',
        address: row.address || '',
        latitude: row.latitude ? parseFloat(row.latitude) : 24.8607,
        longitude: row.longitude ? parseFloat(row.longitude) : 67.0011
      },
      imageUrl: row.image_url,
      userId: row.user_id,
      citizenName: row.citizen_name || 'Verified Citizen',
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
  } catch (err) {
    return null;
  }
}

module.exports = {
  supabase,
  syncComplaintToSupabase,
  syncUserToSupabase,
  fetchComplaintsFromSupabase
};
