import styled from "styled-components";

// Form File
export const FileUploadForm = styled.form`
  width: fit-content;
  height: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const FileUploadLabel = styled.label`
  cursor: pointer;
  background-color: #ddd;
  padding: 30px 70px;
  border-radius: 40px;
  border: 2px dashed rgb(82, 82, 82);
  box-shadow: 0 0 200px -50px rgba(0, 0, 0, 0.719);

  input {
    display: none;
  }

  svg {
    height: 50px;
    fill: rgb(82, 82, 82);
    margin-bottom: 20px;
  }
`;

export const FileUploadDesign = styled.div`
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
  color: white;
  transition: all 0.3s;

  &:hover {
    background-color: rgb(14, 14, 14);
  }
`;