import bcrypt from 'bcryptjs';
import { connectDb, disconnectDb } from './db.js';
import { User, Category, Transaction, Budget } from './models.js';
async function seed() {
  await connectDb();
  const email = 'demo@spendwise.local';
  let user = await User.findOne({ email });
  if (!user) user = await User.create({ name: 'Demo User', email, passwordHash: await bcrypt.hash('DemoPass123!', 12) });
  await Category.deleteMany({ owner: user._id });
  const names = [['Salary','income'],['Freelance','income'],['Food','expense'],['Transport','expense'],['Bills','expense'],['Entertainment','expense']] as const;
  const categories = await Category.insertMany(names.map(([name,type]) => ({ owner:user!._id, name, normalizedName:name.toLowerCase(), type, isDefault:true })));
  await Transaction.deleteMany({ owner: user._id }); await Budget.deleteMany({ owner: user._id });
  const food = categories.find(c => c.name === 'Food')!;
  await Transaction.create({ owner:user._id,type:'income',amountMinor:750000,currency:'INR',category:categories[0]._id,description:'Monthly salary',transactionDate:new Date(),paymentMethod:'bank_transfer' });
  await Transaction.create({ owner:user._id,type:'expense',amountMinor:12500,currency:'INR',category:food._id,description:'Groceries',transactionDate:new Date(),paymentMethod:'upi' });
  await Budget.create({ owner:user._id,name:'Food budget',category:food._id,amountMinor:300000,year:new Date().getFullYear(),month:new Date().getMonth()+1 });
  console.log('Demo account:', email, 'password: DemoPass123!');
  await disconnectDb();
}
seed().catch(error => { console.error(error); process.exitCode = 1; });
