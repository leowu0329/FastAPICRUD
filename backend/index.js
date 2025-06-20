require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const winston = require('winston');

// 配置 winston 日誌
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  );
}

const port = process.env.PORT || 5000;

// 連接數據庫
connectDB();

// 啟動服務器
app.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`);
});
