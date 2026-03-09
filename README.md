# BharatOne Spaces Website

A modern, premium marketing website for BharatOne Spaces showcasing office properties in Jasai and Pune.

## 🚀 Quick Start

### Running Locally

1. Open a terminal in the project directory
2. Run a local server:
   ```
   npx -y http-server ./
   ```
3. Open your browser and navigate to the URL shown (usually `http://localhost:8080`)

## 📁 Project Structure

```
bharatone_spaces_website/
├── index.html              # Homepage
├── box-office-jasai.html   # Box Office Jasai property page
├── pune-camp.html          # Pune Camp property page
├── about.html              # About page
├── contact.html            # Contact page
├── for-brokers.html        # Broker information page
├── gallery.html            # Photo gallery
├── blog.html               # Blog listing page
├── css/
│   └── styles.css          # Main stylesheet
├── js/
│   └── main.js             # JavaScript functionality
├── images/
│   ├── logo.png            # BharatOne Spaces logo
│   ├── hero-bg.png         # Hero background
│   ├── box-office-jasai.png
│   ├── pune-camp.png
│   ├── workspace.png
│   ├── meeting-room.png
│   └── reception.png
└── blog/                   # Blog post pages (for future use)
```

## ✨ Features

- **Responsive Design**: Mobile-first design that works on all devices
- **WhatsApp Integration**: Floating WhatsApp button and form submissions
- **Property Showcases**: Detailed pages for each property
- **Lead Capture Forms**: Multiple enquiry forms throughout the site
- **Broker Portal**: Dedicated section for broker partnerships
- **Gallery**: Photo gallery with lightbox functionality
- **Blog Ready**: Blog section ready for content

## 📝 How to Add Blog Posts

### Step 1: Create a New Blog Post File

1. Create a new HTML file in the `blog/` directory, e.g., `blog/benefits-of-coworking.html`
2. Copy the structure from any existing page (use `about.html` as a template)
3. Replace the content with your blog post

### Step 2: Update the Blog Listing Page

1. Open `blog.html`
2. Find the blog posts grid section
3. Add a new blog card:

```html
<div class="blog-card fade-in-up">
    <img src="images/your-blog-image.png" alt="Blog Post Title" class="blog-image">
    <div class="blog-content">
        <div class="blog-meta">
            <span>📅 January 23, 2025</span>
            <span>⏱️ 5 min read</span>
        </div>
        <h3 class="blog-title">Your Blog Post Title</h3>
        <p class="blog-excerpt">A brief excerpt of your blog post...</p>
        <a href="blog/your-post-file.html" class="btn btn-outline">Read More</a>
    </div>
</div>
```

### Step 3: Add a Featured Image

1. Add your blog post image to the `images/` directory
2. Update the `src` attribute in the blog card to point to your image

## 🖼️ Updating Images

### Replacing Placeholder Images

All placeholder images are in the `images/` directory. To replace them:

1. Save your new image with the same filename, or
2. Update the HTML files to reference your new image filename

### Recommended Image Sizes

- **Logo**: 400x150px (transparent PNG)
- **Hero Background**: 1920x1080px
- **Property Images**: 1200x800px
- **Gallery Images**: 800x600px
- **Blog Images**: 800x400px

## 📞 Contact Information

The website is configured with the following contact details:

- **Phone**: +91 8898881222
- **WhatsApp**: +91 8899661111
- **Email**: bharatonespaces@gmail.com

To update these, search and replace across all HTML files.

## 🎨 Customizing Design

### Brand Colors

Colors are defined in `css/styles.css` as CSS variables:

```css
--color-primary: #1a365d;        /* Deep Blue */
--color-secondary: #2d3748;      /* Charcoal Grey */
--color-accent: #d4af37;         /* Gold */
```

To change colors, update these variables at the top of `styles.css`.

### Fonts

The website uses:
- **Headings**: Outfit (Google Fonts)
- **Body**: Inter (Google Fonts)

To change fonts, update the `@import` statement and font variables in `styles.css`.

## 📱 WhatsApp Integration

### How It Works

All forms on the website use WhatsApp for submissions:

1. User fills out a form
2. Form data is formatted into a message
3. WhatsApp opens with the pre-filled message
4. User clicks "Send" to submit

### Customizing WhatsApp Messages

Edit the `submitToWhatsApp()` function in `js/main.js` to customize the message format.

## 🔧 Technical Details

- **No Build Process**: Pure HTML, CSS, and JavaScript
- **No Dependencies**: Works without npm or build tools
- **SEO Optimized**: Proper meta tags and semantic HTML
- **Fast Loading**: Optimized images and minimal JavaScript

## 📋 Checklist for Going Live

- [ ] Replace all placeholder images with actual photos
- [ ] Update contact information if needed
- [ ] Test all forms and WhatsApp links
- [ ] Test on mobile devices
- [ ] Add actual property addresses
- [ ] Create and add blog content
- [ ] Set up domain and hosting
- [ ] Add Google Analytics (optional)
- [ ] Submit to Google Search Console

## 🌐 Deployment

### Option 1: Static Hosting (Recommended)

Upload all files to any static hosting service:
- **Netlify**: Drag and drop the folder
- **Vercel**: Connect to a Git repository
- **GitHub Pages**: Push to a GitHub repository

### Option 2: Traditional Hosting

Upload all files via FTP to your web hosting provider.

## 📞 Support

For questions or assistance:
- Email: bharatonespaces@gmail.com
- Phone: +91 8898881222
- WhatsApp: +91 8899661111

## 📄 License

© 2025 BharatOne Spaces. All rights reserved.
