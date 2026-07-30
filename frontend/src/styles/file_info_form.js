import styled from "styled-components";

export const Title = styled.h5`
  font-family:'Plus Jakarta Sans',sans-serif;
  font-size: 1.2rem;
  font-weight: 500;
`

export const UploadContainer = styled.form`
  width: fit-content;
  height: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const UploadLabel = styled.label`
  cursor: pointer;
  background-color: #ddd;
  padding: 30px 70px;
  border-radius: 40px;
  border: 2px dashed rgb(82, 82, 82);
  box-shadow: 0px 0px 200px -50px rgba(0, 0, 0, 0.719);

  input {
    display: none;
  }

  svg {
    height: 50px;
    fill: rgb(82, 82, 82);
    margin-bottom: 20px;
  }
`;

export const UploadDesign = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
`;

export const BrowseButton = styled.span`
  background-color: rgb(82, 82, 82);
  padding: 5px 15px;
  border-radius: 10px;
  color: #fff;
  transition: all 0.3s;

  &:hover {
    background-color: rgb(14, 14, 14);
  }
`;

export const DocumentGrid = styled.div`
  margin-top: 1rem;
`;

export const DocumentColumn = styled.div`
  margin-top: 1rem;
`;

export const DocumentCard = styled.div`
  height: 100%;
  border: none;
`;

export const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const PdfContainer = styled.div`
  text-align: center;
  margin-bottom: 1rem;
`;

export const CardTitle = styled.h6`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const CardDate = styled.small`
  color: #6c757d;
  margin-bottom: 1rem;
`;

export const ButtonContainer = styled.div`
  margin-top: auto;
`;

export const ViewButton = styled.a`
  width: 100%;
`;

export const DeleteButton = styled.button`
  width: 100%;
  margin-top: 0.25rem;
`;