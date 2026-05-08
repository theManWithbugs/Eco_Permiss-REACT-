import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import PageLogin from "./pages/PageLogin";
import Dashboard from "./pages/Dashboard";
import MinhasSolic from "./pages/PageMinhSolic";
import PrivateRoute from "./components/PrivateRoute";
import PageSolicPesq  from "./pages/PageSolicPesq";
import MembroEquip from "./pages/PageEquip";
import InfoPesquisa from "./pages/PageInfoPesq";
import PageInfoPesq from "./pages/PageInfoPesq";
import PageUsuario from "./pages/PageUsuario";
import PageSolicUgai from "./pages/PageSolicUgai";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<PageLogin />} />

        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/minhas_solic"
          element={
            <PrivateRoute>
              <MinhasSolic />
            </PrivateRoute>
          }
        />

        <Route
          path="/solic_pesquisa"
          element={
            <PrivateRoute>
              <PageSolicPesq />
            </PrivateRoute>
          }
        />

        <Route
          path="/solic_ugai"
          element={
            <PrivateRoute>
              <PageSolicUgai />
            </PrivateRoute>
          }
        />

        <Route
          path="/membros_equipe"
          element={
            <PrivateRoute>
              <MembroEquip />
            </PrivateRoute>
          }
        />

        <Route
          path="/info_pesquisa"
          element={
            <PrivateRoute>
              <PageInfoPesq />
            </PrivateRoute>
          }
        />

        <Route
          path="/perfil"
          element={
            <PrivateRoute>
              <PageUsuario />
            </PrivateRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;