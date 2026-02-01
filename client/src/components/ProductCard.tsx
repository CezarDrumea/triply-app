import type { Product } from "../types";

const ProductCard = ({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: (product: Product) => void;
}) => {
  return (
    <article className="card product-card">
      <div className="media">
        <img src={product.image} alt={product.name} loading="lazy" />
        {product.badge ? <span className="badge">{product.badge}</span> : null}
      </div>

      <div className="card-body">
        <div>
          <h3>{product.name}</h3>
          <p className="muted">{product.description}</p>
        </div>

        <div className="meta-row">
          <span className="price">${product.price.toFixed(2)}</span>
          <span className="rating">{product.rating} ⭐️</span>
        </div>

        <button className="primary" onClick={() => onAdd(product)}>
          Add to cart
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
