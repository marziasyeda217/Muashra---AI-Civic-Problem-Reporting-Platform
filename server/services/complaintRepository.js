const fs = require('fs');
const path = require('path');
const { syncComplaintToSupabase, fetchComplaintsFromSupabase } = require('./supabaseService');

const LEGACY_DATA_FILE = path.join(__dirname, '../data/complaints.json');

function readComplaintsLocal() {
  try {
    if (!fs.existsSync(LEGACY_DATA_FILE)) return [];
    const data = fs.readFileSync(LEGACY_DATA_FILE, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    return [];
  }
}

function writeComplaintsLocal(data) {
  try {
    fs.writeFileSync(LEGACY_DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving complaints file:', err);
  }
}

async function initializeComplaintRepository() {
  console.log('✅ Complaint Repository initialized with Supabase & Persistence support.');
}

async function getComplaints() {
  const localList = readComplaintsLocal();
  const localMap = new Map(localList.map(c => [c.id, c]));

  const supabaseData = await fetchComplaintsFromSupabase();
  if (supabaseData && supabaseData.length > 0) {
    return supabaseData.map(c => {
      const local = localMap.get(c.id);
      if (local) {
        return {
          ...local,
          ...c,
          timeline: local.timeline || c.timeline,
          departmentEmail: local.departmentEmail || c.departmentEmail,
          departmentHelpline: local.departmentHelpline || c.departmentHelpline,
          departmentHeadOffice: local.departmentHeadOffice || c.departmentHeadOffice,
          departmentPortalUrl: local.departmentPortalUrl || c.departmentPortalUrl,
          assignedOfficer: local.assignedOfficer || c.assignedOfficer
        };
      }
      return c;
    });
  }
  return localList;
}

async function getComplaintById(id) {
  const list = await getComplaints();
  return list.find(c => c.id === id) || null;
}

async function insertComplaint(complaint) {
  const list = readComplaintsLocal();
  list.unshift(complaint);
  writeComplaintsLocal(list);

  syncComplaintToSupabase(complaint);
  return complaint;
}

async function saveComplaint(complaint) {
  const list = readComplaintsLocal();
  const index = list.findIndex(c => c.id === complaint.id);
  if (index !== -1) {
    list[index] = complaint;
    writeComplaintsLocal(list);
    syncComplaintToSupabase(complaint);
  }
  return complaint;
}

async function incrementComplaintUpvotes(id, updatedAt) {
  const list = readComplaintsLocal();
  const complaint = list.find(c => c.id === id);
  if (complaint) {
    complaint.upvotes = (complaint.upvotes || 0) + 1;
    complaint.updatedAt = updatedAt || new Date().toISOString();
    writeComplaintsLocal(list);
    syncComplaintToSupabase(complaint);
  }
  return complaint;
}

async function updateComplaintStatus(id, { status, note, assignedOfficer, resolvedImageUrl }) {
  const list = readComplaintsLocal();
  const complaint = list.find(c => c.id === id);
  if (!complaint) return null;

  const now = new Date().toISOString();
  if (status) complaint.status = status;
  if (assignedOfficer) complaint.assignedOfficer = assignedOfficer;
  if (resolvedImageUrl) complaint.resolvedImageUrl = resolvedImageUrl;
  if (status === 'resolved' && note) complaint.resolutionNotes = note;

  complaint.updatedAt = now;
  if (!complaint.timeline) complaint.timeline = [];
  complaint.timeline.push({
    status: status || complaint.status,
    time: now,
    note: note || ('Status updated to ' + status)
  });

  writeComplaintsLocal(list);
  syncComplaintToSupabase(complaint);
  return complaint;
}

module.exports = {
  getComplaints,
  getComplaintById,
  incrementComplaintUpvotes,
  initializeComplaintRepository,
  insertComplaint,
  saveComplaint,
  updateComplaintStatus
};
