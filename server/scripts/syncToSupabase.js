const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../.env') });
const { syncComplaintToSupabase, syncUserToSupabase } = require('../services/supabaseService');
(async () => {
  const complaints = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/complaints.json'), 'utf8') || '[]');
  const users = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/users.json'), 'utf8') || '[]');
  console.log('Syncing ' + complaints.length + ' complaints and ' + users.length + ' users to Supabase...');
  for (const c of complaints) { await syncComplaintToSupabase(c); }
  for (const u of users) { await syncUserToSupabase(u); }
  console.log('Finished sync attempt.');
})();
