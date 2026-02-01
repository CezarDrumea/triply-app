import { useState } from "react";
import { useCart } from "../context/useCart";

const CartPanel = () => {
  const { state, dispatch, totalCost } = useCart();
  const [showToast, setShowToast] = useState(false);

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

      <p className="muted">xxx</p>

      <div className="cart-items">
        {
          // implement
        }
        <div className="cart-item">
          <div>
            <p className="strong">xxxx</p>
            <p className="muted">xxxxxx</p>
          </div>

          <div className="quantity">
            <button className="ghost">-</button>
            <span>xxx</span>
            <button className="ghost">+</button>
          </div>
        </div>

        <div className="cart-item">
          <div>
            <p className="strong">xxxx</p>
            <p className="muted">xxxxxx</p>
          </div>

          <div className="quantity">
            <button className="ghost">-</button>
            <span>xxx</span>
            <button className="ghost">+</button>
          </div>
        </div>
      </div>

      <div className="cart-footer">
        <div>
          <p className="muted">Total</p>
          <p className="price">$ xxxx</p>
        </div>

        <button className="primary">Checkout</button>
      </div>
    </aside>
  );
};

export default CartPanel;
