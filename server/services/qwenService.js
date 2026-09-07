const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

function getDepartmentRouting(deptKey, rawCity) {
  const city = (rawCity || 'Lahore').trim();
  const cityLower = city.toLowerCase();
  const citySlug = cityLower.replace(/[^a-z0-9]/g, '');

  const SINDH_CITIES = [
    'sukkur', 'khairpur', 'karachi', 'hyderabad', 'larkana', 'ghotki', 'shikarpur', 'jacobabad',
    'kashmore', 'kandhkot', 'qambar', 'shahdadkot', 'dadu', 'jamshoro', 'matiari', 'tando allahyar',
    'tando muhammad khan', 'badin', 'thatta', 'sujawal', 'mirpur khas', 'mirpurkhas', 'umerkot',
    'tharparkar', 'mithi', 'sanghar', 'naushahro feroze', 'naushahro', 'nawabshah', 'shaheed benazirabad',
    'sehwan', 'kotri', 'moro', 'ranipur', 'gambat', 'pir jo goth', 'rohri', 'pano aqil', 'daharki'
  ];

  const KP_CITIES = [
    'peshawar', 'mardan', 'abbottabad', 'swat', 'mingora', 'haripur', 'mansehra', 'charsadda',
    'swabi', 'nowshera', 'kohat', 'bannu', 'dera ismail khan', 'd.i. khan', 'malakand', 'dir',
    'chitral', 'bajaur', 'khyber', 'kurram', 'mohmand', 'orakzai', 'waziristan', 'hangu',
    'karak', 'lakki marwat', 'tank', 'battagram', 'torghar', 'kohistan', 'shangla', 'buner'
  ];

  const BALOCHISTAN_CITIES = [
    'quetta', 'gwadar', 'turbat', 'kech', 'khuzdar', 'chaman', 'pishin', 'sibi', 'zhob', 'loralai',
    'hub', 'kalat', 'lasbela', 'chagai', 'dera bugti', 'jafarabad', 'nasirabad', 'sohbatpur',
    'usta muhammad', 'mastung', 'awaran', 'surab', 'panjgur', 'nushki', 'kharan', 'washuk',
    'kohlu', 'killa abdullah', 'killa saifullah', 'musakhel', 'barkhan', 'duki', 'harnai', 'ziarat'
  ];

  const ISLAMABAD_CITIES = ['islamabad', 'ict', 'rawat'];
  const AJK_CITIES = ['muzaffarabad', 'mirpur', 'rawalakot', 'kotli', 'bagh', 'bhimber', 'neelum', 'haveli', 'sudhanoti', 'hattian'];
  const GB_CITIES = ['gilgit', 'skardu', 'hunza', 'nagar', 'ghizer', 'diamer', 'astore', 'ghanche', 'shigar', 'kharmang'];

  const isSindh = SINDH_CITIES.some(c => cityLower.includes(c));
  const isKP = KP_CITIES.some(c => cityLower.includes(c));
  const isBalochistan = BALOCHISTAN_CITIES.some(c => cityLower.includes(c));
  const isIslamabad = ISLAMABAD_CITIES.some(c => cityLower.includes(c));
  const isAJK = AJK_CITIES.some(c => cityLower.includes(c));
  const isGB = GB_CITIES.some(c => cityLower.includes(c));

  // Regional division checks in Punjab
  const isRawalpindiDiv = ['rawalpindi', 'attock', 'jhelum', 'chakwal', 'murree', 'taxila', 'gujar khan'].some(c => cityLower.includes(c));
  const isGujranwalaDiv = ['gujranwala', 'gujrat', 'sialkot', 'narowal', 'hafizabad', 'mandi bahauddin', 'wazirabad', 'daska'].some(c => cityLower.includes(c));
  const isFaisalabadDiv = ['faisalabad', 'jhang', 'toba tek singh', 'chiniot', 'samundri', 'jaranwala'].some(c => cityLower.includes(c));
  const isSargodhaDiv = ['sargodha', 'mianwali', 'bhakkar', 'khushab', 'bhalwal'].some(c => cityLower.includes(c));
  const isMultanDiv = ['multan', 'khanewal', 'lodhran', 'vehari', 'mian channu'].some(c => cityLower.includes(c));
  const isSahiwalDiv = ['sahiwal', 'okara', 'pakpattan', 'chichawatni'].some(c => cityLower.includes(c));
  const isBahawalpurDiv = ['bahawalpur', 'bahawalnagar', 'rahim yar khan', 'ahmedpur east', 'sadiqabad', 'chishtian'].some(c => cityLower.includes(c));
  const isDGKhanDiv = ['dera ghazi khan', 'd.g. khan', 'muzaffargarh', 'layyah', 'rajanpur', 'taunsa', 'kot addu', 'alipur'].some(c => cityLower.includes(c));
  const isLahoreDiv = ['lahore', 'kasur', 'sheikhupura', 'nankana', 'pattoki'].some(c => cityLower.includes(c));

  // Determine official administrative commissioner and DC email
  let commissionerEmail = `commissioner@${citySlug}.gov.pk`;
  let dcEmail = `dc@${citySlug}.gov.pk`;
  let adminHelpline = "1099";

  if (cityLower.includes('khairpur') || cityLower.includes('sukkur') || cityLower.includes('ghotki')) {
    commissionerEmail = 'commissioner@sukkur.gov.pk';
    dcEmail = cityLower.includes('khairpur') ? 'dc@khairpur.gov.pk' : 'dc@sukkur.gov.pk';
    adminHelpline = '071-9310500';
  } else if (cityLower.includes('larkana') || cityLower.includes('shikarpur') || cityLower.includes('jacobabad') || cityLower.includes('kashmore')) {
    commissionerEmail = 'commissioner@larkana.gov.pk';
    dcEmail = `dc@${citySlug}.gov.pk`;
    adminHelpline = '074-9410710';
  } else if (cityLower.includes('karachi')) {
    commissionerEmail = 'commissioner@karachi.gov.pk';
    dcEmail = 'dc@karachi.gov.pk';
    adminHelpline = '021-99205634';
  } else if (cityLower.includes('hyderabad')) {
    commissionerEmail = 'commissioner@hyderabad.gov.pk';
    dcEmail = 'dc@hyderabad.gov.pk';
    adminHelpline = '022-9200214';
  } else if (cityLower.includes('mirpur khas') || cityLower.includes('mirpurkhas') || cityLower.includes('umerkot') || cityLower.includes('tharparkar')) {
    commissionerEmail = 'commissioner@mirpurkhas.gov.pk';
    adminHelpline = '0233-9290022';
  } else if (cityLower.includes('nawabshah') || cityLower.includes('shaheed benazirabad') || cityLower.includes('naushahro')) {
    commissionerEmail = 'commissioner@sba.gos.pk';
    adminHelpline = '0244-9370333';
  } else if (isIslamabad) {
    commissionerEmail = 'dc@ict.gov.pk';
    dcEmail = 'dc@ict.gov.pk';
    adminHelpline = '051-9108084';
  } else if (cityLower.includes('rawalpindi')) {
    commissionerEmail = 'commissioner@rawalpindi.gov.pk';
    dcEmail = 'dc@rawalpindi.gov.pk';
    adminHelpline = '051-9292524';
  } else if (cityLower.includes('lahore')) {
    commissionerEmail = 'commissioner@lahore.gov.pk';
    dcEmail = 'dc@lahore.gov.pk';
    adminHelpline = '042-99200000';
  } else if (cityLower.includes('faisalabad')) {
    commissionerEmail = 'commissioner@faisalabad.gov.pk';
    adminHelpline = '041-9201700';
  } else if (cityLower.includes('multan')) {
    commissionerEmail = 'commissioner@multan.gov.pk';
    adminHelpline = '061-9200030';
  } else if (cityLower.includes('gujranwala') || cityLower.includes('sialkot') || cityLower.includes('gujrat')) {
    commissionerEmail = 'commissioner@gujranwala.gov.pk';
    adminHelpline = '055-9200021';
  } else if (cityLower.includes('peshawar')) {
    commissionerEmail = 'commissioner@peshawar.gov.pk';
    adminHelpline = '091-9212222';
  } else if (cityLower.includes('quetta')) {
    commissionerEmail = 'commissioner@quetta.gob.pk';
    adminHelpline = '081-9201400';
  } else if (isAJK) {
    commissionerEmail = 'commissioner@ajk.gov.pk';
    adminHelpline = '05822-920001';
  } else if (isGB) {
    commissionerEmail = 'commissioner@gilgit.gov.pk';
    adminHelpline = '05811-920001';
  }

  // =========================================================================
  // 1. ELECTRICITY & POWER (All 11 Pakistani DISCOs + K-Electric + AJKED)
  // =========================================================================
  if (deptKey === 'electricity') {
    // Karachi: K-Electric
    if (cityLower.includes('karachi')) {
      return {
        name: "K-Electric (KE Central Command & Control)",
        nameUrdu: "کے الیکٹرک گرڈ و سینٹرل کمپلینٹ سیل",
        category: "Electricity & Power",
        email: "complaints@ke.com.pk",
        secondaryEmail: "customercare@ke.com.pk",
        helpline: "118",
        headOffice: "KE House, 39-B Sunset Boulevard, Phase II, DHA, Karachi, Sindh",
        portalUrl: "https://www.ke.com.pk",
        defaultDays: 2
      };
    }

    // Northern / Interior Sindh: Sukkur Electric Power Company (SEPCO)
    if (cityLower.includes('sukkur') || cityLower.includes('khairpur') || cityLower.includes('larkana') ||
        cityLower.includes('ghotki') || cityLower.includes('shikarpur') || cityLower.includes('jacobabad') ||
        cityLower.includes('kashmore') || cityLower.includes('qambar') || cityLower.includes('rohri') ||
        cityLower.includes('daharki') || cityLower.includes('pano aqil') || cityLower.includes('ranipur') ||
        cityLower.includes('gambat')) {
      return {
        name: `Sukkur Electric Power Company (SEPCO - ${city} Circle)`,
        nameUrdu: `سکھر الیکٹرک پاور کمپنی (سیپکو - سرکل ${city})`,
        category: "Electricity & Power",
        email: "complaints@sepco.com.pk",
        secondaryEmail: "ccsepco@sepco.com.pk",
        helpline: "118",
        headOffice: "SEPCO Headquarters, Old Thermal Power Station Road, Sukkur, Sindh",
        portalUrl: "http://www.sepco.com.pk",
        defaultDays: 2
      };
    }

    // Central & Southern Sindh: Hyderabad Electric Supply Company (HESCO)
    if (isSindh) {
      return {
        name: `Hyderabad Electric Supply Company (HESCO - ${city} Division)`,
        nameUrdu: `حیدرآباد الیکٹرک سپلائی کمپنی (حیسکو - ڈویژن ${city})`,
        category: "Electricity & Power",
        email: "complaints@hesco.gov.pk",
        secondaryEmail: "customercare@hesco.gov.pk",
        helpline: "118",
        headOffice: "HESCO Complex, WAPDA Colony, Hussainabad, Hyderabad, Sindh",
        portalUrl: "http://www.hesco.gov.pk",
        defaultDays: 2
      };
    }

    // Islamabad Capital Territory & Northern Punjab: IESCO
    if (isIslamabad || isRawalpindiDiv) {
      return {
        name: `Islamabad Electric Supply Company (IESCO - ${city} Circle)`,
        nameUrdu: `اسلام آباد الیکٹرک سپلائی کمپنی (آئیسکو - سرکل ${city})`,
        category: "Electricity & Power",
        email: "complaints@iesco.com.pk",
        secondaryEmail: "ceocare@iesco.com.pk",
        helpline: "118",
        headOffice: "IESCO Head Office, Street 40, Sector G-7/4, Islamabad",
        portalUrl: "https://iesco.com.pk",
        defaultDays: 2
      };
    }

    // Gujranwala Industrial Division: GEPCO
    if (isGujranwalaDiv) {
      return {
        name: `Gujranwala Electric Power Company (GEPCO - ${city} Circle)`,
        nameUrdu: `گوجرانوالہ الیکٹرک پاور کمپنی (گیپکو - سرکل ${city})`,
        category: "Electricity & Power",
        email: "complaints@gepco.com.pk",
        secondaryEmail: "customercare@gepco.com.pk",
        helpline: "118",
        headOffice: "GEPCO Headquarters, 565-A Grand Trunk Road, Gujranwala, Punjab",
        portalUrl: "https://gepco.com.pk",
        defaultDays: 2
      };
    }

    // Faisalabad & Sargodha Division: FESCO
    if (isFaisalabadDiv || isSargodhaDiv) {
      return {
        name: `Faisalabad Electric Supply Company (FESCO - ${city} Circle)`,
        nameUrdu: `فیصل آباد الیکٹرک سپلائی کمپنی (فیسکو - سرکل ${city})`,
        category: "Electricity & Power",
        email: "complaints@fesco.com.pk",
        secondaryEmail: "ceo@fesco.com.pk",
        helpline: "118",
        headOffice: "FESCO Headquarters, West Canal Road, Abdullahpur, Faisalabad, Punjab",
        portalUrl: "https://fesco.com.pk",
        defaultDays: 2
      };
    }

    // Multan, Bahawalpur, D.G. Khan, Sahiwal: MEPCO
    if (isMultanDiv || isBahawalpurDiv || isDGKhanDiv || isSahiwalDiv) {
      return {
        name: `Multan Electric Power Company (MEPCO - ${city} Circle)`,
        nameUrdu: `ملتان الیکٹرک پاور کمپنی (میپکو - سرکل ${city})`,
        category: "Electricity & Power",
        email: "complaints@mepco.com.pk",
        secondaryEmail: "customercare@mepco.com.pk",
        helpline: "118",
        headOffice: "MEPCO Complex, Khanewal Road, Multan, Punjab",
        portalUrl: "https://mepco.com.pk",
        defaultDays: 2
      };
    }

    // KP Tribal Areas: TESCO
    if (['bajaur', 'khyber', 'kurram', 'mohmand', 'orakzai', 'waziristan'].some(c => cityLower.includes(c))) {
      return {
        name: `Tribal Electric Supply Company (TESCO - ${city})`,
        nameUrdu: `قبائلی الیکٹرک سپلائی کمپنی (ٹیسکو - ${city})`,
        category: "Electricity & Power",
        email: "complaints@tesco.gov.pk",
        secondaryEmail: "info@tesco.gov.pk",
        helpline: "118",
        headOffice: "TESCO Headquarters, WAPDA House, Shami Road, Peshawar, KP",
        portalUrl: "https://tesco.gov.pk",
        defaultDays: 2
      };
    }

    // KP Settled Areas: PESCO
    if (isKP) {
      return {
        name: `Peshawar Electric Supply Company (PESCO - ${city} Circle)`,
        nameUrdu: `پشاور الیکٹرک سپلائی کمپنی (پیسکو - سرکل ${city})`,
        category: "Electricity & Power",
        email: "complaints@pesco.com.pk",
        secondaryEmail: "info@pesco.com.pk",
        helpline: "118",
        headOffice: "WAPDA House, Shami Road, Peshawar, Khyber Pakhtunkhwa",
        portalUrl: "https://pesco.com.pk",
        defaultDays: 2
      };
    }

    // Balochistan: QESCO
    if (isBalochistan) {
      return {
        name: `Quetta Electric Supply Company (QESCO - ${city} Circle)`,
        nameUrdu: `کوئٹہ الیکٹرک سپلائی کمپنی (کیسکو - سرکل ${city})`,
        category: "Electricity & Power",
        email: "complaints@qesco.com.pk",
        secondaryEmail: "customercare@qesco.com.pk",
        helpline: "118",
        headOffice: "QESCO Headquarters, Zarghoon Road, Quetta, Balochistan",
        portalUrl: "https://qesco.com.pk",
        defaultDays: 2
      };
    }

    // AJK: AJKED
    if (isAJK) {
      return {
        name: `AJK Electricity Department (AJKED - ${city})`,
        nameUrdu: `محکمہ برقیات آزاد جموں و کشمیر (${city})`,
        category: "Electricity & Power",
        email: "complaints@ajked.gov.pk",
        secondaryEmail: "info@ajked.gov.pk",
        helpline: "118",
        headOffice: "Electricity House, Bank Road, Muzaffarabad, AJK",
        portalUrl: "https://ajked.gov.pk",
        defaultDays: 2
      };
    }

    // Gilgit-Baltistan
    if (isGB) {
      return {
        name: `Water & Power Department Gilgit-Baltistan (${city})`,
        nameUrdu: `محکمہ برقیات و پانی گلگت بلتستان (${city})`,
        category: "Electricity & Power",
        email: `power@${citySlug}.gb.gov.pk`,
        secondaryEmail: "info@gb.gov.pk",
        helpline: "118",
        headOffice: "Water & Power Secretariat, Chinar Bagh, Gilgit, GB",
        portalUrl: "https://gb.gov.pk",
        defaultDays: 2
      };
    }

    // Lahore Division & Default Punjab: LESCO
    return {
      name: `Lahore Electric Supply Company (LESCO - ${city} Circle)`,
      nameUrdu: `لاہور الیکٹرک سپلائی کمپنی (لیسکو - سرکل ${city})`,
      category: "Electricity & Power",
      email: "customercare@lesco.gov.pk",
      secondaryEmail: "complaints@lesco.gov.pk",
      helpline: "118",
      headOffice: "LESCO Headquarters, 22-A Queens Road, Lahore, Punjab",
      portalUrl: "https://lesco.gov.pk",
      defaultDays: 2
    };
  }

  // =========================================================================
  // 2. WATER & SANITATION
  // =========================================================================
  if (deptKey === 'water') {
    // Karachi: KW&SC
    if (cityLower.includes('karachi')) {
      return {
        name: "Karachi Water & Sewerage Corporation (KW&SC)",
        nameUrdu: "کراچی واٹر اینڈ سیوریج کارپوریشن",
        category: "Water & Sanitation",
        email: "complaints@kwsc.gos.pk",
        secondaryEmail: "info@kwsc.gos.pk",
        helpline: "1339",
        headOffice: "KW&SC Headquarters, 9th Mile Karsaz, Main Shahrah-e-Faisal, Karachi, Sindh",
        portalUrl: "https://kwsc.gos.pk",
        defaultDays: 3
      };
    }

    // Hyderabad: WASA HDA
    if (cityLower.includes('hyderabad')) {
      return {
        name: "Water & Sanitation Agency Hyderabad (WASA HDA)",
        nameUrdu: "واٹر اینڈ سینی ٹیشن ایجنسی حیدرآباد (واسا ایچ ڈی اے)",
        category: "Water & Sanitation",
        email: "complaints@hda.gos.pk",
        secondaryEmail: "info@hda.gos.pk",
        helpline: "1334",
        headOffice: "Civic Centre, Thandi Sarak, Hyderabad, Sindh",
        portalUrl: "https://hda.gos.pk",
        defaultDays: 3
      };
    }

    // Sukkur, Khairpur, Larkana & Interior Sindh: Sindh Public Health Engineering
    if (isSindh) {
      const isKhairpurSukkur = cityLower.includes('sukkur') || cityLower.includes('khairpur') || cityLower.includes('ghotki');
      return {
        name: `Public Health Engineering & Municipal Water Directorate (Sindh PHE - ${city})`,
        nameUrdu: `محکمہ پبلک ہیلتھ انجینئرنگ و فراہمی آب حکومت سندھ (${city})`,
        category: "Water & Sanitation",
        email: "complaints@phesindh.gov.pk",
        secondaryEmail: isKhairpurSukkur ? "water@khairpur.gov.pk" : `water@${citySlug}.gov.pk`,
        helpline: isKhairpurSukkur ? "071-9310680" : "021-99211425",
        headOffice: isKhairpurSukkur ? `PHE & Municipal Water Complex, Station Road, Khairpur / Minara Road, Sukkur, Sindh` : `Sindh PHE Secretariat, Tughlaq House, Sindh Secretariat, Karachi, Sindh`,
        portalUrl: "https://sindh.gov.pk",
        defaultDays: 4
      };
    }

    // Islamabad: CDA Water Supply
    if (isIslamabad) {
      return {
        name: "Capital Development Authority (CDA Water Supply & Sewerage Directorate)",
        nameUrdu: "سی ڈی اے شعبہ فراہمی آب و نکاسی آب، اسلام آباد",
        category: "Water & Sanitation",
        email: "water@cda.gov.pk",
        secondaryEmail: "complaints@cda.gov.pk",
        helpline: "1334",
        headOffice: "CDA Water Directorate Command Center, Sector G-10/4, Islamabad",
        portalUrl: "https://cda.gov.pk",
        defaultDays: 3
      };
    }

    // Rawalpindi: WASA Rawalpindi
    if (cityLower.includes('rawalpindi')) {
      return {
        name: "Water & Sanitation Agency Rawalpindi (WASA Rawalpindi)",
        nameUrdu: "واٹر اینڈ سینی ٹیشن ایجنسی راولپنڈی (واسا راولپنڈی)",
        category: "Water & Sanitation",
        email: "complaints@wasarwp.punjab.gov.pk",
        secondaryEmail: "info@wasarwp.punjab.gov.pk",
        helpline: "1334",
        headOffice: "WASA Complex, Liaquat Bagh, Murree Road, Rawalpindi, Punjab",
        portalUrl: "https://wasarwp.punjab.gov.pk",
        defaultDays: 4
      };
    }

    // Faisalabad: WASA FDA
    if (cityLower.includes('faisalabad')) {
      return {
        name: "Water & Sanitation Agency Faisalabad (WASA FDA)",
        nameUrdu: "واٹر اینڈ سینی ٹیشن ایجنسی فیصل آباد (واسا ایف ڈی اے)",
        category: "Water & Sanitation",
        email: "complaints@wasafaisalabad.gop.pk",
        secondaryEmail: "info@wasafaisalabad.gop.pk",
        helpline: "1334",
        headOffice: "WASA Complex, Club Road, Faisalabad, Punjab",
        portalUrl: "https://wasafaisalabad.gop.pk",
        defaultDays: 4
      };
    }

    // Gujranwala: WASA GDA
    if (cityLower.includes('gujranwala')) {
      return {
        name: "Water & Sanitation Agency Gujranwala (WASA GDA)",
        nameUrdu: "واٹر اینڈ سینی ٹیشن ایجنسی گوجرانوالہ (واسا جی ڈی اے)",
        category: "Water & Sanitation",
        email: "complaints@wasagda.punjab.gov.pk",
        secondaryEmail: "info@wasagda.punjab.gov.pk",
        helpline: "1334",
        headOffice: "WASA Complex, Trust Plaza, G.T. Road, Gujranwala, Punjab",
        portalUrl: "https://wasagda.punjab.gov.pk",
        defaultDays: 4
      };
    }

    // Multan: WASA MDA
    if (cityLower.includes('multan')) {
      return {
        name: "Water & Sanitation Agency Multan (WASA MDA)",
        nameUrdu: "واٹر اینڈ سینی ٹیشن ایجنسی ملتان (واسا ایم ڈی اے)",
        category: "Water & Sanitation",
        email: "complaints@wasamultan.punjab.gov.pk",
        secondaryEmail: "info@wasamultan.punjab.gov.pk",
        helpline: "1334",
        headOffice: "WASA Complex, Shamsabad, LMQ Road, Multan, Punjab",
        portalUrl: "https://wasamultan.punjab.gov.pk",
        defaultDays: 4
      };
    }

    // KP: WSSP / WSSC
    if (isKP) {
      return {
        name: `Water and Sanitation Services Company (WSSP / WSSC - ${city})`,
        nameUrdu: `واٹر اینڈ سینی ٹیشن سروسز کمپنی (${city})`,
        category: "Water & Sanitation",
        email: "complaints@wssp.org.pk",
        secondaryEmail: "info@wssp.org.pk",
        helpline: "1334",
        headOffice: "WSSP Head Office, Plot 33, Street 13, Sector E-8, Phase VII, Hayatabad, Peshawar, KP",
        portalUrl: "https://wssp.org.pk",
        defaultDays: 4
      };
    }

    // Quetta / Balochistan: WASA QDA
    if (isBalochistan) {
      return {
        name: `Water and Sanitation Authority Quetta (WASA QDA - ${city})`,
        nameUrdu: `واٹر اینڈ سینی ٹیشن اتھارٹی بلوچستان (${city})`,
        category: "Water & Sanitation",
        email: "complaints@wasaquetta.gob.pk",
        secondaryEmail: "info@balochistan.gov.pk",
        helpline: "1334",
        headOffice: "WASA Complex, Zarghoon Road, Quetta, Balochistan",
        portalUrl: "https://balochistan.gov.pk",
        defaultDays: 4
      };
    }

    // AJK & GB
    if (isAJK || isGB) {
      return {
        name: `Public Health Engineering & Municipal Water Department (${city})`,
        nameUrdu: `محکمہ پبلک ہیلتھ انجینئرنگ و فراہمی آب (${city})`,
        category: "Water & Sanitation",
        email: `water@${citySlug}.gov.pk`,
        secondaryEmail: commissionerEmail,
        helpline: "1334",
        headOffice: `PHE Municipal Water Complex, ${city}`,
        portalUrl: isAJK ? "https://ajk.gov.pk" : "https://gb.gov.pk",
        defaultDays: 4
      };
    }

    // Lahore Division & Default Punjab: WASA LDA
    return {
      name: `Water & Sanitation Agency Lahore (WASA LDA - ${city})`,
      nameUrdu: `واٹر اینڈ سینی ٹیشن ایجنسی لاہور (واسا ایل ڈی اے)`,
      category: "Water & Sanitation",
      email: "complaints@wasa.punjab.gov.pk",
      secondaryEmail: "info@wasa.punjab.gov.pk",
      helpline: "1334",
      headOffice: "WASA Head Office, Zahoor Elahi Road, Gulberg-II, Lahore, Punjab",
      portalUrl: "https://wasa.punjab.gov.pk",
      defaultDays: 4
    };
  }

  // =========================================================================
  // 3. WASTE MANAGEMENT & MUNICIPAL SOLID REFUSE
  // =========================================================================
  if (deptKey === 'waste') {
    // All Sindh: Sindh Solid Waste Management Board (SSWMB)
    if (isSindh) {
      const isKhairpurSukkur = cityLower.includes('khairpur') || cityLower.includes('sukkur') || cityLower.includes('ghotki');
      return {
        name: `Sindh Solid Waste Management Board (SSWMB - ${city} Operations)`,
        nameUrdu: `سندھ سالڈ ویسٹ مینجمنٹ بورڈ (${city} زون)`,
        category: "Waste Management",
        email: "complaints@sswmb.gos.pk",
        secondaryEmail: "info@sswmb.gos.pk",
        helpline: "1128",
        headOffice: isKhairpurSukkur
          ? "SSWMB Regional Operations Center, DC Secretariat Complex, Khairpur / Minara Road, Sukkur, Sindh"
          : "SSWMB Headquarters, 4th Floor, FTC Building, Main Shahrah-e-Faisal, Karachi, Sindh",
        portalUrl: "https://sswmb.gos.pk",
        defaultDays: 3
      };
    }

    // Islamabad: CDA Sanitation Directorate
    if (isIslamabad) {
      return {
        name: "Capital Development Authority (CDA Sanitation Directorate)",
        nameUrdu: "سی ڈی اے شعبہ سالڈ ویسٹ و صفائی، اسلام آباد",
        category: "Waste Management",
        email: "sanitation@cda.gov.pk",
        secondaryEmail: "complaints@cda.gov.pk",
        helpline: "1334",
        headOffice: "CDA Sanitation Operations Office, Sector G-6/1-4, Islamabad",
        portalUrl: "https://cda.gov.pk",
        defaultDays: 3
      };
    }

    // Rawalpindi: RWMC
    if (cityLower.includes('rawalpindi') || cityLower.includes('murree')) {
      return {
        name: "Rawalpindi Waste Management Company (RWMC)",
        nameUrdu: "راولپنڈی ویسٹ مینجمنٹ کمپنی",
        category: "Waste Management",
        email: "info@rwmc.org.pk",
        secondaryEmail: "complaints@rwmc.org.pk",
        helpline: "1139",
        headOffice: "City District Government Complex, Katchery Chowk, Rawalpindi, Punjab",
        portalUrl: "https://rwmc.org.pk",
        defaultDays: 3
      };
    }

    // Faisalabad: FWMC
    if (cityLower.includes('faisalabad')) {
      return {
        name: "Faisalabad Waste Management Company (FWMC)",
        nameUrdu: "فیصل آباد ویسٹ مینجمنٹ کمپنی",
        category: "Waste Management",
        email: "info@fwmc.com.pk",
        secondaryEmail: "complaints@fwmc.com.pk",
        helpline: "1139",
        headOffice: "FWMC Complex, University Road, Faisalabad, Punjab",
        portalUrl: "https://fwmc.com.pk",
        defaultDays: 3
      };
    }

    // Multan: MWMC
    if (cityLower.includes('multan')) {
      return {
        name: "Multan Waste Management Company (MWMC)",
        nameUrdu: "ملتان ویسٹ مینجمنٹ کمپنی",
        category: "Waste Management",
        email: "info@mwmc.com.pk",
        secondaryEmail: "complaints@mwmc.com.pk",
        helpline: "1139",
        headOffice: "Shamsabad, LMQ Road, Multan, Punjab",
        portalUrl: "https://mwmc.com.pk",
        defaultDays: 3
      };
    }

    // Gujranwala: GWMC
    if (cityLower.includes('gujranwala')) {
      return {
        name: "Gujranwala Waste Management Company (GWMC)",
        nameUrdu: "گوجرانوالہ ویسٹ مینجمنٹ کمپنی",
        category: "Waste Management",
        email: "info@gwmc.com.pk",
        secondaryEmail: "complaints@gwmc.com.pk",
        helpline: "1139",
        headOffice: "Trust Plaza, G.T. Road, Gujranwala, Punjab",
        portalUrl: "https://gwmc.com.pk",
        defaultDays: 3
      };
    }

    // Sialkot: SWMC
    if (cityLower.includes('sialkot')) {
      return {
        name: "Sialkot Waste Management Company (SWMC)",
        nameUrdu: "سیالکوٹ ویسٹ مینجمنٹ کمپنی",
        category: "Waste Management",
        email: "info@swmc.com.pk",
        secondaryEmail: "complaints@swmc.com.pk",
        helpline: "1139",
        headOffice: "Paris Road, Sialkot, Punjab",
        portalUrl: "https://swmc.com.pk",
        defaultDays: 3
      };
    }

    // Bahawalpur: BWMC
    if (cityLower.includes('bahawalpur')) {
      return {
        name: "Bahawalpur Waste Management Company (BWMC)",
        nameUrdu: "بہاولپور ویسٹ مینجمنٹ کمپنی",
        category: "Waste Management",
        email: "info@bwmc.com.pk",
        secondaryEmail: "complaints@bwmc.com.pk",
        helpline: "1139",
        headOffice: "Noor Mahal Road, Bahawalpur, Punjab",
        portalUrl: "https://bwmc.com.pk",
        defaultDays: 3
      };
    }

    // KP: WSSP Sanitation Wing
    if (isKP) {
      return {
        name: `Water & Sanitation Services Company Sanitation Cell (${city})`,
        nameUrdu: `محکمہ سالڈ ویسٹ و صفائی خیبر پختونخوا (${city})`,
        category: "Waste Management",
        email: "info@wssp.org.pk",
        secondaryEmail: "complaints@wssp.org.pk",
        helpline: "1334",
        headOffice: "WSSP Complex, Sector E-8, Phase VII, Hayatabad, Peshawar, KP",
        portalUrl: "https://wssp.org.pk",
        defaultDays: 3
      };
    }

    // Balochistan: Metropolitan Corporation Quetta
    if (isBalochistan) {
      return {
        name: `Metropolitan Corporation Solid Waste Directorate (${city})`,
        nameUrdu: `محکمہ سالڈ ویسٹ و صفائی بلوچستان (${city})`,
        category: "Waste Management",
        email: "solidwaste@mcquetta.gob.pk",
        secondaryEmail: "info@balochistan.gov.pk",
        helpline: "081-9201087",
        headOffice: "Metropolitan Corporation Headquarters, M.A. Jinnah Road, Quetta, Balochistan",
        portalUrl: "https://balochistan.gov.pk",
        defaultDays: 3
      };
    }

    // AJK & GB
    if (isAJK || isGB) {
      return {
        name: `Municipal Corporation Sanitation & Refuse Cell (${city})`,
        nameUrdu: `میونسپل کارپوریشن شعبہ صفائی (${city})`,
        category: "Waste Management",
        email: `waste@${citySlug}.gov.pk`,
        secondaryEmail: commissionerEmail,
        helpline: "1139",
        headOffice: `Municipal Corporation Building, ${city}`,
        portalUrl: isAJK ? "https://ajk.gov.pk" : "https://gb.gov.pk",
        defaultDays: 3
      };
    }

    // Lahore Division & Default Punjab: LWMC
    return {
      name: `Lahore Waste Management Company (LWMC - ${city})`,
      nameUrdu: `لاہور ویسٹ مینجمنٹ کمپنی (ایل ڈبلیو ایم سی)`,
      category: "Waste Management",
      email: "info@lwmc.com.pk",
      secondaryEmail: "complaints@lwmc.com.pk",
      helpline: "1139",
      headOffice: "Shaheen Complex, 7th Floor, Egerton Road, Lahore, Punjab",
      portalUrl: "https://lwmc.com.pk",
      defaultDays: 3
    };
  }

  // =========================================================================
  // 4. ROADS, HIGHWAYS & BRIDGES
  // =========================================================================
  if (deptKey === 'roads') {
    // Karachi Urban Highways & Thoroughfares: KMC
    if (cityLower.includes('karachi')) {
      return {
        name: "Karachi Metropolitan Corporation (KMC Engineering & Roads Directorate)",
        nameUrdu: "کراچی میٹروپولیٹن کارپوریشن (شعبہ شاہرات و تعمیرات)",
        category: "Roads & Infrastructure",
        email: "complaints@kmc.gos.pk",
        secondaryEmail: "administrator@kmc.gos.pk",
        helpline: "1339",
        headOffice: "KMC Head Office, M.A. Jinnah Road, Karachi, Sindh",
        portalUrl: "https://kmc.gos.pk",
        defaultDays: 14
      };
    }

    // Sukkur & Khairpur Circle: Works & Services Sindh
    if (cityLower.includes('sukkur') || cityLower.includes('khairpur') || cityLower.includes('ghotki') || cityLower.includes('larkana')) {
      return {
        name: `Works & Services Department, Government of Sindh (${city} Circle)`,
        nameUrdu: `محکمہ ورکس اینڈ سروسز حکومت سندھ (ضلع ${city})`,
        category: "Roads & Infrastructure",
        email: "secretary@works.sindh.gov.pk",
        secondaryEmail: dcEmail,
        helpline: "071-9310500",
        headOffice: `Executive Engineer C&W Complex, Station Road, Khairpur / Minara Road, Sukkur, Sindh`,
        portalUrl: "https://works.sindh.gov.pk",
        defaultDays: 14
      };
    }

    // Other Sindh Districts
    if (isSindh) {
      return {
        name: `Works & Services Department, Government of Sindh (${city} Circle)`,
        nameUrdu: `محکمہ ورکس اینڈ سروسز حکومت سندھ (${city})`,
        category: "Roads & Infrastructure",
        email: "secretary@works.sindh.gov.pk",
        secondaryEmail: commissionerEmail,
        helpline: "021-99211425",
        headOffice: `Works & Services Secretariat, 3rd Floor, Tughlaq House, Sindh Secretariat, Karachi, Sindh`,
        portalUrl: "https://works.sindh.gov.pk",
        defaultDays: 14
      };
    }

    // Islamabad: CDA Roads Directorate
    if (isIslamabad) {
      return {
        name: "Capital Development Authority (CDA Roads & Maintenance Directorate)",
        nameUrdu: "سی ڈی اے شعبہ شاہرات و مرمت، اسلام آباد",
        category: "Roads & Infrastructure",
        email: "roads@cda.gov.pk",
        secondaryEmail: "complaints@cda.gov.pk",
        helpline: "1334",
        headOffice: "CDA Headquarters, Sector G-7/4, Islamabad",
        portalUrl: "https://cda.gov.pk",
        defaultDays: 10
      };
    }

    // Lahore: LDA Engineering Wing
    if (cityLower.includes('lahore')) {
      return {
        name: "Lahore Development Authority (LDA Engineering & Roads Wing)",
        nameUrdu: "لاہور ڈویلپمنٹ اتھارٹی (ایل ڈی اے شعبہ شاہرات و تعمیرات)",
        category: "Roads & Infrastructure",
        email: "complaints@lda.gop.pk",
        secondaryEmail: "secretary@works.punjab.gov.pk",
        helpline: "042-99030000",
        headOffice: "LDA Complex, 467-D-II, Main Boulevard, M.A. Johar Town, Lahore, Punjab",
        portalUrl: "https://lda.gop.pk",
        defaultDays: 14
      };
    }

    // Khyber Pakhtunkhwa: C&W KP
    if (isKP) {
      return {
        name: `Communication & Works Department KP (C&W KP - ${city} Division)`,
        nameUrdu: `محکمہ مواصلات و تعمیرات خیبر پختونخوا (${city})`,
        category: "Roads & Infrastructure",
        email: "secretary@cwd.kp.gov.pk",
        secondaryEmail: commissionerEmail,
        helpline: "091-9210860",
        headOffice: `C&W Building, Police Road, Peshawar, Khyber Pakhtunkhwa`,
        portalUrl: "https://cwd.kp.gov.pk",
        defaultDays: 14
      };
    }

    // Balochistan: C&W Balochistan
    if (isBalochistan) {
      return {
        name: `Communication, Works & Physical Planning Department (${city})`,
        nameUrdu: `محکمہ مواصلات و تعمیرات بلوچستان (${city})`,
        category: "Roads & Infrastructure",
        email: "secretary@cw.balochistan.gov.pk",
        secondaryEmail: commissionerEmail,
        helpline: "081-9201416",
        headOffice: `Block 9, Civil Secretariat, Quetta, Balochistan`,
        portalUrl: "https://balochistan.gov.pk",
        defaultDays: 14
      };
    }

    // AJK & GB
    if (isAJK || isGB) {
      return {
        name: `Public Works Department Highways (${city})`,
        nameUrdu: `محکمہ شاہرات و مواصلات (${city})`,
        category: "Roads & Infrastructure",
        email: `roads@${citySlug}.gov.pk`,
        secondaryEmail: commissionerEmail,
        helpline: "05822-920001",
        headOffice: `PWD Highway Secretariat, ${city}`,
        portalUrl: isAJK ? "https://ajk.gov.pk" : "https://gb.gov.pk",
        defaultDays: 14
      };
    }

    // Punjab Districts Default: C&W Punjab
    return {
      name: `Communication & Works Department, Government of Punjab (C&W - ${city} Circle)`,
      nameUrdu: `محکمہ مواصلات و تعمیرات حکومت پنجاب (${city})`,
      category: "Roads & Infrastructure",
      email: "secretary@works.punjab.gov.pk",
      secondaryEmail: commissionerEmail,
      helpline: "042-99211025",
      headOffice: `Punjab Civil Secretariat, Lower Mall, Lahore, Punjab`,
      portalUrl: "https://cwd.punjab.gov.pk",
      defaultDays: 14
    };
  }

  // =========================================================================
  // 5. GENERAL PUBLIC SAFETY, LAW & ORDER & MUNICIPAL ADMINISTRATION
  // =========================================================================
  return {
    name: `District Administration & Deputy Commissioner Secretariat (${city})`,
    nameUrdu: `ضلعی انتظامیہ و ڈپٹی کمشنر سیکرٹریٹ (${city})`,
    category: "Public Safety & Municipal",
    email: dcEmail,
    secondaryEmail: commissionerEmail,
    helpline: adminHelpline,
    headOffice: `Deputy Commissioner Secretariat & Court Complex, ${city}`,
    portalUrl: isSindh ? "https://sindh.gov.pk" : isIslamabad ? "https://ict.gov.pk" : isKP ? "https://kp.gov.pk" : isBalochistan ? "https://balochistan.gov.pk" : isAJK ? "https://ajk.gov.pk" : isGB ? "https://gb.gov.pk" : "https://punjab.gov.pk",
    defaultDays: 7
  };
}

async function transcribeAudioWithWhisper(audioFilePath) {
  const groqKey = process.env.GROQ_API_KEY;
  if (!groqKey) {
    throw new Error("GROQ_API_KEY not configured for Whisper transcription.");
  }

  const formData = new FormData();
  formData.append('file', fs.createReadStream(audioFilePath));
  formData.append('model', 'whisper-large-v3');
  formData.append('prompt', 'عوامی شکایت: پانی، سڑک، گڑھے، نالہ، کچرا، بجلی، ٹرانسفارمر، تار، سیوریج، گٹر');
  formData.append('response_format', 'json');

  const response = await axios.post('https://api.groq.com/openai/v1/audio/transcriptions', formData, {
    headers: {
      ...formData.getHeaders(),
      'Authorization': 'Bearer ' + groqKey
    },
    timeout: 25000
  });

  return response.data.text;
}

function analyzeCivicIssueLocally(rawText, rawCity = 'Lahore', citizenName = null) {
  const lower = (rawText || "").toLowerCase();
  
  let deptKey = 'safety';
  let urgency = 'medium';
  let title = 'Urgent Civic Infrastructure Rectification Request';

  let incidentSummaryFormal = 'Urgent civic infrastructure rectification and public hazard mitigation requested by neighborhood residents.';

  if (lower.match(/bijli|electricity|light|wire|pole|current|transformer|taar|شارٹ سرکٹ|بجلی|تار/i)) {
    deptKey = 'electricity';
    title = 'Public Electrocution Hazard & Dangling High-Voltage Cable Notice';
    urgency = lower.match(/current|nangi|spark|wire|fire|کرنٹ|خطرہ/) ? 'critical' : 'high';
    incidentSummaryFormal = 'Exposed high-voltage electrical cabling hanging over pedestrian pathways or malfunctioning power transformer unit presenting an acute risk of electrocution, short-circuit fire, and disruption of civic electricity supply.';
  } else if (lower.match(/pani|water|pipe|leak|line|sewer|gutter|drain|nala|سیوریج|پانی|نلکا|گٹر/i)) {
    deptKey = 'water';
    title = 'Urgent Notice: Ruptured Water Main & Supply Contamination';
    urgency = lower.match(/urgent|ganda|peene|burst|contamination|phat|بند|سیوریج/) ? 'critical' : 'high';
    incidentSummaryFormal = 'Ruptured municipal water distribution line and compromised sanitation network causing active sewage overflow, severe potable water contamination, and acute environmental health hazards for surrounding residents.';
  } else if (lower.match(/kachra|waste|garbage|safai|dabba|smell|dump|badboo|کوڑا|صفائی|بدبو/i)) {
    deptKey = 'waste';
    title = 'Severe Municipal Solid Waste Accumulation & Health Hazard';
    urgency = lower.match(/bimari|badboo|disease|school|تعفن/) ? 'high' : 'medium';
    incidentSummaryFormal = 'Substantial untreated municipal solid waste accumulation and illegal open refuse dumping causing pest infestation, noxious odors, and toxic environmental contamination near populated residential zones.';
  } else if (lower.match(/road|sarak|pot hole|pothole|gaddha|gadha|tooti|traffic|asphalt|سڑک|گڑھے|مرمت/i)) {
    deptKey = 'roads';
    title = 'Hazardous Potholes and Major Roadway Degradation Notice';
    urgency = lower.match(/accident|baray|block|حادثہ|شدید/) ? 'high' : 'medium';
    incidentSummaryFormal = 'Severe roadway deterioration and hazardous craters/potholes spanning the thoroughfare, directly causing vehicular collisions, traffic disruption, and imminent danger of physical injury to commuters.';
  }

  const dept = getDepartmentRouting(deptKey, rawCity);

  return {
    title,
    incidentSummaryFormal,
    category: dept.category,
    department: dept.name,
    departmentUrdu: dept.nameUrdu,
    departmentEmail: dept.email,
    departmentSecondaryEmail: dept.secondaryEmail,
    departmentHelpline: dept.helpline,
    departmentHeadOffice: dept.headOffice,
    departmentPortalUrl: dept.portalUrl,
    urgency,
    estimatedDays: dept.defaultDays,
    formalComplaintEnglish: "SUBJECT: FORMAL CITIZEN GRIEVANCE REGARDING " + dept.category.toUpperCase() + "\n\nTo: The Executive Authority / Managing Director,\n" + dept.name + " (" + rawCity + ")\n\nRespected Sir/Madam,\n\nI am writing to formally submit a high-priority citizen grievance concerning civic infrastructure in our municipal jurisdiction (" + rawCity + ").\n\nSUMMARY OF INCIDENT/ISSUE (FORMAL CIVIL REPORT):\n" + incidentSummaryFormal + "\n\nCITIZEN VERBATIM STATEMENT:\n\"" + rawText + "\"\n\nIMPACT ON PUBLIC LIFE:\nThe current situation poses immediate health and safety hazards, substantial inconvenience to daily commuters, and severe disruption to neighborhood residents.\n\nSTATUTORY REQUEST:\nPursuant to the Public Services and Consumer Protection standards, you are earnestly requested to deploy an emergency technical maintenance team to inspect the site and execute permanent corrective repair works without delay.\n\nYours sincerely,\n" + (citizenName ? citizenName + "\nVerified Citizen Applicant (" + rawCity + ")" : "Concerned Citizens & Residents Committee (" + rawCity + ")"),
    formalComplaintUrdu: "بخدمت جناب مینیجنگ ڈائریکٹر / مجاز اتھارٹی، " + dept.nameUrdu + "۔\n\nعنوان: باضابطہ عوامی شکایت بابت " + dept.category + " (" + rawCity + ")۔\n\nجناب عالی!\nگزارش ہے کہ ہمارے علاقے (" + rawCity + ") میں درج ذیل سنگین شہری مسئلہ درپیش ہے جس سے معمولاتِ زندگی بری طرح متاثر ہیں:\n\"" + rawText + "\"\n\nاس خرابی کے باعث اہل علاقہ کو شدید مشکلات اور حفاظتی خطرات لاحق ہیں۔\nمفاد عامہ اور سرکاری ضابطہ اخلاق کے تحت فوری ریپئرنگ اسکواڈ روانہ فرما کر مسئلہ حل کرنے کے احکامات صادر فرمائے جائیں۔\n\nالعارض:\n" + (citizenName ? citizenName + "\nرجسٹرڈ شہری (" + rawCity + ")" : "اہل علاقہ و شہری کونسل (" + rawCity + ")")
  };
}

function categoryToDeptKey(category, text = '') {
  if (category) {
    const c = category.toLowerCase();
    if (c.includes('elect') || c.includes('power') || c.includes('energy')) return 'electricity';
    if (c.includes('water') || c.includes('sanitation') || c.includes('sewer')) return 'water';
    if (c.includes('waste') || c.includes('garbage') || c.includes('solid') || c.includes('refuse')) return 'waste';
    if (c.includes('road') || c.includes('infrastructure') || c.includes('traffic')) return 'roads';
    if (c.includes('safety') || c.includes('municipal') || c.includes('admin')) return 'safety';
  }

  const t = (text || '').toLowerCase();
  if (t.match(/bijli|elect|power|transformer|current|spark|wire|pole|taar|شارٹ سرکٹ|بجلی|تار/i)) return 'electricity';
  if (t.match(/pani|water|pipe|leak|sewer|gutter|drain|nala|سیوریج|پانی|نلکا|گٹر/i)) return 'water';
  if (t.match(/kachra|waste|garbage|trash|safai|dabba|dump|badboo|کوڑا|صفائی|بدبو/i)) return 'waste';
  if (t.match(/pothole|gaddha|gadha|tooti|asphalt|سڑک|گڑھے|مرمت/i) || t.match(/road|sarak/i)) return 'roads';
  return 'safety';
}

async function processCivicComplaint({ text, photoPath = null, location = null, city = null, citizenName = null }) {
  const targetCity = (city || (location && location.city) || 'Lahore').trim();
  const qwenKey = process.env.DASHSCOPE_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;

  const prompt = `You are MUASHRA AI, an expert municipal grievance drafting engine for Pakistan public administration.
The citizen is reporting an issue in ${targetCity}, Pakistan.
Analyze the following citizen report (Urdu, Roman Urdu, or English):
"${text}"

Generate a highly professional, formal government petition in pure JSON format matching this schema:
{
  "title": "Formal administrative subject line in English (e.g. Ruptured Water Distribution Main & Severe Supply Disruption)",
  "incidentSummaryFormal": "Comprehensive formal English summary of the reported incident (translating from Urdu/Roman Urdu if needed), detailing the exact physical problem, damage, hazard, and disruption in professional administrative English",
  "category": "Roads & Infrastructure" | "Water & Sanitation" | "Waste Management" | "Electricity & Power" | "Public Safety & Municipal",
  "department": "Exact name of Pakistan Department in ${targetCity}",
  "departmentUrdu": "Department name in Urdu script",
  "urgency": "low" | "medium" | "high" | "critical",
  "estimatedDays": 5,
  "formalComplaintEnglish": "Full formal English grievance petition with formal greeting, background, and legal request for ${targetCity}",
  "formalComplaintUrdu": "Full formal Urdu petition script (بخدمت جناب...)"
}`;

  if (qwenKey && qwenKey.startsWith('sk-') && !qwenKey.includes('sk-ws-')) {
    try {
      const response = await axios.post(
        'https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions',
        {
          model: 'qwen-plus',
          messages: [
            { role: 'system', content: `You are MUASHRA AI, creating formal official administrative petitions for Pakistan government agencies in ${targetCity}.` },
            { role: 'user', content: prompt }
          ],
          response_format: { type: "json_object" }
        },
        {
          headers: { 'Authorization': 'Bearer ' + qwenKey, 'Content-Type': 'application/json' },
          timeout: 10000
        }
      );
      const parsed = JSON.parse(response.data.choices[0].message.content);
      const local = analyzeCivicIssueLocally(text, targetCity, citizenName);
      const deptKey = categoryToDeptKey(parsed.category || local.category, text);
      const routedDept = getDepartmentRouting(deptKey, targetCity);

      return {
        ...local,
        ...parsed,
        category: routedDept.category,
        department: routedDept.name,
        departmentUrdu: routedDept.nameUrdu,
        departmentEmail: routedDept.email,
        departmentSecondaryEmail: routedDept.secondaryEmail,
        departmentHelpline: routedDept.helpline,
        departmentHeadOffice: routedDept.headOffice,
        departmentPortalUrl: routedDept.portalUrl,
        estimatedDays: parsed.estimatedDays || routedDept.defaultDays || local.estimatedDays
      };
    } catch (err) {
      console.warn("Qwen API call error:", err.message);
    }
  }

  if (groqKey) {
    try {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: `You are MUASHRA AI. You draft formal administrative grievance petitions in English and Urdu for Pakistani government departments in ${targetCity}. Always output valid JSON only.` },
            { role: 'user', content: prompt }
          ],
          response_format: { type: "json_object" }
        },
        {
          headers: { 'Authorization': 'Bearer ' + groqKey, 'Content-Type': 'application/json' },
          timeout: 12000
        }
      );
      const parsed = JSON.parse(response.data.choices[0].message.content);
      const local = analyzeCivicIssueLocally(text, targetCity, citizenName);
      const deptKey = categoryToDeptKey(parsed.category || local.category, text);
      const routedDept = getDepartmentRouting(deptKey, targetCity);

      return {
        ...local,
        ...parsed,
        category: routedDept.category,
        department: routedDept.name,
        departmentUrdu: routedDept.nameUrdu,
        departmentEmail: routedDept.email,
        departmentSecondaryEmail: routedDept.secondaryEmail,
        departmentHelpline: routedDept.helpline,
        departmentHeadOffice: routedDept.headOffice,
        departmentPortalUrl: routedDept.portalUrl,
        estimatedDays: parsed.estimatedDays || routedDept.defaultDays || local.estimatedDays
      };
    } catch (err) {
      console.warn("Groq LLM call error, using local analyzer:", err.message);
    }
  }

  return analyzeCivicIssueLocally(text, targetCity, citizenName);
}

module.exports = {
  processCivicComplaint,
  transcribeAudioWithWhisper,
  analyzeCivicIssueLocally,
  getDepartmentRouting
};
