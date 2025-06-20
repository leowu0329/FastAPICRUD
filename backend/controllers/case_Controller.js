const Case = require('../models/Case');
const { AppError } = require('../middleware/errorHandler');

// 創建新案例
exports.createCase = async (req, res, next) => {
  try {
    const newCase = new Case(req.body);
    const savedCase = await newCase.save();
    res.status(201).json(savedCase);
  } catch (error) {
    next(error);
  }
};

// 獲取所有案例
exports.getAllCases = async (req, res, next) => {
  try {
    const cases = await Case.find().sort({ createdAt: -1 });
    res.json(cases);
  } catch (error) {
    next(error);
  }
};

// 獲取單個案例
exports.getCaseById = async (req, res, next) => {
  try {
    const caseItem = await Case.findById(req.params.id);
    if (!caseItem) {
      return next(new AppError('找不到該案例', 404));
    }
    res.json(caseItem);
  } catch (error) {
    next(error);
  }
};

// 更新案例
exports.updateCase = async (req, res, next) => {
  try {
    const updatedCase = await Case.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedCase) {
      return next(new AppError('找不到該案例', 404));
    }
    res.json(updatedCase);
  } catch (error) {
    next(error);
  }
};

// 刪除案例
exports.deleteCase = async (req, res, next) => {
  try {
    const deletedCase = await Case.findByIdAndDelete(req.params.id);
    if (!deletedCase) {
      return next(new AppError('找不到該案例', 404));
    }
    res.json({ message: '案例已刪除' });
  } catch (error) {
    next(error);
  }
};
