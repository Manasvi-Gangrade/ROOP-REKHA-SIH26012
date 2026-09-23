export interface ParcelRecord {
  id: string;
  city: string;
  ward: string;
  address: string;
  owner: string;
  confidence: number;
  area: number; // in sq. meters
  perimeter: number; // in meters
  status: "Approved" | "Pending" | "Disputed";
  landUse: "Residential" | "Commercial" | "Mixed-Use" | "Agricultural" | "Institutional";
  center: [number, number];
  polygon: [number, number][];
  surveyDate: string;
  surveyor: string;
  overlapPercent?: number;
  notes?: string;
}

export const parcels: ParcelRecord[] = [
  {
    id: "MP-IND-54-4521",
    city: "Indore",
    ward: "Ward 54 (Central)",
    address: "Plot 12, Jawahar Marg, Rajwada Sector",
    owner: "Rameshwar Dayal Verma & Sons",
    confidence: 96,
    area: 286,
    perimeter: 68.4,
    status: "Approved",
    landUse: "Commercial",
    center: [22.7197, 75.8575],
    polygon: [
      [22.7203, 75.8569],
      [22.7204, 75.8579],
      [22.7192, 75.8581],
      [22.7191, 75.8571],
      [22.7203, 75.8569],
    ],
    surveyDate: "2026-09-18",
    surveyor: "Aditi Sharma (ID: SV-104)",
    notes: "AI boundary verified with DGPS survey. All corners clear of road encroachment.",
  },
  {
    id: "MP-IND-54-4522",
    city: "Indore",
    ward: "Ward 54 (Central)",
    address: "House 45/A, Sarafa Bazar Lane 3",
    owner: "Kailash Chand & Sunita Jain",
    confidence: 84,
    area: 344,
    perimeter: 74.8,
    status: "Pending",
    landUse: "Mixed-Use",
    center: [22.7208, 75.8590],
    polygon: [
      [22.7214, 75.8584],
      [22.7215, 75.8596],
      [22.7202, 75.8597],
      [22.7201, 75.8585],
      [22.7214, 75.8584],
    ],
    surveyDate: "2026-09-20",
    surveyor: "Rahul Meena (ID: SV-108)",
    notes: "Second storey overhang needs verification against building permit records.",
  },
  {
    id: "MP-IND-54-4523",
    city: "Indore",
    ward: "Ward 54 (Central)",
    address: "CTS No. 892, Khajuri Bazar Main",
    owner: "Municipal Corporation Public Utility / Encroached",
    confidence: 71,
    area: 198,
    perimeter: 59.2,
    status: "Disputed",
    landUse: "Commercial",
    center: [22.7183, 75.8602],
    polygon: [
      [22.7189, 75.8596],
      [22.7190, 75.8607],
      [22.7177, 75.8608],
      [22.7176, 75.8597],
      [22.7189, 75.8596],
    ],
    surveyDate: "2026-09-22",
    surveyor: "Aditi Sharma (ID: SV-104)",
    overlapPercent: 18.4,
    notes: "Severe boundary overlap (18.4%) with Municipal Road Right-of-Way. Hearing scheduled.",
  },
  {
    id: "MP-IND-54-4524",
    city: "Indore",
    ward: "Ward 54 (Central)",
    address: "Plot 88, Bada Sarafa Extension",
    owner: "Devendra Patel & Family",
    confidence: 93,
    area: 427,
    perimeter: 86.1,
    status: "Approved",
    landUse: "Residential",
    center: [22.7173, 75.8565],
    polygon: [
      [22.7179, 75.8558],
      [22.7180, 75.8571],
      [22.7167, 75.8572],
      [22.7166, 75.8560],
      [22.7179, 75.8558],
    ],
    surveyDate: "2026-09-15",
    surveyor: "Neha Patel (ID: SV-112)",
    notes: "Cadastral map alignment matched revenue sheet 1984 within 4 cm tolerance.",
  },
  {
    id: "MP-IND-54-4525",
    city: "Indore",
    ward: "Ward 54 (Central)",
    address: "Property 102/3, Chhatribagh Road",
    owner: "Mohammad Farooq Siddiqui",
    confidence: 88,
    area: 312,
    perimeter: 71.3,
    status: "Pending",
    landUse: "Residential",
    center: [22.7214, 75.8554],
    polygon: [
      [22.7220, 75.8548],
      [22.7221, 75.8560],
      [22.7208, 75.8561],
      [22.7207, 75.8550],
      [22.7220, 75.8548],
    ],
    surveyDate: "2026-09-24",
    surveyor: "Sanjay Gaur (ID: SV-119)",
    notes: "Boundary mutation submitted by owner pending tehsildar sign-off.",
  },
  {
    id: "MP-IND-54-4526",
    city: "Indore",
    ward: "Ward 54 (Central)",
    address: "Khasra 314/2, Narsingh Bazar",
    owner: "Shree Balaji Education Trust",
    confidence: 95,
    area: 640,
    perimeter: 110.5,
    status: "Approved",
    landUse: "Institutional",
    center: [22.7225, 75.8582],
    polygon: [
      [22.7232, 75.8574],
      [22.7233, 75.8590],
      [22.7218, 75.8591],
      [22.7217, 75.8576],
      [22.7232, 75.8574],
    ],
    surveyDate: "2026-09-12",
    surveyor: "Neha Patel (ID: SV-112)",
    notes: "Institutional compound boundary validated. High accuracy RTK benchmark.",
  },
  {
    id: "MP-IND-54-4527",
    city: "Indore",
    ward: "Ward 54 (Central)",
    address: "CTS 601, Old Cloth Market Galli 4",
    owner: "Vikas & Sandhya Agrawal",
    confidence: 68,
    area: 175,
    perimeter: 53.4,
    status: "Disputed",
    landUse: "Commercial",
    center: [22.7188, 75.8546],
    polygon: [
      [22.7194, 75.8540],
      [22.7195, 75.8552],
      [22.7182, 75.8553],
      [22.7181, 75.8542],
      [22.7194, 75.8540],
    ],
    surveyDate: "2026-09-21",
    surveyor: "Rahul Meena (ID: SV-108)",
    overlapPercent: 12.8,
    notes: "Adjoining parcel claim discrepancy of 12.8%. Field surveyor flagged sliver triangle.",
  },
  {
    id: "MP-IND-54-4528",
    city: "Indore",
    ward: "Ward 54 (Central)",
    address: "Plot 305, Imli Bazar Chowk",
    owner: "Indore Urban Development Authority (IDA)",
    confidence: 98,
    area: 520,
    perimeter: 94.0,
    status: "Approved",
    landUse: "Institutional",
    center: [22.7165, 75.8592],
    polygon: [
      [22.7171, 75.8584],
      [22.7172, 75.8599],
      [22.7158, 75.8600],
      [22.7157, 75.8586],
      [22.7171, 75.8584],
    ],
    surveyDate: "2026-09-10",
    surveyor: "Aditi Sharma (ID: SV-104)",
    notes: "Government municipal asset. Full cadastral title verified.",
  },
  {
    id: "MP-IND-54-4529",
    city: "Indore",
    ward: "Ward 54 (Central)",
    address: "Property 77, Gopal Mandir Marg",
    owner: "Gopal Mandir Dharmik Trust",
    confidence: 90,
    area: 395,
    perimeter: 80.2,
    status: "Approved",
    landUse: "Institutional",
    center: [22.7180, 75.8582],
    polygon: [
      [22.7186, 75.8576],
      [22.7187, 75.8588],
      [22.7174, 75.8589],
      [22.7173, 75.8578],
      [22.7186, 75.8576],
    ],
    surveyDate: "2026-09-14",
    surveyor: "Sanjay Gaur (ID: SV-119)",
    notes: "Historical landmark buffer observed. Boundary matches city heritage master plan.",
  },
  {
    id: "MP-IND-54-4530",
    city: "Indore",
    ward: "Ward 54 (Central)",
    address: "Plot 19/B, Malharganj Commercial Row",
    owner: "Garg Real Estate & Logistics",
    confidence: 79,
    area: 480,
    perimeter: 91.6,
    status: "Pending",
    landUse: "Commercial",
    center: [22.7212, 75.8615],
    polygon: [
      [22.7218, 75.8608],
      [22.7219, 75.8622],
      [22.7205, 75.8623],
      [22.7204, 75.8610],
      [22.7218, 75.8608],
    ],
    surveyDate: "2026-09-25",
    surveyor: "Aditi Sharma (ID: SV-104)",
    notes: "Temporary shed extends over rear setback by 1.2 metres. Surveyor flagged for review.",
  }
];

export const ulbProgress = [
  { name: "Indore", progress: 92, approved: 1380, pending: 180, disputed: 48, state: "Madhya Pradesh" },
  { name: "Surat", progress: 87, approved: 1260, pending: 220, disputed: 54, state: "Gujarat" },
  { name: "Pune", progress: 81, approved: 1190, pending: 260, disputed: 70, state: "Maharashtra" },
  { name: "Bhopal", progress: 76, approved: 980, pending: 310, disputed: 64, state: "Madhya Pradesh" },
  { name: "Jaipur", progress: 69, approved: 910, pending: 350, disputed: 92, state: "Rajasthan" },
  { name: "Kochi", progress: 64, approved: 820, pending: 300, disputed: 55, state: "Kerala" },
  { name: "Ranchi", progress: 58, approved: 710, pending: 360, disputed: 82, state: "Jharkhand" },
  { name: "Guwahati", progress: 51, approved: 630, pending: 390, disputed: 96, state: "Assam" },
];

export const parcelStatus = [
  { name: "Approved", value: 6842, color: "#14b8a6", percentage: 72.8 },
  { name: "Pending", value: 1948, color: "#f59e0b", percentage: 20.7 },
  { name: "Disputed", value: 612, color: "#f43f5e", percentage: 6.5 },
];

export const landUse = [
  { name: "Residential", value: 46, color: "#8b5cf6", parcels: 4325, areaHectares: 248.5 },
  { name: "Commercial", value: 18, color: "#14b8a6", parcels: 1692, areaHectares: 97.2 },
  { name: "Mixed-Use", value: 14, color: "#f59e0b", parcels: 1316, areaHectares: 75.6 },
  { name: "Agricultural", value: 13, color: "#84cc16", parcels: 1222, areaHectares: 70.2 },
  { name: "Vacant / Public", value: 9, color: "#f43f5e", parcels: 847, areaHectares: 48.6 },
];

export const offsetData = [
  { parcel: "MP-4521", ai: 14, gnss: 11, deviation: 3.0, status: "Verified" },
  { parcel: "GJ-1834", ai: 22, gnss: 18, deviation: 4.0, status: "Verified" },
  { parcel: "MH-9082", ai: 17, gnss: 13, deviation: 4.0, status: "Verified" },
  { parcel: "RJ-3315", ai: 29, gnss: 21, deviation: 8.0, status: "Flagged" },
  { parcel: "KL-7428", ai: 12, gnss: 9, deviation: 3.0, status: "Verified" },
  { parcel: "MP-4523", ai: 34, gnss: 22, deviation: 12.0, status: "Flagged" },
  { parcel: "AS-2234", ai: 16, gnss: 14, deviation: 2.0, status: "Verified" },
];

export const activity = [
  { id: "act-1", title: "Ward 54 orthomosaic approved", place: "Indore Municipal Corporation", time: "8 min ago", tone: "approved", user: "Commissioner Urban Dev" },
  { id: "act-2", title: "12 parcel overlaps flagged", place: "Jaipur Greater Municipal", time: "24 min ago", tone: "disputed", user: "AI Topology Engine" },
  { id: "act-3", title: "GNSS batch synchronized (18 pts)", place: "Pune Municipal Corporation", time: "41 min ago", tone: "approved", user: "Field Surveyor Unit #4" },
  { id: "act-4", title: "Oblique 3D mesh reconstruction", place: "Surat Municipal Corporation", time: "1 hr ago", tone: "pending", user: "Automated Pipeline" },
  { id: "act-5", title: "Khajuri Bazar hearing scheduled", place: "Indore Revenue Court", time: "2 hr ago", tone: "disputed", user: "Tehsildar Office" },
];

export const monthlyData = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1} Sep`,
  parcels: 180 + Math.round(Math.sin(i / 3) * 45 + i * 8),
  approved: 130 + Math.round(Math.sin(i / 3) * 35 + i * 6),
  accuracy: +(85 + Math.sin(i / 4) * 2.5 + (i * 0.1)).toFixed(1),
}));

export const uploads = [
  { id: "UP-101", name: "indore_ward54_ortho_5cm.tif", ulb: "Indore", size: "2.8 GB", method: "2D Nadir", status: "Processed", date: "29 Sep 2026", parcelsFound: 142 },
  { id: "UP-102", name: "surat_zone3_oblique_cluster.zip", ulb: "Surat", size: "4.1 GB", method: "Oblique 3D", status: "Processing", date: "29 Sep 2026", parcelsFound: 0 },
  { id: "UP-103", name: "jaipur_sector12_lidar.laz", ulb: "Jaipur", size: "6.3 GB", method: "Oblique + LiDAR", status: "Queued", date: "28 Sep 2026", parcelsFound: 0 },
  { id: "UP-104", name: "kochi_ward08_ortho_highres.tif", ulb: "Kochi", size: "1.9 GB", method: "2D Nadir", status: "Processed", date: "28 Sep 2026", parcelsFound: 89 },
  { id: "UP-105", name: "pune_kothrud_drone_survey.tif", ulb: "Pune", size: "3.4 GB", method: "2D Nadir", status: "Processed", date: "27 Sep 2026", parcelsFound: 215 },
];