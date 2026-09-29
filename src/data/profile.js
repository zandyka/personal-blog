export const profile = {
  name: 'Zacky Andyka',
  shortName: 'Zacky Andyka',
  initials: 'DZ',
  title: 'Teknik Informatika Graduate',
  roles: [
    'Web Developer',
    'Mobile Developer',
    'IT Support Specialist',
    'Banking Operations',
    'Network Engineer',
    'Data Administrator',
  ],
  summary:
    'Muhammad Daffa Zacky Andyka is a Teknik Informatika graduate from Universitas Sumatera Utara with practical experience in BUMN corporate systems, banking operations, administration, IT support, networking, and software development. He has internship experience at PT Perkebunan Nusantara III Holding (Persero), Bank Syariah Indonesia, Bank Sumut, BPJS Ketenagakerjaan, and PT Telkom Akses Indonesia.',
  tagline: 'Bridging Technology, Banking & Administration',
  email: 'zackyandyka1@gmail.com',
  linkedin: 'https://www.linkedin.com/in/zacky-andyka/',
  instagram: 'https://www.instagram.com/zandyka._/',
  instagramHandle: '@zandyka._',
  cvUrl: '/cv.pdf',
  portfolioUrl: '/porto.pdf',
  education: {
    institution: 'Universitas Sumatera Utara (USU)',
    degree: 'Teknik Informatika',
    status: 'Graduated',
    gpa: [
      { semester: 1, gpa: 3.82 },
      { semester: 2, gpa: 3.57 },
      { semester: 3, gpa: 3.74 },
      { semester: 4, gpa: 4.00 },
      { semester: 5, gpa: 4.00 },
    ],
    bestGpa: 4.00,
  },
  techStack: [
    { name: 'PHP', category: 'backend', color: '#777BB4', emoji: '🐘' },
    { name: 'Java', category: 'mobile', color: '#ED8B00', emoji: '☕' },
    { name: 'Dart', category: 'mobile', color: '#0175C2', emoji: '🎯' },
    { name: 'Flutter', category: 'mobile', color: '#54C5F8', emoji: '💙' },
    { name: 'React', category: 'frontend', color: '#61DAFB', emoji: '⚛️' },
    { name: 'Laravel', category: 'backend', color: '#FF2D20', emoji: '🔴' },
    { name: 'Bootstrap', category: 'frontend', color: '#7952B3', emoji: '🅱️' },
    { name: 'MySQL', category: 'database', color: '#4479A1', emoji: '🐬' },
    { name: 'MariaDB', category: 'database', color: '#003545', emoji: '🦭' },
    { name: 'Figma', category: 'design', color: '#F24E1E', emoji: '🎨' },
    { name: 'Android Studio', category: 'mobile', color: '#3DDC84', emoji: '🤖' },
  ],
  experience: [
    {
      company: 'PT Perkebunan Nusantara III Holding (Persero)',
      role: 'Officer Data Support Intern',
      period: 'Sep 2026 – Present',
      type: 'internship',
      description:
        'Developing an automated Learning & Development (L&D) dashboard system to monitor and manage employee training data across the entire PTPN Group (Holding, Subholding, and subsidiary companies). Consolidating RKAP (training budget) data into the dashboard for centralized corporate reporting and systemizing manual data-processing workflows into automated processes.',
      tags: ['Officer Data Support', 'L&D Dashboard', 'Data Automation', 'RKAP Budgeting', 'Corporate Reporting'],
    },
    {
      company: 'BPJS Ketenagakerjaan',
      role: 'IT Team Coordinator & Admin Support Intern',
      period: 'Aug 2025 – Dec 2025',
      type: 'internship',
      description:
        'Coordinated IT-related internship systems, managed participant data, supported webinar implementation, assisted users with JMO activation and troubleshooting. Developed a dashboard website for visualizing intern performance and JMO activation metrics.',
      tags: ['IT Support', 'Dashboard Development', 'Data Administration', 'User Support'],
    },
    {
      company: 'PT. Bank Sumut',
      role: 'Operational Division Intern',
      period: 'Jun 2025 – Jul 2025',
      type: 'internship',
      description:
        'Assisted the operational team with daily transaction processing, supported customer service functions, and worked with routine banking operational workflows requiring procedural compliance and communication.',
      tags: ['Banking Operations', 'Customer Service', 'Transaction Processing'],
    },
    {
      company: 'PT. Bank Syariah Indonesia (BSI)',
      role: 'Back Office Intern',
      period: 'Mar 2025 – Jun 2025',
      type: 'internship',
      description:
        'Supported administrative and back-office processes, managed operational data, assisted with document verification and archival. Worked in an environment requiring accuracy, confidentiality, and compliance with banking procedures.',
      tags: ['Banking', 'Administration', 'Data Management', 'Document Control'],
    },
    {
      company: 'PT. Telkom Akses Indonesia',
      role: 'Fiber Technician — Certified Internship',
      period: 'Feb 2022 – Apr 2022',
      type: 'internship',
      description:
        'Installed fiber optic infrastructure, performed maintenance and repairs, worked with GPON-related systems, and assisted with technical troubleshooting in field network operations.',
      tags: ['Fiber Optic', 'GPON', 'Network Engineering', 'Field Operations'],
    },
    {
      company: 'HIMTI USU',
      role: 'Head of Creative Media Division',
      period: 'Sep 2024 – Sep 2025',
      type: 'organization',
      description:
        'Managed the Creative Media Division, coordinated division members, managed social media content, created visual materials for organizational activities — banners, posters, ID cards, certificates, and Instagram content.',
      tags: ['Leadership', 'Team Management', 'Figma', 'Content Production', 'Photography'],
    },
  ],
  projects: [
    {
      title: 'Handspeak — BISINDO Sign Language Translator',
      description:
        'Real-time BISINDO sign language translator Android app achieving 94.71% validation accuracy across 26 letter classes (A–Z) using TensorFlow Lite, MediaPipe Hand Landmarker 21-point extraction, and on-device inference with 176-dimensional feature vector.',
      tech: ['Flutter', 'Python', 'TensorFlow Lite', 'MediaPipe', 'Mobile AI'],
      type: 'Mobile AI Application',
      ratio: '16:9',
    },
    {
      title: 'Mahaasyik Resto — Sistem Manajemen & Pemesanan Restoran Berbasis Web',
      description:
        'Production-ready full-stack restaurant management platform built with React.js (Vite) + Tailwind CSS, Laravel 11 RESTful API backend, polymorphic MySQL architecture, Midtrans Payment Gateway (Snap API) with automated webhook callbacks, deployed on Vercel & Railway.',
      tech: ['React.js 18', 'Laravel 11', 'TailwindCSS', 'Midtrans Snap', 'MySQL 8'],
      type: 'Full-Stack Web App',
      ratio: '16:9',
    },
    {
      title: 'SIGMA BPJSTK — Sistem Informasi & Monitoring Aktivitas MBKM',
      description:
        'Integrated monitoring and evaluation system for BPJS Ketenagakerjaan MBKM internship with GPS geotagging attendance, 6 social security modules, grading center, and RBAC.',
      tech: ['React.js', 'Laravel 11', 'TailwindCSS', 'MySQL', 'Geolocation API'],
      type: 'Enterprise Web System',
      ratio: '16:9',
    },
    {
      title: 'Visualisasi Rekapan Operasional Bank Sumut',
      description:
        'Operational transaction analytics and visualization dashboard for PT Bank Sumut to monitor teller productivity, cash & non-cash transactions, and clearing data.',
      tech: ['Web Dashboard', 'Data Analytics', 'Chart.js', 'Banking Operations'],
      type: 'Banking Web Dashboard',
      ratio: '16:9',
    },
  ],
  certifications: [
    {
      name: 'Overview of AI',
      issuer: 'Huawei ICT Academy',
      period: 'Nov 2025',
      focus: 'Artificial Intelligence, machine learning algorithms, and deep learning fundamentals (Cert ID: ICT20251111001963)',
    },
    {
      name: 'HCIA-Datacom V1.0 Course',
      issuer: 'Huawei ICT Academy',
      period: 'May 2026',
      focus: 'Data communications, routing & switching, network protocols, and enterprise infrastructure (Cert ID: EBG20260519040762)',
    },
    {
      name: 'Junior Web Developer',
      issuer: 'VSGA Kominfo',
      period: 'Aug 2024',
      focus: 'Web development, database integration, and RESTful API fundamentals (Cert ID: 19391021040-30/VSGA/BLSDM.Kominfo/2024)',
    },
    {
      name: 'Junior Mobile Programmer',
      issuer: 'VSGA Kominfo',
      period: 'Jun – Jul 2023',
      focus: 'Mobile application programming and Android lifecycle fundamentals (Cert ID: 19362161040-17/VSGA/BLSDM.Kominfo/2023)',
    },
    {
      name: 'Fiber Technician',
      issuer: 'PT Telkom Akses Indonesia',
      period: 'Feb – Apr 2022',
      focus: 'Certified internship in fiber optic and GPON infrastructure',
    },
  ],
  achievements: [
    {
      title: 'Best Participant',
      subtitle: 'UKK SMK TKJ',
      detail: 'Score: 95.85',
      icon: 'trophy',
    },
    {
      title: '1st Place',
      subtitle: 'IT Networking Competition',
      detail: 'SMKS TIK Darussalam Medan',
      icon: 'medal',
    },
    {
      title: '3rd Place',
      subtitle: 'Coca-Cola Photo Contest',
      detail: 'Creative photography achievement',
      icon: 'camera',
    },
  ],
  skills: {
    technical: [
      'Web Development', 'Mobile App Development', 'Programming', 'Database Management',
      'Network Engineering', 'Fiber Optic & GPON', 'IT Troubleshooting', 'System Maintenance',
      'Data Management', 'Dashboard Development', 'System Analysis',
    ],
    soft: [
      'Attention to Detail', 'Accuracy', 'Problem Solving', 'Adaptability',
      'Public Speaking', 'Teamwork', 'Communication', 'Leadership',
      'Continuous Learning', 'Procedural Discipline',
    ],
    networking: ['Fiber Optic Installation', 'GPON Systems', 'Network Troubleshooting', 'Hardware Maintenance'],
    creative: ['Figma', 'Graphic Content', 'Social Media Management', 'Photography', 'Event Documentation'],
    languages: [
      { lang: 'Indonesian', level: 'Native' },
      { lang: 'English', level: 'Intermediate' },
    ],
  },
}

