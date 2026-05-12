import 'bootstrap/dist/css/bootstrap.min.css';
import SolicPesquisa from '../components/SolicPesq';
import "../styles/minhas_solic.css";
import NavUser from "../components/NavUser";
import MinhasSolicPesq from "../components/MinhasSolicPesq";
import { useState } from 'react';
import MinhasSolicUgai from '../components/MinhasSolicUgai';

function MinhasSolic() {
  const [component, setComponent] = useState("pesquisa");

  function switchComponent(component) {
    setComponent(component);
  }

  return (
    <>
      <NavUser />

      <div className='container bg-white mb-2 rounded p-2 gap-2'>
        <button onClick={() => switchComponent("pesquisa")}
        className='me-2 btn btn-secondary'>Pesquisa</button>

        <button onClick={() => setComponent("ugai")}
        className='btn btn-secondary'>Ugai</button>
      </div>

      {component === "pesquisa" && <MinhasSolicPesq />}
      {component === "ugai" && <MinhasSolicUgai />}
    </>
  );
}

export default MinhasSolic;