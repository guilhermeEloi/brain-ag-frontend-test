/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { toast } from "react-toastify";
import { store } from "@/redux/store";
import CropFormPage from "@/features/crop/pages/CropFormPage";
import { CustomThemeProvider } from "@/contexts/CustomThemeProvider";

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
    children,
  }: {
    label: string;
    name: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    children?: React.ReactNode;
  }) => (
    <select aria-label={label} name={name} value={value} onChange={onChange}>
      {children}
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
          <CropFormPage />
        </CustomThemeProvider>
      </BrowserRouter>
    </Provider>
  );

describe("CropFormPage - Creation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the form correctly", () => {
    renderPage();

    expect(screen.getByText("Cadastrar Nova Cultura")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Cultura")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Safra")).toBeInTheDocument();
    expect(screen.getByLabelText("Produtor")).toBeInTheDocument();

    const fazenda = screen.queryByLabelText("Fazenda");
    if (fazenda) {
      expect(fazenda).toBeInTheDocument();
    }

    expect(screen.getByText("Cadastrar")).toBeInTheDocument();
  });

  it("should show error if 'Safra' is empty", () => {
    renderPage();

    fireEvent.change(screen.getByPlaceholderText("Cultura"), {
      target: { value: "Soja", name: "culture" },
    });

    fireEvent.click(screen.getByText("Cadastrar"));

    expect(toast.error).toHaveBeenCalledWith(
      "O campo Safra não pode estar vazio"
    );
  });

  it("should show error if 'Cultura' is empty", () => {
    renderPage();

    fireEvent.change(screen.getByPlaceholderText("Safra"), {
      target: { value: "2024", name: "harvest" },
    });

    fireEvent.click(screen.getByText("Cadastrar"));

    expect(toast.error).toHaveBeenCalledWith(
      "O campo Cultura não pode estar vazio"
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

    const fazendaInput = screen.queryByLabelText("Fazenda");
    if (fazendaInput) {
      fireEvent.change(fazendaInput, {
        target: {
          value: store.getState().producer.producers[0]?.farms[0]?.id || 1,
          name: "farmId",
        },
      });
    }

    fireEvent.change(screen.getByPlaceholderText("Cultura"), {
      target: { value: "Soja", name: "culture" },
    });

    fireEvent.change(screen.getByPlaceholderText("Safra"), {
      target: { value: "2024", name: "harvest" },
    });

    fireEvent.click(screen.getByText("Cadastrar"));

    expect(toast.success).toHaveBeenCalledWith("Cultura cadastrada!");
    expect(mockNavigate).toHaveBeenCalledWith("/crops");
  });
});
