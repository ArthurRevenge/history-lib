import { CustomDateRange, E_LAYOUT_MODE, FilterBy, SYMBOL_ID } from "./type";

export const showHideNodeById = (
  id: string,
  show?: boolean,
  displayType?: string
) => {
  var node = document.getElementById(id);
  if (node)
    node.style.display = show ? (displayType ? displayType : "block") : "none";
};

export const getDateTitle = (type: FilterBy) => {
  if (type === FilterBy.Custom) return "Custom";
  else if (type === FilterBy.LastWeek) return "Last 7 days";
  return "Today";
};

export const getBetTypeTitle = (type: string) => {
  if (type === E_LAYOUT_MODE.FREESPIN) return "Free Spin";
  else if (type === E_LAYOUT_MODE.GAMBLE) return "Gamble";
  else if (type === E_LAYOUT_MODE.JACKPOT) return "Jackpot";
  return "Normal";
};

export const calculateDateRange = (
  type: FilterBy,
  custom?: CustomDateRange | null
) => {
  let today = new Date();
  let startDate = "",
    endDate = "";

  if (type === FilterBy.Custom && custom) {
    let _startDate = new Date(
      custom.numStartYear,
      custom.numStartMonth - 1,
      custom.numStartDay
    );
    let _endDate = new Date(
      custom.numEndYear,
      custom.numEndMonth - 1,
      custom.numEndDay,
      23,
      59,
      59
    );
    if (_endDate.getTime() > today.getTime()) _endDate = today;
    if (_startDate.getTime() > _endDate.getTime()) _startDate = _endDate;
    startDate = _startDate.toISOString();
    endDate = _endDate.toISOString();
  } else if (type === FilterBy.LastWeek) {
    endDate = today.toISOString();
    today.setDate(today.getDate() - 7);
    var noTime = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    startDate = noTime.toISOString();
  } else {
    //today
    endDate = today.toISOString();
    var noTime = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    startDate = noTime.toISOString();
  }

  return {
    startDate,
    endDate,
  };
};

export const displayDate = (date: Date) => {
  return new Date(date).toLocaleDateString();
};

export const displayTime = (date: Date) => {
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export interface QueryParams {
  [key: string]: string;
}

export const parseQueryParams = (): QueryParams => {
  const queryParams = new URLSearchParams(window.location.search);
  const params: QueryParams = {};

  for (const [key, value] of queryParams.entries()) {
    params[key] = value;
  }

  return params;
};

export const objectToQueryString = (obj: QueryParams) => {
  const params = new URLSearchParams();

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      params.append(key, obj[key]);
    }
  }

  return params.toString();
};

export const getTimeZoneOffset = (date: Date) => {
  const offset = new Date(date).getTimezoneOffset();
  const sign = offset <= 0 ? "+" : "-";
  const hours = Math.floor(Math.abs(offset) / 60);
  const minutes = Math.abs(offset) % 60;
  return `GMT${sign}${String(hours).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}`;
};

export const isChildOf = (child: HTMLElement | null, parent: HTMLElement) => {
  while (child !== null) {
    if (child === parent) {
      return true;
    }
    child = child.parentElement; // Use parentElement instead of parentNode for type safety
  }
  return false;
};

export const getSymbolImage = (id: SYMBOL_ID) => {
  switch (id) {
    case SYMBOL_ID.WILD:
      return "/src/symbol/s_wild.png";
    case SYMBOL_ID.COIN:
      return "/src/symbol/h1_coins.png";
    case SYMBOL_ID.RIBBON:
      return "/src/symbol/h2_ribbon.png";
    case SYMBOL_ID.FIRE_CRACKER:
      return "/src/symbol/h3_firecracker.png";
    case SYMBOL_ID.LANTERN:
      return "/src/symbol/h4_lantern.png";
    case SYMBOL_ID.ANGBAO:
      return "/src/symbol/h5_angbao.png";
    case SYMBOL_ID.INGOT:
      return "/src/symbol/h6_ingot.png";
  }
};

export const getAllMonth = () => {
  return Array.from({ length: 12 }, (_, index) => index + 1);
};

export const getAllDay = () => {
  return Array.from({ length: 31 }, (_, index) => index + 1);
};


export const getListYearForFilter = () => {
  const currentYear = new Date().getFullYear();
  const lastYear = currentYear - 1;
  const twoYearsAgo = currentYear - 2;

  return [twoYearsAgo, lastYear, currentYear];
};

export const getCurrentDateDetails = () => {
  const currentDate = new Date();
  const date = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  return { date, month, year };
}