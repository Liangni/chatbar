# ChatBar 聊聊吧
一個讓使用者能在網路上認識新朋友的即時通訊網站。
體驗部署在**Heroku**的應用程式，請至https://chatbar-fullstack.herokuapp.com/

![image](/public/image/group_messages.png)

## 特色功能
### 即時聊天
使用者可以加入**群組聊天室**進行多人聊天，也可以在加其他使用者好又後發送**私人訊息**給對方，除了文字訊息，還可以發送檔案和圖片。
<br/>
![image](/public/image/send_messages.gif)

### 查看其他使用者登入狀態
使用者可以即時查看群組聊天室其他成員、私人訊息聊天對象、或全站使用者的登入狀態。
<br/>
![image](/public/image/show_online_status.gif)

### 依條件搜尋想聊天的對象
使用者可以在**誰也在用**的功能中，用條件搜尋想聊天的對象。
<br/>
![image](/public/image/filter_users.gif)

## 測試帳號
* user1, 密碼: 12345678
* user2, 密碼: 12345678
* user3, 密碼: 12345678

## 開發工具
* **Node.js:** 開發環境
* **Express.js:** 伺服器開發框架
* **MySQL:** 關聯式資料庫工具
* **Passport.js:** 實現登入登出、權限認證所使用的套件
* **Socket.io:** 實現即時通訊所使用的套件
* **Firebase Storage:** 第三方儲存工具，用來儲存使用者傳送的檔案和圖片
* **Firebase Admin:** 搭配Firebase Storage的權限管理工具

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
create database chatbar_workspace;
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


