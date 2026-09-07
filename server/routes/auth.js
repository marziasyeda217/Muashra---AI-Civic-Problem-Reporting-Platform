const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { syncUserToSupabase } = require('../services/supabaseService');

const USERS_FILE = path.join(__dirname, '../data/users.json');

function readUsers() {
  try {
    if (!fs.existsSync(USERS_FILE)) return [];
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    return [];
  }
}

function writeUsers(data) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing users file:', err);
  }
}

// List of recognized government and utility domains
const DISALLOWED_CONSUMER_DOMAINS = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'live.com', 'icloud.com', 'aol.com', 'mail.com', 'zoho.com', 'yandex.com', 'proton.me', 'protonmail.com'
];

// Department Authorization Security Passcodes
const VALID_DEPARTMENT_CODES = {
  'Sukkur Electric Power Company (SEPCO)': ['SEPCO-GOV-2026', 'GOV-OFFICER-PK'],
  'K-Electric (KE)': ['KE-GOV-2026', 'GOV-OFFICER-PK'],
  'Sindh Solid Waste Management Board (SSWMB)': ['SSWMB-GOV-2026', 'GOV-OFFICER-PK'],
  'Works & Services Department, Government of Sindh': ['CWD-SINDH-2026', 'GOV-OFFICER-PK'],
  'Public Health Engineering Department (Sindh PHE)': ['PHE-SINDH-2026', 'GOV-OFFICER-PK'],
  'Water & Sanitation Agency (WASA)': ['WASA-GOV-2026', 'GOV-OFFICER-PK'],
  'Lahore Development Authority (LDA)': ['LDA-GOV-2026', 'GOV-OFFICER-PK'],
  'Lahore Waste Management Company (LWMC)': ['LWMC-GOV-2026', 'GOV-OFFICER-PK'],
  'Lahore Electric Supply Company (LESCO)': ['LESCO-GOV-2026', 'GOV-OFFICER-PK'],
  'Islamabad Electric Supply Company (IESCO)': ['IESCO-GOV-2026', 'GOV-OFFICER-PK'],
  'Capital Development Authority (CDA)': ['CDA-GOV-2026', 'GOV-OFFICER-PK'],
  'Peshawar Electric Supply Company (PESCO)': ['PESCO-GOV-2026', 'GOV-OFFICER-PK'],
  'District Administration & DC Secretariat': ['ADMIN-GOV-2026', 'GOV-OFFICER-PK']
};

/**
 * POST /api/auth/register
 */
router.post('/register', (req, res) => {
  const {
    name,
    email,
    password,
    role = 'citizen',
    city = 'Lahore',
    department = '',
    designation = '',
    badgeId = '',
    securityCode = '',
    phone = ''
  } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const domain = cleanEmail.split('@')[1] || '';

  // Strict validation for Government Officers
  if (role === 'officer') {
    if (!department || !department.trim()) {
      return res.status(400).json({ success: false, message: 'Government department selection is required for official registration.' });
    }

    if (!designation || !designation.trim()) {
      return res.status(400).json({ success: false, message: 'Official designation is required (e.g. SDO, XEN, Sanitation Officer).' });
    }

    if (!badgeId || !badgeId.trim()) {
      return res.status(400).json({ success: false, message: 'Official Government Employee ID / Badge Number is required.' });
    }

    // Reject consumer email domains
    if (DISALLOWED_CONSUMER_DOMAINS.includes(domain)) {
      return res.status(400).json({
        success: false,
        message: `Consumer email (@${domain}) is not permitted for Government Officers. Please use your official departmental email (e.g. @sepco.com.pk, @sindh.gov.pk, @sswmb.gos.pk, @gov.pk).`
      });
    }

    // Verify Department Security Passcode
    const validCodes = VALID_DEPARTMENT_CODES[department.trim()] || ['GOV-OFFICER-PK'];
    const submittedCode = (securityCode || '').trim().toUpperCase();

    if (!submittedCode || (!validCodes.includes(submittedCode) && submittedCode !== 'GOV-OFFICER-PK')) {
      return res.status(403).json({
        success: false,
        message: 'Invalid Department Authorization Passcode. Contact your agency head or use departmental access token (e.g. GOV-OFFICER-PK).'
      });
    }
  }

  const users = readUsers();
  const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
  }

  const isOfficer = role === 'officer';

  const newUser = {
    id: 'usr-' + Math.floor(1000 + Math.random() * 9000),
    name: name.trim(),
    email: cleanEmail,
    password,
    role: isOfficer ? 'officer' : 'citizen',
    city: city.trim(),
    department: isOfficer ? department.trim() : '',
    designation: isOfficer ? designation.trim() : null,
    badgeId: isOfficer ? badgeId.trim().toUpperCase() : null,
    isVerified: isOfficer ? true : false,
    verificationStatus: isOfficer ? 'verified' : 'unverified',
    verifiedAt: isOfficer ? new Date().toISOString() : null,
    phone: phone.trim(),
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  writeUsers(users);

  // Sync to Supabase users table
  syncUserToSupabase(newUser);

  const { password: _, ...userSafe } = newUser;
  res.status(201).json({
    success: true,
    message: isOfficer
      ? `Official account verified and registered successfully for ${department}!`
      : 'Account created successfully!',
    user: userSafe
  });
});

/**
 * POST /api/auth/login
 */
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  const users = readUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  const { password: _, ...userSafe } = user;
  res.json({
    success: true,
    message: 'Logged in successfully!',
    user: userSafe
  });
});

/**
 * GET /api/auth/me
 */
router.get('/me', (req, res) => {
  const email = req.headers['x-user-email'];
  if (!email) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }

  const users = readUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const { password: _, ...userSafe } = user;
  res.json({ success: true, user: userSafe });
});

module.exports = router;
