import 'bootstrap/dist/css/bootstrap.min.css';
import InfoPesquisa from '../components/InfoPesquisa';
import NavUser from '../components/NavUser';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import InfoMembrosPesq from '../components/InfoMembPesq';
import { useState } from 'react';
import {
  IconLeaf,
} from '../components/IconesProntos';
import { useLocation } from 'react-router-dom';
import "../styles/btn_secondary.css"
import * as S from "../styles/info_pesquisa.js";

function PageInfoPesq() {
  const [component, setComponent] = useState("main");
  const location = useLocation();
  const item = location.state;

  function switchComponent(targetComponent) {
    setComponent(targetComponent);
  }

  return (
    <>
      <NavUser />
      <ToastContainer />
      <S.Root>
        <S.Sheet>
          {/* ── Header ── */}
          <S.Header>
            <S.HeaderInner>
              <S.HeaderIcon>
                <IconLeaf />
              </S.HeaderIcon>

              <S.HeaderContent>
                <S.HeaderTitle>
                  Relatório de Pesquisa
                </S.HeaderTitle>

                <S.HeaderSub>
                  Informações detalhadas da solicitação
                </S.HeaderSub>
              </S.HeaderContent>
            </S.HeaderInner>
          </S.Header>

          <S.LinkMenuContainer className="container">
            <S.LinkMenu>
              <S.MenuButton
                $active={component === "main"}
                onClick={() => switchComponent("main")}
              >
                <S.MenuButtonText>
                  Informações gerais
                </S.MenuButtonText>

                <S.MenuButtonIndicator />
              </S.MenuButton>

              <S.MenuButton
                $active={component === "members"}
                onClick={() => switchComponent("members")}
              >
                <S.MenuButtonText>
                  Membros inclusos
                </S.MenuButtonText>

                <S.MenuButtonIndicator />
              </S.MenuButton>
            </S.LinkMenu>
          </S.LinkMenuContainer>

          {component === "main" && <InfoPesquisa />}
          {component === "members" && <InfoMembrosPesq />}

        </S.Sheet>{/* /ip-body */}
      </S.Root>{/* /ip-sheet */}
    </>
  );
}

export default PageInfoPesq;
