import { useState, type SubmitEvent } from "react";
import { SERVER_LOCATION } from "../utils/constants";
import type { ApiResponse, Destination, Post, Product } from "../types";

interface AdminPanelProps {
  onSignOut: () => void;
  onProductAdded: () => void;
  onPostAdded: () => void;
  onDestinationAdded: () => void;
}

const INITIAL_PRODUCT_FORM = {
  name: "",
  price: "",
  category: "",
  rating: "",
  image: "",
  badge: "",
  description: "",
};

const INITIAL_POST_FORM = {
  title: "",
  excerpt: "",
  city: "",
  days: "",
  cover: "",
  date: "",
};

const INITIAL_DESTINATION_FORM = {
  name: "",
  country: "",
  temperature: "",
  season: "",
  image: "",
  highlight: "",
};

const AdminPanel = ({
  onSignOut,
  onPostAdded,
  onProductAdded,
  onDestinationAdded,
}: AdminPanelProps) => {
  const [productStatus, setProductStatus] = useState<string | null>(null);
  const [postStatus, setPostStatus] = useState<string | null>(null);
  const [destinationStatus, setDestinationStatus] = useState<string | null>(
    null,
  );

  const [productForm, setProductForm] = useState(INITIAL_PRODUCT_FORM);

  const [postForm, setPostForm] = useState(INITIAL_POST_FORM);

  const [destinationForm, setDestinationForm] = useState(
    INITIAL_DESTINATION_FORM,
  );

  const handlePostSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPostStatus(null);

    try {
      const response = await fetch(`${SERVER_LOCATION}/api/admin/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...postForm,
          days: Number(postForm.days),
        }),
      });

      if (!response.ok)
        throw new Error(`Failed to add post: ${response.status}`);

      const payload = (await response.json()) as ApiResponse<Post>;

      if (!payload.data.id) throw new Error("Failed to add post");

      setPostStatus(`Added post #${payload.data.id}`);
      setPostForm(INITIAL_POST_FORM);
      onPostAdded();
    } catch (err) {
      setPostStatus((err as Error).message);
    }
  };

  const handleProductSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProductStatus(null);

    try {
      const response = await fetch(`${SERVER_LOCATION}/api/admin/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...productForm,
          price: Number(productForm.price),
          rating: Number(productForm.rating),
          badge: productForm.badge || null,
        }),
      });

      if (!response.ok)
        throw new Error(`Failed to add product: ${response.status}`);

      const payload = (await response.json()) as ApiResponse<Product>;

      if (!payload.data.id) throw new Error("Failed to add product");

      setProductStatus(`Added product #${payload.data.id}`);
      setProductForm(INITIAL_PRODUCT_FORM);
      onProductAdded();
    } catch (err) {
      setProductStatus((err as Error).message);
    }
  };

  const handleDestinationSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDestinationStatus(null);

    try {
      const response = await fetch(
        `${SERVER_LOCATION}/api/admin/destinations`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(destinationForm),
        },
      );

      if (!response.ok)
        throw new Error(`Failed to add destination: ${response.status}`);

      const payload = (await response.json()) as ApiResponse<Destination>;

      if (!payload.data.id) throw new Error("Failed to add destination");

      setDestinationStatus(`Added destination #${payload.data.id}`);
      setDestinationForm(INITIAL_DESTINATION_FORM);
      onDestinationAdded();
    } catch (err) {
      setDestinationStatus((err as Error).message);
    }
  };

  return (
    <section className="admin-panel">
      <div className="admin-header">
        <div>
          <p className="eyebrow">Admin</p>
          <h2>Catalog studio</h2>
          <p className="muted">
            Add new products, journal entries and destinations.
          </p>
        </div>
        <button className="ghost" onClick={onSignOut}>
          Sign out
        </button>
      </div>

      <div className="admin-grid">
        <form className="admin-card" onSubmit={handleProductSubmit}>
          <h3>Add product</h3>
          <label>
            Name
            <input
              type="text"
              value={productForm.name}
              onChange={(e) =>
                setProductForm((prev) => ({ ...prev, price: e.target.value }))
              }
              placeholder="38"
              required
            />
          </label>
          <div className="admin-row">
            <label>
              Price
              <input
                type="number"
                step={0.1}
                value={productForm.price}
                onChange={(e) =>
                  setProductForm((prev) => ({
                    ...prev,
                    price: e.target.value,
                  }))
                }
                placeholder="38"
                required
              />
            </label>

            <label>
              Rating
              <input
                type="number"
                step={0.1}
                value={productForm.rating}
                onChange={(e) =>
                  setProductForm((prev) => ({
                    ...prev,
                    rating: e.target.value,
                  }))
                }
                placeholder="4.8"
                required
              />
            </label>
          </div>
          <label>
            Category
            <select
              value={productForm.category}
              onChange={(e) =>
                setProductForm((prev) => ({
                  ...prev,
                  category: e.target.value,
                }))
              }
            >
              <option value="gear">gear</option>
              <option value="prints">prints</option>
              <option value="guides">guides</option>
            </select>
          </label>
          <label>
            Image URL
            <input
              type="text"
              value={productForm.image}
              onChange={(e) =>
                setProductForm((prev) => ({
                  ...prev,
                  image: e.target.value,
                }))
              }
              placeholder="https://images.example.com/..."
              required
            />
          </label>
          <label>
            Badge (optional)
            <input
              type="text"
              value={productForm.badge}
              onChange={(e) =>
                setProductForm((prev) => ({
                  ...prev,
                  badge: e.target.value,
                }))
              }
              placeholder="New"
            />
          </label>
          <label>
            Description
            <textarea
              value={productForm.description}
              onChange={(e) =>
                setProductForm((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Today is a beautiful day for a trip."
              required
            />
          </label>
          {productStatus ? <p className="status">{productStatus}</p> : null}
          <button className="primary" type="submit">
            Add product
          </button>
        </form>

        <form className="admin-card" onSubmit={handlePostSubmit}>
          <h3>Add journal post</h3>
          <label>
            Title
            <input
              type="text"
              value={postForm.title}
              onChange={(e) =>
                setPostForm((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Lisbon"
              required
            />
          </label>

          <label>
            Excerpt
            <textarea
              value={postForm.excerpt}
              onChange={(e) =>
                setPostForm((prev) => ({ ...prev, excerpt: e.target.value }))
              }
            />
          </label>

          <div className="admin-row">
            <label>
              City
              <input
                type="text"
                value={postForm.city}
                onChange={(e) =>
                  setPostForm((prev) => ({ ...prev, city: e.target.value }))
                }
                placeholder="Lisbon"
                required
              />
            </label>

            <label>
              Days
              <input
                type="number"
                value={postForm.days}
                onChange={(e) =>
                  setPostForm((prev) => ({ ...prev, days: e.target.value }))
                }
                placeholder="2"
                required
              />
            </label>
          </div>

          <label>
            Cover URL
            <input
              type="text"
              value={postForm.cover}
              onChange={(e) =>
                setPostForm((prev) => ({ ...prev, cover: e.target.value }))
              }
              placeholder="https://images.example.com/..."
              required
            />
          </label>

          <label>
            Date (optional)
            <input
              type="date"
              value={postForm.date}
              onChange={(e) =>
                setPostForm((prev) => ({ ...prev, date: e.target.value }))
              }
            />
          </label>
          {postStatus ? <p className="status">{postStatus}</p> : null}
          <button className="primary">Add post</button>
        </form>

        <form className="admin-card" onSubmit={handleDestinationSubmit}>
          <h3>Add destination</h3>
          <label>
            Name
            <input
              type="text"
              value={destinationForm.name}
              onChange={(e) =>
                setDestinationForm((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              placeholder="Osaka"
              required
            />
          </label>

          <div className="admin-row">
            <label>
              Country
              <input
                type="text"
                value={destinationForm.country}
                onChange={(e) =>
                  setDestinationForm((prev) => ({
                    ...prev,
                    country: e.target.value,
                  }))
                }
                placeholder="Japan"
                required
              />
            </label>

            <label>
              Season
              <input
                type="text"
                value={destinationForm.season}
                onChange={(e) =>
                  setDestinationForm((prev) => ({
                    ...prev,
                    season: e.target.value,
                  }))
                }
                placeholder="Spring"
                required
              />
            </label>
          </div>

          <label>
            Temperature range
            <input
              type="text"
              value={destinationForm.temperature}
              onChange={(e) =>
                setDestinationForm((prev) => ({
                  ...prev,
                  temperature: e.target.value,
                }))
              }
              placeholder="20-24C"
              required
            />
          </label>

          <label>
            Image URL
            <input
              type="text"
              value={destinationForm.image}
              onChange={(e) =>
                setDestinationForm((prev) => ({
                  ...prev,
                  image: e.target.value,
                }))
              }
              placeholder="https://images.example.com/..."
              required
            />
          </label>

          <label>
            Highlight
            <textarea
              value={destinationForm.highlight}
              onChange={(e) =>
                setDestinationForm((prev) => ({
                  ...prev,
                  highlight: e.target.value,
                }))
              }
              placeholder="Late Spring walks through trees of Sakura."
            />
          </label>
          {destinationStatus ? (
            <p className="status">{destinationStatus}</p>
          ) : null}
          <button className="primary">Add destination</button>
        </form>
      </div>
    </section>
  );
};

export default AdminPanel;
