import 'bootstrap/dist/css/bootstrap.min.css';
import SolicPesquisa from '../components/SolicPesq';
import "../styles/minhas_solic.css";
import NavUser from "../components/NavUser";
import MinhasSolicPesq from "../components/MinhasSolicPesq";

function MinhasSolic() {
  return (
    <>
      <NavUser />
      <MinhasSolicPesq />
    </>
  );
}

export default MinhasSolic;