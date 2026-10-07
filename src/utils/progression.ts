/**
 * Character Progression, Experience Points (EXP) & Level Calculations
 * for Julian in Ravenscroft Castle
 */

export interface LevelProgress {
  level: number;
  totalExp: number;
  expInLevel: number;
  expNeededForNext: number;
  progressPercent: number;
  title: string;
  maxHpBonus: number;
  atkBonus: number;
  spBonus: number;
}

// EXP thresholds for each level
export const LEVEL_THRESHOLDS = [
  0,    // Level 1 (0-49 EXP)
  50,   // Level 2 (50-119 EXP)
  120,  // Level 3 (120-219 EXP)
  220,  // Level 4 (220-349 EXP)
  350,  // Level 5 (350-499 EXP)
  500,  // Level 6 (500-699 EXP)
  700,  // Level 7 (700-949 EXP)
  950,  // Level 8 (950-1249 EXP)
  1250, // Level 9 (1250-1599 EXP)
  1600, // Level 10 (Max Level)
];

export const LEVEL_TITLES: Record<number, string> = {
  1: 'Acemi Mirasçı & Savaşçı',
  2: 'Uyanmış Ruh & Kripta Kaşifi',
  3: 'Gümüş Şafak Şövalyesi',
  4: 'Gölgelerin Avcısı',
  5: 'Kızıl Ayın Efendisi',
  6: 'Kadim Kanın Muhafızı',
  7: 'Gölge Şampiyonu',
  8: 'Ravenscroft Lordu',
  9: 'Ebedi Şafak Koruyucusu',
  10: 'Kan Tahtı’nın Hükümdarı',
};

export function calculateLevelProgress(totalExp: number = 0): LevelProgress {
  const safeExp = Math.max(0, totalExp);
  let level = 1;

  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (safeExp >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
    } else {
      break;
    }
  }

  // Cap at max level
  if (level > LEVEL_THRESHOLDS.length) {
    level = LEVEL_THRESHOLDS.length;
  }

  const currentLevelBase = LEVEL_THRESHOLDS[level - 1] || 0;
  const isMaxLevel = level >= LEVEL_THRESHOLDS.length;
  const nextLevelBase = isMaxLevel ? currentLevelBase + 500 : LEVEL_THRESHOLDS[level];

  const expInLevel = safeExp - currentLevelBase;
  const expNeededForNext = isMaxLevel ? 500 : nextLevelBase - currentLevelBase;
  const progressPercent = isMaxLevel ? 100 : Math.min(100, Math.max(0, Math.round((expInLevel / expNeededForNext) * 100)));

  return {
    level,
    totalExp: safeExp,
    expInLevel,
    expNeededForNext,
    progressPercent,
    title: LEVEL_TITLES[level] || `Seviye ${level} Savaşçı`,
    maxHpBonus: (level - 1) * 15,
    atkBonus: (level - 1) * 4,
    spBonus: (level - 1) * 10,
  };
}
