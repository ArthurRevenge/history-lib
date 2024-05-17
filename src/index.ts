import "./style.scss";

import {
  CustomDateRange,
  FilterBy,
  GetRandom,
  HistoryDetail,
  HistoryResponse,
  MULTIPLIER,
  RecordTotal,
  configLine,
} from "./type";
import {
  QueryParams,
  calculateDateRange,
  displayDate,
  displayTime,
  getAllDay,
  getAllMonth,
  getBetTypeTitle,
  getCurrentDateDetails,
  getDateTitle,
  getListYearForFilter,
  getSymbolImage,
  getTimeZoneOffset,
  objectToQueryString,
  parseQueryParams,
  showHideNodeById,
} from "./util";
import path from "path";
import fs from "fs";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGESIZE = 10;

export const createHistoryElement = () => {
  const gameDiv = document.getElementById("Cocos3dGameContainer");

  const gameHistoryOverlay = document.createElement("div");
  gameHistoryOverlay.id = "game-history-overlay";
  gameDiv?.appendChild(gameHistoryOverlay);

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
    const pa = document.createElement("div");
    pa.classList.add("history-regular-container");

    const historyRegular = document.createElement("div");
    historyRegular.classList.add("history-regular");
    pa.appendChild(historyRegular);

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

    let winLines: number[] = [];
    if (data.spinResult.winLines.length > 0) {
      let lineIds = data.spinResult.winLines.map((w) => w.lineId);
      winLines = Array.from(
        new Set(
          configLine.filter((_c, index) => lineIds.includes(index)).flat()
        )
      );
    }

    const reelWindow = data.spinResult.reelWindow;

    for (let i = 0; i < reelWindow.length; i++) {
      const row = document.createElement("div");
      row.classList.add("row");

      const arrInRow = reelWindow.map((r) => r[i]);
      for (let j = 0; j < arrInRow.length; j++) {
        const currentIndex = i + 3 * j;
        const isWin = winLines.length > 0 && winLines.includes(currentIndex);

        const item = document.createElement("div");
        item.classList.add("item", `index_${currentIndex.toString()}`);

        if (isWin) {
          const bg = document.createElement("img");
          bg.classList.add("img-bg");
          bg.src = `/src/symbol/bg-win.png`;
          item.appendChild(bg);
        }

        const symbol = document.createElement("img");
        symbol.classList.add("symbol", isWin ? "full-light" : "no");
        symbol.src = getSymbolImage(arrInRow[j]);

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
    globular.appendChild(bgImage);

    //render multi
    if (data.spinResult.resultMultiplier.multiplier !== MULTIPLIER.ONE) {
      const mulImage = document.createElement("img");
      mulImage.classList.add("mul");
      mulImage.src = `./src/symbol/mul_x${data.spinResult.resultMultiplier.multiplier}.png`;
      globular.appendChild(mulImage);
    } else {
      const random = GetRandom([
        MULTIPLIER.TWO,
        MULTIPLIER.FIVE,
        MULTIPLIER.TEN,
      ]);

      const reel = document.createElement("div");
      reel.classList.add("reel");

      const reelLeft = document.createElement("img");
      reelLeft.classList.add("reel-left");
      reelLeft.src = `./src/symbol/mul_x${random}.png`;
      reel.appendChild(reelLeft);

      const reelRight = document.createElement("img");
      reelRight.classList.add("reel-right");
      reelRight.src = `./src/symbol/mul_x${random}.png`;
      reel.appendChild(reelRight);

      globular.appendChild(reel);
    }

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
      data.spinResult.winLines.forEach((x, index) => {
        const payoutDetail = document.createElement("div");
        payoutDetail.classList.add("payout-detail");

        const payoutItem = document.createElement("div");
        payoutItem.classList.add(
          "payout-item",
          "flex-item-center-content-between"
        );
        payoutItem.onclick = () =>
          toggleTooltip(
            payoutDetail,
            data.betSize,
            data.betLevel,
            x.winSymbol,
            index
          );

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
        value.textContent = `${(
          data.betSize *
          data.betLevel *
          x.winSymbol
        ).toFixed(2)}`;

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
      if (data.spinResult.resultMultiplier.multiplier > MULTIPLIER.ONE) {
        const winMultiplier = document.createElement("div");
        winMultiplier.classList.add("win-multiplier");
        winMultiplier.textContent = `Win Multiplier x${data.spinResult.resultMultiplier.multiplier}`;
        historyRegular.appendChild(winMultiplier);
      }
      const noWinning = document.createElement("div");
      noWinning.classList.add(
        "no-winning-combination-container",
        "flex-item-center-content-center"
      );
      noWinning.textContent = "No Winning Combination";

      historyRegular.appendChild(noWinning);
    }
    selectionList.appendChild(pa);

    pa.appendChild(historyRegular);
  }
};

export const renderCalendar = () => {
  const gameHistoryOverlay = document.getElementById("game-history-overlay");
  if (gameHistoryOverlay) {
    createCalendarContainer(gameHistoryOverlay);
  }
};

function createCalendarContainer(parent: any) {
  const calendarContainer = document.createElement("div");
  calendarContainer.id = "calendar-container";

  const header = document.createElement("div");
  header.className = "header";

  const navBack = document.createElement("div");
  navBack.className = "nav-back";
  navBack.onclick = backToSelectionDate;

  const navImageLeft = document.createElement("div");
  navImageLeft.className = "nav-image-left";

  const ghArrow = document.createElement("div");
  ghArrow.className = "gh-arrow";

  navImageLeft.appendChild(ghArrow);
  navBack.appendChild(navImageLeft);
  header.appendChild(navBack);

  const title = document.createElement("div");
  title.className = "title color-yellow-highlight";
  title.textContent = "Custom";
  header.appendChild(title);

  const right = document.createElement("div");
  right.className = "right";
  header.appendChild(right);

  calendarContainer.appendChild(header);

  const calendarViewBackground = document.createElement("div");
  calendarViewBackground.id = "calendar-view-background";

  const customPageContainer = document.createElement("div");
  customPageContainer.id = "custom-page-container";

  const startRow = createRow("Start", "start");
  const endRow = createRow("End", "end");

  customPageContainer.appendChild(startRow);
  customPageContainer.appendChild(endRow);

  const btnSubmit = document.createElement("div");
  btnSubmit.id = "btn-submit";
  btnSubmit.textContent = "Confirm";
  btnSubmit.onclick = submitCustomDate;

  customPageContainer.appendChild(btnSubmit);
  calendarViewBackground.appendChild(customPageContainer);
  calendarContainer.appendChild(calendarViewBackground);

  parent.appendChild(calendarContainer);
}

const createRow = (labelText: string, prefix: string) => {
  const row = document.createElement("div");
  row.className = "row";

  const label = document.createElement("label");
  label.textContent = labelText;

  const groupBtn = document.createElement("div");
  groupBtn.className = "group-btn";

  const yearBtn = createDatePicker(prefix, "year", getListYearForFilter());
  const monthBtn = createDatePicker(prefix, "month", getAllMonth());
  const dayBtn = createDatePicker(prefix, "day", getAllDay());

  groupBtn.appendChild(yearBtn);
  groupBtn.appendChild(monthBtn);
  groupBtn.appendChild(dayBtn);

  row.appendChild(label);
  row.appendChild(groupBtn);

  return row;
};

function createDatePicker(prefix: string, type: string, values: number[]) {
  let value = 0;
  if (prefix == "start") {
    if (type === "year") {
      value = HistoryGameClient.instance().customRange?.numStartYear || 0;
    } else if (type === "month") {
      value = HistoryGameClient.instance().customRange?.numStartMonth || 0;
    } else if (type === "day") {
      value = HistoryGameClient.instance().customRange?.numStartDay || 0;
    }
  } else if (prefix == "end") {
    if (type === "year") {
      value = HistoryGameClient.instance().customRange?.numEndYear || 0;
    } else if (type === "month") {
      value = HistoryGameClient.instance().customRange?.numEndMonth || 0;
    } else if (type === "day") {
      value = HistoryGameClient.instance().customRange?.numEndDay || 0;
    }
  }
  const btnDate = document.createElement("div");
  btnDate.id = `${prefix}-${type}`;
  btnDate.className = "btn-date";

  btnDate.onclick = () => toggleDropdown(prefix, type, values);

  const valueDiv = document.createElement("div");
  valueDiv.id = `${prefix}-${type}-value`;
  valueDiv.textContent = value.toString();

  btnDate.appendChild(valueDiv);

  return btnDate;
}

const toggleDropdown = (prefix: string, type: string, values: number[]) => {
  const btnDate = document.getElementById(`${prefix}-${type}`);
  const dropDown = document.getElementById(`${prefix}-${type}-drop-down`);
  if (btnDate) {
    if (!dropDown) {
      const dropDown = document.createElement("div");
      dropDown.id = `${prefix}-${type}-drop-down`;
      dropDown.className = "drop-down";
      dropDown.style.display = "flex";

      values.forEach((value) => {
        const itemValue = document.createElement("div");
        itemValue.className = "item-value";
        itemValue.textContent = value.toString();
        itemValue.onclick = () => chooseValue(prefix, type, value);
        dropDown.appendChild(itemValue);
      });

      btnDate.appendChild(dropDown);
    } else {
      dropDown.remove();
    }
  }
};

const chooseValue = (prefix: string, type: string, value: number) => {
  const node = document.getElementById(`${prefix}-${type}-value`);
  if (node) node.textContent = value.toString();

  if (
    HistoryGameClient.instance() &&
    HistoryGameClient.instance().customRange
  ) {
    if (prefix == "start") {
      if (type === "year") {
        HistoryGameClient.instance().customRange.numStartYear = value;
      } else if (type === "month") {
        HistoryGameClient.instance().customRange.numStartMonth = value;
      } else if (type === "day") {
        HistoryGameClient.instance().customRange.numStartDay = value;
      }
    } else if (prefix == "end") {
      if (type === "year") {
        HistoryGameClient.instance().customRange.numEndYear = value;
      } else if (type === "month") {
        HistoryGameClient.instance().customRange.numEndMonth = value;
      } else if (type === "day") {
        HistoryGameClient.instance().customRange.numEndDay = value;
      }
    }
  }
};

const backToSelectionDate = () => {
  const calendar = document.getElementById("calendar-container");
  if (calendar) calendar.remove();

  HistoryGameClient.instance().fetchData();
};

export const submitCustomDate = () => {
  const calendar = document.getElementById("calendar-container");
  if (calendar) calendar.remove();
  showHideNodeById("selection-date");

  HistoryGameClient.instance().filterBy = FilterBy.Custom;
  HistoryGameClient.instance().page = DEFAULT_PAGE;
  HistoryGameClient.instance().fetchData();
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
  value: number,
  index: number
) => {
  const tooltip = document.getElementById("payout-tooltip");

  if (tooltip) {
    const classArray = Array.from(tooltip.classList);
    if (classArray.some((c) => c === `t-${index}`)) {
      tooltip?.remove();
    } else {
      tooltip?.remove();
      const payoutTooltip = document.createElement("div");
      payoutTooltip.id = "payout-tooltip";
      payoutTooltip.classList.add(`t-${index}`);

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
  } else {
    const payoutTooltip = document.createElement("div");
    payoutTooltip.id = "payout-tooltip";
    payoutTooltip.classList.add(`t-${index}`);

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
    renderCalendar();
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
  customRange: CustomDateRange;

  page: number;
  pageSize: number;

  static _instance = new HistoryGameClient();

  static instance(): HistoryGameClient {
    return HistoryGameClient._instance;
  }

  constructor() {
    this.recordTotal = null;
    this.histories = [];

    this.filterBy = FilterBy.Today;

    this.page = DEFAULT_PAGE;
    this.pageSize = DEFAULT_PAGESIZE;
    this.customRange = {
      numStartYear: getCurrentDateDetails().year,
      numStartMonth: getCurrentDateDetails().month,
      numStartDay: getCurrentDateDetails().date,
      numEndYear: getCurrentDateDetails().year,
      numEndMonth: getCurrentDateDetails().month,
      numEndDay: getCurrentDateDetails().date,
    };
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
    //prepare data
    const dateRange = calculateDateRange(this.filterBy, this.customRange);

    const baseQuery: QueryParams =parseQueryParams();

    const betUrl = (window as any)?._env_?.BET_URL ;
    const betTotalUrl = (window as any)?._env_?.BET_TOTAL_URL ;

    if(!baseQuery['gameCode'] || !betUrl || !betTotalUrl){
      return;
    }

    const url1 = `${betUrl}?${objectToQueryString(baseQuery)}&startDate=${
      dateRange.startDate
    }&endDate=${dateRange.endDate}&skip=${this.countSkip()}&limit=${
      this.pageSize
    }`;

    const url2 = `${betTotalUrl}?${objectToQueryString(baseQuery)}&startDate=${
      dateRange.startDate
    }&endDate=${dateRange.endDate}`;

    //loading
    showHideNodeById("loader-container", true, "flex");
    const historyTableBody = document.getElementById("history-table-body");
    historyTableBody?.replaceChildren("");

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

    this.fetchData();

    // //register event when window changes
    this.resizeComponent();
  };

  resizeComponent = () => {
    window.addEventListener("resize", resizeHistory);

    function resizeHistory() {
      const container = document.getElementById("Cocos3dGameContainer");
      const history = document.getElementById("game-history-overlay");
      if (
        container &&
        history &&
        container?.offsetWidth &&
        container.offsetHeight
      ) {
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;

        history.style.width = `${containerWidth}px`;
        history.style.height = `${containerHeight}px`;
      }
    }

    resizeHistory();
  };

   fetchStyle = (url: string) => {
    return new Promise<void>((resolve, reject) => {
      let link = document.createElement("link");
      link.type = "text/css";
      link.rel = "stylesheet";
      link.onload = () => resolve();
      link.onerror = () => reject();
      link.href = url;
  
      let headScript = document.querySelector("script");
      if (headScript && headScript.parentNode)
        headScript.parentNode.insertBefore(link, headScript);
    });
  };
}

export { HistoryGameClient, HistoryGameClient as default };
