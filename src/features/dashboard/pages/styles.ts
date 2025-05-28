import styled from "styled-components";

export const PageTitle = styled.h1`
  font-size: 2rem;
  margin: 10px;
  cursor: default;
  color: ${({ theme }) =>
    theme.palette.mode === "light" ? "#1c2230" : "#ffffff"};
`;

export const MetricContainer = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 22px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const MetricCard = styled.div`
  background-color: ${({ theme }) =>
    theme.palette.mode === "light" ? "#ffffff" : "#2a3244"};
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex: 1;
`;

export const MetricTitle = styled.p`
  font-size: 1.1rem;
  color: ${({ theme }) =>
    theme.palette.mode === "light" ? "#1c2230" : "#ffffff"};
  margin-bottom: 0.5rem;
`;

export const MetricValue = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  color: ${({ theme }) =>
    theme.palette.mode === "light" ? "#1c2230" : "#ffffff"};
`;

export const ContainerContentGraphs = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 22px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const GraphCard = styled.div`
  background-color: ${({ theme }) =>
    theme.palette.mode === "light" ? "#ffffff" : "#2a3244"};
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const GraphTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: ${({ theme }) =>
    theme.palette.mode === "light" ? "#1c2230" : "#ffffff"};
`;

export const GraphContent = styled.div`
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
