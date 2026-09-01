export type Language = 'en' | 'my';

export interface Translations {
  brand: string;
  brandSub: string;
  wtOfficial: string;
  fightersListed: string;
  supabaseLive: string;
  supabaseSetup: string;
  exportCsv: string;
  registerAthlete: string;
  refreshDb: string;
  heroTag: string;
  heroTitle: string;
  heroDesc: string;
  registerCompetitorBtn: string;
  downloadWeighInBtn: string;
  
  // Stats
  totalAthletes: string;
  activeTeams: string;
  danPoomRanks: string;
  eliteBlackBelts: string;
  averageWeight: string;
  loadSampleRoster: string;
  weighInActive: string;
  
  // Search & Filter
  searchPlaceholder: string;
  filters: string;
  belts: string;
  allBelts: string;
  gender: string;
  allGenders: string;
  male: string;
  female: string;
  ageDivision: string;
  allDivisions: string;
  child: string;
  cadet: string;
  junior: string;
  senior: string;
  ultra: string;
  representingClub: string;
  allClubs: string;
  weightRange: string;
  minKg: string;
  maxKg: string;
  sortBy: string;
  newestFirst: string;
  nameAZ: string;
  weight: string;
  ageDob: string;
  clubName: string;
  showingAthletes: (filtered: number, total: number) => string;
  activeFiltersCount: (count: number) => string;
  clearFilters: string;
  
  // Player Cards & Table
  age: string;
  years: string;
  dob: string;
  passId: string;
  edit: string;
  delete: string;
  athlete: string;
  wtDivision: string;
  actions: string;
  noAthletesFound: string;
  noAthletesDescEmpty: string;
  noAthletesDescFilter: string;
  registerFirstFighter: string;
  loadDemoRoster: string;
  
  // Modal: Register/Edit
  registerNewAthlete: string;
  editAthleteProfile: string;
  modalDesc: string;
  calculatedDivision: string;
  fullName: string;
  fullNamePlaceholder: string;
  dateOfBirth: string;
  weightInKg: string;
  beltColor: string;
  clubRepresenting: string;
  clubPlaceholder: string;
  contactPhone: string;
  phonePlaceholder: string;
  notesAccolades: string;
  notesPlaceholder: string;
  cancel: string;
  saving: string;
  updateAthlete: string;
  completeRegistration: string;
  
  // ID Card Modal
  officialCredential: string;
  worldTkdChampionship: string;
  officialCompetitor: string;
  credentialSub: string;
  printPass: string;
  officialWeight: string;
  genderAndAge: string;
  weighInVerified: string;
  eligibleDraw: string;
  athleteId: string;

  // Supabase Setup
  supabaseSetupNeeded: string;
  supabaseSetupNeededDesc: string;
  viewSetupBtn: string;
  setupModalTitle: string;
  step1: string;
  step1Desc: string;
  step2: string;
  step2Desc: string;
  copied: string;
  testConnection: string;
  checkingTable: string;
  useDemoLocally: string;
  
  // Footer
  footerText: string;
  sqlInstructions: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    brand: 'TKD Tournament',
    brandSub: 'Athlete Registry & Search Portal',
    wtOfficial: 'WT Official',
    fightersListed: 'fighters listed',
    supabaseLive: 'Supabase Live',
    supabaseSetup: 'Supabase Setup',
    exportCsv: 'Export CSV',
    registerAthlete: 'Register Athlete',
    refreshDb: 'Refresh database',
    heroTag: 'World Taekwondo Federation Rules',
    heroTitle: 'Athlete Database & Weigh-In Search',
    heroDesc: 'Real-time search and management portal for competitors. Filter by weight division, belt hierarchy, age brackets, and representing dojangs with instant tournament credential generation.',
    registerCompetitorBtn: 'Register New Competitor',
    downloadWeighInBtn: 'Download Weigh-In Sheet (CSV)',
    
    totalAthletes: 'Total Athletes',
    activeTeams: 'Dojangs / Clubs',
    danPoomRanks: 'Dan / Poom Ranks',
    eliteBlackBelts: 'Elite black belts',
    averageWeight: 'Average Weight',
    loadSampleRoster: 'Load Sample Roster',
    weighInActive: '● Weigh-in system active',
    
    searchPlaceholder: 'Search by player name, club, or belt...',
    filters: 'Filters',
    belts: 'Belts',
    allBelts: 'All Belts',
    gender: 'Gender',
    allGenders: 'All',
    male: 'Male',
    female: 'Female',
    ageDivision: 'Age Division',
    allDivisions: 'All Divisions',
    child: 'Child (< 12)',
    cadet: 'Cadet (12 - 14)',
    junior: 'Junior (15 - 17)',
    senior: 'Senior (18 - 35)',
    ultra: 'Ultra / Masters (35+)',
    representingClub: 'Representing Club',
    allClubs: 'All Clubs',
    weightRange: 'Weight Range (Kg)',
    minKg: 'Min kg',
    maxKg: 'Max kg',
    sortBy: 'Sort By',
    newestFirst: 'Newest First',
    nameAZ: 'Name (A-Z)',
    weight: 'Weight',
    ageDob: 'Age / DOB',
    clubName: 'Club Name',
    showingAthletes: (filtered, total) => `Showing ${filtered} of ${total} registered athletes`,
    activeFiltersCount: (count) => `(${count} active filters)`,
    clearFilters: 'Clear Filters',
    
    age: 'Age',
    years: 'yrs',
    dob: 'DOB',
    passId: 'Pass / ID',
    edit: 'Edit Athlete',
    delete: 'Delete Athlete',
    athlete: 'Athlete',
    wtDivision: 'WT Division',
    actions: 'Actions',
    noAthletesFound: 'No Athletes Found',
    noAthletesDescEmpty: 'No fighters have been registered yet. Add the first competitor or load the official demo roster.',
    noAthletesDescFilter: 'No players match your search criteria. Try adjusting your query, belt, weight, or gender filters.',
    registerFirstFighter: 'Register First Fighter',
    loadDemoRoster: 'Load Demo Roster',
    
    registerNewAthlete: 'Register New Athlete',
    editAthleteProfile: 'Edit Athlete Profile',
    modalDesc: 'Enter tournament participant weigh-in & registration details',
    calculatedDivision: 'Calculated Division',
    fullName: 'Athlete Full Name',
    fullNamePlaceholder: 'e.g. Aung Thu, John Doe',
    dateOfBirth: 'Date of Birth',
    weightInKg: 'Weight (in Kg)',
    beltColor: 'Belt Color',
    clubRepresenting: 'Name of Club / Dojang Representing',
    clubPlaceholder: 'e.g. Yangon Tigers TKD, Tiger Martial Arts',
    contactPhone: 'Contact Phone (Optional)',
    phonePlaceholder: '+95 9...',
    notesAccolades: 'Notes / Rank Details (Optional)',
    notesPlaceholder: 'e.g. 1st Dan, 2024 Gold Medalist',
    cancel: 'Cancel',
    saving: 'Saving...',
    updateAthlete: 'Update Athlete',
    completeRegistration: 'Complete Registration',
    
    officialCredential: 'Official Athlete Credential',
    worldTkdChampionship: 'World Taekwondo Championship',
    officialCompetitor: 'Official Competitor',
    credentialSub: '2026 Tournament Weigh-in Credential',
    printPass: 'Print Pass',
    officialWeight: 'Official Weight',
    genderAndAge: 'Gender & Age',
    weighInVerified: 'Weigh-In Verified',
    eligibleDraw: 'Eligible for Official Draw & Brackets',
    athleteId: 'ATHLETE ID',

    supabaseSetupNeeded: 'Supabase Setup Needed:',
    supabaseSetupNeededDesc: 'Connected to your project, but the players table needs 1-click creation.',
    viewSetupBtn: 'View 10s SQL Setup',
    setupModalTitle: 'Supabase Database Setup',
    step1: 'Step 1: Open Supabase SQL Editor',
    step1Desc: 'Click to open your dashboard',
    step2: 'Step 2: Copy Migration SQL',
    step2Desc: 'Paste & click "Run" in SQL Editor',
    copied: 'SQL Copied to Clipboard!',
    testConnection: 'Test Supabase Connection',
    checkingTable: 'Checking Table...',
    useDemoLocally: 'Use Demo Athletes Locally',
    
    footerText: 'Taekwondo Tournament Athlete Registry & Weigh-In Database • Hosted on Vercel',
    sqlInstructions: 'SQL Database Instructions'
  },
  my: {
    brand: 'တိုက်ကွမ်ဒို ပြိုင်ပွဲ',
    brandSub: 'ကစားသမား မှတ်ပုံတင်နှင့် ရှာဖွေရေးစနစ်',
    wtOfficial: 'WT တရားဝင်',
    fightersListed: 'ဦး စာရင်းဝင်ထားသည်',
    supabaseLive: 'ဒေတာဘေ့စ် ချိတ်ဆက်ပြီး',
    supabaseSetup: 'ဒေတာဘေ့စ် စနစ်ထည့်ရန်',
    exportCsv: 'CSV ထုတ်ယူရန်',
    registerAthlete: 'ကစားသမားသစ် သွင်းမည်',
    refreshDb: 'ဒေတာဘေ့စ် ပြန်လည်စစ်ဆေးမည်',
    heroTag: 'ကမ္ဘာ့တိုက်ကွမ်ဒိုအဖွဲ့ချုပ် စည်းမျဉ်းများ',
    heroTitle: 'ကစားသမား ဒေတာဘေ့စ်နှင့် ဝိတ်ချိန်စစ်ဆေးခြင်း',
    heroDesc: 'ပြိုင်ပွဲဝင်များအား တိုက်ရိုက်ရှာဖွေစီမံနိုင်သော စနစ်။ ဝိတ်တန်း၊ ခါးပတ်အဆင့်၊ အသက်အရွယ်နှင့် ကိုယ်စားပြုကလပ်များအလိုက် စစ်ထုတ်ရှာဖွေနိုင်ပြီး ပြိုင်ပွဲဝင်ကတ်ပြားများကို ချက်ချင်းထုတ်ယူနိုင်ပါသည်။',
    registerCompetitorBtn: 'ပြိုင်ပွဲဝင်အသစ် စာရင်းသွင်းမည်',
    downloadWeighInBtn: 'ဝိတ်ချိန်စာရင်း ထုတ်ယူမည် (CSV)',
    
    totalAthletes: 'စုစုပေါင်း ကစားသမား',
    activeTeams: 'ကိုယ်စားပြု ကလပ်/သင်တန်းကျောင်း',
    danPoomRanks: 'ဒန်း / ပူးမ် အဆင့်များ',
    eliteBlackBelts: 'ခါးပတ်နက် အဆင့်',
    averageWeight: 'ပျမ်းမျှ ကိုယ်အလေးချိန်',
    loadSampleRoster: 'နမူနာစာရင်း ထည့်သွင်းမည်',
    weighInActive: '● ဝိတ်ချိန်စနစ် အသင့်ရှိပါသည်',
    
    searchPlaceholder: 'ကစားသမားအမည်၊ ကလပ် သို့မဟုတ် ခါးပတ်ဖြင့် ရှာဖွေပါ...',
    filters: 'စစ်ထုတ်မှုများ',
    belts: 'ခါးပတ်များ',
    allBelts: 'ခါးပတ် အားလုံး',
    gender: 'ကျား / မ',
    allGenders: 'အားလုံး',
    male: 'ကျား',
    female: 'မ',
    ageDivision: 'အသက်အရွယ် အတန်းအစား',
    allDivisions: 'အတန်းအစား အားလုံး',
    child: 'ကလေးတန်း (< ၁၂ နှစ်)',
    cadet: 'ကာဒက်တန်း (၁၂ - ၁၄ နှစ်)',
    junior: 'လူငယ်တန်း (၁၅ - ၁၇ နှစ်)',
    senior: 'လူကြီးတန်း (၁၈ - ၃၅ နှစ်)',
    ultra: 'ဝါရင့်တန်း (၃၅ နှစ်အထက်)',
    representingClub: 'ကိုယ်စားပြု ကလပ်',
    allClubs: 'ကလပ် အားလုံး',
    weightRange: 'ဝိတ် အတိုင်းအတာ (ကီလို)',
    minKg: 'အနည်းဆုံး (ကီလို)',
    maxKg: 'အများဆုံး (ကီလို)',
    sortBy: 'စီစဉ်ရန်',
    newestFirst: 'နောက်ဆုံးသွင်းထားသော',
    nameAZ: 'အမည် (က မှ အ)',
    weight: 'ကိုယ်အလေးချိန်',
    ageDob: 'အသက် / မွေးသက္ကရာဇ်',
    clubName: 'ကလပ် အမည်',
    showingAthletes: (filtered, total) => `စုစုပေါင်း ကစားသမား ${total} ဦးတွင် ${filtered} ဦး ပြသနေသည်`,
    activeFiltersCount: (count) => `(${count} ခု စစ်ထုတ်ထားသည်)`,
    clearFilters: 'စစ်ထုတ်မှုများ အကုန်ဖျက်မည်',
    
    age: 'အသက်',
    years: 'နှစ်',
    dob: 'မွေးသက္ကရာဇ်',
    passId: 'ကတ်ပြား / ID',
    edit: 'ပြင်ဆင်မည်',
    delete: 'စာရင်းမှ ပယ်ဖျက်မည်',
    athlete: 'ကစားသမား',
    wtDivision: 'WT ဝိတ်တန်း',
    actions: 'လုပ်ဆောင်ချက်',
    noAthletesFound: 'ကစားသမား ရှာမတွေ့ပါ',
    noAthletesDescEmpty: 'မည်သည့် ကစားသမားမှ စာရင်းမသွင်းရသေးပါ။ ပထမဆုံး ကစားသမားကို စာရင်းသွင်းပါ သို့မဟုတ် နမူနာစာရင်းကို ထည့်သွင်းပါ။',
    noAthletesDescFilter: 'ရှာဖွေမှုနှင့် ကိုက်ညီသော ကစားသမား မရှိပါ။ ရှာဖွေသည့် စာသား၊ ခါးပတ် သို့မဟုတ် ဝိတ်ကို ပြန်လည်စစ်ဆေးပါ။',
    registerFirstFighter: 'ပထမဆုံး ကစားသမား စာရင်းသွင်းမည်',
    loadDemoRoster: 'နမူနာ ကစားသမားများ ထည့်မည်',
    
    registerNewAthlete: 'ကစားသမားအသစ် စာရင်းသွင်းခြင်း',
    editAthleteProfile: 'ကစားသမား အချက်အလက် ပြင်ဆင်ခြင်း',
    modalDesc: 'ပြိုင်ပွဲဝင်၏ ဝိတ်ချိန်နှင့် ကိုယ်ရေးအချက်အလက်များကို ဖြည့်သွင်းပါ',
    calculatedDivision: 'တွက်ချက်ရရှိသော ဝိတ်တန်း',
    fullName: 'ကစားသမား အမည်အပြည့်အစုံ',
    fullNamePlaceholder: 'ဥပမာ - အောင်သူ၊ မင်းသန့်',
    dateOfBirth: 'မွေးသက္ကရာဇ်',
    weightInKg: 'ကိုယ်အလေးချိန် (ကီလိုဂရမ်)',
    beltColor: 'ခါးပတ် အရောင်',
    clubRepresenting: 'ကိုယ်စားပြု ကလပ် / သင်တန်းကျောင်း အမည်',
    clubPlaceholder: 'ဥပမာ - ရန်ကုန်တိုက်ဂါး၊ မန္တလေးဝါရီယာ',
    contactPhone: 'ဆက်သွယ်ရန် ဖုန်းနံပါတ် (ရွေးချယ်ရန်)',
    phonePlaceholder: '+95 9...',
    notesAccolades: 'မှတ်ချက် / ရရှိထားသော ဆုတံဆိပ် (ရွေးချယ်ရန်)',
    notesPlaceholder: 'ဥပမာ - ၁st ဒန်း၊ ၂၀၂၄ ရွှေတံဆိပ်ဆုရှင်',
    cancel: 'မလုပ်တော့ပါ',
    saving: 'သိမ်းဆည်းနေပါသည်...',
    updateAthlete: 'အချက်အလက် ပြင်ဆင်မည်',
    completeRegistration: 'စာရင်းသွင်းမှု အတည်ပြုမည်',
    
    officialCredential: 'တရားဝင် ပြိုင်ပွဲဝင် ကတ်ပြား',
    worldTkdChampionship: 'ကမ္ဘာ့တိုက်ကွမ်ဒို ပြိုင်ပွဲ',
    officialCompetitor: 'တရားဝင် ပြိုင်ပွဲဝင်',
    credentialSub: '၂၀၂၆ ခုနှစ် ပြိုင်ပွဲဝင် ဝိတ်ချိန်လက်မှတ်',
    printPass: 'ကတ်ပြား ပရင့်ထုတ်မည်',
    officialWeight: 'တရားဝင် ကိုယ်အလေးချိန်',
    genderAndAge: 'ကျား/မ နှင့် အသက်',
    weighInVerified: 'ဝိတ်ချိန် စစ်ဆေးအတည်ပြုပြီး',
    eligibleDraw: 'ပြိုင်ပွဲ မဲခွဲယှဉ်ပြိုင်ခွင့် ရရှိပါသည်',
    athleteId: 'ကစားသမား ID',

    supabaseSetupNeeded: 'ဒေတာဘေ့စ် စနစ်ထည့်ရန် လိုအပ်သည်:',
    supabaseSetupNeededDesc: 'Supabase နှင့် ချိတ်ဆက်မိသော်လည်း players ဇယားကို SQL ထည့်သွင်းရန် လိုအပ်ပါသည်။',
    viewSetupBtn: '၁၀ စက္ကန့် SQL စနစ်ထည့်မည်',
    setupModalTitle: 'Supabase ဒေတာဘေ့စ် စနစ်ထည့်သွင်းခြင်း',
    step1: 'အဆင့် ၁: Supabase SQL Editor ဖွင့်ပါ',
    step1Desc: 'သင်၏ Dashboard သို့ သွားရောက်ရန် နှိပ်ပါ',
    step2: 'အဆင့် ၂: Migration SQL ကို ကူးယူပါ',
    step2Desc: 'SQL Editor တွင် Paste လုပ်ပြီး "Run" ကို နှိပ်ပါ',
    copied: 'SQL ကို ကူးယူပြီးပါပြီ!',
    testConnection: 'ချိတ်ဆက်မှု ပြန်လည်စစ်ဆေးမည်',
    checkingTable: 'စစ်ဆေးနေပါသည်...',
    useDemoLocally: 'နမူနာ ကစားသမားများ ထည့်မည်',
    
    footerText: 'တိုက်ကွမ်ဒို ပြိုင်ပွဲ ကစားသမားမှတ်ပုံတင်နှင့် ဝိတ်ချိန်ဒေတာဘေ့စ် • Vercel တွင် လွှင့်တင်ထားသည်',
    sqlInstructions: 'SQL ဒေတာဘေ့စ် လမ်းညွှန်'
  }
};
