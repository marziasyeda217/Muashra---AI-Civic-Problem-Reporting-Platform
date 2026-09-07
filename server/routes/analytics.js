const express = require('express');
const router = express.Router();
const { getComplaints } = require('../services/complaintRepository');

/**
 * GET /api/analytics/stats
 * Overview numbers for the public dashboard
 */
router.get('/stats', async (req, res) => {
  try {
    const list = await getComplaints();

    const total = list.length;
    const pending = list.filter(c => c.status === 'pending').length;
    const inProgress = list.filter(c => c.status === 'in_progress').length;
    const resolved = list.filter(c => c.status === 'resolved').length;
    const totalUpvotes = list.reduce((sum, c) => sum + (c.upvotes || 0), 0);

    res.json({
      success: true,
      data: {
        total,
        pending,
        inProgress,
        resolved,
        totalUpvotes,
        resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0
      }
    });
  } catch (error) {
    console.error('Error calculating analytics stats:', error);
    res.status(500).json({ success: false, message: 'Unable to calculate analytics statistics' });
  }
});

/**
 * GET /api/analytics/departments
 * Department Trust Scores and performance ranking
 */
router.get('/departments', async (req, res) => {
  try {
    const list = await getComplaints();
    const deptMap = {};

    list.forEach(c => {
      const dept = c.department || 'General Municipal';
      if (!deptMap[dept]) {
        deptMap[dept] = {
          name: dept,
          nameUrdu: c.departmentUrdu || '',
          category: c.category || 'General',
          email: c.departmentEmail || null,
          helpline: c.departmentHelpline || null,
          headOffice: c.departmentHeadOffice || null,
          portalUrl: c.departmentPortalUrl || null,
          total: 0,
          resolved: 0,
          inProgress: 0,
          pending: 0
        };
      }
      deptMap[dept].total++;
      if (c.status === 'resolved') deptMap[dept].resolved++;
      else if (c.status === 'in_progress') deptMap[dept].inProgress++;
      else deptMap[dept].pending++;
    });

    const departmentStats = Object.values(deptMap).map(d => {
      const resolveRatio = d.total > 0 ? d.resolved / d.total : 0;
      const inProgressBonus = d.total > 0 ? (d.inProgress / d.total) * 0.5 : 0;
      const rawScore = Math.round((resolveRatio * 70) + (inProgressBonus * 30) + 30);
      const trustScore = Math.min(Math.max(rawScore, 40), 98);

      return {
        ...d,
        trustScore,
        ratingGrade: trustScore >= 80 ? 'A+' : trustScore >= 70 ? 'A' : trustScore >= 60 ? 'B' : 'C'
      };
    });

    departmentStats.sort((a, b) => b.trustScore - a.trustScore);

    res.json({
      success: true,
      data: departmentStats
    });
  } catch (error) {
    console.error('Error calculating department analytics:', error);
    res.status(500).json({ success: false, message: 'Unable to calculate department analytics' });
  }
});

module.exports = router;
