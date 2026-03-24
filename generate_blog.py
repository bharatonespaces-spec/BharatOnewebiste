import sys
import os
import re
from datetime import datetime

# Script configuration
BASE_DIR = os.path.dirname(os.path.abspath(__file__)) if '__file__' in globals() else os.getcwd()
BLOG_DIR = os.path.join(BASE_DIR, 'blog')
BLOG_INDEX = os.path.join(BASE_DIR, 'blog.html')
TEMPLATE_PATH = os.path.join(BLOG_DIR, 'template.html')

def create_slug(title):
    # Convert Title to URL friendly slug (e.g. "My First Post" -> "my-first-post")
    title = title.lower()
    title = re.sub(r'[^a-z0-9\s-]', '', title)
    title = re.sub(r'[\s-]+', '-', title)
    return title.strip('-')

def calculate_read_time(content):
    # Average reading speed is 200 words per minute
    words = len(content.split())
    minutes = max(1, round(words / 200))
    return f"{minutes} min read"

def generate_blog_post(title, content_markdown):
    slug = create_slug(title)
    filename = f"{slug}.html"
    filepath = os.path.join(BLOG_DIR, filename)
    
    # Check if we have the template
    if not os.path.exists(TEMPLATE_PATH):
        print(f"Error: Template file not found at {TEMPLATE_PATH}")
        return False
        
    with open(TEMPLATE_PATH, 'r', encoding='utf-8') as f:
        template = f.read()
        
    # Convert simple markdown to HTML paragraphs
    html_content = ""
    paragraphs = content_markdown.split('\n\n')
    for p in paragraphs:
        p = p.strip()
        if not p:
            continue
        if p.startswith('## '):
            html_content += f"<h2>{p[3:]}</h2>\n"
        elif p.startswith('### '):
            html_content += f"<h3>{p[4:]}</h3>\n"
        elif p.startswith('> '):
            html_content += f"<blockquote>{p[2:]}</blockquote>\n"
        else:
            # Handle bold styling
            p = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', p)
            html_content += f"<p>{p}</p>\n"
            
    # Format current date
    date_str = datetime.now().strftime("%B %d, %Y")
    read_time = calculate_read_time(content_markdown)
    
    # Inject content into template
    # Replace Title
    html = re.sub(r'<!-- 1\. EDIT YOUR TITLE HERE -->\s*<h1>.*?</h1>', 
                 f'<!-- 1. EDIT YOUR TITLE HERE -->\n                <h1>{title}</h1>', template, flags=re.DOTALL)
                 
    # Replace Meta (Date & Read Time)
    meta_html = f'''<!-- 2. EDIT YOUR DATE AND READ TIME HERE -->
                <div class="blog-meta justify-center">
                    <span>📅 {date_str}</span>
                    <span>⏱️ {read_time}</span>
                </div>'''
    html = re.sub(r'<!-- 2\. EDIT YOUR DATE AND READ TIME HERE -->.*?</div>\s*</div>', 
                 meta_html + '\n            </div>', html, flags=re.DOTALL)
                 
    # Replace Body Content
    body_html = f'''<!-- 4. WRITE YOUR PARAGRAPHS HERE -->\n                {html_content}'''
    html = re.sub(r'<!-- 4\. WRITE YOUR PARAGRAPHS HERE -->.*?(<div.*?class="mt-8)', 
                 body_html + '\n            \\1', html, flags=re.DOTALL)
                 
    # Update HTML Title
    html = re.sub(r'<title>.*?</title>', f'<title>{title} - BharatOne Spaces</title>', html)
    
    # Save the new blog file
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)
        
    print(f"✅ Successfully generated blog post: {filepath}")
    
    # Update the blog.html index
    update_blog_index(title, date_str, read_time, slug, html_content)
    return True

def update_blog_index(title, date_str, read_time, slug, html_content):
    if not os.path.exists(BLOG_INDEX):
        print(f"Warning: Main {BLOG_INDEX} not found, could not update index.")
        return
        
    # Extract excerpt (first paragraph without tags)
    excerpt_match = re.search(r'<p>(.*?)</p>', html_content)
    excerpt = excerpt_match.group(1)[:120] + "..." if excerpt_match else "Click to read more about this topic..."
    # Strip any remaining tags
    excerpt = re.sub(r'<[^>]+>', '', excerpt)
    
    with open(BLOG_INDEX, 'r', encoding='utf-8') as f:
        index_html = f.read()
        
    # Create the new blog card HTML
    new_card = f'''<!-- NEW AUTO-GENERATED POST -->
        <div class="card fade-in-up mb-8" style="background: var(--color-white); border-radius: var(--radius-xl); overflow: hidden; box-shadow: var(--shadow-md);">
            <div class="card-content">
                <div class="blog-meta mb-4" style="display: flex; gap: var(--space-4); color: var(--color-text-light); font-size: var(--text-sm);">
                    <span>📅 {date_str}</span>
                    <span>⏱️ {read_time}</span>
                </div>
                <h3 class="blog-title" style="font-size: var(--text-2xl); margin-bottom: var(--space-3); color: var(--color-primary);">{title}</h3>
                <p class="blog-excerpt mb-4" style="color: var(--color-text-light);">{excerpt}</p>
                <a href="blog/{slug}.html" class="btn btn-outline" style="display: inline-block;">Read More</a>
            </div>
        </div>
        <!-- END NEW POST -->\n\n        <!-- Coming Soon Message -->'''
        
    # Inject the card right before the "Coming Soon Message" section
    if "<!-- Coming Soon Message -->" in index_html:
        index_html = index_html.replace("<!-- Coming Soon Message -->", new_card)
        
        with open(BLOG_INDEX, 'w', encoding='utf-8') as f:
            f.write(index_html)
        print(f"✅ Added post to main blog page ({BLOG_INDEX})")
    else:
        print(f"⚠️ Could not find injection point in {BLOG_INDEX}. You'll need to link it manually.")

if __name__ == "__main__":
    print("-" * 50)
    print("BharatOne Spaces Autoblogger")
    print("-" * 50)
    print("Run this script using Gemini or Terminal by passing your content.")
    print("To test it now, enter a title, or leave blank to exit.")
    
    try:
        title = input("Enter Blog Title: ")
        if not title:
            sys.exit(0)
            
        print("\nEnter Content (Press Ctrl+D or Ctrl+Z to finish):")
        content = sys.stdin.read().strip()
        
        if title and content:
            generate_blog_post(title, content)
        else:
            print("Title and content are required.")
    except EOFError:
        pass
    except KeyboardInterrupt:
        print("\nAborted.")
