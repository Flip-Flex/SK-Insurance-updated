import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    // Nav links
    home: "Home",
    about: "About Us",
    plans: "Plans",
    calc: "Premium Calculator",
    contact: "Contact",
    book_appointment: "Book Appointment",
    login: "Login",
    logout: "Log Out",
    dashboard: "Dashboard",
    select_lang: "Select Language",

    // Hero Section
    securing_legacies: "Securing Legacies, Simplifying Protection",
    hero_title: "Premium Insurance Redefined.",
    hero_subtitle: "Explore bespoke digital health, life, and asset coverage packages designed around you. Settle claims in real time.",
    hero_cta_calc: "Calculate Premium Quote",
    hero_cta_plans: "View Insurance Plans",

    // Stats
    claims_rate: "Claims Settlement Rate",
    claims_disbursed: "Claims Disbursed",
    clients_protected: "Global Clients Protected",
    avg_rating: "Average Rating",

    // What is Insurance
    fl_101: "Financial Literacy 101",
    what_is_ins_title: "Understanding Insurance & Investments",
    what_is_ins_desc: "Insurance is a critical contract designed to shield individuals from severe financial losses. Discover how it works.",
    card_1_title: "What is Insurance?",
    card_1_desc: "A risk management tool where an individual pays a small premium in exchange for protection against major losses.",
    card_2_title: "Health Cover",
    card_2_desc: "Guards against medical emergencies by paying for hospitalization, operations, and diagnostics directly.",
    card_3_title: "Life Insurance",
    card_3_desc: "Secures your family's future financially in your absence, paying out a death benefit or savings.",
    card_4_title: "Motor & General",
    card_4_desc: "Protects your physical assets (cars, homes) from collisions, fires, natural disasters, or liabilities.",

    // SIP
    sip_title: "Systematic Investment Plan (SIP) Calculator",
    sip_desc: "Calculate how small monthly contributions in mutual funds grow over time with compounding interest.",
    sip_monthly: "Monthly Investment",
    sip_rate: "Expected Return Rate (p.a.)",
    sip_period: "Time Period",
    sip_summary: "Estimate Summary",
    sip_invested: "Invested Amount",
    sip_est_returns: "Est. Compound Returns",
    sip_total_value: "Total Accumulation Value",
    sip_cta: "Schedule Advisory Consultation",

    // Reviews
    reviews_title: "Trusted Learning & Advisory",
    reviews_subtitle: "Read transparent reviews from our interns and clients on their experience with SK Smart Investments.",

    // Footer
    footer_desc: "Providing expert insurance and investment solutions built on trust and strategic planning.",
    footer_rights: "© 2026 SK Smart Investments.",
    footer_insurance: "Insurance",
    footer_company: "Company",
    footer_contact: "Contact Us",
    footer_hq: "Headquarters Coordinates",
    footer_hours: "Office Operating Hours",
    footer_email: "Email Communications",
    footer_privacy: "Privacy Policy",
    footer_terms: "Terms of Service",
    footer_sitemap: "Sitemap",

    // About Page
    about_firm: "About Our Firm",
    about_hero_title: "Securing Wealth, Empowering Futures",
    about_hero_subtitle: "SK Smart Investments is a trusted financial services firm committed to helping individuals achieve their long-term financial goals through smart, objective planning.",
    about_founders_title: "Our Founders & Story",
    about_founder_story_1: "SK Smart Investments, a trusted financial service, is helping individuals achieve their financial goals through smart investments. Founded by PRAKASH & KUMUTHA, Certified Financial Planner and Distributor, the company offers a range of services including Insurance, Mutual Fund investments, Retirement Planning, Tax Saving Solutions, and Health Insurance Planning.",
    about_founder_story_2: "With a focus on goal-based financial planning, SK Smart Investments aims to provide wealth creation opportunities for its clients. The company has been actively engaging with its audience on Facebook & Instagram sharing valuable insights on investment strategies, tax planning, and financial literacy, emphasizing the importance of financial planning for long-term goals.",
    about_founder_story_3: "SK Smart Investment's expertise in Insurance, mutual funds and financial planning has enabled it to build a strong reputation in the community. With its headquarters in Kanchipuram, the company is committed to providing personalized financial services to its clients. By leveraging its expertise and experience, SK Smart Investments aims to help individuals achieve financial freedom and security!",
    milestones_recognition: "Milestones & Recognition",
    award_winning_service: "Award-Winning Service",
    awards_desc: "Honored by financial institutions and communities. Click any certificate to zoom.",

    // Plans Page
    tailored_offerings: "Tailored Offerings",
    plans_title: "Corporate & Personal Insurance Packages",
    plans_subtitle: "Browse our premium catalog of standard and comprehensive plans. Filter policies and start your digital application instantly.",
    standard_coverage_value: "Standard Coverage Value",
    starting_premium: "Starting Premium",
    included_features: "Included Features",
    apply_now: "Apply Now",

    // Calculator Page
    calc_badge: "Premium Quote Estimator",
    calc_title: "Interactive Premium Calculator",
    calc_subtitle: "Calculate custom insurance quotes in real time based on your selected coverage levels and variables.",
    calculate_monthly_estimate: "Calculate Monthly Estimate",
    annual_income: "Annual Household Income",
    health_medical_history: "Medical History Status",
    coverage_amount: "Target Coverage Amount",
    estimated_monthly_premium: "Estimated Monthly Premium",

    // Support Page
    support_badge: "Customer Service",
    support_title: "How Can We Support You Today?",
    support_subtitle: "Browse our frequently asked questions, log a support ticket, or connect with our support underwriting agents directly.",
    corp_office: "SK Smart Corporate Office",
    hq_coordinates: "Headquarters Coordinates",
    office_hours: "Office Operating Hours",
    email_comms: "Email Communications",
    submit_ticket: "Log Support Ticket",
    ticket_success: "Ticket Logged Successfully!",
    faq_title: "Frequently Asked Questions",

    // Auth Page
    auth_title: "Operations Management Portal",
    auth_subtitle: "Log in to access your administrative panels, customer portfolios, policy logs, and live underwriting systems.",
    sign_in: "Login",
    signing_in: "Signing in...",
    invalid_credentials: "Invalid credentials. Please try again."
  },
  ta: {
    // Nav links
    home: "முகப்பு",
    about: "எங்களைப் பற்றி",
    plans: "திட்டங்கள்",
    calc: "பிரீமியம் கால்குலேட்டர்",
    contact: "தொடர்பு",
    book_appointment: "அப்பாயிண்ட்மெண்ட் முன்பதிவு",
    login: "உள்நுழை",
    logout: "வெளியேறு",
    dashboard: "டாஷ்போர்டு",
    select_lang: "மொழியைத் தேர்ந்தெடுக்கவும்",

    // Hero Section
    securing_legacies: "பாரம்பரியத்தைப் பாதுகாத்தல், பாதுகாப்பை எளிதாக்குதல்",
    hero_title: "பிரீமியம் காப்பீடு மறுவரையறை செய்யப்பட்டது.",
    hero_subtitle: "உங்களைச் சுற்றி வடிவமைக்கப்பட்ட டிஜிட்டல் ஆரோக்கியம், ஆயுள் மற்றும் சொத்து காப்பீட்டுத் தொகுப்புகளை ஆராயுங்கள். நிகழ்நேரத்தில் கோரிக்கைகளைத் தீர்க்கவும்.",
    hero_cta_calc: "பிரீமியம் மேற்கோளைக் கணக்கிடுங்கள்",
    hero_cta_plans: "காப்பீட்டுத் திட்டங்களைப் பார்க்கவும்",

    // Stats
    claims_rate: "கோரிக்கை தீர்வு விகிதம்",
    claims_disbursed: "வழங்கப்பட்ட கோரிக்கைகள்",
    clients_protected: "பாதுகாக்கப்பட்ட உலகளாவிய வாடிக்கையாளர்கள்",
    avg_rating: "சராசரி மதிப்பீடு",

    // What is Insurance
    fl_101: "நிதி அறிவு 101",
    what_is_ins_title: "காப்பீடு மற்றும் முதலீடுகளைப் புரிந்துகொள்வது",
    what_is_ins_desc: "காப்பீடு என்பது கடுமையான நிதி இழப்புகளில் இருந்து தனிநபர்களைப் பாதுகாக்கும் ஒரு முக்கியமான ஒப்பந்தமாகும்.",
    card_1_title: "காப்பீடு என்றால் என்ன?",
    card_1_desc: "ஒரு நபர் பெரிய இழப்புகளுக்கு எதிரான பாதுகாப்பிற்கு ஈடாக ஒரு சிறிய பிரீமியத்தை செலுத்தும் ஒரு இடர் மேலாண்மை கருவி.",
    card_2_title: "ஆரோக்கிய காப்பீடு",
    card_2_desc: "மருத்துவமனை அனுமதி, அறுவை சிகிச்சைகள் மற்றும் நோயறிதல்களுக்கு நேரடியாக பணம் செலுத்துவதன் மூலம் மருத்துவ அவசரநிலைகளிலிருந்து பாதுகாக்கிறது.",
    card_3_title: "ஆயுள் காப்பீடு",
    card_3_desc: "நீங்கள் இல்லாத நேரத்தில் உங்கள் குடும்பத்தின் எதிர்காலத்தை நிதி ரீதியாகப் பாதுகாக்கிறது, மரண பலன் அல்லது சேமிப்பை வழங்குகிறது.",
    card_4_title: "மோட்டார் & பொது",
    card_4_desc: "முறிவுகள், தீ, இயற்கை பேரழிவுகள் அல்லது பொறுப்புகளில் இருந்து உங்கள் உடல் சொத்துக்களை (கார்கள், வீடுகள்) பாதுகாக்கிறது.",

    // SIP
    sip_title: "முறையான முதலீட்டுத் திட்டம் (SIP) கால்குலேட்டர்",
    sip_desc: "கூட்டு வட்டியுடன் காலப்போக்கில் பரஸ்பர நிதிகளில் சிறிய மாதாந்திர பங்களிப்புகள் எவ்வாறு வளர்கின்றன என்பதைக் கணக்கிடுங்கள்.",
    sip_monthly: "மாதாந்திர முதலீடு",
    sip_rate: "எதிர்பார்க்கப்படும் வருவாய் விகிதம் (ஆண்டுக்கு)",
    sip_period: "கால அளவு",
    sip_summary: "மதிப்பீட்டு சுருக்கம்",
    sip_invested: "முதலீடு செய்யப்பட்ட தொகை",
    sip_est_returns: "மதிப்பிடப்பட்ட கூட்டு வருவாய்",
    sip_total_value: "மொத்த குவிப்பு மதிப்பு",
    sip_cta: "ஆலோசனைக்கு திட்டமிடுங்கள்",

    // Reviews
    reviews_title: "நம்பகமான கற்றல் & ஆலோசனை",
    reviews_subtitle: "எஸ்கே ஸ்மார்ட் இன்வெஸ்ட்மென்ட்ஸுடனான தங்களின் அனுபவத்தைப் பற்றி எங்கள் இன்டர்ன்கள் மற்றும் வாடிக்கையாளர்களின் மதிப்புரைகளைப் படிக்கவும்.",

    // Footer
    footer_desc: "நம்பிக்கை மற்றும் மூலோபாய திட்டமிடலின் அடிப்படையில் கட்டமைக்கப்பட்ட நிபுணத்துவ காப்பீடு மற்றும் முதலீட்டு தீர்வுகளை வழங்குதல்.",
    footer_rights: "© 2026 எஸ்கே ஸ்மார்ட் இன்வெஸ்ட்மென்ட்ஸ். அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை. அனைத்து மாதிரி செயல்பாடுகளும் டெமோ நோக்கங்களுக்காக மட்டுமே.",
    footer_insurance: "காப்பீடு",
    footer_company: "நிறுவனம்",
    footer_contact: "எங்களைத் தொடர்பு கொள்ளவும்",
    footer_hq: "தலைமையக ஒருங்கிணைப்புகள்",
    footer_hours: "அலுவலக வேலை நேரம்",
    footer_email: "மின்னஞ்சல் தொடர்புகள்",
    footer_privacy: "தனியுரிமைக் கொள்கை",
    footer_terms: "சேவை விதிமுறைகள்",
    footer_sitemap: "தளவரைபடம்",

    // About Page
    about_firm: "எங்கள் நிறுவனத்தைப் பற்றி",
    about_hero_title: "செல்வத்தைப் பாதுகாத்தல், எதிர்காலத்தை மேம்படுத்துதல்",
    about_hero_subtitle: "எஸ்கே ஸ்மார்ட் இன்வெஸ்ட்மென்ட்ஸ் என்பது நம்பகமான நிதிச் சேவை நிறுவனமாகும், இது தனிநபர்கள் தங்கள் நீண்டகால நிதி இலக்குகளை அடைய உதவுகிறது.",
    about_founders_title: "எங்கள் நிறுவனர்கள் & கதை",
    about_founder_story_1: "எஸ்கே ஸ்மார்ட் இன்வெஸ்ட்மென்ட்ஸ், ஒரு நம்பகமான நிதிச் சேவை, ஸ்மார்ட் முதலீடுகள் மூலம் தனிநபர்கள் தங்கள் நிதி இலக்குகளை அடைய உதவுகிறது. சான்றளிக்கப்பட்ட நிதித் திட்டமிடுபவர் மற்றும் விநியோகஸ்தரான பிரகாஷ் & குமுதா ஆகியோரால் நிறுவப்பட்டது, இந்நிறுவனம் காப்பீடு, பரஸ்பர நிதி முதலீடுகள், ஓய்வூதியத் திட்டமிடல், வரி சேமிப்பு தீர்வுகள் மற்றும் சுகாதார காப்பீட்டுத் திட்டமிடல் உள்ளிட்ட பல்வேறு சேவைகளை வழங்குகிறது.",
    about_founder_story_2: "இலக்கு அடிப்படையிலான நிதித் திட்டமிடலில் கவனம் செலுத்துவதன் மூலம், எஸ்கே ஸ்மார்ட் இன்வெஸ்ட்மென்ட்ஸ் தனது வாடிக்கையாளர்களுக்கு செல்வத்தை உருவாக்குவதற்கான வாய்ப்புகளை வழங்குவதை நோக்கமாகக் கொண்டுள்ளது. நிறுவனம் தனது பார்வையாளர்களுடன் பேஸ்புக் மற்றும் இன்ஸ்டாகிராமில் தீவிரமாக ஈடுபட்டு வருகிறது, முதலீட்டு உத்திகள், வரி திட்டமிடல் மற்றும் நிதி கல்வியறிவு பற்றிய மதிப்புமிக்க நுண்ணறிவுகளைப் பகிர்ந்து கொள்கிறது.",
    about_founder_story_3: "காப்பீடு, பரஸ்பர நிதிகள் மற்றும் நிதித் திட்டமிடல் ஆகியவற்றில் எஸ்கே ஸ்மார்ட் இன்வெஸ்ட்மென்ட்ஸின் நிபுணத்துவம் சமூகத்தில் வலுவான நற்பெயரைக் கட்டியெழுப்ப உதவியுள்ளது. காஞ்சிபுரத்தை தலைமையகமாகக் கொண்டுள்ள இந்நிறுவனம், தனது வாடிக்கையாளர்களுக்கு தனிப்பயனாக்கப்பட்ட நிதிச் சேவைகளை வழங்க உறுதிபூண்டுள்ளது.",
    milestones_recognition: "மைல்கற்கள் & அங்கீகாரம்",
    award_winning_service: "விருது பெற்ற சேவை",
    awards_desc: "நிதி நிறுவனங்கள் மற்றும் சமூகங்களால் கௌரவிக்கப்பட்டது. பெரிதாக்க ஏதேனும் சான்றிதழைக் கிளிக் செய்யவும்.",

    // Plans Page
    tailored_offerings: "வடிவமைக்கப்பட்ட சலுகைகள்",
    plans_title: "கார்ப்பரேட் மற்றும் தனிநபர் காப்பீட்டுத் தொகுப்புகள்",
    plans_subtitle: "நிலையான மற்றும் விரிவான திட்டங்களின் எங்கள் பிரீமியம் பட்டியலை உலாவுக. கொள்கைகளை வடிகட்டி, உங்கள் டிஜிட்டல் பயன்பாட்டை உடனடியாகத் தொடங்கவும்.",
    standard_coverage_value: "நிலையான கவரேஜ் மதிப்பு",
    starting_premium: "தொடக்க பிரீமியம்",
    included_features: "சேர்க்கப்பட்ட அம்சங்கள்",
    apply_now: "இப்போது விண்ணப்பிக்கவும்",

    // Calculator Page
    calc_badge: "மதிப்பீட்டாளர்",
    calc_title: "ஊடாடும் பிரீமியம் கால்குலேட்டர்",
    calc_subtitle: "நீங்கள் தேர்ந்தெடுத்த கவரேஜ் நிலைகள் மற்றும் மாறிகளின் அடிப்படையில் நிகழ்நேரத்தில் தனிப்பயன் காப்பீட்டு மேற்கோள்களைக் கணக்கிடுங்கள்.",
    calculate_monthly_estimate: "மாதாந்திர மதிப்பீட்டைக் கணக்கிடுங்கள்",
    annual_income: "ஆண்டு வீட்டு வருமானம்",
    health_medical_history: "மருத்துவ வரலாறு நிலை",
    coverage_amount: "இலக்கு கவரேஜ் தொகை",
    estimated_monthly_premium: "மதிப்பிடப்பட்ட மாதாந்திர பிரீமியம்",

    // Support Page
    support_badge: "வாடிக்கையாளர் சேவை",
    support_title: "இன்று நாம் உங்களுக்கு எவ்வாறு உதவலாம்?",
    support_subtitle: "எங்கள் அடிக்கடி கேட்கப்படும் கேள்விகளை உலாவுக, ஆதரவு டிக்கெட்டைப் பதிவுசெய்க அல்லது எங்கள் ஆதரவு முகவர்களுடன் நேரடியாக இணைக்கவும்.",
    corp_office: "எஸ்கே ஸ்மார்ட் கார்ப்பரேட் அலுவலகம்",
    hq_coordinates: "தலைமையக ஒருங்கிணைப்புகள்",
    office_hours: "அலுவலக வேலை நேரம்",
    email_comms: "மின்னஞ்சல் தொடர்புகள்",
    submit_ticket: "ஆதரவு டிக்கெட்டை சமர்ப்பிக்கவும்",
    ticket_success: "டிக்கெட் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!",
    faq_title: "அடிக்கடி கேட்கப்படும் கேள்விகள்",

    // Auth Page
    auth_title: "செயல்பாட்டு மேலாண்மை போர்டல்",
    auth_subtitle: "உங்கள் நிர்வாக பேனல்கள், வாடிக்கையாளர் போர்ட்ஃபோலியோக்கள் மற்றும் காப்பீட்டு பதிவுகளை அணுக உள்நுழையவும்.",
    sign_in: "உள்நுழைக",
    signing_in: "உள்நுழைகிறது...",
    invalid_credentials: "தவறான சான்றுகள். மீண்டும் முயற்சிக்கவும்."
  },
  te: {
    // Nav links
    home: "హోమ్",
    about: "మా గురించి",
    plans: "ప్లాన్స్",
    calc: "ప్రీమియం కాలిక్యులేటర్",
    contact: "సంప్రదించండి",
    book_appointment: "అపాయింట్‌మెంట్ బుక్ చేయండి",
    login: "లాగిన్",
    logout: "లాగ్ అవుట్",
    dashboard: "డాష్‌బోర్డ్",
    select_lang: "భాషను ఎంచుకోండి",

    // Hero Section
    securing_legacies: "వారసత్వాలను భద్రపరచడం, రక్షణను సులభతరం చేయడం",
    hero_title: "ప్రీమియం ఇన్సూరెన్స్ పునర్నిర్వచించబడింది.",
    hero_subtitle: "మీ చుట్టూ రూపొందించబడిన డిజిటల్ ఆరోగ్యం, జీవిత మరియు ఆస్తి కవరేజ్ ప్యాకేజీలను అన్వేషించండి. నిజ సమయంలో క్లెయిమ్‌లను పరిష్కరించుకోండి.",
    hero_cta_calc: "ప్రీమియం కోట్‌ను లెక్కించండి",
    hero_cta_plans: "ఇన్సూరెన్స్ ప్లాన్‌లను చూడండి",

    // Stats
    claims_rate: "క్లెయిమ్స్ పరిష్కార రేటు",
    claims_disbursed: "పంపిణీ చేయబడిన క్లెయిమ్స్",
    clients_protected: "రక్షించబడిన ప్రపంచవ్యాప్త క్లయింట్లు",
    avg_rating: "సగటు రేటింగ్",

    // What is Insurance
    fl_101: "ఆర్థిక అక్షరాస్యత 101",
    what_is_ins_title: "ఇన్సూరెన్స్ & ఇన్వెస్ట్‌మెంట్స్ అవగాహన",
    what_is_ins_desc: "ఇన్సూరెన్స్ అనేది తీవ్రమైన ఆర్థిక నష్టాల నుండి రక్షించడానికి రూపొందించబడిన ఒక ముఖ్యమైన ఒప్పందం.",
    card_1_title: "ఇన్సూరెన్స్ అంటే ఏమిటి?",
    card_1_desc: "పెద్ద నష్టాల నుండి రక్షణకు ప్రతిఫలంగా ఒక వ్యక్తి చిన్న ప్రీమియం చెల్లించే రిస్క్ మేనేజ్‌మెంట్ సాధనం.",
    card_2_title: "ఆరోగ్య బీమా",
    card_2_desc: "హాస్పిటలైజేషన్, ఆపరేషన్లు మరియు డయాగ్నోస్టిక్స్ కోసం నేరుగా చెల్లించడం ద్వారా వైద్య అత్యవసర పరిస్థితుల నుండి రక్షిస్తుంది.",
    card_3_title: "జీవిత బీమా",
    card_3_desc: "మీరు లేనప్పుడు మీ కుటుంబ భవిష్యత్తుకు ఆర్థిక భద్రత కల్పిస్తుంది, డెత్ బెనిఫిట్ లేదా పొదుపును అందిస్తుంది.",
    card_4_title: "మోటార్ & జనరల్",
    card_4_desc: "ప్రమాదాలు, మంటలు, ప్రకృతి విపత్తులు లేదా బాధ్యతల నుండి మీ భౌతిక ఆస్తులను (కార్లు, ఇళ్లు) రక్షిస్తుంది.",

    // SIP
    sip_title: "సిస్టమాటిక్ ఇన్వెస్ట్‌మెంట్ ప్లాన్ (SIP) కాలిక్యులేటర్",
    sip_desc: "మ్యూచువల్ ఫండ్స్‌లో చిన్న నెలవారీ పెట్టుబడులు కాంపౌండ్ వడ్డీతో కాలక్రమేణా ఎలా పెరుగుతాయో లెక్కించండి.",
    sip_monthly: "నెలవారీ పెట్టుబడి",
    sip_rate: "ఆశించిన రిటర్న్ రేట్ (p.a.)",
    sip_period: "సమయ వ్యవధి",
    sip_summary: "అంచనా సారాంశం",
    sip_invested: "పెట్టుబడి పెట్టిన మొత్తం",
    sip_est_returns: "కాంపౌండ్ రిటర్న్స్ అంచనా",
    sip_total_value: "మొత్తం చేకూరిన విలువ",
    sip_cta: "సలహా సంప్రదింపులను షెడ్యూల్ చేయండి",

    // Reviews
    reviews_title: "నమ్మకమైన అభ్యాసం & సలహా",
    reviews_subtitle: "మా ఇంటర్న్‌లు మరియు క్లయింట్లు ఎస్కే స్మార్ట్ ఇన్వెస్ట్‌మెంట్స్ తో పొందిన అనుభవాల సమీక్షలను చదవండి.",

    // Footer
    footer_desc: "నమ్మకం మరియు వ్యూహాత్మక ప్రణాళికపై నిర్మించబడిన నిపుణులైన బీమా మరియు పెట్టుబడి పరిష్కారాలను అందించడం.",
    footer_rights: "© 2026 ఎస్కే స్మార్ట్ ఇన్వెస్ట్‌మెంట్స్.",
    footer_insurance: "బీమా",
    footer_company: "కంపెనీ",
    footer_contact: "మమ్మల్ని సంప్రదించండి",
    footer_hq: "ప్రధాన కార్యాలయ కోఆర్డినేట్లు",
    footer_hours: "కార్యాలయ పని వేళలు",
    footer_email: "ఈమెయిల్ కమ్యూనికేషన్స్",
    footer_privacy: "గోప్యతా విధానం",
    footer_terms: "సేవా నిబంధనలు",
    footer_sitemap: "సైట్‌మ్యాప్",

    // About Page
    about_firm: "మా సంస్థ గురించి",
    about_hero_title: "సంపదను రక్షించడం, భవిష్యత్తులను బలోపేతం చేయడం",
    about_hero_subtitle: "ఎస్కే స్మార్ట్ ఇన్వెస్ట్‌మెంట్స్ అనేది నమ్మకమైన ఆర్థిక సేవల సంస్థ, ఇది వ్యక్తులు వారి దీర్ఘకాలిక ఆర్థిక लक्ष्यాలను సాధించడంలో సహాయపడుతుంది.",
    about_founders_title: "మా వ్యవస్థాపకులు & కథ",
    about_founder_story_1: "ఎస్కే స్మార్ట్ ఇన్వెస్ట్‌మెంట్స్, నమ్మకమైన ఆర్థిక సేవ, స్మార్ట్ పెట్టుబడుల ద్వారా వ్యక్తులు తమ ఆర్థిక లక్ష్యాలను సాధించడంలో సహాయపడుతుంది. సర్టిఫైడ్ ఫైనాన్షియల్ ప్లానర్ మరియు డిస్ట్రిబ్యూటర్ అయిన ప్రకాష్ & కుముత ద్వారా స్థాపించబడింది, ఈ సంస్థ ఇన్సూరెన్స్, మ్యూచువల్ ఫండ్ పెట్టుబడులు, రిటైర్మెంట్ ప్లానింగ్, టాక్స్ సేవింగ్ సొల్యూషన్స్ మరియు హెల్త్ ఇన్సూరెన్స్ ప్లానింగ్‌తో సహా అనేక రకాల సేవలను అందిస్తుంది.",
    about_founder_story_2: "లక్ష్య ఆధారిత ఆర్థిక ప్రణాళికపై దృష్టి సారించడంతో, ఎస్కే స్మార్ట్ ఇన్వెస్ట్‌మెంట్స్ తన క్లయింట్‌లకు సంపద సృష్టి అవకాశాలను అందించడమే లక్ష్యంగా పెట్టుకుంది. కంపెనీ తన ప్రేక్షకులతో ఫేస్‌బుక్ & ఇన్‌స్టాగ్రామ్‌లో చురుకుగా పాల్గొంటోంది, పెట్టుబడి వ్యూహాలు, పన్ను ప్రణాళిక మరియు ఆర్థిక అక్షరాస్యతపై విలువైన అంతర్దృష్టులను పంచుకుంటుంది.",
    about_founder_story_3: "బీమా, మ్యూచువల్ ఫండ్స్ మరియు ఆర్థిక ప్రణాళికలలో ఎస్కే స్మార్ట్ ఇన్వెస్ట్‌మెంట్స్ యొక్క నైపుణ్యం సమాజంలో బలమైన ఖ్యాతిని నిర్మించడంలో సహాయపడింది. కాంచీపురం ప్రధాన కార్యాలయంగా ఉన్న ఈ సంస్థ తన ఖాతాదారులకు వ్యక్తిగతీకరించిన ఆర్థిక సేవలను అందించడానికి కట్టుబడి ఉంది.",
    milestones_recognition: "మైలురాళ్ళు & గుర్తింపు",
    award_winning_service: "అవార్డు గెలుచుకున్న సేవ",
    awards_desc: "ఆర్థిక సంస్థలు మరియు సంఘాలచే గౌరవించబడింది. జూమ్ చేయడానికి ఏదైనా సర్టిఫికేట్‌పై క్లిక్ చేయండి.",

    // Plans Page
    tailored_offerings: "తగిన సమర్పణలు",
    plans_title: "కార్పొరేట్ & వ్యక్తిగత బీమా ప్యాకేజీలు",
    plans_subtitle: "ప్రామాణిక మరియు సమగ్ర ప్లాన్‌ల మా ప్రీమియం కేటలాగ్‌ను బ్రౌజ్ చేయండి. పాలసీలను ఫిల్టర్ చేయండి మరియు మీ డిజిటల్ దరఖాస్తును తక్షణమే ప్రారంభించండి.",
    standard_coverage_value: "ప్రామాణిక కవరేజ్ విలువ",
    starting_premium: "ప్రారంభ ప్రీమియం",
    included_features: "చేర్చబడిన ఫీచర్లు",
    apply_now: "ఇప్పుడే దరఖాస్తు చేసుకోండి",

    // Calculator Page
    calc_badge: "అంచనా వేయు సాధనం",
    calc_title: "ఇంటరాక్టివ్ ప్రీమియం కాలిక్యులేటర్",
    calc_subtitle: "మీరు ఎంచుకున్న కవరేజ్ స్థాయిలు మరియు వేరియబుల్స్ ఆధారంగా నిజ సమయంలో అనుకూల బీమా కోట్‌లను లెక్కించండి.",
    calculate_monthly_estimate: "నెలవారీ అంచనాను లెక్కించండి",
    annual_income: "వార్షిక గృహ ఆదాయం",
    health_medical_history: "వైద్య చరిత్ర స్థితి",
    coverage_amount: "లక్ష్య కవరేజ్ మొత్తం",
    estimated_monthly_premium: "అంచనా వేయబడిన నెలవారీ ప్రీమియం",

    // Support Page
    support_badge: "కస్టమర్ సర్వీస్",
    support_title: "ఈరోజు మేము మీకు ఎలా సహాయం చేయగలము?",
    support_subtitle: "మా తరచుగా అడిగే ప్రశ్నలను బ్రౌజ్ చేయండి, సపోర్ట్ టికెట్‌ను నమోదు చేయండి లేదా మా సపోర్ట్ ఏజెంట్లతో నేరుగా కనెక్ట్ అవ్వండి.",
    corp_office: "ఎస్కే స్మార్ట్ కార్పొరేట్ కార్యాలయం",
    hq_coordinates: "ప్రధాన కార్యాలయ కోఆర్డినేట్లు",
    office_hours: "కార్యాలయ పని వేళలు",
    email_comms: "ఈమెయిల్ కమ్యూనికేషన్స్",
    submit_ticket: "సపోర్ట్ టికెట్‌ను సబ్మిట్ చేయండి",
    ticket_success: "టికెట్ విజయవంతంగా నమోదైంది!",
    faq_title: "తరచుగా అడిగే ప్రశ్నలు",

    // Auth Page
    auth_title: "ఆపరేషన్స్ మేనేజ్‌మెంట్ పోర్టల్",
    auth_subtitle: "మీ అడ్మినిస్ట్రేటివ్ ప్యానెల్‌లు, కస్టమర్ పోర్ట్‌ఫోలియోలు మరియు ఇన్సూరెన్స్ లాగ్‌లను యాక్సెస్ చేయడానికి లాగిన్ చేయండి.",
    sign_in: "సైన్ ఇన్",
    signing_in: "సైన్ ఇన్ అవుతోంది...",
    invalid_credentials: "చెల్లని ఆధారాలు. దయచేసి మళ్లీ ప్రయత్నించండి."
  },
  ml: {
    // Nav links
    home: "ഹോം",
    about: "ഞങ്ങളെക്കുറിച്ച്",
    plans: "പദ്ധതികൾ",
    calc: "പ്രീമിയം കാൽക്കുലേറ്റർ",
    contact: "ബന്ധപ്പെടുക",
    book_appointment: "അപ്പോയിന്റ്മെന്റ് ബുക്ക് ചെയ്യുക",
    login: "ലോഗിൻ",
    logout: "ലോഗ് ഔട്ട്",
    dashboard: "ഡാഷ്‌ബോർഡ്",
    select_lang: "ഭാഷ തിരഞ്ഞെടുക്കുക",

    // Hero Section
    securing_legacies: "പാരമ്പര്യം സുരക്ഷിതമാക്കുന്നു, സംരക്ഷണം ലളിതമാക്കുന്നു",
    hero_title: "പ്രീമിയം ഇൻഷുറൻസ് പുനർനിർവചിച്ചു.",
    hero_subtitle: "നിങ്ങൾക്കായി രൂപകൽപ്പന ചെയ്‌തിരിക്കുന്ന ഡിജിറ്റൽ ഹെൽത്ത്, ലൈഫ്, അസറ്റ് ഇൻഷുറൻസ് പാക്കേജുകൾ പര്യവേക്ഷണം ചെയ്യുക. തത്സമയം ക്ലെയ്മുകൾ പരിഹരിക്കുക.",
    hero_cta_calc: "പ്രീമിയം ഉദ്ധരണി കണക്കാക്കുക",
    hero_cta_plans: "ഇൻഷുറൻസ് പദ്ധതികൾ കാണുക",

    // Stats
    claims_rate: "ക്ലെയിം സെറ്റിൽമെന്റ് നിരക്ക്",
    claims_disbursed: "വിതരണം ചെയ്ത ക്ലെയിമുകൾ",
    clients_protected: "ആഗോള ക്ലയന്റുകൾ പരിരക്ഷിക്കപ്പെട്ടു",
    avg_rating: "ശരാശരി റേറ്റിംഗ്",

    // What is Insurance
    fl_101: "സാമ്പത്തിക സാക്ഷരത 101",
    what_is_ins_title: "ഇൻഷുറൻസും നിക്ഷേപങ്ങളും മനസ്സിലാക്കുക",
    what_is_ins_desc: "ഗുരുതരമായ സാമ്പത്തിക നഷ്ടങ്ങളിൽ നിന്ന് വ്യക്തികളെ സംരക്ഷിക്കുന്നതിനായി രൂപകൽപ്പന ചെയ്തിട്ടുള്ള ഒരു സുപ്രധാന കരാറാണ് ഇൻഷുറൻസ്.",
    card_1_title: "എന്താണ് ഇൻഷുറൻസ്?",
    card_1_desc: "വലിയ നഷ്ടങ്ങൾക്കെതിരെയുള്ള സംരക്ഷണത്തിന് പകരമായി ഒരു വ്യക്തി ചെറിയ പ്രീമിയം അടയ്ക്കുന്ന റിസ്ക് മാനേജ്മെന്റ് ഉപകരണം.",
    card_2_title: "ആരോഗ്യ പരിരക്ഷ",
    card_2_desc: "ആശുപത്രിവാസം, ശസ്ത്രക്രിയകൾ, രോഗനിർണയം എന്നിവയ്ക്ക് നേരിട്ട് പണം നൽകിക്കൊണ്ട് മെഡിക്കൽ അടിയന്തിര സാഹചര്യങ്ങളിൽ നിന്ന് സംരക്ഷിക്കുന്നു.",
    card_3_title: "ലൈഫ് ഇൻഷുറൻസ്",
    card_3_desc: "നിങ്ങളുടെ അഭാവത്തിൽ നിങ്ങളുടെ കുടുംബത്തിന്റെ ഭാവി സാമ്പത്തികമായി സുരക്ഷിതമാക്കുന്നു, മരണ ആനുകൂല്യമോ സമ്പാദ്യമോ വാഗ്ദാനം ചെയ്യുന്നു.",
    card_4_title: "മോട്ടോർ & ജനറൽ",
    card_4_desc: "അപകടങ്ങൾ, തീപിടുത്തങ്ങൾ, പ്രകൃതിദുരന്തങ്ങൾ എന്നിവയിൽ നിന്ന് നിങ്ങളുടെ ഭൗതിക ആസ്തികളെ (കാറുകൾ, വീടുകൾ) സംരക്ഷിക്കുന്നു.",

    // SIP
    sip_title: "സിസ്റ്റമാറ്റിക് ഇൻവെസ്റ്റ്‌മെന്റ് പ്ലാൻ (SIP) കാൽക്കുലേറ്റർ",
    sip_desc: "കൂട്ടുപലിശ ഉപയോഗിച്ച് കാലക്രമേണ മ്യൂച്വൽ ഫണ്ടുകളിലെ ചെറിയ പ്രതിമാസ നിക്ഷേപങ്ങൾ എങ്ങനെ വളരുന്നു എന്ന് കണക്കാക്കുക.",
    sip_monthly: "പ്രതിമാസ നിക്ഷേപം",
    sip_rate: "പ്രതീക്ഷിക്കുന്ന റിട്ടേൺ നിരക്ക് (പ്രതിവർഷം)",
    sip_period: "കാലയളവ്",
    sip_summary: "എസ്റ്റിമേറ്റ് സംഗ്രഹം",
    sip_invested: "നിക്ഷേപിച്ച തുക",
    sip_est_returns: "പ്രതീക്ഷിക്കുന്ന കൂട്ടുപലിശ റിട്ടേൺസ്",
    sip_total_value: "ആകെ സമാഹരിച്ച മൂല്യം",
    sip_cta: "ഉപദേശക കൺസൾട്ടേഷൻ ഷെഡ്യൂൾ ചെയ്യുക",

    // Reviews
    reviews_title: "വിശ്വസനീയമായ പഠനവും ഉപദേശവും",
    reviews_subtitle: "എസ്‌കെ സ്മാർട്ട് ഇൻവെസ്റ്റ്‌മെന്റുമായുള്ള അവരുടെ അനുഭവത്തെക്കുറിച്ചുള്ള ഞങ്ങളുടെ ഇന്റേൺമാരുടെയും ക്ലയന്റുകളുടെയും അവലോകനങ്ങൾ വായിക്കുക.",

    // Footer
    footer_desc: "വിശ്വാസത്തിലും തന്ത്രപരമായ ആസൂത്രണത്തിലും അധിഷ്ഠിതമായ വിദഗ്ദ്ധ ഇൻഷുറൻസ്, നിക്ഷേപ പരിഹാരങ്ങൾ നൽകുന്നു.",
    footer_rights: "© 2026 എസ്‌കെ സ്മാർട്ട് ഇൻവെസ്റ്റ്‌മെന്റ്സ്.",
    footer_insurance: "ഇൻഷുറൻസ്",
    footer_company: "കമ്പനി",
    footer_contact: "ഞങ്ങളെ ബന്ധപ്പെടുക",
    footer_hq: "ആസ്ഥാന കോർഡിനേറ്റുകൾ",
    footer_hours: "ഓഫീസ് പ്രവർത്തന സമയം",
    footer_email: "ഇമെയിൽ ആശയവിനിമയങ്ങൾ",
    footer_privacy: "സ്വകാര്യതാ നയം",
    footer_terms: "സേവന നിബന്ധനകൾ",
    footer_sitemap: "സൈറ്റ്മാപ്പ്",

    // About Page
    about_firm: "ഞങ്ങളുടെ സ്ഥാപനത്തെക്കുറിച്ച്",
    about_hero_title: "സമ്പത്ത് സുരക്ഷിതമാക്കുന്നു, ഭാവി ശാക്തീകരിക്കുന്നു",
    about_hero_subtitle: "സ്മാർട്ട്, ഒബ്ജക്റ്റീവ് പ്ലാനിംഗിലൂടെ വ്യക്തികളെ അവരുടെ ദീർഘകാല സാമ്പത്തിക ലക്ഷ്യങ്ങൾ കൈവരിക്കാൻ സഹായിക്കുന്ന വിശ്വസനീയമായ ഒരു സാമ്പത്തിക സേവന സ്ഥാപനമാണ് എസ്‌കെ സ്മാർട്ട് ഇൻവെസ്റ്റ്‌മെന്റ്സ്.",
    about_founders_title: "ഞങ്ങളുടെ സ്ഥാപകരും കഥയും",
    about_founder_story_1: "വിശ്വസ്തരായ സാമ്പത്തിക സേവനമായ എസ്‌കെ സ്മാർട്ട് ഇൻവെസ്റ്റ്‌മെന്റ്സ്, മികച്ച നിക്ഷേപങ്ങളിലൂടെ വ്യക്തികളെ അവരുടെ സാമ്പത്തിക ലക്ഷ്യങ്ങൾ കൈവരിക്കാൻ സഹായിക്കുന്നു. സാക്ഷ്യപ്പെടുത്തിയ ഫിനാൻഷ്യൽ പ്ലാനറും ഡിസ്ട്രിബ്യൂട്ടറുമായ പ്രകാശും കുമുതയും ചേർന്ന് സ്ഥാപിച്ച കമ്പനി ഇൻഷുറൻസ്, മ്യൂച്വൽ ഫണ്ട് നിക്ഷേപങ്ങൾ, റിട്ടയർമെന്റ് പ്ലാനിംഗ്, ടാക്സ് സേവിംഗ് സൊല്യൂഷനുകൾ, ഹെൽത്ത് ഇൻഷുറൻസ് പ്ലാനിംഗ് എന്നിവ ഉൾപ്പെടെയുള്ള സേവനങ്ങൾ വാഗ്ദാനം ചെയ്യുന്നു.",
    about_founder_story_2: "ലക്ഷ്യങ്ങളെ അടിസ്ഥാനമാക്കിയുള്ള സാമ്പത്തിക ആസൂത്രണത്തിൽ ശ്രദ്ധ കേന്ദ്രീകരിച്ചുകൊണ്ട്, എസ്‌കെ സ്മാർട്ട് ഇൻവെസ്റ്റ്‌മെന്റ്സ് അതിന്റെ ക്ലയന്റുകൾക്ക് സമ്പത്ത് സൃഷ്ടിക്കാനുള്ള അവസരങ്ങൾ നൽകാൻ ലക്ഷ്യമിടുന്നു. കമ്പനി തങ്ങളുടെ സോഷ്യൽ മീഡിയ പേജുകളിൽ നിക്ഷേപ തന്ത്രങ്ങൾ, നികുതി ആസൂത്രണം, സാമ്പത്തിക സാക്ഷരത എന്നിവയെക്കുറിച്ചുള്ള വിലപ്പെട്ട വിവരങ്ങൾ പങ്കിടുന്നു.",
    about_founder_story_3: "ഇൻഷുറൻസ്, മ്യൂച്വൽ ഫണ്ടുകൾ, സാമ്പത്തിക ആസൂത്രണം എന്നിവയിലെ കമ്പനിയുടെ വൈദഗ്ധ്യം സമൂഹത്തിൽ ശക്തമായ പ്രതിച്ഛായ നേടാൻ സഹായിച്ചിട്ടുണ്ട്. കാഞ്ചീപുരം ആസ്ഥാനമായി പ്രവർത്തിക്കുന്ന കമ്പനി ക്ലയന്റുകൾക്ക് വ്യക്തിഗതമാക്കിയ സേവനങ്ങൾ നൽകാൻ പ്രതിജ്ഞാബദ്ധമാണ്.",
    milestones_recognition: "നാഴികക്കല്ലുകളും അംഗീകാരവും",
    award_winning_service: "അവാർഡ് നേടിയ സേവനം",
    awards_desc: "ധനകാര്യ സ്ഥാപനങ്ങളും സമൂഹങ്ങളും ആദരിച്ചത്. സൂം ചെയ്യാൻ ഏതെങ്കിലും സർട്ടിഫിക്കറ്റിൽ ക്ലിക്ക് ചെയ്യുക.",

    // Plans Page
    tailored_offerings: "അനുയോജ്യമായ ഓഫറുകൾ",
    plans_title: "കോർപ്പറേറ്റ് & വ്യക്തിഗത ഇൻഷുറൻസ് പാക്കേജുകൾ",
    plans_subtitle: "ഞങ്ങളുടെ പ്രീമിയം ഇൻഷുറൻസ് പ്ലാനുകൾ ബ്രൗസ് ചെയ്യുക. പോളിസികൾ ഫിൽട്ടർ ചെയ്ത് നിങ്ങളുടെ ഡിജിറ്റൽ അപേക്ഷ തൽക്ഷണം ആരംഭിക്കുക.",
    standard_coverage_value: "സ്റ്റാൻഡേർഡ് കവറേജ് മൂല്യം",
    starting_premium: "ആരംഭ പ്രീമിയം",
    included_features: "ഉൾപ്പെടുത്തിയിരിക്കുന്ന സവിശേഷതകൾ",
    apply_now: "ഇപ്പോൾ അപേക്ഷിക്കുക",

    // Calculator Page
    calc_badge: "പ്രീമിയം എസ്റ്റിമേറ്റർ",
    calc_title: "ഇന്ററാക്ടീവ് പ്രീമിയം കാൽക്കുലേറ്റർ",
    calc_subtitle: "നിങ്ങൾ തിരഞ്ഞെടുത്ത കവറേജ് ലെവലുകളും വേരിയബിളുകളും അടിസ്ഥാനമാക്കി തത്സമയം ഇഷ്‌ടാനുസൃത ഇൻഷുറൻസ് ഉദ്ധരണികൾ കണക്കാക്കുക.",
    calculate_monthly_estimate: "പ്രтиമാസ എസ്റ്റിമേറ്റ് കണക്കാക്കുക",
    annual_income: "വാർഷിക ഗാർഹിക വരുമാനം",
    health_medical_history: "മെഡിക്കൽ ചരിത്ര നില",
    coverage_amount: "ലക്ഷ്യമിടുന്ന കവറേജ് തുക",
    estimated_monthly_premium: "പ്രതീക്ഷിക്കുന്ന പ്രതിമാസ പ്രീമിയം",

    // Support Page
    support_badge: "കസ്റ്റമർ സർവീസ്",
    support_title: "ഇന്ന് ഞങ്ങൾക്ക് നിങ്ങളെ എങ്ങനെ സഹായിക്കാനാകും?",
    support_subtitle: "ഞങ്ങളുടെ പതിവുചോദ്യങ്ങൾ ബ്രൗസ് ചെയ്യുക, ഒരു സപ്പോർട്ട് ടിക്കറ്റ് ലോഗ് ചെയ്യുക, അല്ലെങ്കിൽ ഞങ്ങളുടെ പ്രതിനിധികളുമായി നേരിട്ട് ബന്ധപ്പെടുക.",
    corp_office: "എസ്‌കെ സ്മാർട്ട് കോർപ്പറേറ്റ് ഓഫീസ്",
    hq_coordinates: "ആസ്ഥാന കോർഡിനേറ്റുകൾ",
    office_hours: "ഓഫീസ് പ്രവർത്തന സമയം",
    email_comms: "ഇമെയിൽ ആശയവിനിമയങ്ങൾ",
    submit_ticket: "സപ്പോർട്ട് ടിക്കറ്റ് സമർപ്പിക്കുക",
    ticket_success: "ടിക്കറ്റ് വിജയകരമായി സമർപ്പിച്ചു!",
    faq_title: "പതിവായി ചോദിക്കുന്ന ചോദ്യങ്ങൾ",

    // Auth Page
    auth_title: "ഓപ്പറേഷൻസ് മാനേജ്മെന്റ് പോർട്ടൽ",
    auth_subtitle: "നിങ്ങളുടെ അഡ്മിനിസ്ട്രേറ്റീവ് പാനലുകൾ, പോർട്ട്ഫോളിയോകൾ, പോളിസി ലോഗുകൾ എന്നിവ ആക്സസ് ചെയ്യാൻ ലോഗിൻ ചെയ്യുക.",
    sign_in: "സൈൻ ഇൻ",
    signing_in: "സൈൻ ഇൻ ചെയ്യുന്നു...",
    invalid_credentials: "തെറ്റായ ക്രെഡൻഷ്യലുകൾ. ദയവായി വീണ്ടും ശ്രമിക്കുക."
  },
  hi: {
    // Nav links
    home: "मुख्य पृष्ठ",
    about: "हमारे बारे में",
    plans: "योजनाएं",
    calc: "प्रीमियम कैलकुलेटर",
    contact: "संपर्क करें",
    book_appointment: "अपॉइंटमेंट बुक करें",
    login: "लॉगिन",
    logout: "लॉग आउट",
    dashboard: "डैशबोर्ड",
    select_lang: "भाषा चुनें",

    // Hero Section
    securing_legacies: "विरासत को सुरक्षित रखना, सुरक्षा को सरल बनाना",
    hero_title: "प्रीमियम बीमा पुनर्परिभाषित।",
    hero_subtitle: "डिजिटल स्वास्थ्य, जीवन और संपत्ति बीमा पैकेजों की खोज करें। वास्तविक समय में दावों का निपटान करें।",
    hero_cta_calc: "प्रीमियम कोट की गणना करें",
    hero_cta_plans: "बीमा योजनाएं देखें",

    // Stats
    claims_rate: "दावा निपटान दर",
    claims_disbursed: "वितरित दावे",
    clients_protected: "सुरक्षित वैश्विक ग्राहक",
    avg_rating: "औसत रेटिंग",

    // What is Insurance
    fl_101: "वित्तीय साक्षरता 101",
    what_is_ins_title: "बीमा और निवेश को समझना",
    what_is_ins_desc: "बीमा गंभीर वित्तीय नुकसान से बचाने के लिए बनाया गया एक महत्वपूर्ण अनुबंध है।",
    card_1_title: "बीमा क्या है?",
    card_1_desc: "एक जोखिम प्रबंधन उपकरण जहां एक व्यक्ति बड़े नुकसान के खिलाफ सुरक्षा के बदले में एक छोटा प्रीमियम चुकाता है।",
    card_2_title: "स्वास्थ्य कवर",
    card_2_desc: "अस्पताल में भर्ती होने, संचालन और निदान के लिए सीधे भुगतान करके चिकित्सा आपात स्थितियों से बचाता है।",
    card_3_title: "जीवन बीमा",
    card_3_desc: "आपकी अनुपस्थिति में आपके परिवार के भविष्य को आर्थिक रूप से सुरक्षित करता है, मृत्यु लाभ या बचत प्रदान करता है।",
    card_4_title: "मोटर और सामान्य",
    card_4_desc: "दुर्घटनाओं, आग, प्राकृतिक आपदाओं या देनदारियों से आपकी भौतिक संपत्तियों (कारों, घरों) की रक्षा करता है।",

    // SIP
    sip_title: "सिस्टमैटिक इन्वेस्टमेंट प्लान (SIP) कैलकुलेटर",
    sip_desc: "गणना करें कि चक्रवृद्धि ब्याज के साथ समय के साथ म्यूचुअल फंड में छोटे मासिक योगदान कैसे बढ़ते हैं।",
    sip_monthly: "मासिक निवेश",
    sip_rate: "अपेक्षित रिटर्न दर (वार्षिक)",
    sip_period: "समय अवधि",
    sip_summary: "अनुमान सारांश",
    sip_invested: "निवेशित राशि",
    sip_est_returns: "अनुमानित चक्रवृद्धि रिटर्न",
    sip_total_value: "कुल संचित मूल्य",
    sip_cta: "परामर्श का समय निर्धारित करें",

    // Reviews
    reviews_title: "विश्वसनीय सीख और परामर्श",
    reviews_subtitle: "एसके स्मार्ट इन्वेस्टमेंट्स के साथ अपने अनुभव के बारे में हमारे प्रशिक्षुओं और ग्राहकों की समीक्षाएं पढ़ें।",

    // Footer
    footer_desc: "भरोसे और रणनीतिक योजना पर निर्मित विशेषज्ञ बीमा और निवेश समाधान प्रदान करना।",
    footer_rights: "© 2026 एसके स्मार्ट इन्वेस्टमेंट्स।",
    footer_insurance: "बीमा",
    footer_company: "कंपनी",
    footer_contact: "संपर्क करें",
    footer_hq: "मुख्यालय निर्देशांक",
    footer_hours: "कार्यालय के कामकाज के घंटे",
    footer_email: "ईमेल संचार",
    footer_privacy: "गोपनीयता नीति",
    footer_terms: "सेवा की शर्तें",
    footer_sitemap: "साइट मैप",

    // About Page
    about_firm: "हमारी फर्म के बारे में",
    about_hero_title: "संपत्ति की सुरक्षा, भविष्य का सशक्तिकरण",
    about_hero_subtitle: "एसके स्मार्ट इन्वेस्टमेंट्स एक विश्वसनीय वित्तीय सेवा फर्म है जो व्यक्तियों को स्मार्ट और वस्तुनिष्ठ योजना के माध्यम से उनके दीर्घकालिक वित्तीय लक्ष्यों को प्राप्त करने में मदद करती है।",
    about_founders_title: "हमारे संस्थापक और कहानी",
    about_founder_story_1: "एसके स्मार्ट इन्वेस्टमेंट्स एक विश्वसनीय वित्तीय सेवा है जो स्मार्ट निवेश के माध्यम से वित्तीय लक्ष्यों को प्राप्त करने में मदद कर रही है। प्रमाणित वित्तीय योजनाकार और वितरक प्रकाश और कुमुथा द्वारा स्थापित, कंपनी बीमा, म्यूचुअल फंड निवेश, सेवानिवृत्ति योजना, टैक्स सेविंग समाधान और स्वास्थ्य बीमा योजना सहित कई सेवाएं प्रदान करती है।",
    about_founder_story_2: "लक्ष्य-आधारित वित्तीय नियोजन पर ध्यान देने के साथ, एसके स्मार्ट इन्वेस्टमेंट्स का लक्ष्य अपने ग्राहकों के लिए धन सृजन के अवसर प्रदान करना है। कंपनी फेसबुक और इंस्टाग्राम पर अपनी ऑडियंस के साथ सक्रिय रूप से जुड़ी हुई है, जहां वह निवेश रणनीतियों, कर नियोजन और वित्तीय साक्षरता पर बहुमूल्य जानकारी साझा करती है।",
    about_founder_story_3: "बीमा, म्यूचुअल फंड और वित्तीय नियोजन में कंपनी की विशेषज्ञता ने इसे समुदाय में एक मजबूत प्रतिष्ठा बनाने में सक्षम बनाया है। कांचीपुरम में अपने मुख्यालय के साथ, कंपनी व्यक्तिगत सेवाएं प्रदान करने के लिए प्रतिबद्ध है।",
    milestones_recognition: "मील के पत्थर और मान्यता",
    award_winning_service: "पुरस्कार विजेता सेवा",
    awards_desc: "वित्तीय संस्थानों और समुदायों द्वारा सम्मानित। ज़ूम करने के लिए किसी भी प्रमाणपत्र पर क्लिक करें।",

    // Plans Page
    tailored_offerings: "अनुकूलित पेशकश",
    plans_title: "कॉर्पोरेट और व्यक्तिगत बीमा पैकेज",
    plans_subtitle: "मानक और व्यापक योजनाओं के हमारे प्रीमियम कैटलॉग को ब्राउज़ करें। पॉलिसियों को फ़िल्टर करें और तुरंत अपना डिजिटल आवेदन शुरू करें।",
    standard_coverage_value: "मानक कवरेज मूल्य",
    starting_premium: "शुरुआती प्रीमियम",
    included_features: "शामिल विशेषताएं",
    apply_now: "अभी आवेदन करें",

    // Calculator Page
    calc_badge: "प्रीमियम अनुमानक",
    calc_title: "इंटरएक्टिव प्रीमियम कैलकुलेटर",
    calc_subtitle: "चयनित कवरेज स्तरों और चर के आधार पर वास्तविक समय में कस्टम बीमा उद्धरणों की गणना करें।",
    calculate_monthly_estimate: "मासिक अनुमान की गणना करें",
    annual_income: "वार्षिक पारिवारिक आय",
    health_medical_history: "चिकित्सा इतिहास की स्थिति",
    coverage_amount: "लक्षित कवरेज राशि",
    estimated_monthly_premium: "अनुमानित मासिक प्रीमियम",

    // Support Page
    support_badge: "ग्राहक सेवा",
    support_title: "आज हम आपकी क्या सहायता कर सकते हैं?",
    support_subtitle: "हमारे अक्सर पूछे जाने वाले प्रश्नों को ब्राउज़ करें, सहायता टिकट दर्ज करें, या सीधे हमारे एजेंटों से जुड़ें।",
    corp_office: "एसके स्मार्ट कॉर्पोरेट कार्यालय",
    hq_coordinates: "मुख्यालय निर्देशांक",
    office_hours: "कार्यालय संचालन के घंटे",
    email_comms: "ईमेल संचार",
    submit_ticket: "सहायता टिकट जमा करें",
    ticket_success: "टिकट सफलतापूर्वक दर्ज किया गया!",
    faq_title: "अक्सर पूछे जाने वाले प्रश्न",

    // Auth Page
    auth_title: "संचालन प्रबंधन पोर्टल",
    auth_subtitle: "अपने प्रशासनिक पैनल, ग्राहक पोर्टफोलियो और बीमा लॉग तक पहुंचने के लिए लॉगिन करें।",
    sign_in: "साइन इन करें",
    signing_in: "साइन इन हो रहा है...",
    invalid_credentials: "अमान्य क्रेडेंशियल। कृपया पुनः प्रयास करें।"
  }
};

export const LanguageProvider = ({ children }) => {
  const [locale, setLocale] = useState(() => localStorage.getItem('current_lang') || 'en');

  useEffect(() => {
    localStorage.setItem('current_lang', locale);
  }, [locale]);

  const t = (key) => {
    return translations[locale]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => useContext(LanguageContext);
