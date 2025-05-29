import { useEffect, useState } from "react";

import PieChartComponent from "@/components/molecules/PieChart";
import MainLayout from "@/components/organisms/MainLayout";

import type { PieData } from "../types";

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
import { mockProducers } from "@/services/mocks/producerData";

export default function DashboardPage() {
  const [totalFarms, setTotalFarms] = useState(0);
  const [totalHectares, setTotalHectares] = useState(0);
  const [pieData, setPieData] = useState<PieData>({
    perState: [],
    perCulture: [],
    landUse: [],
  });

  useEffect(() => {
    const mockFetch = async () => {
      const allFarms = mockProducers.flatMap((p) => p.farms);

      const totalHectaresValue = mockProducers.map((producer) => ({
        name: producer.name,
        totalArea: producer.farms.reduce(
          (sum, farm) => sum + farm.totalArea,
          0
        ),
      }));

      const perState: Record<string, number> = {};
      allFarms.forEach((farm) => {
        perState[farm.state] = (perState[farm.state] || 0) + farm.totalArea;
      });

      const pieChartByState = Object.entries(perState).map(
        ([state, totalArea]) => ({
          name: state,
          value: totalArea,
        })
      );

      const perCulture: Record<string, number> = {};
      allFarms.forEach((farm) => {
        farm.crops.forEach((crop) => {
          perCulture[crop.culture] =
            (perCulture[crop.culture] || 0) + farm.totalArea;
        });
      });

      const pieChartByCulture = Object.entries(perCulture).map(
        ([culture, totalArea]) => ({
          name: culture,
          value: totalArea,
        })
      );

      const perByLandUse = {
        "Área agricultável": 0,
        Vegetação: 0,
      };

      allFarms.forEach((farm) => {
        perByLandUse["Área agricultável"] += farm.agricultableArea;
        perByLandUse.Vegetação += farm.vegetationArea;
      });

      const pieChartByLandUse = Object.entries(perByLandUse).map(
        ([landUse, totalArea]) => ({
          name: landUse,
          value: totalArea,
        })
      );

      setTotalFarms(allFarms.length);
      setTotalHectares(totalHectaresValue.length);

      setPieData({
        perState: pieChartByState,
        perCulture: pieChartByCulture,
        landUse: pieChartByLandUse,
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
            <PieChartComponent data={pieData.perState} />
          </GraphContent>
        </GraphCard>

        <GraphCard>
          <GraphTitle>Por Cultura</GraphTitle>
          <GraphContent>
            <PieChartComponent data={pieData.perCulture} />
          </GraphContent>
        </GraphCard>

        <GraphCard>
          <GraphTitle>Uso do Solo</GraphTitle>
          <GraphContent>
            <PieChartComponent data={pieData.landUse} />
          </GraphContent>
        </GraphCard>
      </ContainerContentGraphs>
    </MainLayout>
  );
}
