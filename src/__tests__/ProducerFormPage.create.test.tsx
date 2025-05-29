/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomThemeProvider } from "@/contexts/CustomThemeProvider";
import ProducerFormPage from "@/features/producer/pages/ProducerFormPage";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { toast } from "react-toastify";

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
  isValidCPF: jest.fn((cpf) => cpf === "12345678909"),
  isValidCNPJ: jest.fn((cnpj) => cnpj === "11222333000181"),
  isValidEmail: jest.fn((email) => email.includes("@")),
  maskCPF: jest.fn((value) => value),
  maskCNPJ: jest.fn((value) => value),
  maskPhone: jest.fn((value) => value),
  maskCellphone: jest.fn((value) => value),
  maskEmail: jest.fn((value) => value),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

const renderPage = () =>
  render(
    <BrowserRouter>
      <CustomThemeProvider>
        <ProducerFormPage />
      </CustomThemeProvider>
    </BrowserRouter>
  );

describe("ProducerFormPage - Creation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the form correctly", () => {
    renderPage();
    expect(screen.getByText("Cadastrar Novo Produtor")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Nome do Produtor")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Número do Documento")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Telefone")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("E-mail")).toBeInTheDocument();
  });

  it("must fill out the form correctly", () => {
    renderPage();
    fireEvent.change(screen.getByPlaceholderText("Nome do Produtor"), {
      target: { value: "João", name: "name" },
    });
    fireEvent.change(screen.getByPlaceholderText("Número do Documento"), {
      target: { value: "12345678909", name: "document" },
    });
    fireEvent.change(screen.getByPlaceholderText("Telefone"), {
      target: { value: "11912345678", name: "phone" },
    });
    fireEvent.change(screen.getByPlaceholderText("E-mail"), {
      target: { value: "joao@email.com", name: "email" },
    });

    expect(screen.getByPlaceholderText("Nome do Produtor")).toHaveValue("João");
    expect(screen.getByPlaceholderText("Número do Documento")).toHaveValue(
      "12345678909"
    );
    expect(screen.getByPlaceholderText("Telefone")).toHaveValue("11912345678");
    expect(screen.getByPlaceholderText("E-mail")).toHaveValue("joao@email.com");
  });

  it("should show error if CPF is invalid", () => {
    renderPage();

    fireEvent.change(screen.getByPlaceholderText("Nome do Produtor"), {
      target: { value: "João Silva", name: "name" },
    });

    fireEvent.change(screen.getByPlaceholderText("Número do Documento"), {
      target: { value: "123.456.789-00", name: "document" },
    });

    fireEvent.click(screen.getByText("Cadastrar"));

    expect(toast.error).toHaveBeenCalledWith("Número de CPF inválido");
  });

  it("should show error if CNPJ is invalid", () => {
    renderPage();

    fireEvent.change(screen.getByLabelText("Tipo de Documento"), {
      target: { value: "CNPJ" },
    });

    fireEvent.change(screen.getByPlaceholderText("Nome do Produtor"), {
      target: { value: "Empresa X", name: "name" },
    });

    fireEvent.change(screen.getByPlaceholderText("Número do Documento"), {
      target: { value: "12.345.678/0001-00", name: "document" },
    });

    fireEvent.click(screen.getByText("Cadastrar"));

    expect(toast.error).toHaveBeenCalledWith("Número de CNPJ inválido");
  });

  it("should show error if email is invalid", () => {
    renderPage();

    fireEvent.change(screen.getByLabelText("Tipo de Documento"), {
      target: { value: "CPF" },
    });

    fireEvent.change(screen.getByPlaceholderText("Nome do Produtor"), {
      target: { value: "João Silva", name: "name" },
    });

    fireEvent.change(screen.getByPlaceholderText("Número do Documento"), {
      target: { value: "12345678909", name: "document" },
    });

    fireEvent.change(screen.getByPlaceholderText("E-mail"), {
      target: { value: "email-invalido", name: "email" },
    });

    fireEvent.click(screen.getByText("Cadastrar"));

    expect(toast.error).toHaveBeenCalledWith("Email inválido");
  });

  it("must submit correctly if all data is valid", () => {
    const consoleLogSpy = jest
      .spyOn(console, "log")
      .mockImplementation(() => {});
    renderPage();

    fireEvent.change(screen.getByPlaceholderText("Nome do Produtor"), {
      target: { value: "João", name: "name" },
    });
    fireEvent.change(screen.getByPlaceholderText("Número do Documento"), {
      target: { value: "12345678909", name: "document" },
    });
    fireEvent.change(screen.getByPlaceholderText("Telefone"), {
      target: { value: "11912345678", name: "phone" },
    });
    fireEvent.change(screen.getByPlaceholderText("E-mail"), {
      target: { value: "joao@email.com", name: "email" },
    });

    fireEvent.click(screen.getByText("Cadastrar"));
    expect(toast.success).toHaveBeenCalledWith("Produtor cadastrado!");
    expect(consoleLogSpy).toHaveBeenCalledWith("Criando produtor:", {
      name: "João",
      document: "12345678909",
      phone: "11912345678",
      email: "joao@email.com",
      documentType: "CPF",
    });

    consoleLogSpy.mockRestore();
  });

  it("should redirect when clicking cancel", async () => {
    renderPage();
    fireEvent.click(screen.getByText("Cancelar"));
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/producers");
    });
  });
});
