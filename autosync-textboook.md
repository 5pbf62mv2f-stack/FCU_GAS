Zsh 自動化指令設定 SOP (以 sync-gas 為例)
本文件說明如何在 Mac 終端機設定自定義快捷指令，以簡化重複性的 Git 同步流程。

步驟 1：編輯設定檔
Zsh 的設定存放在家目錄下的 .zshrc 檔案中。

開啟終端機。
使用文字編輯器（如 VS Code 或 nano）開啟檔案：
zsh
# 使用 VS Code 開啟 (如果已安裝 code 指令)
code ~/.zshrc
# 或者使用內建的 nano 編輯器
nano ~/.zshrc
步驟 2：加入自定義指令 (Alias)
將以下程式碼貼在檔案的最後面：

zsh
# GAS 專案自動同步指令
alias sync-gas='git pull origin main && git pull upstream main -X ours && git add . && git commit -m "Auto sync: $(date +%Y-%m-%d)" && git push origin main'
TIP

指令解析：這個指令會依序執行「拉取自己倉庫」、「拉取課程倉庫（衝突時以我為主）」、「自動提交並記錄日期」以及「推送到自己的倉庫」。

步驟 3：重新載入設定
存檔並關閉編輯器後，需要告訴終端機讀取新的設定：

zsh
source ~/.zshrc
步驟 4：驗證設定
輸入以下指令檢查 sync-gas 是否已成功加入清單：

zsh
alias
確認輸出中包含 sync-gas='...' 的字樣。

步驟 5：執行指令
日後當你需要同步 GAS 專案時，只需在該專案資料夾下輸入：

zsh
sync-gas
常見問題排查 (Q&A)
Q1：為什麼輸入 source ~/.zshrc 後沒有任何訊息？
A：這是正常的。在 Unix/Linux 系統中，沒有訊息通常代表指令成功執行。

Q2：出現 zsh: command not found: .zshrc？
A：這是因為你漏掉了 source。請確保指令是 source ~/.zshrc 而不是直接輸入檔案名稱。

Q3：設定後，換一個新的分頁或視窗還能用嗎？
A：可以。寫在 .zshrc 裡的設定會在每次開啟新視窗時自動載入。
