// Mock Data Repository for SK Smart Premium Insurance Platform

export const PLANS = [
  // Flagship Plans matching reference screenshot
  {
    id: 'plan-health-premium',
    name: 'SK Platinum Care',
    company: 'Star Health',
    category: 'Health',
    categoryTag: 'HEALTH',
    description: 'Comprehensive health coverage with global treatment access, zero co-pay, and unlimited room rent benefits.',
    coverageLabel: 'STANDARD COVERAGE VALUE',
    coverageAmount: '1,000,000',
    premiumStartsFrom: '₹120/month*',
    premiumMonthly: 120,
    features: [
      'Cashless hospitalisation worldwide',
      'Zero co-pay on operations',
      'Pre & post hospitalisation expenses up to 180 days',
      'Complimentary annual health checks',
      'No room rent caps'
    ],
    badge: 'POPULAR',
    icon: 'FaHeartbeat'
  },
  {
    id: 'plan-health-shield',
    name: 'SK Health Shield',
    company: 'Niva Bupa',
    category: 'Health',
    categoryTag: 'HEALTH',
    description: 'Essential medical protection covering hospital bills, diagnostics, and day-care procedures.',
    coverageLabel: 'STANDARD COVERAGE VALUE',
    coverageAmount: '500,000',
    premiumStartsFrom: '₹65/month*',
    premiumMonthly: 65,
    features: [
      'Over 10,000 cashless network hospitals',
      'Ambulance charge coverage',
      '24/7 online doctor teleconsultation',
      'Tax savings under Section 80D',
      'No-claim bonus up to 50%'
    ],
    badge: null,
    icon: 'FaHeartbeat'
  },
  {
    id: 'plan-term-elite',
    name: 'SK Term Elite',
    company: 'HDFC',
    category: 'Life',
    categoryTag: 'LIFE',
    description: 'High-value term life protection securing your family\'s financial stability with flexible payout structures.',
    coverageLabel: 'STANDARD COVERAGE VALUE',
    coverageAmount: '2,500,000',
    premiumStartsFrom: '₹45/month*',
    premiumMonthly: 45,
    features: [
      'Lump-sum or monthly pension payouts',
      'Optional critical illness rider',
      'Terminal illness early payout benefit',
      'Accidental death double coverage benefit',
      'Premium waiver on permanent disability'
    ],
    badge: 'BEST VALUE',
    icon: 'FaUserShield'
  },
  {
    id: 'plan-motor-max',
    name: 'SK Auto Max Cover',
    company: 'Bajaj',
    category: 'Motor',
    categoryTag: 'MOTOR',
    description: 'Comprehensive bumper-to-bumper car insurance with roadside assistance and zero depreciation.',
    coverageLabel: 'STANDARD COVERAGE VALUE',
    coverageAmount: 'Full Vehicle Value',
    premiumStartsFrom: '₹35/month*',
    premiumMonthly: 35,
    features: [
      'Bumper-to-Bumper zero depreciation coverage',
      '24/7 spot roadside assistance (towing, flat tires)',
      'Engine protection and consumables cover',
      'Key replacement & personal belongings cover',
      'Cashless repairs at 5,000+ garages'
    ],
    badge: 'BEST-SELLER',
    icon: 'FaCar'
  },
  {
    id: 'plan-home-castle',
    name: 'SK Safe Haven',
    company: 'Oriental Insurance',
    category: 'Home',
    categoryTag: 'HOME',
    description: 'Complete home structure and contents policy securing your home from fire, flood, burglary, and natural disasters.',
    coverageLabel: 'STANDARD COVERAGE VALUE',
    coverageAmount: '750,000',
    premiumStartsFrom: '₹25/month*',
    premiumMonthly: 25,
    features: [
      'Structure and content coverage',
      'Rent for alternative accommodation benefit',
      'Electrical/mechanical breakdown cover for appliances',
      'Burglary and theft coverage',
      'Third-party public liability cover'
    ],
    badge: null,
    icon: 'FaHome'
  },
  {
    id: 'plan-travel-global',
    name: 'SK GlobeTrotter Pro',
    company: 'Allianz',
    category: 'Travel',
    categoryTag: 'TRAVEL',
    description: 'Stress-free international travel coverage covering trip cancellation, baggage loss, and emergency medical fees.',
    coverageLabel: 'STANDARD COVERAGE VALUE',
    coverageAmount: '200,000',
    premiumStartsFrom: '₹15/month*',
    premiumMonthly: 15,
    features: [
      'Emergency medical evacuation coverage',
      'Flight delay & trip cancellation compensation',
      'Baggage loss and passport loss coverage',
      'Bail bond and legal liability assistance',
      'Covid-19 medical coverage included'
    ],
    badge: null,
    icon: 'FaPlane'
  },
  // 2. ULIP
  {
    id: 'plan-smart-scholar-plus',
    name: 'Smart Scholar Plus',
    company: 'SBI Life Insurance',
    category: 'ULIP',
    categoryTag: 'ULIP',
    description: "A Unit Linked Insurance Plan offering market-linked investment opportunities while helping secure your child's future financial needs.",
    coverageLabel: 'Fund Value',
    coverageAmount: 'Market Linked',
    premiumStartsFrom: '₹1,500/month*',
    premiumMonthly: 1500,
    features: [
      'Equity & debt fund options',
      'Wealth creation potential',
      'Life insurance protection',
      'Partial withdrawal facility',
      'Tax benefits'
    ],
    badge: 'Market Linked',
    icon: 'FaShieldAlt'
  },
  // 3. ULIP
  {
    id: 'plan-smart-privilege-plus',
    name: 'Smart Privilege Plus',
    company: 'SBI Life Insurance',
    category: 'ULIP',
    categoryTag: 'ULIP',
    description: 'A market-linked insurance solution designed for long-term wealth accumulation with flexible investment choices.',
    coverageLabel: 'Investment Type',
    coverageAmount: 'Market Linked',
    premiumStartsFrom: '₹2,000/month*',
    premiumMonthly: 2000,
    features: [
      'Multiple investment funds',
      'Switch between funds',
      'Life cover throughout the policy term',
      'Top-up investment option',
      'Tax advantages'
    ],
    badge: 'Wealth Creation',
    icon: 'FaCoins'
  },
  // 4. Savings Plan
  {
    id: 'plan-smart-fortune-wealth-builder',
    name: 'Smart Fortune Wealth Builder',
    company: 'SBI Life Insurance',
    category: 'Savings Plan',
    categoryTag: 'SAVINGS PLAN',
    description: "A savings-oriented insurance plan designed to help you accumulate wealth while protecting your family's financial future.",
    coverageLabel: 'Savings Goal',
    coverageAmount: 'Long-Term Wealth',
    premiumStartsFrom: '₹1,250/month*',
    premiumMonthly: 1250,
    features: [
      'Guaranteed life cover',
      'Long-term savings',
      'Flexible premium options',
      'Bonus benefits (if applicable)',
      'Tax benefits'
    ],
    badge: 'Wealth Builder',
    icon: 'FaShieldAlt'
  },
  // 5. Savings Plan
  {
    id: 'plan-smart-platina-supreme',
    name: 'Smart Platina Supreme',
    company: 'SBI Life Insurance',
    category: 'Savings Plan',
    categoryTag: 'SAVINGS PLAN',
    description: 'A premium savings insurance plan offering financial security along with opportunities to build long-term wealth.',
    coverageLabel: 'Coverage',
    coverageAmount: 'Life + Savings',
    premiumStartsFrom: '₹2,500/month*',
    premiumMonthly: 2500,
    features: [
      'Long-term financial planning',
      'Flexible policy terms',
      'Family financial protection',
      'Optional riders',
      'Tax benefits'
    ],
    badge: 'Premium Savings',
    icon: 'FaShieldAlt'
  },
  // 6. Savings Plan
  {
    id: 'plan-smart-platina-advantage',
    name: 'Smart Platina Advantage',
    company: 'SBI Life Insurance',
    category: 'Savings Plan',
    categoryTag: 'SAVINGS PLAN',
    description: 'A comprehensive savings solution designed to balance life insurance protection with future wealth creation.',
    coverageLabel: 'Coverage',
    coverageAmount: 'Life + Savings',
    premiumStartsFrom: '₹2,000/month*',
    premiumMonthly: 2000,
    features: [
      'Guaranteed life cover',
      'Savings accumulation',
      'Flexible premium payment',
      'Rider options',
      'Tax benefits'
    ],
    badge: 'Balanced Growth',
    icon: 'FaShieldAlt'
  },
  // 7. Savings Plan
  {
    id: 'plan-smart-platina-plus',
    name: 'Smart Platina Plus',
    company: 'SBI Life Insurance',
    category: 'Savings Plan',
    categoryTag: 'SAVINGS PLAN',
    description: 'A savings-focused insurance plan providing financial protection and long-term wealth accumulation for future goals.',
    coverageLabel: 'Coverage',
    coverageAmount: 'Life + Savings',
    premiumStartsFrom: '₹1,800/month*',
    premiumMonthly: 1800,
    features: [
      'Financial protection',
      'Long-term savings',
      'Flexible policy tenure',
      'Optional riders',
      'Tax benefits'
    ],
    badge: 'Popular Savings',
    icon: 'FaShieldAlt'
  },
  // 8. Pension Plan
  {
    id: 'plan-retire-smart-plus',
    name: 'Retire Smart Plus',
    company: 'SBI Life Insurance',
    category: 'Pension Plan',
    categoryTag: 'PENSION PLAN',
    description: 'A retirement planning solution designed to help build a steady retirement corpus for financial independence after retirement.',
    coverageLabel: 'Retirement Benefit',
    coverageAmount: 'Regular Pension',
    premiumStartsFrom: '₹1,500/month*',
    premiumMonthly: 1500,
    features: [
      'Retirement corpus creation',
      'Flexible premium options',
      'Long-term savings',
      'Life cover during accumulation',
      'Tax benefits'
    ],
    badge: 'Retirement Goal',
    icon: 'FaUserShield'
  },
  // 9. Pension Plan
  {
    id: 'plan-smart-annuity-plus',
    name: 'Smart Annuity Plus (Single Premium)',
    company: 'SBI Life Insurance',
    category: 'Pension Plan',
    categoryTag: 'PENSION PLAN',
    description: 'A single-premium annuity plan that helps generate a regular income stream after retirement.',
    coverageLabel: 'Premium Type',
    coverageAmount: 'Single Premium',
    premiumStartsFrom: '₹1,00,000* (Single)',
    premiumMonthly: 100000,
    features: [
      'Guaranteed annuity options',
      'Single premium payment',
      'Lifetime income choices',
      'Multiple annuity options',
      'Financial security after retirement'
    ],
    badge: 'Single Premium',
    icon: 'FaUserShield'
  },
  // 10. Term Insurance
  {
    id: 'plan-smart-swadhan-neo',
    name: 'Smart Swadhan Neo',
    company: 'SBI Life Insurance',
    category: 'Term Insurance',
    categoryTag: 'TERM INSURANCE',
    description: 'A pure term insurance plan providing financial protection to your loved ones with affordable premiums.',
    coverageLabel: 'Life Cover',
    coverageAmount: 'Up to ₹1 Crore*',
    premiumStartsFrom: '₹550/month*',
    premiumMonthly: 550,
    features: [
      'High life cover',
      'Affordable premiums',
      'Flexible policy terms',
      'Optional riders',
      'Tax benefits'
    ],
    badge: 'Affordable Term',
    icon: 'FaShieldAlt'
  },
  // 11. Term Insurance
  {
    id: 'plan-smart-shield-plus',
    name: 'Smart Shield Plus',
    company: 'SBI Life Insurance',
    category: 'Term Insurance',
    categoryTag: 'TERM INSURANCE',
    description: "A comprehensive term insurance solution designed to safeguard your family's financial future with extensive protection options.",
    coverageLabel: 'Life Cover',
    coverageAmount: 'Up to ₹2 Crore*',
    premiumStartsFrom: '₹700/month*',
    premiumMonthly: 700,
    features: [
      'High sum assured',
      'Flexible coverage options',
      'Critical illness rider options',
      'Accidental death benefit riders',
      'Tax benefits'
    ],
    badge: 'Popular Term',
    icon: 'FaShieldAlt'
  },
  // 12. Term Insurance
  {
    id: 'plan-smart-shield-premier',
    name: 'Smart Shield Premier',
    company: 'SBI Life Insurance',
    category: 'Term Insurance',
    categoryTag: 'TERM INSURANCE',
    description: "A premium term insurance plan offering comprehensive financial protection with enhanced coverage options for your family's future.",
    coverageLabel: 'Life Cover',
    coverageAmount: 'Up to ₹5 Crore*',
    premiumStartsFrom: '₹950/month*',
    premiumMonthly: 950,
    features: [
      'Comprehensive life cover',
      'Flexible policy term',
      'Optional rider benefits',
      'Family financial protection',
      'Tax benefits'
    ],
    badge: 'Maximum Shield',
    icon: 'FaShieldAlt'
  },
  // Health, Motor, Home, Travel & Other 15 Insurers
  {
    id: 'plan-postal-suraksha',
    name: 'Postal Santosh Whole Life Assurance',
    company: 'Postal Office',
    category: 'Term Insurance',
    categoryTag: 'TERM INSURANCE',
    description: 'Sovereign guaranteed government postal life insurance with lowest premium rates and highest bonus returns.',
    coverageLabel: 'Sum Assured',
    coverageAmount: '₹50,00,000',
    premiumStartsFrom: '₹480/month*',
    premiumMonthly: 480,
    features: [
      'Government of India sovereign guarantee',
      'Highest annual bonus rate',
      'Loan facility after 3 years',
      'Tax exemption under Section 80C'
    ],
    badge: 'Government Guarantee',
    icon: 'FaShieldAlt'
  },
  {
    id: 'plan-future-generali-health',
    name: 'Future Generali Health Total',
    company: 'Future Generali',
    category: 'Health',
    categoryTag: 'HEALTH CARE',
    description: 'Comprehensive family float health plan offering cashless restoration benefits and global emergency cover.',
    coverageLabel: 'Medical Coverage',
    coverageAmount: '₹15,00,000',
    premiumStartsFrom: '₹890/month*',
    premiumMonthly: 890,
    features: [
      '100% Automatic refill of sum insured',
      'No sub-limits on room rent or ICU',
      'Organ donor medical expense cover',
      'Annual wellness rewards & health checkup'
    ],
    badge: 'Family Refill',
    icon: 'FaHeartbeat'
  },
  {
    id: 'plan-bajaj-e-touch',
    name: 'Bajaj Allianz Smart Protect Goal',
    company: 'Bajaj',
    category: 'Term Insurance',
    categoryTag: 'TERM INSURANCE',
    description: 'Flexi term insurance plan with return of premium option and comprehensive critical illness rider cover.',
    coverageLabel: 'Life Cover',
    coverageAmount: 'Up to ₹1.5 Crore*',
    premiumStartsFrom: '₹620/month*',
    premiumMonthly: 620,
    features: [
      'Return of premium at maturity',
      'Cover up to 99 years of age',
      '55 Critical illness rider benefits',
      'Accelerated payout on terminal illness'
    ],
    badge: 'Return of Premium',
    icon: 'FaUserShield'
  },
  {
    id: 'plan-aditya-birla-wealth',
    name: 'Aditya Birla Sun Life Vision Star',
    company: 'Aditya Birla',
    category: 'Child Plan',
    categoryTag: 'CHILD PLAN',
    description: 'Guaranteed child future savings plan providing periodic payouts during key educational milestones.',
    coverageLabel: 'Education Fund',
    coverageAmount: '₹25,00,000',
    premiumStartsFrom: '₹1,400/month*',
    premiumMonthly: 1400,
    features: [
      'Guaranteed regular payouts during college years',
      'Premium waiver benefit on parent demise',
      'Accrued bonuses on maturity',
      'Flexible policy term options'
    ],
    badge: 'Child Education',
    icon: 'FaUserShield'
  },
  {
    id: 'plan-oriental-individual-mediclaim',
    name: 'Oriental Individual Mediclaim Shield',
    company: 'Oriental Insurance',
    category: 'Health',
    categoryTag: 'HEALTH CARE',
    description: 'Public sector general insurance coverage providing dependable hospitalization and day-care surgery protection.',
    coverageLabel: 'Hospital Cover',
    coverageAmount: '₹10,00,000',
    premiumStartsFrom: '₹650/month*',
    premiumMonthly: 650,
    features: [
      'Cashless treatment at 7,500+ government & private hospitals',
      'Pre-existing disease coverage after 3 years',
      'Daily hospital cash allowance',
      'Ayush treatment coverage'
    ],
    badge: 'PSU Trust',
    icon: 'FaHeartbeat'
  },
  {
    id: 'plan-tata-aia-sampoorna',
    name: 'Tata AIA Sampoorna Raksha Supreme',
    company: 'Tata AIA',
    category: 'Term Insurance',
    categoryTag: 'TERM INSURANCE',
    description: 'Flexible life cover protection with growing payout options, critical illness shield, and top-up flexi benefits.',
    coverageLabel: 'Life Cover',
    coverageAmount: 'Up to ₹2 Crore*',
    premiumStartsFrom: '₹750/month*',
    premiumMonthly: 750,
    features: [
      'Choice of 4 flexible payout options',
      'Life cover increases every policy year',
      '99.1% Claim settlement ratio record',
      'Wellness rewards program discount'
    ],
    badge: 'Tata Trust',
    icon: 'FaShieldAlt'
  },
  {
    id: 'plan-icici-pru-iprotect',
    name: 'ICICI Pru iProtect Smart',
    company: 'ICICI',
    category: 'Term Insurance',
    categoryTag: 'TERM INSURANCE',
    description: 'Award-winning term plan offering instant critical illness lump-sum payout and accidental death benefit.',
    coverageLabel: 'Life Cover',
    coverageAmount: 'Up to ₹2 Crore*',
    premiumStartsFrom: '₹680/month*',
    premiumMonthly: 680,
    features: [
      '34 Critical illness instant payout',
      'Special discounted rates for non-smokers',
      'Terminal illness accelerated payout',
      'Tax benefits under 80C & 10(10D)'
    ],
    badge: 'Best-Seller',
    icon: 'FaUserShield'
  },
  {
    id: 'plan-hdfc-click-2-protect',
    name: 'HDFC Life Click 2 Protect Super',
    company: 'HDFC',
    category: 'Term Insurance',
    categoryTag: 'TERM INSURANCE',
    description: 'Customizable term plan allowing protection adjustment as your life stages, marriage, and family grow.',
    coverageLabel: 'Life Cover',
    coverageAmount: 'Up to ₹3 Crore*',
    premiumStartsFrom: '₹780/month*',
    premiumMonthly: 780,
    features: [
      'Option to change life cover at key life milestones',
      'Return of premium plan option',
      'Waiver of premium on critical illness diagnosis',
      'Instant video claim settlement'
    ],
    badge: 'Flexible Cover',
    icon: 'FaShieldAlt'
  },
  {
    id: 'plan-niva-bupa-reassure',
    name: 'Niva Bupa ReAssure 2.0',
    category: 'Health',
    company: 'Niva Bupa',
    categoryTag: 'HEALTH CARE',
    description: 'Revolutionary health plan with lock-the-age lock-in premium, unlimited restoration, and rollover bonus.',
    coverageLabel: 'Medical Cover',
    coverageAmount: '₹20,00,000',
    premiumStartsFrom: '₹990/month*',
    premiumMonthly: 990,
    features: [
      'Lock your entry age premium until claim',
      'Unlimited base cover refills forever',
      'No age cap on room rent',
      '30-minute cashless approval response'
    ],
    badge: 'Lock-The-Age',
    icon: 'FaHeartbeat'
  },
  {
    id: 'plan-allianz-global-care',
    name: 'Allianz Worldwide Care Shield',
    company: 'Allianz',
    category: 'Travel',
    categoryTag: 'TRAVEL ASSIST',
    description: 'International expat and global travel protection with 24/7 multi-lingual medical assistance and baggage insurance.',
    coverageLabel: 'Global Cover',
    coverageAmount: '€100,000',
    premiumStartsFrom: '₹450/month*',
    premiumMonthly: 450,
    features: [
      'Emergency medical evacuation worldwide',
      'Direct billing with 15,000+ international clinics',
      'Trip cancellation & flight delay refund',
      'Lost passport & legal fee assistance'
    ],
    badge: 'Global Cover',
    icon: 'FaPlane'
  },
  {
    id: 'plan-kotak-e-term',
    name: 'Kotak e-Term Plan',
    company: 'Kotak',
    category: 'Term Insurance',
    categoryTag: 'TERM INSURANCE',
    description: 'Pure protection term policy with high sum assured rebates and optional permanent disability rider.',
    coverageLabel: 'Life Cover',
    coverageAmount: 'Up to ₹1 Crore*',
    premiumStartsFrom: '₹590/month*',
    premiumMonthly: 590,
    features: [
      'Step-up cover option at key life stages',
      'Low premium rates for women',
      'Multiple payout options (Lump sum + Monthly income)',
      'Tax savings under 80C'
    ],
    badge: 'High Rebate',
    icon: 'FaShieldAlt'
  },
  {
    id: 'plan-pnb-metlife-mera-term',
    name: 'PNB MetLife Mera Term Plan',
    company: 'PNB',
    category: 'Term Insurance',
    categoryTag: 'TERM INSURANCE',
    description: 'Customizable protection plan offering monthly income option for your spouse and children in your absence.',
    coverageLabel: 'Life Cover',
    coverageAmount: 'Up to ₹1 Crore*',
    premiumStartsFrom: '₹560/month*',
    premiumMonthly: 560,
    features: [
      'Monthly income payout to nominee up to 10 years',
      'Joint life cover option for spouse',
      'Child education booster benefit',
      'Tax deduction benefits'
    ],
    badge: 'Family Income',
    icon: 'FaUserShield'
  },
  {
    id: 'plan-manipal-cigna-prohealth',
    name: 'ManipalCigna ProHealth Prime',
    company: 'Manipal Cigna',
    category: 'Health',
    categoryTag: 'HEALTH CARE',
    description: 'Non-disclosure protection health cover with zero co-payment and guaranteed annual cumulative bonus.',
    coverageLabel: 'Medical Cover',
    coverageAmount: '₹25,00,000',
    premiumStartsFrom: '₹1,100/month*',
    premiumMonthly: 1100,
    features: [
      '100% Cumulative bonus every claim-free year',
      'Worldwide emergency room coverage',
      'Alternative AYUSH treatment cashless',
      'Mental healthcare coverage included'
    ],
    badge: 'Prime Health',
    icon: 'FaHeartbeat'
  },
  {
    id: 'plan-star-health-comprehensive',
    name: 'Star Health Comprehensive Insurance',
    company: 'Star Health',
    category: 'Health',
    categoryTag: 'HEALTH CARE',
    description: 'India\'s leading specialized health insurer plan covering maternity, newborn baby, and zero co-pay at 14,000+ hospitals.',
    coverageLabel: 'Medical Coverage',
    coverageAmount: '₹10,00,000',
    premiumStartsFrom: '₹920/month*',
    premiumMonthly: 920,
    features: [
      'Cover for pre & post natal expenses + newborn cover',
      'Zero co-pay at 14,000+ cashless network hospitals',
      'Bariatric surgery and organ donor expenses',
      'Free annual health checkup'
    ],
    badge: 'Star Care',
    icon: 'FaHeartbeat'
  },
  {
    id: 'plan-axis-max-life-smart',
    name: 'Max Life Smart Wealth Plan (Axis Partner)',
    company: 'Axis Max',
    category: 'Savings Plan',
    categoryTag: 'SAVINGS PLAN',
    description: 'Guaranteed wealth accumulation plan co-distributed with Axis Bank offering guaranteed additions and life cover.',
    coverageLabel: 'Guaranteed Maturity',
    coverageAmount: '₹30,00,000',
    premiumStartsFrom: '₹1,650/month*',
    premiumMonthly: 1650,
    features: [
      'Guaranteed additions credited every policy year',
      'Choice of lump-sum or annual income payout',
      'Life insurance cover throughout policy duration',
      'Axis Bank bancassurance priority desk support'
    ],
    badge: 'Guaranteed Return',
    icon: 'FaCoins'
  }
];

export const MY_POLICIES = [
  {
    policyNumber: 'AP-HLTH-88390',
    planName: 'SK Platinum Care',
    type: 'Health',
    status: 'Active',
    coverage: '₹1,000,000',
    startDate: '2025-01-15',
    endDate: '2026-01-14',
    premiumAmount: '₹120/mo',
    paymentFrequency: 'Monthly',
    nextDueDate: '2026-08-15',
    insuredPersons: ['John Doe (Self)', 'Jane Doe (Spouse)'],
    documents: ['Policy_Wording.pdf', 'Premium_Receipt_July.pdf']
  },
  {
    policyNumber: 'AP-LIFE-47291',
    planName: 'SK Term Elite',
    type: 'Life',
    status: 'Active',
    coverage: '₹2,500,000',
    startDate: '2024-03-22',
    endDate: '2049-03-21',
    premiumAmount: '₹45/mo',
    paymentFrequency: 'Monthly',
    nextDueDate: '2026-08-22',
    insuredPersons: ['John Doe (Self)'],
    nominee: 'Jane Doe (Spouse)',
    documents: ['Policy_Certificate.pdf']
  },
  {
    policyNumber: 'AP-MTR-10293',
    planName: 'SK Auto Max Cover',
    type: 'Motor',
    status: 'Renewal Due',
    coverage: '₹35,000 (Vehicle IDV)',
    startDate: '2025-07-20',
    endDate: '2026-07-20',
    premiumAmount: '₹420/yr',
    paymentFrequency: 'Annually',
    nextDueDate: '2026-07-20',
    vehicleDetails: 'Tesla Model 3 (2023) - Reg: TX-77B-998',
    documents: ['Auto_Insurance_Card.pdf', 'Terms_Schedule.pdf']
  }
];

export const CLAIMS = [
  {
    id: 'CLM-9028',
    policyNumber: 'AP-HLTH-88390',
    planName: 'SK Platinum Care',
    type: 'Health',
    amount: '₹3,200',
    dateFiled: '2026-06-12',
    status: 'Approved',
    description: 'Emergency appendectomy hospital charges at St. Mary Hospital.',
    history: [
      { date: '2026-06-12', status: 'Claim Filed', note: 'Claim documents submitted successfully.' },
      { date: '2026-06-14', status: 'Document Verification', note: 'Hospital bills and discharge summary validated.' },
      { date: '2026-06-16', status: 'Approved', note: 'Claim approved by auditor. Payout processed.' }
    ]
  },
  {
    id: 'CLM-4431',
    policyNumber: 'AP-MTR-10293',
    planName: 'SK Auto Max Cover',
    type: 'Motor',
    amount: '₹1,850',
    dateFiled: '2026-07-02',
    status: 'In Progress',
    description: 'Minor bumper damage repair claim following parking lot collision.',
    history: [
      { date: '2026-07-02', status: 'Claim Filed', note: 'Incident report and photos submitted.' },
      { date: '2026-07-05', status: 'Surveyor Assigned', note: 'Surveyor inspector Mike Jenkins assigned.' },
      { date: '2026-07-09', status: 'Inspection Completed', note: 'Damage estimate evaluated. Under final review.' }
    ]
  },
  {
    id: 'CLM-0192',
    policyNumber: 'AP-HLTH-88390',
    planName: 'SK Platinum Care',
    type: 'Health',
    amount: '₹450',
    dateFiled: '2025-11-20',
    status: 'Settled',
    description: 'Outpatient specialist consultation and prescription medication bills.',
    history: [
      { date: '2025-11-20', status: 'Claim Filed', note: 'Pharmacy bills submitted.' },
      { date: '2025-11-21', status: 'Approved', note: 'Claim approved.' },
      { date: '2025-11-24', status: 'Settled', note: 'Funds deposited in customer\'s primary bank account.' }
    ]
  }
];

export const LEADS = [
  { id: 'LD-902', name: 'Robert Dow', phone: '+1 234-987-1122', email: 'robert@test.com', planInterest: 'Health Plan', status: 'New', notes: 'Interested in Platinum plan, requested call after 4 PM' },
  { id: 'LD-903', name: 'Angela Merkel', phone: '+1 345-123-5566', email: 'angela@merkel.de', planInterest: 'Home Cover', status: 'Contacted', notes: 'Wants premium details for structure coverage' },
  { id: 'LD-904', name: 'Elon Dust', phone: '+1 899-722-1111', email: 'elon.d@spacey.org', planInterest: 'Motor Insurance', status: 'Follow Up', notes: 'Wants multi-vehicle discount for electric cars' },
  { id: 'LD-905', name: 'Steve Jobs', phone: '+1 408-999-8888', email: 'steve@apple.com', planInterest: 'Life Cover', status: 'Interested', notes: 'Interested in high premium riders and disability benefits' },
  { id: 'LD-906', name: 'Warren Buffet', phone: '+1 402-123-4567', email: 'warren@berkshire.com', planInterest: 'Life Cover', status: 'Not Interested', notes: 'Refused offer, already has comprehensive life packages' }
];

export const CLIENTS = [
  { id: 'CLT-1102', name: 'Mark Zuckerberg', email: 'zuck@meta.com', phone: '+1 650-111-2222', activePolicies: 2, lastContact: '2026-07-01', totalPremium: '₹2,400/yr', riskLevel: 'Low' },
  { id: 'CLT-1103', name: 'Jeff Bezos', email: 'jeff@amazon.com', phone: '+1 206-888-9999', activePolicies: 1, lastContact: '2026-06-25', totalPremium: '₹1,800/yr', riskLevel: 'Medium' },
  { id: 'CLT-1104', name: 'Bill Gates', email: 'bill@gatesfoundation.org', phone: '+1 425-777-5555', activePolicies: 3, lastContact: '2026-07-12', totalPremium: '₹5,200/yr', riskLevel: 'Low' },
  { id: 'CLT-1105', name: 'Tim Cook', email: 'tcook@apple.com', phone: '+1 408-555-0199', activePolicies: 1, lastContact: '2026-05-18', totalPremium: '₹900/yr', riskLevel: 'Low' }
];

export const SUPPORT_TICKETS = [
  { id: 'TCK-8819', creator: 'John Doe', subject: 'Tax Certificate Query', priority: 'Medium', status: 'Open', dateCreated: '2026-07-13', category: 'Tax' },
  { id: 'TCK-8812', creator: 'Jeff Bezos', subject: 'Policy Addition Issue', priority: 'High', status: 'Resolved', dateCreated: '2026-07-08', category: 'Technical' },
  { id: 'TCK-8809', creator: 'Bill Gates', subject: 'Auto Debit Setup Failed', priority: 'High', status: 'In Review', dateCreated: '2026-07-11', category: 'Billing' }
];

export const BLOG_POSTS = [
  {
    id: 'blog-1',
    title: 'Top 5 Tips to Reduce Your Car Insurance Premium',
    excerpt: 'Find out how defensive driving courses, higher deductibles, and anti-theft equipment can lower your premium payments significantly.',
    content: 'Insurance companies calculate auto insurance premiums based on risk. Fortunately, as a vehicle owner, you have significant control over many risk factors. First, consider taking a certified defensive driving course; many providers offer automatic premium reductions of up to 10% for drivers holding these certificates. Second, adjust your deductibles. Raising your collision and comprehensive deductible from ₹20,000 to ₹80,000 can reduce your premium by 15% to 30%. Third, ensure your car is equipped with anti-theft devices like alarm systems or GPS trackers, which deter thieves and please insurers.',
    category: 'Auto',
    date: 'July 10, 2026',
    author: 'Mark Sterling (Auto Risk Lead)',
    readTime: '4 min read'
  },
  {
    id: 'blog-2',
    title: 'Understanding Term vs. Whole Life Insurance',
    excerpt: 'A clean, comprehensive analysis explaining the difference between simple term plans and cash-accumulation whole-life packages.',
    content: 'Choosing the right life insurance coverage is one of the most critical decisions you will make for your family’s financial future. The debate usually centers on Term Life vs. Whole Life. Term Life is straightforward: you pay a monthly premium for a set period (e.g., 10, 20, or 30 years). If you pass away during the term, your beneficiaries receive the death benefit. Whole Life, conversely, lasts your entire lifetime and includes a "cash value" savings component that grows tax-deferred. While Whole Life offers lifetime security, its premiums can be 5x to 10x higher than Term Life, making Term Life the preferred choice for those looking to maximize immediate protection.',
    category: 'Life',
    date: 'June 28, 2026',
    author: 'Elena Rostova (Financial Planner)',
    readTime: '6 min read'
  },
  {
    id: 'blog-3',
    title: 'A Guide to Planning Health Coverage for Seniors',
    excerpt: 'What to look for in senior citizen policies: critical illness riders, co-payments, pre-existing condition wait times.',
    content: 'As we age, healthcare expenses naturally increase, making comprehensive health insurance vital. When purchasing a policy for seniors, pay careful attention to the "waiting period" for pre-existing diseases, which typically ranges from 1 to 4 years. Additionally, examine the "co-payment" clause—a percentage of the bill the policyholder must pay out-of-pocket (e.g., 20%). Seeking plans with no room-rent sub-limits and checking the network hospital count near the resident home are also essential steps to guarantee quick, stress-free admissions during medical emergencies.',
    category: 'Health',
    date: 'May 14, 2026',
    author: 'Dr. Arthur Pendelton (Health Consultant)',
    readTime: '5 min read'
  }
];

export const FAQS = [
  {
    question: 'How long does it take to process a claim?',
    answer: 'Most outpatient health claims and minor motor claims are processed within 3 to 5 business days. In-patient cash-less claims are settled directly with the hospital within 2 to 4 hours. Complex claims requiring physical surveys or extensive documentation can take up to 14 business days.'
  },
  {
    question: 'Can I change my nominee details after purchasing a life policy?',
    answer: 'Yes. You can update nominee details at any time by logging into the Customer Dashboard, navigating to the "Policy Details" page, clicking on "Manage Nominee," and uploading the updated nomination form. Changes are typically processed within 24 hours.'
  },
  {
    question: 'What is a "No Claim Bonus" (NCB)?',
    answer: 'A No Claim Bonus is a discount on the renewal premium offered by insurance companies to policyholders who did not file any claims during the preceding policy year. It accumulates annually and can reach up to 50% for motor and health policies, providing substantial savings.'
  },
  {
    question: 'Is international medical coverage included in health plans?',
    answer: 'Our SK Platinum Care plan provides global cashless healthcare cover. Other standard plans generally cover emergency medical expenses within the home country. For travel abroad, we recommend our specialized GlobeTrotter Pro travel plan.'
  }
];

export const CAREERS = [
  {
    id: 'car-1',
    title: 'Senior Claims Underwriter',
    department: 'Claims & Underwriting',
    location: 'Austin, TX (Hybrid)',
    type: 'Full-time',
    description: 'We are seeking a senior underwriting professional with 5+ years of experience to assess high-risk premium portfolios and streamline employee validation systems.'
  },
  {
    id: 'car-2',
    title: 'Insurance Sales Agent',
    department: 'Agency Force',
    location: 'Remote (USA)',
    type: 'Commission-based',
    description: 'Looking for energetic individuals with active state insurance licenses. Earn competitive commissions, access top-tier marketing support, and manage your portfolio inside our agent interface.'
  },
  {
    id: 'car-3',
    title: 'Lead Frontend Developer (React)',
    department: 'Digital Innovation Hub',
    location: 'New York, NY (On-site)',
    type: 'Full-time',
    description: 'Help us design and polish the next generation of premium client portals. Advanced knowledge of React, Tailwind CSS, routing architectures, and dashboard optimization is required.'
  }
];

export const NOTIFICATIONS = [
  { id: 'ntf-1', title: 'Premium Payment Received', message: 'Thank you for your premium payment of ₹120 for policy AP-HLTH-88390.', time: '2 hours ago', unread: true, type: 'payment' },
  { id: 'ntf-2', title: 'Claim Status Updated', message: 'Claim CLM-4431 has progressed to "Surveyor Inspection" stage.', time: '1 day ago', unread: true, type: 'claim' },
  { id: 'ntf-3', title: 'Renewal Impending', message: 'Your Auto Max Cover policy AP-MTR-10293 expires in 6 days. Click to renew.', time: '2 days ago', unread: false, type: 'alert' }
];

export const SYSTEM_LOGS = [
  { timestamp: '2026-07-14T12:05:12', user: 'Alex Mercer (Admin)', action: 'System settings update', status: 'Success', ip: '192.168.1.1' },
  { timestamp: '2026-07-14T11:45:22', user: 'Mike Ross (Telecaller)', action: 'Status change LD-902 -> Contacted', status: 'Success', ip: '192.168.1.42' },
  { timestamp: '2026-07-14T10:12:00', user: 'Jane Watson (Employee)', action: 'Claim CLM-9028 approved', status: 'Success', ip: '192.168.1.109' },
  { timestamp: '2026-07-14T09:30:15', user: 'System Cron', action: 'Automated renewal reminders dispatched', status: 'Success', ip: 'localhost' }
];
