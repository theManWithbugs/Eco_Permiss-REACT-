import Mapa from "../img/mapa_acre.svg?react";
import Swal from 'sweetalert2';
import TurmaAntimary from "../img/img_antimary_turma.jpg"
import img_liberdade_01 from "../img/ugai_liberdade_01.jpg"
import img_liberdade_02 from "../img/ugai_liberdade_02.jpg"
import img_acuraua_01 from "../img/img_acuraua_01.jpg"
import img_acuraua_02 from "../img/img_acuraua_02.jpg"

import img_chandles_01 from "../img/img_chandles_01.jpg"
import img_chandles_02 from "../img/img_chandles_02.jpg"

function MapaAcre() {
    return (
        <div>
            <h6 className="d-flex justify-content-center fw-bold mt-3">
                Onde cada UGAI está localizada
            </h6>

            <Mapa
                width="100%"
                height="500px"
                onClick={(e) => {
                    const id = e.target.parentElement.id;

                    if (id === "antimary"){
                        Swal.fire({
                            title: "UGAI-Antimary",
                            text: "Fica na Floresta Estadual do Antimary (FEA), no km 105 da BR-364 (sentido Sena Madureira) e Ramal do Ouro, km 23, entre os municípios de Bujari e Sena Madureira, no Acre",
                            imageUrl: TurmaAntimary,
                            imageWidth: 400,
                            imageHeight: 200,
                            imageAlt: "Custom image"
                        });
                    }

                    if (id === "chandles"){
                         Swal.fire({
                            title: "Parque Chandles",
                            html: `
                                <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
                                    <img src="${img_chandles_01}" alt="UGAI-Chandles_1" style="width:180px; border-radius:6px;" />
                                    <img src="${img_chandles_02}" alt="UGAI-Chandles_2" style="width:180px; border-radius:6px;" />
                                </div>
                                    <br>
                                <span>
                                    O Parque Estadual Chandless está localizado no estado do Acre, abrangendo os municípios de Manoel Urbano, Sena Madureira e Santa Rosa do Purus.
                                </span>
                            `,
                            confirmButtonText: 'Fechar'
                        });
                    }

                    if (id === "afluente"){
                        alert("UGAI Afluente");
                    }

                    if (id === "acuraua"){
                        Swal.fire({
                            title: "UGAI-Rio Gregorio",
                            html: `
                                <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
                                    <img src="${img_acuraua_01}" alt="UGAI-Acuraua_01" style="width:180px; border-radius:6px;" />
                                    <img src="${img_acuraua_02}" alt="UGAI-Acuraua_02" style="width:180px; border-radius:6px;" />
                                </div>
                                    <br>
                                <span>
                                    A UGAI do Rio Gregório (UGAI Acuraua) fica na zona rural do município de Tarauacá, no interior do estado do Acre, localizada especificamente dentro da Floresta Estadual do Rio Gregório.
                                </span>
                            `,
                            confirmButtonText: 'Fechar'
                        });
                    }

                    if (id === "liberdade"){
                        Swal.fire({
                            title: "UGAI-Liberdade",
                            html: `
                                <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
                                    <img src="${img_liberdade_01}" alt="UGAI Liberdade 1" style="width:180px; border-radius:6px;" />
                                    <img src="${img_liberdade_02}" alt="UGAI Liberdade 2" style="width:180px; border-radius:6px;" />
                                </div>
                                    <br>
                                <span>
                                    A UGAI (Unidade de Gestão Ambiental Integrada) do Rio Liberdade está localizada na Rodovia BR-364, na região do município de Cruzeiro do Sul / Tarauacá (a depender do trecho de divisa da Floresta Estadual do Rio Liberdade).
                                </span>
                            `,
                            confirmButtonText: 'Fechar'
                        });
                    }
                }}

                onMouseOver={(e) => {
                    const antimary = e.target.closest("#antimary");
                    const chandles = e.target.closest("#chandles");
                    const afluente = e.target.closest("#afluente");
                    const acuraua = e.target.closest("#acuraua");
                    const liberdade = e.target.closest("#liberdade");

                    if (antimary) {
                        antimary.style.cursor = "pointer";
                        antimary.style.fill = "blue";
                    }

                    if (chandles) {
                        chandles.style.cursor = "pointer";
                        chandles.style.fill = "blue";
                    }

                    if (afluente){
                        afluente.style.cursor = "pointer";
                        afluente.style.fill = "blue";
                    }

                    if (acuraua){
                        acuraua.style.cursor = "pointer";
                        acuraua.style.fill = "blue";
                    }

                    if (liberdade){
                        liberdade.style.cursor = "pointer";
                        liberdade.style.fill = "blue";
                    }
                }}

                onMouseOut={(e) => {
                    const antimary = e.target.closest("#antimary");
                    const chandles = e.target.closest("#chandles");
                    const afluente = e.target.closest("#afluente");
                    const acuraua = e.target.closest("#acuraua");
                    const liberdade = e.target.closest("#liberdade");

                    if (antimary) {
                        antimary.style.fill = "#000000";
                    }

                    if (chandles) {
                        chandles.style.fill = "#000000";
                    }

                    if (afluente){
                        afluente.style.fill = "#000000";
                    }

                    if (acuraua){
                        acuraua.style.fill = "#000000";
                    }

                    if (liberdade){
                        liberdade.style.fill = "#000000";
                    }
                }}

            />

        </div>
    );
}

export default MapaAcre;