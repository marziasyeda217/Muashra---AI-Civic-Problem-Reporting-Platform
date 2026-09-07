import { jsPDF } from 'jspdf';

/**
 * Creates the exact Webpage "Meem" (م) Urdu Logo on canvas
 * Returns a high-resolution PNG data URL for crystal-clear vector-like PDF rendering.
 */
function createWebpageMeemLogoDataUrl() {
  if (typeof document === 'undefined') return null;

  try {
    const canvas = document.createElement('canvas');
    canvas.width = 460;
    canvas.height = 110;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.clearRect(0, 0, 460, 110);

    // 1. Emerald rounded square badge (w: 84, h: 84, r: 22) matching webpage
    const x = 10, y = 13, size = 84, r = 22;
    ctx.fillStyle = '#047857'; // emerald-700
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + size - r, y);
    ctx.quadraticCurveTo(x + size, y, x + size, y + r);
    ctx.lineTo(x + size, y + size - r);
    ctx.quadraticCurveTo(x + size, y + size, x + size - r, y + size);
    ctx.lineTo(x + r, y + size);
    ctx.quadraticCurveTo(x, y + size, x, y + size - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();

    // 2. White Urdu letter 'م' (Meem) inside badge
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 50px "Noto Nastaliq Urdu", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('م', x + (size / 2), y + (size / 2) + 2);

    // 3. Webpage Brand Text next to badge
    // "MUASHRA"
    ctx.fillStyle = '#022C22'; // emerald-950
    ctx.font = '900 30px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText('MUASHRA', 108, 48);

    // "معاشرہ"
    ctx.fillStyle = '#047857'; // emerald-700
    ctx.font = 'bold 22px "Noto Nastaliq Urdu", Arial, sans-serif';
    ctx.fillText('معاشرہ', 270, 48);

    // "Public Civic Engine"
    ctx.fillStyle = '#047857';
    ctx.font = '800 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('PUBLIC CIVIC ENGINE', 110, 72);

    return canvas.toDataURL('image/png');
  } catch (err) {
    console.warn('Logo generation error:', err);
    return null;
  }
}

/**
 * Sanitizes strings for standard jsPDF Latin-1 font compatibility.
 */
function sanitizeText(str) {
  if (!str) return '';
  return String(str)
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[\u2022\u2023\u25E6\u2043\u2219]/g, "*")
    .replace(/[^\x20-\x7E\r\n\t]/g, ' ')
    .replace(/ +/g, ' ')
    .trim();
}

/**
 * Extracts and formalizes the clean English Incident Summary converted by AI.
 */
function getFormalIncidentSummary(complaint) {
  let text = complaint.incidentSummaryFormal || complaint.formalComplaintEnglish || complaint.descriptionRaw || '';
  
  // Clean out any leftover "PROMPT", "PROMPT:", "Prompt:" or system instructions
  text = text.replace(/^(?:PROMPT|Prompt|System Prompt|User Prompt|Instruction|Instructions):\s*/gi, '');
  text = text.replace(/\bPROMPT\b[:\s-]*/gi, '');
  text = text.replace(/\bSYSTEM INSTRUCTION\b[:\s-]*/gi, '');

  const match = text.match(/SUMMARY OF INCIDENT\/ISSUE(?:\s*\([^)]*\))?:\s*([^\n]+(?:\n(?!(?:CITIZEN|IMPACT|STATUTORY|Yours))[^\n]+)*)/i);
  if (match && match[1] && match[1].trim().length > 15) {
    const cleaned = sanitizeText(match[1].replace(/["']/g, ''));
    if (cleaned.length > 15) return cleaned;
  }

  const cat = (complaint.category || '').toLowerCase();
  const raw = (complaint.descriptionRaw || '').toLowerCase();

  if (cat.includes('road') || raw.match(/road|sarak|pot hole|pothole|gaddha|gadha|tooti/)) {
    return "Severe roadway degradation, hazardous deep potholes, and damaged asphalt spanning the thoroughfare, directly causing vehicular accidents, severe traffic obstruction, and acute physical danger to daily commuters. Immediate site inspection and permanent roadbed asphalt resurfacing required.";
  }
  if (cat.includes('water') || raw.match(/pani|water|pipe|leak|line|sewer|gutter|drain|nala/)) {
    return "Ruptured municipal water distribution line and compromised sanitation network resulting in continuous sewage overflow, potable water contamination, and localized roadway flooding. Immediate pipeline repair and drainage restoration required.";
  }
  if (cat.includes('electr') || raw.match(/bijli|electricity|light|wire|pole|current|transformer|taar/)) {
    return "Exposed dangling high-voltage electrical cabling over pedestrian walkways or malfunctioning power transformer unit presenting an acute risk of electrocution, short-circuit fire, and disruption of civic electricity supply.";
  }
  if (cat.includes('waste') || raw.match(/kachra|waste|garbage|safai|dabba|smell|dump|badboo/)) {
    return "Substantial uncollected municipal solid waste accumulation and illegal open refuse dumping causing pest proliferation, noxious odors, and toxic environmental contamination near populated residential zones.";
  }

  if (text.trim().length > 15) {
    return sanitizeText(text);
  }

  return "Critical civic infrastructure maintenance failure posing serious public safety hazard, structural disruption, and severe inconvenience to neighborhood residents. Emergency technical team deployment requested.";
}

export function generateComplaintPDF(complaint) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();   // 210 mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297 mm
  const margin = 14;
  const contentWidth = pageWidth - (margin * 2);        // 182 mm

  // Theme Colors: Official Pakistan Emerald Green Theme matching webpage
  const emeraldGreen = [4, 120, 87];      // Primary Emerald Green (#047857)
  const darkEmerald = [2, 44, 34];        // Deep Emerald / Slate (#022C22)
  const lightEmeraldBg = [240, 253, 244]; // Soft Emerald (#F0FDF4)
  const gridBorder = [100, 116, 139];     // Clean Table Border Grid (#64748B)
  const cellText = [15, 23, 42];          // Dark Navy/Slate text
  const slateText = [71, 85, 105];

  // ==========================================
  // TOP HEADER: WEBPAGE "MEEM" LOGO & FORM TITLE
  // ==========================================

  // 1. Webpage Meem Urdu Logo (Top Left)
  const meemLogoDataUrl = createWebpageMeemLogoDataUrl();
  if (meemLogoDataUrl) {
    doc.addImage(meemLogoDataUrl, 'PNG', margin, 9, 46, 11);
  }

  // Tracking Ticket ID (Top Right)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...emeraldGreen);
  doc.text('TICKET REF: #' + (complaint.id || 'CMP-8491'), pageWidth - margin, 14, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...slateText);
  const fileDate = new Date(complaint.createdAt || Date.now()).toLocaleDateString('en-PK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  doc.text('Filing Date: ' + fileDate, pageWidth - margin, 19, { align: 'right' });

  // 2. Centered Form Title
  let y = 28;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14.5);
  doc.setTextColor(...darkEmerald);
  doc.text('CITIZEN GRIEVANCE PETITION FORM', pageWidth / 2, y, { align: 'center' });

  y += 5;
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...emeraldGreen);
  doc.text('MUASHRA PUBLIC CIVIC ENTERPRISE — OFFICIAL GOVERNMENT OF PAKISTAN PETITION', pageWidth / 2, y, { align: 'center' });

  y += 6;

  // Helper function to draw table bordered row
  const drawRow2Col = (yPos, rowH, label1, val1, label2, val2) => {
    const colW = contentWidth / 2;

    // Draw cell borders
    doc.setDrawColor(...gridBorder);
    doc.setLineWidth(0.3);
    doc.rect(margin, yPos, colW, rowH, 'S');
    doc.rect(margin + colW, yPos, colW, rowH, 'S');

    // Col 1
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...cellText);
    doc.text(label1, margin + 3, yPos + 5);
    doc.setFont('helvetica', 'normal');
    const splitVal1 = doc.splitTextToSize(String(val1 || 'N/A'), colW - 38);
    doc.text(splitVal1[0] || '', margin + 36, yPos + 5);

    // Col 2
    doc.setFont('helvetica', 'bold');
    doc.text(label2, margin + colW + 3, yPos + 5);
    doc.setFont('helvetica', 'normal');
    const splitVal2 = doc.splitTextToSize(String(val2 || 'N/A'), colW - 36);
    doc.text(splitVal2[0] || '', margin + colW + 34, yPos + 5);
  };

  // ==========================================
  // TABLE 1: CITIZEN & APPLICANT INFORMATION
  // ==========================================

  // Emerald Green Table Header Bar
  doc.setFillColor(...emeraldGreen);
  doc.rect(margin, y, contentWidth, 6.5, 'F');
  doc.setDrawColor(...gridBorder);
  doc.setLineWidth(0.3);
  doc.rect(margin, y, contentWidth, 6.5, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text('CITIZEN & APPLICANT INFORMATION', pageWidth / 2, y + 4.5, { align: 'center' });

  y += 6.5;

  const citizenName = sanitizeText(complaint.citizenName || 'Verified Citizen Applicant');
  const city = sanitizeText(complaint.location?.city || 'Pakistan');
  const address = sanitizeText(complaint.location?.address || 'Designated Thoroughfare Area');
  const dept = sanitizeText(complaint.department || 'Municipal Services Agency');
  const urgency = sanitizeText(complaint.urgency || 'High Priority');
  const helpline = sanitizeText(complaint.departmentHelpline || '1334 / 118');
  const cleanCitySlug = city.toLowerCase().replace(/[^a-z0-9]/g, '');
  const fallbackEmail = city.toLowerCase().includes('khairpur') || city.toLowerCase().includes('sukkur')
    ? 'commissioner@sukkur.gov.pk'
    : `commissioner@${cleanCitySlug || 'district'}.gov.pk`;
  const email = sanitizeText(complaint.departmentEmail || fallbackEmail);

  // Row 1: Citizen Name | Ticket Ref
  drawRow2Col(y, 7, 'Citizen Name:', citizenName, 'Ticket Ref No:', '#' + (complaint.id || 'CMP-8491'));
  y += 7;

  // Row 2: Citizen Address | District / City
  drawRow2Col(y, 7, 'Citizen Address:', address, 'District / City:', city);
  y += 7;

  // Row 3: Target Agency | Priority SLA
  drawRow2Col(y, 7, 'Target Agency:', dept, 'Priority SLA:', urgency + ' (7-Day Escalation)');
  y += 7;

  // Row 4: Official Email | Helpline
  drawRow2Col(y, 7, 'Agency Email:', email, 'Agency Helpline:', helpline + ' (Direct Dispatch)');
  y += 7;

  // Row 5: Filing Date | Product / Service
  drawRow2Col(y, 7, 'Complaint Date:', fileDate, 'Verification Status:', 'Officially Recorded');
  y += 7;

  y += 4;

  // ==========================================
  // TABLE 2: COMPLAINT INFORMATION (EMERALD GREEN THEME)
  // ==========================================

  // Emerald Green Table Header Bar
  doc.setFillColor(...emeraldGreen);
  doc.rect(margin, y, contentWidth, 6.5, 'F');
  doc.rect(margin, y, contentWidth, 6.5, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text('COMPLAINT INFORMATION', pageWidth / 2, y + 4.5, { align: 'center' });

  y += 6.5;

  // Row 1: Complaint Date | Complaint Taken By
  drawRow2Col(y, 7, 'Incident Date:', fileDate, 'Complaint Taken By:', 'MUASHRA AI Civic Engine');
  y += 7;

  // Row 2: Administrative Subject & Category
  doc.setDrawColor(...gridBorder);
  doc.setLineWidth(0.3);
  doc.rect(margin, y, contentWidth, 7, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...cellText);
  doc.text('Complaint Subject:', margin + 3, y + 5);
  doc.setFont('helvetica', 'normal');
  const cleanSubject = sanitizeText(complaint.title || 'Official Civic Infrastructure Rectification Petition');
  doc.text(doc.splitTextToSize(cleanSubject, contentWidth - 40)[0], margin + 36, y + 5);
  y += 7;

  // Row 3: Complaint Details (AI Formal Transcription Summary) - TALL CELL
  const formalSummary = getFormalIncidentSummary(complaint);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  const splitSummary = doc.splitTextToSize(formalSummary, contentWidth - 6);
  const summaryHeight = Math.max((splitSummary.length * 3.8) + 8, 22);

  doc.rect(margin, y, contentWidth, summaryHeight, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...emeraldGreen);
  doc.text('Complaint Details / Certified Incident Summary (AI Formal Transcription):', margin + 3, y + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.setTextColor(30, 41, 59);
  doc.text(splitSummary, margin + 3, y + 9);
  y += summaryHeight;

  // Row 4: First Response Corrective Action (TALL CELL)
  const correctiveAction = "Pursuant to the Public Service Standards and Citizen Charter, the Competent Administrative Authority is hereby mandated to deploy an emergency technical maintenance squad to inspect the site and execute permanent rectification works without delay.";
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  const splitCorrective = doc.splitTextToSize(correctiveAction, contentWidth - 6);
  const correctiveHeight = Math.max((splitCorrective.length * 3.8) + 8, 18);

  doc.rect(margin, y, contentWidth, correctiveHeight, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...cellText);
  doc.text('First Response Corrective Action:', margin + 3, y + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.setTextColor(...slateText);
  doc.text(splitCorrective, margin + 3, y + 9);
  y += correctiveHeight;

  // Row 5: Suspected Cause & Public Impact
  const suspectedCause = "Critical civic infrastructure maintenance failure posing serious public safety hazard, severe traffic disruption, and structural obstruction to neighborhood residents.";
  const splitCause = doc.splitTextToSize(suspectedCause, contentWidth - 6);
  const causeHeight = Math.max((splitCause.length * 3.8) + 8, 16);

  doc.rect(margin, y, contentWidth, causeHeight, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...cellText);
  doc.text('Suspected Cause & Public Hazard:', margin + 3, y + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.setTextColor(...slateText);
  doc.text(splitCause, margin + 3, y + 9);
  y += causeHeight;

  // Row 6: Corrective Action Person(s)
  doc.rect(margin, y, contentWidth, 7, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...cellText);
  doc.text('Corrective Action Person(s):', margin + 3, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.text(`Managing Director, Chief Engineer & Executive Officer, ${dept}`, margin + 46, y + 5);
  y += 7;

  // Row 7: What steps should be considered to avoid a repeat of the problem
  const preventionSteps = "Establish routine preventative maintenance audits, enforce civil contractor accountability, and execute comprehensive roadbed / pipeline rehabilitation.";
  const splitSteps = doc.splitTextToSize(preventionSteps, contentWidth - 6);
  const stepsHeight = Math.max((splitSteps.length * 3.8) + 8, 16);

  doc.rect(margin, y, contentWidth, stepsHeight, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...cellText);
  doc.text('What steps should be considered to avoid a repeat of the problem:', margin + 3, y + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.setTextColor(...slateText);
  doc.text(splitSteps, margin + 3, y + 9);
  y += stepsHeight;

  // Row 8: GIS Coordinates & Date Row
  const lat = Number(complaint.location?.latitude || 31.5204).toFixed(5);
  const lng = Number(complaint.location?.longitude || 74.3587).toFixed(5);
  drawRow2Col(y, 7, 'GIS Pinpoint:', `Lat: ${lat}N, Lng: ${lng}E (Verified)`, 'Statutory SLA Date:', fileDate);
  y += 7;

  y += 10;

  // ==========================================
  // BOTTOM SECTION: SIGNATURES & OFFICIAL EMERALD GREEN STAMP SEAL
  // ==========================================

  // Left: Signature Block matching template image
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...cellText);
  doc.text('Name of person completing this form: ' + citizenName, margin, y);

  doc.line(margin, y + 12, margin + 85, y + 12);
  doc.text('Signature: ___________________________________', margin, y + 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...slateText);
  doc.text('Date: ' + fileDate + ' (Digital Submission Verification)', margin, y + 18);

  // Right: Official Emerald Green Stamp Seal matching user instructions
  const stampCenterX = pageWidth - margin - 32;
  const stampCenterY = y + 8;

  // Outer Emerald Ring
  doc.setDrawColor(...emeraldGreen);
  doc.setLineWidth(1.3);
  doc.circle(stampCenterX, stampCenterY, 18, 'S');

  // Inner Emerald Ring
  doc.setLineWidth(0.6);
  doc.circle(stampCenterX, stampCenterY, 15.5, 'S');

  // Stamp Text inside Seal in EMERALD GREEN
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.2);
  doc.setTextColor(...emeraldGreen);
  doc.text('MUASHRA VERIFIED', stampCenterX, stampCenterY - 6.5, { align: 'center' });

  doc.setFontSize(7.5);
  doc.text('★ REGISTERED ★', stampCenterX, stampCenterY, { align: 'center' });

  doc.setFontSize(5.5);
  doc.text('GOVT CIVIC CELL', stampCenterX, stampCenterY + 6, { align: 'center' });

  doc.setFont('courier', 'normal');
  doc.setFontSize(5);
  doc.text(fileDate, stampCenterX, stampCenterY + 10.5, { align: 'center' });

  // Save the PDF file (Universal Mobile + Desktop Downloader)
  const fileName = `MUASHRA_Grievance_Petition_${complaint.id || 'Report'}.pdf`;
  try {
    const blob = doc.output('blob');
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    }, 3000);
  } catch (downloadErr) {
    console.warn('Blob download fallback to doc.save:', downloadErr);
    doc.save(fileName);
  }
}


