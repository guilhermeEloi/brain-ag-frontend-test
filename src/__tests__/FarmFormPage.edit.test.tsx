/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomThemeProvider } from "@/contexts/CustomThemeProvider";
import FarmFormPage from "@/features/farm/pages/FarmFormPage";
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

  const getFarmById = (id: number) =>
    Promise.resolve(mockProducers.find((farm) => farm.id === id) || null);

  return {
    mockProducers,
    getFarmById: jest.fn(getFarmById),
  };
});

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: "101" }),
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

jest.mock("@/components/atoms/Select", () => ({
  __esModule: true,
  default: ({
    label,
    name,
    value,
    onChange,
    options,
  }: {
    label: string;
    name: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: { value: any; label: string }[];
  }) => (
    <select
      aria-label={label}
      name={name}
      value={value}
      onChange={onChange}
      data-testid={`${name}-select`}
    >
      <option value="">Selecione</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
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
          <FarmFormPage />
        </CustomThemeProvider>
      </BrowserRouter>
    </Provider>
  );
};

describe("FarmFormPage - Editing", () => {
  it("should load farm data and edit successfully", async () => {
    renderPage();

    const nameInput = await screen.findByLabelText("Nome da Fazenda");
    const stateInput = await screen.findByLabelText("Estado");
    const producerSelect = await screen.findByLabelText("Produtor");

    expect(nameInput).toHaveValue("Fazenda Boa Vista");
    expect(stateInput).toHaveValue("São Paulo");
    expect(producerSelect).toHaveValue("1");

    fireEvent.change(nameInput, { target: { value: "Fazenda Editada" } });
    fireEvent.change(stateInput, { target: { value: "Minas Gerais" } });

    const editButton = await screen.findByRole("button", { name: "Editar" });
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "Fazenda editada com sucesso!"
      );
    });

    expect(mockNavigate).toHaveBeenCalledWith("/farms");
  });
});
