import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { mockProducers } from "@/services/mocks/producerData";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import { CustomThemeProvider } from "@/contexts/CustomThemeProvider";

jest.mock("@/components/molecules/PieChart", () => () => (
  <div>PieChartMock</div>
));
jest.mock("@/components/organisms/MainLayout", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

const renderWithTheme = (ui: React.ReactElement) =>
  render(<CustomThemeProvider>{ui}</CustomThemeProvider>);

describe("DashboardPage", () => {
  test("renders the page title", () => {
    renderWithTheme(<DashboardPage />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  test("renders metrics with correct values", async () => {
    renderWithTheme(<DashboardPage />);

    await waitFor(() => {
      const totalFarms = mockProducers.flatMap((p) => p.farms).length;
      expect(screen.getByText(totalFarms.toString())).toBeInTheDocument();

      expect(
        screen.getByText(`${mockProducers.length.toLocaleString()} ha`)
      ).toBeInTheDocument();
    });
  });

  test("renders the charts", async () => {
    renderWithTheme(<DashboardPage />);

    expect(screen.getByText("Por Estado")).toBeInTheDocument();
    expect(screen.getByText("Por Cultura")).toBeInTheDocument();
    expect(screen.getByText("Uso do Solo")).toBeInTheDocument();

    await waitFor(() => {
      const pieCharts = screen.getAllByText("PieChartMock");
      expect(pieCharts.length).toBe(3);
    });
  });
});
