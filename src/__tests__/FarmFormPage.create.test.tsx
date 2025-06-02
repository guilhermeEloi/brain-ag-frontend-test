/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { toast } from "react-toastify";
import { store } from "@/redux/store";
import { CustomThemeProvider } from "@/contexts/CustomThemeProvider";
import FarmFormPage from "@/features/farm/pages/FarmFormPage";

jest.mock("@/components/organisms/MainLayout", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

jest.mock("@/components/atoms/Input", () => ({
  __esModule: true,
  default: ({
    label,
    name,
    value,
    onChange,
    ...rest
  }: {
    label: string;
    name: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }) => (
    <input
      aria-label={label}
      placeholder={label}
      name={name}
      value={value}
      onChange={onChange}
      {...rest}
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
    <Provider store={store}>
      <BrowserRouter>
        <CustomThemeProvider>
          <FarmFormPage />
        </CustomThemeProvider>
      </BrowserRouter>
    </Provider>
  );

describe("FarmFormPage - Creation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the form correctly", () => {
    renderPage();

    expect(screen.getByText("Cadastrar Nova Fazenda")).toBeInTheDocument();
    expect(screen.getByLabelText("Produtor")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Nome da Fazenda")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Cidade")).toBeInTheDocument();
    expect(screen.getByLabelText("Estado")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Área Total (ha)")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Área Agricultável (ha)")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Área de Vegetação (ha)")
    ).toBeInTheDocument();
    expect(screen.getByText("Cadastrar")).toBeInTheDocument();
  });

  it("should show error if producer is not selected", () => {
    renderPage();

    fireEvent.change(screen.getByPlaceholderText("Nome da Fazenda"), {
      target: { value: "Fazenda Teste", name: "name" },
    });

    fireEvent.change(screen.getByLabelText("Estado"), {
      target: { value: "São Paulo", name: "state" },
    });

    fireEvent.click(screen.getByText("Cadastrar"));

    expect(toast.error).toHaveBeenCalledWith(
      "É obrigatório selecionar um produtor!"
    );
  });

  it("should show error if state is not selected", () => {
    renderPage();

    fireEvent.change(screen.getByLabelText("Produtor"), {
      target: {
        value: store.getState().producer.producers[0]?.id || 1,
        name: "producerId",
      },
    });

    fireEvent.change(screen.getByPlaceholderText("Nome da Fazenda"), {
      target: { value: "Fazenda Teste", name: "name" },
    });

    fireEvent.click(screen.getByText("Cadastrar"));

    expect(toast.error).toHaveBeenCalledWith(
      "É obrigatório selecionar um estado!"
    );
  });

  it("should submit correctly if all data is valid", () => {
    renderPage();

    fireEvent.change(screen.getByLabelText("Produtor"), {
      target: {
        value: store.getState().producer.producers[0]?.id || 1,
        name: "producerId",
      },
    });

    fireEvent.change(screen.getByPlaceholderText("Nome da Fazenda"), {
      target: { value: "Fazenda Teste", name: "name" },
    });

    fireEvent.change(screen.getByPlaceholderText("Cidade"), {
      target: { value: "Campinas", name: "city" },
    });

    fireEvent.change(screen.getByLabelText("Estado"), {
      target: { value: "São Paulo", name: "state" },
    });

    fireEvent.change(screen.getByPlaceholderText("Área Total (ha)"), {
      target: { value: "100", name: "totalArea" },
    });

    fireEvent.change(screen.getByPlaceholderText("Área Agricultável (ha)"), {
      target: { value: "70", name: "agricultableArea" },
    });

    fireEvent.change(screen.getByPlaceholderText("Área de Vegetação (ha)"), {
      target: { value: "30", name: "vegetationArea" },
    });

    fireEvent.click(screen.getByText("Cadastrar"));

    expect(toast.success).toHaveBeenCalledWith(
      "Fazenda cadastrada com sucesso!"
    );
    expect(mockNavigate).toHaveBeenCalledWith("/farms");
  });
});
