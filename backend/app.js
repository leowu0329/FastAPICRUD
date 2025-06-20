require('dotenv').config();
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const morgan = require('morgan');
const winston = require('winston');
const caseRoutes = require('./routes/cases');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

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

const app = express();

// 安全 HTTP 頭部
app.use(helmet());

// 啟用 CORS
const allowedOrigins = [
  process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL
    : 'http://localhost:5173',
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400, // 24 小時
};
app.use(cors(corsOptions));

// 配置 morgan 日誌
morgan.token('body', (req) => JSON.stringify(req.body));
morgan.token('response-time', (req, res) => {
  if (!res._header || !req._startAt) return '';
  const diff = process.hrtime(req._startAt);
  const time = diff[0] * 1e3 + diff[1] * 1e-6;
  return time.toFixed(2);
});

const morganFormat =
  ':remote-addr - :method :url :status :response-time ms - :res[content-length] - :body';
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        logger.info(message.trim());
      },
    },
  }),
);

// 測試路由
app.get('/', (req, res) => {
  logger.info('Test endpoint accessed');
  res.send('backend Test OK');
});

// 解析 JSON 請求體
app.use(express.json());

// 限制請求速率
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分鐘
  max: 100, // 限制每個 IP 在 windowMs 內最多 100 個請求
  message: '請求次數過多，請稍後再試',
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      status: 'error',
      message: '請求次數過多，請稍後再試',
    });
  },
});
app.use('/api', limiter);

// 防止 NoSQL 注入
app.use(mongoSanitize());

// 防止 XSS 攻擊
app.use(xss());

// 防止 HTTP 參數污染
app.use(hpp());

// 解析 JSON 請求體
app.use(express.json({ limit: '10kb' })); // 限制請求體大小

// API 路由
app.use('/api/cases', caseRoutes);

// 處理未找到的路由
app.use(notFoundHandler);

// 錯誤處理中間件
app.use((err, req, res, next) => {
  logger.error(
    `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
      req.method
    } - ${req.ip}`,
  );
  errorHandler(err, req, res, next);
});

module.exports = app;
