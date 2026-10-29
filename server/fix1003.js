const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
require('dotenv').config();
const mongoose = require('mongoose');
const Book = require('./models/Book');

async function fix() {
  await mongoose.connect(process.env.MONGO_URI);
  await Book.updateOne(
    { id: '1003' },
    { 
      title: 'سیدنا حضرت امیر معاویہ رضی اللہ عنہ - حیات، فضائل اور عظیم کارنامے',
      description: 'کاتب وحی، خال المؤمنین، جلیل القدر صحابی رسول ﷺ حضرت امیر معاویہ بن ابی سفیان رضی اللہ عنہ کی حیات طیبہ، اسلام کے لیے خدمات، اسلامی تاریخ کے پہلے بحری بیڑے کا قیام، شاندار فتوحات اور عظیم کارناموں کی مستند تاریخ۔'
    }
  );
  console.log('Book 1003 updated with proper Urdu title!');
  process.exit(0);
}

fix();
