const dns = require('dns');
// Set public DNS for reliable MongoDB Atlas SRV record resolution on Windows only
try {
  if (process.platform === 'win32') {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  }
} catch (e) {}

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { exec } = require('child_process');
const mongoose = require('mongoose');

const Book = require('./models/Book');
const Settings = require('./models/Settings');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://ahmedalihafeez25_db_user:%40Sublime12345@cluster0.oe0inne.mongodb.net/book?retryWrites=true&w=majority';

app.use(cors());
app.use(express.json());

const ROOT_DIR = path.resolve(__dirname, '..');
const COVERS_DIR = path.join(ROOT_DIR, 'covers');
const LOCAL_JSON_FILE = path.join(__dirname, 'data', 'books.json');

// Ensure directories exist
if (!fs.existsSync(COVERS_DIR)) fs.mkdirSync(COVERS_DIR, { recursive: true });

// Multer storage for uploading PDFs and custom covers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'pdf') {
      cb(null, ROOT_DIR);
    } else if (file.fieldname === 'cover') {
      cb(null, COVERS_DIR);
    } else {
      cb(null, ROOT_DIR);
    }
  },
  filename: (req, file, cb) => {
    const decodedName = Buffer.from(file.originalname, 'latin1').toString('utf8');
    cb(null, decodedName);
  }
});

const upload = multer({ storage });

// Connect to MongoDB Atlas
let isConnected = false;
async function connectDB() {
  if (isConnected || (mongoose.connection && mongoose.connection.readyState >= 1)) {
    return;
  }
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    isConnected = true;
    console.log('✅ Connected to MongoDB Atlas [book database]');

    // Check if collection is empty, and seed from local books.json if needed
    const count = await Book.countDocuments();
    console.log(`Current books in MongoDB Atlas: ${count}`);

    if (count === 0 && fs.existsSync(LOCAL_JSON_FILE)) {
      try {
        const localData = JSON.parse(fs.readFileSync(LOCAL_JSON_FILE, 'utf8'));
        if (Array.isArray(localData) && localData.length > 0) {
          console.log(`Seeding ${localData.length} books into MongoDB Atlas...`);
          await Book.insertMany(localData);
          console.log('✅ Initial books seeded successfully into MongoDB Atlas!');
        }
      } catch (seedErr) {
        console.error('Seeding error:', seedErr);
      }
    }
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
  }
}

// Connect to MongoDB Atlas
connectDB();

// Ensure DB is connected for serverless invocations
app.use(async (req, res, next) => {
  if (req.path.startsWith('/api')) {
    await connectDB();
  }
  next();
});

// 0. POST /api/admin/login - Secure owner login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  const adminUser = process.env.ADMIN_USER || 'admin';
  const adminPass = process.env.ADMIN_PASSWORD || 'admin123';

  if (username === adminUser && password === adminPass) {
    return res.json({ success: true, message: 'لاگ ان کامیاب رہا' });
  }
  return res.status(401).json({ success: false, message: 'یوزر نیم یا پاس ورڈ غلط ہے!' });
});

// Settings Endpoints (CMS)
app.get('/api/settings', async (req, res) => {
  try {
    let settings = await Settings.findOne({ key: 'site_settings' });
    if (!settings) {
      settings = await Settings.create({ key: 'site_settings' });
    }
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/settings', async (req, res) => {
  try {
    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.__v;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    const settings = await Settings.findOneAndUpdate(
      { key: 'site_settings' },
      { $set: updateData },
      { new: true, upsert: true }
    );
    res.json({ success: true, message: 'تمام مواد اور سیٹنگز ڈیٹا بیس میں محفوظ ہو گئیں!', settings });
  } catch (err) {
    console.error('Settings update error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// 1. GET /api/books - Get books with search & filters from MongoDB
app.get('/api/books', async (req, res) => {
  try {
    const { q, category, author, sort, featured, isNew, limit } = req.query;
    let query = {};

    if (q && q.trim()) {
      const term = q.trim();
      const regex = new RegExp(term, 'i');
      query.$or = [
        { title: regex },
        { author: regex },
        { publisher: regex },
        { bookNumber: regex },
        { description: regex },
        { category: regex },
        { filename: regex }
      ];
    }

    if (category && category !== 'all' && category !== 'تمام زمرہ جات') {
      query.$or = (query.$or || []).concat([
        { category: category },
        { subCategory: category }
      ]);
    }

    if (author && author !== 'all') {
      query.author = author;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (isNew === 'true') {
      query.isNew = true;
    }

    let sortObj = { createdAt: -1, id: -1 };
    if (sort === 'views') {
      sortObj = { views: -1 };
    } else if (sort === 'downloads') {
      sortObj = { downloads: -1 };
    } else if (sort === 'pages') {
      sortObj = { pages: -1 };
    }

    let queryExec = Book.find(query).sort(sortObj);
    if (limit) {
      queryExec = queryExec.limit(parseInt(limit));
    }

    const books = await queryExec.exec();
    res.json({
      success: true,
      total: books.length,
      books
    });
  } catch (err) {
    console.error('Error fetching books:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. GET /api/books/:id - Get single book
app.get('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findOne({ id: req.params.id });
    if (!book) {
      return res.status(404).json({ success: false, message: 'کتاب دستیاب نہیں ہے' });
    }
    res.json({ success: true, book });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 3. POST /api/books/:id/view - increment views
app.post('/api/books/:id/view', async (req, res) => {
  try {
    const book = await Book.findOneAndUpdate(
      { id: req.params.id },
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!book) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, views: book.views });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 4. POST /api/books/:id/download - increment downloads
app.post('/api/books/:id/download', async (req, res) => {
  try {
    const book = await Book.findOneAndUpdate(
      { id: req.params.id },
      { $inc: { downloads: 1 } },
      { new: true }
    );
    if (!book) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, downloads: book.downloads });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 5. POST /api/books - Add new book (Admin)
app.post('/api/books', upload.fields([{ name: 'pdf', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), async (req, res) => {
  try {
    const body = req.body;
    let filename = body.filename;
    if (req.files && req.files.pdf && req.files.pdf[0]) {
      filename = req.files.pdf[0].filename;
    }

    if (!filename) {
      return res.status(400).json({ success: false, message: 'پی ڈی ایف فائل ضروری ہے' });
    }

    let cover = body.cover;
    if (req.files && req.files.cover && req.files.cover[0]) {
      cover = req.files.cover[0].filename;
    } else if (!cover) {
      cover = filename.replace(/\.pdf$/i, '.jpg');
    }

    const fullPdfPath = path.join(ROOT_DIR, filename);
    let size = 0;
    let sizeFormatted = '0 KB';
    if (fs.existsSync(fullPdfPath)) {
      size = fs.statSync(fullPdfPath).size;
      sizeFormatted = size > 1024 * 1024 ? `${(size / (1024 * 1024)).toFixed(1)} MB` : `${Math.round(size / 1024)} KB`;
    }

    // Determine next unique numeric ID
    const lastBook = await Book.findOne().sort({ id: -1 });
    const nextId = (lastBook ? (parseInt(lastBook.id) || 1000) + 1 : 1001).toString();

    const newBook = new Book({
      id: nextId,
      filename,
      cover,
      title: body.title || filename.replace(/\.pdf$/i, ''),
      author: body.author || 'علمائے کرام',
      publisher: body.publisher || 'مکتبہ کتاب و سنت',
      category: body.category || 'متفرق کتب',
      subCategory: body.subCategory || 'عام',
      bookNumber: body.bookNumber || `#${7960 + (await Book.countDocuments()) + 1}`,
      pages: parseInt(body.pages) || 0,
      size,
      sizeFormatted,
      description: body.description || '',
      featured: body.featured === 'true' || body.featured === true,
      isNew: body.isNew === 'true' || body.isNew === true,
      views: 0,
      downloads: 0,
      dateAdded: new Date().toLocaleDateString('ur-PK', { day: 'numeric', month: 'long', year: 'numeric' })
    });

    await newBook.save();

    // Auto-generate cover if python scanner available
    exec(`python "${path.join(__dirname, 'scanner.py')}"`, () => {});

    res.json({ success: true, message: 'کتاب کامیابی سے شامل کر لی گئی ہے', book: newBook });
  } catch (err) {
    console.error('Error adding book:', err);
    res.status(500).json({ success: false, message: 'خرابی: ' + err.message });
  }
});

// 6. PUT /api/books/:id - Edit ANY and EVERY field in MongoDB
app.put('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findOne({ id: req.params.id });
    if (!book) {
      return res.status(404).json({ success: false, message: 'کتاب نہیں ملی' });
    }

    const body = req.body;
    // Allow EVERY field in database to be editable
    const allowedFields = [
      'title', 'author', 'publisher', 'category', 'subCategory',
      'bookNumber', 'pages', 'sizeFormatted', 'description',
      'featured', 'isNew', 'views', 'downloads', 'cover', 'filename', 'dateAdded'
    ];

    allowedFields.forEach(field => {
      if (body[field] !== undefined) {
        book[field] = body[field];
      }
    });

    await book.save();
    res.json({ success: true, message: 'کتاب کی معلومات تبدیل ہو گئی ہیں', book });
  } catch (err) {
    console.error('Error updating book:', err);
    res.status(500).json({ success: false, message: 'خرابی: ' + err.message });
  }
});

// 7. DELETE /api/books/:id - Delete book from MongoDB
app.delete('/api/books/:id', async (req, res) => {
  try {
    const result = await Book.deleteOne({ id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'کتاب نہیں ملی' });
    }
    res.json({ success: true, message: 'کتاب حذف کر دی گئی ہے' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 8. POST /api/scan - Re-scan folder and sync directly into MongoDB Atlas
app.post('/api/scan', (req, res) => {
  const scriptPath = path.join(__dirname, 'scanner.py');
  exec(`python "${scriptPath}"`, async (err, stdout, stderr) => {
    if (err) {
      console.error('Scan error:', err, stderr);
      return res.status(500).json({ success: false, message: 'اسکین میں خرابی', error: stderr });
    }

    try {
      if (fs.existsSync(LOCAL_JSON_FILE)) {
        const localBooks = JSON.parse(fs.readFileSync(LOCAL_JSON_FILE, 'utf8'));
        for (const b of localBooks) {
          const existing = await Book.findOne({ filename: b.filename });
          if (!existing) {
            await Book.create(b);
          } else {
            // Update pages, size, cover if missing
            if (!existing.pages && b.pages) existing.pages = b.pages;
            if (!existing.cover && b.cover) existing.cover = b.cover;
            if (!existing.size && b.size) existing.size = b.size;
            if (!existing.sizeFormatted && b.sizeFormatted) existing.sizeFormatted = b.sizeFormatted;
            await existing.save();
          }
        }
      }

      const allBooks = await Book.find().sort({ createdAt: -1 });
      res.json({ 
        success: true, 
        message: `فولڈر کامیابی سے اسکین ہو گیا! کل کتب: ${allBooks.length}`,
        total: allBooks.length,
        books: allBooks
      });
    } catch (dbErr) {
      res.status(500).json({ success: false, message: dbErr.message });
    }
  });
});

// 9. GET /api/stats - Library stats aggregated from MongoDB Atlas
app.get('/api/stats', async (req, res) => {
  try {
    const books = await Book.find();
    const totalBooks = books.length;
    const totalViews = books.reduce((sum, b) => sum + (b.views || 0), 0);
    const totalDownloads = books.reduce((sum, b) => sum + (b.downloads || 0), 0);
    const totalPages = books.reduce((sum, b) => sum + (b.pages || 0), 0);
    const totalBytes = books.reduce((sum, b) => sum + (b.size || 0), 0);

    const totalSizeFormatted = totalBytes > 1024 * 1024 * 1024 
      ? `${(totalBytes / (1024 * 1024 * 1024)).toFixed(2)} GB` 
      : `${(totalBytes / (1024 * 1024)).toFixed(1)} MB`;

    const categories = {};
    books.forEach(b => {
      const cat = b.category || 'متفرق کتب';
      categories[cat] = (categories[cat] || 0) + 1;
    });

    res.json({
      success: true,
      stats: {
        totalBooks,
        totalViews,
        totalDownloads,
        totalPages,
        totalSizeFormatted,
        totalCategories: Object.keys(categories).length,
        categoriesBreakdown: categories
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 10. GET /api/categories - Categories aggregated from MongoDB
app.get('/api/categories', async (req, res) => {
  try {
    const books = await Book.find();
    const catMap = {};

    books.forEach(b => {
      const cat = b.category || 'متفرق کتب';
      if (!catMap[cat]) {
        catMap[cat] = { name: cat, count: 0, subCategories: {} };
      }
      catMap[cat].count++;
      if (b.subCategory) {
        catMap[cat].subCategories[b.subCategory] = (catMap[cat].subCategories[b.subCategory] || 0) + 1;
      }
    });

    res.json({ success: true, categories: Object.values(catMap) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 11. GET /api/covers/:filename - Serve covers
app.get('/api/covers/:filename', (req, res) => {
  const filename = decodeURIComponent(req.params.filename);
  let coverPath = path.join(COVERS_DIR, filename);
  if (!fs.existsSync(coverPath)) {
    coverPath = path.join(__dirname, 'covers', filename);
  }
  if (!fs.existsSync(coverPath)) {
    coverPath = path.join(ROOT_DIR, 'covers', filename);
  }

  if (fs.existsSync(coverPath)) {
    res.sendFile(coverPath);
  } else {
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(`
      <svg xmlns="http://www.w3.org/2000/svg" width="300" height="420" viewBox="0 0 300 420">
        <rect width="300" height="420" rx="8" fill="#0c5332"/>
        <rect x="15" y="15" width="270" height="390" rx="6" fill="none" stroke="#d4af37" stroke-width="2"/>
        <text x="150" y="180" font-family="sans-serif" font-size="20" fill="#ffffff" text-anchor="middle" font-weight="bold">اردو E-Books</text>
        <text x="150" y="220" font-family="sans-serif" font-size="14" fill="#d4af37" text-anchor="middle">کتاب و سنت لائبریری</text>
      </svg>
    `);
  }
});

// 12. GET /api/pdfs/:filename - Serve & Stream PDF
app.get('/api/pdfs/:filename', (req, res) => {
  const filename = decodeURIComponent(req.params.filename);
  let pdfPath = path.join(ROOT_DIR, filename);
  if (!fs.existsSync(pdfPath)) {
    pdfPath = path.join(__dirname, filename);
  }
  if (!fs.existsSync(pdfPath)) {
    pdfPath = path.join(process.cwd(), filename);
  }

  if (!fs.existsSync(pdfPath)) {
    return res.status(404).send('فائل موجود نہیں ہے');
  }

  const stat = fs.statSync(pdfPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  const download = req.query.download === '1' || req.query.download === 'true';
  const encodedName = encodeURIComponent(filename);

  if (download) {
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodedName}`);
  } else {
    res.setHeader('Content-Disposition', `inline; filename*=UTF-8''${encodedName}`);
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Accept-Ranges', 'bytes');

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = (end - start) + 1;
    const file = fs.createReadStream(pdfPath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'application/pdf',
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'application/pdf',
    };
    res.writeHead(200, head);
    fs.createReadStream(pdfPath).pipe(res);
  }
});

// Serve frontend static build if built
const CLIENT_DIST = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(CLIENT_DIST)) {
  app.use(express.static(CLIENT_DIST));
  app.get('*', (req, res) => {
    res.sendFile(path.join(CLIENT_DIST, 'index.html'));
  });
}

module.exports = app;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Kitabosunnat Server running at http://localhost:${PORT}`);
    console.log(`📚 Connected to MongoDB Collection: book`);
  });
}
