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
  getBetTypeTitle,
  getDateTitle,
  getTimeZoneOffset,
  isChildOf,
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
  tableItems.forEach((item, index) => {
    const tableItem = document.createElement("div");
    tableItem.classList.add("game-list-nav-table-item");
    tableItem.textContent = item;
    if (index === 0) {
      const time = document.createElement("div");
      time.textContent = `(${getTimeZoneOffset(new Date())})`;
      tableItem.appendChild(time);
    }
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
  console.log(data);
  const parentNode = document.getElementById("history-detail");
  showHideNodeById("game-list-view-wrapper");
  if (parentNode) {
    showHideNodeById("history-detail", true);

    const historyHeader = document.createElement("div");
    historyHeader.classList.add(
      "history-header",
      "flex-item-center-content-center"
    );

    const navBack = document.createElement("div");
    navBack.classList.add("nav-back");
    navBack.onclick = () => onclickDetailBack();

    const gameListNavImageLeft = document.createElement("div");
    gameListNavImageLeft.classList.add("game-list-nav-image-left");

    const ghArrow = document.createElement("div");
    ghArrow.classList.add("gh-arrow");

    gameListNavImageLeft.appendChild(ghArrow);
    navBack.appendChild(gameListNavImageLeft);
    historyHeader.appendChild(navBack);

    const titleContainer = document.createElement("div");
    titleContainer.classList.add("flex-item-center-content-center");
    titleContainer.style.flexDirection = "column";
    titleContainer.style.width = "56%";

    const title = document.createElement("div");
    title.classList.add("title");
    title.textContent = getBetTypeTitle(data.betType);

    const subTitle = document.createElement("div");
    subTitle.classList.add("sub-title");
    subTitle.textContent = `${displayDate(
      new Date(data.created)
    )} ${displayTime(new Date(data.created))} (${getTimeZoneOffset(
      new Date(data.created)
    )})`;

    titleContainer.appendChild(title);
    titleContainer.appendChild(subTitle);
    historyHeader.appendChild(titleContainer);

    const rightDiv = document.createElement("div");
    rightDiv.classList.add("right");
    historyHeader.appendChild(rightDiv);

    parentNode.appendChild(historyHeader);

    const selectionList = document.createElement("div");
    selectionList.classList.add("selection-list");

    parentNode.appendChild(selectionList);

    const selectionListItem = document.createElement("div");
    selectionListItem.classList.add("selection-list-item");

    const itemData = [
      { detail: `${data.id}`, label: "Transaction" },
      { detail: `${data.betAmount}`, label: "Bet" },
      { detail: `${data.profit}`, label: "Profit" },
      { detail: `${data.endingBalance}`, label: "Balance" },
    ];

    itemData.forEach((data) => {
      const item = document.createElement("div");
      item.classList.add("item");

      const itemDetail1 = document.createElement("div");
      itemDetail1.classList.add("item-detail");
      itemDetail1.textContent = data.detail;

      const itemDetail2 = document.createElement("div");
      itemDetail2.classList.add("item-detail");
      itemDetail2.textContent = data.label;

      item.appendChild(itemDetail1);
      item.appendChild(itemDetail2);

      selectionListItem.appendChild(item);
    });

    selectionList.appendChild(selectionListItem);

    const historyRegular = document.createElement("div");
    historyRegular.classList.add("history-regular");

    const betInfo = document.createElement("div");
    betInfo.classList.add("bet-info");

    const betSizeLabel = document.createElement("div");
    betSizeLabel.classList.add("bet-size-label");
    betSizeLabel.textContent = `Bet Size ${data.betSize}`;

    const separator = document.createElement("div");
    separator.classList.add("separator");

    const betLevelLabel = document.createElement("div");
    betLevelLabel.classList.add("bet-level-label");
    betLevelLabel.textContent = `Bet Level ${data.betLevel}`;

    betInfo.appendChild(betSizeLabel);
    betInfo.appendChild(separator);
    betInfo.appendChild(betLevelLabel);

    historyRegular.appendChild(betInfo);

    const betResult = document.createElement("div");
    betResult.classList.add("bet-result");

    const betContainer = document.createElement("div");
    betContainer.classList.add("bet-container");

    for (let i = 0; i < 3; i++) {
      const row = document.createElement("div");
      row.classList.add("row");

      for (let j = 0; j < 3; j++) {
        const item = document.createElement("div");
        item.classList.add("item");

        // if ((i * j) % 2 === 0) {
        //   const bg = document.createElement("img");
        //   bg.classList.add("img-bg");
        //   bg.src = `/src/symbol/bg-win.png`;
        //   item.appendChild(bg);
        // }

        const symbol = document.createElement("img");
        symbol.classList.add("symbol");
        symbol.src = `/src/symbol/h1_coins.png`;

        item.appendChild(symbol);
        row.appendChild(item);
      }

      betContainer.appendChild(row);
    }

    betResult.appendChild(betContainer);

    const globular = document.createElement("div");
    globular.classList.add("globular", "flex-item-center-content-center");

    const bgImage = document.createElement("img");
    bgImage.classList.add("bg");
    bgImage.src = "./src/symbol/ui_discoball_00.png";

    const mulImage = document.createElement("img");
    mulImage.classList.add("mul");
    mulImage.src = "./src/symbol/mul_x10.png";

    globular.appendChild(bgImage);
    globular.appendChild(mulImage);

    betResult.appendChild(globular);

    historyRegular.appendChild(betResult);

    const payoutTitle = document.createElement("div");
    payoutTitle.classList.add(
      "payout-title",
      "flex-item-center-content-center"
    );

    const payoutTitleLeft = document.createElement("div");
    payoutTitleLeft.classList.add("payout-title-left");

    const payoutTitleText = document.createTextNode("Payout");

    const payoutTitleRight = document.createElement("div");
    payoutTitleRight.classList.add("payout-title-right");

    payoutTitle.appendChild(payoutTitleLeft);
    payoutTitle.appendChild(payoutTitleText);
    payoutTitle.appendChild(payoutTitleRight);

    historyRegular.appendChild(payoutTitle);

    if (data.spinResult.winLines.length > 0) {
      data.spinResult.winLines.forEach((x) => {
        const payoutDetail = document.createElement("div");
        payoutDetail.classList.add("payout-detail");

        const payoutItem = document.createElement("div");
        payoutItem.classList.add(
          "payout-item",
          "flex-item-center-content-between"
        );
        payoutItem.onclick = () =>
          toggleTooltip(payoutDetail, data.betSize, data.betLevel, x.winSymbol);

        const payoutLeft = document.createElement("div");
        payoutLeft.classList.add("left", "flex-item-center-content-between");

        const lineNumber = document.createElement("div");
        lineNumber.textContent = `0${x.lineId + 1}`;

        const matrix = document.createElement("img");
        matrix.src = `./src/symbol/${x.lineId + 1}_winline.jpeg`;

        payoutLeft.appendChild(lineNumber);
        payoutLeft.appendChild(matrix);

        const payoutRight = document.createElement("div");
        payoutRight.classList.add("right");

        const value = document.createElement("div");
        value.classList.add("value");
        value.textContent = `${(data.betSize * data.betLevel * x.winSymbol).toFixed(2)}`;

        const ghBasicSprite = document.createElement("div");
        ghBasicSprite.classList.add("gh_basic_sprite");

        payoutRight.appendChild(value);
        payoutRight.appendChild(ghBasicSprite);

        payoutItem.appendChild(payoutLeft);
        payoutItem.appendChild(payoutRight);

        payoutDetail.appendChild(payoutItem);

        historyRegular.appendChild(payoutDetail);
      });
    } else {
      const noWinning = document.createElement("div");
      noWinning.classList.add(
        "no-winning-combination-container",
        "flex-item-center-content-center"
      );
      noWinning.textContent = "No Winning Combination";

      historyRegular.appendChild(noWinning);
    }

    selectionList.appendChild(historyRegular);
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

export const toggleTooltip = (
  parent: any,
  betSize: number,
  betLevel: number,
  value: number
) => {
  const tooltip = document.getElementById("payout-tooltip");

  const isChild = isChildOf(tooltip, parent);
  if(isChild){
    tooltip?.remove();
  }else{
    const payoutTooltip = document.createElement("div");
    payoutTooltip.id = "payout-tooltip";
  
    const triangle = document.createElement("div");
    triangle.classList.add("triangle");
  
    const label = document.createElement("div");
    label.classList.add("label");
    label.textContent = "Bet Size x Bet Level x Symbol Payout Values";
  
    const valueTooltip = document.createElement("div");
    valueTooltip.classList.add("value");
    valueTooltip.textContent = `${betSize} x ${betLevel} x ${value}`;
  
    payoutTooltip.appendChild(triangle);
    payoutTooltip.appendChild(label);
    payoutTooltip.appendChild(valueTooltip);
  
    parent.appendChild(payoutTooltip);
  }


  // const payoutTooltip = document.createElement("div");
  // payoutTooltip.id = "payout-tooltip";

  // const triangle = document.createElement("div");
  // triangle.classList.add("triangle");

  // const label = document.createElement("div");
  // label.classList.add("label");
  // label.textContent = "Bet Size x Bet Level x Symbol Payout Values";

  // const valueTooltip = document.createElement("div");
  // valueTooltip.classList.add("value");
  // valueTooltip.textContent = `${betSize} x ${betLevel} x ${value}`;

  // payoutTooltip.appendChild(triangle);
  // payoutTooltip.appendChild(label);
  // payoutTooltip.appendChild(valueTooltip);

  // parent.appendChild(payoutTooltip);

  // const tooltip = document.getElementById("payout-tooltip");
  // if (tooltip) {
  //   const isShow =
  //     window.getComputedStyle(tooltip).getPropertyValue("display") === "block";
  //   showHideNodeById("payout-tooltip", !isShow, "block");
  // }
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

export const onclickDetailBack = () => {
  showHideNodeById("game-list-view-wrapper", true);
  showHideNodeById("history-detail");

  //remove child of history-detail
  document.getElementById("history-detail")?.replaceChildren("");
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
            playerToken: "s8z060uxk7320c40owgr1moo",
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
