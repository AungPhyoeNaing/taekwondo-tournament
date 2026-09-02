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
  saveSetting: string;
  settingSaved: string;
  typeAgeDivision: string;
  weightRangeSlider: string;
  anyWeight: string;
  weightPresets: string;
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

  // Bracket & Pairing System
  bracketNav: string;
  rosterNav: string;
  bracketTitle: string;
  bracketSubtitle: string;
  singleEliminationWithByes: string;
  selectDivision: string;
  allAthletes: string;
  selectedAthletesCount: (count: number, byes: number) => string;
  drawMode: string;
  drawRandom: string;
  drawSeeded: string;
  drawClubSeparated: string;
  drawWeightMatched: string;
  drawCustom: string;
  customPairingBtn: string;
  customPairingTitle: string;
  customPairingSubtitle: string;
  addBout: string;
  removeBout: string;
  boutLabel: (num: number) => string;
  redFighter: string;
  blueFighter: string;
  swapCorners: string;
  autoPairWeight: string;
  autoPairBelt: string;
  clearBouts: string;
  applyCustomPairing: string;
  selectFighter: string;
  byeOption: string;
  weightGap: string;
  divisionTitleLabel: string;
  generateDraw: string;
  reShuffle: string;
  resetBracket: string;
  printBracket: string;
  bye: string;
  byeAdvanced: string;
  hongCorner: string;
  chongCorner: string;
  selectWinner: string;
  winner: string;
  champion: string;
  runnerUp: string;
  bronze: string;
  notEnoughAthletes: string;
  bracketGeneratedToast: string;
  autoAdvanceNotice: string;
  enterMatchScore: string;
  openBracketBtn: string;

  // Results Page
  resultsNav: string;
  resultsTitle: string;
  resultsSubtitle: string;
  exportResultsCsv: string;
  printResults: string;
  matchStatus: string;
  scheduled: string;
  completed: string;
  noResultsYet: string;
  noResultsDesc: string;
  backToBracket: string;
  viewResultsBtn: string;
  bout: string;
  divisionFilter: string;
  pairingType: string;
  regularMatch: string;
  byeMatch: string;
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
    saveSetting: 'Save Setting',
    settingSaved: 'Saved!',
    typeAgeDivision: 'Type Age Division (e.g. Cadet, 12-14, 18+)...',
    weightRangeSlider: 'Weight Range Slider (Kg)',
    anyWeight: 'Any Weight',
    weightPresets: 'Weight Presets',
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
    sqlInstructions: 'SQL Database Instructions',

    // Bracket & Pairing System
    bracketNav: 'Bracket & Pairing',
    rosterNav: 'Athletes Roster',
    bracketTitle: 'Tournament Pairing & Single Elimination Bracket',
    bracketSubtitle: 'World Taekwondo elimination tree with automatic Bye calculations, interactive winner selection, and podium generation.',
    singleEliminationWithByes: 'Single Elimination with Byes',
    selectDivision: 'Select Division / Category',
    allAthletes: 'All Eligible Athletes',
    selectedAthletesCount: (count, byes) => `${count} competitors selected • ${byes} ${byes === 1 ? 'Bye' : 'Byes'} assigned to balance bracket`,
    drawMode: 'Draw & Seeding Method',
    drawRandom: 'Random Draw (Lottery)',
    drawSeeded: 'Seeded Draw (Belt / Dan)',
    drawClubSeparated: 'Club Protection (Avoid Teammates)',
    drawWeightMatched: 'Fair Weight Match (Closest Weights)',
    drawCustom: 'Custom Pairing (Hand-Picked)',
    customPairingBtn: 'Custom Pairing',
    customPairingTitle: 'Custom Match & Bracket Pairing',
    customPairingSubtitle: 'Hand-pick athlete bouts across any weight, belt rank, or age category.',
    addBout: '+ Add Bout',
    removeBout: 'Remove',
    boutLabel: (num) => `Bout #${num}`,
    redFighter: 'HONG (Red Corner)',
    blueFighter: 'CHONG (Blue Corner)',
    swapCorners: 'Swap Red & Blue',
    autoPairWeight: 'Auto-Pair by Closest Weight',
    autoPairBelt: 'Auto-Pair by Belt Rank',
    clearBouts: 'Clear All Bouts',
    applyCustomPairing: 'Apply Custom Pairing to Bracket',
    selectFighter: 'Select an athlete...',
    byeOption: '— Assign BYE (Auto-Advance) —',
    weightGap: 'Weight Difference',
    divisionTitleLabel: 'Custom Division / Match Label',
    generateDraw: 'Generate Bracket',
    reShuffle: 'Shuffle Draw',
    resetBracket: 'Reset Matches',
    printBracket: 'Print Draw Sheet',
    bye: 'BYE',
    byeAdvanced: 'Advanced on BYE (Auto-Pass)',
    hongCorner: 'HONG (Red)',
    chongCorner: 'CHONG (Blue)',
    selectWinner: 'Pick Winner',
    winner: 'WINNER',
    champion: 'Tournament Champion',
    runnerUp: 'Silver Medalist (2nd)',
    bronze: 'Bronze Medalists (Joint 3rd)',
    notEnoughAthletes: 'At least 2 competitors are required to generate a tournament bracket.',
    bracketGeneratedToast: 'Tournament bracket generated successfully!',
    autoAdvanceNotice: 'Fighters with a BYE automatically advance directly to Round 2.',
    enterMatchScore: 'Match score (optional)',
    openBracketBtn: 'Bracket / Draw',

    // Results Page (Initial Pairing Table)
    resultsNav: 'Initial Pairing Table',
    resultsTitle: 'Initial Pairing Table (Round 1 Draw)',
    resultsSubtitle: 'Official Round 1 draw sheet showing initial fighter pairings and Byes distribution.',
    exportResultsCsv: 'Export Initial Draw (CSV)',
    printResults: 'Print Initial Draw Sheet',
    matchStatus: 'Pairing Status',
    scheduled: 'Round 1 Bout',
    completed: 'Round 1 Bout',
    noResultsYet: 'No Initial Pairings Yet',
    noResultsDesc: 'Generate a tournament bracket in the Bracket & Pairing section first to view the initial pairings.',
    backToBracket: 'Go to Bracket Draw',
    viewResultsBtn: 'View Initial Pairing Table',
    bout: 'Bout',
    divisionFilter: 'Filter by Division',
    pairingType: 'Pairing Status',
    regularMatch: 'Round 1 Bout',
    byeMatch: 'BYE (Auto-Advance to R2)'
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
    saveSetting: 'ဆက်တင် သိမ်းဆည်းမည်',
    settingSaved: 'သိမ်းဆည်းပြီး!',
    typeAgeDivision: 'အသက်အရွယ် အတန်းအစား ရိုက်ထည့်ပါ (ဥပမာ - Cadet, 12-14, 18+)...',
    weightRangeSlider: 'ဝိတ် အတိုင်းအတာ စလိုက်ဒါ (ကီလို)',
    anyWeight: 'ဝိတ် အားလုံး',
    weightPresets: 'အမြန်ရွေးရန် ဝိတ်တန်းများ',
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
    sqlInstructions: 'SQL ဒေတာဘေ့စ် လမ်းညွှန်',

    // Bracket & Pairing System
    bracketNav: 'တွဲဆိုင်းနှင့် မဲခွဲစနစ်',
    rosterNav: 'ကစားသမားများ',
    bracketTitle: 'ပြိုင်ပွဲတွဲဆိုင်းနှင့် Single Elimination Bracket မဲခွဲစနစ်',
    bracketSubtitle: 'ကမ္ဘာ့တိုက်ကွမ်ဒို စံနှုန်းအတိုင်း Bye အလိုအလျောက် တွက်ချက်ပေးပြီး အနိုင်ရသူ ရွေးချယ်နိုင်သော တိုက်ရိုက်တွဲဆိုင်းစနစ်။',
    singleEliminationWithByes: 'Single Elimination with Byes (Bye ဖြင့် ရှုံးထွက်စနစ်)',
    selectDivision: 'ပြိုင်ပွဲ ဝိတ်တန်း ရွေးချယ်ရန်',
    allAthletes: 'ကစားသမား အားလုံး',
    selectedAthletesCount: (count, byes) => `ကစားသမား ${count} ဦး ရွေးချယ်ထားသည် • တွဲဆိုင်းမျှတစေရန် Bye ${byes} ဦး သတ်မှတ်ထားသည်`,
    drawMode: 'မဲနှိုက် / မျိုးစေ့ချ စနစ်',
    drawRandom: 'ကျပန်း မဲနှိုက်စနစ် (Lottery Draw)',
    drawSeeded: 'ခါးပတ်အဆင့်လိုက် မျိုးစေ့ချခြင်း (Seeded Draw)',
    drawClubSeparated: 'ကလပ်အချင်းချင်း မတိုက်စေရန် ခွဲထုတ်ခြင်း (Club Protection)',
    drawWeightMatched: 'ဝိတ်အနီးစပ်ဆုံး ယှဉ်ပြိုင်မှု (Fair Weight Match)',
    drawCustom: 'စိတ်ကြိုက်တွဲဆိုင်း သတ်မှတ်ခြင်း (Custom Pairing)',
    customPairingBtn: 'စိတ်ကြိုက်တွဲဆိုင်း',
    customPairingTitle: 'စိတ်ကြိုက် ပွဲစဉ်နှင့် တွဲဆိုင်း သတ်မှတ်ရန်',
    customPairingSubtitle: 'မည်သည့် ဝိတ်တန်း၊ ခါးပတ်နှင့် အသက်အရွယ်မဆို မိမိစိတ်ကြိုက် ရွေးချယ်တွဲပေးနိုင်ပါသည်။',
    addBout: '+ တွဲဆိုင်းထည့်မည်',
    removeBout: 'ပယ်ဖျက်မည်',
    boutLabel: (num) => `တွဲဆိုင်း #${num}`,
    redFighter: 'ဟုန်း (အနီထောင့်)',
    blueFighter: 'ချုန်း (အပြာထောင့်)',
    swapCorners: 'ထောင့်ပြောင်းမည်',
    autoPairWeight: 'ဝိတ်အနီးစပ်ဆုံး အလိုအလျောက်တွဲမည်',
    autoPairBelt: 'ခါးပတ်တူ အလိုအလျောက်တွဲမည်',
    clearBouts: 'တွဲဆိုင်းအားလုံး ရှင်းမည်',
    applyCustomPairing: 'တွဲဆိုင်းများ အတည်ပြု ထုတ်ပေးမည်',
    selectFighter: 'ကစားသမား ရွေးချယ်ပါ...',
    byeOption: '— Bye သတ်မှတ်မည် (တိုက်ရိုက်တက်) —',
    weightGap: 'ဝိတ်ကွာခြားချက်',
    divisionTitleLabel: 'စိတ်ကြိုက် ဝိတ်တန်း / ပွဲစဉ်အမည်',
    generateDraw: 'တွဲဆိုင်း မဲခွဲထုတ်မည်',
    reShuffle: 'မဲပြန်နှိုက်မည်',
    resetBracket: 'ပွဲစဉ်များ ပြန်စမည်',
    printBracket: 'တွဲဆိုင်း ပရင့်ထုတ်မည်',
    bye: 'BYE (ဘိုင်)',
    byeAdvanced: 'Bye ဖြင့် အလိုအလျောက် တက်ရောက်ပြီး',
    hongCorner: 'ဟုန်း (အနီထောင့်)',
    chongCorner: 'ချုန်း (အပြာထောင့်)',
    selectWinner: 'အနိုင်ရသူ ရွေးမည်',
    winner: 'အနိုင်ရရှိသူ',
    champion: 'ပြိုင်ပွဲ ရွှေတံဆိပ်ဆုရှင် (Champion)',
    runnerUp: 'ဒုတိယဆု (ငွေတံဆိပ်)',
    bronze: 'ပူးတွဲ တတိယဆု (ကြေးတံဆိပ်)',
    notEnoughAthletes: 'တွဲဆိုင်း မဲခွဲရန် အနည်းဆုံး ကစားသမား ၂ ဦး လိုအပ်ပါသည်။',
    bracketGeneratedToast: 'ပြိုင်ပွဲတွဲဆိုင်း အောင်မြင်စွာ ဖန်တီးပြီးပါပြီ!',
    autoAdvanceNotice: 'Bye ရရှိသော ကစားသမားများသည် ဒုတိယအဆင့်သို့ အလိုအလျောက် တိုက်ရိုက် တက်ရောက်ပါသည်။',
    enterMatchScore: 'ရမှတ် (ရွေးချယ်ရန်)',
    openBracketBtn: 'တွဲဆိုင်းခွဲမည်',

    // Results Page (Initial Pairing Table)
    resultsNav: 'ပထမအဆင့် တွဲဆိုင်းဇယား',
    resultsTitle: 'ပထမအဆင့် တွဲဆိုင်းဇယား (Initial Pairing Table)',
    resultsSubtitle: 'ကမ္ဘာ့တိုက်ကွမ်ဒို စည်းမျဉ်းအရ ပထမအဆင့် တွဲဆိုင်းများနှင့် Byes ခွဲဝေမှု ဇယား။',
    exportResultsCsv: 'ပထမအဆင့် တွဲဆိုင်း ထုတ်ယူမည် (CSV)',
    printResults: 'ပထမအဆင့် တွဲဆိုင်း ပရင့်ထုတ်မည်',
    matchStatus: 'တွဲဆိုင်း အခြေအနေ',
    scheduled: 'ပထမအဆင့် ယှဉ်ပြိုင်ရမည့်ပွဲ',
    completed: 'ပထမအဆင့် ယှဉ်ပြိုင်ရမည့်ပွဲ',
    noResultsYet: 'ပထမအဆင့် တွဲဆိုင်း မရှိသေးပါ',
    noResultsDesc: 'တွဲဆိုင်းနှင့် မဲခွဲစနစ်တွင် တွဲဆိုင်း အရင် ဖန်တီးပေးပါ။',
    backToBracket: 'တွဲဆိုင်းသို့ သွားမည်',
    viewResultsBtn: 'ပထမအဆင့် တွဲဆိုင်းဇယား ကြည့်မည်',
    bout: 'ပွဲစဉ်',
    divisionFilter: 'ဝိတ်တန်းအလိုက် စစ်ထုတ်ရန်',
    pairingType: 'တွဲဆိုင်း အခြေအနေ',
    regularMatch: 'ပထမအဆင့် ယှဉ်ပြိုင်ရမည့်ပွဲ',
    byeMatch: 'BYE (ဒုတိယအဆင့်သို့ တိုက်ရိုက်တက်)'
  }
};
