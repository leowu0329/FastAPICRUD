const express = require('express');
const router = express.Router();
const Case = require('../models/Case');
const {
  validateRequest,
  caseValidations,
} = require('../middleware/validators');
const { AppError } = require('../middleware/errorHandler');

// 獲取所有案件
router.get(
  '/',
  validateRequest(caseValidations.list),
  async (req, res, next) => {
    try {
      const { page = 1, limit = 10, ...filters } = req.query;
      const skip = (page - 1) * limit;

      // 構建查詢條件
      const query = {};
      if (filters.inspectionType) query.inspectionType = filters.inspectionType;
      if (filters.marketType) query.marketType = filters.marketType;
      if (filters.department) query.department = filters.department;
      if (filters.inspector) query.inspector = filters.inspector;
      if (filters.defectCategory) query.defectCategory = filters.defectCategory;
      if (filters.startDate || filters.endDate) {
        query.date = {};
        if (filters.startDate) query.date.$gte = new Date(filters.startDate);
        if (filters.endDate) query.date.$lte = new Date(filters.endDate);
      }

      const cases = await Case.find(query)
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

      const total = await Case.countDocuments(query);

      res.json({
        status: 'success',
        data: cases,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

// 獲取單個案件
router.get(
  '/:id',
  validateRequest(caseValidations.getById),
  async (req, res, next) => {
    try {
      const caseDoc = await Case.findById(req.params.id);
      if (!caseDoc) {
        return next(new AppError('找不到該案件', 404));
      }
      res.json({
        status: 'success',
        data: caseDoc,
      });
    } catch (error) {
      next(error);
    }
  },
);

// 創建新案件
router.post(
  '/',
  validateRequest(caseValidations.create),
  async (req, res, next) => {
    try {
      const newCase = new Case(req.body);
      await newCase.save();
      res.status(201).json({
        status: 'success',
        data: newCase,
      });
    } catch (error) {
      next(error);
    }
  },
);

// 更新案件
router.put(
  '/:id',
  validateRequest(caseValidations.update),
  async (req, res, next) => {
    try {
      const updatedCase = await Case.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true },
      );
      if (!updatedCase) {
        return next(new AppError('找不到該案件', 404));
      }
      res.json({
        status: 'success',
        data: updatedCase,
      });
    } catch (error) {
      next(error);
    }
  },
);

// 刪除案件
router.delete(
  '/:id',
  validateRequest(caseValidations.delete),
  async (req, res, next) => {
    try {
      const deletedCase = await Case.findByIdAndDelete(req.params.id);
      if (!deletedCase) {
        return next(new AppError('找不到該案件', 404));
      }
      res.json({
        status: 'success',
        message: '案例已刪除',
      });
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;
