// Blog Publisher Server for BharatOne Spaces — with Auto-Deploy to Netlify
// Run: node publish-server.js
// Then open: http://localhost:3456

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 3456;
const WEBSITE_DIR = __dirname;
const BLOG_DIR = path.join(WEBSITE_DIR, 'blog');
const BLOG_HTML = path.join(WEBSITE_DIR, 'blog.html');

if (!fs.existsSync(BLOG_DIR)) fs.mkdirSync(BLOG_DIR);

// Deploy to Netlify
function deployToNetlify(callback) {
    console.log('🚀 Deploying to Netlify...');
    exec('netlify deploy --prod --dir .', { cwd: WEBSITE_DIR }, (err, stdout, stderr) => {
        if (err) {
            console.error('❌ Deploy error:', err.message);
            callback(false, err.message);
        } else {
            const urlMatch = stdout.match(/Website URL:\s*(https?:\/\/\S+)/i) 
                          || stdout.match(/https:\/\/bharatonespaces\.com/);
            const url = urlMatch ? urlMatch[0] : 'https://bharatonespaces.com';
            console.log('✅ Deployed to:', url);
            console.log(stdout);
            callback(true, url);
        }
    });
}

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }

    // API: Publish + Deploy
    if (req.method === 'POST' && req.url === '/publish') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const { slug, postHTML, cardHTML } = data;
                
                // 1. Write blog post file
                const filePath = path.join(BLOG_DIR, slug + '.html');
                fs.writeFileSync(filePath, postHTML, 'utf8');
                console.log('📄 Created: blog/' + slug + '.html');
                
                // 2. Update blog.html
                let blogContent = fs.readFileSync(BLOG_HTML, 'utf8');
                const marker = '<!-- NEW-BLOG-POSTS-HERE -->';
                let listingUpdated = false;
                if (blogContent.includes(marker)) {
                    blogContent = blogContent.replace(marker, marker + '\n' + cardHTML);
                    fs.writeFileSync(BLOG_HTML, blogContent, 'utf8');
                    listingUpdated = true;
                    console.log('📋 Updated blog.html with new card');
                }

                // 3. Deploy to Netlify
                deployToNetlify((success, urlOrError) => {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ 
                        success: true, 
                        file: 'blog/' + slug + '.html',
                        listingUpdated,
                        deployed: success,
                        deployUrl: success ? urlOrError : null,
                        deployError: success ? null : urlOrError
                    }));
                });
                
            } catch(e) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: e.message }));
                console.error('❌ Error:', e.message);
            }
        });
        return;
    }

    // API: Deploy only (no publish)
    if (req.method === 'POST' && req.url === '/deploy') {
        deployToNetlify((success, urlOrError) => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ deployed: success, url: success ? urlOrError : null, error: success ? null : urlOrError }));
        });
        return;
    }

    // Serve publisher page
    if (req.url === '/' || req.url === '/publisher') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(PUBLISHER_HTML);
        return;
    }

    res.writeHead(404); res.end('Not found');
});

server.listen(PORT, () => {
    console.log('');
    console.log('  ╔═══════════════════════════════════════════════╗');
    console.log('  ║   📝 BharatOne Blog Publisher + Auto-Deploy   ║');
    console.log('  ╠═══════════════════════════════════════════════╣');
    console.log('  ║                                               ║');
    console.log(`  ║   Open: http://localhost:${PORT}                  ║`);
    console.log('  ║                                               ║');
    console.log('  ║   Publishes → Saves files → Deploys to       ║');
    console.log('  ║   bharatonespaces.com automatically! 🚀       ║');
    console.log('  ║                                               ║');
    console.log('  ║   Press Ctrl+C to stop                        ║');
    console.log('  ╚═══════════════════════════════════════════════╝');
    console.log('');
});

// ============================================================
const PUBLISHER_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog Publisher — BharatOne Spaces</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; background: #0a1628; color: #e0e7ef; min-height: 100vh; }

        .admin-header {
            background: linear-gradient(135deg, #0f1d36, #1a2d50);
            padding: 20px 32px; border-bottom: 1px solid rgba(212,175,55,0.3);
            display: flex; align-items: center; gap: 16px;
        }
        .admin-header h1 { font-size: 1.4rem; font-weight: 700; color: #fff; }
        .admin-header h1 span { color: #d4af37; }
        .admin-header .badge { background: #d4af37; color: #0a1628; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; }
        .admin-header .status-dot { width: 10px; height: 10px; border-radius: 50%; background: #22c55e; margin-left: auto; box-shadow: 0 0 8px #22c55e; animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }

        .admin-container { max-width: 900px; margin: 0 auto; padding: 32px 24px; }

        .connected-bar { background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.3); border-radius: 12px; padding: 14px 20px; margin-bottom: 28px; display: flex; align-items: center; gap: 10px; font-size: 0.9rem; }
        .connected-bar .dot { width: 8px; height: 8px; border-radius: 50%; background: #22c55e; flex-shrink: 0; }
        .connected-bar span { color: #22c55e; font-weight: 600; }

        .step-label { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
        .step-number { background: #d4af37; color: #0a1628; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.85rem; flex-shrink: 0; }
        .step-text { font-weight: 600; font-size: 1rem; color: #fff; }

        .form-group { margin-bottom: 24px; }
        .form-input { width: 100%; padding: 12px 16px; background: #1a2d50; border: 1px solid rgba(255,255,255,0.12); border-radius: 10px; color: #fff; font-family: 'Inter', sans-serif; font-size: 0.95rem; }
        .form-input:focus { outline: none; border-color: #d4af37; }
        .form-input::placeholder { color: #5a6a80; }
        .hint { font-size: 0.8rem; color: #5a6a80; margin-top: 4px; }

        .editor-toolbar { display: flex; flex-wrap: wrap; gap: 4px; padding: 8px 12px; background: #0f1d36; border: 1px solid rgba(255,255,255,0.12); border-bottom: none; border-radius: 10px 10px 0 0; }
        .toolbar-btn { padding: 6px 12px; background: #1a2d50; border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: #c0c8d4; font-size: 0.85rem; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; }
        .toolbar-btn:hover { background: #d4af37; color: #0a1628; border-color: #d4af37; }
        .toolbar-divider { width: 1px; background: rgba(255,255,255,0.1); margin: 0 4px; }

        .editor-area { min-height: 350px; padding: 20px; background: #1a2d50; border: 1px solid rgba(255,255,255,0.12); border-radius: 0 0 10px 10px; color: #e0e7ef; font-size: 1rem; line-height: 1.8; outline: none; overflow-y: auto; }
        .editor-area:focus { border-color: #d4af37; }
        .editor-area h2 { color: #d4af37; font-size: 1.3rem; margin: 20px 0 8px; }
        .editor-area h3 { color: #fff; font-size: 1.1rem; margin: 16px 0 6px; }
        .editor-area blockquote { border-left: 3px solid #d4af37; padding: 8px 16px; margin: 12px 0; background: rgba(212,175,55,0.08); border-radius: 0 8px 8px 0; font-style: italic; }
        .editor-area ul, .editor-area ol { padding-left: 24px; margin: 8px 0; }
        .editor-area p { margin-bottom: 8px; }

        .publish-btn { display: block; width: 100%; padding: 18px; background: linear-gradient(135deg, #22c55e, #16a34a); color: #fff; border: none; border-radius: 12px; font-size: 1.15rem; font-weight: 800; cursor: pointer; margin-top: 32px; font-family: 'Inter', sans-serif; transition: transform 0.15s, box-shadow 0.15s; }
        .publish-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(34,197,94,0.4); }
        .publish-btn:disabled { background: #3a4a60; color: #6a7a90; cursor: not-allowed; transform: none; box-shadow: none; }

        /* Progress overlay */
        .progress-overlay { display: none; position: fixed; inset: 0; background: rgba(10,22,40,0.95); z-index: 1000; align-items: center; justify-content: center; flex-direction: column; }
        .progress-overlay.show { display: flex; }
        .progress-card { background: #0f1d36; border: 2px solid #d4af37; border-radius: 20px; padding: 48px; text-align: center; max-width: 500px; width: 90%; }
        .progress-card .spinner { width: 60px; height: 60px; border: 4px solid rgba(212,175,55,0.2); border-top-color: #d4af37; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .progress-card h2 { color: #d4af37; font-size: 1.3rem; margin-bottom: 8px; }
        .progress-card p { color: #9aa8bc; font-size: 0.9rem; }
        .progress-step { margin-top: 20px; text-align: left; }
        .progress-step div { padding: 8px 0; font-size: 0.9rem; color: #5a6a80; display: flex; align-items: center; gap: 8px; }
        .progress-step div.done { color: #22c55e; }
        .progress-step div.active { color: #d4af37; font-weight: 600; }

        /* Success overlay */
        .success-overlay { display: none; position: fixed; inset: 0; background: rgba(10,22,40,0.95); z-index: 1001; align-items: center; justify-content: center; }
        .success-overlay.show { display: flex; }
        .success-card { background: #0f1d36; border: 2px solid #22c55e; border-radius: 20px; padding: 40px; text-align: center; max-width: 520px; width: 90%; animation: popIn 0.3s ease; }
        @keyframes popIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .success-card .icon { font-size: 4rem; margin-bottom: 16px; }
        .success-card h2 { color: #22c55e; font-size: 1.4rem; margin-bottom: 8px; }
        .success-card p { color: #9aa8bc; margin-bottom: 6px; font-size: 0.9rem; }
        .success-card .filename { color: #d4af37; font-weight: 700; font-size: 1rem; margin: 12px 0; }
        .success-card .live-link { display: inline-block; margin-top: 10px; padding: 10px 20px; background: rgba(34,197,94,0.1); border: 1px solid #22c55e; border-radius: 8px; color: #22c55e; text-decoration: none; font-weight: 600; font-size: 0.9rem; }
        .success-card .live-link:hover { background: rgba(34,197,94,0.2); }
        .success-card .btn-next { margin-top: 20px; padding: 12px 32px; background: #d4af37; color: #0a1628; border: none; border-radius: 10px; font-weight: 800; font-size: 1rem; cursor: pointer; font-family: 'Inter', sans-serif; }

        .published-list { margin-top: 32px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 24px; display: none; }
        .published-list.visible { display: block; }
        .published-list h3 { color: #d4af37; margin-bottom: 12px; font-size: 1rem; }
        .published-item { display: flex; align-items: center; gap: 10px; padding: 10px 14px; background: rgba(34,197,94,0.06); border: 1px solid rgba(34,197,94,0.15); border-radius: 8px; margin-bottom: 8px; font-size: 0.85rem; }
        .published-item .check { color: #22c55e; font-weight: 800; }
        .published-item .name { color: #e0e7ef; flex: 1; }
        .published-item .time { color: #5a6a80; font-size: 0.8rem; }
    </style>
</head>
<body>

<div class="admin-header">
    <h1>📝 One-Click <span>Publisher</span></h1>
    <span class="badge">BharatOne Spaces</span>
    <div class="status-dot" title="Server connected"></div>
</div>

<div class="admin-container">
    <div class="connected-bar">
        <div class="dot"></div>
        <span>Connected — Publish → Save → Deploy to bharatonespaces.com — all automatic</span>
    </div>

    <div class="form-group">
        <div class="step-label"><span class="step-number">1</span><span class="step-text">Article Title</span></div>
        <input type="text" id="blogTitle" class="form-input" placeholder="e.g. Why Jasai Is the Best Location for Logistics Offices">
    </div>

    <div class="form-group">
        <div class="step-label"><span class="step-number">2</span><span class="step-text">Short Description (for Google)</span></div>
        <input type="text" id="blogDescription" class="form-input" placeholder="A 1-2 sentence summary for Google search results" maxlength="160">
        <p class="hint">Appears in Google results. Keep under 160 characters.</p>
    </div>

    <div class="form-group">
        <div class="step-label"><span class="step-number">3</span><span class="step-text">SEO Keywords (comma separated)</span></div>
        <input type="text" id="blogKeywords" class="form-input" placeholder="e.g. office space jasai, coworking near NMIA, office near JNPT">
    </div>

    <div class="form-group">
        <div class="step-label"><span class="step-number">4</span><span class="step-text">Write or Paste Your Article</span></div>
        <p class="hint" style="margin-bottom: 8px;">Use toolbar for formatting. Select text then click B/H2/List etc.</p>
        <div class="editor-toolbar">
            <button class="toolbar-btn" onclick="fmt('bold')"><b>B</b></button>
            <button class="toolbar-btn" onclick="fmt('italic')"><i>I</i></button>
            <div class="toolbar-divider"></div>
            <button class="toolbar-btn" onclick="fmtBlock('h2')">H2 Heading</button>
            <button class="toolbar-btn" onclick="fmtBlock('h3')">H3 Sub-title</button>
            <div class="toolbar-divider"></div>
            <button class="toolbar-btn" onclick="fmt('insertUnorderedList')">• Bullet List</button>
            <button class="toolbar-btn" onclick="fmt('insertOrderedList')">1. Number List</button>
            <div class="toolbar-divider"></div>
            <button class="toolbar-btn" onclick="fmtBlock('blockquote')">❝ Quote</button>
            <div class="toolbar-divider"></div>
            <button class="toolbar-btn" onclick="clearFmt()">✕ Clear</button>
        </div>
        <div class="editor-area" id="articleEditor" contenteditable="true">
            <p>Start writing or paste your article here...</p>
        </div>
    </div>

    <button class="publish-btn" id="publishBtn" onclick="publishArticle()">
        ⚡ PUBLISH & GO LIVE — One Click, Done
    </button>
    <p class="hint" style="text-align:center; margin-top:8px;">
        Saves the article → Updates blog listing → Deploys to bharatonespaces.com — ALL automatically.
    </p>

    <div class="published-list" id="publishedList">
        <h3>✅ Published & Live on bharatonespaces.com</h3>
        <div id="publishedItems"></div>
    </div>
</div>

<!-- Progress overlay -->
<div class="progress-overlay" id="progressOverlay">
    <div class="progress-card">
        <div class="spinner"></div>
        <h2>Publishing & Deploying...</h2>
        <p>Your article is going live on bharatonespaces.com</p>
        <div class="progress-step">
            <div id="step1" class="active">⏳ Creating blog post file...</div>
            <div id="step2">⬜ Updating blog listing page...</div>
            <div id="step3">⬜ Deploying to bharatonespaces.com...</div>
        </div>
    </div>
</div>

<!-- Success overlay -->
<div class="success-overlay" id="successOverlay">
    <div class="success-card">
        <div class="icon">🎉</div>
        <h2>LIVE on bharatonespaces.com!</h2>
        <p>Your article is published and live right now.</p>
        <div class="filename" id="successFilename"></div>
        <p style="color: #22c55e; font-weight: 600;" id="successDetails"></p>
        <a class="live-link" id="liveLink" href="https://bharatonespaces.com/blog" target="_blank">🌐 View on Live Website</a>
        <br>
        <button class="btn-next" onclick="closeSuccess()">Write Another Article</button>
    </div>
</div>

<script>
    function fmt(cmd) { document.execCommand(cmd, false, null); document.getElementById('articleEditor').focus(); }
    function fmtBlock(tag) { document.execCommand('formatBlock', false, '<'+tag+'>'); document.getElementById('articleEditor').focus(); }
    function clearFmt() { document.execCommand('removeFormat'); document.execCommand('formatBlock', false, '<p>'); document.getElementById('articleEditor').focus(); }

    const editor = document.getElementById('articleEditor');
    editor.addEventListener('focus', function() {
        if (this.innerHTML === '<p>Start writing or paste your article here...</p>') this.innerHTML = '<p><br></p>';
    });

    function toSlug(t) { return t.toLowerCase().replace(/[^a-z0-9\\s-]/g,'').replace(/\\s+/g,'-').replace(/-+/g,'-').substring(0,60); }
    function fmtDate(d) { const m=['January','February','March','April','May','June','July','August','September','October','November','December']; return m[d.getMonth()]+' '+String(d.getDate()).padStart(2,'0')+', '+d.getFullYear(); }
    function readTime(h) { const t=document.createElement('div'); t.innerHTML=h; return Math.max(1,Math.ceil((t.textContent||'').trim().split(/\\s+/).length/200)); }
    function excerpt(h,n) { const t=document.createElement('div'); t.innerHTML=h; return (t.textContent||'').substring(0,n).trim()+'...'; }

    function buildPostHTML(d) {
        return \`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="\${d.description.replace(/"/g,'&quot;')}">
    <meta name="keywords" content="\${d.keywords.replace(/"/g,'&quot;')}">
    <title>\${d.title} | BharatOne Spaces</title>
    <link rel="stylesheet" href="../css/styles.css">
    <link rel="icon" type="image/png" href="../images/logo.png">
    <script type="application/ld+json">
    {"@context":"https://schema.org","@type":"Article","headline":"\${d.title.replace(/"/g,'\\\\\\"')}","description":"\${d.description.replace(/"/g,'\\\\\\"')}","image":"https://bharatonespaces.com/images/logo.png","author":{"@type":"Organization","name":"Bharat One Spaces","url":"https://bharatonespaces.com"},"publisher":{"@type":"Organization","name":"Bharat One Spaces","logo":{"@type":"ImageObject","url":"https://bharatonespaces.com/images/logo.png"}},"datePublished":"\${d.isoDate}","dateModified":"\${d.isoDate}","mainEntityOfPage":{"@type":"WebPage","@id":"https://bharatonespaces.com/blog/\${d.slug}.html"}}
    <\\/script>
    <style>
        .blog-content-wrapper{max-width:800px;margin:0 auto;padding:var(--space-8) var(--space-4)}.blog-header{margin-bottom:var(--space-8)}.blog-header h1{font-size:var(--text-4xl);margin-bottom:var(--space-4);line-height:1.2}.blog-meta{display:flex;gap:var(--space-4);color:var(--color-text-light);font-size:var(--text-sm);margin-bottom:var(--space-6)}.blog-body{font-size:var(--text-lg);line-height:1.8;color:var(--color-text)}.blog-body h2{margin-top:var(--space-10);margin-bottom:var(--space-4);font-size:var(--text-2xl);color:var(--color-primary)}.blog-body h3{margin-top:var(--space-6);margin-bottom:var(--space-3)}.blog-body p{margin-bottom:var(--space-4);color:var(--color-text)}.blog-body ul,.blog-body ol{margin-bottom:var(--space-4);padding-left:var(--space-6)}.blog-body li{margin-bottom:var(--space-2);line-height:1.7}.blog-body blockquote{border-left:4px solid var(--color-accent);padding:var(--space-4) var(--space-6);margin:var(--space-6) 0;background:var(--color-off-white);border-radius:0 var(--radius-md) var(--radius-md) 0;font-style:italic;font-size:var(--text-xl);color:var(--color-primary)}.blog-cta-box{background:linear-gradient(135deg,var(--color-primary) 0%,var(--color-primary-dark) 100%);border-radius:var(--radius-xl);padding:var(--space-8);color:var(--color-white);text-align:center;margin:var(--space-8) 0}.blog-cta-box h3{color:var(--color-white);margin-bottom:var(--space-3)}.blog-cta-box p{color:rgba(255,255,255,0.9)!important;margin-bottom:var(--space-4)}
    </style>
</head>
<body>
    <header class="header"><nav class="nav container"><a href="../index.html"><img src="../images/logo.png" alt="BharatOne Spaces Logo" class="nav-logo"></a><button class="nav-toggle" aria-label="Toggle navigation"><span></span><span></span><span></span></button><ul class="nav-menu"><li><a href="../index.html" class="nav-link">Home</a></li><li><a href="../box-office-jasai.html" class="nav-link">Box Office Jasai</a></li><li><a href="../pune-camp.html" class="nav-link">Pune Camp</a></li><li><a href="../for-brokers.html" class="nav-link">For Brokers</a></li><li><a href="../blog.html" class="nav-link active">Blog</a></li><li><a href="../gallery.html" class="nav-link">Gallery</a></li><li><a href="../about.html" class="nav-link">About</a></li><li><a href="../contact.html" class="nav-link">Contact</a></li><li><a href="../contact.html#enquiry" class="btn btn-accent btn-sm">Enquire Now</a></li></ul></nav></header>
    <main class="section" style="padding-top:120px">
        <article class="blog-content-wrapper">
            <div class="blog-header text-center"><h1>\${d.title}</h1><div class="blog-meta justify-center"><span>📅 \${d.formattedDate}</span><span>⏱️ \${d.readTime} min read</span></div></div>
            <div class="blog-body">
                \${d.articleHTML}
                <div class="blog-cta-box"><h3>Looking for Premium Office Space?</h3><p>Plug-and-play offices from ₹4,999/month in Jasai & Pune</p><div style="display:flex;gap:var(--space-4);justify-content:center;flex-wrap:wrap"><a href="../box-office-jasai.html#enquiry" class="btn btn-accent btn-lg">Book a Site Visit</a><a href="https://wa.me/918899661111?text=Hi%2C%20I%20read%20your%20blog." class="btn btn-outline btn-lg" style="border-color:var(--color-white);color:var(--color-white)" target="_blank">WhatsApp Us</a></div></div>
            </div>
            <div class="mt-8 pt-8" style="border-top:1px solid var(--color-light-grey)"><a href="../blog.html" class="btn btn-outline">&larr; Back to all articles</a></div>
        </article>
    </main>
    <footer class="footer"><div class="container"><div class="footer-content"><div class="footer-section"><img src="../images/logo.png" alt="BharatOne Spaces" style="height:60px;margin-bottom:var(--space-4)"><p>Premium office spaces in Jasai and Pune.</p></div><div class="footer-section"><h3>Quick Links</h3><a href="../index.html">Home</a><a href="../about.html">About Us</a><a href="../for-brokers.html">For Brokers</a><a href="../blog.html">Blog</a><a href="../contact.html">Contact</a></div><div class="footer-section"><h3>Contact Us</h3><p>📞 <a href="tel:+918899661111">+91 8899661111</a></p><p>📱 <a href="https://wa.me/918899661111">WhatsApp Us</a></p><p>✉️ <a href="mailto:bharatonespaces@gmail.com">bharatonespaces@gmail.com</a></p></div></div><div class="footer-bottom"><p>&copy; 2026 BharatOne Spaces. All rights reserved.</p></div></div></footer>
    <a href="https://wa.me/918899661111" class="whatsapp-float pulse" target="_blank">💬</a>
    <script src="../js/main.js"><\\/script>
</body>
</html>\`;
    }

    function buildCardHTML(d) {
        const ex = excerpt(d.articleHTML, 150);
        return \`
        <!-- \${d.title} -->
        <div class="card fade-in-up mb-8" style="background: var(--color-white); border-radius: var(--radius-xl); overflow: hidden; box-shadow: var(--shadow-md);">
            <div class="card-content">
                <div class="blog-meta mb-4" style="display: flex; gap: var(--space-4); color: var(--color-text-light); font-size: var(--text-sm);">
                    <span>📅 \${d.formattedDate}</span>
                    <span>⏱️ \${d.readTime} min read</span>
                </div>
                <h3 class="blog-title" style="font-size: var(--text-2xl); margin-bottom: var(--space-3); color: var(--color-primary);">\${d.title}</h3>
                <p class="blog-excerpt mb-4" style="color: var(--color-text-light);">\${ex}</p>
                <a href="blog/\${d.slug}.html" class="btn btn-outline" style="display: inline-block;">Read More</a>
            </div>
        </div>
        <!-- END \${d.title} -->\`;
    }

    async function publishArticle() {
        const title = document.getElementById('blogTitle').value.trim();
        const description = document.getElementById('blogDescription').value.trim();
        const keywords = document.getElementById('blogKeywords').value.trim();
        const articleHTML = document.getElementById('articleEditor').innerHTML;

        if (!title) { alert('Please enter an article title.'); return; }
        if (!description) { alert('Please enter a short description.'); return; }
        if (!articleHTML || articleHTML==='<p>Start writing or paste your article here...</p>' || articleHTML==='<p><br></p>') { alert('Please write or paste your article content.'); return; }

        const btn = document.getElementById('publishBtn');
        btn.disabled = true;

        // Show progress
        document.getElementById('progressOverlay').classList.add('show');
        document.getElementById('step1').className = 'active';
        document.getElementById('step1').textContent = '⏳ Creating blog post file...';
        document.getElementById('step2').className = '';
        document.getElementById('step2').textContent = '⬜ Updating blog listing page...';
        document.getElementById('step3').className = '';
        document.getElementById('step3').textContent = '⬜ Deploying to bharatonespaces.com...';

        try {
            const now = new Date();
            const d = { title, description, keywords, articleHTML, slug: toSlug(title), formattedDate: fmtDate(now), isoDate: now.toISOString().split('T')[0], readTime: readTime(articleHTML) };

            // Animate step 1
            setTimeout(() => {
                document.getElementById('step1').className = 'done';
                document.getElementById('step1').textContent = '✅ Blog post file created';
                document.getElementById('step2').className = 'active';
                document.getElementById('step2').textContent = '⏳ Updating blog listing page...';
            }, 500);
            setTimeout(() => {
                document.getElementById('step2').className = 'done';
                document.getElementById('step2').textContent = '✅ Blog listing updated';
                document.getElementById('step3').className = 'active';
                document.getElementById('step3').textContent = '🚀 Deploying to bharatonespaces.com...';
            }, 1200);

            const resp = await fetch('/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slug: d.slug, postHTML: buildPostHTML(d), cardHTML: buildCardHTML(d) })
            });
            const result = await resp.json();

            // Hide progress
            document.getElementById('progressOverlay').classList.remove('show');

            if (result.success) {
                document.getElementById('successFilename').textContent = result.file;
                let details = '✓ Blog post created';
                if (result.listingUpdated) details += '  ✓ Listing updated';
                if (result.deployed) details += '  ✓ LIVE on bharatonespaces.com!';
                else details += '  ⚠ Deploy issue: ' + (result.deployError || 'unknown');
                document.getElementById('successDetails').textContent = details;
                document.getElementById('liveLink').href = 'https://bharatonespaces.com/blog/' + d.slug + '.html';
                document.getElementById('successOverlay').classList.add('show');

                const list = document.getElementById('publishedList');
                list.classList.add('visible');
                document.getElementById('publishedItems').innerHTML += '<div class="published-item"><span class="check">✅</span><span class="name">'+d.title+'</span><span class="time">LIVE</span></div>';

                document.getElementById('blogTitle').value = '';
                document.getElementById('blogDescription').value = '';
                document.getElementById('blogKeywords').value = '';
                document.getElementById('articleEditor').innerHTML = '<p>Start writing or paste your article here...</p>';
            } else {
                alert('Error: ' + (result.error || 'Unknown error'));
            }
        } catch(e) {
            document.getElementById('progressOverlay').classList.remove('show');
            alert('Could not connect to the server. Is publish-server.js running?');
        }

        btn.disabled = false;
    }

    function closeSuccess() {
        document.getElementById('successOverlay').classList.remove('show');
        document.getElementById('blogTitle').focus();
    }
</script>
</body>
</html>`;
