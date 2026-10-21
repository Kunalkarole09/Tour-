import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowDownRight, ArrowRight, CalendarDays, Check, ChevronDown, Clock3,
  Compass, Instagram, Linkedin, MapPin, Menu, Minus, Mountain, Play,
  Plus, Search, Send, ShieldCheck, Sparkles, Star, Users, X
} from "lucide-react";

const image = (id, width = 1200) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;
const apiBaseUrl = (import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:8787" : "")).replace(/\/$/, "");

const tours = [
  { id: "ladakh", place: "Ladakh, India", title: "The high road to Ladakh", duration: "9 days", price: "₹48,500", type: "Adventure", map: "https://www.google.com/maps/search/Ladakh", image: image("photo-1548013146-72479768bada"), intro: "A slow, soul-stirring crossing of high passes, ancient monasteries and moon-like valleys.", highlights: ["Khardung La sunrise", "Nubra Valley camp", "Pangong by starlight"], itinerary: ["Leh · Arrive & acclimatise", "Nubra · Cross Khardung La", "Diskit · Monastery & dunes", "Pangong · Blue hour by the lake", "Leh · Local life & farewell"] },
  { id: "meghalaya", place: "Meghalaya, India", title: "Into the living hills", duration: "7 days", price: "₹36,000", type: "Nature", map: "https://www.google.com/maps/search/Meghalaya", image: image("photo-1533130061792-64b345e4a833"), intro: "Chase waterfalls through cloud country, sleep in bamboo cabins and meet the keepers of the forest.", highlights: ["Living root bridges", "Dawki river swim", "Mawlynnong village"], itinerary: ["Shillong · Pine forests & cafés", "Sohra · Waterfall trail", "Nongriat · Living root bridge", "Dawki · River & borderlands", "Shillong · Music, markets & goodbye"] },
  { id: "bali", place: "Bali, Indonesia", title: "A softer side of Bali", duration: "8 days", price: "₹62,000", type: "Slow travel", map: "https://www.google.com/maps/search/Bali", image: image("photo-1537996194471-e657df975ab4"), intro: "An unhurried island story of rice terraces, reef mornings and small rituals worth keeping.", highlights: ["Ubud rice terraces", "Nusa Penida snorkel", "Sunset temple trail"], itinerary: ["Ubud · Art, gardens & arrival", "Sidemen · Rice field morning", "Nusa Penida · Into the blue", "Uluwatu · Clifftop sunsets", "Seminyak · A slow last day"] },
  { id: "spiti", place: "Himachal Pradesh, India", title: "Spiti, the middle land", duration: "8 days", price: "₹42,000", type: "Road trip", map: "https://www.google.com/maps/search/Spiti+Valley", image: image("photo-1500534623283-312aade485b7"), intro: "Follow the river into a stark, beautiful world where every bend reveals a new horizon.", highlights: ["Key Monastery", "Chandratal night", "Village homestays"], itinerary: ["Shimla · Gather & depart", "Narkanda · Into the mountains", "Tabo · Ancient painted caves", "Kaza · Monasteries & local kitchens", "Chandratal · A night under stars"] }
];

const stories = [
  { place: "Tawang, India", title: "Where the clouds come to rest", image: image("photo-1500534623283-312aade485b7") },
  { place: "Vietnam", title: "A table for the road", image: image("photo-1528127269322-539801943592") },
  { place: "Manali, India", title: "The art of going nowhere", image: image("photo-1518005020951-eccb494ad742") }
];

const testimonials = [
  {
    quote: "Traviator didn't just plan a trip — they handed us a story we'll be telling for years. The Spiti route was breathtaking and perfectly paced.",
    name: "Arjun & Meera Kapoor",
    trip: "Spiti · Road trip",
    avatar: image("photo-1507003211169-0a1dd7228f2d", 80)
  },
  {
    quote: "What sets them apart is the access. Our local guide in Meghalaya took us to a root bridge that wasn't on any map. Pure magic.",
    name: "Priya Nair",
    trip: "Meghalaya · 7 days",
    avatar: image("photo-1494790108377-be9c29b29330", 80)
  },
  {
    quote: "The attention to detail — the guesthouses chosen, the timing of each day — nothing felt random. Ladakh felt like a revelation, not a checklist.",
    name: "Rohit Sharma",
    trip: "Ladakh · 9 days",
    avatar: image("photo-1500648767791-00dcc994a43e", 80)
  }
];

function Reveal({ children, className = "" }) {
  return <div className={`reveal ${className}`}>{children}</div>;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTour, setActiveTour] = useState(null);
  const [search, setSearch] = useState({ destination: "", date: "", travellers: "2" });
  const [filteredTours, setFilteredTours] = useState(tours);
  const [toast, setToast] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Intersection observer for reveal animations
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")),
      { threshold: 0.08 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

    // Cursor tracking
    const root = document.documentElement;
    const updatePointer = (e) => {
      root.style.setProperty("--pointer-x", `${e.clientX}px`);
      root.style.setProperty("--pointer-y", `${e.clientY}px`);
      root.classList.add("pointer-ready");
    };

    // Scroll progress & nav shrink
    const updateScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      root.style.setProperty("--scroll-progress", `${max ? (window.scrollY / max) * 100 : 0}%`);
      setScrolled(window.scrollY > 60);
    };

    window.addEventListener("pointermove", updatePointer, { passive: true });
    window.addEventListener("scroll", updateScroll, { passive: true });
    updateScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", updatePointer);
      window.removeEventListener("scroll", updateScroll);
    };
  }, []);

  // Close mobile menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (!e.target.closest(".nav")) setMenuOpen(false);
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [menuOpen]);

  const searchLabel = useMemo(() => search.destination || "Everywhere", [search.destination]);

  function doSearch(e) {
    e.preventDefault();
    const q = search.destination.toLowerCase().trim();
    setFilteredTours(q ? tours.filter((t) => `${t.place} ${t.title} ${t.type}`.toLowerCase().includes(q)) : tours);
    document.getElementById("journeys")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      {/* Custom cursor */}
      <div className="cursor-dot" aria-hidden="true" />
      <div className="cursor-ring" aria-hidden="true" />

      {/* Scroll progress */}
      <div className="scroll-progress" aria-hidden="true" />

      {/* ── NAV ──────────────────────────────────────────────── */}
      <header className={`nav-wrap${scrolled ? " scrolled" : ""}`}>
        <nav className="nav">
          <a className="logo" href="#top" aria-label="Traviator home">
            <span>TRAV</span><i>•</i><span>IATOR</span>
          </a>
          <div className={`nav-links${menuOpen ? " open" : ""}`}>
            <a href="#journeys" onClick={() => setMenuOpen(false)}>Journeys</a>
            <a href="#journal" onClick={() => setMenuOpen(false)}>Journal</a>
            <a href="#about" onClick={() => setMenuOpen(false)}>Our story</a>
            <button
              className="nav-cta"
              onClick={() => { setMenuOpen(false); document.getElementById("journeys")?.scrollIntoView({ behavior: "smooth" }); }}
            >
              Explore trips <ArrowUpRight />
            </button>
          </div>
          <button className="menu-button" aria-label="Toggle menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </nav>
      </header>

      <main id="top">
        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className="hero">
          <video
            className="hero-video"
            autoPlay muted loop playsInline
            poster={image("photo-1519501025264-65ba15a82390", 2000)}
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          >
            <source src="https://videos.pexels.com/video-files/6715348/6715348-hd_1920_1080_25fps.mp4" type="video/mp4" />
          </video>
          <div className="hero-fallback" />
          <div className="hero-shade" />
          <div className="hero-noise" aria-hidden="true" />
          <div className="hero-orbit orbit-a" aria-hidden="true" />
          <div className="hero-orbit orbit-b" aria-hidden="true" />
          <div className="hero-light-streak streak-a" aria-hidden="true" />
          <div className="hero-light-streak streak-b" aria-hidden="true" />
          <div className="hero-side-rail" aria-hidden="true"><span className="rail-active" /><span /><span /></div>

          <div className="hero-content">
            <div className="eyebrow light"><span className="eyebrow-dot" />Independent journeys, thoughtfully made</div>
            <h1>Your next great<br /><em>adventure</em> starts here.</h1>
            <p className="hero-copy">Leave the familiar behind. We design small-group journeys into the places that stay with you long after you return.</p>
            <div className="hero-actions">
              <a className="button button-light" href="#journeys">Find your way <ArrowDownRight /></a>
              <button
                className="play-link"
                onClick={() => setToast("Our film reel is coming soon — the real adventure starts with a trip.")}
              >
                <span><Play fill="currentColor" /></span> Watch our story
              </button>
            </div>
          </div>

          <div className="hero-meta">
            <span>01 — 03</span><span className="hero-line" /><span>Scroll to explore</span><ChevronDown className="bounce" />
          </div>
          <div className="hero-discovery"><span className="discovery-pulse" /> Curated escapes for curious travellers <ArrowRight /></div>
          <div className="video-label"><span className="video-equalizer"><i /><i /><i /><i /></span> Live field reel · 01:24</div>
          <div className="location-tag tag-one"><MapPin /> 34°09' N / 77°34' E <b>Ladakh</b></div>
          <div className="location-tag tag-two"><span className="tag-number">02</span> Find your north</div>
        </section>

        {/* ── SEARCH PANEL ─────────────────────────────────────── */}
        <section className="search-panel-wrap">
          <form className="search-panel" onSubmit={doSearch} role="search" aria-label="Trip search">
            <div className="search-title">
              <span className="eyebrow">Start somewhere</span>
              <strong>Where will you go?</strong>
            </div>
            <label>
              <MapPin aria-hidden="true" />
              <span>
                Destination
                <input
                  value={search.destination}
                  onChange={(e) => setSearch({ ...search, destination: e.target.value })}
                  placeholder="Anywhere on earth"
                  aria-label="Destination"
                />
              </span>
            </label>
            <label>
              <CalendarDays aria-hidden="true" />
              <span>
                When
                <input
                  type="date"
                  value={search.date}
                  onChange={(e) => setSearch({ ...search, date: e.target.value })}
                  aria-label="Departure date"
                />
              </span>
            </label>
            <label>
              <Users aria-hidden="true" />
              <span>
                Travellers
                <select
                  value={search.travellers}
                  onChange={(e) => setSearch({ ...search, travellers: e.target.value })}
                  aria-label="Number of travellers"
                >
                  <option value="1">1 traveller</option>
                  <option value="2">2 travellers</option>
                  <option value="3">3 travellers</option>
                  <option value="4">4+ travellers</option>
                </select>
              </span>
            </label>
            <button className="search-button" type="submit"><Search aria-hidden="true" /> <span>Search trips</span></button>
          </form>
        </section>

        {/* ── MARQUEE ───────────────────────────────────────────── */}
        <div className="destination-marquee" aria-label="Featured destinations">
          <div aria-hidden="true">
            <span>LEH</span><b>✦</b><span>MEGHALAYA</span><b>✦</b><span>BALI</span><b>✦</b><span>SPITI</span><b>✦</b><span>TAWANG</span><b>✦</b><span>VIETNAM</span><b>✦</b><span>COORG</span><b>✦</b><span>BHUTAN</span><b>✦</b><span>LEH</span><b>✦</b><span>MEGHALAYA</span><b>✦</b><span>BALI</span><b>✦</b><span>SPITI</span><b>✦</b><span>TAWANG</span><b>✦</b><span>VIETNAM</span><b>✦</b><span>COORG</span><b>✦</b><span>BHUTAN</span><b>✦</b>
          </div>
        </div>

        {/* ── INTRO / ABOUT ─────────────────────────────────────── */}
        <section className="intro section" id="about">
          <Reveal>
            <div className="section-kicker">01 / The Traviator way</div>
            <div className="intro-grid">
              <div>
                <h2>Go where the<br /><em>good stories</em> are.</h2>
                <div className="intro-stats">
                  <div className="stat-item">
                    <span className="stat-number">1<em>200+</em></span>
                    <span className="stat-label">Journeys made</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number"><em>18</em></span>
                    <span className="stat-label">Destinations</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">4.<em>9</em></span>
                    <span className="stat-label">Avg. rating</span>
                  </div>
                </div>
              </div>
              <div>
                <p className="large-copy">The best journeys aren't measured in miles. They're found in the unexpected turn, the shared table, the morning you never planned for.</p>
                <p className="muted-copy">We create considered, characterful trips for curious people. Small groups. Local hosts. The kind of details you couldn't find in a guidebook.</p>
                <a className="text-link" href="#journeys">Discover our approach <ArrowRight /></a>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ── JOURNEYS ─────────────────────────────────────────── */}
        <section className="journeys section" id="journeys">
          <Reveal>
            <div className="section-heading">
              <div>
                <div className="section-kicker">02 / Curated journeys</div>
                <h2>Choose your <em>elsewhere.</em></h2>
              </div>
              <span className="result-note">{filteredTours.length} journeys · sample pricing</span>
            </div>
            <div className="tour-grid">
              {filteredTours.map((tour, i) => (
                <article
                  className="tour-card"
                  key={tour.id}
                  style={{ "--delay": `${i * 80}ms` }}
                  onClick={() => setActiveTour(tour)}
                  role="button"
                  tabIndex={0}
                  aria-label={`View ${tour.title}`}
                  onKeyDown={(e) => e.key === "Enter" && setActiveTour(tour)}
                >
                  <div className="tour-image">
                    <img src={tour.image} alt={tour.place} loading="lazy" />
                    <span className="tour-type">{tour.type}</span>
                    <span className="tour-arrow" aria-hidden="true"><ArrowUpRight /></span>
                  </div>
                  <div className="tour-info">
                    <div>
                      <span className="tour-place"><MapPin /> {tour.place}</span>
                      <h3>{tour.title}</h3>
                    </div>
                    <div className="tour-details">
                      <span><Clock3 /> {tour.duration}</span>
                      <strong>{tour.price}<small> / person</small></strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            {filteredTours.length === 0 && (
              <div className="empty-state">No exact match yet. Try "Ladakh", "Bali", or explore everywhere.</div>
            )}
          </Reveal>
        </section>

        {/* ── MANIFESTO ─────────────────────────────────────────── */}
        <section className="manifesto">
          <Reveal>
            <div className="manifesto-inner">
              <Sparkles />
              <blockquote>
                "We don't sell holidays.<br /><em>We make memories<br />easy to find.</em>"
              </blockquote>
              <span>— The Traviator manifesto</span>
            </div>
          </Reveal>
        </section>

        {/* ── JOURNAL ───────────────────────────────────────────── */}
        <section className="journal section" id="journal">
          <Reveal>
            <div className="section-heading">
              <div>
                <div className="section-kicker">03 / Field notes</div>
                <h2>Stories from <em>the road.</em></h2>
              </div>
              <a className="text-link" href="#journal">View all stories <ArrowRight /></a>
            </div>
            <div className="story-grid">
              {stories.map((story, i) => (
                <article className={`story-card story-${i}`} key={story.place}>
                  <img src={story.image} alt="" loading="lazy" />
                  <div className="story-shade" />
                  <div className="story-content">
                    <span>{story.place}</span>
                    <h3>{story.title}</h3>
                    <ArrowUpRight />
                  </div>
                </article>
              ))}
            </div>
          </Reveal>
        </section>

        {/* ── WHY TRAVIATOR ─────────────────────────────────────── */}
        <section className="why" id="why">
          <Reveal>
            <div className="why-image">
              <img src={image("photo-1500534314209-a25ddb2bd429")} alt="Traveller looking across a mountain valley" loading="lazy" />
            </div>
          </Reveal>
          <Reveal>
            <div className="why-content">
              <div className="section-kicker">04 / Why Traviator</div>
              <h2>More than a<br /><em>way out.</em></h2>
              <div className="perks">
                <div>
                  <span>01</span>
                  <div>
                    <h3>Small by design</h3>
                    <p>Up to 12 travellers means room for the places, and the people, to surprise you.</p>
                  </div>
                </div>
                <div>
                  <span>02</span>
                  <div>
                    <h3>Deeply local</h3>
                    <p>Our hosts open doors, share stories and show you the version of a place that maps miss.</p>
                  </div>
                </div>
                <div>
                  <span>03</span>
                  <div>
                    <h3>Thoughtfully wild</h3>
                    <p>Every route balances a little edge with the details that let you travel easy.</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ── TESTIMONIALS ──────────────────────────────────────── */}
        <section className="testimonials">
          <Reveal>
            <div className="section-heading">
              <div>
                <div className="section-kicker">05 / Traveller voices</div>
                <h2>Words from <em>the field.</em></h2>
              </div>
            </div>
            <div className="testimonial-grid">
              {testimonials.map((t, i) => (
                <article className="testimonial-card" key={i}>
                  <div className="testimonial-stars" aria-label="5 stars">
                    {[...Array(5)].map((_, si) => <Star key={si} />)}
                  </div>
                  <p className="testimonial-quote">"{t.quote}"</p>
                  <div className="testimonial-author">
                    <img className="testimonial-avatar" src={t.avatar} alt={t.name} loading="lazy" />
                    <div>
                      <div className="testimonial-name">{t.name}</div>
                      <span className="testimonial-trip">{t.trip}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </Reveal>
        </section>

        {/* ── NEWSLETTER ────────────────────────────────────────── */}
        <section className="newsletter">
          <Reveal>
            <div>
              <div className="eyebrow light"><span className="eyebrow-dot" /> A little inspiration, occasionally</div>
              <h2>Meet us at<br /><em>the horizon.</em></h2>
              <p>Join our field notes for new journeys, local secrets and reasons to book that ticket.</p>
            </div>
            <Newsletter setToast={setToast} />
          </Reveal>
        </section>
      </main>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer>
        <div className="footer-main">
          <div className="footer-brand">
            <a className="logo" href="#top" aria-label="Traviator home"><span>TRAV</span><i>•</i><span>IATOR</span></a>
            <p>For the curious ones.<br />Made with intention in India.</p>
          </div>
          <div className="footer-links">
            <div>
              <span>Explore</span>
              <a href="#journeys">Journeys</a>
              <a href="#journal">Field notes</a>
              <a href="#about">Our story</a>
              <a href="#why">Why Traviator</a>
            </div>
            <div>
              <span>Say hello</span>
              <a href="mailto:hello@traviator.example">hello@traviator.example</a>
              <a href="#top">Instagram <Instagram /></a>
              <a href="#top">LinkedIn <Linkedin /></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2025 Traviator. Sample experience.</span>
          <span>Privacy · Terms</span>
        </div>
      </footer>

      {/* ── MODAL ─────────────────────────────────────────────── */}
      {activeTour && <TourModal tour={activeTour} onClose={() => setActiveTour(null)} setToast={setToast} />}

      {/* ── TOAST ─────────────────────────────────────────────── */}
      {toast && (
        <div className="toast" role="status" aria-live="polite">
          <Check /> {toast}
          <button onClick={() => setToast("")} aria-label="Dismiss"><X /></button>
        </div>
      )}
    </>
  );
}

function Newsletter({ setToast }) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch(`${apiBaseUrl}/api/newsletter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setEmail("");
      setToast(data.message);
    } catch (err) {
      setToast(err.message || "Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="newsletter-form" onSubmit={submit}>
      <div>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          aria-label="Email address"
        />
        <button type="submit" disabled={busy} aria-label="Subscribe">
          {busy ? "…" : <Send />}
        </button>
      </div>
      <small>By subscribing, you agree to our privacy policy.</small>
    </form>
  );
}

function TourModal({ tour, onClose, setToast }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", travellers: 2, message: "" });
  const [busy, setBusy] = useState(false);

  // Trap focus & close on Escape
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch(`${apiBaseUrl}/api/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, tour: tour.title })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setToast(data.message);
      onClose();
    } catch (err) {
      setToast(err.message || "Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={`Journey details: ${tour.title}`}
    >
      <div className="modal">
        <button className="modal-close" onClick={onClose} aria-label="Close modal"><X /></button>
        <div className="modal-image">
          <img src={tour.image} alt={tour.place} />
          <div>
            <span>{tour.place}</span>
            <h2>{tour.title}</h2>
          </div>
        </div>
        <div className="modal-body">
          <div className="modal-copy">
            <span className="eyebrow">Your journey, mapped out</span>
            <p>{tour.intro}</p>
            <div className="highlights">
              {tour.highlights.map((h) => <span key={h}><Check /> {h}</span>)}
            </div>
            <div className="itinerary">
              <h3>Sample itinerary</h3>
              {tour.itinerary.map((day, i) => (
                <div key={day}>
                  <span>0{i + 1}</span>
                  <p>{day}</p>
                </div>
              ))}
            </div>
            <a className="text-link" href={tour.map} target="_blank" rel="noreferrer">
              <MapPin /> Open destination map <ArrowUpRight />
            </a>
          </div>
          <form className="enquiry-form" onSubmit={submit}>
            <h3>Make an enquiry</h3>
            <p>Sample pricing from {tour.price} per person. Our travel desk will confirm the details with you.</p>
            <input required placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} aria-label="Your name" />
            <input required type="email" placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} aria-label="Email address" />
            <input placeholder="Phone (optional)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} aria-label="Phone number" />
            <select value={form.travellers} onChange={(e) => setForm({ ...form, travellers: Number(e.target.value) })} aria-label="Number of travellers">
              <option value="1">1 traveller</option>
              <option value="2">2 travellers</option>
              <option value="3">3 travellers</option>
              <option value="4">4+ travellers</option>
            </select>
            <textarea rows="3" placeholder="Tell us what you're imagining..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} aria-label="Your message" />
            <button className="button button-dark" type="submit" disabled={busy}>
              {busy ? "Sending…" : "Send enquiry"} <ArrowRight />
            </button>
            <small><ShieldCheck /> This is an enquiry, not a confirmed booking.</small>
          </form>
        </div>
      </div>
    </div>
  );
}

function ArrowUpRight() { return <ArrowRight className="arrow-up-right" />; }

export default App;
