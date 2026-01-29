import { useState } from "react";
import CartPanel from "./components/CartPanel";
import SectionHeading from "./components/SectionHeading";
import { CartProvider } from "./context/CartContext";

const TABS = ["shop", "blog", "destinations"] as const;

// type Tab = (typeof TABS)[number];

function AppContent() {
  const [activeTab, setActiveTab] = useState("shop");

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">
          <span className="logo">Triply</span>
          <p className="muted">Shop the gear, read the routes.</p>
        </div>

        <nav className="nav">
          {TABS.map((tab) => (
            <button
              className={`pill ${activeTab === tab ? "active" : null}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>

        <div className="cart-summary">
          <span className="muted">Cart</span>
          <span className="pill active">xxxx items</span>
        </div>
      </header>

      <section className="hero">
        <div>
          <p className="eyebrow">Curated travel + gear</p>
          <h1>Plan the trip.Pack the essentials. Keep the memories.</h1>
          <p className="muted">
            Triply blends ecommerce with a travel journal.
          </p>
          <div className="hero-actions">
            <button className="primary">Start shopping</button>
            <button className="ghost">Browser itineraries</button>
          </div>
        </div>

        <div className="hero-card">
          <h3>Next departure</h3>
          <p className="muted">
            Kyoto winter loop {"->"} 4 nights {"->"} curated kit inside
          </p>
          <div className="hero-grid">
            {
              // implement
            }
            <div>
              <p className="strong">xxxxx</p>
              <p className="muted">xxxx</p>
            </div>
            <div>
              <p className="strong">xxxxx</p>
              <p className="muted">xxxx</p>
            </div>
            <div>
              <p className="strong">xxxxx</p>
              <p className="muted">xxxx</p>
            </div>
          </div>
        </div>
      </section>

      <main className="content">
        <section className="main">
          {activeTab === "shop" ? (
            <>
              <SectionHeading
                eyebrow="Shop"
                title="Travel essentials with an editorial touch"
                description="From minimalist packing cubes to matte map prints, build a pack list worth photographing."
              />
              <div className="filters">
                {(["all", "gear", "prints", "guides"] as const).map((item) => (
                  <button key={item} className="pill">
                    {item}
                  </button>
                ))}
              </div>
              <div className="grid products">
                {
                  // implement ProductCard
                }
              </div>
            </>
          ) : null}

          {activeTab === "blog" ? (
            <>
              <SectionHeading
                eyebrow="Journal"
                title="Short-form guides made for quick departures"
                description="Grab a two-day itinerary or dig into a longer city loop with packing reminders."
              />
              <div className="grid posts">
                {
                  // implement PostCard
                }
              </div>
            </>
          ) : null}

          {activeTab === "destinations" ? (
            <>
              <SectionHeading
                eyebrow="Destinations"
                title="Seasonal highlights with weather and mood"
                description="Get to know new locations."
              />
              <div className="grid destinations">
                {
                  // implement DestinationCard
                }
              </div>
            </>
          ) : null}
        </section>

        <CartPanel />
      </main>

      <footer className="footer">
        <div>
          <p className="strong">Triply © copyright</p>
          <p className="muted">Drop a new itinerary every day.</p>
        </div>

        <div className="footer-links">
          <span className="pill">shipping</span>
          <span className="pill">returns</span>
          <span className="pill">faq</span>
        </div>
      </footer>
    </div>
  );
}

const App = () => (
  <CartProvider>
    <AppContent />
  </CartProvider>
);

export default App;
