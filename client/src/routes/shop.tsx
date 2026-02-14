import { useCallback, useMemo } from "react";
import SectionHeading from "../components/SectionHeading";
import { useTypedDispatch, useTypedSelector } from "../store/hooks";
import { setCategory } from "../store/slices/uiSlice";
import { addToCart } from "../store/slices/cartSlice";
import type { Product } from "../types";
import ProductCard from "../components/ProductCard";

const Shop = () => {
  const dispatch = useTypedDispatch();
  const role = useTypedSelector((state) => state.auth.role);
  const category = useTypedSelector((state) => state.ui.category);
  const products = useTypedSelector((state) => state.catalog.products);
  const canShop = role === "user" || role === "admin";

  const filteredProducts = useMemo(() => {
    if (category === "all") return products;
    return products.filter((product) => product.category === category);
  }, [products, category]);

  const addProductToCart = useCallback(
    (product: Product) => dispatch(addToCart(product)),
    [dispatch],
  );

  return (
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
  );
};

export default Shop;
