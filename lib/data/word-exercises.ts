import { ArabicLetter } from "@/lib/types/arabic";
import { arabicLetters } from "@/lib/data/arabic-letters";

export interface WordExercise {
  id: string;
  word: string;
  wordWithGap: string;
  meaning: string;
  transliteration: string;
  targetLetterId: string;
  missingIndex: number;
  correctForm: "initial" | "medial" | "final";
  correctChar: string;
}

const letterMap = new Map<string, ArabicLetter>();
for (const l of arabicLetters) {
  letterMap.set(l.id, l);
}

function buildExercise(
  id: string,
  word: string,
  wordWithGap: string,
  meaning: string,
  transliteration: string,
  targetLetterId: string,
  missingIndex: number,
  correctForm: "initial" | "medial" | "final",
): WordExercise {
  const letter = letterMap.get(targetLetterId)!;
  return {
    id,
    word,
    wordWithGap,
    meaning,
    transliteration,
    targetLetterId,
    missingIndex,
    correctForm,
    correctChar: letter[correctForm],
  };
}

export const wordExercises: WordExercise[] = [
  buildExercise("we1", "كَتَبَ", "___تَبَ", "he wrote", "kataba", "kaf", 0, "initial"),
  buildExercise("we2", "كَتَبَ", "كَ___بَ", "he wrote", "kataba", "ta", 1, "medial"),
  buildExercise("we3", "كَتَبَ", "كَتَ___", "he wrote", "kataba", "ba", 2, "final"),

  buildExercise("we4", "بَيْت", "___يْت", "house", "bayt", "ba", 0, "initial"),
  buildExercise("we5", "بَيْت", "بَ___ت", "house", "bayt", "ya", 1, "medial"),
  buildExercise("we6", "بَيْت", "بَيْ___", "house", "bayt", "ta", 2, "final"),

  buildExercise("we7", "قَلَم", "___لَم", "pen", "qalam", "qaf", 0, "initial"),
  buildExercise("we8", "قَلَم", "قَ___م", "pen", "qalam", "lam", 1, "medial"),
  buildExercise("we9", "قَلَم", "قَلَ___", "pen", "qalam", "mim", 2, "final"),

  buildExercise("we10", "شَمْس", "___مْس", "sun", "shams", "shin", 0, "initial"),
  buildExercise("we11", "شَمْس", "شَ___س", "sun", "shams", "mim", 1, "medial"),
  buildExercise("we12", "شَمْس", "شَمْ___", "sun", "shams", "sin", 2, "final"),

  buildExercise("we13", "نَجْم", "___جْم", "star", "najm", "nun", 0, "initial"),
  buildExercise("we14", "نَجْم", "نَ___م", "star", "najm", "jim", 1, "medial"),
  buildExercise("we15", "نَجْم", "نَجْ___", "star", "najm", "mim", 2, "final"),

  buildExercise("we16", "سَمَك", "___مَك", "fish", "samak", "sin", 0, "initial"),
  buildExercise("we17", "سَمَك", "سَ___ك", "fish", "samak", "mim", 1, "medial"),
  buildExercise("we18", "سَمَك", "سَمَ___", "fish", "samak", "kaf", 2, "final"),

  buildExercise("we19", "كَلْب", "___لْب", "dog", "kalb", "kaf", 0, "initial"),
  buildExercise("we20", "كَلْب", "كَ___ب", "dog", "kalb", "lam", 1, "medial"),
  buildExercise("we21", "كَلْب", "كَلْ___", "dog", "kalb", "ba", 2, "final"),

  buildExercise("we22", "فَتَح", "___تَح", "he opened", "fataha", "fa", 0, "initial"),
  buildExercise("we23", "فَتَح", "فَ___ح", "he opened", "fataha", "ta", 1, "medial"),
  buildExercise("we24", "فَتَح", "فَتَ___", "he opened", "fataha", "ha", 2, "final"),

  buildExercise("we25", "عَمَل", "___مَل", "work", "amal", "ayn", 0, "initial"),
  buildExercise("we26", "عَمَل", "عَ___ل", "work", "amal", "mim", 1, "medial"),
  buildExercise("we27", "عَمَل", "عَمَ___", "work", "amal", "lam", 2, "final"),

  buildExercise("we28", "ظَهَر", "___هَر", "he appeared", "dhahara", "dhaa", 0, "initial"),
  buildExercise("we29", "ظَهَر", "ظَ___ر", "he appeared", "dhahara", "haa", 1, "medial"),

  buildExercise("we30", "صَبَر", "___بَر", "patience", "sabara", "sad", 0, "initial"),
  buildExercise("we31", "صَبَر", "صَ___ر", "patience", "sabara", "ba", 1, "medial"),

  buildExercise("we32", "غَضَب", "___ضَب", "anger", "ghadab", "ghayn", 0, "initial"),
  buildExercise("we33", "غَضَب", "غَ___ب", "anger", "ghadab", "dad", 1, "medial"),

  buildExercise("we34", "طَبَخ", "___بَخ", "he cooked", "tabakha", "taa", 0, "initial"),
  buildExercise("we35", "طَبَخ", "طَ___خ", "he cooked", "tabakha", "ba", 1, "medial"),
  buildExercise("we36", "طَبَخ", "طَبَ___", "he cooked", "tabakha", "kha", 2, "final"),

  buildExercise("we37", "ثَلْج", "___لْج", "snow", "thalj", "tha", 0, "initial"),
  buildExercise("we38", "ثَلْج", "ثَ___ج", "snow", "thalj", "lam", 1, "medial"),
  buildExercise("we39", "ثَلْج", "ثَلْ___", "snow", "thalj", "jim", 2, "final"),

  buildExercise("we40", "حَبْل", "___بْل", "rope", "habl", "ha", 0, "initial"),
  buildExercise("we41", "حَبْل", "حَ___ل", "rope", "habl", "ba", 1, "medial"),
  buildExercise("we42", "حَبْل", "حَبْ___", "rope", "habl", "lam", 2, "final"),
];
