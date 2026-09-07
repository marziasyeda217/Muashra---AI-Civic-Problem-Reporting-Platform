import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Loader2, Search, Crosshair, Eye } from 'lucide-react';

export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

// Complete list of all districts and municipal divisions of Pakistan (All Cities)
export const PAKISTAN_DISTRICTS = [
  "Abbottabad",
  "Ahmedpur East",
  "Alipur",
  "Arifwala",
  "Astore",
  "Attock",
  "Awaran",
  "Badin",
  "Bagh",
  "Bahawalnagar",
  "Bahawalpur",
  "Bajaur",
  "Bannu",
  "Barkhan",
  "Batkhela",
  "Battagram",
  "Bhakkar",
  "Bhalwal",
  "Bhimber",
  "Buner",
  "Burewala",
  "Chagai",
  "Chakwal",
  "Chaman",
  "Charsadda",
  "Chichawatni",
  "Chiniot",
  "Chishtian",
  "Chitral",
  "Dadu",
  "Daharki",
  "Daska",
  "Dera Bugti",
  "Dera Ghazi Khan",
  "Dera Ismail Khan",
  "Dera Murad Jamali",
  "Diamer",
  "Dina",
  "Duki",
  "Faisalabad",
  "Ferozwala",
  "Ghotki",
  "Gilgit",
  "Gojra",
  "Gujar Khan",
  "Gujranwala",
  "Gujrat",
  "Gwadar",
  "Hafizabad",
  "Hala",
  "Hangu",
  "Haripur",
  "Harnai",
  "Haroonabad",
  "Hasilpur",
  "Hattian Bala",
  "Haveli",
  "Hub",
  "Hunza",
  "Hyderabad",
  "Islamabad",
  "Jacobabad",
  "Jafarabad",
  "Jalalpur Jattan",
  "Jampur",
  "Jamshoro",
  "Jaranwala",
  "Jhal Magsi",
  "Jhang",
  "Jhelum",
  "Kabal",
  "Kahror Pakka",
  "Kalat",
  "Kamalia",
  "Kamoke",
  "Kandhkot",
  "Karachi",
  "Karak",
  "Kashmore",
  "Kasur",
  "Khairpur",
  "Khanewal",
  "Khanpur",
  "Kharan",
  "Kharian",
  "Kharmang",
  "Khushab",
  "Khuzdar",
  "Khyber",
  "Killa Abdullah",
  "Killa Saifullah",
  "Kohat",
  "Kohlu",
  "Kot Addu",
  "Kotli",
  "Kotri",
  "Kurram",
  "Lahore",
  "Lakki Marwat",
  "Lalamusa",
  "Larkana",
  "Lasbela",
  "Layyah",
  "Lodhran",
  "Loralai",
  "Mailsi",
  "Malakand",
  "Mandi Bahauddin",
  "Mansehra",
  "Mardan",
  "Mastung",
  "Matiari",
  "Mian Channu",
  "Mianwali",
  "Mingora",
  "Mirpur (AJK)",
  "Mirpur Khas",
  "Mirpur Mathelo",
  "Mithi",
  "Mohmand",
  "Moro",
  "Multan",
  "Muridke",
  "Murree",
  "Muzaffarabad",
  "Muzaffargarh",
  "Nagar",
  "Nankana Sahib",
  "Narowal",
  "Nasirabad",
  "Naushahro Feroze",
  "Nawabshah",
  "Neelum",
  "North Waziristan",
  "Nowshera",
  "Nushki",
  "Okara",
  "Orakzai",
  "Pakpattan",
  "Panjgur",
  "Pano Akil",
  "Pasni",
  "Pattoki",
  "Peshawar",
  "Pishin",
  "Qambar Shahdadkot",
  "Quetta",
  "Rahim Yar Khan",
  "Rajanpur",
  "Rawalakot",
  "Rawalpindi",
  "Rohri",
  "Sadiqabad",
  "Sahiwal",
  "Sambrial",
  "Samundri",
  "Sanghar",
  "Sargodha",
  "Sehwan Sharif",
  "Shahdadpur",
  "Shahkot",
  "Shakargarh",
  "Shangla",
  "Sheikhupura",
  "Shigar",
  "Shikarpur",
  "Shorkot",
  "Shujabad",
  "Sialkot",
  "Sibi",
  "Skardu",
  "Sohbatpur",
  "South Waziristan",
  "Sudhanoti",
  "Sujawal",
  "Sukkur",
  "Swabi",
  "Swat",
  "Talagang",
  "Tando Adam",
  "Tando Allahyar",
  "Tando Muhammad Khan",
  "Tank",
  "Taxila",
  "Taunsa",
  "Thatta",
  "Toba Tek Singh",
  "Turbat",
  "Umerkot",
  "Upper Dir",
  "Lower Dir",
  "Usta Muhammad",
  "Vehari",
  "Wah Cantt",
  "Washuk",
  "Wazirabad",
  "Zhob",
  "Ziarat"
];

// Complete coordinates database for all districts and municipal cities of Pakistan
export const CITY_COORDINATES = {
  "Abbottabad": {
    "lat": 34.1688,
    "lng": 73.2215
  },
  "Ahmedpur East": {
    "lat": 29.1431,
    "lng": 71.2588
  },
  "Alipur": {
    "lat": 29.3844,
    "lng": 70.9122
  },
  "Arifwala": {
    "lat": 30.2925,
    "lng": 73.0617
  },
  "Astore": {
    "lat": 35.3667,
    "lng": 74.85
  },
  "Attock": {
    "lat": 33.7667,
    "lng": 72.3667
  },
  "Awaran": {
    "lat": 26.4568,
    "lng": 65.2314
  },
  "Badin": {
    "lat": 24.656,
    "lng": 68.837
  },
  "Bagh": {
    "lat": 33.98,
    "lng": 73.7747
  },
  "Bahawalnagar": {
    "lat": 29.9984,
    "lng": 73.2536
  },
  "Bahawalpur": {
    "lat": 29.3544,
    "lng": 71.6911
  },
  "Bajaur": {
    "lat": 34.7865,
    "lng": 71.5249
  },
  "Bannu": {
    "lat": 32.9861,
    "lng": 70.6042
  },
  "Barkhan": {
    "lat": 29.8977,
    "lng": 69.5256
  },
  "Batkhela": {
    "lat": 34.6186,
    "lng": 71.9722
  },
  "Battagram": {
    "lat": 34.6772,
    "lng": 73.0233
  },
  "Bhakkar": {
    "lat": 31.6269,
    "lng": 71.065
  },
  "Bhalwal": {
    "lat": 32.2656,
    "lng": 72.9009
  },
  "Bhimber": {
    "lat": 32.9744,
    "lng": 74.0786
  },
  "Buner": {
    "lat": 34.4333,
    "lng": 72.3333
  },
  "Burewala": {
    "lat": 30.1589,
    "lng": 72.6817
  },
  "Chagai": {
    "lat": 29.3,
    "lng": 64.7
  },
  "Chakwal": {
    "lat": 32.9328,
    "lng": 72.855
  },
  "Chaman": {
    "lat": 30.921,
    "lng": 66.4597
  },
  "Charsadda": {
    "lat": 34.1482,
    "lng": 71.7308
  },
  "Chichawatni": {
    "lat": 30.5333,
    "lng": 72.7
  },
  "Chiniot": {
    "lat": 31.72,
    "lng": 72.9789
  },
  "Chishtian": {
    "lat": 29.7972,
    "lng": 72.8578
  },
  "Chitral": {
    "lat": 35.851,
    "lng": 71.7864
  },
  "Dadu": {
    "lat": 26.7319,
    "lng": 67.775
  },
  "Daharki": {
    "lat": 28.0436,
    "lng": 69.6978
  },
  "Daska": {
    "lat": 32.3242,
    "lng": 74.3508
  },
  "Dera Bugti": {
    "lat": 29.0304,
    "lng": 69.1586
  },
  "Dera Ghazi Khan": {
    "lat": 30.0561,
    "lng": 70.6348
  },
  "Dera Ismail Khan": {
    "lat": 31.8314,
    "lng": 70.9019
  },
  "Dera Murad Jamali": {
    "lat": 28.5466,
    "lng": 68.2231
  },
  "Diamer": {
    "lat": 35.4167,
    "lng": 74.1
  },
  "Dina": {
    "lat": 33.0236,
    "lng": 73.6006
  },
  "Duki": {
    "lat": 30.1539,
    "lng": 68.5722
  },
  "Faisalabad": {
    "lat": 31.4504,
    "lng": 73.135
  },
  "Ferozwala": {
    "lat": 31.6742,
    "lng": 74.2869
  },
  "Ghotki": {
    "lat": 28.0064,
    "lng": 69.3161
  },
  "Gilgit": {
    "lat": 35.9221,
    "lng": 74.3087
  },
  "Gojra": {
    "lat": 31.1492,
    "lng": 72.6836
  },
  "Gujar Khan": {
    "lat": 33.2547,
    "lng": 73.3042
  },
  "Gujranwala": {
    "lat": 32.1877,
    "lng": 74.1945
  },
  "Gujrat": {
    "lat": 32.5742,
    "lng": 74.0754
  },
  "Gwadar": {
    "lat": 25.1264,
    "lng": 62.3225
  },
  "Hafizabad": {
    "lat": 32.0679,
    "lng": 73.6857
  },
  "Hala": {
    "lat": 25.8114,
    "lng": 68.4217
  },
  "Hangu": {
    "lat": 33.5281,
    "lng": 71.0578
  },
  "Haripur": {
    "lat": 33.9997,
    "lng": 72.9341
  },
  "Harnai": {
    "lat": 30.1008,
    "lng": 67.9372
  },
  "Haroonabad": {
    "lat": 29.6128,
    "lng": 73.1361
  },
  "Hasilpur": {
    "lat": 29.6967,
    "lng": 72.5542
  },
  "Hattian Bala": {
    "lat": 34.1692,
    "lng": 73.7431
  },
  "Haveli": {
    "lat": 33.8647,
    "lng": 74.1092
  },
  "Hub": {
    "lat": 25.0298,
    "lng": 66.8837
  },
  "Hunza": {
    "lat": 36.3167,
    "lng": 74.65
  },
  "Hyderabad": {
    "lat": 25.396,
    "lng": 68.3578
  },
  "Islamabad": {
    "lat": 33.6844,
    "lng": 73.0479
  },
  "Jacobabad": {
    "lat": 28.2819,
    "lng": 68.4375
  },
  "Jafarabad": {
    "lat": 28.3833,
    "lng": 68.2
  },
  "Jalalpur Jattan": {
    "lat": 32.7667,
    "lng": 74.2
  },
  "Jampur": {
    "lat": 29.6431,
    "lng": 70.5956
  },
  "Jamshoro": {
    "lat": 25.4333,
    "lng": 68.2667
  },
  "Jaranwala": {
    "lat": 31.3342,
    "lng": 73.4194
  },
  "Jhal Magsi": {
    "lat": 28.4667,
    "lng": 67.4667
  },
  "Jhang": {
    "lat": 31.2781,
    "lng": 72.3317
  },
  "Jhelum": {
    "lat": 32.9405,
    "lng": 73.7276
  },
  "Kabal": {
    "lat": 34.7933,
    "lng": 72.2778
  },
  "Kahror Pakka": {
    "lat": 29.6247,
    "lng": 71.9167
  },
  "Kalat": {
    "lat": 29.0267,
    "lng": 66.5936
  },
  "Kamalia": {
    "lat": 30.7258,
    "lng": 72.6447
  },
  "Kamoke": {
    "lat": 31.9744,
    "lng": 74.2247
  },
  "Kandhkot": {
    "lat": 28.2439,
    "lng": 69.1797
  },
  "Karachi": {
    "lat": 24.8607,
    "lng": 67.0011
  },
  "Karak": {
    "lat": 33.1111,
    "lng": 71.0925
  },
  "Kashmore": {
    "lat": 28.4333,
    "lng": 69.5833
  },
  "Kasur": {
    "lat": 31.1179,
    "lng": 74.446
  },
  "Khairpur": {
    "lat": 27.5284,
    "lng": 68.7579
  },
  "Khanewal": {
    "lat": 30.3017,
    "lng": 71.9322
  },
  "Khanpur": {
    "lat": 28.6475,
    "lng": 70.6617
  },
  "Kharan": {
    "lat": 28.5703,
    "lng": 65.4161
  },
  "Kharian": {
    "lat": 32.8122,
    "lng": 73.8647
  },
  "Kharmang": {
    "lat": 35.15,
    "lng": 76.0833
  },
  "Khushab": {
    "lat": 32.2967,
    "lng": 72.3525
  },
  "Khuzdar": {
    "lat": 27.8119,
    "lng": 66.6177
  },
  "Khyber": {
    "lat": 33.9167,
    "lng": 71.1667
  },
  "Killa Abdullah": {
    "lat": 30.7333,
    "lng": 66.6667
  },
  "Killa Saifullah": {
    "lat": 30.7008,
    "lng": 68.3597
  },
  "Kohat": {
    "lat": 33.5869,
    "lng": 71.4414
  },
  "Kohlu": {
    "lat": 29.8964,
    "lng": 69.2536
  },
  "Kot Addu": {
    "lat": 30.47,
    "lng": 70.9667
  },
  "Kotli": {
    "lat": 33.5156,
    "lng": 73.9019
  },
  "Kotri": {
    "lat": 25.3667,
    "lng": 68.3167
  },
  "Kurram": {
    "lat": 33.8,
    "lng": 70.1667
  },
  "Lahore": {
    "lat": 31.5204,
    "lng": 74.3587
  },
  "Lakki Marwat": {
    "lat": 32.6136,
    "lng": 70.9114
  },
  "Lalamusa": {
    "lat": 32.6989,
    "lng": 73.9606
  },
  "Larkana": {
    "lat": 27.5589,
    "lng": 68.212
  },
  "Lasbela": {
    "lat": 25.8667,
    "lng": 66.5833
  },
  "Layyah": {
    "lat": 30.9614,
    "lng": 70.9419
  },
  "Lodhran": {
    "lat": 29.5408,
    "lng": 71.6336
  },
  "Loralai": {
    "lat": 30.3703,
    "lng": 68.5981
  },
  "Mailsi": {
    "lat": 29.8,
    "lng": 72.1833
  },
  "Malakand": {
    "lat": 34.5667,
    "lng": 71.9333
  },
  "Mandi Bahauddin": {
    "lat": 32.5872,
    "lng": 73.4917
  },
  "Mansehra": {
    "lat": 34.3333,
    "lng": 73.2
  },
  "Mardan": {
    "lat": 34.1989,
    "lng": 72.045
  },
  "Mastung": {
    "lat": 29.7997,
    "lng": 66.8456
  },
  "Matiari": {
    "lat": 25.5972,
    "lng": 68.4467
  },
  "Mian Channu": {
    "lat": 30.4394,
    "lng": 72.3556
  },
  "Mianwali": {
    "lat": 32.5853,
    "lng": 71.5436
  },
  "Mingora": {
    "lat": 34.7758,
    "lng": 72.3626
  },
  "Mirpur (AJK)": {
    "lat": 33.1484,
    "lng": 73.7519
  },
  "Mirpur Khas": {
    "lat": 25.5276,
    "lng": 69.0125
  },
  "Mirpur Mathelo": {
    "lat": 28.0228,
    "lng": 69.5489
  },
  "Mithi": {
    "lat": 24.7375,
    "lng": 69.7972
  },
  "Mohmand": {
    "lat": 34.45,
    "lng": 71.35
  },
  "Moro": {
    "lat": 26.6636,
    "lng": 68.0003
  },
  "Multan": {
    "lat": 30.1575,
    "lng": 71.5249
  },
  "Muridke": {
    "lat": 31.8028,
    "lng": 74.255
  },
  "Murree": {
    "lat": 33.907,
    "lng": 73.3903
  },
  "Muzaffarabad": {
    "lat": 34.37,
    "lng": 73.4708
  },
  "Muzaffargarh": {
    "lat": 30.075,
    "lng": 71.1928
  },
  "Nagar": {
    "lat": 36.25,
    "lng": 74.65
  },
  "Nankana Sahib": {
    "lat": 31.4492,
    "lng": 73.7125
  },
  "Narowal": {
    "lat": 32.1022,
    "lng": 74.8731
  },
  "Nasirabad": {
    "lat": 28.5833,
    "lng": 68.1833
  },
  "Naushahro Feroze": {
    "lat": 26.84,
    "lng": 68.12
  },
  "Nawabshah": {
    "lat": 26.2483,
    "lng": 68.4096
  },
  "Neelum": {
    "lat": 34.5833,
    "lng": 73.9
  },
  "North Waziristan": {
    "lat": 32.9667,
    "lng": 70.0667
  },
  "Nowshera": {
    "lat": 34.0153,
    "lng": 71.9747
  },
  "Nushki": {
    "lat": 29.5542,
    "lng": 66.0214
  },
  "Okara": {
    "lat": 30.8081,
    "lng": 73.4458
  },
  "Orakzai": {
    "lat": 33.65,
    "lng": 70.95
  },
  "Pakpattan": {
    "lat": 30.3411,
    "lng": 73.3867
  },
  "Panjgur": {
    "lat": 26.9644,
    "lng": 64.0903
  },
  "Pano Akil": {
    "lat": 27.8578,
    "lng": 69.1122
  },
  "Pasni": {
    "lat": 25.2631,
    "lng": 63.4711
  },
  "Pattoki": {
    "lat": 31.0214,
    "lng": 73.8528
  },
  "Peshawar": {
    "lat": 34.0151,
    "lng": 71.5249
  },
  "Pishin": {
    "lat": 30.5803,
    "lng": 66.9961
  },
  "Qambar Shahdadkot": {
    "lat": 27.5861,
    "lng": 68.0014
  },
  "Quetta": {
    "lat": 30.1798,
    "lng": 66.975
  },
  "Rahim Yar Khan": {
    "lat": 28.4195,
    "lng": 70.3026
  },
  "Rajanpur": {
    "lat": 29.1042,
    "lng": 70.325
  },
  "Rawalakot": {
    "lat": 33.8578,
    "lng": 73.7608
  },
  "Rawalpindi": {
    "lat": 33.5651,
    "lng": 73.0169
  },
  "Rohri": {
    "lat": 27.6744,
    "lng": 68.8967
  },
  "Sadiqabad": {
    "lat": 28.3092,
    "lng": 70.1264
  },
  "Sahiwal": {
    "lat": 30.6682,
    "lng": 73.1114
  },
  "Sambrial": {
    "lat": 32.4833,
    "lng": 74.35
  },
  "Samundri": {
    "lat": 31.0639,
    "lng": 72.9622
  },
  "Sanghar": {
    "lat": 26.0467,
    "lng": 68.9481
  },
  "Sargodha": {
    "lat": 32.0836,
    "lng": 72.6711
  },
  "Sehwan Sharif": {
    "lat": 26.4258,
    "lng": 67.8617
  },
  "Shahdadpur": {
    "lat": 25.9261,
    "lng": 68.6214
  },
  "Shahkot": {
    "lat": 31.5714,
    "lng": 73.4847
  },
  "Shakargarh": {
    "lat": 32.2639,
    "lng": 75.16
  },
  "Shangla": {
    "lat": 34.8833,
    "lng": 72.6
  },
  "Sheikhupura": {
    "lat": 31.7131,
    "lng": 73.9783
  },
  "Shigar": {
    "lat": 35.4283,
    "lng": 75.7283
  },
  "Shikarpur": {
    "lat": 27.9578,
    "lng": 68.6381
  },
  "Shorkot": {
    "lat": 30.8333,
    "lng": 72.0667
  },
  "Shujabad": {
    "lat": 29.88,
    "lng": 71.295
  },
  "Sialkot": {
    "lat": 32.4945,
    "lng": 74.5229
  },
  "Sibi": {
    "lat": 29.5447,
    "lng": 67.8764
  },
  "Skardu": {
    "lat": 35.2971,
    "lng": 75.6333
  },
  "Sohbatpur": {
    "lat": 28.52,
    "lng": 68.18
  },
  "South Waziristan": {
    "lat": 32.3333,
    "lng": 69.85
  },
  "Sudhanoti": {
    "lat": 33.7167,
    "lng": 73.6833
  },
  "Sujawal": {
    "lat": 24.6047,
    "lng": 68.0778
  },
  "Sukkur": {
    "lat": 27.7052,
    "lng": 68.8574
  },
  "Swabi": {
    "lat": 34.1203,
    "lng": 72.47
  },
  "Swat": {
    "lat": 35.2227,
    "lng": 72.4258
  },
  "Talagang": {
    "lat": 32.9281,
    "lng": 72.4172
  },
  "Tando Adam": {
    "lat": 25.7686,
    "lng": 68.6625
  },
  "Tando Allahyar": {
    "lat": 25.4606,
    "lng": 68.7172
  },
  "Tando Muhammad Khan": {
    "lat": 25.1239,
    "lng": 68.5372
  },
  "Tank": {
    "lat": 32.2217,
    "lng": 70.3792
  },
  "Taxila": {
    "lat": 33.7461,
    "lng": 72.8392
  },
  "Taunsa": {
    "lat": 30.7042,
    "lng": 70.6506
  },
  "Thatta": {
    "lat": 24.7475,
    "lng": 67.9236
  },
  "Toba Tek Singh": {
    "lat": 30.9744,
    "lng": 72.4831
  },
  "Turbat": {
    "lat": 26.0081,
    "lng": 63.054
  },
  "Umerkot": {
    "lat": 25.3614,
    "lng": 69.7369
  },
  "Upper Dir": {
    "lat": 35.2078,
    "lng": 71.8764
  },
  "Lower Dir": {
    "lat": 34.8475,
    "lng": 71.9056
  },
  "Usta Muhammad": {
    "lat": 28.1794,
    "lng": 68.0447
  },
  "Vehari": {
    "lat": 30.0419,
    "lng": 72.3528
  },
  "Wah Cantt": {
    "lat": 33.7715,
    "lng": 72.7511
  },
  "Washuk": {
    "lat": 27.8,
    "lng": 64.7167
  },
  "Wazirabad": {
    "lat": 32.4431,
    "lng": 74.1197
  },
  "Zhob": {
    "lat": 31.3408,
    "lng": 69.4486
  },
  "Ziarat": {
    "lat": 30.3825,
    "lng": 67.7289
  }
};

// Match any geocoded name (e.g. 'Khairpur Mirs', 'Khairpur District', 'Lahore Cantonment') to official district
export function matchPakistanDistrict(rawName) {
  if (!rawName) return null;
  const cleaned = rawName.replace(/( Mirs| District| Taluka| Tehsil| City| Cantonment| Cantt| Division)/gi, '').trim().toLowerCase();
  for (const d of PAKISTAN_DISTRICTS) {
    if (d.toLowerCase() === cleaned) return d;
    if (d.toLowerCase() === rawName.toLowerCase()) return d;
    if (rawName.toLowerCase().includes(d.toLowerCase())) return d;
    if (d.toLowerCase().includes(cleaned) && cleaned.length >= 4) return d;
  }
  return null;
}

// Instantly calculates closest Pakistan city using coordinates (works 100% offline & without API keys)
export function findClosestPakistanCity(lat, lng) {
  let closestCity = 'Lahore';
  let minDistance = Infinity;

  for (const [cityName, coords] of Object.entries(CITY_COORDINATES)) {
    const dLat = lat - coords.lat;
    const dLng = lng - coords.lng;
    const distSq = (dLat * dLat) + (dLng * dLng);
    if (distSq < minDistance) {
      minDistance = distSq;
      closestCity = cityName;
    }
  }

  return closestCity;
}

export default function MapPicker({ location, setLocation, isUrdu }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const geocoderRef = useRef(null);

  const [isLocating, setIsLocating] = useState(false);
  const [gpsNotice, setGpsNotice] = useState('');
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapLoadError, setMapLoadError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Helper to safely pan map & move marker
  const moveMapTo = (lat, lng, zoomLevel = 16) => {
    const pos = { lat: Number(lat), lng: Number(lng) };
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo(pos);
      if (zoomLevel) mapInstanceRef.current.setZoom(zoomLevel);
    }
    if (markerRef.current) {
      markerRef.current.setPosition(pos);
    }
  };

  // Robust multi-source Reverse Geocode
  const handleReverseGeocode = async (lat, lng, fallbackCity) => {
    const defaultCity = fallbackCity || findClosestPakistanCity(lat, lng);
    setGpsNotice(`Pinpointing road & area in ${defaultCity}...`);

    let detectedCity = defaultCity;
    let detectedRoad = '';

    // Strategy 1: BigDataCloud Reverse Geocoding (Fast, client-side, CORS enabled)
    try {
      const bdcRes = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );
      if (bdcRes.ok) {
        const bdcData = await bdcRes.json();
        if (bdcData) {
          const rawCity = bdcData.city || bdcData.locality || '';
          const matched = matchPakistanDistrict(rawCity);
          if (matched) {
            detectedCity = matched;
          } else if (bdcData.localityInfo?.administrative) {
            for (const admin of bdcData.localityInfo.administrative) {
              const m = matchPakistanDistrict(admin.name);
              if (m) {
                detectedCity = m;
                break;
              }
            }
          }

          const parts = [];
          if (bdcData.locality && bdcData.locality !== bdcData.city && !bdcData.locality.toLowerCase().includes('district')) {
            parts.push(bdcData.locality);
          }
          if (bdcData.localityInfo?.administrative) {
            const adminDetail = bdcData.localityInfo.administrative
              .filter(a => a.order >= 8 && a.name && !a.name.toLowerCase().includes('district') && !a.name.toLowerCase().includes('division'))
              .map(a => a.name)
              .pop();
            if (adminDetail && !parts.includes(adminDetail)) {
              parts.push(adminDetail);
            }
          }
          if (parts.length > 0) {
            detectedRoad = parts.join(', ');
          }
        }
      }
    } catch (e) {
      console.warn('BigDataCloud geocode warning:', e);
    }

    // Strategy 2: Google Maps Geocoder (High-precision full formatted address & landmarks)
    if (geocoderRef.current && window.google?.maps?.GeocoderStatus) {
      try {
        await new Promise((resolve) => {
          geocoderRef.current.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === window.google.maps.GeocoderStatus.OK && results && results[0]) {
              const fullFormatted = results[0].formatted_address || '';
              const comp = results[0].address_components || [];
              let poi = '';
              let route = '';
              let sublocality = '';
              let locality = '';

              for (const c of comp) {
                if (c.types.includes('point_of_interest') || c.types.includes('establishment') || c.types.includes('premise')) {
                  poi = c.long_name;
                }
                if (c.types.includes('route')) route = c.long_name;
                if (c.types.includes('sublocality') || c.types.includes('sublocality_level_1') || c.types.includes('neighborhood')) {
                  sublocality = c.long_name;
                }
                if (c.types.includes('locality')) locality = c.long_name;
              }

              const gCity = matchPakistanDistrict(locality);
              if (gCity) detectedCity = gCity;

              if (fullFormatted) {
                // Clean full address string into clean landmark, road, and city
                let clean = fullFormatted
                  .replace(/,?\s*\b\d{5}\b/g, '')
                  .replace(/,?\s*Pakistan\s*$/i, '')
                  .replace(/,?\s*(Sindh|Punjab|Khyber Pakhtunkhwa|Balochistan)\s*$/i, '')
                  .trim();
                detectedRoad = clean;
              } else {
                const parts = [poi, route, sublocality].filter(Boolean);
                if (parts.length > 0) detectedRoad = parts.join(', ');
              }
            }
            resolve();
          });
        });
      } catch (e) {
        console.warn('Google geocoder warning:', e);
      }
    }

    // Strategy 3: OpenStreetMap Nominatim (English locale)
    if (!detectedRoad || detectedRoad === detectedCity) {
      try {
        const osmRes = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=en`
        );
        if (osmRes.ok) {
          const osmData = await osmRes.json();
          if (osmData && osmData.address) {
            const a = osmData.address;
            const landmark = a.amenity || a.building || a.university || a.school || a.college || a.hospital || a.office || '';
            const road = a.road || a.street || a.pedestrian || '';
            const suburb = a.suburb || a.neighbourhood || a.quarter || '';
            const c = matchPakistanDistrict(a.city || a.town || a.county || a.municipality);
            if (c) detectedCity = c;

            const parts = [landmark, road, suburb].filter(Boolean);
            if (parts.length > 0) {
              detectedRoad = parts.join(', ');
            } else if (osmData.display_name) {
              let clean = osmData.display_name
                .replace(/,?\s*\b\d{5}\b/g, '')
                .replace(/,?\s*Pakistan\s*$/i, '')
                .replace(/,?\s*(Sindh|Punjab|Khyber Pakhtunkhwa|Balochistan)\s*$/i, '')
                .split(',')
                .slice(0, 3)
                .join(',')
                .trim();
              detectedRoad = clean;
            }
          }
        }
      } catch (e) {
        console.warn('OSM geocode warning:', e);
      }
    }

    // Format full address ensuring the city is explicitly included at the end (e.g. "IBA-IET, Mall Road, Khairpur")
    if (!detectedRoad) {
      detectedRoad = `Main Road / Civic Area, ${detectedCity}`;
    } else if (!detectedRoad.toLowerCase().includes(detectedCity.toLowerCase())) {
      detectedRoad = `${detectedRoad}, ${detectedCity}`;
    }

    setLocation(prev => ({
      ...prev,
      city: detectedCity,
      address: detectedRoad,
      latitude: lat,
      longitude: lng
    }));

    setGpsNotice(`Verified Location: ${detectedRoad} (${detectedCity})`);
  };

  // High-reliability live location detection with multi-tier failover
  const handleDetectLiveLocation = () => {
    setIsLocating(true);
    setGpsNotice('Acquiring live location & road details...');

    // Function to apply detected coordinates
    const applyDetectedCoordinates = async (lat, lng, sourceLabel) => {
      const instantCity = findClosestPakistanCity(lat, lng);
      
      // Update city in dropdown immediately
      setLocation(prev => ({
        ...prev,
        city: instantCity,
        latitude: lat,
        longitude: lng
      }));

      // Move Google Map
      moveMapTo(lat, lng, 16);

      // Perform road geocoding
      await handleReverseGeocode(lat, lng, instantCity);
      setIsLocating(false);
    };

    // Fallback: IP-based Geolocation (works 100% on laptops/desktops without GPS hardware)
    const fallbackToIpLocation = async () => {
      try {
        setGpsNotice('Connecting via network geolocation...');
        const res = await fetch('https://api.bigdatacloud.net/data/reverse-geocode-client');
        if (res.ok) {
          const data = await res.json();
          if (data && data.latitude && data.longitude) {
            await applyDetectedCoordinates(Number(data.latitude), Number(data.longitude), 'Network');
            return;
          }
        }
      } catch (err) {
        console.warn('Primary IP geocode error:', err);
      }

      // Secondary IP fallback
      try {
        const res2 = await fetch('https://ipwho.is/');
        if (res2.ok) {
          const data2 = await res2.json();
          if (data2 && data2.latitude && data2.longitude) {
            await applyDetectedCoordinates(Number(data2.latitude), Number(data2.longitude), 'Network');
            return;
          }
        }
      } catch (err2) {
        console.warn('Secondary IP geocode error:', err2);
      }

      setIsLocating(false);
      setGpsNotice('Could not auto-detect location. Please select your district from the dropdown.');
    };

    // Tier 1: Try high accuracy GPS
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          applyDetectedCoordinates(pos.coords.latitude, pos.coords.longitude, 'GPS');
        },
        (err) => {
          console.warn('High-accuracy GPS timeout/error, attempting standard accuracy...', err.message);
          // Tier 2: Try low accuracy
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              applyDetectedCoordinates(pos.coords.latitude, pos.coords.longitude, 'Browser');
            },
            (err2) => {
              console.warn('Standard accuracy failed, attempting IP Geolocation...', err2.message);
              // Tier 3: Network/IP Geolocation
              fallbackToIpLocation();
            },
            { enableHighAccuracy: false, timeout: 5000, maximumAge: 300000 }
          );
        },
        { enableHighAccuracy: true, timeout: 4000, maximumAge: 0 }
      );
    } else {
      fallbackToIpLocation();
    }
  };

  // Load Google Maps Script
  useEffect(() => {
    let checkInterval = null;

    const initMapInstance = () => {
      if (!window.google || !window.google.maps || !mapContainerRef.current) return;
      if (mapInstanceRef.current) return;

      try {
        const initialLat = location?.latitude || 31.5204;
        const initialLng = location?.longitude || 74.3587;
        const initialPos = { lat: Number(initialLat), lng: Number(initialLng) };

        const map = new window.google.maps.Map(mapContainerRef.current, {
          center: initialPos,
          zoom: 15,
          mapTypeId: 'roadmap',
          mapTypeControl: true,
          mapTypeControlOptions: {
            style: window.google.maps.MapTypeControlStyle.DROPDOWN_MENU,
            position: window.google.maps.ControlPosition.TOP_RIGHT
          },
          streetViewControl: true,
          fullscreenControl: true,
          zoomControl: true
        });

        const marker = new window.google.maps.Marker({
          position: initialPos,
          map: map,
          draggable: true,
          animation: window.google.maps.Animation.DROP,
          title: 'Drag or click to pinpoint exact road / incident location'
        });

        const geocoder = new window.google.maps.Geocoder();

        // Marker dragend listener
        marker.addListener('dragend', (e) => {
          const lat = e.latLng.lat();
          const lng = e.latLng.lng();
          handleReverseGeocode(lat, lng);
        });

        // Map click listener - move marker to clicked road/spot
        map.addListener('click', (e) => {
          const lat = e.latLng.lat();
          const lng = e.latLng.lng();
          marker.setPosition(e.latLng);
          handleReverseGeocode(lat, lng);
        });

        mapInstanceRef.current = map;
        markerRef.current = marker;
        geocoderRef.current = geocoder;
        setIsMapLoaded(true);

        // Auto-detect location on first load if still default Lahore
        if (location?.city === 'Lahore' && location?.latitude === 31.5204) {
          fetch('https://api.bigdatacloud.net/data/reverse-geocode-client')
            .then(r => r.json())
            .then(data => {
              if (data && data.latitude && data.longitude) {
                const autoLat = Number(data.latitude);
                const autoLng = Number(data.longitude);
                const autoCity = findClosestPakistanCity(autoLat, autoLng);
                if (autoCity && autoCity !== 'Lahore') {
                  map.panTo({ lat: autoLat, lng: autoLng });
                  marker.setPosition({ lat: autoLat, lng: autoLng });
                  setLocation(prev => ({
                    ...prev,
                    city: autoCity,
                    latitude: autoLat,
                    longitude: autoLng,
                    address: `Main Road / Civic Area, ${autoCity}`
                  }));
                  setGpsNotice(`Auto-aligned to your location: ${autoCity}`);
                }
              }
            })
            .catch(() => {});
        }
      } catch (err) {
        console.warn('Google Maps initialization error:', err);
        setMapLoadError('Google Maps failed to initialize. Manual selection available.');
      }
    };

    if (window.google && window.google.maps) {
      initMapInstance();
    } else {
      let script = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
      if (!script) {
        script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,geometry`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }

      checkInterval = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(checkInterval);
          initMapInstance();
        }
      }, 300);
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
    };
  }, []);

  // Sync external coordinates changes to map
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current && location?.latitude && location?.longitude) {
      const pos = { lat: Number(location.latitude), lng: Number(location.longitude) };
      markerRef.current.setPosition(pos);
      mapInstanceRef.current.panTo(pos);
    }
  }, [location?.latitude, location?.longitude]);

  // When city dropdown changes: pan map to city center
  const handleCityChange = (e) => {
    const newCity = e.target.value;
    const cityCoords = CITY_COORDINATES[newCity];

    if (cityCoords) {
      setLocation(prev => ({
        ...prev,
        city: newCity,
        latitude: cityCoords.lat,
        longitude: cityCoords.lng,
        address: `Main Road / Civic Area, ${newCity}`
      }));
      moveMapTo(cityCoords.lat, cityCoords.lng, 14);
      setGpsNotice(`Map centered on ${newCity}. Click on the exact road or drag marker.`);
      return;
    }

    setLocation(prev => ({ ...prev, city: newCity }));
    if (geocoderRef.current && window.google?.maps?.GeocoderStatus) {
      geocoderRef.current.geocode({ address: `${newCity}, Pakistan` }, (results, status) => {
        if (status === window.google.maps.GeocoderStatus.OK && results && results[0]) {
          const lat = results[0].geometry.location.lat();
          const lng = results[0].geometry.location.lng();
          moveMapTo(lat, lng, 14);
          setLocation(prev => ({
            ...prev,
            city: newCity,
            latitude: lat,
            longitude: lng,
            address: `Main Road, ${newCity}`
          }));
          setGpsNotice(`Map centered on ${newCity}. Click on the exact road.`);
        }
      });
    }
  };

  // Search road or landmark directly
  const handleSearchRoad = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    const query = `${searchQuery.trim()}, ${location.city || 'Pakistan'}`;

    if (geocoderRef.current && window.google?.maps?.GeocoderStatus) {
      geocoderRef.current.geocode({ address: query }, (results, status) => {
        setIsSearching(false);
        if (status === window.google.maps.GeocoderStatus.OK && results && results[0]) {
          const lat = results[0].geometry.location.lat();
          const lng = results[0].geometry.location.lng();
          moveMapTo(lat, lng, 17);
          handleReverseGeocode(lat, lng);
        } else {
          // Fallback to OSM search
          fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
            .then(r => r.json())
            .then(osmResults => {
              if (osmResults && osmResults[0]) {
                const oLat = parseFloat(osmResults[0].lat);
                const oLng = parseFloat(osmResults[0].lon);
                moveMapTo(oLat, oLng, 17);
                handleReverseGeocode(oLat, oLng);
              } else {
                alert('Could not find that exact spot. You can click directly on the map road.');
              }
            })
            .catch(() => {
              alert('Could not find that road. Please click directly on the map.');
            });
        }
      });
    } else {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-3 bg-white p-3.5 rounded-2xl border border-emerald-100 shadow-xs">
      {/* Top Header & Detect Location Action */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-50 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">
              {isUrdu ? 'مقام اور سڑک کی تصدیق (Google Maps)' : 'Incident Location & Road (Google Maps)'}
            </h4>
            <p className="text-[10px] text-slate-500">
              Live road detection, satellite GPS coordinates & official district lock
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDetectLiveLocation}
          disabled={isLocating}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-extrabold shadow-sm transition active:scale-95 cursor-pointer disabled:opacity-50"
          title="Detect your exact current location and road"
        >
          {isLocating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Navigation className="w-3.5 h-3.5" />}
          <span>{isLocating ? 'Detecting Location...' : 'Detect Current Location'}</span>
        </button>
      </div>

      {/* Road / Landmark Search Bar */}
      <form onSubmit={handleSearchRoad} className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search road, street, chowk, or colony (e.g. Mall Road, Station Road)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-emerald-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium"
          />
        </div>
        <button
          type="submit"
          disabled={isSearching}
          className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0 cursor-pointer disabled:opacity-50"
        >
          {isSearching ? <Loader2 className="w-3 h-3 animate-spin" /> : <Crosshair className="w-3 h-3 text-emerald-700" />}
          <span>Find Road</span>
        </button>
      </form>

      {/* Interactive Google Map Container */}
      <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden border-2 border-emerald-200 shadow-inner bg-slate-100">
        <div ref={mapContainerRef} className="w-full h-full" />
        
        {!isMapLoaded && !mapLoadError && (
          <div className="absolute inset-0 bg-slate-50/90 flex flex-col items-center justify-center gap-2 z-10 text-xs font-bold text-emerald-900">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-700" />
            <span>Loading Interactive Google Maps & Roads...</span>
          </div>
        )}

        {mapLoadError && (
          <div className="absolute inset-0 bg-slate-100/90 flex flex-col items-center justify-center p-4 text-center z-10 text-xs text-slate-700 space-y-1">
            <p className="font-bold text-amber-800">Notice: {mapLoadError}</p>
            <p className="text-[11px] text-slate-500">You can still select your district and type your exact road below.</p>
          </div>
        )}

        {/* Map overlay hint */}
        <div className="absolute bottom-2 left-2 z-10 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2.5 py-1 rounded-lg shadow-sm pointer-events-none flex items-center gap-1.5">
          <Eye className="w-3 h-3 text-emerald-400" />
          <span>Click on any road or drag red marker to select exact spot</span>
        </div>
      </div>

      {/* Live Notice / Detected Road Status */}
      {gpsNotice && (
        <div className="text-[11px] font-bold text-emerald-900 bg-emerald-100/90 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5 animate-in fade-in">
          <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
          <span className="truncate">{gpsNotice}</span>
        </div>
      )}

      {/* District Dropdown (ALL CITIES OF PAKISTAN) & Street Address Input */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            District / City (All Pakistan — تمام اضلاع و شہر)
          </label>
          <select
            value={location.city}
            onChange={handleCityChange}
            className="w-full bg-white border border-emerald-200 rounded-xl px-3 py-2 text-xs font-extrabold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer shadow-2xs"
          >
            {PAKISTAN_DISTRICTS.map((dist) => (
              <option key={dist} value={dist}>
                {dist}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            Street Address / Exact Road & Area
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Main Road, Station Road, Near Chowk"
            value={location.address}
            onChange={(e) => setLocation({ ...location, address: e.target.value })}
            className="w-full bg-white border border-emerald-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 shadow-2xs"
          />
        </div>
      </div>

      {/* GIS Position Readout */}
      <div className="flex items-center justify-between text-[10px] text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 font-mono">
        <span className="font-bold text-slate-700">
          📍 {location.city}: {Number(location.latitude || 31.5204).toFixed(4)}° N, {Number(location.longitude || 74.3587).toFixed(4)}° E
        </span>
        <span className="text-emerald-700 font-sans font-extrabold">✓ Live GIS Lock</span>
      </div>

    </div>
  );
}
