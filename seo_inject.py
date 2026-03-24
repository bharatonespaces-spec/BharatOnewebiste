import os

def update_index():
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    new_ld = """<!-- JSON-LD Structured Data for SEO -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "BharatOne Spaces",
      "url": "https://bharatonespaces.com",
      "logo": "https://bharatonespaces.com/images/bharatone-spaces-logo.webp",
      "foundingDate": "1996",
      "founder": {
        "@type": "Person",
        "name": "Karunesh Verma"
      },
      "description": "Premium turnkey office spaces and coworking environments in Navi Mumbai and Pune, empowering startups and established enterprises.",
      "sameAs": [
        "https://www.linkedin.com/company/bharatonespaces"
      ]
    }
    </script>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [{
        "@type": "Question",
        "name": "Is there a lock-in period for office spaces at BharatOne?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "BharatOne Spaces offers flexible terms with no strict lock-in periods, allowing startups to scale up or down as needed."
        }
      }]
    }
    </script>
    <!-- Open Graph Tags -->
    <meta property="og:title" content="BharatOne Spaces | Turnkey Offices in Navi Mumbai & Pune" />
    <meta property="og:description" content="Launch your business today with fully furnished, plug-and-play offices near NMIA and Pune Camp." />
    <meta property="og:image" content="https://bharatonespaces.com/images/bharatone-spaces-jasai-premium-workspace.webp" />
    <meta property="og:url" content="https://bharatonespaces.com/" />
    <meta property="og:type" content="website" />
    <!-- Canonical Tag -->
    <link rel="canonical" href="https://bharatonespaces.com/" />
"""
    # Find the start of JSON-LD in index
    start_str = "<!-- JSON-LD Structured Data for SEO -->"
    end_str = "</script>\n</head>"
    start_idx = html.find(start_str)
    
    # We want to replace everything from start_idx up to the point just before </head>
    if start_idx != -1:
        # Find the </script> tag associated with it. We know it ends after the block.
        # Actually just replace start_idx to the next </script> but let's be careful.
        # Let's search for </head> and replace everything between start_idx and </head>
        head_idx = html.find("</head>")
        html = html[:start_idx] + new_ld + html[head_idx:]
    else:
        html = html.replace('</head>', new_ld + '\n</head>')
        
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Updated index.html")

def update_jasai():
    filepath = 'locations/jasai-logistics-office.html'
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return
        
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()

    new_ld = """<!-- JSON-LD Structured Data for Jasai Location -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "CoworkingSpace",
      "name": "BharatOne Spaces - Jasai",
      "image": "https://bharatonespaces.com/images/bharatone-spaces-jasai-logistics-office.webp",
      "@id": "https://bharatonespaces.com/locations/jasai-logistics-office",
      "url": "https://bharatonespaces.com/locations/jasai-logistics-office",
      "telephone": "+918899661111",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Near Dastan Fata, Near Maruti/Nexa Workshop, Jasai",
        "addressLocality": "Navi Mumbai",
        "postalCode": "410206",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 18.8924,
        "longitude": 73.0371
      },
      "priceRange": "$$"
    }
    </script>
    <!-- Open Graph Tags -->
    <meta property="og:title" content="Box Office Jasai | Logistics Hub Near NMIA & JNPT" />
    <meta property="og:description" content="Plug-and-play offices for NMIA contractors, logistics consultants, and growing businesses. Located 12 minutes from NMIA Terminal 1." />
    <meta property="og:image" content="https://bharatonespaces.com/images/bharatone-spaces-jasai-logistics-office.webp" />
    <meta property="og:url" content="https://bharatonespaces.com/locations/jasai-logistics-office" />
    <meta property="og:type" content="website" />
    <!-- Canonical Tag -->
    <link rel="canonical" href="https://bharatonespaces.com/locations/jasai-logistics-office" />
"""
    start_str = "<!-- JSON-LD Structured Data for Jasai Location -->"
    start_idx = html.find(start_str)
    
    if start_idx != -1:
        # Find next </style> or </head>
        head_idx = html.find("<style>")
        if head_idx == -1: head_idx = html.find("</head>")
        html = html[:start_idx] + new_ld + html[head_idx:]
    else:
        html = html.replace('</head>', new_ld + '\n</head>')
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)
    print("Updated jasai-logistics-office.html")
    
def update_pune():
    filepath = 'locations/pune-camp.html'
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return
        
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()

    new_ld = """<!-- JSON-LD Structured Data for Pune Location -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "CoworkingSpace",
      "name": "BharatOne Spaces - Pune Camp",
      "image": "https://bharatonespaces.com/images/bharatone-spaces-pune-camp-coworking-1.webp",
      "@id": "https://bharatonespaces.com/locations/pune-camp",
      "url": "https://bharatonespaces.com/locations/pune-camp",
      "telephone": "+918899661111",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Deccan Tower, Camp",
        "addressLocality": "Pune",
        "addressRegion": "MH",
        "postalCode": "411001",
        "addressCountry": "IN"
      },
      "priceRange": "$$"
    }
    </script>
    <!-- Open Graph Tags -->
    <meta property="og:title" content="Pune Camp Business Centre | Premium Coworking Space" />
    <meta property="og:description" content="Premium business center in Pune Camp offering zero setup time, fully furnished offices and professional infrastructure." />
    <meta property="og:image" content="https://bharatonespaces.com/images/bharatone-spaces-pune-camp-coworking-1.webp" />
    <meta property="og:url" content="https://bharatonespaces.com/locations/pune-camp" />
    <meta property="og:type" content="website" />
    <!-- Canonical Tag -->
    <link rel="canonical" href="https://bharatonespaces.com/locations/pune-camp" />
"""
    html = html.replace('</head>', new_ld + '\n</head>')
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)
    print("Updated pune-camp.html")

if __name__ == '__main__':
    update_index()
    update_jasai()
    update_pune()
