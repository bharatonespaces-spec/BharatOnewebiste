// Auto-Posting Engine for BharatOne Spaces
// Generates SEO-optimized blog articles using Gemini AI and publishes daily
//
// Usage:
//   node auto-poster.js              (generate and publish one article)
//   node auto-poster.js --dry-run    (generate without publishing)
//
// Setup: Set your API key in GEMINI_API_KEY below or as environment variable

const fs = require('fs');
const path = require('path');
const https = require('https');
const { exec } = require('child_process');

// ============================================================
// CONFIGURATION — Set your Gemini API key here
// ============================================================
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyC81LIJfCxFdYF62Td0tPqSfMpiDNioO3c';
const WEBSITE_DIR = __dirname;
const BLOG_DIR = path.join(WEBSITE_DIR, 'public', 'blog');
const BLOG_HTML = path.join(WEBSITE_DIR, 'blog.html');
const LOG_FILE = path.join(WEBSITE_DIR, 'auto-post-log.json');
const DRY_RUN = process.argv.includes('--dry-run');

// ============================================================
// BUSINESS CONTEXT — Teaches Gemini about your business
// ============================================================
const BUSINESS_CONTEXT = `
BharatOne Spaces (Bharat One Spaces) is a premium commercial office space provider with two locations:

1. BOX OFFICE JASAI — Near Navi Mumbai International Airport (NMIA) and JNPT Port
   - Address: Near Dastan Fata, Jasai, Uran, Navi Mumbai
   - USP: 12 min to NMIA, 8 min to JNPT, Connected via Atal Setu (MTHL)
   - Near Jasai Railway Station
   - Offices from ₹4,999/month
   - Target: Logistics, aviation services, freight forwarders, customs agents, startups

2. PUNE CAMP — Deccan Tower, Camp area, Pune
   - Premium business address in the heart of Pune
   - Target: Professionals, consultants, startups, service businesses

Key facts:
- NMIA (Navi Mumbai International Airport) is operational 24/7 since 2026
- JNPT handles 50%+ of India's containerized cargo
- Atal Setu (MTHL) connects Jasai area to Mumbai in 20 minutes
- Phone: +91 8899661111
- Website: bharatonespaces.com
`;

// ============================================================
// TOPIC CATEGORIES — Audience-targeted content themes
// ============================================================
const TOPIC_CATEGORIES = [
    {
        category: 'Logistics & Maritime',
        keywords: ['office near JNPT', 'logistics office navi mumbai', 'freight forwarder office', 'customs clearance office jasai', 'JNPT road commercial space'],
        angles: [
            'Why freight forwarders need an office near JNPT port',
            'How JNPT road is becoming a commercial hotspot',
            'Setting up a customs clearance office near JNPT',
            'Top reasons logistics companies choose Jasai',
            'Cost of running a logistics office in Navi Mumbai vs Mumbai',
            'JNPT port expansion impact on nearby commercial real estate',
            'Best practices for freight forwarding office setup near a major port',
            'Why proximity to JNPT gives your logistics business an edge'
        ]
    },
    {
        category: 'Aviation & NMIA',
        keywords: ['office near NMIA', 'navi mumbai airport office', 'aviation office space', 'airport business hub', 'NMIA commercial space'],
        angles: [
            'How NMIA is creating a new business district in Jasai',
            'Best office locations near Navi Mumbai International Airport',
            'Aviation services office setup near NMIA',
            'NMIA 24/7 operations impact on commercial property',
            'Airport hotels vs office spaces near NMIA',
            'Ground handling companies office requirements near NMIA',
            'Jasai as the next big airport business hub',
            'How NMIA connectivity boosts business productivity'
        ]
    },
    {
        category: 'Startups & Coworking',
        keywords: ['coworking space navi mumbai', 'startup office jasai', 'affordable office space', 'plug and play office', 'shared office navi mumbai'],
        angles: [
            'Why startups should consider Jasai over BKC',
            'Plug-and-play offices vs traditional offices for startups',
            'How coworking spaces boost startup productivity',
            'Affordable office solutions for bootstrapped startups',
            'First office checklist for Indian startups',
            'Virtual office address benefits for new businesses',
            'How to choose between coworking and private office',
            'The hidden costs of working from home vs coworking'
        ]
    },
    {
        category: 'Pune Business',
        keywords: ['office space pune camp', 'business address pune', 'coworking pune', 'commercial office pune', 'professional office pune camp'],
        angles: [
            'Why Pune Camp is the best business address for professionals',
            'Pune Camp vs Hinjewadi for office space',
            'Top reasons consultants choose Camp area offices',
            'Commercial office trends in Pune 2026',
            'Affordable professional office space in Pune city center',
            'Business advantages of a Camp Pune office address',
            'Freelancer guide to coworking spaces in Pune',
            'Why a premium office address matters for client trust'
        ]
    },
    {
        category: 'Infrastructure & Connectivity',
        keywords: ['atal setu business impact', 'MTHL connectivity', 'navi mumbai infrastructure', 'mumbai pune connectivity', 'jasai connectivity'],
        angles: [
            'How Atal Setu is transforming business connectivity in Jasai',
            'The Golden Triangle: NMIA, JNPT, and Atal Setu',
            'Navi Mumbai infrastructure boom and what it means for business',
            'Transit times from Jasai to key business destinations',
            'How improved connectivity is driving office demand in Uran',
            'Mumbai to Navi Mumbai commute: before and after Atal Setu',
            'Infrastructure developments making Jasai a business hub',
            'Why connectivity matters more than rent for office location'
        ]
    },
    {
        category: 'Commercial Real Estate',
        keywords: ['commercial real estate navi mumbai', 'office investment jasai', 'property near NMIA', 'commercial property JNPT road', 'real estate uran'],
        angles: [
            'Jasai commercial real estate: investment guide 2026',
            'How airport proximity increases commercial property value',
            'Rent vs buy: office space near NMIA',
            'Top emerging commercial corridors in Navi Mumbai',
            'Why JNPT road is the next commercial property goldmine',
            'Commercial real estate appreciation near airports worldwide',
            'Office space demand forecast for Jasai and Uran',
            'Smart investor guide to Navi Mumbai commercial property'
        ]
    },
    {
        category: 'Work Culture & Productivity',
        keywords: ['office productivity tips', 'work environment design', 'professional workspace', 'business productivity', 'office amenities'],
        angles: [
            'How your office environment impacts client meetings',
            'Why a professional address builds business credibility',
            'The psychology of a premium workspace on productivity',
            'Essential office amenities for modern businesses',
            'How to create a productive small team workspace',
            'Remote work fatigue: why professionals are returning to offices',
            'The business case for investing in a good office space',
            'How office location affects employee retention'
        ]
    }
];

// ============================================================
// LOG MANAGEMENT — Track published articles to avoid duplicates
// ============================================================
function loadLog() {
    try {
        return JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'));
    } catch {
        return { articles: [] };
    }
}

function saveLog(log) {
    fs.writeFileSync(LOG_FILE, JSON.stringify(log, null, 2), 'utf8');
}

function getPublishedTitles() {
    const log = loadLog();
    return log.articles.map(a => a.title.toLowerCase());
}

// ============================================================
// GEMINI API — Call Gemini to generate content
// ============================================================
function callGemini(prompt) {
    return new Promise((resolve, reject) => {
        // Try models in order of preference (each has separate quota)
        const models = ['gemini-2.5-flash-lite', 'gemini-2.5-flash', 'gemini-2.0-flash-lite', 'gemini-2.0-flash'];
        
        function tryModel(index, retryCount = 0) {
            if (index >= models.length) {
                reject(new Error('All Gemini models failed. Your API quota may be exhausted. Check https://ai.dev/rate-limit'));
                return;
            }
            
            const model = models[index];
            if (retryCount === 0) {
                console.log(`   Trying model: ${model}...`);
            } else {
                console.log(`   🔄 Retrying model ${model} (Attempt ${retryCount}/3)...`);
            }
            
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
            const postData = JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.8,
                    topP: 0.95,
                    maxOutputTokens: 8192
                }
            });

            const urlObj = new URL(url);
            const options = {
                hostname: urlObj.hostname,
                path: urlObj.pathname + urlObj.search,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(postData)
                }
            };

            const req = https.request(options, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        const json = JSON.parse(data);
                        if (json.error) {
                            // If quota error, try next model
                            if (json.error.message && json.error.message.includes('quota')) {
                                console.log(`   ⚠️  ${model} quota exceeded, trying next...`);
                                tryModel(index + 1, 0);
                                return;
                            }
                            
                            // Retry on 5xx server errors
                            if (res.statusCode >= 500 && retryCount < 3) {
                                const delay = Math.pow(2, retryCount) * 2000;
                                console.log(`   ⚠️  Server error (${res.statusCode}): ${json.error.message}. Retrying in ${delay/1000}s...`);
                                setTimeout(() => tryModel(index, retryCount + 1), delay);
                                return;
                            }
                            
                            reject(new Error(json.error.message));
                            return;
                        }
                        const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
                        if (!text) reject(new Error('Empty response from Gemini'));
                        else {
                            if (retryCount === 0) console.log(`   ✅ Using model: ${model}`);
                            else console.log(`   ✅ Success after retry using model: ${model}`);
                            resolve(text);
                        }
                    } catch (e) {
                         // Retry on parse errors (often caused by incomplete/bad responses during server load)
                         if (retryCount < 3) {
                            const delay = Math.pow(2, retryCount) * 2000;
                            console.log(`   ⚠️  Failed to parse response. Retrying in ${delay/1000}s...`);
                            setTimeout(() => tryModel(index, retryCount + 1), delay);
                            return;
                        }
                        reject(new Error('Failed to parse Gemini response: ' + e.message));
                    }
                });
            });
            req.on('error', (err) => {
                // Retry on network/DNS errors (e.g. ENOTFOUND, ECONNRESET, ETIMEDOUT)
                if (retryCount < 3) {
                    const delay = Math.pow(2, retryCount) * 5000; // 5s, 10s, 20s
                    console.log(`   ⚠️  Network error: ${err.code || err.message}. Retrying in ${delay/1000}s...`);
                    setTimeout(() => tryModel(index, retryCount + 1), delay);
                    return;
                }
                reject(err);
            });
            req.write(postData);
            req.end();
        }
        
        tryModel(0, 0);
    });
}

// ============================================================
// TOPIC PICKER — Intelligently select a topic
// ============================================================
function pickTopic() {
    const publishedTitles = getPublishedTitles();
    
    // Flatten all angles
    const allAngles = [];
    for (const cat of TOPIC_CATEGORIES) {
        for (const angle of cat.angles) {
            // Skip if we've already published something similar
            const lowerAngle = angle.toLowerCase();
            const isDuplicate = publishedTitles.some(t => {
                // Check for significant word overlap
                const tWords = t.split(/\s+/).filter(w => w.length > 4);
                const aWords = lowerAngle.split(/\s+/).filter(w => w.length > 4);
                const matches = tWords.filter(w => aWords.includes(w)).length;
                return matches >= 3;
            });
            if (!isDuplicate) {
                allAngles.push({ angle, category: cat.category, keywords: cat.keywords });
            }
        }
    }

    if (allAngles.length === 0) {
        console.log('⚠️  All predefined topics used. Generating fresh topic...');
        const randomCat = TOPIC_CATEGORIES[Math.floor(Math.random() * TOPIC_CATEGORIES.length)];
        return { angle: null, category: randomCat.category, keywords: randomCat.keywords, generateNew: true };
    }

    // Pick random unused topic
    const pick = allAngles[Math.floor(Math.random() * allAngles.length)];
    return { ...pick, generateNew: false };
}

// ============================================================
// ARTICLE GENERATOR — Full SEO-optimized article
// ============================================================
async function generateArticle() {
    const topic = pickTopic();
    
    let topicInstruction;
    if (topic.generateNew) {
        topicInstruction = `Pick a FRESH, creative topic related to "${topic.category}" that hasn't been covered before. Make it specific and interesting.`;
    } else {
        topicInstruction = `Write about this topic: "${topic.angle}"`;
    }

    const prompt = `Role and Objective: You are an expert Commercial Real Estate and Generative Engine Optimization (GEO) Blog Writer. Your objective is to write highly optimized, informative, and factual blog articles that rank at the top of traditional search engines (Google) and get cited by AI Answer Engines (ChatGPT, Perplexity, Google AI Overviews).

Target Audience: Every article you write must be directly tailored to the needs, pain points, and terminology of the following audience: Customs House Agents (CHAs), Air/Sea Freight Forwarders, EXIM (Export-Import) Traders, Transport & Fleet Dispatch Operators, Cargo General Sales Agents (GSAs), and 3PL & 4PL Logistics Planners. Use industry-specific terminology relevant to them.

Writing Guidelines (GEO & SEO Rules):
No Marketing Fluff: Keep the tone neutral, objective, and authoritative. Do not use promotional language like "the best revolutionary spaces." Provide factual value.
Define Local Terms: If you use acronyms (like JNPT, NMIA, CIDCO, MTHL), provide a clear, one-sentence definition the first time they appear.
Use Concrete Data: Integrate specific statistics, travel times, distances, and cost estimates to build trust.
Answer Immediately: Immediately after any H2 or H3 question, provide a direct, concise answer in exactly 40 to 60 words before expanding further.
Skimmability: Use short paragraphs (2-3 sentences max), bullet points, and numbered lists frequently.

BUSINESS CONTEXT:
${BUSINESS_CONTEXT}

TOPIC TO COVER:
${topicInstruction}
Related keywords to target: ${topic.keywords.join(', ')}

OUTPUT FORMAT (JSON object only):
{
  "title": "H1 Title: Engaging, SEO-optimized title containing primary location and logistics keyword",
  "description": "Meta Description: 1-2 sentences (under 160 characters) summarizing core value with a hook",
  "keywords": "8-10 highly specific, long-tail and short-tail keywords targeting the logistics and EXIM audience. CRITICAL: Return as a COMMA-SEPARATED STRING, not an array.",
  "tldr": "**Executive Summary / TL;DR**: 2-3 sentences explicitly stating the core takeaway of the article.",
  "articleHTML": "Full article body in clean HTML. You must structure the article exactly like this:
    - [Executive Summary / TL;DR]: Start with a 2-3 sentence summary explicitly stating the core takeaway of the article.
    - [H2s as Questions]: Structure all H2s as natural language questions.
    - [Immediately answer the question in 40-60 words directly beneath the H2].
    - [Follow the short answer with bullet points expanding on the benefits/details for logistics planners and forwarders].
    - [Include a Table]: Somewhere in the article, under a relevant H2, include an HTML table presenting data (e.g., comparing transit times, rental rates, or warehouse specifications).
    - [Frequently Asked Questions (FAQs)]: End the article with an H2 titled \\"Frequently Asked Questions\\".
    - Under this, include 3 highly relevant questions using H3 tags. Provide a direct 40-word answer under each H3."
}

CRITICAL: Return ONLY the raw JSON object. No markdown code blocks. No explanations.`;

    console.log('🧠 Generating article with Gemini AI...');
    console.log(`   Category: ${topic.category}`);
    if (topic.angle) console.log(`   Topic: ${topic.angle}`);

    const response = await callGemini(prompt);
    
    // Parse JSON from response (handle possible markdown fencing)
    let cleaned = response.trim();
    if (cleaned.startsWith('```json')) cleaned = cleaned.slice(7);
    if (cleaned.startsWith('```')) cleaned = cleaned.slice(3);
    if (cleaned.endsWith('```')) cleaned = cleaned.slice(0, -3);
    cleaned = cleaned.trim();
    
    // Sanitize control characters only inside JSON string values
    // This regex finds content between quotes and removes problematic chars
    cleaned = cleaned.replace(/"((?:[^"\\]|\\.)*)"/g, (match, content) => {
        const sanitized = content
            .replace(/\t/g, '\\t')
            .replace(/\r\n/g, '\\n')
            .replace(/\r/g, '\\n')
            .replace(/\n/g, '\\n')
            .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
        return '"' + sanitized + '"';
    });
    
    let article;
    try {
        article = JSON.parse(cleaned);
    } catch (parseErr) {
        // If still fails, try asking Gemini to fix it
        console.log('   ⚠️  JSON parse failed, retrying with repair...');
        const fixPrompt = 'The following text should be valid JSON with keys: title, description, keywords, articleHTML. Fix any JSON syntax errors and return ONLY the valid JSON:\n\n' + cleaned.substring(0, 5000);
        const fixed = await callGemini(fixPrompt);
        let fixCleaned = fixed.trim();
        if (fixCleaned.startsWith('```json')) fixCleaned = fixCleaned.slice(7);
        if (fixCleaned.startsWith('```')) fixCleaned = fixCleaned.slice(3);
        if (fixCleaned.endsWith('```')) fixCleaned = fixCleaned.slice(0, -3);
        fixCleaned = fixCleaned.trim();
        fixCleaned = fixCleaned.replace(/"((?:[^"\\]|\\.)*)"/g, (match, content) => {
            const sanitized = content.replace(/\t/g, '\\t').replace(/\r?\n/g, '\\n').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
            return '"' + sanitized + '"';
        });
        article = JSON.parse(fixCleaned);
    }
    
    // Validate
    if (!article.title || !article.description || !article.articleHTML) {
        throw new Error('Gemini returned incomplete article data');
    }

    return {
        ...article,
        category: topic.category,
        keywords: Array.isArray(article.keywords) ? article.keywords.join(', ') : (article.keywords || topic.keywords.join(', '))
    };
}

// ============================================================
// HTML BUILDER — Creates complete blog post page
// ============================================================
function toSlug(title) {
    return title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').substring(0, 60);
}

function formatDate(d) {
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    return months[d.getMonth()] + ' ' + String(d.getDate()).padStart(2, '0') + ', ' + d.getFullYear();
}

function estimateReadTime(html) {
    const text = html.replace(/<[^>]*>/g, '');
    return Math.max(1, Math.ceil(text.trim().split(/\s+/).length / 200));
}

function getExcerpt(html, len) {
    const text = html.replace(/<[^>]*>/g, '');
    return text.substring(0, len).trim() + '...';
}

function buildPostHTML(d) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${d.description.replace(/"/g, '&quot;')}">
    <meta name="keywords" content="${String(d.keywords).replace(/"/g, '&quot;')}">
    <title>${d.title} | BharatOne Spaces</title>
    <link rel="stylesheet" href="../css/styles.css">
    <link rel="icon" type="image/png" href="../images/logo.png">
    <script type="application/ld+json">
    {"@context":"https://schema.org","@type":"Article","headline":"${d.title.replace(/"/g, '\\"')}","description":"${d.description.replace(/"/g, '\\"')}","image":"https://bharatonespaces.com/images/logo.png","author":{"@type":"Organization","name":"Bharat One Spaces","url":"https://bharatonespaces.com"},"publisher":{"@type":"Organization","name":"Bharat One Spaces","logo":{"@type":"ImageObject","url":"https://bharatonespaces.com/images/logo.png"}},"datePublished":"${d.isoDate}","dateModified":"${d.isoDate}","mainEntityOfPage":{"@type":"WebPage","@id":"https://bharatonespaces.com/blog/${d.slug}.html"}}
    </script>
    <style>
        .blog-content-wrapper{max-width:800px;margin:0 auto;padding:var(--space-8) var(--space-4)}.blog-header{margin-bottom:var(--space-8)}.blog-header h1{font-size:var(--text-4xl);margin-bottom:var(--space-4);line-height:1.2}.blog-meta{display:flex;gap:var(--space-4);color:var(--color-text-light);font-size:var(--text-sm);margin-bottom:var(--space-6)}.blog-body{font-size:var(--text-lg);line-height:1.8;color:var(--color-text)}.blog-body h2{margin-top:var(--space-10);margin-bottom:var(--space-4);font-size:var(--text-2xl);color:var(--color-primary)}.blog-body h3{margin-top:var(--space-6);margin-bottom:var(--space-3)}.blog-body p{margin-bottom:var(--space-4)}.blog-body ul,.blog-body ol{margin-bottom:var(--space-4);padding-left:var(--space-6)}.blog-body li{margin-bottom:var(--space-2);line-height:1.7}.blog-body blockquote{border-left:4px solid var(--color-accent);padding:var(--space-4) var(--space-6);margin:var(--space-6) 0;background:var(--color-off-white);border-radius:0 var(--radius-md) var(--radius-md) 0;font-style:italic;font-size:var(--text-xl);color:var(--color-primary)}.blog-cta-box{background:linear-gradient(135deg,var(--color-primary) 0%,var(--color-primary-dark) 100%);border-radius:var(--radius-xl);padding:var(--space-8);color:var(--color-white);text-align:center;margin:var(--space-8) 0}.blog-cta-box h3{color:var(--color-white);margin-bottom:var(--space-3)}.blog-cta-box p{color:rgba(255,255,255,0.9)!important;margin-bottom:var(--space-4)}
    </style>
</head>
<body>
    <header class="header"><nav class="nav container"><a href="../index.html"><img src="../images/logo.png" alt="BharatOne Spaces Logo" class="nav-logo"></a><button class="nav-toggle" aria-label="Toggle navigation"><span></span><span></span><span></span></button><ul class="nav-menu"><li><a href="../index.html" class="nav-link">Home</a></li><li><a href="../box-office-jasai.html" class="nav-link">Box Office Jasai</a></li><li><a href="../pune-camp.html" class="nav-link">Pune Camp</a></li><li><a href="../for-brokers.html" class="nav-link">For Brokers</a></li><li><a href="../blog.html" class="nav-link active">Blog</a></li><li><a href="../gallery.html" class="nav-link">Gallery</a></li><li><a href="../about.html" class="nav-link">About</a></li><li><a href="../contact.html" class="nav-link">Contact</a></li><li><a href="../contact.html#enquiry" class="btn btn-accent btn-sm">Enquire Now</a></li></ul></nav></header>
    <main class="section" style="padding-top:120px">
        <article class="blog-content-wrapper">
            <div class="blog-header text-center">
                <h1>${d.title}</h1>
                <div class="blog-meta justify-center">
                    <span>📅 ${d.formattedDate}</span>
                    <span>⏱️ ${d.readTime} min read</span>
                </div>
            </div>
            <div class="blog-body">
                <p style="margin-bottom:var(--space-6)">${d.tldr}</p>
                ${d.articleHTML}
                <div class="blog-cta-box">
                    <h3>Looking for Premium Office Space?</h3>
                    <p>Plug-and-play offices from ₹4,999/month in Jasai &amp; Pune</p>
                    <div style="display:flex;gap:var(--space-4);justify-content:center;flex-wrap:wrap">
                        <a href="../box-office-jasai.html#enquiry" class="btn btn-accent btn-lg">Book a Site Visit</a>
                        <a href="https://wa.me/918899661111?text=Hi%2C%20I%20read%20your%20blog%20and%20want%20to%20know%20more." class="btn btn-outline btn-lg" style="border-color:var(--color-white);color:var(--color-white)" target="_blank">WhatsApp Us</a>
                    </div>
                </div>
            </div>
            <div class="mt-8 pt-8" style="border-top:1px solid var(--color-light-grey)">
                <a href="../blog.html" class="btn btn-outline">&larr; Back to all articles</a>
            </div>
        </article>
    </main>
    <footer class="footer"><div class="container"><div class="footer-content"><div class="footer-section"><img src="../images/logo.png" alt="BharatOne Spaces" style="height:60px;margin-bottom:var(--space-4)"><p>Premium office spaces in Jasai and Pune.</p></div><div class="footer-section"><h3>Quick Links</h3><a href="../index.html">Home</a><a href="../about.html">About Us</a><a href="../for-brokers.html">For Brokers</a><a href="../blog.html">Blog</a><a href="../contact.html">Contact</a></div><div class="footer-section"><h3>Contact Us</h3><p>📞 <a href="tel:+918899661111">+91 8899661111</a></p><p>📱 <a href="https://wa.me/918899661111">WhatsApp Us</a></p><p>✉️ <a href="mailto:bharatonespaces@gmail.com">bharatonespaces@gmail.com</a></p></div></div><div class="footer-bottom"><p>&copy; 2026 BharatOne Spaces. All rights reserved.</p></div></div></footer>
    <a href="https://wa.me/918899661111" class="whatsapp-float pulse" target="_blank">💬</a>
    <script src="../js/main.js"></script>
</body>
</html>`;
}

function buildCardHTML(d) {
    const ex = getExcerpt(d.articleHTML, 150);
    return `
        <!-- ${d.title} -->
        <div class="card fade-in-up">
            <div class="card-content">
                <div class="blog-meta mb-4">
                    <span>📅 ${d.formattedDate}</span>
                    <span>⏱️ ${d.readTime} min read</span>
                </div>
                <h3 class="blog-title">${d.title}</h3>
                <p class="blog-excerpt mb-4">${ex}</p>
                <a href="blog/${d.slug}.html" class="btn btn-outline">Read More</a>
            </div>
        </div>
        <!-- END ${d.title} -->`;
}

// ============================================================
// DEPLOY TO NETLIFY
// ============================================================
function deployToNetlify() {
    return new Promise((resolve) => {
        console.log('🚀 Deploying to Netlify...');
        exec('npm run build && netlify deploy --prod --dir dist', { cwd: WEBSITE_DIR, timeout: 120000 }, (err, stdout, stderr) => {
            if (err) {
                console.error('❌ Deploy failed:', err.message);
                resolve(false);
            } else {
                console.log('✅ Deployed to bharatonespaces.com');
                resolve(true);
            }
        });
    });
}

// ============================================================
// MAIN — Generate, Save, Deploy
// ============================================================
async function main() {
    console.log('');
    console.log('  ╔═══════════════════════════════════════════╗');
    console.log('  ║   📝 BharatOne Auto-Poster Engine         ║');
    console.log('  ╚═══════════════════════════════════════════╝');
    console.log('');
    console.log('  📅 Date:', new Date().toLocaleDateString('en-IN'));
    console.log('  ⏰ Time:', new Date().toLocaleTimeString('en-IN'));
    console.log('');

    // Get count of articles to generate
    const countArg = process.argv.find(arg => arg.startsWith('--count='));
    const totalToGenerate = countArg ? parseInt(countArg.split('=')[1]) : 1;
    
    console.log(`🚀 Starting generation of ${totalToGenerate} article(s)...`);

    // Validate API key
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'AIzaSyC81LIJfCxFdYF62Td0tPqSfMpiDNioO3c') {
        if (GEMINI_API_KEY === 'YOUR_API_KEY_HERE') {
            console.error('❌ ERROR: No Gemini API key set!');
            console.error('   Edit auto-poster.js and replace YOUR_API_KEY_HERE with your key.');
            console.error('   Get a free key at: https://aistudio.google.com/apikey');
            process.exit(1);
        }
    }

    for (let i = 1; i <= totalToGenerate; i++) {
        console.log(`\n--- Generating Article ${i} of ${totalToGenerate} ---`);
        
        try {
            // Step 1: Generate article
            const article = await generateArticle();
            const now = new Date();
            const slug = toSlug(article.title);
            
            const d = {
                ...article,
                slug,
                formattedDate: formatDate(now),
                isoDate: now.toISOString().split('T')[0],
                readTime: estimateReadTime(article.articleHTML)
            };

            console.log(`📄 Article generated: ${d.title}`);

            if (DRY_RUN) {
                console.log('🏃 DRY RUN — Skipping save.');
                continue;
            }

            // Step 2: Save blog post file
            const postHTML = buildPostHTML(d);
            const filePath = path.join(BLOG_DIR, slug + '.html');
            fs.writeFileSync(filePath, postHTML, 'utf8');
            console.log('💾 Saved: blog/' + slug + '.html');

            // Step 3: Update blog.html
            let blogContent = fs.readFileSync(BLOG_HTML, 'utf8');
            const marker = '<!-- NEW-BLOG-POSTS-HERE -->';
            if (blogContent.includes(marker)) {
                const cardHTML = buildCardHTML(d);
                blogContent = blogContent.replace(marker, marker + '\n' + cardHTML);
                fs.writeFileSync(BLOG_HTML, blogContent, 'utf8');
                console.log('📋 Updated blog.html with new card');
            }

            // Step 5: Log (Log immediately so the next loop knows this topic is used)
            const log = loadLog();
            log.articles.push({
                title: d.title,
                slug: d.slug,
                description: d.description,
                keywords: d.keywords,
                category: d.category,
                date: d.isoDate,
                readTime: d.readTime,
                deployed: true, // Mark as true for cloud push
                timestamp: new Date().toISOString()
            });
            saveLog(log);
            console.log('📊 Logged to auto-post-log.json');

        } catch (error) {
            console.error(`❌ ERROR on article ${i}:`, error.message);
            // Continue to next article if one fails
        }
    }

    // Final Step: Deploy (Only once after all articles are done)
    if (!DRY_RUN) {
        console.log('\n--- Finalizing and Deploying ---');
        let deployed = false;
        if (process.env.GITHUB_ACTIONS_MODE === 'true') {
            console.log('☁️  Running in GitHub Actions — skipping internal deploy step.');
            console.log('   (Deploy will be triggered automatically by the Git Push)');
            deployed = true;
        } else {
            deployed = await deployToNetlify();
        }

        console.log('');
        console.log('  ╔═══════════════════════════════════════════╗');
        if (deployed) {
            console.log('  ║   ✅ ALL ARTICLES PUBLISHED & LIVE!       ║');
            console.log('  ║   🌐 bharatonespaces.com/blog              ║');
        } else {
            console.log('  ║   ✅ ARTICLES SAVED (deploy manually)      ║');
        }
        console.log('  ╚═══════════════════════════════════════════╝');
    }
}

main();
