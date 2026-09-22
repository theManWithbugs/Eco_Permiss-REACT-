import styled from "styled-components";

/* ---------- Paleta ----------
  Verde-mata:  #1F4B3F  (títulos, botões principais)
  Verde-musgo: #3E7C59  (acentos, foco)
  Areia:       #F6F3EC  (fundo)
  Casca:       #E4DECF  (bordas)
  Âmbar:       #C97B3D  (remover / alerta suave)
------------------------------- */

export const Pagina = styled.div`
  min-height: 100%;
  padding: 2.5rem 1rem;
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: #1F2D25;
`;

export const Cabecalho = styled.div`
  background: white;
  padding: 10px;
  border-radius: 5px;
  max-width: 720px;
  margin: 0 auto 1.5rem auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

export const Titulo = styled.div`
  h1 {
    font-family: 'Merriweather', serif;
    font-size: 1.5rem;
    color: #1F4B3F;
    margin: 0;
  }
  p {
    margin: 0.2rem 0 0 0;
    font-size: 0.85rem;
    color: #5C6B62;
  }
`;

export const BotaoAdicionar = styled.button`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background-color: transparent;
  color: #1F4B3F;
  border: 1.5px solid #1F4B3F;
  border-radius: 999px;
  padding: 0.5rem 1.1rem;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;

  &:hover {
    background-color: #1F4B3F;
    color: #F6F3EC;
  }
`;

export const Formulario = styled.form`
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

export const CartaoMembro = styled.div`
  background-color: #FFFFFF;
  border: 1px solid #E4DECF;
  border-left: 4px solid #3E7C59;
  border-radius: 10px;
  padding: 1.75rem;
  box-shadow: 0 2px 10px rgba(31, 75, 63, 0.06);
`;

export const CabecalhoMembro = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px dashed #E4DECF;
`;

export const NumeroMembro = styled.span`
  font-family: 'Merriweather', serif;
  font-size: 0.95rem;
  color: #1F4B3F;
  font-weight: 700;
`;

export const Grade = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem 1.25rem;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const Campo = styled.div`
  display: flex;
  flex-direction: column;
  grid-column: ${props => (props.$largo ? '1 / -1' : 'auto')};
`;

export const Label = styled.label`
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #5C6B62;
  margin-bottom: 0.4rem;
`;

export const estiloCampo = `
  padding: 0.6rem 0.75rem;
  border: 1px solid #DCD6C7;
  border-radius: 7px;
  font-size: 0.92rem;
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: #1F2D25;
  background-color: #FCFBF8;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &:focus {
    outline: none;
    border-color: #3E7C59;
    box-shadow: 0 0 0 3px rgba(62, 124, 89, 0.15);
  }
`;

export const Input = styled.input`
  ${estiloCampo}
`;

export const Select = styled.select`
  ${estiloCampo}
  appearance: none;
  background-image: linear-gradient(45deg, transparent 50%, #3E7C59 50%),
    linear-gradient(135deg, #3E7C59 50%, transparent 50%);
  background-position: calc(100% - 18px) center, calc(100% - 13px) center;
  background-size: 5px 5px, 5px 5px;
  background-repeat: no-repeat;
`;

export const BotaoRemover = styled.button`
  background-color: transparent;
  color: #C97B3D;
  border: none;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.2rem 0.4rem;

  &:hover {
    text-decoration: underline;
  }
`;

export const RodapeForm = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const BotaoEnviar = styled.button`
  margin-top: 0.5rem;
  background-color: #1F4B3F;
  color: #F6F3EC;
  border: none;
  border-radius: 999px;
  padding: 0.7rem 2rem;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: #16362D;
  }
`;