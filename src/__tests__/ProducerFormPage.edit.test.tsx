/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomThemeProvider } from "@/contexts/CustomThemeProvider";
import ProducerFormPage from "@/features/producer/pages/ProducerFormPage";
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
        },
      ],
    },
  ];

  return {
    mockProducers,
    getProducerById: jest.fn((id: number) =>
      Promise.resolve(mockProducers.find((p) => p.id === id) || null)
    ),
  };
});

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: "1" }),
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
  }: {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  }) => (
    <select aria-label={label} name={name} value={value} onChange={onChange}>
      <option value="CPF">CPF</option>
      <option value="CNPJ">CNPJ</option>
    </select>
  ),
}));

jest.mock("@/utils", () => ({
  isValidCPF: jest.fn((cpf) => cpf === "65318183018"),
  isValidCNPJ: jest.fn((cnpj) => cnpj === "11222333000181"),
  isValidEmail: jest.fn((email) => email.includes("@")),
  maskCPF: jest.fn((value) => value),
  maskCNPJ: jest.fn((value) => value),
  maskPhone: jest.fn((value) => value),
  maskCellphone: jest.fn((value) => value),
  maskEmail: jest.fn((value) => value),
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
          <ProducerFormPage />
        </CustomThemeProvider>
      </BrowserRouter>
    </Provider>
  );
};

describe("ProducerFormPage - Editing", () => {
  it("should load producer data and edit successfully", async () => {
    renderPage();

    const nameInput = await screen.findByPlaceholderText("Nome do Produtor");
    expect(nameInput).toHaveValue("João da Silva");

    const submitButton = await screen.findByRole("button", { name: "Editar" });

    fireEvent.change(nameInput, {
      target: { value: "João Pereira da Silva", name: "name" },
    });
    fireEvent.change(screen.getByPlaceholderText("Telefone"), {
      target: { value: "(11) 92654-8679", name: "phone" },
    });
    fireEvent.change(screen.getByPlaceholderText("E-mail"), {
      target: { value: "novo@email.com", name: "email" },
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Produtor editado!");
    });
  });
});
