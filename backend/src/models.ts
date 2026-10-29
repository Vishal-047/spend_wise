import mongoose, { Schema, Types } from 'mongoose';

export type TransactionType = 'income' | 'expense';
export const currencyCodes = ['INR', 'USD', 'EUR', 'GBP'] as const;
export const paymentMethods = ['cash', 'upi', 'card', 'bank_transfer', 'other'] as const;

const userSchema = new Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true, select: false },
  currency: { type: String, enum: currencyCodes, default: 'INR' },
  timezone: { type: String, default: 'Asia/Kolkata', maxlength: 80 }
}, { timestamps: true });

const categorySchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 50 },
  normalizedName: { type: String, required: true, trim: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  color: { type: String, default: '#64748b' },
  isDefault: { type: Boolean, default: false },
  active: { type: Boolean, default: true }
}, { timestamps: true });
categorySchema.index({ owner: 1, type: 1, normalizedName: 1 }, { unique: true });

const transactionSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  amountMinor: { type: Number, required: true, min: 1, max: 100000000000 },
  currency: { type: String, enum: currencyCodes, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  description: { type: String, required: true, trim: true, maxlength: 120 },
  transactionDate: { type: Date, required: true },
  paymentMethod: { type: String, enum: paymentMethods, required: true },
  notes: { type: String, trim: true, maxlength: 500 }
}, { timestamps: true });
transactionSchema.index({ owner: 1, transactionDate: -1 });
transactionSchema.index({ owner: 1, type: 1, transactionDate: -1 });

const budgetSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 80 },
  category: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
  amountMinor: { type: Number, required: true, min: 1, max: 100000000000 },
  period: { type: String, enum: ['monthly'], default: 'monthly' },
  year: { type: Number, required: true, min: 2000, max: 2200 },
  month: { type: Number, required: true, min: 1, max: 12 },
  active: { type: Boolean, default: true }
}, { timestamps: true });
budgetSchema.index({ owner: 1, category: 1, year: 1, month: 1 }, { unique: true });

export const User = mongoose.model('User', userSchema);
export const Category = mongoose.model('Category', categorySchema);
export const Transaction = mongoose.model('Transaction', transactionSchema);
export const Budget = mongoose.model('Budget', budgetSchema);
export type Id = Types.ObjectId;
