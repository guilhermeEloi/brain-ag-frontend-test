import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  width: 100%;
  height: 80%;
  justify-content: center;
  align-items: center;
`;

export const ContainerForm = styled.div`
  display: flex;
  width: 50%;
  height: 100%;
  border-radius: 12px;
  background-color: ${({ theme }) =>
    theme.palette.mode === "light" ? "#ffffff" : "#2A3244"};
  justify-content: center;
  align-items: center;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 80%;
  }

  @media (max-width: 425px) {
    width: 90%;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  height: 90%;
  width: 100%;
  justify-content: space-between;
`;

export const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  width: 50%;
`;

export const FormActions = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-evenly;
`;
