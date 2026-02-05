import { useEffect, useMemo, useState } from "react";
import { useCart } from "../context/useCart";

const CartPanel = () => {
  const { state, dispatch, totalCost } = useCart();
  const [showToast, setShowToast] = useState(false);
  const [justCheckedOut, setJustCheckedOut] = useState(false);

  useEffect(() => {
    if (!showToast) return;

    const timer = setTimeout(() => {
      setShowToast(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [showToast]);

  const handleCheckout = () => {
    if (state.items.length === 0) return;
    setShowToast(true);
    setJustCheckedOut(true);
    dispatch({ type: "clear" });
  };

  const message = useMemo(() => {
    if (justCheckedOut) return "Thanks for your order! Your kit is on its way.";
    if (state.items.length === 0)
      return "Your cart is empty. Add a guide or a travel accessory.";
    return "Review your kit and start checkout when ready";
  }, [justCheckedOut, state.items.length]);

  return (
    <aside className="cart">
      {showToast ? (
        <div className="toast" role="status" aria-live="polite">
          Thank you for the purchase!
        </div>
      ) : null}
      <div className="cart-header">
        <h3>Pack list</h3>
        <button className="ghost" onClick={() => dispatch({ type: "clear" })}>
          Clear
        </button>
      </div>

      <p className="muted">{message}</p>

      <div className="cart-items">
        {state.items.map((item) => (
          <div className="cart-item" key={item.product.id}>
            <div>
              <p className="strong">{item.product.name}</p>
              <p className="muted">${item.product.price.toFixed(2)} each</p>
            </div>

            <div className="quantity">
              <button
                className="ghost"
                onClick={() =>
                  dispatch({ type: "decrease", productId: item.product.id })
                }
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                className="ghost"
                onClick={() => dispatch({ type: "add", product: item.product })}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-footer">
        <div>
          <p className="muted">Total</p>
          <p className="price">${totalCost.toFixed(2)}</p>
        </div>

        <button
          className="primary"
          disabled={state.items.length === 0}
          onClick={handleCheckout}
        >
          Checkout
        </button>
      </div>
    </aside>
  );
};

export default CartPanel;
