const CartPanel = () => {
  return (
    <aside className="cart">
      <div className="cart-header">
        <h3>Pack list</h3>
        <button className="ghost">Clear</button>
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
