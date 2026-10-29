import os
import glob
import json
import fitz # pymupdf
from datetime import datetime

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COVERS_DIR = os.path.join(ROOT_DIR, 'covers')
DATA_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data', 'books.json')

os.makedirs(COVERS_DIR, exist_ok=True)
os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)

# Default category mappings and Urdu details for known files
KNOWN_BOOKS_META = {
    "Bachon Ke Liye Hadith - Naya Design.pdf": {
        "title": "بچوں کے لیے ۳۶ آسان احادیث (روزانہ کا سبق)",
        "author": "مولانا عبدالرحمن",
        "publisher": "مکتبہ دارالسلام و محدث میڈیا",
        "category": "حدیث و علوم حدیث",
        "subCategory": "بچوں کی کتب",
        "bookNumber": "7968",
        "description": "بچوں کے لیے پیاری پیاری آسان احادیث مع سلیس اردو ترجمہ اور روزانہ کا سبق۔ ہمارے پیارے نبی حضرت محمد ﷺ کے پیارے ارشادات جن سے بچے روزمرہ کی اچھی عادتیں اور دینی اخلاق سیکھتے ہیں۔",
        "featured": True,
        "isNew": True,
        "views": 425,
        "downloads": 112
    },
    "Bachon Ki Lorian Aur Nazmen.pdf": {
        "title": "ننھے منے بچوں کے لیے لوریاں اور نظمیں",
        "author": "ادارہ کتب اطفال",
        "publisher": "شعبہ اطفال محدث فورم",
        "category": "اصلاح معاشرہ",
        "subCategory": "بچوں کی کتب",
        "bookNumber": "7969",
        "description": "ننھے منے بچوں کے لیے پیاری لوریاں اور تربیتی نظمیں، بشمول حکیم الامت علامہ محمد اقبال کی مشہور نظمیں 'بچے کی دعا' اور 'ہمدردی'۔ بچوں کی زبان اور اخلاق کی تربیت کے لیے بہترین انتخاب۔",
        "featured": True,
        "isNew": True,
        "views": 380,
        "downloads": 95
    },
    "Hazrat Ameer Muawiya - Hayat aur Karnamay.pdf": {
        "title": "سیدنا حضرت امیر معاویہ رضی اللہ عنہ - حیات، فضائل اور عظیم کارنامے",
        "author": "حافظ محمد اسلم راؤپوری",
        "publisher": "مکتبہ قدوسیہ لاہور",
        "category": "سیرت و سوانح",
        "subCategory": "صحابہ کرام",
        "bookNumber": "7970",
        "description": "کاتب وحی، خال المؤمنین، جلیل القدر صحابی رسول ﷺ حضرت امیر معاویہ بن ابی سفیان رضی اللہ عنہ کی حیات طیبہ، اسلام کے لیے خدمات، اسلامی تاریخ کے پہلے بحری بیڑے کا قیام، شاندار فتوحات اور عظیم کارناموں کی مستند تاریخ۔",
        "featured": True,
        "isNew": False,
        "views": 890,
        "downloads": 310
    },
    "Hunarmand Bachay - Saal Ba Saal Skills.pdf": {
        "title": "ہنرمند بچے - سال بہ سال سکھانے والی مہارتیں (3 سے 15 سال)",
        "author": "ڈاکٹر شازیہ انجم",
        "publisher": "فیملی اینڈ ایجوکیشن پبلشرز",
        "category": "اصلاح معاشرہ",
        "subCategory": "تربیت اولاد",
        "bookNumber": "7971",
        "description": "والدین اور اساتذہ کے لیے رہنما کتاب: 3 سال سے 15 سال تک کے بچوں کو سال بہ سال سکھانے والی عملی مہارتیں، خوشخطی، خطاطی، دسترخوان کے آداب، گفتگو، قرآن، نماز، دعائیں اور روزمرہ زندگی کے امور۔",
        "featured": True,
        "isNew": True,
        "views": 612,
        "downloads": 245
    },
    "Hunarmand Bachay - Saal Ba Saal Skills (1).pdf": {
        "title": "ہنرمند بچے - قدم بہ قدم عملی مہارتیں گائیڈ (جلد دوم)",
        "author": "ڈاکٹر شازیہ انجم",
        "publisher": "فیملی اینڈ ایجوکیشن پبلشرز",
        "category": "اصلاح معاشرہ",
        "subCategory": "تربیت اولاد",
        "bookNumber": "7972",
        "description": "بچوں کی اخلاقی، جسمانی اور ذہنی نشوونما کے لیے جامع رہنما۔ دستکاری، گفت و شنید، دینی شعور اور خود اعتمادی پیدا کرنے کے گر۔",
        "featured": False,
        "isNew": False,
        "views": 274,
        "downloads": 88
    },
    "Subah ke Azkar - Designed.pdf": {
        "title": "صبح کے اذکار (أَذْكَارُ الصَّبَاحِ) - عربی متن مع اردو ترجمہ",
        "author": "شعبہ اذکار و دعائیں",
        "publisher": "دار الکتاب والسنت پبلیکیشنز",
        "category": "عبادات و معاملات",
        "subCategory": "دعائیں و اذکار",
        "bookNumber": "7973",
        "description": "مسنون صبح کے اذکار و دعائیں، با اعراب واضح عربی خط، آسان اردو ترجمہ اور فضائل و برکات کے ساتھ۔ روزانہ صبح تلاوت اور حفاظت کا مسنون معمول۔",
        "featured": True,
        "isNew": True,
        "views": 1540,
        "downloads": 720
    },
    "Tarbiyat Ka Safar - Bachon Ki Saal Ba Saal Tarbiyat.pdf": {
        "title": "تربیت کا سفر - بچوں کی سال بہ سال تربیت (پیدائش سے 15 سال)",
        "author": "پروفیسر مفتی طارق جمیل عثمانی",
        "publisher": "مکتبہ بیت السلام",
        "category": "اصلاح معاشرہ",
        "subCategory": "تربیت اولاد",
        "bookNumber": "7974",
        "description": "والدین کے لیے مکمل رہنما کتاب: پیدائش سے پندرہ سال تک، قدم بہ قدم بچوں کی دینی، اخلاقی، جسمانی، تعلیمی اور جذباتی تربیت کا خوبصورت اور جامع لائحہ عمل۔",
        "featured": True,
        "isNew": False,
        "views": 945,
        "downloads": 415
    }
}

def scan_books():
    existing_books = []
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                existing_books = json.load(f)
        except Exception:
            existing_books = []

    existing_by_file = {b.get('filename'): b for b in existing_books}

    # Find all PDFs in root workspace
    pdf_files = [f for f in os.listdir(ROOT_DIR) if f.lower().endswith('.pdf')]
    updated_books = []
    
    current_time_str = datetime.now().strftime("%d %B %Y")
    # Urdu month translation
    months = {
        "January": "جنوری", "February": "فروری", "March": "مارچ", "April": "اپریل",
        "May": "مئی", "June": "جون", "July": "جولائی", "August": "اگست",
        "September": "ستمبر", "October": "اکتوبر", "November": "نومبر", "December": "دسمبر"
    }
    for eng, ur in months.items():
        current_time_str = current_time_str.replace(eng, ur)

    for idx, fname in enumerate(sorted(pdf_files)):
        full_pdf_path = os.path.join(ROOT_DIR, fname)
        cover_filename = fname.rsplit('.', 1)[0] + '.jpg'
        full_cover_path = os.path.join(COVERS_DIR, cover_filename)
        
        pages_count = 0
        file_size = os.path.getsize(full_pdf_path)

        try:
            doc = fitz.open(full_pdf_path)
            pages_count = len(doc)
            if not os.path.exists(full_cover_path) and pages_count > 0:
                page = doc[0]
                pix = page.get_pixmap(dpi=150)
                pix.save(full_cover_path)
        except Exception as e:
            print(f"Error processing {fname}: {e}")

        # Check existing or known meta
        existing = existing_by_file.get(fname, {})
        known = KNOWN_BOOKS_META.get(fname, {})

        book_id = existing.get('id', str(1000 + idx + 1))
        title = existing.get('title') or known.get('title') or fname.rsplit('.', 1)[0]
        author = existing.get('author') or known.get('author') or "علمائے کرام"
        publisher = existing.get('publisher') or known.get('publisher') or "مکتبہ کتاب و سنت"
        category = existing.get('category') or known.get('category') or "متفرق کتب"
        subCategory = existing.get('subCategory') or known.get('subCategory') or "عام کتب"
        bookNumber = existing.get('bookNumber') or known.get('bookNumber') or f"#{7960 + idx}"
        description = existing.get('description') or known.get('description') or f"کتاب و سنت لائبریری کی جانب سے پیش کردہ مفید کتاب: {title}"
        featured = existing.get('featured', known.get('featured', True))
        isNew = existing.get('isNew', known.get('isNew', True))
        views = existing.get('views', known.get('views', 150 + idx * 45))
        downloads = existing.get('downloads', known.get('downloads', 40 + idx * 15))
        dateAdded = existing.get('dateAdded', current_time_str)

        # Formatted file size string (MB or KB)
        if file_size > 1024 * 1024:
            size_str = f"{file_size / (1024 * 1024):.1f} MB"
        else:
            size_str = f"{file_size / 1024:.0f} KB"

        book_entry = {
            "id": book_id,
            "filename": fname,
            "cover": cover_filename,
            "title": title,
            "author": author,
            "publisher": publisher,
            "category": category,
            "subCategory": subCategory,
            "bookNumber": bookNumber,
            "pages": pages_count,
            "size": file_size,
            "sizeFormatted": size_str,
            "description": description,
            "featured": featured,
            "isNew": isNew,
            "views": views,
            "downloads": downloads,
            "dateAdded": dateAdded
        }
        updated_books.append(book_entry)

    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(updated_books, f, indent=2, ensure_ascii=False)

    print(f"Scanned {len(updated_books)} books successfully.")
    return updated_books

if __name__ == '__main__':
    scan_books()
