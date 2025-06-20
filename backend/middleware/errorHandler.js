const { validationResult } = require('express-validator');

// 自定義錯誤類
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// 處理 MongoDB 重複鍵錯誤
const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const message = `重複的 ${field} 值: ${err.keyValue[field]}`;
  return new AppError(message, 400);
};

// 處理 MongoDB 驗證錯誤
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `無效的輸入數據: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

// 處理 MongoDB Cast 錯誤（無效的 ID 等）
const handleCastError = (err) => {
  const message = `無效的 ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

// 處理驗證錯誤
const handleValidationResultError = (errors) => {
  const message = errors
    .array()
    .map((err) => `${err.msg}`)
    .join(', ');
  return new AppError(message, 400);
};

// 驗證請求中間件
const validateRequest = (validations) => {
  return async (req, res, next) => {
    try {
      await Promise.all(validations.map((validation) => validation.run(req)));

      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }

      return next(handleValidationResultError(errors));
    } catch (error) {
      next(error);
    }
  };
};

// 開發環境錯誤處理
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

// 生產環境錯誤處理
const sendErrorProd = (err, res) => {
  // 可操作的錯誤：發送詳細信息給客戶端
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  // 編程或其他未知錯誤：不洩露錯誤詳情
  else {
    console.error('ERROR 💥', err);
    res.status(500).json({
      status: 'error',
      message: '發生錯誤',
    });
  }
};

// 主錯誤處理中間件
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = `${err.statusCode}`.startsWith('4') ? 'fail' : 'error';

  // 處理 MongoDB 錯誤
  if (err.name === 'CastError') {
    err = handleCastError(err);
  } else if (err.code === 11000) {
    err = handleDuplicateKeyError(err);
  } else if (err.name === 'ValidationError') {
    err = handleValidationError(err);
  }

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    sendErrorProd(err, res);
  }
};

// 處理未找到的路由
const notFoundHandler = (req, res, next) => {
  next(new AppError(`找不到路徑: ${req.originalUrl}`, 404));
};

module.exports = {
  AppError,
  errorHandler,
  notFoundHandler,
  handleValidationResultError,
  validateRequest,
};
