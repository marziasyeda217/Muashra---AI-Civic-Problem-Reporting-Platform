/**
 * Duplicate Complaint Detection Service
 * 
 * Prevents government backlogs by detecting when multiple citizens
 * report the same civic issue in the same neighborhood.
 */

// Haversine formula to calculate distance in meters between two lat/lng points
function calculateDistanceMeters(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 999999;
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) *
    Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

function findDuplicateComplaint(newComplaint, existingComplaints) {
  const DUPLICATE_RADIUS_METERS = 500; // 500 meters radius

  for (const existing of existingComplaints) {
    // Only compare with active issues (pending or in_progress)
    if (existing.status === 'resolved') continue;

    // 1. Same category check
    if (existing.category === newComplaint.category) {
      // 2. Proximity check (if coordinates available)
      if (newComplaint.location?.latitude && existing.location?.latitude) {
        const distance = calculateDistanceMeters(
          newComplaint.location.latitude,
          newComplaint.location.longitude,
          existing.location.latitude,
          existing.location.longitude
        );

        if (distance <= DUPLICATE_RADIUS_METERS) {
          return {
            isDuplicate: true,
            matchedComplaint: existing,
            reason: `Found an active issue within ${Math.round(distance)} meters for the same category.`
          };
        }
      }

      // 3. Text/Keyword similarity check for same area
      const textA = (newComplaint.descriptionRaw || "").toLowerCase();
      const textB = (existing.descriptionRaw || "").toLowerCase();
      
      const wordsA = textA.split(/\s+/).filter(w => w.length > 3);
      let matches = 0;
      for (const w of wordsA) {
        if (textB.includes(w)) matches++;
      }

      if (wordsA.length > 0 && (matches / wordsA.length) > 0.4) {
        return {
          isDuplicate: true,
          matchedComplaint: existing,
          reason: `High textual similarity with an existing issue in the same area.`
        };
      }
    }
  }

  return { isDuplicate: false, matchedComplaint: null };
}

module.exports = {
  findDuplicateComplaint,
  calculateDistanceMeters
};
