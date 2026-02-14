import {
  createBrowserRouter,
  Navigate,
  redirect,
  RouterProvider,
  type ActionFunctionArgs,
} from "react-router";
import Home from "./layouts/home";
import Shop from "./routes/shop";
import Blog from "./routes/blog";
import Destinations from "./routes/destinations";
import Admin from "./routes/admin";
import AuthPage from "./components/AuthPage";
import { store } from "./store";
import { adminActions } from "./store/slices/adminSlice";
import type { ApiResponse, Destination, Post, Product, Role } from "./types";
import { SERVER_LOCATION } from "./utils/constants";
import {
  fetchDestinations,
  fetchPosts,
  fetchProducts,
} from "./store/slices/catalogSlice";
import { login, setLoginRole } from "./store/slices/authSlice";

const getFormString = (formData: FormData, key: string) => {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
};

const adminAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "product") {
    store.dispatch(adminActions.setProductStatus(null));

    const payload = {
      name: getFormString(formData, "name"),
      price: +getFormString(formData, "price"),
      category: getFormString(formData, "category") as Product["category"],
      rating: +getFormString(formData, "rating"),
      image: getFormString(formData, "image"),
      badge: getFormString(formData, "badge") || null,
      description: getFormString(formData, "description"),
    };

    try {
      const response = await fetch(`${SERVER_LOCATION}/api/admin/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok)
        throw new Error(`Failed to add product: ${response.status}`);

      const result = (await response.json()) as ApiResponse<Product>;

      if (!result.data?.id) throw new Error("Failed to add product");

      store.dispatch(
        adminActions.setProductStatus(`Added product #${result.data.id}`),
      );
      store.dispatch(adminActions.resetProductForm());
      store.dispatch(fetchProducts());
    } catch (error) {
      store.dispatch(adminActions.setProductStatus((error as Error).message));
    }
  }

  if (intent === "post") {
    store.dispatch(adminActions.setPostStatus(null));

    const payload = {
      title: getFormString(formData, "title"),
      excerpt: +getFormString(formData, "excerpt"),
      city: getFormString(formData, "city"),
      days: +getFormString(formData, "days"),
      cover: getFormString(formData, "cover"),
      date: getFormString(formData, "date"),
    };

    try {
      const response = await fetch(`${SERVER_LOCATION}/api/admin/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok)
        throw new Error(`Failed to add post: ${response.status}`);

      const result = (await response.json()) as ApiResponse<Post>;

      if (!result.data?.id) throw new Error("Failed to add post");

      store.dispatch(
        adminActions.setPostStatus(`Added post #${result.data.id}`),
      );
      store.dispatch(adminActions.resetPostForm());
      store.dispatch(fetchPosts());
    } catch (error) {
      store.dispatch(adminActions.setPostStatus((error as Error).message));
    }
  }

  if (intent === "destination") {
    store.dispatch(adminActions.setDestinationStatus(null));

    const payload = {
      name: getFormString(formData, "name"),
      country: +getFormString(formData, "country"),
      temperature: getFormString(formData, "temperature"),
      season: +getFormString(formData, "season"),
      image: getFormString(formData, "image"),
      highlight: getFormString(formData, "highlight"),
    };

    try {
      const response = await fetch(
        `${SERVER_LOCATION}/api/admin/destinations`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok)
        throw new Error(`Failed to add destination: ${response.status}`);

      const result = (await response.json()) as ApiResponse<Destination>;

      if (!result.data?.id) throw new Error("Failed to add destination");

      store.dispatch(
        adminActions.setDestinationStatus(
          `Added destination #${result.data.id}`,
        ),
      );
      store.dispatch(adminActions.resetDestinationForm());
      store.dispatch(fetchDestinations());
    } catch (error) {
      store.dispatch(
        adminActions.setDestinationStatus((error as Error).message),
      );
    }
  }

  return null;
};

const authAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const role = formData.get("role");

  if (role !== "user" && role !== "admin") {
    store.dispatch(setLoginRole("user"));
    return null;
  }

  try {
    await store.dispatch(login(role as Role)).unwrap();
    return redirect("/shop");
  } catch {
    return null;
  }
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      { index: true, element: <Navigate to="shop" replace /> },
      { path: "shop", element: <Shop /> },
      { path: "blog", element: <Blog /> },
      { path: "destinations", element: <Destinations /> },
      { path: "admin", element: <Admin />, action: adminAction },
    ],
  },
  { path: "/auth", element: <AuthPage />, action: authAction },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
