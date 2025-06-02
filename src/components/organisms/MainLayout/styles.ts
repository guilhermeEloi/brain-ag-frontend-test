import styled from "styled-components";

export const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  background-color: ${({ theme }) =>
    theme.palette.mode === "light" ? "#d6dcea" : "#1c2230"};
`;

export const MainArea = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

export const Content = styled.main`
  flex: 1;
  overflow: auto;
`;
