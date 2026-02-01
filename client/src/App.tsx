import { useCallback, useEffect, useMemo, useState } from "react";
import CartPanel from "./components/CartPanel";
import SectionHeading from "./components/SectionHeading";
import { CartProvider } from "./context/CartContext";
import { SERVER_LOCATION } from "./utils/constants";
import { useFetch } from "./hooks/useFetch";
import { type Destination, type Post, type Product } from "./types";
import DestinationCard from "./components/DestinationCard";
import PostCard from "./components/PostCard";
import ProductCard from "./components/ProductCard";
import { useCart } from "./context/useCart";

type Category = "all" | "gear" | "prints" | "guides";

const TABS = ["shop", "blog", "destinations"] as const;

type Tab = (typeof TABS)[number];

function AppContent() {
  const [activeTab, setActiveTab] = useState<Tab>("shop");
  const [category, setCategory] = useState<Category>("all");
  const { dispatch, totalItems } = useCart();

  const productsState = useFetch<Product[]>(`${SERVER_LOCATION}/api/products`);

  const destinationsState = useFetch<Destination[]>(
    `${SERVER_LOCATION}/api/destinations`,
  );
  const postsState = useFetch<Post[]>(`${SERVER_LOCATION}/api/posts`);

  const destinations = useMemo(
    () => destinationsState.data ?? [],
    [destinationsState.data],
  );
  const posts = useMemo(() => postsState.data ?? [], [postsState.data]);

  const products = useMemo(
    () => productsState.data ?? [],
    [productsState.data],
  );

  const filteredProducts = useMemo(() => {
    if (category === "all") return products;
    return products.filter((product) => product.category === category);
  }, [products, category]);

  const addToCart = useCallback(
    (product: Product) => dispatch({ type: "add", product }),
    [dispatch],
  );

  useEffect(() => {
    document.title = `Triply - ${activeTab}`;
  }, [activeTab]);

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
              key={tab}
              className={`pill ${activeTab === tab ? "active" : null}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>

        <div className="cart-summary">
          <span className="muted">Cart</span>
          <span className="pill active">{totalItems} items</span>
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
            Kyoto winter loop ▸ 4 nights ▸ curated kit inside
          </p>
          <div className="hero-grid">
            {destinations.slice(0, 3).map((destination) => (
              <div key={destination.id}>
                <p className="strong">{destination.name}</p>
                <p className="muted">{destination.temperature}</p>
              </div>
            ))}
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
                  <button
                    key={item}
                    className="pill"
                    onClick={() => setCategory(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <div className="grid products">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAdd={addToCart}
                  />
                ))}
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
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
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
                {destinations.map((destination) => (
                  <DestinationCard
                    key={destination.id}
                    destination={destination}
                  />
                ))}
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
