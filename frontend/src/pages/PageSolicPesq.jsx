import 'bootstrap/dist/css/bootstrap.min.css';
import NavUser from "../components/NavUser";
import SolicPesquisa from '../components/SolicPesq';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';

function PageSolicPesq() {
  return (
    <>
      <NavUser />
      <ToastContainer />
      <SolicPesquisa />
    </>
  );
}

export default PageSolicPesq;