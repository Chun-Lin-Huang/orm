require('dotenv').config(); 

const { Sequelize, DataTypes } = require('sequelize');

// 從 .env 取得連線參數
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'mariadb',
    logging: false,
  }
);

// 封裝初始化邏輯為 Promise（供主程式等待）
const syncPromise = (async () => {
  try {
    await sequelize.authenticate();
    console.log('資料庫連線成功！');

    await sequelize.sync();
    console.log('模型同步成功！');
  } catch (error) {
    console.error('資料庫連線或模型同步失敗：', error);
    throw error;
  }
})();

module.exports = { sequelize, DataTypes, syncPromise };