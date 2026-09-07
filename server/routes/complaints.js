const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const { processCivicComplaint, transcribeAudioWithWhisper } = require('../services/qwenService');
const { findDuplicateComplaint, calculateDistanceMeters } = require('../services/duplicateService');
const {
  getComplaintById,
  getComplaints,
  incrementComplaintUpvotes,
  insertComplaint,
  saveComplaint,
  updateComplaintStatus
} = require('../services/complaintRepository');

const UPLOADS_DIR = path.join(__dirname, '../uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) || (file.fieldname === 'audio' ? '.webm' : '.jpg');
    cb(null, file.fieldname + '-' + Date.now() + ext);
  }
});
const upload = multer({ storage: storage, limits: { fileSize: 25 * 1024 * 1024 } });

/**
 * POST /api/complaints/transcribe-audio
 */
router.post('/transcribe-audio', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Audio file is required' });
    }

    const audioPath = req.file.path;
    const text = await transcribeAudioWithWhisper(audioPath);

    fs.unlink(audioPath, () => {});
    res.json({ success: true, text });
  } catch (error) {
    console.error('Transcription error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/complaints/similar
 * Returns nearby active complaints that match category or text relevance
 */
router.get('/similar', async (req, res) => {
  try {
    const { category, latitude, longitude, search } = req.query;
    const list = (await getComplaints()).filter(c => c.status !== 'resolved');

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const hasSearchLocation = Number.isFinite(lat) && Number.isFinite(lng);

    const matches = list.map(c => {
      let score = 0;
      let distance = null;

      if (category && c.category?.toLowerCase() === category.toLowerCase()) {
        score += 50;
      }

      if (hasSearchLocation && c.location?.latitude && c.location?.longitude) {
        distance = Math.round(calculateDistanceMeters(lat, lng, c.location.latitude, c.location.longitude));
        if (distance <= 500) score += 40;
        else if (distance <= 1500) score += 20;
      }

      if (search && c.descriptionRaw && c.descriptionRaw.toLowerCase().includes(search.toLowerCase())) {
        score += 30;
      }

      return {
        ...c,
        similarityScore: score,
        distanceMeters: distance
      };
    })
      .filter(item => item.similarityScore >= 40 && (item.distanceMeters === null || item.distanceMeters <= 1500))
      .sort((a, b) => b.similarityScore - a.similarityScore);

    res.json({ success: true, count: matches.length, data: matches.slice(0, 4) });
  } catch (error) {
    console.error('Error finding similar complaints:', error);
    res.status(500).json({ success: false, message: 'Unable to find similar complaints' });
  }
});

/**
 * GET /api/complaints
 */
router.get('/', async (req, res) => {
  try {
    let list = await getComplaints();
    const { status, category, department, search, userId, citizenName, myComplaintIds, city } = req.query;

    if (city && city !== 'all') {
      list = list.filter(item => item.location?.city?.toLowerCase() === city.toLowerCase());
    }
    if (status && status !== 'all') {
      list = list.filter(item => item.status === status);
    }
    if (category && category !== 'all') {
      list = list.filter(item => item.category === category);
    }
    if (department && department !== 'all') {
      list = list.filter(item => item.department?.toLowerCase().includes(department.toLowerCase()));
    }
    
    // Support filtering by userId, citizenName, and/or comma-separated list of complaint IDs (My Complaints)
    const idList = myComplaintIds ? myComplaintIds.split(',').map(s => s.trim()).filter(Boolean) : [];
    if (userId || citizenName || idList.length > 0) {
      list = list.filter(item => {
        const matchUser = userId && (item.userId === userId || (item.additionalUserIds && item.additionalUserIds.includes(userId)));
        const matchName = citizenName && item.citizenName && item.citizenName.toLowerCase().trim() === citizenName.toLowerCase().trim();
        const matchId = idList.includes(item.id);
        return matchUser || matchName || matchId;
      });
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(item =>
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.formalComplaintEnglish && item.formalComplaintEnglish.toLowerCase().includes(q)) ||
        (item.descriptionRaw && item.descriptionRaw.toLowerCase().includes(q)) ||
        (item.location?.address && item.location.address.toLowerCase().includes(q)) ||
        (item.location?.city && item.location.city.toLowerCase().includes(q)) ||
        (item.id && item.id.toLowerCase().includes(q))
      );
    }

    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ success: false, message: 'Unable to fetch complaints' });
  }
});

/**
 * GET /api/complaints/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const complaint = await getComplaintById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }
    res.json({ success: true, data: complaint });
  } catch (error) {
    console.error('Error fetching complaint:', error);
    res.status(500).json({ success: false, message: 'Unable to fetch complaint' });
  }
});

/**
 * POST /api/complaints/preview-ai
 */
router.post('/preview-ai', async (req, res) => {
  try {
    const { text, city } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Text or voice input is required' });
    }

    const aiResult = await processCivicComplaint({ text, city });
    res.json({ success: true, aiResult });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/complaints
 */
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { text, address, city, latitude, longitude, customImageUrl, userId, citizenName } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Complaint description or voice recording is required.' });
    }

    const aiAnalysis = await processCivicComplaint({ text, city: city || 'Lahore', citizenName });

    let imageUrl = customImageUrl || null;
    if (req.file) {
      imageUrl = '/uploads/' + req.file.filename;
    }

    const targetCity = city || 'Lahore';
    const cleanCitySlug = targetCity.toLowerCase().replace(/[^a-z0-9]/g, '');
    const defaultEmail = targetCity.toLowerCase().includes('khairpur') || targetCity.toLowerCase().includes('sukkur')
      ? 'commissioner@sukkur.gov.pk'
      : `commissioner@${cleanCitySlug}.gov.pk`;

    const now = new Date();
    const deadline = new Date(now.getTime() + (aiAnalysis.estimatedDays || 7) * 24 * 60 * 60 * 1000);
    const newComplaint = {
      id: `CMP-${uuidv4().split('-')[0].toUpperCase()}`,
      title: aiAnalysis.title || 'Official Civic Infrastructure Complaint',
      incidentSummaryFormal: aiAnalysis.incidentSummaryFormal || null,
      descriptionRaw: text,
      formalComplaintUrdu: aiAnalysis.formalComplaintUrdu,
      formalComplaintEnglish: aiAnalysis.formalComplaintEnglish,
      category: aiAnalysis.category,
      department: aiAnalysis.department,
      departmentUrdu: aiAnalysis.departmentUrdu,
      departmentEmail: aiAnalysis.departmentEmail || defaultEmail,
      departmentSecondaryEmail: aiAnalysis.departmentSecondaryEmail || null,
      departmentHelpline: aiAnalysis.departmentHelpline || '1099',
      departmentHeadOffice: aiAnalysis.departmentHeadOffice || `Civic Administrative Center, ${targetCity}`,
      departmentPortalUrl: aiAnalysis.departmentPortalUrl || `https://${cleanCitySlug}.gov.pk`,
      userId: userId || 'anonymous',
      citizenName: citizenName || 'Verified Citizen',
      location: {
        address: address || `Main Road / Civic Area, ${targetCity}`,
        city: targetCity,
        latitude: latitude ? parseFloat(latitude) : 31.5204,
        longitude: longitude ? parseFloat(longitude) : 74.3587
      },
      imageUrl,
      status: 'pending',
      urgency: aiAnalysis.urgency || 'medium',
      upvotes: 1,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      escalationDeadline: deadline.toISOString(),
      escalated: false,
      assignedOfficer: 'Pending Technical Allocation',
      timeline: [
        {
          status: 'pending',
          time: now.toISOString(),
          note: 'Official petition structured by AI and routed to ' + aiAnalysis.department
        }
      ]
    };

    const list = await getComplaints();
    const dupCheck = findDuplicateComplaint(newComplaint, list);

    if (dupCheck.isDuplicate) {
      dupCheck.matchedComplaint.upvotes = (dupCheck.matchedComplaint.upvotes || 1) + 1;
      dupCheck.matchedComplaint.updatedAt = now.toISOString();
      dupCheck.matchedComplaint.timeline.push({
        status: dupCheck.matchedComplaint.status,
        time: now.toISOString(),
        note: 'Additional citizen verified & reported: "' + text.substring(0, 60) + '..." (Auto-merged by AI)'
      });

      // Attribute to user if original was anonymous or attach to user's registered list
      if (!dupCheck.matchedComplaint.userId || dupCheck.matchedComplaint.userId === 'anonymous') {
        if (userId) dupCheck.matchedComplaint.userId = userId;
        if (citizenName) dupCheck.matchedComplaint.citizenName = citizenName;
      }
      if (!dupCheck.matchedComplaint.additionalUserIds) {
        dupCheck.matchedComplaint.additionalUserIds = [];
      }
      if (userId && !dupCheck.matchedComplaint.additionalUserIds.includes(userId)) {
        dupCheck.matchedComplaint.additionalUserIds.push(userId);
      }

      await saveComplaint(dupCheck.matchedComplaint);

      return res.status(200).json({
        success: true,
        isDuplicate: true,
        message: 'A matching issue was already active in your area! Your report has been merged and its priority boosted.',
        data: dupCheck.matchedComplaint
      });
    }

    await insertComplaint(newComplaint);
    res.status(201).json({
      success: true,
      isDuplicate: false,
      message: 'Formal complaint successfully registered and dispatched to department!',
      data: newComplaint
    });
  } catch (error) {
    console.error('Error creating complaint:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/complaints/:id/upvote
 */
router.post('/:id/upvote', async (req, res) => {
  try {
    const complaint = await incrementComplaintUpvotes(req.params.id, new Date().toISOString());
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    res.json({ success: true, upvotes: complaint.upvotes, data: complaint });
  } catch (error) {
    console.error('Error upvoting complaint:', error);
    res.status(500).json({ success: false, message: 'Unable to upvote complaint' });
  }
});

const USERS_FILE = path.join(__dirname, '../data/users.json');
function findUserByEmailOrId(identifier) {
  try {
    if (!fs.existsSync(USERS_FILE)) return null;
    const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8') || '[]');
    return users.find(u => u.id === identifier || u.email?.toLowerCase() === identifier?.toLowerCase());
  } catch (err) {
    return null;
  }
}

/**
 * PATCH /api/complaints/:id/status
 */
router.patch('/:id/status', async (req, res) => {
  try {
    const userEmail = req.headers['x-user-email'] || req.body.officerEmail || req.body.userId;
    let officerTitle = req.body.assignedOfficer || 'Authorized Field Officer';

    if (userEmail) {
      const officer = findUserByEmailOrId(userEmail);
      if (officer) {
        if (officer.role !== 'officer' || !officer.isVerified) {
          return res.status(403).json({
            success: false,
            message: 'Unauthorized: Only verified Government Department Officers can update complaint status.'
          });
        }
        officerTitle = `${officer.designation || 'Officer'} ${officer.name} (${officer.badgeId || officer.department})`;
      }
    }

    const { status, note, resolvedImageUrl } = req.body;
    let formattedNote = note;
    if (note && officerTitle && !note.includes(officerTitle)) {
      formattedNote = `${note} (Actioned by ${officerTitle})`;
    }

    const complaint = await updateComplaintStatus(req.params.id, {
      status,
      note: formattedNote,
      assignedOfficer: officerTitle,
      resolvedImageUrl
    });

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    res.json({ success: true, data: complaint });
  } catch (error) {
    console.error('Error updating complaint status:', error);
    res.status(500).json({ success: false, message: 'Unable to update complaint status' });
  }
});

module.exports = router;
