const { body, validationResult, param, query } = require('express-validator');
const {
  handleValidationResultError,
  validateRequest,
} = require('./errorHandler');

// 通用驗證規則
const commonValidations = {
  id: param('id').isMongoId().withMessage('無效的ID格式'),
  page: query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('頁碼必須是正整數'),
  limit: query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('每頁數量必須在1-100之間'),
};

// 驗證中間件
const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    next(handleValidationResultError(errors));
  };
};

// 檢驗案件驗證規則
const caseValidations = {
  create: [
    body('inspectionType')
      .isIn(['首件', '巡檢'])
      .withMessage('檢驗類型必須是首件或巡檢'),
    body('marketType')
      .isIn(['內銷', '外銷'])
      .withMessage('市場類型必須是內銷或外銷'),
    body('customer').notEmpty().withMessage('客戶名稱不能為空'),
    body('department')
      .isIn(['', '塑膠射出課', '射出加工組', '機械加工課'])
      .withMessage('部門選擇無效'),
    body('date').isISO8601().withMessage('日期格式無效'),
    body('time').notEmpty().withMessage('時間不能為空'),
    body('workOrder').optional().isString().withMessage('工單號碼必須是字串'),
    body('operator').optional().isString().withMessage('操作員必須是字串'),
    body('drawingVersion')
      .optional()
      .isString()
      .withMessage('圖面版本必須是字串'),
    body('productNumber').notEmpty().withMessage('產品編號不能為空'),
    body('productName').notEmpty().withMessage('產品名稱不能為空'),
    body('quantity').isInt({ min: 0 }).withMessage('數量必須是非負整數'),
    body('inspector')
      .isIn(['', '吳小男', '謝小宸', '黃小瀅', '蔡小函', '徐小棉', '杜小綾'])
      .withMessage('檢驗員選擇無效'),
    body('defectCategory')
      .isIn([
        '',
        '無圖面',
        '圖物不符',
        '無工單',
        '無檢驗表單',
        '尺寸NG',
        '外觀NG',
      ])
      .withMessage('不良類別選擇無效'),
    body('defectDescription')
      .optional()
      .isString()
      .withMessage('不良描述必須是字串'),
    body('solution').optional().isString().withMessage('解決方案必須是字串'),
    body('inspectionHours')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('檢驗時數必須是非負數'),
  ],
  update: [
    commonValidations.id,
    body('inspectionType')
      .optional()
      .isIn(['首件', '巡檢'])
      .withMessage('檢驗類型必須是首件或巡檢'),
    body('marketType')
      .optional()
      .isIn(['內銷', '外銷'])
      .withMessage('市場類型必須是內銷或外銷'),
    body('customer').optional().notEmpty().withMessage('客戶名稱不能為空'),
    body('department')
      .optional()
      .isIn(['', '塑膠射出課', '射出加工組', '機械加工課'])
      .withMessage('部門選擇無效'),
    body('date').optional().isISO8601().withMessage('日期格式無效'),
    body('time').optional().notEmpty().withMessage('時間不能為空'),
    body('workOrder').optional().isString().withMessage('工單號碼必須是字串'),
    body('operator').optional().isString().withMessage('操作員必須是字串'),
    body('drawingVersion')
      .optional()
      .isString()
      .withMessage('圖面版本必須是字串'),
    body('productNumber').optional().notEmpty().withMessage('產品編號不能為空'),
    body('productName').optional().notEmpty().withMessage('產品名稱不能為空'),
    body('quantity')
      .optional()
      .isInt({ min: 0 })
      .withMessage('數量必須是非負整數'),
    body('inspector')
      .optional()
      .isIn(['', '吳小男', '謝小宸', '黃小瀅', '蔡小函', '徐小棉', '杜小綾'])
      .withMessage('檢驗員選擇無效'),
    body('defectCategory')
      .optional()
      .isIn([
        '',
        '無圖面',
        '圖物不符',
        '無工單',
        '無檢驗表單',
        '尺寸NG',
        '外觀NG',
      ])
      .withMessage('不良類別選擇無效'),
    body('defectDescription')
      .optional()
      .isString()
      .withMessage('不良描述必須是字串'),
    body('solution').optional().isString().withMessage('解決方案必須是字串'),
    body('inspectionHours')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('檢驗時數必須是非負數'),
  ],
  getById: [commonValidations.id],
  delete: [commonValidations.id],
  list: [
    commonValidations.page,
    commonValidations.limit,
    query('inspectionType')
      .optional()
      .isIn(['首件', '巡檢'])
      .withMessage('檢驗類型必須是首件或巡檢'),
    query('marketType')
      .optional()
      .isIn(['內銷', '外銷'])
      .withMessage('市場類型必須是內銷或外銷'),
    query('department')
      .optional()
      .isIn(['', '塑膠射出課', '射出加工組', '機械加工課'])
      .withMessage('部門選擇無效'),
    query('inspector')
      .optional()
      .isIn(['', '吳小男', '謝小宸', '黃小瀅', '蔡小函', '徐小棉', '杜小綾'])
      .withMessage('檢驗員選擇無效'),
    query('defectCategory')
      .optional()
      .isIn([
        '',
        '無圖面',
        '圖物不符',
        '無工單',
        '無檢驗表單',
        '尺寸NG',
        '外觀NG',
      ])
      .withMessage('不良類別選擇無效'),
    query('startDate').optional().isISO8601().withMessage('開始日期格式無效'),
    query('endDate').optional().isISO8601().withMessage('結束日期格式無效'),
  ],
};

// 測試相關驗證規則
const testValidations = {
  create: [
    body('name').notEmpty().withMessage('名稱不能為空'),
    body('description').optional().isString().withMessage('描述必須是字串'),
  ],
  update: [
    commonValidations.id,
    body('name').optional().notEmpty().withMessage('名稱不能為空'),
    body('description').optional().isString().withMessage('描述必須是字串'),
  ],
  getById: [commonValidations.id],
  delete: [commonValidations.id],
  list: [commonValidations.page, commonValidations.limit],
};

module.exports = {
  validate,
  caseValidations,
  testValidations,
  validateRequest,
};
