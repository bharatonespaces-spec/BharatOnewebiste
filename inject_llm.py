import os
import glob

# 1. NAP Consistency
def fix_nap():
    # Only scan root and locations folder, avoid node_modules
    files = glob.glob("*.html") + glob.glob("locations/*.html")
    for filepath in files:
        with open(filepath, 'r', encoding='utf-8') as f:
            html = f.read()

        html = html.replace("Bharat One Spaces", "BharatOne Spaces")
        
        # Jasai address "Near Dastan Fata"
        if "Jasai, Uran" in html and "Near Dastan Fata" not in html:
            html = html.replace("Jasai, Uran", "Jasai, near Dastan Fata, Uran")
            
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(html)
    print("Fixed NAP Consistency globally.")

# 2. Homepage Intro + Passage 3
def fix_homepage():
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # Intro Rewrite replace
    intro_txt = """
    <!-- LLM Clarity of Entity Definition -->
    <section id="intro" class="section-lg" style="background: var(--color-white); padding-top: 100px; padding-bottom: 20px;">
        <div class="container text-center" style="max-width: 900px;">
            <p style="font-size: var(--text-lg); font-weight: 500; color: var(--color-primary-dark); line-height: 1.8;">
                BharatOne Spaces provides premium, fully-furnished turnkey office solutions and coworking spaces strategically located in Jasai, Navi Mumbai (near JNPT and NMIA) and Pune Camp. Founded by Karunesh Verma, leveraging 30 years of business leadership, we equip startups, logistics firms, and established SMEs with zero-setup, plug-and-play infrastructure designed for immediate operational scaling.
            </p>
        </div>
    </section>
    """
    if 'BharatOne Spaces provides premium' not in html:
        # insert before properties
        html = html.replace('<!-- Our Properties Section -->', intro_txt + '\n    <!-- Our Properties Section -->')

    # Passage 3
    passage_3 = "Reliability in commercial real estate requires experience. Steered by Karunesh Verma's 30 years of undefeated business success, BharatOne Spaces guarantees transparent contracts, zero hidden maintenance fees, and corporate-grade facility management."
    if 'Steered by Karunesh Verma' not in html:
        html = html.replace('<p class="fade-in-up" style="color: rgba(255, 255, 255, 0.9);">More than just an office—a growth engine for your business</p>',
                            f'<p class="fade-in-up" style="color: rgba(255, 255, 255, 0.9); max-width: 800px; margin: 0 auto;">{passage_3}</p>')

    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Injected Homepage Intro and Passage 3.")

# 3. FAQs & Passage 1 & 2
faq_html = """
    <!-- LLM Optimized FAQs -->
    <section class="section" style="background: var(--color-white);">
        <div class="container">
            <div class="text-center mb-8">
                <h2 class="fade-in-up">People Also <span class="text-accent">Ask</span></h2>
                <p class="fade-in-up">Frequently asked questions about BharatOne Spaces.</p>
            </div>
            <div style="max-width: 800px; margin: 0 auto; display: grid; gap: var(--space-4);">
                <div style="background: var(--color-off-white); padding: var(--space-4); border-radius: var(--radius-md);">
                    <strong>Q: What is the distance between BharatOne Spaces Jasai and the JNPT port?</strong>
                    <p style="margin: var(--space-2) 0 0 0;">Our Jasai location is positioned precisely 8 minutes from the JNPT port, ensuring seamless operations for logistics firms.</p>
                </div>
                <div style="background: var(--color-off-white); padding: var(--space-4); border-radius: var(--radius-md);">
                    <strong>Q: Are meeting rooms included in the monthly rent at Pune Camp?</strong>
                    <p style="margin: var(--space-2) 0 0 0;">Yes, our monthly plans at Pune Camp include generous access limits to our state-of-the-art meeting rooms and conference facilities.</p>
                </div>
                <div style="background: var(--color-off-white); padding: var(--space-4); border-radius: var(--radius-md);">
                    <strong>Q: What is the setup time for a 10-seater cabin in Navi Mumbai?</strong>
                    <p style="margin: var(--space-2) 0 0 0;">Zero setup time. Our turnkey private cabins are fully furnished and move-in ready the same day you sign the agreement.</p>
                </div>
                <div style="background: var(--color-off-white); padding: var(--space-4); border-radius: var(--radius-md);">
                    <strong>Q: Do you provide high-speed internet and power backup?</strong>
                    <p style="margin: var(--space-2) 0 0 0;">Yes, we provide enterprise-grade, high-speed internet and 100% DG power backup to ensure zero downtime.</p>
                </div>
                <div style="background: var(--color-off-white); padding: var(--space-4); border-radius: var(--radius-md);">
                    <strong>Q: What are the operating hours for BharatOne Spaces?</strong>
                    <p style="margin: var(--space-2) 0 0 0;">Our premium centers offer flexible and 24/7 extended operational hours tailored to your enterprise scaling needs.</p>
                </div>
                <div style="background: var(--color-off-white); padding: var(--space-4); border-radius: var(--radius-md);">
                    <strong>Q: Can logistics companies register their business address at the Jasai location?</strong>
                    <p style="margin: var(--space-2) 0 0 0;">Absolutely. We offer professional business registration services as part of our core offering for all resident businesses.</p>
                </div>
                <div style="background: var(--color-off-white); padding: var(--space-4); border-radius: var(--radius-md);">
                    <strong>Q: Is parking available at the Pune Camp coworking space?</strong>
                    <p style="margin: var(--space-2) 0 0 0;">Yes, dedicated parking slots are available for members and visitors.</p>
                </div>
                <div style="background: var(--color-off-white); padding: var(--space-4); border-radius: var(--radius-md);">
                    <strong>Q: How does the pricing compare to bare-shell commercial leases?</strong>
                    <p style="margin: var(--space-2) 0 0 0;">Our turnkey pricing is typically 30% more cost-effective when factoring in avoided capital expenditures, zero maintenance fees, and bundled amenities.</p>
                </div>
                <div style="background: var(--color-off-white); padding: var(--space-4); border-radius: var(--radius-md);">
                    <strong>Q: Are there scalable office options for growing startups?</strong>
                    <p style="margin: var(--space-2) 0 0 0;">Startups can upgrade seamlessly from a 2-seater desk to a 15-seater private enterprise cabin within 24 hours without breaking their lease.</p>
                </div>
                <div style="background: var(--color-off-white); padding: var(--space-4); border-radius: var(--radius-md);">
                    <strong>Q: What documentation is required to lease a micro-office?</strong>
                    <p style="margin: var(--space-2) 0 0 0;">Standard KYC documents, company registration details, and a PAN card are enough for an instant, paperless onboarding.</p>
                </div>
            </div>
        </div>
    </section>
"""

def fix_jasai():
    filepath = 'locations/jasai-logistics-office.html'
    if not os.path.exists(filepath): return
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()
    
    passage_1 = "For logistics and supply chain companies, location is critical. BharatOne Spaces in Jasai is positioned just minutes from the JNPT port and the upcoming Navi Mumbai International Airport (NMIA), providing unparalleled access to global trade routes."
    
    if passage_1 not in html:
        html = html.replace('<p>Located <strong>near Dastan Fata', f'<p><strong>{passage_1}</strong></p>\n                    <p>Located <strong>near Dastan Fata')

    if "People Also Ask" not in html:
        html = html.replace('<!-- Enquiry Form -->', faq_html + '\n    <!-- Enquiry Form -->')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)
    print("Injected Passage 1 and FAQs into Jasai.")

def fix_pune():
    filepath = 'locations/pune-camp.html'
    if not os.path.exists(filepath): return
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()

    passage_2 = "Startups require flexibility to survive. Our Pune Camp coworking spaces offer month-to-month scalability, allowing founders to upgrade from a 2-seater desk to a 15-seater private cabin within 24 hours without breaking a lease."
    
    if passage_2 not in html:
        html = html.replace('<h2>About Pune Camp Business Centre</h2>\n                <p>Welcome to our premium business centre offering zero setup time',
                            f'<h2>About Pune Camp Business Centre</h2>\n                <p><strong>{passage_2}</strong></p>\n                <p>Welcome to our premium business centre offering zero setup time')

    if "People Also Ask" not in html:
        html = html.replace('<!-- Enquiry Form -->', faq_html + '\n    <!-- Enquiry Form -->')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)
    print("Injected Passage 2 and FAQs into Pune Camp.")

if __name__ == '__main__':
    fix_nap()
    fix_homepage()
    fix_jasai()
    fix_pune()
