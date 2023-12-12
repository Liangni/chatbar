# ChatBar 聊聊吧!
一個讓使用者能在網路上認識新朋友的即時通訊網站。
體驗部署在**AWS EC2**的應用程式，請至http://35.78.245.88:3000/

![image](/readme-materials/group_messages.png)

## 服務架構
![image](/readme-materials/flowchart-1.png)

## 特色功能
### :star2: 即時聊天
使用者可以加入**群組聊天室**進行多人聊天，或與其他使用者互加好友後發送**私人訊息**給對方。訊息格式支援：**文字、檔案、與圖片**。
<br/>
![image](/readme-materials/send_messages.gif)

### :star2: 查看其他使用者在線/離線狀態
使用者可以即時查看群組聊天室其他成員、私人訊息聊天對象、或全站使用者的在線/離線狀態。
<br/>
![image](/readme-materials/show_online_status.gif)

### :star2: 依條件搜尋想聊天的對象
使用者可以在**誰也在用**的功能中，用條件搜尋想聊天的對象。
<br/>
![image](/readme-materials/filter_users.gif)

## 測試帳號
* user1, 密碼: 12345678
* user2, 密碼: 12345678
* user3, 密碼: 12345678

## 主要開發工具
* **Node.js:** 開發環境
* **Express.js:** 開發框架
* **MySQL:** 主要資料庫
* **Redis:** 記憶使用者在線狀態之資料庫
* **Passport.js:** 實現登入登出、權限認證所使用的套件
* **Socket.io:** 實現即時通訊所使用的套件
* **AWS S3:** 第三方檔案儲存服務，用來儲存使用者聊天時傳送的檔案和圖片

## 部署
* **AWS EC2:** 雲端上的虛擬機器，用以部署 chatbar 服務
* **Docker:** 以 docker-compose 串連多個容器，共同運行服務 

## 專案安裝
1. 下載專案
```
git clone https://github.com/Liangni/chatbar.git
```

2. 切換存放此專案資料夾
```
cd chatbar
```

3. 安裝npm套件
```
npm install
```

4. 建立.env 檔，並參考.env.example輸入環境變數
```
touch .env
```

5. 創建資料庫
```
npx sequelize db:drop
npx sequelize db:create
```

6. 建立 migration
```
npx sequelize db:migrate
```

7. 建立 seeder
```
npx sequelize db:seed:all
```

8. 啟動伺服器執行檔案
```
npm run dev
```

9. 出現以下字樣表示啟動成功!
```
App is running on port 3000!
```



