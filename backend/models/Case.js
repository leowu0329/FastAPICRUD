const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema(
  {
    inspectionType: {
      type: String,
      enum: ['首件', '巡檢'],
      required: true,
      default: '',
    },
    marketType: {
      type: String,
      enum: ['內銷', '外銷'],
      required: true,
      default: '',
    },
    customer: {
      type: String,
      required: true,
      default: '',
    },
    department: {
      type: String,
      enum: ['', '塑膠射出課', '射出加工組', '機械加工課'],
      required: true,
      default: '',
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    workOrder: {
      type: String,
      default: '',
    },
    operator: {
      type: String,
      default: '',
    },
    drawingVersion: {
      type: String,
      default: '',
    },
    productNumber: {
      type: String,
      required: true,
      default: '',
    },
    productName: {
      type: String,
      required: true,
      default: '',
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    inspector: {
      type: String,
      enum: ['', '吳小男', '謝小宸', '黃小瀅', '蔡小函', '徐小棉', '杜小綾'],
      default: '',
    },
    defectCategory: {
      type: String,
      enum: [
        '',
        '無圖面',
        '圖物不符',
        '無工單',
        '無檢驗表單',
        '尺寸NG',
        '外觀NG',
      ],
      default: '',
    },
    defectDescription: {
      type: String,
    },
    solution: {
      type: String,
    },
    inspectionHours: {
      type: Number,
      default: 0.0,
      get: (v) => Number(v.toFixed(2)),
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Case', caseSchema);
