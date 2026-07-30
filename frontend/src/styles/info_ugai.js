import styled, { keyframes } from "styled-components";

const rise = keyframes`
  from {
    opacity: 0;
    transform: translateY(18px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const CardUgai = styled.div`
  min-height: 100vh;
  padding: 40px 20px 60px;
  box-sizing: border-box;

  display: flex;
  justify-content: center;
  align-items: flex-start;

  @media (max-width: 640px) {
    padding: 24px 12px 50px;
  }
`;

export const IuCard = styled.div`
  width: 100%;
  max-width: 1080px;

  background: #fff;

  border: 1px solid #e2e8f0;
  border-radius: 20px;

  overflow: hidden;

  box-shadow: 0 4px 24px rgba(0, 0, 0, .07);

  animation: ${rise} .45s cubic-bezier(.22,1,.36,1);
`;

export const IuHeader = styled.div`
  background: #0059B2;

  padding: 32px 36px;

  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width:640px){
    padding:24px 20px;
    gap:14px;
  }
`;

export const IuHeaderIcon = styled.div`
  width: 52px;
  height: 52px;

  background: rgba(255,255,255,.15);

  border-radius: 8px;

  display:flex;
  justify-content:center;
  align-items:center;

  color:#fff;

  flex-shrink:0;

  @media (max-width:640px){
    width:44px;
    height:44px;
  }
`;

export const IuHeaderTitles = styled.div`
  display:flex;
  flex-direction:column;

  h2{
    margin:0;

    font-family:'Plus Jakarta Sans',sans-serif;
    font-size:1.6rem;
    font-weight:700;

    color:#fff;
    line-height:1.2;
  }

  p{
    margin:4px 0 0;

    font-family:'Plus Jakarta Sans',sans-serif;
    font-size:.9rem;

    color:rgba(255,255,255,.75);
  }

  @media (max-width:640px){

    h2{
      font-size:1.2rem;
    }

  }
`;

export const IuBody = styled.div`
  padding:36px;

  display:flex;
  flex-direction:column;

  gap:30px;

  @media (max-width:640px){
    padding:24px 20px;
    gap:22px;
  }
`;

export const IuSection = styled.section`
  display:flex;
  flex-direction:column;
`;

export const IuSectionTitle = styled.h3`
  margin:0 0 14px;

  padding-bottom:10px;

  border-bottom:1px solid #e2e8f0;

  display:flex;
  align-items:center;
  gap:8px;

  font-family:'Plus Jakarta Sans',sans-serif;
  font-size:.72rem;
  font-weight:700;

  text-transform:uppercase;
  letter-spacing:1px;

  color:#64748b;

  &::before{
    content:"";
    width:6px;
    height:6px;
    border-radius:50%;
    background:#0059B2;
    flex-shrink:0;
  }
`;

export const IuGrid = styled.div`
  display:grid;

  grid-template-columns:repeat(2,1fr);

  gap:12px;

  @media (max-width:640px){
    grid-template-columns:1fr;
  }
`;

export const IuField = styled.div`
  background:#f8fafc;

  border:1px solid #e2e8f0;
  border-left:3px solid #0059B2;
  border-radius:8px;

  padding:16px 18px;

  display:flex;
  flex-direction:column;

  gap:6px;

  grid-column:${props => props.span ? "1 / -1" : "auto"};

  transition: box-shadow .2s ease;

  &:hover{
    box-shadow: 0 2px 10px rgba(0,0,0,.05);
  }

  @media (max-width:640px){
    grid-column:auto;
  }
`;

export const IuFieldLabel = styled.span`
  font-family:'Plus Jakarta Sans',sans-serif;
  font-size:.68rem;
  font-weight:600;

  text-transform:uppercase;

  letter-spacing:.8px;

  color:#64748b;
`;

export const IuFieldValue = styled.span`
  font-family:'Merriweather',serif;
  font-size:.98rem;
  font-weight:400;

  color:#1a202c;

  line-height:1.5;
`;

export const Badge = styled.span`
  display:inline-flex;
  align-items:center;
  gap:6px;

  width:fit-content;

  padding:6px 14px;

  border-radius:999px;

  font-family:'Plus Jakarta Sans',sans-serif;
  font-size:.78rem;
  font-weight:700;

  text-transform:uppercase;

  letter-spacing:.5px;

  background:${({color})=>{
    switch(color){
      case "green":
        return "#e6f4ec";
      case "amber":
        return "#fef3e2";
      case "red":
        return "#fdecea";
      default:
        return "#f1f5f9";
    }
  }};

  color:${({color})=>{
    switch(color){
      case "green":
        return "#1e6e3a";
      case "amber":
        return "#92560a";
      case "red":
        return "#9b1c1c";
      default:
        return "#475569";
    }
  }};

  svg{
    flex-shrink:0;
  }
`;

// Membros da solicitação de UGAI
export const PageContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 36px 36px;

  @media (max-width: 640px) {
    padding: 0 20px 24px;
  }
`;

// Wrapper que limita a largura máxima em 1080px
export const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
`;

// Grid responsivo para organizar os membros
export const MembersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
  width: 100%;
`;

// Card individual para cada membro
export const MemberCard = styled.div`
  position: relative;

  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 16px 18px 16px 62px;
  width: 100%;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  gap: 3px;

  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08);
    border-color: #0059B2;
  }

  &::before {
    content: "";
    position: absolute;
    left: 18px;
    top: 16px;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: rgba(0, 89, 178, .12);
  }
`;

export const MemberName = styled.h3`
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.98rem;
  color: ${props => props.$isUnknown ? '#8c9ba5' : '#1a202c'};
  font-weight: 700;
  margin: 0 0 2px;
  line-height: 1.3;
`;

// Estilo extra preparado para os novos dados que você vai colocar (ex: cargo, bio, etc)
export const MemberDetail = styled.p`
  font-family: 'Merriweather', serif;
  font-size: 0.8rem;
  color: #64748b;
  margin: 0;
  line-height: 1.4;
  word-break: break-word;
`;