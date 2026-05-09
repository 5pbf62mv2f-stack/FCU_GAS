// ============================================================
// Session 3：SpreadsheetApp 基本操作
// 日期：115/05/09（六）09:00~12:00
// 講師：林冠廷
// ============================================================
// 本課程涵蓋：
//   1. Apps Script 介面深入
//   2. SpreadsheetApp 基本操作
//   3. 建立／開啟試算表
//   4. 觸發器應用（自動開啟／時間觸發）
//   5. 實作：自動建立新工作表
// ============================================================

// ============================================================
// 第一部分：SpreadsheetApp 基本操作
// ============================================================

/**
 * SpreadsheetApp 常用方法總覽
 * 說明：示範如何操作試算表、工作表、儲存格
 */
function SpreadsheetApp基本操作() {
  // --- 取得試算表 ---

  // 方法 1：取得「目前開啟」的試算表（最常用）
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  Logger.log("試算表名稱：" + ss.getName());
  Logger.log("試算表 ID：" + ss.getId());
  Logger.log("試算表 URL：" + ss.getUrl());

  // --- 取得工作表 (Sheet) ---

  // 方法 1：依名稱取得
  var sheet = ss.getSheetByName("員工資料");
  if (sheet) {
    Logger.log("找到工作表：" + sheet.getName());
  } else {
    Logger.log("找不到「員工資料」工作表");
  }

  // 方法 2：取得所有工作表
  var 所有工作表 = ss.getSheets();
  Logger.log("工作表數量：" + 所有工作表.length);
  for (var i = 0; i < 所有工作表.length; i++) {
    Logger.log("  - " + 所有工作表[i].getName());
  }

  // 方法 3：取得目前作用中的工作表
  var 目前工作表 = ss.getActiveSheet();
  Logger.log("目前工作表：" + 目前工作表.getName());
}

/**
 * 工作表基本資訊讀取
 */
function 讀取工作表資訊() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("員工資料");

  if (!sheet) {
    Logger.log("❌ 找不到「員工資料」，請先執行初始化");
    return;
  }

  // 取得工作表的基本資訊
  Logger.log("===== 工作表資訊 =====");
  Logger.log("最後一列（有資料）：" + sheet.getLastRow());
  Logger.log("最後一欄（有資料）：" + sheet.getLastColumn());
  Logger.log("列數上限：" + sheet.getMaxRows());
  Logger.log("欄數上限：" + sheet.getMaxColumns());

  // 取得所有有資料的範圍
  var 資料範圍 = sheet.getDataRange();
  Logger.log("資料範圍：" + 資料範圍.getA1Notation()); // e.g. "A1:F11"
}

// ============================================================
// 第二部分：建立與管理工作表
// ============================================================

/**
 * 示範建立新工作表的各種方式
 */
function 建立工作表示範() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  try {
    // 方式 1：建立空白工作表（自動命名）
    var 新表1 = ss.insertSheet();
    Logger.log("建立新表：" + 新表1.getName());

    // 方式 2：指定名稱建立
    var 表名 = "測試工作表_" + new Date().getTime();
    var 新表2 = ss.insertSheet(表名);
    Logger.log("建立新表：" + 新表2.getName());

    // 方式 3：在指定位置插入（第 1 個位置）
    var 新表3 = ss.insertSheet("置頂工作表", 0);
    Logger.log("建立新表（置頂）：" + 新表3.getName());

    // 清理：刪除剛建立的測試工作表
    ss.deleteSheet(新表1);
    ss.deleteSheet(新表2);
    ss.deleteSheet(新表3);
    Logger.log("✅ 測試工作表已清理");
  } catch (錯誤) {
    Logger.log("❌ 錯誤：" + 錯誤.message);
  }
}

/**
 * 自動建立每週報表工作表
 * 說明：建立當週的工作表（含標題與格式）
 */
function 自動建立週報表() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var 員工表 = ss.getSheetByName("員工資料");
    
    if (!員工表) {
      SpreadsheetApp.getUi().alert("❌ 找不到「員工資料」工作表，請先點選「初始化員工資料」。");
      return;
    }

    // 1. 取得員工基本資料 (用來當作負責人)
    var 最後一列 = 員工表.getLastRow();
    if (最後一列 < 2) {
      SpreadsheetApp.getUi().alert("⚠️ 員工資料中沒有數據。");
      return;
    }
    // 取得資料 (姓名在第 1 欄)
    var 員工原始資料 = 員工表.getRange(2, 1, 最後一列 - 1, 1).getValues();

    // 2. 準備新工作表
    var 今天 = new Date();
    var 格式化日期 = Utilities.formatDate(今天, ss.getSpreadsheetTimeZone(), "MMdd");
    var 表名 = "週報表_" + 格式化日期;

    // 檢查工作表是否已存在
    var 既有表 = ss.getSheetByName(表名);
    if (既有表) {
      SpreadsheetApp.getUi().alert("⚠️ 「" + 表名 + "」已存在，請先刪除舊表或更名。");
      return;
    }

    var 新表 = ss.insertSheet(表名);

    // 3. 設定標題列與格式
    // 欄位：日期、事項、負責人、進度(%)
    var 標題 = [["日期", "事項", "負責人", "進度(%)"]];
    新表.getRange("A1:D1").setValues(標題);
    
    var 標題範圍 = 新表.getRange("A1:D1");
    標題範圍.setBackground("#34a853").setFontColor("#ffffff").setFontWeight("bold").setHorizontalAlignment("center");

    // 4. 準備並寫入報表內容
    var 報表內容 = [];
    var 今天字串 = Utilities.formatDate(今天, ss.getSpreadsheetTimeZone(), "yyyy/MM/dd");
    
    for (var i = 0; i < 員工原始資料.length; i++) {
      var 姓名 = 員工原始資料[i][0];
      // 預設填入當天日期、空白事項、負責人姓名、進度 0
      報表內容.push([今天字串, "", 姓名, 0]);
    }

    // 寫入所有資料
    新表.getRange(2, 1, 報表內容.length, 4).setValues(報表內容);

    // 5. 最後修飾
    新表.setFrozenRows(1); // 凍結首列
    
    for (var j = 1; j <= 4; j++) {
      新表.autoResizeColumn(j);
      var 目前寬度 = 新表.getColumnWidth(j);
      新表.setColumnWidth(j, 目前寬度 + 30); // 增加 30 像素緩衝
    }

    Logger.log("✅ 「" + 表名 + "」建立完成，共計 " + 報表內容.length + " 筆任務。");
    SpreadsheetApp.getUi().alert("✅ 「" + 表名 + "」建立完成！");

  } catch (錯誤) {
    Logger.log("❌ 錯誤：" + 錯誤.message);
    SpreadsheetApp.getUi().alert("❌ 錯誤：" + 錯誤.message);
  }
}

/**
 * 練習 2：工作表複製
 * 說明：將「員工資料」工作表複製一份，命名為「員工資料_備份_日期」
 */
function 備份員工資料() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var 員工表 = ss.getSheetByName("員工資料");
    
    if (!員工表) {
      SpreadsheetApp.getUi().alert("❌ 找不到「員工資料」工作表！");
      return;
    }

    var 今天 = new Date();
    var 格式化日期 = Utilities.formatDate(今天, ss.getSpreadsheetTimeZone(), "yyyyMMdd");
    var 表名 = "員工資料_備份_" + 格式化日期;

    // 檢查是否已存在同名備份
    var 既有表 = ss.getSheetByName(表名);
    if (既有表) {
      SpreadsheetApp.getUi().alert("⚠️ 「" + 表名 + "」已存在，請先刪除舊備份。");
      return;
    }

    // 複製工作表
    var 備份表 = 員工表.copyTo(ss);
    備份表.setName(表名);

    Logger.log("✅ 「員工資料」已成功備份為 「" + 表名 + "」。");
    SpreadsheetApp.getUi().alert("✅ 「員工資料」已成功備份為 「" + 表名 + "」！");

  } catch (錯誤) {
    Logger.log("❌ 錯誤：" + 錯誤.message);
    SpreadsheetApp.getUi().alert("❌ 錯誤：" + 錯誤.message);
  }
}

/**
 * 練習 3：跨工作表複製
 * 說明：將「員工資料」工作表的資料複製到「資料備份處」工作表的指定位置（例如 B2）
 */
function 跨工作表複製() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var 來源表 = ss.getSheetByName("員工資料");
    
    if (!來源表) {
      SpreadsheetApp.getUi().alert("❌ 找不到來源工作表「員工資料」！");
      return;
    }

    // 建立或取得目標工作表
    var 目標表名 = "資料備份處";
    var 目標表 = ss.getSheetByName(目標表名);
    if (!目標表) {
      目標表 = ss.insertSheet(目標表名);
    } else {
      // 如果存在，先清空舊資料以利示範
      目標表.clear();
    }

    // 取得來源資料範圍（假設複製整張表的有資料區域）
    var 最後一列 = 來源表.getLastRow();
    var 最後一欄 = 來源表.getLastColumn();
    var 來源範圍 = 來源表.getRange(1, 1, 最後一列, 最後一欄);

    // 指定目標位置（例如：從 B2 開始）
    var 目標範圍 = 目標表.getRange(2, 2, 最後一列, 最後一欄);

    // 執行複製 (包含資料與格式)
    來源範圍.copyTo(目標範圍);

    Logger.log("✅ 資料已成功從「員工資料」複製到「" + 目標表名 + "」的 B2 位置。");
    SpreadsheetApp.getUi().alert("✅ 資料已成功複製到「" + 目標表名 + "」的 B2 位置！");

  } catch (錯誤) {
    Logger.log("❌ 錯誤：" + 錯誤.message);
    SpreadsheetApp.getUi().alert("❌ 錯誤：" + 錯誤.message);
  }
}

// ============================================================
// 第三部分：讀寫儲存格
// ============================================================

/**
 * 示範讀取與寫入儲存格
 */
function 讀寫儲存格示範() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("員工資料");
  if (!sheet) {
    SpreadsheetApp.getUi().alert("❌ 找不到「員工資料」");
    return;
  }

  // --- 讀取單一儲存格 ---
  var A1值 = sheet.getRange("A1").getValue();
  Logger.log("A1 的值：" + A1值);

  // --- 讀取範圍 ---
  var 範圍值 = sheet.getRange("A1:C3").getValues();
  Logger.log("A1:C3 的值：" + JSON.stringify(範圍值));

  // --- 寫入 11 筆資料（一次寫入多欄多列） ---
  var 現在時間 = "2026/5/9"; // Hardcode 固定時間示範
  
  var 示範資料 = [
    ["更新時間", "加班時數"],   // 第 1 筆：標題
    [現在時間, 8],              // 第 2 筆
    [現在時間, 4],              // 第 3 筆
    [現在時間, 12],             // 第 4 筆
    [現在時間, 0],              // 第 5 筆
    [現在時間, 6],              // 第 6 筆
    [現在時間, 10],             // 第 7 筆
    [現在時間, 2],              // 第 8 筆
    [現在時間, 5],              // 第 9 筆
    [現在時間, 9],              // 第 10 筆
    [現在時間, 3]               // 第 11 筆
  ];

  // 使用 setValues 一次寫入 11 列、2 欄 (範圍從 H1 開始，即第 1 列、第 8 欄)
  sheet.getRange(1, 8, 11, 2).setValues(示範資料);
  
  // 自動調整欄寬以符合時間字串長度
  // 自動調整欄寬並增加緩衝空間
  sheet.autoResizeColumn(8);
  var 欄寬8 = sheet.getColumnWidth(8);
  sheet.setColumnWidth(8, 欄寬8 + 30);

  Logger.log("✅ 讀寫示範完成，已寫入 11 筆資料（包含當前格式化時間：" + 現在時間 + "）");
}

// ============================================================
// 第四部分：觸發器進階 — 時間觸發
// ============================================================

/**
 * 手動設定時間觸發器
 * 說明：每天早上 9 點自動執行「每日報告」函數
 */
function 設定每日觸發器() {
  // 先刪除既有的相同觸發器（避免重複）
  var 觸發器列表 = ScriptApp.getProjectTriggers();
  for (var i = 0; i < 觸發器列表.length; i++) {
    if (觸發器列表[i].getHandlerFunction() === "每日自動報告") {
      ScriptApp.deleteTrigger(觸發器列表[i]);
      Logger.log("已刪除舊的觸發器");
    }
  }

  // 建立新的時間觸發器：每天 9~10 點之間執行
  ScriptApp.newTrigger("每日自動報告")
    .timeBased()
    .everyDays(1) // 每天
    .atHour(9) // 早上 9 點
    .create();

  Logger.log("✅ 每日觸發器已設定（9:00~10:00）");
  SpreadsheetApp.getUi().alert(
    "✅ 每日觸發器已設定！\n每天 9:00~10:00 會自動執行。",
  );
}

/**
 * 被觸發器呼叫的函數
 * 說明：自動記錄每日報告資訊到「每日紀錄」工作表
 */
function 每日自動報告() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("每日紀錄");

    // 如果「每日紀錄」不存在，自動建立
    if (!sheet) {
      sheet = ss.insertSheet("每日紀錄");
      sheet.getRange("A1:D1").setValues([["日期", "時間", "事件", "狀態"]]);
      sheet.getRange("A1:D1").setBackground("#fbbc04").setFontWeight("bold");
    }

    // 寫入紀錄
    var 新列 = sheet.getLastRow() + 1;
    var 現在 = new Date();

    sheet
      .getRange(新列, 1)
      .setValue(Utilities.formatDate(現在, "Asia/Taipei", "yyyy/MM/dd"));
    sheet
      .getRange(新列, 2)
      .setValue(Utilities.formatDate(現在, "Asia/Taipei", "HH:mm:ss"));
    sheet.getRange(新列, 3).setValue("每日自動報告已執行");
    sheet.getRange(新列, 4).setValue("✅ 正常");

    Logger.log("✅ 每日報告已記錄：" + 現在);
  } catch (錯誤) {
    Logger.log("❌ 每日報告錯誤：" + 錯誤.message);
  }
}

/**
 * 刪除所有觸發器
 * 說明：方便清理測試時建立的觸發器
 */
function 刪除所有觸發器() {
  var 觸發器列表 = ScriptApp.getProjectTriggers();
  for (var i = 0; i < 觸發器列表.length; i++) {
    ScriptApp.deleteTrigger(觸發器列表[i]);
  }
  Logger.log("✅ 已刪除 " + 觸發器列表.length + " 個觸發器");
  SpreadsheetApp.getUi().alert("✅ 已刪除 " + 觸發器列表.length + " 個觸發器");
}

// ============================================================
// 初始化範例資料
// ============================================================

/**
 * 建立「員工資料」工作表與範例資料
 */
function 初始化員工資料() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("員工資料");

  if (!sheet) {
    sheet = ss.insertSheet("員工資料");
  } else {
    sheet.clear();
  }

  var 標題 = [["姓名", "部門", "職稱", "到職日", "月薪", "電話", "Email"]];
  var 資料 = [
    [
      "王小明",
      "業務部",
      "業務專員",
      "2023/03/15",
      38000,
      "0912-345-678",
      "wang@example.com",
    ],
    [
      "李小華",
      "行銷部",
      "行銷主管",
      "2021/08/01",
      52000,
      "0923-456-789",
      "lee@example.com",
    ],
    [
      "張美玲",
      "人資部",
      "人資專員",
      "2022/11/20",
      40000,
      "0934-567-890",
      "chang@example.com",
    ],
    [
      "陳大文",
      "研發部",
      "工程師",
      "2024/01/10",
      55000,
      "0945-678-901",
      "chen@example.com",
    ],
    [
      "林小芬",
      "財務部",
      "會計",
      "2020/06/15",
      42000,
      "0956-789-012",
      "lin@example.com",
    ],
    [
      "黃志偉",
      "業務部",
      "業務主管",
      "2019/04/01",
      58000,
      "0967-890-123",
      "huang@example.com",
    ],
    [
      "劉家豪",
      "研發部",
      "資深工程師",
      "2018/09/10",
      68000,
      "0978-901-234",
      "liu@example.com",
    ],
    [
      "吳雅琪",
      "行銷部",
      "行銷專員",
      "2023/07/20",
      36000,
      "0989-012-345",
      "wu@example.com",
    ],
    [
      "周建國",
      "業務部",
      "業務專員",
      "2024/03/01",
      35000,
      "0911-123-456",
      "chou@example.com",
    ],
    [
      "許文馨",
      "人資部",
      "人資主管",
      "2020/01/15",
      56000,
      "0922-234-567",
      "hsu@example.com",
    ],
  ];

  sheet.getRange(1, 1, 1, 7).setValues(標題);
  sheet.getRange(2, 1, 資料.length, 7).setValues(資料);

  // 格式化
  var 標題範圍 = sheet.getRange("A1:G1");
  標題範圍.setBackground("#4285f4");
  標題範圍.setFontColor("#ffffff");
  標題範圍.setFontWeight("bold");
  標題範圍.setHorizontalAlignment("center");
  sheet.setFrozenRows(1);

  // 薪資欄格式
  sheet.getRange("E2:E11").setNumberFormat("#,##0");

  for (var i = 1; i <= 7; i++) {
    sheet.autoResizeColumn(i);
    var 目前寬度 = sheet.getColumnWidth(i);
    sheet.setColumnWidth(i, 目前寬度 + 30); // 增加 30 像素緩衝
  }

  Logger.log("✅ 員工資料已建立！");
  SpreadsheetApp.getUi().alert("✅ 員工資料已建立！共 " + 資料.length + " 筆");
}

// ============================================================
// 自訂選單
// ============================================================

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("📚 Session 3 工具")
    .addItem("👥 初始化員工資料", "初始化員工資料")
    .addItem("📋 SpreadsheetApp 基本操作", "SpreadsheetApp基本操作")
    .addItem("📊 讀取工作表資訊", "讀取工作表資訊")
    .addItem("📝 讀寫儲存格示範", "讀寫儲存格示範")
    .addSeparator()
    .addItem("📅 建立週報表", "自動建立週報表")
    .addItem("💾 備份員工資料", "備份員工資料")
    .addItem("📁 跨工作表複製", "跨工作表複製")
    .addItem("⏰ 設定每日觸發器", "設定每日觸發器")
    .addItem("🗑️ 刪除所有觸發器", "刪除所有觸發器")
    .addToUi();
}
