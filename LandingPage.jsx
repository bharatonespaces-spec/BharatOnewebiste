import { useState, useEffect } from "react";
import { Shield, Zap, Wind, MapPin, Lock } from "lucide-react";

const GOLD = "#D4AF37";
const ROYAL_BLUE = "#002366";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Barlow:wght@400;500;600;700&family=Barlow+Condensed:wght@600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --gold: #D4AF37;
    --blue: #002366;
    --white: #FFFFFF;
  }

  html { scroll-behavior: smooth; }
  body {
    font-family: 'Barlow', sans-serif;
    background: var(--blue);
    color: var(--white);
    overflow-x: hidden;
  }

  .font-display { font-family: 'Playfair Display', serif; }
  .font-condensed { font-family: 'Barlow Condensed', sans-serif; }

  @keyframes ticker {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .ticker-inner { animation: ticker 24s linear infinite; }

  @keyframes pulse-gold {
    0%, 100% { box-shadow: 0 0 0 0 rgba(212,175,55,0.5); }
    50% { box-shadow: 0 0 0 16px rgba(212,175,55,0); }
  }
  .pulse-cta { animation: pulse-gold 2.2s ease-in-out infinite; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .fade-up { animation: fadeUp 0.7s ease forwards; }
  .d1 { animation-delay: 0.1s; opacity: 0; }
  .d2 { animation-delay: 0.25s; opacity: 0; }
  .d3 { animation-delay: 0.4s; opacity: 0; }
  .d4 { animation-delay: 0.55s; opacity: 0; }

  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  .shimmer {
    background: linear-gradient(90deg, #D4AF37 0%, #fff8dc 40%, #D4AF37 60%, #b8960c 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 3s linear infinite;
  }

  .gold-rule { height: 2px; background: linear-gradient(90deg, transparent, #D4AF37, transparent); }

  .stat-card {
    border: 1px solid rgba(212,175,55,0.15);
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }
  .stat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(212,175,55,0.18);
    border-color: rgba(212,175,55,0.5);
  }

  .elite-input {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(212,175,55,0.3);
    color: #fff;
    width: 100%;
    padding: 14px 18px;
    border-radius: 6px;
    font-family: 'Barlow', sans-serif;
    font-size: 15px;
    outline: none;
    transition: border-color 0.2s, background 0.2s;
  }
  .elite-input::placeholder { color: rgba(255,255,255,0.35); }
  .elite-input:focus { border-color: #D4AF37; background: rgba(212,175,55,0.07); }
  .elite-input option { background: #002366; color: #fff; }

  .header-glass {
    background: rgba(0,20,80,0.92);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    border-bottom: 1px solid rgba(212,175,55,0.2);
  }

  .wa-btn {
    background: linear-gradient(135deg, #25D366, #128C7E);
    color: #fff;
    transition: filter 0.2s, transform 0.15s;
  }
  .wa-btn:hover { filter: brightness(1.12); transform: translateY(-2px); }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #001040; }
  ::-webkit-scrollbar-thumb { background: #D4AF37; border-radius: 3px; }
`;

const tickerItems = [
  "VFS Global", "DMart — #1 Sales/Sqft in Pune", "Rajhans Cinema",
  "Apple Authorised", "Zudio", "93 Avenue Mall", "Hadapsar's Crown Address",
  "VFS Global", "DMart — #1 Sales/Sqft in Pune", "Rajhans Cinema",
  "Apple Authorised", "Zudio", "93 Avenue Mall", "Hadapsar's Crown Address",
];

function Logo({ large }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: large ? 12 : 8 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {["#FF9933", "#FFFFFF", "#138808"].map((c, i) => (
          <span key={i} style={{ display: "block", width: large ? 5 : 4, height: large ? 16 : 12, background: c, borderRadius: 2 }} />
        ))}
      </div>
      <div>
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: large ? 22 : 16, letterSpacing: "0.04em", color: GOLD, lineHeight: 1.05 }}>
          BHARAT ONE
        </div>
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 600, fontSize: large ? 13 : 9, letterSpacing: "0.22em", color: "#fff", opacity: 0.8 }}>
          SPACES
        </div>
      </div>
    </div>
  );
}

function Ticker() {
  return (
    <div style={{ background: GOLD, overflow: "hidden", padding: "10px 0" }}>
      <div className="ticker-inner" style={{ display: "flex", whiteSpace: "nowrap", width: "max-content" }}>
        {tickerItems.map((item, i) => (
          <span key={i} style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: "0.1em", color: ROYAL_BLUE, padding: "0 32px", textTransform: "uppercase" }}>
            {item} <span style={{ marginLeft: 32, opacity: 0.5 }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Form() {
  const [form, setForm] = useState({ name: "", phone: "", category: "" });
  const [done, setDone] = useState(false);

  const submit = () => {
    if (!form.name || !form.phone || !form.category) {
      alert("Please fill all fields to receive the Master Blueprint.");
      return;
    }
    const msg = encodeURIComponent(
      `Hi Karunesh, I want the Master Blueprint for Bharat One Spaces at 93 Avenue Mall.\n\nName: ${form.name}\nBusiness: ${form.category}\nPhone: ${form.phone}`
    );
    window.open(`https://wa.me/918169025761?text=${msg}`, "_blank");
    setDone(true);
  };

  if (done) return (
    <div style={{ textAlign: "center", padding: "48px 24px" }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
      <div className="font-display" style={{ fontSize: 26, color: GOLD, marginBottom: 12 }}>Elite Access Initiated</div>
      <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>
        Karunesh will contact you within 60 minutes on WhatsApp.<br />Welcome to the inner circle.
      </p>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {[
        { key: "name", label: "Your Name", placeholder: "Full Name", type: "text" },
        { key: "phone", label: "WhatsApp Number", placeholder: "+91 XXXXX XXXXX", type: "tel" },
      ].map(({ key, label, placeholder, type }) => (
        <div key={key}>
          <label style={{ display: "block", fontSize: 11, letterSpacing: "0.15em", color: GOLD, fontWeight: 700, marginBottom: 6, textTransform: "uppercase" }}>{label}</label>
          <input className="elite-input" type={type} placeholder={placeholder} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
        </div>
      ))}
      <div>
        <label style={{ display: "block", fontSize: 11, letterSpacing: "0.15em", color: GOLD, fontWeight: 700, marginBottom: 6, textTransform: "uppercase" }}>Business Category</label>
        <select className="elite-input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
          <option value="" disabled>Select Category</option>
          {["CA / Chartered Accountant", "Consultant", "Startup / Entrepreneur", "Legal Professional", "Other"].map(o => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </div>
      <button className="wa-btn pulse-cta" onClick={submit} style={{
        border: "none", cursor: "pointer", padding: "18px 24px", borderRadius: 6,
        fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 17,
        letterSpacing: "0.06em", textTransform: "uppercase", marginTop: 8,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
      }}>
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.137.565 4.14 1.544 5.875L0 24l6.283-1.524A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.6c-1.91 0-3.696-.527-5.218-1.437l-.374-.222-3.73.904.944-3.637-.244-.385A9.571 9.571 0 012.4 12C2.4 6.699 6.699 2.4 12 2.4S21.6 6.699 21.6 12 17.301 21.6 12 21.6z"/>
        </svg>
        Send Me The Master Blueprint on WhatsApp
      </button>
      <p style={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: "0.05em" }}>
        🔒 Zero spam. Your number is strictly for the blueprint.
      </p>
    </div>
  );
}

export default function BharatOneSpaces() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const scrollToForm = () => document.getElementById("form")?.scrollIntoView({ behavior: "smooth" });

  const stats = [
    { icon: <Wind size={28} color={GOLD} />, label: "AC Bill", value: "₹0 / Month", sub: "Centralized cooling — fully included" },
    { icon: <Zap size={28} color={GOLD} />, label: "Internet", value: "100 Mbps", sub: "Dedicated fiber, zero dead zones" },
    { icon: <MapPin size={28} color={GOLD} />, label: "Address", value: "1st Floor", sub: "93 Avenue Mall, Hadapsar, Pune" },
    { icon: <Shield size={28} color={GOLD} />, label: "Deposit", value: "₹29,997", sub: "One time. Fully refundable." },
  ];

  const logicRows = [
    { item: "Monthly Rent", you: "₹9,999", them: "₹35,000 – ₹50,000" },
    { item: "AC Bill", you: "ZERO", them: "₹4,000 – ₹8,000" },
    { item: "Maintenance Charges", you: "ZERO hidden", them: "₹3,000 – ₹6,000" },
    { item: "Address Prestige", you: "Mall-Grade Premium", them: "Generic Commercial" },
    { item: "Daily Footfall", you: "10,000+ visitors", them: "Limited" },
    { item: "Neighbor Brands", you: "VFS • DMart • Rajhans", them: "—" },
  ];

  return (
    <>
      <style>{style}</style>

      {/* Header */}
      <header className="header-glass" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "14px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        boxShadow: scrolled ? "0 4px 32px rgba(0,0,0,0.45)" : "none",
        transition: "box-shadow 0.3s",
      }}>
        <Logo />
        <button onClick={scrollToForm} className="pulse-cta" style={{
          background: `linear-gradient(135deg, ${GOLD}, #b8960c)`,
          color: ROYAL_BLUE, border: "none", cursor: "pointer",
          padding: "10px 18px", borderRadius: 4,
          fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800,
          fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", whiteSpace: "nowrap",
        }}>
          KILLA FATEH KAREIN →
        </button>
      </header>

      <div style={{ height: 64 }} />

      {/* Hero */}
      <section style={{
        background: `linear-gradient(160deg, #000d33 0%, ${ROYAL_BLUE} 55%, #001a5c 100%)`,
        padding: "72px 24px 80px", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -100, right: -100, width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -80, left: -60, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 860, margin: "0 auto", position: "relative" }}>
          <div className="fade-up" style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.3)",
            borderRadius: 100, padding: "6px 16px", marginBottom: 28,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: GOLD, display: "inline-block" }} />
            <span style={{ fontFamily: "'Barlow Condensed'", fontSize: 12, letterSpacing: "0.18em", color: GOLD, fontWeight: 700, textTransform: "uppercase" }}>
              Hadapsar's Most Coveted Business Address — Limited Units
            </span>
          </div>

          <h1 className="font-display fade-up d1" style={{
            fontSize: "clamp(2.2rem, 7vw, 4rem)", lineHeight: 1.08, fontWeight: 900, marginBottom: 24, color: "#fff",
          }}>
            Command a <span className="shimmer">5-Star Mall Address.</span>
            <br />Pay Only <span style={{ color: GOLD }}>₹9,999/Month.</span>
          </h1>

          <p className="fade-up d2" style={{
            fontSize: "clamp(1rem, 2.2vw, 1.2rem)", color: "rgba(255,255,255,0.75)",
            lineHeight: 1.7, maxWidth: 600, marginBottom: 36,
          }}>
            Stop burning ₹40,000+ in a generic Magarpatta box.<br />
            Step onto the <strong style={{ color: "#fff" }}>1st Floor of 93 Avenue Mall</strong> — the same address as VFS Global, Rajhans Cinema & DMart.<br />
            <em style={{ color: GOLD }}>That's not rent. That's an arbitrage.</em>
          </p>

          <div className="fade-up d3" style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 40 }}>
            {["✅ ZERO AC Bills", "✅ Dedicated 100 Mbps Fiber", "✅ Glass Escalator Lobby", "✅ 10,000+ Daily Footfall"].map((pill, i) => (
              <span key={i} style={{
                background: "rgba(255,255,255,0.07)", border: "1px solid rgba(212,175,55,0.25)",
                borderRadius: 4, padding: "7px 14px", fontSize: 13, fontWeight: 600, color: "#fff",
              }}>{pill}</span>
            ))}
          </div>

          <div className="fade-up d4" style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center" }}>
            <button onClick={scrollToForm} className="pulse-cta" style={{
              background: `linear-gradient(135deg, ${GOLD} 0%, #f0c020 50%, #b8960c 100%)`,
              color: ROYAL_BLUE, border: "none", cursor: "pointer",
              padding: "18px 32px", borderRadius: 6,
              fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800,
              fontSize: 18, letterSpacing: "0.06em", textTransform: "uppercase",
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <Lock size={18} />
              Lock My ₹9,999 Slot Now
            </button>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
              Only <strong style={{ color: GOLD }}>7 units</strong> remaining on 1st Floor
            </span>
          </div>
        </div>
      </section>

      <Ticker />

      {/* Stats */}
      <section style={{ background: "#001347", padding: "72px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <p className="font-condensed" style={{ textAlign: "center", fontSize: 11, letterSpacing: "0.2em", color: GOLD, textTransform: "uppercase", marginBottom: 12 }}>
            What's Included — No Surprises
          </p>
          <h2 className="font-display" style={{ textAlign: "center", fontSize: "clamp(1.5rem, 4vw, 2.3rem)", color: "#fff", marginBottom: 48, fontWeight: 700 }}>
            Your Monthly Cost. Declared Upfront.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 20 }}>
            {stats.map((s, i) => (
              <div key={i} className="stat-card" style={{ background: "rgba(0,35,102,0.5)", borderRadius: 10, padding: "28px 24px", textAlign: "center" }}>
                <div style={{ marginBottom: 16 }}>{s.icon}</div>
                <div style={{ fontSize: 11, letterSpacing: "0.15em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", marginBottom: 8 }}>{s.label}</div>
                <div className="font-condensed" style={{ fontSize: 30, fontWeight: 800, color: GOLD, marginBottom: 6 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="gold-rule" />

      {/* Logic Table */}
      <section style={{ background: "#001a5c", padding: "72px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p className="font-condensed" style={{ textAlign: "center", fontSize: 11, letterSpacing: "0.2em", color: GOLD, textTransform: "uppercase", marginBottom: 12 }}>
            The Financial Logic
          </p>
          <h2 className="font-display" style={{ textAlign: "center", fontSize: "clamp(1.5rem, 4vw, 2.3rem)", color: "#fff", marginBottom: 14, fontWeight: 700 }}>
            Elite Professionals Don't Pay More.<br /><span style={{ color: GOLD }}>They Pay Smarter.</span>
          </h2>
          <p style={{ textAlign: "center", color: "rgba(255,255,255,0.55)", marginBottom: 48, fontSize: 15, lineHeight: 1.65 }}>
            Compare what you're burning vs. what smart capital looks like.
          </p>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${GOLD}` }}>
                  <th style={{ padding: "12px 16px", textAlign: "left", color: "rgba(255,255,255,0.45)", fontWeight: 600, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" }}>Line Item</th>
                  <th style={{ padding: "12px 16px", textAlign: "center", color: GOLD, fontWeight: 800, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em" }}>Bharat One Spaces</th>
                  <th style={{ padding: "12px 16px", textAlign: "center", color: "rgba(255,255,255,0.4)", fontWeight: 600, fontSize: 11, textTransform: "uppercase" }}>Typical Magarpatta</th>
                </tr>
              </thead>
              <tbody>
                {logicRows.map((row, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", background: i % 2 === 0 ? "rgba(0,35,102,0.3)" : "transparent" }}>
                    <td style={{ padding: "14px 16px", color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>{row.item}</td>
                    <td style={{ padding: "14px 16px", textAlign: "center", fontWeight: 800, color: GOLD, fontFamily: "'Barlow Condensed'" }}>{row.you}</td>
                    <td style={{ padding: "14px 16px", textAlign: "center", color: "rgba(255,255,255,0.38)" }}>{row.them}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: 32, background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 10, padding: "24px 28px", textAlign: "center" }}>
            <p className="font-condensed" style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "0.04em" }}>
              You Save <span style={{ color: GOLD, fontSize: 30 }}>₹30,000+</span> Every Month.<br />
              <span style={{ fontWeight: 400, fontSize: 15, color: "rgba(255,255,255,0.55)" }}>
                That's ₹3.6 Lakhs annually — capital you can actually deploy.
              </span>
            </p>
          </div>
        </div>
      </section>

      <div className="gold-rule" />

      {/* Conversion Form */}
      <section id="form" style={{ background: "linear-gradient(135deg, #001040 0%, #002070 50%, #001040 100%)", padding: "72px 24px" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{
              display: "inline-block", background: GOLD, color: ROYAL_BLUE,
              fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 11,
              letterSpacing: "0.2em", padding: "6px 18px", borderRadius: 100,
              marginBottom: 20, textTransform: "uppercase",
            }}>
              ⚡ Limited Slots — Act Now
            </div>
            <h2 className="font-display" style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 900, color: "#fff", lineHeight: 1.15, marginBottom: 14 }}>
              Claim Your <span style={{ color: GOLD }}>Elite Workspace</span><br />at ₹9,999/Month
            </h2>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 15, lineHeight: 1.7 }}>
              Fill in your details. Karunesh will send you the complete Master Blueprint — floor plans, availability & a private walk-through invite — directly on WhatsApp.
            </p>
          </div>

          <div style={{ background: "rgba(0,10,50,0.7)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 12, padding: "36px 32px", backdropFilter: "blur(12px)" }}>
            <Form />
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center", marginTop: 28 }}>
            {["🏛️ Established Brand", "📍 Verified Location", "🤝 No Broker Fees"].map((t, i) => (
              <span key={i} style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      <div className="gold-rule" />

      {/* Footer */}
      <footer style={{ background: "#000d2e", padding: "48px 24px 32px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 40, marginBottom: 40 }}>
            <div>
              <Logo large />
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, lineHeight: 1.7, marginTop: 16, maxWidth: 280 }}>
                Premium micro-office spaces engineered for India's elite professionals. Status. Efficiency. Arbitrage.
              </p>
            </div>
            <div>
              <h4 className="font-condensed" style={{ fontSize: 11, letterSpacing: "0.18em", color: GOLD, textTransform: "uppercase", marginBottom: 20, fontWeight: 700 }}>Contact Commander</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ color: "rgba(255,255,255,0.85)", fontWeight: 700, fontSize: 18 }}>Karunesh Verma</div>
                <a href="tel:+918169025761" style={{ color: GOLD, fontSize: 20, fontWeight: 800, fontFamily: "'Barlow Condensed'", textDecoration: "none", letterSpacing: "0.04em" }}>
                  📞 +91 81690 25761
                </a>
                <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, lineHeight: 1.6 }}>
                  1st Floor, 93 Avenue Mall,<br />Hadapsar, Pune – 411028
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-condensed" style={{ fontSize: 11, letterSpacing: "0.18em", color: GOLD, textTransform: "uppercase", marginBottom: 20, fontWeight: 700 }}>Ready to Conquer?</h4>
              <button onClick={scrollToForm} style={{
                background: `linear-gradient(135deg, ${GOLD}, #b8960c)`,
                color: ROYAL_BLUE, border: "none", cursor: "pointer",
                padding: "14px 24px", borderRadius: 6,
                fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800,
                fontSize: 15, letterSpacing: "0.08em", textTransform: "uppercase",
                display: "flex", alignItems: "center", gap: 8, marginBottom: 14,
              }}>
                <Lock size={15} /> Lock My Slot Now
              </button>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>Rent from ₹9,999/month.<br />Deposit: ₹29,997 (refundable).</p>
            </div>
          </div>

          <div className="gold-rule" style={{ marginBottom: 24 }} />
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 12 }}>© 2025 Bharat One Spaces. All rights reserved.</p>
            <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 12 }}>93 Avenue Mall, Hadapsar, Pune 411028</p>
          </div>
        </div>
      </footer>
    </>
  );
}
