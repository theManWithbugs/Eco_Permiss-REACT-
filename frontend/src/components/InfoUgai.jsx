import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import API_URL from "../constants/global.js";
import styled from 'styled-components';
import { dataInfoUgai } from '../constants/global.js';

import {
  CardUgai,
  IuCard,
  IuHeader,
  IuHeaderIcon,
  IuHeaderTitles,
  IuBody,
  IuSection,
  IuSectionTitle,
  IuGrid,
  IuField,
  IuFieldLabel,
  IuFieldValue,
  Badge,
  PageContainer,
  ContentWrapper,
  MembersGrid,
  MemberCard,
  MemberName,
  MemberDetail
} from "../styles/info_ugai.js";

function StatusBadge({ status }) {
  const map = {
    APROVADO: {
      color: "green",
      icon: "M9 12l2 2 4-4",
    },
    PENDENTE: {
      color: "amber",
      icon: "M12 8v4l3 3",
    },
    INDEFERIDO: {
      color: "red",
      icon: "M6 18L18 6M6 6l12 12",
    },
  };

  const s = map[status] || {
    color: "gray",
    icon: "M5 13l4 4L19 7",
  };
  return (
    <Badge color={s.color}>
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={s.icon} />
      </svg>

      {status}
    </Badge>
  );
}

function Field({ label, value, span }) {
  return (
    <IuField span={span}>
      <IuFieldLabel>{label}</IuFieldLabel>
      <IuFieldValue>{value || "—"}</IuFieldValue>
    </IuField>
  );
}

function InfoUgai() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("access");
  const id_public = location.state;
  const [obj, setObj] = useState();
  const [membros, setMembros] = useState([]);

  useEffect(() => {
    if (!id_public) navigate('/minhas_solic');
    const carregarDados = async () => {
      const dados = await dataInfoUgai(token, id_public);
      setObj(dados.solicitacao);
      setMembros(dados.membros);
    }
    carregarDados();
  }, [id_public, navigate]);

  if (!obj) return null;

  return (
    <>
      <CardUgai>
        <ToastContainer />

        <IuCard>

          <IuHeader>

            <IuHeaderIcon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293z" />
                <path d="m8 3.293 4.712 4.712A4.5 4.5 0 0 0 8.758 15H3.5A1.5 1.5 0 0 1 2 13.5V9.293z" />
                <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m1.679-4.493-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.707l.547.547 1.17-1.951a.5.5 0 1 1 .858.514" />
              </svg>
            </IuHeaderIcon>

            <IuHeaderTitles>
              <h2>Solicitação de UGAI</h2>
              <p>Resumo e Detalhes</p>
            </IuHeaderTitles>

          </IuHeader>

          <IuBody>

            <IuSection>

              <IuSectionTitle>Identificação</IuSectionTitle>

              <IuGrid>

                <Field
                  label="UGAI"
                  value={obj.nome_ugai}
                />

                <Field
                  label="Instituição"
                  value={obj.instituicao}
                />

              </IuGrid>

            </IuSection>

            <IuSection>

              <IuSectionTitle>Período</IuSectionTitle>

              <IuGrid>

                <Field
                  label="Data de Início"
                  value={obj.data_inicio || obj.data_solicitacao}
                />

                <Field
                  label="Data de Término"
                  value={obj.data_final}
                />

              </IuGrid>

            </IuSection>

            <IuSection>

              <IuSectionTitle>Atividades e Público</IuSectionTitle>

              <IuGrid>

                <Field
                  label="Atividades Desenvolvidas"
                  value={obj.ativ_desenv}
                  span
                />

                <Field
                  label="Público Alvo"
                  value={obj.publico_alvo}
                />

              </IuGrid>

            </IuSection>

            <IuSection>

              <IuSectionTitle>Status</IuSectionTitle>

              <IuGrid>

                <IuField>

                  <IuFieldLabel>
                    Status da Solicitação
                  </IuFieldLabel>

                  <StatusBadge
                    status={obj.status}
                  />

                </IuField>

                <Field
                  label="Data da Solicitação"
                  value={obj.data_solicitacao}
                />

              </IuGrid>

            </IuSection>

          </IuBody>

          <PageContainer>
            <ContentWrapper>
              <MembersGrid>
                {membros.map((item, index) => (
                  <MemberCard key={index}>
                    <MemberName>{item.nome}</MemberName>
                    <MemberDetail>{item.telefone}</MemberDetail>
                    <MemberDetail>{item.cor_raca}</MemberDetail>
                    <MemberDetail>{item.genero}</MemberDetail>
                    <MemberDetail>{item.datas_nasc}</MemberDetail>
                  </MemberCard>
                ))}
              </MembersGrid>
            </ContentWrapper>
          </PageContainer>

        </IuCard>

      </CardUgai>

    </>
  );
}

export default InfoUgai;