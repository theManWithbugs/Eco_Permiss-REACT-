import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { checkAuth } from "../auth/auth";

function PrivateRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    async function verify() {
      const ok = await checkAuth();
      setAuth(ok);
      setLoading(false);
    }

    verify();
  }, []);

  if (loading) return <p>Carregando...</p>;

  if (!auth) return <Navigate to="/login" />;

  return children;
}

export default PrivateRoute;