# 🤖 BharatOne Auto-Poster (No-PC Cloud Version)

This system automatically generates and publishes **10 high-quality, SEO-optimized articles** to your website every single day at **6:00 AM IST**. It runs entirely in the cloud, so your PC can be turned off.

## 🚀 Setup Instructions

### 1. Create GitHub Repository
* Go to [github.com/new](https://github.com/new).
* Name it `bharatone-website`.
* Set it to **Private**.
* Upload all project files to this repo.

### 2. Add Gemini API Key
* In your GitHub Repo: Go to **Settings** -> **Secrets and variables** -> **Actions**.
* Click **New repository secret**.
* **Name:** `GEMINI_API_KEY`
* **Value:** `AIzaSyC81LIJfCxFdYF62Td0tPqSfMpiDNioO3c`

### 3. Connect to Netlify
* Go to your Netlify dashboard -> **bharatone** site.
* Go to **Site configuration** -> **Build & deploy**.
* Link your GitHub repository `bharatone-website`.
* Once linked, every time the AI pushes an article to GitHub, Netlify will update your site automatically.

## 🔑 GitHub Authentication (Personal Access Token)
GitHub no longer accepts your normal password for Git operations. If the terminal asks for a **Password**, you must use a **Personal Access Token (PAT)**.

1. Go to [GitHub Settings -> Tokens](https://github.com/settings/tokens).
2. Click **Generate new token (classic)**.
3. **Note:** Give it a name like "Auto-Poster".
4. **Expiration:** Set to 90 days or No expiration.
5. **Select scopes:** Check the **repo** box (this allows pushing code).
6. Click **Generate token** and **COPY IT IMMEDIATELY**.
7. When the terminal asks for your "Password", paste this token instead.

## 🛠️ Manual Controls
* **Manual Auto-Post:** If you want 10 articles *right now*, go to your GitHub Repo -> **Actions** -> **Daily Auto-Post** -> **Run workflow**.
* **Local Run:** Double-click `run-autoposter.bat` on your computer (requires Node.js).
* **Log:** Check `auto-post-log.json` to see everything published so far.

## 📈 SEO Features
Every article includes:
* 1,500+ targeting strategic keywords.
* Auto-generated Meta Titles & Descriptions.
* JSON-LD Article Schema for Google Rich Results.
* Natural internal links to Jasai and Pune pages.
* Pulsing WhatsApp CTA buttons.
