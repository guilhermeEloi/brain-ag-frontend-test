import { useEffect, useState } from "react";

import PieChartComponent from "@/components/molecules/PieChart";
import MainLayout from "@/components/organisms/MainLayout";

import type { PieData } from "../types";

import {
  totalFarms as mockTotalFarms,
  totalHectares as mockTotalHectares,
  pieChartByState,
  pieChartByCulture,
  pieChartByLandUse,
} from "@/services/mocks/dashboardData";

import {
  PageTitle,
  MetricContainer,
  MetricCard,
  MetricTitle,
  MetricValue,
  ContainerContentGraphs,
  GraphCard,
  GraphTitle,
  GraphContent,
} from "./styles";

export default function DashboardPage() {
  const [totalFarms, setTotalFarms] = useState(0);
  const [totalHectares, setTotalHectares] = useState(0);
  const [pieData, setPieData] = useState<PieData>({
    porEstado: [],
    porCultura: [],
    usoSolo: [],
  });

  useEffect(() => {
    const mockFetch = async () => {
      setTotalFarms(mockTotalFarms);
      setTotalHectares(mockTotalHectares);

      setPieData({
        porEstado: pieChartByState,
        porCultura: pieChartByCulture,
        usoSolo: pieChartByLandUse,
      });
    };

    mockFetch();
  }, []);
  return (
    <MainLayout>
      <PageTitle>Dashboard</PageTitle>

      <MetricContainer>
        <MetricCard>
          <MetricTitle>Fazendas Cadastradas</MetricTitle>
          <MetricValue>{totalFarms}</MetricValue>
        </MetricCard>
        <MetricCard>
          <MetricTitle>Hectares Registrados</MetricTitle>
          <MetricValue>{totalHectares.toLocaleString()} ha</MetricValue>
        </MetricCard>
      </MetricContainer>

      <ContainerContentGraphs>
        <GraphCard>
          <GraphTitle>Por Estado</GraphTitle>
          <GraphContent>
            <PieChartComponent data={pieData.porEstado} />
          </GraphContent>
        </GraphCard>

        <GraphCard>
          <GraphTitle>Por Cultura</GraphTitle>
          <GraphContent>
            <PieChartComponent data={pieData.porCultura} />
          </GraphContent>
        </GraphCard>

        <GraphCard>
          <GraphTitle>Uso do Solo</GraphTitle>
          <GraphContent>
            <PieChartComponent data={pieData.usoSolo} />
          </GraphContent>
        </GraphCard>
      </ContainerContentGraphs>
    </MainLayout>
  );
}
