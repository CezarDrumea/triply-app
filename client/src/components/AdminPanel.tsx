import { Form } from "react-router";
import { useTypedDispatch, useTypedSelector } from "../store/hooks";
import { adminActions } from "../store/slices/adminSlice";
import type { Product } from "../types";

interface AdminPanelProps {
  onSignOut: () => void;
}

const AdminPanel = ({ onSignOut }: AdminPanelProps) => {
  const dispatch = useTypedDispatch();
  const productStatus = useTypedSelector((state) => state.admin.productStatus);
  const postStatus = useTypedSelector((state) => state.admin.postStatus);
  const destinationStatus = useTypedSelector(
    (state) => state.admin.destinationStatus,
  );
  const productForm = useTypedSelector((state) => state.admin.productForm);
  const postForm = useTypedSelector((state) => state.admin.postForm);
  const destinationForm = useTypedSelector(
    (state) => state.admin.destinationForm,
  );

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
        <Form className="admin-card" method="post">
          <input type="hidden" name="intent" value="product" />
          <h3>Add product</h3>
          <label>
            Name
            <input
              name="name"
              type="text"
              value={productForm.name}
              onChange={(e) =>
                dispatch(
                  adminActions.updateProductForm({ name: e.target.value }),
                )
              }
              placeholder="Name"
              required
            />
          </label>
          <div className="admin-row">
            <label>
              Price
              <input
                name="price"
                type="number"
                step={0.1}
                value={productForm.price}
                onChange={(e) =>
                  dispatch(
                    adminActions.updateProductForm({ price: e.target.value }),
                  )
                }
                placeholder="38"
                required
              />
            </label>

            <label>
              Rating
              <input
                name="rating"
                type="number"
                step={0.1}
                value={productForm.rating}
                onChange={(e) =>
                  dispatch(
                    adminActions.updateProductForm({ rating: e.target.value }),
                  )
                }
                placeholder="4.8"
                required
              />
            </label>
          </div>
          <label>
            Category
            <select
              name="category"
              value={productForm.category}
              onChange={(e) =>
                dispatch(
                  adminActions.updateProductForm({
                    category: e.target.value as Product["category"],
                  }),
                )
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
              name="image"
              type="text"
              value={productForm.image}
              onChange={(e) =>
                dispatch(
                  adminActions.updateProductForm({ image: e.target.value }),
                )
              }
              placeholder="https://images.example.com/..."
              required
            />
          </label>
          <label>
            Badge (optional)
            <input
              name="badge"
              type="text"
              value={productForm.badge}
              onChange={(e) =>
                dispatch(
                  adminActions.updateProductForm({ badge: e.target.value }),
                )
              }
              placeholder="New"
            />
          </label>
          <label>
            Description
            <textarea
              name="description"
              value={productForm.description}
              onChange={(e) =>
                dispatch(
                  adminActions.updateProductForm({
                    description: e.target.value,
                  }),
                )
              }
              placeholder="Today is a beautiful day for a trip."
              required
            />
          </label>
          {productStatus ? <p className="status">{productStatus}</p> : null}
          <button className="primary" type="submit">
            Add product
          </button>
        </Form>

        <Form className="admin-card" method="post">
          <input type="hidden" name="intent" value="post" />
          <h3>Add journal post</h3>
          <label>
            Title
            <input
              name="title"
              type="text"
              value={postForm.title}
              onChange={(e) =>
                dispatch(adminActions.updatePostForm({ title: e.target.value }))
              }
              placeholder="Lisbon"
              required
            />
          </label>

          <label>
            Excerpt
            <textarea
              name="excerpt"
              value={postForm.excerpt}
              onChange={(e) =>
                dispatch(
                  adminActions.updatePostForm({ excerpt: e.target.value }),
                )
              }
            />
          </label>

          <div className="admin-row">
            <label>
              City
              <input
                name="city"
                type="text"
                value={postForm.city}
                onChange={(e) =>
                  dispatch(
                    adminActions.updatePostForm({ city: e.target.value }),
                  )
                }
                placeholder="Lisbon"
                required
              />
            </label>

            <label>
              Days
              <input
                name="days"
                type="number"
                value={postForm.days}
                onChange={(e) =>
                  dispatch(
                    adminActions.updatePostForm({ days: e.target.value }),
                  )
                }
                placeholder="2"
                required
              />
            </label>
          </div>

          <label>
            Cover URL
            <input
              name="cover"
              type="text"
              value={postForm.cover}
              onChange={(e) =>
                dispatch(adminActions.updatePostForm({ cover: e.target.value }))
              }
              placeholder="https://images.example.com/..."
              required
            />
          </label>

          <label>
            Date (optional)
            <input
              name="date"
              type="date"
              value={postForm.date}
              onChange={(e) =>
                dispatch(adminActions.updatePostForm({ date: e.target.value }))
              }
            />
          </label>
          {postStatus ? <p className="status">{postStatus}</p> : null}
          <button className="primary">Add post</button>
        </Form>

        <Form className="admin-card" method="post">
          <input type="hidden" name="intent" value="destination" />
          <h3>Add destination</h3>
          <label>
            Name
            <input
              name="name"
              type="text"
              value={destinationForm.name}
              onChange={(e) =>
                dispatch(
                  adminActions.updateDestinationForm({ name: e.target.value }),
                )
              }
              placeholder="Osaka"
              required
            />
          </label>

          <div className="admin-row">
            <label>
              Country
              <input
                name="country"
                type="text"
                value={destinationForm.country}
                onChange={(e) =>
                  dispatch(
                    adminActions.updateDestinationForm({
                      country: e.target.value,
                    }),
                  )
                }
                placeholder="Japan"
                required
              />
            </label>

            <label>
              Season
              <input
                name="season"
                type="text"
                value={destinationForm.season}
                onChange={(e) =>
                  dispatch(
                    adminActions.updateDestinationForm({
                      season: e.target.value,
                    }),
                  )
                }
                placeholder="Spring"
                required
              />
            </label>
          </div>

          <label>
            Temperature range
            <input
              name="temprature"
              type="text"
              value={destinationForm.temperature}
              onChange={(e) =>
                dispatch(
                  adminActions.updateDestinationForm({
                    temperature: e.target.value,
                  }),
                )
              }
              placeholder="20-24C"
              required
            />
          </label>

          <label>
            Image URL
            <input
              name="image"
              type="text"
              value={destinationForm.image}
              onChange={(e) =>
                dispatch(
                  adminActions.updateDestinationForm({ image: e.target.value }),
                )
              }
              placeholder="https://images.example.com/..."
              required
            />
          </label>

          <label>
            Highlight
            <textarea
              name="highligh"
              value={destinationForm.highlight}
              onChange={(e) =>
                dispatch(
                  adminActions.updateDestinationForm({
                    highlight: e.target.value,
                  }),
                )
              }
              placeholder="Late Spring walks through trees of Sakura."
            />
          </label>
          {destinationStatus ? (
            <p className="status">{destinationStatus}</p>
          ) : null}
          <button className="primary">Add destination</button>
        </Form>
      </div>
    </section>
  );
};

export default AdminPanel;
