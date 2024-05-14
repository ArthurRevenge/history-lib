import "./style.scss";
import {
  CustomDateRange,
  FilterBy,
  HistoryDetail,
  HistoryResponse,
  RecordTotal,
  url,
  urlTotal,
} from "./type";
import {
  QueryParams,
  calculateDateRange,
  displayDate,
  displayTime,
  getDateTitle,
  objectToQueryString,
  parseQueryParams,
  showHideNodeById,
} from "./util";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGESIZE = 10;

export const createHistoryElement = () => {
  const gameHistoryOverlay = document.createElement("div");
  gameHistoryOverlay.id = "game-history-overlay";

  const gameListViewWrapper = document.createElement("div");
  gameListViewWrapper.id = "game-list-view-wrapper";
  gameHistoryOverlay.appendChild(gameListViewWrapper);
  gameListViewWrapper.style.display = "flex";

  const historyHeader = document.createElement("div");
  historyHeader.classList.add(
    "history-header",
    "flex-item-center-content-between"
  );
  gameListViewWrapper.appendChild(historyHeader);

  const navCalendar = document.createElement("div");
  navCalendar.id = "nav-calendar";
  navCalendar.classList.add("flex-item-center-content-center");
  navCalendar.onclick = () => showHideNodeById("selection-date", true);
  historyHeader.appendChild(navCalendar);

  const iconCalendar = document.createElement("div");
  iconCalendar.classList.add("icon-calendar");
  navCalendar.appendChild(iconCalendar);

  const title = document.createElement("div");
  title.classList.add("title", "color-yellow-highlight");
  title.textContent = "Game History";
  historyHeader.appendChild(title);

  const navExitIcon = document.createElement("div");
  navExitIcon.classList.add("nav-exit-icon", "flex-item-center-content-center");
  navExitIcon.onclick = () => destroyHistory();
  historyHeader.appendChild(navExitIcon);

  const exitIconStroke = document.createElement("div");
  exitIconStroke.classList.add(
    "exit-icon-stroke",
    "flex-item-center-content-center"
  );
  navExitIcon.appendChild(exitIconStroke);

  const exitIconStrokeOne = document.createElement("div");
  exitIconStrokeOne.classList.add("exit-icon-stroke-one");
  exitIconStroke.appendChild(exitIconStrokeOne);

  const exitIconStrokeTwo = document.createElement("div");
  exitIconStrokeTwo.classList.add("exit-icon-stroke-two");
  exitIconStroke.appendChild(exitIconStrokeTwo);

  const gameListViewContentsContainer = document.createElement("div");
  gameListViewContentsContainer.id = "game-list-view-contents-container";
  gameListViewWrapper.appendChild(gameListViewContentsContainer);

  const loaderContainer = document.createElement("div");
  loaderContainer.id = "loader-container";
  loaderContainer.innerHTML = `<div class="loader"></div>`;
  gameListViewContentsContainer.appendChild(loaderContainer);

  const historyTableHeader = document.createElement("div");
  historyTableHeader.classList.add("history-table-header", "flex-item-center");
  gameListViewContentsContainer.appendChild(historyTableHeader);

  const tableItems = ["Time", "Transaction", "Bet", "Profit"];
  tableItems.forEach((item) => {
    const tableItem = document.createElement("div");
    tableItem.classList.add("game-list-nav-table-item");
    tableItem.textContent = item;
    historyTableHeader.appendChild(tableItem);
  });

  const historyTableBody = document.createElement("div");
  historyTableBody.id = "history-table-body";
  gameListViewContentsContainer.appendChild(historyTableBody);

  //create footer

  const selectionDate = document.createElement("div");
  selectionDate.id = "selection-date";
  gameHistoryOverlay.appendChild(selectionDate);

  const gameDetail = document.createElement("div");
  gameDetail.id = "history-detail";
  gameHistoryOverlay.appendChild(gameDetail);

  const selectionDateHeader = document.createElement("div");
  selectionDateHeader.classList.add(
    "history-header",
    "flex-item-center-content-between"
  );
  selectionDate.appendChild(selectionDateHeader);

  const navBack = document.createElement("div");
  navBack.classList.add("nav-back");
  navBack.onclick = () => backToHistoryMenu();
  selectionDateHeader.appendChild(navBack);

  const iconBack = document.createElement("div");
  iconBack.classList.add("flex-item-center-content-center");
  navBack.appendChild(iconBack);

  const navImageLeft = document.createElement("div");
  navImageLeft.classList.add("game-list-nav-image-left", "game-list-nav-image");
  iconBack.appendChild(navImageLeft);

  const ghArrow = document.createElement("div");
  ghArrow.classList.add("gh-arrow");
  navImageLeft.appendChild(ghArrow);

  const selectionDateTitle = document.createElement("div");
  selectionDateTitle.classList.add("title", "color-yellow-highlight");
  selectionDateTitle.textContent = "Select Date Range";
  selectionDateHeader.appendChild(selectionDateTitle);

  const selectionDateRight = document.createElement("div");
  selectionDateRight.classList.add("right");
  selectionDateHeader.appendChild(selectionDateRight);

  const selectionList = document.createElement("div");
  selectionList.classList.add("selection-list", "flex-item-center");
  selectionDate.appendChild(selectionList);

  [FilterBy.Today, FilterBy.LastWeek, FilterBy.Custom].forEach((value) => {
    const selectionListItem = document.createElement("div");
    selectionListItem.classList.add(
      "selection-list-item",
      "flex-item-center-content-center"
    );
    selectionListItem.textContent = getDateTitle(value);
    selectionListItem.onclick = () => selectDateBy(value);
    selectionList.appendChild(selectionListItem);
  });

  const gameDiv = document.getElementById("Cocos3dGameContainer");
  gameDiv?.appendChild(gameHistoryOverlay);
};

export const renderHistoryList = (data: HistoryDetail[]) => {
  const historyTableBody = document.getElementById("history-table-body");

  if (historyTableBody) {
    data.forEach((itemData: HistoryDetail) => {
      const gameListItemContainer = document.createElement("div");
      gameListItemContainer.classList.add(
        "game-list-item-container",
        "flex-item-center"
      );

      const columnContainer = document.createElement("div");
      columnContainer.classList.add("game-list-item-column-container");
      gameListItemContainer.onclick = () => renderDetail(itemData);
      gameListItemContainer.appendChild(columnContainer);

      const timeItem = document.createElement("div");
      timeItem.classList.add("game-list-item");
      timeItem.textContent = displayDate(itemData.created);
      columnContainer.appendChild(timeItem);

      const dateItem = document.createElement("div");
      dateItem.classList.add("game-list-item");
      dateItem.textContent = displayTime(itemData.created);
      columnContainer.appendChild(dateItem);

      [itemData.id, itemData.betAmount, itemData.earn].forEach((value: any) => {
        const item = document.createElement("div");
        item.classList.add("game-list-item");
        item.textContent = value as string;
        const columnContainer = document.createElement("div");
        columnContainer.classList.add("game-list-item-column-container");
        columnContainer.appendChild(item);
        gameListItemContainer.appendChild(columnContainer);
      });

      const arrowImageContainer = document.createElement("div");
      arrowImageContainer.classList.add(
        "game-list-item-arrow-image-container",
        "flex-item-center-content-center"
      );
      gameListItemContainer.appendChild(arrowImageContainer);

      const angleVertical = document.createElement("div");
      angleVertical.classList.add("gh-angle-vertical", "angle-right");
      arrowImageContainer.appendChild(angleVertical);

      historyTableBody.appendChild(gameListItemContainer);
    });
  }
};

export const renderFooter = (sumRecord: RecordTotal | null) => {
  const gameListViewContentsContainer = document.getElementById(
    "game-list-view-contents-container"
  );

  if (gameListViewContentsContainer) {
    const gameListFooterContainer = document.createElement("div");
    gameListFooterContainer.classList.add(
      "game-list-footer-container",
      "game-list-footer-container-vertical",
      "flex-item-center"
    );
    gameListViewContentsContainer.appendChild(gameListFooterContainer);

    const pagination = document.createElement("div");
    pagination.classList.add(
      "game-list-footer-item",
      "pagination",
      "flex-item-center-content-center"
    );
    gameListFooterContainer.appendChild(pagination);

    const pre = document.createElement("div");
    pre.classList.add("game-list-footer-item", "arrow", "pre");
    pre.onclick = () => HistoryGameClient.instance().onClickPre();
    pagination.appendChild(pre);

    const page = document.createElement("div");
    page.classList.add("game-list-footer-item");
    page.textContent = `${
      HistoryGameClient.instance().page
    }/${HistoryGameClient.instance().countTotalPage()}`;
    pagination.appendChild(page);

    const next = document.createElement("div");
    next.classList.add("game-list-footer-item", "arrow", "next");
    next.onclick = () => HistoryGameClient.instance().onClickNext();
    pagination.appendChild(next);

    const gameListFooterDateContainer = document.createElement("div");
    gameListFooterDateContainer.classList.add(
      "game-list-footer-date-container"
    );
    gameListFooterContainer.appendChild(gameListFooterDateContainer);

    const gameListFooterDateLabel = document.createElement("div");
    gameListFooterDateLabel.classList.add(
      "game-list-footer-date-vertical",
      "color-yellow-highlight"
    );
    gameListFooterDateLabel.textContent = getDateTitle(
      HistoryGameClient.instance().filterBy
    );

    gameListFooterDateContainer.appendChild(gameListFooterDateLabel);

    const gameListFooterRecord = document.createElement("div");
    gameListFooterRecord.classList.add("game-list-footer-record-vertical");
    gameListFooterRecord.textContent = `${sumRecord?.totalBets || 0} Records`;
    gameListFooterDateContainer.appendChild(gameListFooterRecord);

    if (sumRecord) {
      [sumRecord.sumBetAmount, sumRecord.sumProfit].forEach((value) => {
        const footerItem = document.createElement("div");
        footerItem.classList.add("game-list-footer-item");

        const itemWrapper = document.createElement("div");
        itemWrapper.classList.add("game-list-footer-item-wrapper");
        itemWrapper.textContent = value.toString();
        footerItem.appendChild(itemWrapper);

        gameListFooterContainer.appendChild(footerItem);
      });
    }
  }
};

export const renderDetail = (data: HistoryDetail) => {
  const parentNode = document.getElementById("history-detail");
  // // showHideNodeById("game-list-view-wrapper");
  if(parentNode){
    
  }
 
};

export const showHideHistory = (isShow: boolean) => {
  showHideNodeById("game-history-overlay", isShow);
};

export const destroyHistory = () => {
  document.getElementById("game-history-overlay")?.remove();
};

export const backToHistoryMenu = () => {
  showHideNodeById("selection-date");
};

export const selectDateBy = (filterBy: number) => {
  let currentFilterBy = HistoryGameClient.instance().filterBy;

  if (filterBy === FilterBy.LastWeek || filterBy === FilterBy.Today) {
    if (filterBy !== currentFilterBy) {
      HistoryGameClient.instance().filterBy = filterBy;
      HistoryGameClient.instance().page = DEFAULT_PAGE;
      HistoryGameClient.instance().fetchData();
    }
  } else if (filterBy === FilterBy.Custom) {
    //TODO: open new section filter
  } else {
  }

  backToHistoryMenu();
};

class HistoryGameClient {
  histories: HistoryDetail[];
  filterBy: number;
  recordTotal: RecordTotal | null;
  customRange: CustomDateRange | null;

  page: number;
  pageSize: number;

  constructor() {
    this.recordTotal = null;
    this.histories = [];

    this.filterBy = FilterBy.Today;
    this.customRange = null;

    this.page = DEFAULT_PAGE;
    this.pageSize = DEFAULT_PAGESIZE;

    this.initialize();
    this.fetchData();
  }

  static _instance = new HistoryGameClient();

  static instance(): HistoryGameClient {
    return HistoryGameClient._instance;
  }

  async fetchTable(url: string): Promise<HistoryResponse> {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }

  async fetchTotal(url: string): Promise<RecordTotal> {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }

  countSkip = () => {
    return (this.page - 1) * this.pageSize;
  };

  countTotalPage = () => {
    if (!this.recordTotal) return DEFAULT_PAGE;
    return this.recordTotal.totalBets % this.pageSize === 0
      ? Math.floor(this.recordTotal.totalBets / this.pageSize)
      : Math.floor(this.recordTotal.totalBets / this.pageSize) + 1;
  };

  onClickPre = () => {
    if (this.page > 1) {
      this.page--;
      HistoryGameClient.instance().fetchData();
    }
  };

  onClickNext = () => {
    if (this.page < this.countTotalPage()) {
      this.page++;
      HistoryGameClient.instance().fetchData();
    }
  };

  async fetchData(): Promise<void> {
    //loading
    showHideNodeById("loader-container", true, "flex");
    const historyTableBody = document.getElementById("history-table-body");
    historyTableBody?.replaceChildren("");

    //prepare data
    const dateRange = calculateDateRange(this.filterBy, this.customRange);

    const baseQuery: QueryParams =
      Object.entries(parseQueryParams()).length > 0
        ? parseQueryParams()
        : {
            brandCode: "mock",
            gameCode: "dragon-fortune",
            groupCode: "weas",
            playerToken: "wexqm1ubblp7g65cq79bqgpp",
          };

    const url1 = `${url}?${objectToQueryString(baseQuery)}&startDate=${
      dateRange.startDate
    }&endDate=${dateRange.endDate}&skip=${this.countSkip()}&limit=${
      this.pageSize
    }`;

    const url2 = `${urlTotal}?${objectToQueryString(baseQuery)}&startDate=${
      dateRange.startDate
    }&endDate=${dateRange.endDate}`;

    //effect
    try {
      const [list, obj] = await Promise.all([
        this.fetchTable(url1),
        this.fetchTotal(url2),
      ]);

      showHideNodeById("loader-container", false);
      this.histories = list.data;
      renderHistoryList(this.histories);

      this.recordTotal = { ...obj };
      renderFooter(this.recordTotal);
    } catch (error) {
      console.error("Error fetching data:", error);
      showHideNodeById("loader-container", false);
      renderHistoryList([]);
    }
  }

  initialize = () => {
    createHistoryElement();
    showHideHistory(true);

    //register event when window changes
    this.resizeComponent();
  };

  resizeComponent = () => {
    window.addEventListener("resize", resizeHistory);

    function resizeHistory() {
      const container = document.getElementById("Cocos3dGameContainer");
      const history = document.getElementById("game-history-overlay");
      if (container && history) {
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;

        history.style.width = `${containerWidth}px`;
        history.style.height = `${containerHeight}px`;
      }
    }

    resizeHistory();
  };
}

export default HistoryGameClient;
