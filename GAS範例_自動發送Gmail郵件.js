/**
 * 原始檔案連結
 *
 * https://hackmd.io/@BASHCAT/Ska83Pkulx?stext=2158%3A1909%3A0%3A1778894559%3A6sWcDy
 * 自動發送 Gmail 郵件
 * 功能：從 Google Sheets 讀取收件人資料，發送個人化郵件
 */
function sendAutomatedEmails() {
    // 開啟指定的 Google Sheets
    const spreadsheetId = 'YOUR_SPREADSHEET_ID';
    const sheet = SpreadsheetApp.openById(spreadsheetId).getActiveSheet();

    // 取得資料範圍（假設 A 欄是姓名，B 欄是郵件地址，C 欄是狀態）
    const dataRange = sheet.getRange('A2:C');
    const data = dataRange.getValues();

    // 郵件模板設定
    const emailTemplate = {
        subject: '感謝您的支持 - 個人化通知',
        htmlBody: `
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h2 style="color: #4285f4;">親愛的 {{name}}，</h2>
        <p>感謝您一直以來的支持！</p>
        <p>這是一封透過 Google Apps Script 自動發送的個人化郵件。</p>
        <hr>
        <p style="color: #666; font-size: 12px;">
          此郵件由系統自動發送，請勿直接回覆。
        </p>
      </div>
    `
    };

    // 遍歷每一列資料
    data.forEach((row, index) => {
        const [name, email, status] = row;

        // 檢查是否已發送（避免重複發送）
        if (status !== '已發送' && email && name) {
            try {
                // 替換郵件模板中的個人化內容
                const personalizedBody = emailTemplate.htmlBody.replace('{{name}}', name);

                // 發送郵件
                GmailApp.sendEmail(
                    email,
                    emailTemplate.subject,
                    '', // 純文字內容（可為空）
                    {
                        htmlBody: personalizedBody,
                        name: '您的名稱或公司名稱' // 寄件者顯示名稱
                    }
                );

                // 更新狀態為已發送
                sheet.getRange(index + 2, 3).setValue('已發送');
                console.log(`郵件已發送給：${name} (${email})`);

                // 加入延遲避免觸發 Gmail 限制
                Utilities.sleep(1000);

            } catch (error) {
                console.error(`發送郵件給 ${name} 時出錯：`, error);
                sheet.getRange(index + 2, 3).setValue('發送失敗');
            }
        }
    });

    console.log('批量郵件發送完成！');
}

/**
 * 設定定時觸發器
 * 每天上午 9 點自動執行郵件發送
 */
function createEmailTrigger() {
    ScriptApp.newTrigger('sendAutomatedEmails')
        .timeBased()
        .everyDays(1)
        .atHour(9)
        .create();
}
