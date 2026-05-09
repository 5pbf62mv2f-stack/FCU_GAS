### 情況一：複製別人的專案，變成自己的專案（使用 Fork 與 Upstream）
如果你是希望把別人的專案完整複製一份到自己的 GitHub/GitLab 帳號下，你可以修改代碼並 push 到你自己的帳號，同時又能隨時 pull 原作者的新進度。


**具體步驟：**

1. **Fork 專案**：在 GitHub 上，到別人的專案頁面右上角點擊 **Fork**。這會複製一份該專案到你的帳號下。
2. **Clone 你自己的專案**：將你帳號下 Fork 好的專案 Clone 到本地電腦。
```bash
git clone https://github.com/你的帳號/專案名稱.git


```
3. **設定上游來源（Upstream）**：進入專案資料夾後，將「原作者」的 repo 設定為上游來源，這樣你才能抓取他的更新。
```bash
cd 專案名稱
git remote add upstream https://github.com/roapple10/google-app-script-course.git

```
4. **抓取原作者更新（Pull）**：當原作者有更新時，你可以把更新拉下來合併到你的代碼中。
```bash
git pull upstream main # 假設主分支叫做 main  第一次要做

git pull  # 第二次之後

```
5. **更新並推送到自己的 Repo（Push）**：你修改完檔案後，按照正常流程 commit 並 push。這會推送到**你自己的 repo**，不會影響原作者。
```bash
git add .
git commit -m "更新了某些功能"
git push origin main

```

git add .; git commit -m "Update"; git push


### 情況二：在你現有的專案資料夾內，嵌入別人的專案（使用 Git Submodule）
如果你的意思是，你已經有一個正在開發的 Repo A，你想把別人的 Repo B 下載到 Repo A 裡
面當作一個子資料夾（例如引入別人的函式庫或 UI 套件）。
這時候**不建議直接在裡面用 git clone**，因為 Git 會造成巢狀衝突（外層的 Git 沒辦法好好追蹤內層的 Git）。你應該使用的是 **Git Submodule（子模組）**。
**具體步驟：**
1. **新增子模組**：在你的專案目錄下執行以下指令。
```bash
git submodule add https://github.com/別人/他的專案.git 路徑/資料夾名稱

```
2. **抓取原作者更新（Pull）**：當你想更新這個別人專案的內容時。
```bash
git submodule update --remote

```
3. **推送到你的 Repo（Push）**：你的主專案（Repo A）只會紀錄「這個子模組目前停在哪個 commit 版本」。所以當你修改了主專案的其他檔案，或是更新了子模組的版本後，你一樣可以正常推送到你的 repo：
```bash
git add .
git commit -m "更新了專案檔案與子模組版本"
git push

```
** 關鍵注意事項（情況二）：**
如果你不只想要 pull 別人的代碼，你還想要**修改子模組裡面的檔案並且 push**，那你必須擁有那個子模組 Repo 的寫入權限。如果那是別人的 repo，你一定推不上去。
**解法**：先把別人的 repo **Fork** 到你的帳號下，然後把你的專案裡的 submodule 網址，指向 **你 Fork 出來的那份 repo**。這樣你就可以在子資料夾裡面自由修改並 push 了！
```

``` 
