import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";

import NavUser from "../components/NavUser";

import ameerega_img from "../img/Ameerega_macero_AlexanderTamaniniMônico.png";
import enyaliodes_img from "../img/Enyalioides_laticeps_AlexanderTamaniniMônico.JPG";
import phyllomedusa_img from "../img/Phyllomedusa_chaparroi_AlexanderTamaniniMônico.JPG";

const Page = styled.div`
  min-height: 100vh;
  padding: 40px 0;
`;

const CarouselCard = styled.div`
  border: none;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.12);
`;

const CarouselImage = styled.img`
  height: 520px;
  width: 100%;
  object-fit: cover;
`;

const Caption = styled.div`
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, .85),
    rgba(0, 0, 0, .15)
  );

  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;

  padding: 30px;
`;

const Title = styled.h2`
  font-weight: 700;
  color: #1f5134;
`;

function Dashboard() {
  return (
    <>
      <NavUser />
      <Page>
        <div className="container">
          <div className="text-center mb-4">
            <Title>
                🌿 Imagens produzidas durante pesquisas
            </Title>
            <p className="text-muted">
              Registros fotográficos obtidos durante pesquisas científicas
              realizadas em Unidades de Conservação do Estado do Acre.
            </p>
          </div>
          <CarouselCard className="card">
            <div
              id="carouselExampleCaptions"
              className="carousel slide"
              data-bs-ride="carousel"
            >
              <div className="carousel-indicators">
                <button
                  type="button"
                  data-bs-target="#carouselExampleCaptions"
                  data-bs-slide-to="0"
                  className="active"
                ></button>
                <button
                  type="button"
                  data-bs-target="#carouselExampleCaptions"
                  data-bs-slide-to="1"
                ></button>
                <button
                  type="button"
                  data-bs-target="#carouselExampleCaptions"
                  data-bs-slide-to="2"
                ></button>
              </div>
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <CarouselImage
                    src={ameerega_img}
                    alt="Ameerega macero"
                  />
                  <Caption className="carousel-caption">
                    <h4>Ameerega macero</h4>
                    <p>
                      Espécie registrada durante atividades de pesquisa em
                      Unidade de Conservação.
                    </p>
                  </Caption>
                </div>
                <div className="carousel-item">
                  <CarouselImage
                    src={enyaliodes_img}
                    alt="Enyalioides laticeps"
                  />
                  <Caption className="carousel-caption">
                    <h4>Enyalioides laticeps</h4>
                    <p>
                      Registro obtido durante levantamento da fauna em área
                      protegida.
                    </p>
                  </Caption>
                </div>
                <div className="carousel-item">
                  <CarouselImage
                    src={phyllomedusa_img}
                    alt="Phyllomedusa chaparroi"
                  />
                  <Caption className="carousel-caption">
                    <h4>Phyllomedusa chaparroi</h4>
                    <p>
                      Espécie documentada em pesquisa científica autorizada
                      pela SEMA.
                    </p>
                  </Caption>
                </div>
              </div>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselExampleCaptions"
                data-bs-slide="prev"
              >
                <span className="carousel-control-prev-icon"></span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselExampleCaptions"
                data-bs-slide="next"
              >
                <span className="carousel-control-next-icon"></span>
              </button>
            </div>
          </CarouselCard>
        </div>
      </Page>
    </>
  );
}

export default Dashboard;