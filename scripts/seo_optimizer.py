#!/usr/bin/env python3
"""
Comprehensive SEO, Geo-SEO, and Keyword Targeting Optimizer
for Alalamy Furniture & Luggage Moving (شركة العالمي لنقل وتغليف الأثاث والعفش).
Updates all 239 HTML pages in /public with tailored metadata, geo-tags, schemas, and content keywords.
"""

import glob
import json
import os
import re
import urllib.parse

# Area to coordinate mapping for Cairo and Giza
GEO_COORDS = {
    'مصر الجديدة': (30.0910, 31.3253),
    'النزهة': (30.1150, 31.3480),
    'شيراتون': (30.1060, 31.3780),
    'مدينة نصر': (30.0566, 31.3414),
    'غرب مدينة نصر': (30.0510, 31.3250),
    'شرق مدينة نصر': (30.0620, 31.3580),
    'عين شمس': (30.1310, 31.3290),
    'المطرية': (30.1280, 31.3120),
    'المرج': (30.1580, 31.3390),
    'السلام': (30.1650, 31.4280),
    'منشأة ناصر': (30.0380, 31.2780),
    'الوايلي': (30.0710, 31.2820),
    'وسط البلد': (30.0488, 31.2437),
    'بولاق': (30.0610, 31.2310),
    'عابدين': (30.0430, 31.2450),
    'الأزبكية': (30.0550, 31.2470),
    'الموسكي': (30.0500, 31.2580),
    'باب الشعرية': (30.0580, 31.2610),
    'شبرا': (30.0820, 31.2450),
    'الزاوية الحمراء': (30.0920, 31.2720),
    'حدائق القبة': (30.0890, 31.2950),
    'روض الفرج': (30.0780, 31.2380),
    'الشرابية': (30.0810, 31.2680),
    'الساحل': (30.0950, 31.2410),
    'الزيتون': (30.1080, 31.3110),
    'الأميرية': (30.1110, 31.2950),
    'مصر القديمة': (30.0080, 31.2310),
    'الخليفة': (30.0210, 31.2590),
    'المقطم': (30.0120, 31.2980),
    'البساتين': (29.9880, 31.2810),
    'دار السلام': (29.9850, 31.2390),
    'السيدة زينب': (30.0310, 31.2410),
    'التبين': (29.7710, 31.2980),
    'حلوان': (29.8497, 31.3342),
    'المعصرة': (29.8960, 31.3020),
    'المعادي': (29.9602, 31.2569),
    'طرة': (29.9320, 31.2750),
    '15 مايو': (29.8350, 31.3780),
    'الزمالك': (30.0620, 31.2210),
    'جاردن سيتي': (30.0360, 31.2310),
    'باب اللوق': (30.0450, 31.2400),
    'العباسية': (30.0680, 31.2810),
    'روكسي': (30.0950, 31.3190),
    'الكوربة': (30.0900, 31.3240),
    'التجمع الخامس': (30.0279, 31.4913),
    'التجمع الأول': (30.0650, 31.4680),
    'التجمع الثالث': (29.9980, 31.4550),
    'الرحاب': (30.0590, 31.4950),
    'مدينتي': (30.1120, 31.6280),
    'القطامية': (29.9880, 31.3920),
    'الجيزة': (30.0131, 31.2089),
    'شمال الجيزة': (30.0710, 31.2050),
    'جنوب الجيزة': (29.9950, 31.2110),
    'العجوزة': (30.0558, 31.2155),
    'العمرانية': (29.9950, 31.1890),
    'الهرم': (29.9972, 31.1542),
    'بولاق الدكرور': (30.0320, 31.1890),
    'الوراق': (30.1080, 31.2080),
    'الدقي': (30.0382, 31.2124),
    'الطالبية': (29.9890, 31.1680),
    'المهندسين': (30.0543, 31.2014),
    'إمبابة': (30.0750, 31.2080),
    'المنيرة الغربية': (30.0820, 31.1980),
    'أرض اللواء': (30.0510, 31.1950),
    'ميت عقبة': (30.0580, 31.2020),
    'فيصل': (30.0055, 31.1712),
    'نزلة السمان': (29.9740, 31.1390),
    'حدائق الأهرام': (29.9760, 31.1120),
    '6 أكتوبر': (29.9723, 30.9438),
    'أكتوبر الجديدة': (29.9150, 30.8850),
    'حدائق أكتوبر': (29.9480, 31.0250),
    'غرب سوميد': (29.9850, 30.9320),
    'الشيخ زايد': (30.0520, 30.9839),
    'حدائق الشيخ زايد': (30.0410, 30.9650),
    'نيو جيزة': (30.0250, 31.0210),
    'كرداسة': (30.0310, 31.1150),
    'أبو رواش': (30.0510, 31.0850),
    'أوسيم': (30.1250, 31.1350),
    'منشأة القناطر': (30.1780, 31.1150),
    'أبو النمرس': (29.9210, 31.2380),
    'الحوامدية': (29.8980, 31.2650),
    'البدرشين': (29.8120, 31.2720),
    'العياط': (29.6210, 31.2580),
    'الصف': (29.5690, 31.2920),
    'أطفيح': (29.4180, 31.2520),
    'الواحات البحرية': (28.3540, 28.8710)
}

CORE_PAGES = {
    'index.html': {
        'title': 'شركة نقل أثاث وعفش بالقاهرة والجيزة | ونش رفع وتغليف — العالمي',
        'desc': 'أفضل شركة نقل أثاث ونقل عفش في القاهرة والجيزة. نوفر أحدث أوناش رفع الأثاث الهيدروليكية، سيارات نقل عفش مغلقة مجهزة، فك وتغليف وتركيب الموبيليا بأرخص الأسعار وضمان شامل.',
        'keywords': 'شركة نقل اثاث, شركة نقل عفش, نقل اثاث القاهرة, نقل اثاث الجيزة, نقل عفش بالقاهرة, ونش رفع اثاث, ونش رفع عفش, شركات نقل الاثاث, اوناش رفع الاثاث, فك وتركيب اثاث, تغليف عفش, سيارات نقل عفش, ارخص شركة نقل اثاث, افضل شركة نقل عفش',
        'placename': 'القاهرة والجيزة، مصر',
        'lat': 30.0626,
        'lng': 31.2497,
        'region': 'EG-C'
    },
    'services.html': {
        'title': 'خدمات نقل وتغليف العفش والأثاث | ونش هيدروليكي وسيارات مغلقة — العالمي',
        'desc': 'خدمات متكاملة في نقل الأثاث ونقل العفش تشمل: ونش رفع الأثاث للأدوار العليا، تغليف العفش بالبابلز والكرتون، فك وتركيب غرف النوم والمطابخ، وسيارات نقل مغلقة ومجهزة.',
        'keywords': 'خدمات نقل اثاث, خدمات نقل عفش, ونش رفع اثاث هيدروليكي, تغليف العفش, فك وتركيب اثاث, سيارات نقل مغلقة, نقل غرف نوم, نقل مكاتب, تغليف كرتون وبابلز',
        'placename': 'القاهرة والجيزة، مصر',
        'lat': 30.0626,
        'lng': 31.2497,
        'region': 'EG-C'
    },
    'pricing.html': {
        'title': 'أسعار نقل الأثاث والعفش بالقاهرة والجيزة | عروض وخصومات — العالمي',
        'desc': 'احصل على أفضل وأرخص أسعار نقل الأثاث ونقل العفش في مصر. عروض حصرية على أوناش رفع الأثاث وخصومات تصل إلى 30% على التغليف والفك والتركيب. احسب تكلفتك الآن.',
        'keywords': 'اسعار نقل الاثاث, اسعار نقل العفش, ارخص شركة نقل اثاث, تكلفة ونش رفع الاثاث, عروض نقل الاثاث, اسعار ونش العفش, سعر نقل العفش بالقاهرة, تكلفة نقل الموبيليا',
        'placename': 'القاهرة والجيزة، مصر',
        'lat': 30.0626,
        'lng': 31.2497,
        'region': 'EG-C'
    },
    'areas.html': {
        'title': 'مناطق وفروع نقل الأثاث والعفش بالقاهرة والجيزة | تغطية شاملة — العالمي',
        'desc': 'دليل شامل لخدمات نقل الأثاث ونقل العفش في كافة أحياء القاهرة والجيزة: مصر الجديدة، مدينة نصر، المعادي، التجمع، أكتوبر، الشيخ زايد، والهرم بأسرع وقت وأعلى جودة.',
        'keywords': 'مناطق نقل الاثاث, فروع نقل العفش, نقل اثاث القاهرة, نقل اثاث الجيزة, نقل عفش اكتوبر, نقل عفش التجمع, نقل اثاث الشيخ زايد, نقل اثاث المعادي, نقل عفش الهرم',
        'placename': 'القاهرة والجيزة، مصر',
        'lat': 30.0626,
        'lng': 31.2497,
        'region': 'EG-C'
    },
    'contact.html': {
        'title': 'تواصل معنا | حجز واستفسار نقل الأثاث والعفش — شركة العالمي',
        'desc': 'تواصل مباشرة مع شركة العالمي لنقل الأثاث والعفش. خدمة عملاء 24/7 عبر الهاتف والواتساب 01033188096 لطلب المعاينة وحجز أوناش الرفع وسيارات النقل بأفضل عرض سعر.',
        'keywords': 'تواصل شركة نقل اثاث, رقم شركة نقل عفش, حجز ونش رفع اثاث, تليفون نقل اثاث بالقاهرة, رقم ونش عفش, استفسار نقل اثاث, ارقام سيارات نقل عفش',
        'placename': 'القاهرة والجيزة، مصر',
        'lat': 30.0626,
        'lng': 31.2497,
        'region': 'EG-C'
    },
    'about.html': {
        'title': 'من نحن | شركة العالمي الرائدة في نقل وتغليف الأثاث والعفش بمصر',
        'desc': 'تعرف على تاريخ شركة العالمي لنقل وتغليف الأثاث، أسطول السيارات المجهزة، كوادر النجارين والفنيين المحترفين، والتزامنا بضمان سلامة العفش وسرعة التنفيذ بأعلى جودة.',
        'keywords': 'عن شركة العالمي, افضل شركة نقل اثاث, تاريخ شركة نقل عفش, عمال نقل اثاث محترفين, شركة نقل اثاث مرخصة, ضمان نقل العفش',
        'placename': 'القاهرة والجيزة، مصر',
        'lat': 30.0626,
        'lng': 31.2497,
        'region': 'EG-C'
    },
    'faq.html': {
        'title': 'الأسئلة الشائعة عن نقل وتغليف الأثاث والعفش | شركة العالمي',
        'desc': 'إجابات شاملة لجميع استفسارات نقل الأثاث والعفش: أسعار النقل، مواعيد العمل، أقصى ارتفاع لأوناش الرفع، طرق تغليف التحف والزجاج، وضمانات سلامة المنقولات.',
        'keywords': 'اسئلة نقل الاثاث, كيف اختار شركة نقل عفش, نصائح نقل الاثاث, اسئلة ونش رفع الاثاث, ضمان نقل العفش, ارخص ونش رفع اثاث',
        'placename': 'القاهرة والجيزة، مصر',
        'lat': 30.0626,
        'lng': 31.2497,
        'region': 'EG-C'
    },
    'blog.html': {
        'title': 'مدونة نقل الأثاث والعفش | نصائح وإرشادات الانتقال الآمن — العالمي',
        'desc': 'مقالات وإرشادات احترافية حول نقل وتغليف الأثاث، نصائح تجهيز العفش قبل الانتقال، كيفية اختيار الونش المناسب، وأفضل طرق حماية الموبيليا والأجهزة الكهربائية.',
        'keywords': 'نصائح نقل الاثاث, دليل نقل العفش, كيف ارتب نقل العفش, ارشادات تغليف الاثاث, ونش نقل العفش, حماية الموبيليا اثناء النقل',
        'placename': 'القاهرة والجيزة، مصر',
        'lat': 30.0626,
        'lng': 31.2497,
        'region': 'EG-C'
    },
    'team.html': {
        'title': 'فريق عمل شركة العالمي | فنيو ونجارو نقل وتغليف الأثاث المحترفون',
        'desc': 'تعرف على طاقم عمل العالمي: نخبة من النجارين المتخصصين في فك وتركيب الموبيليا، فنيي الأجهزة والتكييف، سائقي أسطول الشاحنات، ومشغلي أوناش الرفع الهيدروليكية.',
        'keywords': 'فريق نقل الاثاث, عمال نقل عفش, نجار فك وتركيب موبيليا, فني نقل اثاث, سائقين شاحنات نقل عفش, ونش رفع اثاث',
        'placename': 'القاهرة والجيزة، مصر',
        'lat': 30.0626,
        'lng': 31.2497,
        'region': 'EG-C'
    }
}

def get_coords(area_name, gov_name):
    # Direct match
    for k, v in GEO_COORDS.items():
        if k in area_name or area_name in k:
            return v
    if gov_name == 'القاهرة':
        return (30.0626, 31.2497)
    return (30.0131, 31.2089)

def build_schema_json(is_core, page_url, title, desc, area_name, gov_name, lat, lng):
    graph = [
        {
            "@type": "WebSite",
            "@id": "https://alamyasas.vercel.app/#website",
            "url": "https://alamyasas.vercel.app",
            "name": "شركة العالمي لنقل وتغليف الأثاث والعفش",
            "inLanguage": "ar-EG"
        },
        {
            "@type": "MovingCompany",
            "@id": "https://alamyasas.vercel.app/#business",
            "name": "شركة العالمي لنقل وتغليف الأثاث",
            "url": "https://alamyasas.vercel.app",
            "telephone": "+20 10 33188096",
            "email": "thmanjmalmar94@gmail.com",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "ميدان عبده باشا بجوار كلية الهندسة، القاهرة، مصر",
                "addressLocality": "القاهرة",
                "addressRegion": "القاهرة",
                "addressCountry": "EG"
            },
            "geo": {
                "@type": "GeoCoordinates",
                "latitude": round(lat, 4),
                "longitude": round(lng, 4)
            },
            "areaServed": [
                {"@type": "AdministrativeArea", "name": "القاهرة"},
                {"@type": "AdministrativeArea", "name": "الجيزة"},
                {"@type": "AdministrativeArea", "name": area_name}
            ],
            "priceRange": "EGP",
            "currenciesAccepted": "EGP",
            "paymentAccepted": "Cash, Credit Card, Bank Transfer, Vodafone Cash",
            "serviceType": [
                "نقل أثاث",
                "نقل عفش",
                "ونش رفع أثاث هيدروليكي",
                "تغليف عفش بالكرتون والبابلز",
                "فك وتركيب موبيليا ومطابخ",
                "سيارات نقل عفش مغلقة"
            ],
            "knowsAbout": [
                f"نقل أثاث وعفش في {area_name}",
                "أوناش رفع هيدروليكية حتى الأدوار العليا",
                "تغليف وحماية المنقولات الحساسة",
                "شاحنات مغلقة مجهزة لنقل الموبيليا"
            ],
            "openingHours": "Mo-Su 00:00-23:59",
            "sameAs": [
                "https://www.facebook.com/alalmytrans?locale=ar_AR",
                "https://www.instagram.com/shrkllmylnql"
            ]
        }
    ]

    if not is_core:
        # Service Schema
        graph.append({
            "@type": "Service",
            "name": f"خدمة نقل الأثاث والعفش في {area_name}",
            "serviceType": "نقل وتغليف الأثاث والعفش",
            "provider": {"@id": "https://alamyasas.vercel.app/#business"},
            "areaServed": {
                "@type": "AdministrativeArea",
                "name": area_name,
                "containedInPlace": {"@type": "AdministrativeArea", "name": gov_name}
            },
            "hasMap": f"https://www.google.com/maps/search/?api=1&query={urllib.parse.quote('نقل أثاث ' + area_name + ' ' + gov_name)}"
        })

    # WebPage Schema
    webpage_obj = {
        "@type": "WebPage",
        "@id": page_url,
        "url": page_url,
        "name": title,
        "description": desc,
        "inLanguage": "ar-EG",
        "isPartOf": {"@type": "WebSite", "@id": "https://alamyasas.vercel.app/#website"}
    }

    if not is_core:
        webpage_obj["breadcrumb"] = {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "الرئيسية", "item": "https://alamyasas.vercel.app/"},
                {"@type": "ListItem", "position": 2, "name": "مناطق الخدمة", "item": "https://alamyasas.vercel.app/areas.html"},
                {"@type": "ListItem", "position": 3, "name": area_name, "item": page_url}
            ]
        }

    graph.append(webpage_obj)

    return json.dumps({"@context": "https://schema.org", "@graph": graph}, ensure_ascii=False, indent=2)

def update_file(filepath):
    filename = os.path.basename(filepath)
    is_core = filename in CORE_PAGES

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    canonical_url = f"https://alamyasas.vercel.app/{filename if filename != 'index.html' else ''}"

    if is_core:
        info = CORE_PAGES[filename]
        title = info['title']
        desc = info['desc']
        keywords = info['keywords']
        placename = info['placename']
        lat, lng = info['lat'], info['lng']
        region = info['region']
        area_name = 'القاهرة والجيزة'
        gov_name = 'مصر'
    else:
        # Extract gov and area
        m = re.search(r'<div class="eyebrow">([^·<]+)·([^<]+)</div>', content)
        if not m:
            print(f"Skipping {filename}: eyebrow not found")
            return False
        gov_name = m.group(1).strip()
        area_name = m.group(2).strip()

        title = f"نقل أثاث وعفش في {area_name} | ونش رفع وتغليف — شركة العالمي"
        desc = f"أفضل شركة نقل أثاث ونقل عفش في {area_name}، {gov_name}. أحدث أوناش رفع العفش الهيدروليكية، سيارات نقل مغلقة مجهزة، فك وتغليف وتركيب الموبيليا بأرخص الأسعار وضمان شامل."
        keywords = f"نقل اثاث في {area_name}, نقل عفش في {area_name}, شركة نقل اثاث {area_name}, شركة نقل عفش {area_name}, ونش رفع اثاث {area_name}, ونش رفع عفش {area_name}, اوناش رفع الاثاث {area_name}, فك وتركيب عفش {area_name}, تغليف اثاث {area_name}, ارخص شركة نقل عفش {area_name}, افضل شركة نقل اثاث {area_name}, سيارات نقل عفش {area_name}, نقل اثاث {gov_name}, نقل عفش {gov_name}"
        placename = f"{area_name}، {gov_name}، مصر"
        lat, lng = get_coords(area_name, gov_name)
        region = 'EG-C' if gov_name == 'القاهرة' else 'EG-GZ'

    # 1. Update <title>
    content = re.sub(r'<title>.*?</title>', f'<title>{title}</title>', content)

    # 2. Update <meta name="description">
    content = re.sub(r'<meta name="description" content=".*?">', f'<meta name="description" content="{desc}">', content)

    # 3. Update OG & Twitter titles & descriptions
    content = re.sub(r'<meta property="og:title" content=".*?">', f'<meta property="og:title" content="{title}">', content)
    content = re.sub(r'<meta property="og:description" content=".*?">', f'<meta property="og:description" content="{desc}">', content)
    content = re.sub(r'<meta name="twitter:title" content=".*?">', f'<meta name="twitter:title" content="{title}">', content)
    content = re.sub(r'<meta name="twitter:description" content=".*?">', f'<meta name="twitter:description" content="{desc}">', content)

    # 4. Remove any existing keywords/geo/DC/manifest tags to cleanly insert fresh ones
    content = re.sub(r'<meta name="keywords"[^>]*>', '', content)
    content = re.sub(r'<meta name="geo\.[^"]*"[^>]*>', '', content)
    content = re.sub(r'<meta name="ICBM"[^>]*>', '', content)
    content = re.sub(r'<meta name="DC\.[^"]*"[^>]*>', '', content)
    content = re.sub(r'<link rel="manifest"[^>]*>', '', content)

    # 5. Build rich SEO & Geo tags
    seo_geo_tags = f"""<meta name="keywords" content="{keywords}">
<meta name="geo.region" content="{region}">
<meta name="geo.placename" content="{placename}">
<meta name="geo.position" content="{lat};{lng}">
<meta name="ICBM" content="{lat}, {lng}">
<meta name="DC.title" content="{title}">
<meta name="DC.creator" content="شركة العالمي لنقل وتغليف الأثاث">
<meta name="DC.coverage" content="{placename}">
<meta name="DC.language" content="ar">
<link rel="manifest" href="site.webmanifest">"""

    # Insert right after the description meta tag
    desc_tag = f'<meta name="description" content="{desc}">'
    content = content.replace(desc_tag, f'{desc_tag}\n{seo_geo_tags}')

    # 6. Update Schema JSON-LD
    new_schema = f'<script type="application/ld+json">\n{build_schema_json(is_core, canonical_url, title, desc, area_name, gov_name, lat, lng)}\n</script>'
    content = re.sub(r'<script type="application/ld\+json">.*?</script>', new_schema, content, flags=re.DOTALL)

    # 7. For area pages: enrich on-page content with area SEO tags & FAQs if not present
    if not is_core:
        seo_badge_html = f'''<div class="area-seo-tags" aria-label="خدمات نقل العفش والأثاث في {area_name}">
<span class="seo-tag">🚚 نقل عفش متكامل في {area_name}</span>
<span class="seo-tag">🏗️ ونش رفع أثاث هيدروليكي</span>
<span class="seo-tag">📦 تغليف عفش بالكرتون والبابلز</span>
<span class="seo-tag">🔧 فك وتركيب غرف نوم ومطابخ</span>
<span class="seo-tag">🚛 سيارات نقل عفش مغلقة مجهزة</span>
<span class="seo-tag">⚡ أرخص أسعار نقل الأثاث</span>
</div>'''
        # Check if already has area-seo-tags
        if 'class="area-seo-tags"' not in content:
            # Insert right after <h2>خدمات العالمي المتاحة في {area_name}</h2>
            pattern = re.compile(rf'(<h2>خدمات العالمي المتاحة في {re.escape(area_name)}</h2>\s*<p>.*?</p>)', re.DOTALL)
            if pattern.search(content):
                content = pattern.sub(rf'\1\n{seo_badge_html}', content, count=1)
            else:
                # Fallback: insert after location-benefits
                content = content.replace('</div></div><h2>خدمات العالمي', f'</div></div>\n{seo_badge_html}\n<h2>خدمات العالمي')

        # Add FAQ questions for winches and luggage if not present
        if f'ونش رفع أثاث (ونش عفش) في {area_name}' not in content:
            faq_extra = f'''<div class="faq-item"><button type="button"><span>هل توفرون ونش رفع أثاث (ونش عفش) في {area_name}؟</span><b>+</b></button><p>نعم، نوفر أحدث أوناش رفع العفش الهيدروليكية والكهربائية في {area_name} للوصول إلى كافة الأدوار المرتفعة بأمان وسرعة لحماية الأثاث والمداخل والسلالم من أي خدش.</p></div>
<div class="faq-item"><button type="button"><span>ما هي تكلفة وأسعار نقل العفش في {area_name}؟</span><b>+</b></button><p>نقدم أرخص وأفضل أسعار نقل الأثاث والعفش في {area_name} مع باقات مخصصة تشمل الفك والتركيب والتغليف، بالإضافة إلى خصومات مميزة على حجز الونش وسيارات النقل المغلقة.</p></div>'''
            # Append before closing faq-list
            content = content.replace('</div></section><section class="location-booking', f'{faq_extra}\n</div></section><section class="location-booking')
            content = content.replace('</div></div></section></main>', f'{faq_extra}\n</div></div></section></main>')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    return True

def main():
    files = sorted(glob.glob('public/*.html'))
    print(f"Starting SEO & Geo-SEO optimization for {len(files)} pages...")
    count = 0
    for f in files:
        if update_file(f):
            count += 1
    print(f"Successfully optimized {count} pages!")

if __name__ == '__main__':
    main()
