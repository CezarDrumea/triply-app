import { Outlet, useLocation, useNavigate } from "react-router";
import CartPanel from "../components/CartPanel";
import { useTypedDispatch, useTypedSelector } from "../store/hooks";
import { fetchCart, selectCartTotals } from "../store/slices/cartSlice";
import { useCallback, useEffect, useMemo } from "react";
import { loadSession, logout } from "../store/slices/authSlice";
import {
  fetchDestinations,
  fetchPosts,
  fetchProducts,
} from "../store/slices/catalogSlice";
import { TABS, type Tab } from "../store/slices/uiSlice";

export default function Home() {
  const dispatch = useTypedDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const role = useTypedSelector((state) => state.auth.role);

  const authLoading = useTypedSelector((state) => state.auth.authLoading);

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

  const activeTab = useMemo<Tab>(() => {
    const segment = location.pathname.split("/")[1];

    if (segment === "blog" || segment === "destinations" || segment === "admin")
      return segment;

    return "shop";
  }, [location.pathname]);

  useEffect(() => {
    document.title = `Triply - ${activeTab}`;
  }, [activeTab]);

  const handleSignOut = useCallback(async () => {
    try {
      await dispatch(logout()).unwrap();
    } catch (err) {
      console.error(err);
    }

    navigate("/shop", { replace: true });
  }, [dispatch, navigate]);

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
              onClick={() => navigate(`/${tab}`)}
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
              if (role === "guest") navigate("/auth");
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
            <button className="primary" onClick={() => navigate("/shop")}>
              Start shopping
            </button>
            <button className="ghost" onClick={() => navigate("/blog")}>
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
          <Outlet context={{ onSignOut: handleSignOut }} />
          {canShop ? <CartPanel /> : null}
        </section>
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
