const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  key: {
    type: String,
    default: 'site_settings',
    unique: true
  },
  // --- HEADER SETTINGS ---
  phone: { type: String, default: '+92 300 0197274' },
  email: { type: String, default: 'library@kitabosunnat.com' },
  topNotice: { type: String, default: '﷽ کتب و سنت لائبریری - اردو اسلامی کتب کا مرکز' },
  siteTitle: { type: String, default: 'اردو ای بکس' },
  siteBadge: { type: String, default: 'کتاب و سنت' },
  siteTagline: { type: String, default: 'اردو اسلامی کتب کا سب سے بڑا مفت مرکز' },

  // --- HERO BANNER SETTINGS ---
  bannerTag: { type: String, default: '﷽ کتاب و سنت کی روشنی میں مستند علمی مرکز' },
  bannerTitle: { type: String, default: 'کتاب و سنت' },
  bannerHighlight: { type: String, default: '(محدث)' },
  bannerSuffix: { type: String, default: 'لائبریری' },
  bannerDescription: { 
    type: String, 
    default: 'کتاب و سنت کی روشنی میں لکھی جانے والی اردو اسلامی کتب کا سب سے بڑا مفت مرکز، جس میں احادیث مبارکہ، تربیت اولاد، سیرت و سوانح، اذکار و دعائیں اور دینی کتب مکمل پی ڈی ایف میں دستیاب ہیں۔' 
  },
  bannerBtnText1: { type: String, default: 'کتب کا مطالعہ کریں' },
  bannerBtnText2: { type: String, default: 'فولڈر میں نئی کتابیں شامل کریں' },
  bannerCardBadge: { type: String, default: 'القرآن والسنۃ' },
  bannerCardTitle: { type: String, default: 'مفت اسلامی لائبریری' },
  bannerCardSubtitle: { type: String, default: 'آن لائن پی ڈی ایف مطالعہ و ڈاؤن لوڈ' },

  // --- SECTIONS HEADINGS & CONTENT ---
  latestBooksTitle: { type: String, default: 'جديد کتابیں' },
  featuredBooksTitle: { type: String, default: 'اہم و منتخب کتابیں' },
  categoriesSectionTitle: { type: String, default: 'موضوعاتی فہرست و لائبریری سیکشنز' },
  categoriesSectionSubtitle: { type: String, default: 'اپنی پسندیدہ موضوع کے مطابق کتب تلاش کریں' },

  statsTitle: { type: String, default: 'اعداد و شمار لائبریری' },
  statsSubtitle: { type: String, default: 'براہ راست اعداد' },
  newsletterTitle: { type: String, default: 'ای میل سبسکرپشن' },
  newsletterDesc: { type: String, default: 'کتاب و سنت لائبریری کی نئی کتب اور اپ ڈیٹس بذریعہ ای میل وصول کرنے کے لیے اپنا ای میل درج کر کے سبسکرائب کریں۔' },
  appBoxTitle: { type: String, default: 'موبائل لائبریری ایپ' },
  appBoxDesc: { type: String, default: 'کتاب و سنت لائبریری کے ذریعے اپنے موبائل پر ہزاروں کتب آسانی سے پڑھیں اور محفوظ کریں۔' },
  issueBoxTitle: { type: String, default: 'ویب سائٹ یا پی ڈی ایف سے متعلق مسئلہ رپورٹ کریں' },
  issueBoxDesc: { type: String, default: 'اگر آپ کو کسی کتاب کی پی ڈی ایف فائل کھولنے، ڈاؤن لوڈ کرنے یا صفحات کے پڑھنے میں کوئی دشواری پیش آئے تو برائے مہربانی ہمیں مطلع فرمائیں۔' },

  // --- FOOTER SETTINGS ---
  footerAboutTitle: { type: String, default: 'کتاب و سنت لائبریری' },
  footerAboutDesc: { 
    type: String, 
    default: 'کتاب و سنت کی روشنی میں لکھی جانے والی اردو اسلامی کتب کی سب سے بڑی مفت لائبریری جس میں قرآن، حدیث، تفسیر، سیرت اور دیگر علوم اسلامیہ سے متعلق کتب موجود ہیں۔' 
  },
  footerAddress: { type: String, default: 'مرکز النور: کالج روڈ، نزد غازی چوک ٹاؤن شپ، لاہور ۔ پاکستان' },
  footerPhone: { type: String, default: '0092-301-7989520' },
  footerEmail: { type: String, default: 'library@mohaddis.com' },
  footerBankNotice: { type: String, default: 'بینک تفصیلات کے لیے رابطہ کریں' },

  facebookUrl: { type: String, default: 'https://www.facebook.com/MohaddisMedia' },
  youtubeUrl: { type: String, default: 'https://www.youtube.com/MohaddisMedia' },
  twitterUrl: { type: String, default: 'https://twitter.com/MohaddisMedia' },
  instagramUrl: { type: String, default: 'https://www.instagram.com/mohaddismedia' },
  whatsappUrl: { type: String, default: 'https://wa.me/00923000197274' },

  copyrightText: { type: String, default: 'جملہ حقوق محفوظ ہیں۔ کتاب و سنت لائبریری © 2026' },
  copyrightNote: { type: String, default: 'تمام کتب آپ کے کمپیوٹر کے لوکل پی ڈی ایف فولڈر سے براہ راست پیش کی جا رہی ہیں۔' }
}, {
  timestamps: true,
  collection: 'settings',
  bufferCommands: false
});

module.exports = mongoose.model('Settings', settingsSchema);
