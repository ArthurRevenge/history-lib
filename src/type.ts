export interface HistoryResponse {
  data: HistoryDetail[];
}

export interface HistoryDetail {
  amount: number;
  earn: number;
  endingBalance: number;
  betAmount: number;
  profit: number;
  id: string;
  betType: string;
  betStatus: string;
  betSize: number;
  betLevel: number;
  betFreeSpins: {
    freeSpinBets: [];
    totalFreeSpins: number;
  };
  totalProfitFreeGame: number;
  created: Date;
  spinResult: {
    baseBet: number;
    betAmount: number;
    bigWinTile: "";
    isBetSureWin: boolean;
    isBuyFreeSpin: boolean;
    isFreeSpin: boolean;
    playerBalance: number;
    profit: number;
    reelWindow: [];
    result: [];
    resultFreeSpin: {
      random: number;
      freeSpins: number;
    };

    resultMultiplier: {
      isGetMultiplier: boolean;
      isGetMultiplierRandom: boolean;
      multiplier: number;
      multiplierCombination: [];
      multiplierRandom: number;
    };
    storedIndex: [];
    totalWin: number;
    winLines: WinLine[];
  };
}

export interface WinLine {
  lineId: number;
  winAmount: string;
  winSymbol: number;
}

export interface RecordTotal {
  sumBetAmount: number;
  sumProfit: number;
  totalBets: number;
}

export interface CustomDateRange {
  numStartYear: number;
  numStartMonth: number;
  numStartDay: number;
  numEndYear: number;
  numEndMonth: number;
  numEndDay: number;
}

export enum FilterBy {
  Today = 0,
  LastWeek,
  Custom,
}

export enum SYMBOL_ID {
  WILD,
  COIN,
  RIBBON,
  FIRE_CRACKER,
  LANTERN,
  ANGBAO,
  INGOT,
}

export enum MULTIPLIER {
  ONE = 1,
  TWO = 2,
  FIVE = 5,
  TEN = 10,
}

export enum E_LAYOUT_MODE {
  NORMAL = "NORMAL",
  FREESPIN = "FREESPIN",
  GAMBLE = "GAMBLE",
  JACKPOT = "JACKPOT",
}

export const url = "https://api.dev.revenge-games.com/dragon-fortune/bets";
export const urlTotal =
  "https://api.dev.revenge-games.com/dragon-fortune/total-bets";

export const configLine: number[][] = [
  [0, 3, 6], //0
  [1, 4, 7], //1
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];


export const GetRandom = <T>(array: T[], startIndex = 0, length = array.length): T | null => {
  const randomIndex = startIndex + Math.floor(Math.random() * length);
  return array[randomIndex] === undefined ? null : array[randomIndex];
};