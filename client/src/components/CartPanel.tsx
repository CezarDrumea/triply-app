import { useMemo } from "react";
import { useTypedDispatch, useTypedSelector } from "../store/hooks";
import {
  addToCart,
  checkoutCart,
  clearCart,
  decreaseItem,
  selectCartItems,
  selectCartTotals,
  selectCartUi,
} from "../store/slices/cartSlice";

const CartPanel = () => {
  const dispatch = useTypedDispatch();
  const items = useTypedSelector(selectCartItems);
  const { totalCost } = useTypedSelector(selectCartTotals);
  const { justCheckedOut, showToast } = useTypedSelector(selectCartUi);

  const message = useMemo(() => {
    if (justCheckedOut) return "Thanks for your order! Your kit is on its way.";
    if (items.length === 0)
      return "Your cart is empty. Add a guide or a travel accessory.";
    return "Review your kit and start checkout when ready";
  }, [justCheckedOut, items.length]);

  return (
    <aside className="cart">
      {showToast ? (
        <div className="toast" role="status" aria-live="polite">
          Thank you for the purchase!
        </div>
      ) : null}
      <div className="cart-header">
        <h3>Pack list</h3>
        <button className="ghost" onClick={() => dispatch(clearCart())}>
          Clear
        </button>
      </div>

      <p className="muted">{message}</p>

      <div className="cart-items">
        {items.map((item) => (
          <div className="cart-item" key={item.product.id}>
            <div>
              <p className="strong">{item.product.name}</p>
              <p className="muted">${item.product.price.toFixed(2)} each</p>
            </div>

            <div className="quantity">
              <button
                className="ghost"
                onClick={() => dispatch(decreaseItem(item.product.id))}
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                className="ghost"
                onClick={() => dispatch(addToCart(item.product))}
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
          disabled={items.length === 0}
          onClick={() => dispatch(checkoutCart())}
        >
          Checkout
        </button>
      </div>
    </aside>
  );
};

export default CartPanel;
