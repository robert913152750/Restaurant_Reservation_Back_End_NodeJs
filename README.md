## Stop Waiting 餐廳訂位網－後端伺服器
還在為了美食排隊等待？ 聚會時總有人看著菜單猶豫不決？ 利用 S.W. 訂位網，事先訂位並決定好餐點，不需再為了美食等待，人數到齊立即上菜用餐，節省您的寶貴時間。

---
### 相關連結
+ 開發過程與心得: [透過side-project體驗從0-1的產品開發過程](https://reurl.cc/EzD42n) 
+ 後端專案: [Github連結](https://github.com/robert913152750/Restaurant_Reservation_Back_End_NodeJs)
+ 後端API: [Heroku連結](https://restaurant-reservation-10720.herokuapp.com/api/home)
+ 前端專案: [Github連結](https://github.com/marcho001/reservations-front-end-vue)
+ 前端Github-Page:[Github-Page連結](https://marcho001.github.io/reservations-front-end-vue/#/home)

---
### 專案內容
此專案為專屬於美食的平台，為消費者帶來兼具推薦、評論和訂餐等一系列的體驗，不僅可以利用篩選功能快速篩選出所在地的美食種類，也能在各餐廳的專屬網頁下進行互動；而對商家來說，此專案解決了高昂的客制網站費用的問題，能運用相對低的價格，完成訊息公告、訂位點餐等一連串餐廳網站所需含括的功能，以下是我們針對消費者和商家所能提供的價值和使用者故事:

為消費者帶來的價值：
+ 不論到哪裡都能用網站看看當地所擁有的美食和評價，並能立即看到商家所發出的優惠或互動訊息
+ 看到喜歡的餐廳後能夠立即進行訂位、點餐和付費，為消費者省下大量的等待時間
  
為商家帶來的價值：
+ 涵蓋電商平台與社群軟體的功能，省去客製化網站的高昂費用
+ 不像一般社群軟體（如：FB粉專）擁有各行各業的龐雜資訊，此網站專注於美食，已針對網站的瀏覽客群進行第一步的篩選，讓商家能針對自家的小眾客群做更進一步的精準行銷，不在讓自家小編辛苦編輯的行銷文流失在茫茫的資訊流中，大大降低商家在行銷費用上的預算

消費者端的使用者故事:
+ 消費者能夠瀏覽全部的餐廳
+ 消費者能夠根據所在區域篩選出當地的餐廳
+ 消費者能夠夠查看單一廳的頁面
+ 消費者能夠在網站上即時進行點餐
+ 消費者能夠用第三方金流服務進行付款
+ 消費者能夠對餐廳進行評論
+ 消費者能夠收藏喜愛的餐廳 (待更新)
+ 消費者能夠對商家所發布的公告進行留言 (待更新)
+ 消費者能夠查看所追蹤餐廳的動態消息 (待更新)
  
商家端的使用者故事: 
+ 商家能夠建立屬於自己的餐廳頁面
+ 商家能夠隨時編輯自己的餐廳頁面
+ 商家能夠建立餐廳的菜單
+ 商家能夠依當日食材狀況對單一菜色進行即時的上下架處理
+ 商家能夠建立新的公告(如優惠、店休、徵才、互動文等) (待更新)
+ 商家能夠在建立新公告時即時對追蹤者發出提醒 (待更新)
+ 商家能夠取得餐廳的圖表營利分析 (待更新)
  
### 如何使用
此處為網站的伺服器端專案，無法看到前端的UI介面，前端程式碼請至[前端專案](https://github.com/marcho001/reservations-front-end-vue)查看，若想體驗此網站的服務內容請至[前端Github-Page](https://marcho001.github.io/reservations-front-end-vue/#/home)，測試資訊如下:

```
一般使用者
帳號：
  user1@example.com,
  user2@example.com
密碼：
  12345678
```

```
餐廳廠商
帳號：
  user3@example.com,
  user4@example.com
密碼：
  12345678
```
```
測試信用卡：
卡號：4000-2211-1111-1111
日期：當月以後任何時間
末三碼：隨意三位數
```

### 專案下載與安裝
下載專案
```
git clone https://github.com/robert913152750/Restaurant_Reservation_Back_End_NodeJs.git
```
安裝Package
```
npm install
```
建立 MySQL Connection(請在 WorkBench 裡操作 SQL 指令)
預設密碼為 password

```
drop database if exists restaurant_reservation;
create database restaurant_reservation;
use restaurant_reservation;
```
建立 Table & Schema (請於對應路徑的Terminal內執行此指令)
```
npx sequelize db:migrate
```
建立 Seeder (請於對應路徑的Terminal內執行此指令)
```
npx sequelize db:seed:all

```
啟動專案
```
//一般啟動
node app.js 

//若有安裝nodemon可用此指令啟動
npm run dev 

```
出現app is running 即表示開啟成功
### 使用的套件
```
  "bcryptjs": "^2.4.3",
  "body-parser": "^1.19.0",
  "cors": "^2.8.5",
  "dotenv": "^8.2.0",
  "express": "^4.17.1",
  "faker": "^5.1.0",
  "imgur-node-api": "^0.1.0",
  "jsonwebtoken": "^8.5.1",
  "moment": "^2.29.1",
  "multer": "^1.4.2",
  "mysql2": "^2.2.5",
  "passport": "^0.4.1",
  "passport-jwt": "^4.0.0",
  "pg": "^8.4.0",
  "sequelize": "^6.3.5",
  "sequelize-cli": "^6.2.0"
```
 ### 開發者
 - Front-End: [Marc](https://github.com/marcho001)
 - Back-End: [Robert](https://github.com/robert913152750)

