import { useCallback, useEffect, useMemo } from "react";
import CartPanel from "./components/CartPanel";
import SectionHeading from "./components/SectionHeading";
import { type Product } from "./types";
import DestinationCard from "./components/DestinationCard";
import PostCard from "./components/PostCard";
import ProductCard from "./components/ProductCard";
import AuthPage from "./components/AuthPage";
import AdminPanel from "./components/AdminPanel";
import {
  setActiveTab,
  setCategory,
  setShowAuth,
  TABS,
  type Tab,
} from "./store/slices/uiSlice";
import { useTypedDispatch, useTypedSelector } from "./store/hooks";
import {
  addToCart,
  fetchCart,
  selectCartTotals,
} from "./store/slices/cartSlice";
import { loadSession, logout } from "./store/slices/authSlice";
import {
  fetchDestinations,
  fetchPosts,
  fetchProducts,
} from "./store/slices/catalogSlice";

function App() {
  const dispatch = useTypedDispatch();
  const activeTab = useTypedSelector((state) => state.ui.activeTab);
  const category = useTypedSelector((state) => state.ui.category);
  const showAuth = useTypedSelector((state) => state.ui.showAuth);

  const role = useTypedSelector((state) => state.auth.role);

  const authLoading = useTypedSelector((state) => state.auth.authLoading);

  const products = useTypedSelector((state) => state.catalog.products);
  const posts = useTypedSelector((state) => state.catalog.posts);
  const destinations = useTypedSelector((state) => state.catalog.destinations);

  const { totalItems } = useTypedSelector(selectCartTotals);

  useEffect(() => {
    dispatch(loadSession());
    dispatch(fetchProducts());
    dispatch(fetchPosts());
    dispatch(fetchDestinations());
    dispatch(fetchCart());
  }, [dispatch]);

  const tabs = useMemo<Tab[]>(
    () => (role === "admin" ? [...TABS, "admin"] : [...TABS]),
    [role],
  );

  const canShop = role === "user" || role === "admin";

  const filteredProducts = useMemo(() => {
    if (category === "all") return products;
    return products.filter((product) => product.category === category);
  }, [products, category]);

  const addProductToCart = useCallback(
    (product: Product) => void dispatch(addToCart(product)),
    [dispatch],
  );

  useEffect(() => {
    document.title = `Triply - ${activeTab}`;
  }, [activeTab]);

  const handleSignOut = useCallback(async () => {
    try {
      await dispatch(logout()).unwrap();
    } catch (err) {
      console.error(err);
    }

    dispatch(setActiveTab("shop"));
  }, [dispatch]);

  ////////////////

  if (authLoading) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <p className="eyebrow">Triply Access</p>
          <h1>Checking your session...</h1>
          <p className="muted">We are loading your role and preferences.</p>
        </div>
      </div>
    );
  }

  if (showAuth) {
    return <AuthPage />;
  }

  if (!role) {
    return <AuthPage />;
  }

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">
          <span className="logo">Triply</span>
          <p className="muted">Shop the gear, read the routes.</p>
        </div>

        <nav className="nav">
          {tabs.map((tab: Tab) => (
            <button
              key={tab}
              className={activeTab === tab ? "pill active" : "pill"}
              onClick={() => dispatch(setActiveTab(tab))}
            >
              {tab}
            </button>
          ))}
        </nav>

        <div className="cart-summary">
          {canShop ? (
            <>
              <span className="muted">Cart</span>
              <span className="pill active">{totalItems} items</span>
            </>
          ) : (
            <span className="muted">Guest mode</span>
          )}

          <button
            className="ghost"
            onClick={() => {
              if (role === "guest") dispatch(setShowAuth(true));
              else void handleSignOut();
            }}
          >
            {role === "guest" ? "Log in" : "Sign out"}
          </button>
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
            <button
              className="primary"
              onClick={() => dispatch(setActiveTab("shop"))}
            >
              Start shopping
            </button>
            <button
              className="ghost"
              onClick={() => dispatch(setActiveTab("blog"))}
            >
              Browser itineraries
            </button>
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
                    className={category === item ? "pill active" : "pill"}
                    onClick={() => dispatch(setCategory(item))}
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
                    onAdd={addProductToCart}
                    canAdd={canShop}
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

          {activeTab === "admin" && role === "admin" ? (
            <AdminPanel
              onDestinationAdded={() => dispatch(fetchProducts())}
              onPostAdded={() => dispatch(fetchPosts())}
              onProductAdded={() => dispatch(fetchDestinations())}
              onSignOut={handleSignOut}
            />
          ) : null}
        </section>

        {canShop ? <CartPanel /> : null}
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

export default App;
