import { useNavigate, useOutletContext } from "react-router";
import { useTypedSelector } from "../store/hooks";
import AdminPanel from "../components/AdminPanel";

type AppOutletContext = {
  onSignOut: () => void;
};

const Admin = () => {
  const { onSignOut } = useOutletContext<AppOutletContext>();
  const role = useTypedSelector((state) => state.auth.role);
  const navigate = useNavigate();

  if (role !== "admin") {
    return (
      <section className="admin-panel">
        <div className="admin-card">
          <p className="eyebrow">Admin access</p>
          <h3>Admin access required</h3>
          <p className="muted">Sign in as an admin to manage catalog entries</p>
          <button className="primary" onClick={() => navigate("/auth")}>
            Sign in as admin
          </button>
        </div>
      </section>
    );
  }

  return <AdminPanel onSignOut={onSignOut} />;
};

export default Admin;
