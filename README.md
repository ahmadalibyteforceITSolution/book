# کتاب و سنت (اردو ای بکس) - KitaboSunnat Islamic Digital Library

مستند اسلامی کتب، احادیث مبارکہ، تربیت اولاد اور دینی موضوعات کا آن لائن ڈیجیٹل کتب خانہ، مع انٹیگریٹڈ پی ڈی ایف ریڈر اور ایڈمن سی ایم ایس کنٹرول پینل۔

## 🌟 نمایاں خصوصیات (Key Features)

- **مستند اسلامی ڈیزائن:** `kitabosunnat.com` کی طرز پر خوبصورت اسلامی لے آؤٹ، زمردی سبز و سنہری رنگ اور پاکیزہ طرز تحریر۔
- **آن لائن پی ڈی ایف ریڈر:** بغیر ڈاؤن لوڈ کیے براؤزر کے اندر فل اسکرین کتاب پڑھنے کی سہولت۔
- **آسان ڈاؤن لوڈ:** ایک کلک پر کتابیں محفوظ کرنے کی سہولت۔
- **موضوعاتی تلاش و فلٹرز:** کتب، مصنفین، ناشرین اور زمرہ جات (حدیث، سیرت، تربیت اولاد، اذکار) کے مطابق فلٹرنگ۔
- **محفوظ ایڈمن پینل (Owner Dashboard):** 
  - خفیہ روٹ `#/admin` پر علیحدہ لاگ ان اسکرین۔
  - ویب سائٹ کا تمام ٹیکسٹ (ہیڈر، بینر، تمام سیکشنز اور فوٹر) CMS سے باآسانی تبدیل کریں۔
  - نئی پی ڈی ایف کتابیں اپلوڈ اور ایڈٹ کریں۔
- **MongoDB Atlas Cloud:** ڈیٹا کلاؤڈ ڈیٹا بیس میں محفوظ اور ہمہ وقت دستیاب۔

---

## 🚀 مقامی طور پر چلانے کا طریقہ (Local Setup)

### 1. ریپوزٹری کلون کریں:
```bash
git clone https://github.com/ahmadalibyteforceITSolution/book.git
cd book
```

### 2. ڈپینڈینسیز انسٹال کریں:
```bash
# بیک اینڈ
npm install
cd client && npm install && npm run build
cd ..
```

### 3. سرور شروع کریں:
```bash
npm start
```
ویب سائٹ کھولیں: **`http://localhost:5000/`**  
ایڈمن پینل: **`http://localhost:5000/#/admin`**  
(لاگ ان: `admin` / `admin123`)

---

## ☁️ Vercel پر ڈیپلائے کرنے کا طریقہ (Deploy to Vercel)

یہ پروجیکٹ Vercel کے لیے مکمل طور پر ترتیب دیا گیا ہے (`vercel.json` اور `api/index.js` شامل ہیں):

1. **Vercel Dashboard** پر جائیں: [https://vercel.com/bytely-team](https://vercel.com/bytely-team)
2. **Add New Project** پر کلک کریں اور GitHub ریپوزٹری `ahmadalibyteforceITSolution/book` منتخب کریں۔
3. **Environment Variables** میں یہ ویلیوز شامل کریں:
   - `MONGO_URI`: `mongodb+srv://ahmedalihafeez25_db_user:%40Sublime12345@cluster0.oe0inne.mongodb.net/book?retryWrites=true&w=majority`
   - `ADMIN_USER`: `admin`
   - `ADMIN_PASSWORD`: `admin123`
4. **Deploy** پر کلک کریں۔ Vercel خودکار طریقے سے فرنٹ اینڈ اور بیک اینڈ API لائیو کر دے گا۔
