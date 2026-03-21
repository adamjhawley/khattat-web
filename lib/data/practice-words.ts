export interface WordLetter {
  letterId: string;
  isolated: string;
  displayChar: string;
  form: "isolated" | "initial" | "medial" | "final";
}

export interface PracticeWord {
  id: string;
  arabic: string;
  meaning: string;
  transliteration: string;
  letters: WordLetter[];
}

export const practiceWords: PracticeWord[] = [
  {
    id: "kataba",
    arabic: "كتب",
    meaning: "he wrote",
    transliteration: "kataba",
    letters: [
      { letterId: "kaf", isolated: "ك", displayChar: "كـ", form: "initial" },
      { letterId: "ta", isolated: "ت", displayChar: "ـتـ", form: "medial" },
      { letterId: "ba", isolated: "ب", displayChar: "ـب", form: "final" },
    ],
  },
  {
    id: "bayt",
    arabic: "بيت",
    meaning: "house",
    transliteration: "bayt",
    letters: [
      { letterId: "ba", isolated: "ب", displayChar: "بـ", form: "initial" },
      { letterId: "ya", isolated: "ي", displayChar: "ـيـ", form: "medial" },
      { letterId: "ta", isolated: "ت", displayChar: "ـت", form: "final" },
    ],
  },
  {
    id: "qalam",
    arabic: "قلم",
    meaning: "pen",
    transliteration: "qalam",
    letters: [
      { letterId: "qaf", isolated: "ق", displayChar: "قـ", form: "initial" },
      { letterId: "lam", isolated: "ل", displayChar: "ـلـ", form: "medial" },
      { letterId: "mim", isolated: "م", displayChar: "ـم", form: "final" },
    ],
  },
  {
    id: "shams",
    arabic: "شمس",
    meaning: "sun",
    transliteration: "shams",
    letters: [
      { letterId: "shin", isolated: "ش", displayChar: "شـ", form: "initial" },
      { letterId: "mim", isolated: "م", displayChar: "ـمـ", form: "medial" },
      { letterId: "sin", isolated: "س", displayChar: "ـس", form: "final" },
    ],
  },
  {
    id: "kalb",
    arabic: "كلب",
    meaning: "dog",
    transliteration: "kalb",
    letters: [
      { letterId: "kaf", isolated: "ك", displayChar: "كـ", form: "initial" },
      { letterId: "lam", isolated: "ل", displayChar: "ـلـ", form: "medial" },
      { letterId: "ba", isolated: "ب", displayChar: "ـب", form: "final" },
    ],
  },
  {
    id: "ilm",
    arabic: "علم",
    meaning: "knowledge",
    transliteration: "'ilm",
    letters: [
      { letterId: "ayn", isolated: "ع", displayChar: "عـ", form: "initial" },
      { letterId: "lam", isolated: "ل", displayChar: "ـلـ", form: "medial" },
      { letterId: "mim", isolated: "م", displayChar: "ـم", form: "final" },
    ],
  },
  {
    id: "fatah",
    arabic: "فتح",
    meaning: "he opened",
    transliteration: "fatah",
    letters: [
      { letterId: "fa", isolated: "ف", displayChar: "فـ", form: "initial" },
      { letterId: "ta", isolated: "ت", displayChar: "ـتـ", form: "medial" },
      { letterId: "ha", isolated: "ح", displayChar: "ـح", form: "final" },
    ],
  },
  {
    id: "jamal",
    arabic: "جمل",
    meaning: "camel",
    transliteration: "jamal",
    letters: [
      { letterId: "jim", isolated: "ج", displayChar: "جـ", form: "initial" },
      { letterId: "mim", isolated: "م", displayChar: "ـمـ", form: "medial" },
      { letterId: "lam", isolated: "ل", displayChar: "ـل", form: "final" },
    ],
  },
  {
    id: "nasr",
    arabic: "نصر",
    meaning: "victory",
    transliteration: "nasr",
    letters: [
      { letterId: "nun", isolated: "ن", displayChar: "نـ", form: "initial" },
      { letterId: "sad", isolated: "ص", displayChar: "ـصـ", form: "medial" },
      { letterId: "ra", isolated: "ر", displayChar: "ـر", form: "final" },
    ],
  },
  {
    id: "bahr",
    arabic: "بحر",
    meaning: "sea",
    transliteration: "bahr",
    letters: [
      { letterId: "ba", isolated: "ب", displayChar: "بـ", form: "initial" },
      { letterId: "ha", isolated: "ح", displayChar: "ـحـ", form: "medial" },
      { letterId: "ra", isolated: "ر", displayChar: "ـر", form: "final" },
    ],
  },
  {
    id: "hubb",
    arabic: "حب",
    meaning: "love",
    transliteration: "hubb",
    letters: [
      { letterId: "ha", isolated: "ح", displayChar: "حـ", form: "initial" },
      { letterId: "ba", isolated: "ب", displayChar: "ـب", form: "final" },
    ],
  },
  {
    id: "qamar",
    arabic: "قمر",
    meaning: "moon",
    transliteration: "qamar",
    letters: [
      { letterId: "qaf", isolated: "ق", displayChar: "قـ", form: "initial" },
      { letterId: "mim", isolated: "م", displayChar: "ـمـ", form: "medial" },
      { letterId: "ra", isolated: "ر", displayChar: "ـر", form: "final" },
    ],
  },
  {
    id: "najm",
    arabic: "نجم",
    meaning: "star",
    transliteration: "najm",
    letters: [
      { letterId: "nun", isolated: "ن", displayChar: "نـ", form: "initial" },
      { letterId: "jim", isolated: "ج", displayChar: "ـجـ", form: "medial" },
      { letterId: "mim", isolated: "م", displayChar: "ـم", form: "final" },
    ],
  },
  {
    id: "tabkh",
    arabic: "طبخ",
    meaning: "cooking",
    transliteration: "tabkh",
    letters: [
      { letterId: "taa", isolated: "ط", displayChar: "طـ", form: "initial" },
      { letterId: "ba", isolated: "ب", displayChar: "ـبـ", form: "medial" },
      { letterId: "kha", isolated: "خ", displayChar: "ـخ", form: "final" },
    ],
  },
  {
    id: "ghanam",
    arabic: "غنم",
    meaning: "sheep",
    transliteration: "ghanam",
    letters: [
      { letterId: "ghayn", isolated: "غ", displayChar: "غـ", form: "initial" },
      { letterId: "nun", isolated: "ن", displayChar: "ـنـ", form: "medial" },
      { letterId: "mim", isolated: "م", displayChar: "ـم", form: "final" },
    ],
  },
  {
    id: "thalj",
    arabic: "ثلج",
    meaning: "snow",
    transliteration: "thalj",
    letters: [
      { letterId: "tha", isolated: "ث", displayChar: "ثـ", form: "initial" },
      { letterId: "lam", isolated: "ل", displayChar: "ـلـ", form: "medial" },
      { letterId: "jim", isolated: "ج", displayChar: "ـج", form: "final" },
    ],
  },
  {
    id: "sabr",
    arabic: "صبر",
    meaning: "patience",
    transliteration: "sabr",
    letters: [
      { letterId: "sad", isolated: "ص", displayChar: "صـ", form: "initial" },
      { letterId: "ba", isolated: "ب", displayChar: "ـبـ", form: "medial" },
      { letterId: "ra", isolated: "ر", displayChar: "ـر", form: "final" },
    ],
  },
  {
    id: "fikr",
    arabic: "فكر",
    meaning: "thought",
    transliteration: "fikr",
    letters: [
      { letterId: "fa", isolated: "ف", displayChar: "فـ", form: "initial" },
      { letterId: "kaf", isolated: "ك", displayChar: "ـكـ", form: "medial" },
      { letterId: "ra", isolated: "ر", displayChar: "ـر", form: "final" },
    ],
  },
  {
    id: "nahl",
    arabic: "نحل",
    meaning: "bees",
    transliteration: "nahl",
    letters: [
      { letterId: "nun", isolated: "ن", displayChar: "نـ", form: "initial" },
      { letterId: "ha", isolated: "ح", displayChar: "ـحـ", form: "medial" },
      { letterId: "lam", isolated: "ل", displayChar: "ـل", form: "final" },
    ],
  },
  {
    id: "malak",
    arabic: "ملك",
    meaning: "king",
    transliteration: "malik",
    letters: [
      { letterId: "mim", isolated: "م", displayChar: "مـ", form: "initial" },
      { letterId: "lam", isolated: "ل", displayChar: "ـلـ", form: "medial" },
      { letterId: "kaf", isolated: "ك", displayChar: "ـك", form: "final" },
    ],
  },
  {
    id: "ghalb",
    arabic: "قلب",
    meaning: "heart",
    transliteration: "qalb",
    letters: [
      { letterId: "qaf", isolated: "ق", displayChar: "قـ", form: "initial" },
      { letterId: "lam", isolated: "ل", displayChar: "ـلـ", form: "medial" },
      { letterId: "ba", isolated: "ب", displayChar: "ـب", form: "final" },
    ],
  },
  {
    id: "shahr",
    arabic: "شهر",
    meaning: "month",
    transliteration: "shahr",
    letters: [
      { letterId: "shin", isolated: "ش", displayChar: "شـ", form: "initial" },
      { letterId: "haa", isolated: "ه", displayChar: "ـهـ", form: "medial" },
      { letterId: "ra", isolated: "ر", displayChar: "ـر", form: "final" },
    ],
  },
  {
    id: "layl",
    arabic: "ليل",
    meaning: "night",
    transliteration: "layl",
    letters: [
      { letterId: "lam", isolated: "ل", displayChar: "لـ", form: "initial" },
      { letterId: "ya", isolated: "ي", displayChar: "ـيـ", form: "medial" },
      { letterId: "lam", isolated: "ل", displayChar: "ـل", form: "final" },
    ],
  },
  {
    id: "kitab",
    arabic: "كتاب",
    meaning: "book",
    transliteration: "kitab",
    letters: [
      { letterId: "kaf", isolated: "ك", displayChar: "كـ", form: "initial" },
      { letterId: "ta", isolated: "ت", displayChar: "ـتـ", form: "medial" },
      { letterId: "ba", isolated: "ب", displayChar: "ـب", form: "final" },
    ],
  },
  {
    id: "thaqb",
    arabic: "ثقب",
    meaning: "hole",
    transliteration: "thuqb",
    letters: [
      { letterId: "tha", isolated: "ث", displayChar: "ثـ", form: "initial" },
      { letterId: "qaf", isolated: "ق", displayChar: "ـقـ", form: "medial" },
      { letterId: "ba", isolated: "ب", displayChar: "ـب", form: "final" },
    ],
  },
];
