import type { SubmitEvent } from "react";
import { useTypedDispatch, useTypedSelector } from "../store/hooks";
import { login, setLoginRole } from "../store/slices/authSlice";
import { setShowAuth } from "../store/slices/uiSlice";

const AuthPage = () => {
  const dispatch = useTypedDispatch();
  const role = useTypedSelector((state) => state.auth.loginRole);
  const loading = useTypedSelector((state) => state.auth.loginLoading);
  const error = useTypedSelector((state) => state.auth.loginError);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await dispatch(login(role)).unwrap();
      dispatch(setShowAuth(false));
    } catch (err) {
      console.error(err);
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
              onChange={() => dispatch(setLoginRole("user"))}
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
              onChange={() => dispatch(setLoginRole("admin"))}
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
