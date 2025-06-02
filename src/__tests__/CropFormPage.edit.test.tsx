/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomThemeProvider } from "@/contexts/CustomThemeProvider";
import CropFormPage from "@/features/crop/pages/CropFormPage";
import { store } from "@/redux/store";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { toast } from "react-toastify";

jest.mock("@/services/mocks/producerData", () => {
  const mockProducers = [
    {
      id: 1,
      name: "João da Silva",
      documentType: "CPF",
      document: "653.181.830-18",
      phone: "(16) 99123-4567",
      email: "joao.silva@email.com",
      farms: [
        {
          id: 101,
          name: "Fazenda Boa Vista",
          city: "Ribeirão Preto",
          state: "São Paulo",
          totalArea: 500,
          agricultableArea: 350,
          vegetationArea: 150,
          crops: [{ id: 1001, harvest: "Safra 2023", culture: "Soja" }],
        },
        {
          id: 102,
          name: "Fazenda Primavera Verde",
          city: "Apucarana",
          state: "Paraná",
          totalArea: 650,
          agricultableArea: 450,
          vegetationArea: 200,
          crops: [{ id: 1002, harvest: "Safra 2022", culture: "Soja" }],
        },
      ],
    },
  ];

  const findCropById = (id: number) => {
    for (const producer of mockProducers) {
      for (const farm of producer.farms) {
        const crop = farm.crops.find((c) => c.id === id);
        if (crop) return crop;
      }
    }
    return null;
  };

  return {
    mockProducers,
    getCropById: jest.fn((id: number) => Promise.resolve(findCropById(id))),
  };
});

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: "1001" }),
}));

jest.mock("@/components/organisms/MainLayout", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

jest.mock("@/components/atoms/FormButton", () => ({
  __esModule: true,
  default: (props: any) => (
    <button onClick={props.onClick} type={props.type}>
      {props.label}
    </button>
  ),
}));

jest.mock("@/components/atoms/Button", () => ({
  __esModule: true,
  default: (props: any) => (
    <button onClick={props.onClick} type={props.type}>
      {props.label}
    </button>
  ),
}));

jest.mock("@/components/atoms/Input", () => ({
  __esModule: true,
  default: ({
    label,
    name,
    value,
    onChange,
  }: {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }) => (
    <input
      aria-label={label}
      placeholder={label}
      name={name}
      value={value}
      onChange={onChange}
    />
  ),
}));

jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

const renderPage = () => {
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <CustomThemeProvider>
          <CropFormPage />
        </CustomThemeProvider>
      </BrowserRouter>
    </Provider>
  );
};

describe("CropFormPage - Editing", () => {
  it("should load crop data and edit successfully", async () => {
    renderPage();

    const harvestInput = await screen.findByPlaceholderText("Safra");
    const cultureInput = await screen.findByPlaceholderText("Cultura");

    expect(harvestInput).toHaveValue("Safra 2023");
    expect(cultureInput).toHaveValue("Soja");

    fireEvent.change(harvestInput, { target: { value: "Safra 2024" } });
    fireEvent.change(cultureInput, { target: { value: "Milho" } });

    const submitButton = await screen.findByRole("button", {
      name: "Editar",
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Cultura editada!");
    });
  });
});
