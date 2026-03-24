import os

# Fix CSS
with open('css/styles.css', 'r', encoding='utf-8') as f:
    css = f.read()

css = css.replace("}\n  }\n}\n\n@media (max-width: 480px) {", "}\n\n@media (max-width: 480px) {")

with open('css/styles.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("Fixed CSS syntax error.")

def inject_cta(filepath):
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return
        
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()
    
    if 'mobile-sticky-cta' not in html:
        # Let's insert it right before the closing body tag
        html = html.replace('</body>', '    <!-- Mobile Sticky CTA -->\n    <a href="#enquiry" class="mobile-sticky-cta">Book a Visit</a>\n\n</body>')
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f"Injected CTA into {filepath}")

inject_cta('index.html')
inject_cta('locations/jasai-logistics-office.html')
inject_cta('locations/pune-camp.html')
