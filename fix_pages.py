import os
import re

def fix_jasai():
    with open('box-office-jasai.html', 'r', encoding='utf-8') as f:
        html = f.read()

    html = html.replace('<title>Box Office Jasai | Office & Transit Hub near Navi Mumbai Airport \u2013 BharatOne Spaces</title>', '<title>BharatOne Spaces | Jasai Logistics Office Near NMIA & JNPT</title>')
    html = html.replace('Box Office Jasai | Office & Transit Hub near Navi Mumbai Airport – BharatOne Spaces', 'BharatOne Spaces | Jasai Logistics Office Near NMIA & JNPT')
    
    html = re.sub(r'content="Box Office Jasai.*?"', 'content="Box Office Jasai — Zero setup time office & transit hub 12 min from NMIA, 8 min from JNPT. Plug-and-play coworking & private cabins from ₹4,999/mo."', html)
    html = html.replace('<h1>Box Office <span class="text-accent">Jasai</span></h1>', '<h1>Box Office <span class="text-accent">Jasai</span> - Logistics Hub Near NMIA & JNPT</h1>')

    html = html.replace('href="css/', 'href="../css/')
    html = html.replace('src="js/', 'src="../js/')
    html = html.replace('href="images/', 'href="../images/')
    html = html.replace('src="images/', 'src="../images/')
    html = html.replace('href="index.html"', 'href="../index.html"')
    html = html.replace('href="box-office-jasai.html"', 'href="/locations/jasai-logistics-office"')
    html = html.replace('href="pune-camp.html"', 'href="/locations/pune-camp"')
    html = html.replace('href="for-brokers.html"', 'href="../for-brokers.html"')
    html = html.replace('href="blog.html"', 'href="../blog.html"')
    html = html.replace('href="gallery.html"', 'href="../gallery.html"')
    html = html.replace('href="about.html"', 'href="../about.html"')
    html = html.replace('href="contact.html"', 'href="../contact.html"')

    html = html.replace('box-office-jasai.png', 'bharatone-spaces-jasai-logistics-office.webp')
    html = html.replace('jasai-slider-1.jpg', 'bharatone-spaces-jasai-private-cabin-1.webp')
    html = html.replace('jasai-slider-2.jpg', 'bharatone-spaces-jasai-private-cabin-2.webp')
    html = html.replace('workspace.png', 'bharatone-spaces-jasai-premium-workspace.webp')
    html = html.replace('meeting-room.png', 'bharatone-spaces-jasai-meeting-room.webp')
    html = html.replace('reception.png', 'bharatone-spaces-jasai-reception.webp')

    extra = """
<div style="margin-top: 40px; background: #f9f9f9; padding: 30px; border-radius: 12px;">
    <h3>Comprehensive Overview of Jasai Logistics Office</h3>
    <p>We understand that locating near <strong>Navi Mumbai International Airport (NMIA)</strong> and the <strong>JNPT Port</strong> requires more than just desk space; it requires a strategic ecosystem. At BharatOne Spaces, our zero setup time policy means you can establish your operational base without delays. Our facilities are meticulously designed to cater specifically to logistics consultants, shipping line executives, and construction contractors who need both premium aesthetics and rock-solid functionality.</p>
    <p>Transit to and from this location is exceptionally streamlined. With direct access to the JNPT road and a mere 20-minute drive to South Mumbai via the <strong>Atal Setu (MTHL)</strong>, your team avoids the congestion of traditional central business districts while maintaining superior connectivity. Furthermore, the Jasai Railway Station is just 900 meters away, making it incredibly convenient for staff commuting from Panvel or other parts of the MMR.</p>
    <p>Our pricing model is as flexible as your needs. Starting at just ₹4,999/month for a 3-seater setup, businesses can scale up effortlessly as their requirements grow. Each private cabin or coworking seat comes with enterprise-grade internet, robust air conditioning, daily housekeeping, and dedicated parking.</p>
    <p>By choosing Box Office Jasai, you aren't just renting an office; you're securing a premium position in the fastest-growing commercial corridor in Maharashtra. Move in today, plug in your laptop, and let us handle the rest.</p>
</div>
"""
    html = html.replace('</section>\n\n    <!-- Pricing Section -->', extra + '\n</section>\n\n    <!-- Pricing Section -->')

    os.makedirs('locations', exist_ok=True)
    with open('locations/jasai-logistics-office.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Fixed jasai-logistics-office.html")

def fix_pune():
    with open('pune-camp.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # Need to manually construct pune-camp.html since it's malformed
    # The header and hero are fine up to line 55
    # Then there's garbage string
    
    start_idx = html.find('        spaces with state-of-the-art facilities.')
    end_idx = html.find('    </section>\n\n    <!-- Pricing Section -->')
    if start_idx != -1 and end_idx != -1:
        about_section = """
        <div class="container" style="margin-top: 60px;">
            <div class="fade-in-up">
                <h2>About Pune Camp Business Centre</h2>
                <p>Welcome to our premium business centre offering zero setup time, fully furnished office spaces with state-of-the-art facilities. Perfect for established businesses and growing enterprises looking for a professional address. Located in the heart of the Central Business District, our facility is engineered for productivity, prestige, and seamless operations.</p>
                
                <div style="margin-top: 40px; background: #f9f9f9; padding: 30px; border-radius: 12px;">
                    <h3>Comprehensive Overview & Premium Amenities</h3>
                    <p>When you choose our Pune Camp Coworking Business Centre, you are selecting an environment that prioritizes your growth. Our zero setup time guarantee ensures that whether you need a dedicated desk or a multi-cabin private suite, your team can start working immediately. We understand that in today’s fast-paced corporate landscape, operational downtime is costly.</p>
                    <p>Surrounded by a rich ecosystem of corporate hubs, luxury hotels, and high-end dining, the Pune Camp location is not just an office space—it's a statement. Transit is incredibly convenient, with immediate access to local bus routes, proximity to the Pune Railway Station, and seamless links to upcoming metro lines. This exceptional connectivity acts as an incredible advantage for recruiting top talent and hosting important clients.</p>
                    <p>Our comprehensive pricing options accommodate everything from boutique startups to scaling enterprises. Move into a space where enterprise-grade security, high-speed fiber internet, dedicated professional reception services, and impeccable daily housekeeping are standard.</p>
                </div>

                <div style="margin-top: var(--space-6);">
                    <h4>Key Highlights:</h4>
                    <ul style="list-style: none; padding: 0;">
                        <li style="padding: var(--space-2) 0; display: flex; align-items: center; gap: var(--space-3);">
                            <span style="color: var(--color-accent); font-size: 1.5rem;">✓</span>
                            <span>Premium location in Pune Camp area</span>
                        </li>
                        <li style="padding: var(--space-2) 0; display: flex; align-items: center; gap: var(--space-3);">
                            <span style="color: var(--color-accent); font-size: 1.5rem;">✓</span>
                            <span>Professional reception and support staff</span>
                        </li>
                        <li style="padding: var(--space-2) 0; display: flex; align-items: center; gap: var(--space-3);">
                            <span style="color: var(--color-accent); font-size: 1.5rem;">✓</span>
                            <span>Multiple meeting rooms and conference facilities</span>
                        </li>
                        <li style="padding: var(--space-2) 0; display: flex; align-items: center; gap: var(--space-3);">
                            <span style="color: var(--color-accent); font-size: 1.5rem;">✓</span>
                            <span>High-speed internet and IT infrastructure</span>
                        </li>
                        <li style="padding: var(--space-2) 0; display: flex; align-items: center; gap: var(--space-3);">
                            <span style="color: var(--color-accent); font-size: 1.5rem;">✓</span>
                            <span>Parking and security</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
"""
        html = html[:start_idx] + about_section + html[end_idx:]

    # Now apply the replacements
    html = html.replace('<title>Pune Camp Business Centre - BharatOne Spaces</title>', '<title>BharatOne Spaces | Pune Camp Coworking & Premium Office</title>')
    html = re.sub(r'<meta name="description"\s+content=".*?"', '<meta name="description" content="Premium business center in Pune Camp offering zero setup time, fully furnished offices and professional infrastructure for your growing business."', html)
    html = html.replace('<h1>Pune Camp <span class="text-accent">Business Centre</span></h1>', '<h1>Pune Camp <span class="text-accent">Business Centre</span> - Premium Coworking Space</h1>')

    html = html.replace('href="css/', 'href="../css/')
    html = html.replace('src="js/', 'src="../js/')
    html = html.replace('href="images/', 'href="../images/')
    html = html.replace('src="images/', 'src="../images/')
    html = html.replace('href="index.html"', 'href="../index.html"')
    html = html.replace('href="box-office-jasai.html"', 'href="/locations/jasai-logistics-office"')
    html = html.replace('href="pune-camp.html"', 'href="/locations/pune-camp"')
    html = html.replace('href="for-brokers.html"', 'href="../for-brokers.html"')
    html = html.replace('href="blog.html"', 'href="../blog.html"')
    html = html.replace('href="gallery.html"', 'href="../gallery.html"')
    html = html.replace('href="about.html"', 'href="../about.html"')
    html = html.replace('href="contact.html"', 'href="../contact.html"')

    # Fix the missing closing tags for Medium office card that were in the original malformed html
    medium_office_fix = """                            <li style="padding: var(--space-2) 0; border-bottom: 1px solid var(--color-light-grey);">✓
                                Up to 10 workstations</li>
                        </ul>
                        <a href="#enquiry" class="btn btn-accent btn-lg" style="width: 100%;">Enquire Now</a>
                    </div>
                </div>"""
    html = html.replace('                                Up to 10 workstations</li>\n\n                            <!-- Large Office -->', medium_office_fix + '\n\n                            <!-- Large Office -->')


    os.makedirs('locations', exist_ok=True)
    with open('locations/pune-camp.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Fixed pune-camp.html")

if __name__ == '__main__':
    fix_jasai()
    fix_pune()
    
    files = ["about.html", "contact.html", "for-brokers.html", "gallery.html", "blog.html", "elite.html"]
    for f in files:
        if not os.path.exists(f): continue
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
        
        content = content.replace('href="box-office-jasai.html"', 'href="/locations/jasai-logistics-office"')
        content = content.replace('href="pune-camp.html"', 'href="/locations/pune-camp"')
        
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
    print("Fixed all references.")
