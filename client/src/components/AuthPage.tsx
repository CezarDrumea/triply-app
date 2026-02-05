import { useState } from "react";
import type { ApiResponse, Role } from "../types";
import { SERVER_LOCATION } from "../utils/constants";

interface AuthPayload {
  role: Role | null;
}

interface AuthPageProps {
  onLogin: (role: Role) => void;
}

const AuthPage = ({ onLogin }: AuthPageProps) => {
  const [role, setRole] = useState<Role>("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${SERVER_LOCATION}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ role }),
      });

      if (!response.ok) throw new Error(`Login failed: ${response.status}`);

      const payload = (await response.json()) as ApiResponse<AuthPayload>;

      if (!payload.data.role) throw new Error("Login failed: missing role");

      onLogin(payload.data.role);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div>
          <p className="eyebrow">Triply Access</p>
          <h1>Choose your role</h1>
          <p className="muted">
            Sign in as a user to browser the shop, or as an admin to manage the
            catalog.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-option">
            <input
              type="radio"
              name="role"
              value="user"
              checked={role === "user"}
              onChange={() => setRole("user")}
            />
            <span>
              <span className="strong">User</span>
              <span className="muted">Explore the storefront and journal.</span>
            </span>
          </label>

          <label className="auth-option">
            <input
              type="radio"
              name="role"
              value="admin"
              checked={role === "admin"}
              onChange={() => setRole("admin")}
            />
            <span>
              <span className="strong">Admin</span>
              <span className="muted">
                Add products, posts and destinations.
              </span>
            </span>
          </label>
          {error ? <p className="auth-error">{error}</p> : null}
          <button className="primary" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
