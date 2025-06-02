import styled from "styled-components";

export const PageTitle = styled.h1`
  font-size: 2rem;
  margin: 10px;
  cursor: default;
  color: ${({ theme }) =>
    theme.palette.mode === "light" ? "#1c2230" : "#ffffff"};
`;

export const ContainerTableAndBtn = styled.div`
  display: flex;
  width: 100%;
  height: 80%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

export const ContainerBtn = styled.div`
  display: flex;
  width: 95%;
  height: 10%;
  align-items: center;
  justify-content: end;
  padding: 12px;
`;

export const ContainerTableContent = styled.div`
  display: flex;
  width: 95%;
  height: 80%;
`;
