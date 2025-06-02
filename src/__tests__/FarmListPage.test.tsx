/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import { store } from "@/redux/store";
import { toast } from "react-toastify";

import { deleteFarm, setProducers } from "@/redux/slices/producerSlice";

import { CustomThemeProvider } from "@/contexts/CustomThemeProvider";
import FarmListPage from "@/features/farm/pages/FarmListPage";

jest.mock("@/components/organisms/MainLayout", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

jest.mock("@/components/organisms/Table", () => ({
  __esModule: true,
  default: ({ data, actions }: any) => (
    <div>
      {data.map((row: any) => (
        <div key={row.id} data-testid={`row-${row.id}`}>
          <span>{row.name}</span>
          {actions.map((action: any) => (
            <button
              key={action.label}
              onClick={() => action.onClick(row)}
              aria-label={action.label}
            >
              {action.label}
            </button>
          ))}
        </div>
      ))}
    </div>
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

jest.mock("@/components/organisms/Modal/DynamicModal", () => ({
  __esModule: true,
  default: ({ isOpen, title, content, onClose, actions }: any) =>
    isOpen ? (
      <div role="dialog">
        <h1>{title}</h1>
        <div>{content}</div>
        {actions.map((action: any) => (
          <button
            key={action.label}
            onClick={action.onClick}
            style={action.style}
            aria-label={action.label}
          >
            {action.label}
          </button>
        ))}
        <button onClick={onClose} aria-label="close-modal">
          Close
        </button>
      </div>
    ) : null,
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
  },
}));

describe("FarmListPage", () => {
  const producersForTest = [
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
    {
      id: 2,
      name: "Agro Horizonte Ltda",
      documentType: "CNPJ",
      document: "93.390.936/0001-57",
      phone: "(34) 3232-4545",
      email: "contato@agrohorizonte.com.br",
      farms: [
        {
          id: 103,
          name: "Fazenda Horizonte",
          city: "Uberlândia",
          state: "Minas Gerais",
          totalArea: 800,
          agricultableArea: 600,
          vegetationArea: 200,
          crops: [{ id: 1003, harvest: "Safra 2023", culture: "Milho" }],
        },
      ],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    store.dispatch(setProducers(producersForTest));
  });

  const renderPage = () =>
    render(
      <Provider store={store}>
        <BrowserRouter>
          <CustomThemeProvider>
            <FarmListPage />
          </CustomThemeProvider>
        </BrowserRouter>
      </Provider>
    );

  const clickFirstDeleteButton = () => {
    const deleteButtons = screen.getAllByRole("button", { name: "Excluir" });
    fireEvent.click(deleteButtons[0]);
  };

  it("should render farms and buttons", () => {
    renderPage();

    expect(screen.getByText("Fazendas")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Nova fazenda" })
    ).toBeInTheDocument();

    expect(screen.getByText("Fazenda Boa Vista")).toBeInTheDocument();
    expect(screen.getByText("Fazenda Primavera Verde")).toBeInTheDocument();
    expect(screen.getByText("Fazenda Horizonte")).toBeInTheDocument();

    expect(screen.getAllByRole("button", { name: "Editar" })).toHaveLength(3);
    expect(screen.getAllByRole("button", { name: "Excluir" })).toHaveLength(3);
  });

  it("should navigate to new farm page when 'Nova fazenda' clicked", () => {
    renderPage();

    fireEvent.click(screen.getByRole("button", { name: "Nova fazenda" }));

    expect(mockNavigate).toHaveBeenCalledWith("/farms/new");
  });

  it("should navigate to edit page when 'Editar' clicked", () => {
    renderPage();

    const editButtons = screen.getAllByRole("button", { name: "Editar" });

    fireEvent.click(editButtons[0]);

    expect(mockNavigate).toHaveBeenCalledWith("/farms/edit/101");
  });

  it("should open and close modal on delete click and cancel", async () => {
    renderPage();

    clickFirstDeleteButton();

    const modal = screen.getByRole("dialog");

    expect(
      within(modal).getByText(/Tem certeza de que deseja excluir a fazenda/i)
    ).toBeInTheDocument();

    expect(within(modal).getByText("Fazenda Boa Vista")).toBeInTheDocument();

    fireEvent.click(within(modal).getByRole("button", { name: "Cancelar" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("should confirm deletion, dispatch deleteFarm, show toast, and close modal", async () => {
    renderPage();

    const spyDispatch = jest.spyOn(store, "dispatch");

    clickFirstDeleteButton();

    const dialog = await screen.findByRole("dialog");
    expect(
      within(dialog).getByText(/Tem certeza de que deseja excluir a fazenda/i)
    ).toBeInTheDocument();
    expect(within(dialog).getByText("Fazenda Boa Vista")).toBeInTheDocument();

    const modalDeleteButton = within(dialog).getByRole("button", {
      name: "Excluir",
    });
    fireEvent.click(modalDeleteButton);

    expect(spyDispatch).toHaveBeenCalledWith(
      deleteFarm({ producerId: 1, farmId: 101 })
    );
    expect(toast.success).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledWith("Fazenda excluída com sucesso!");

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.queryByText("Fazenda Boa Vista")).not.toBeInTheDocument();
      expect(screen.getByText("Fazenda Primavera Verde")).toBeInTheDocument();
      expect(screen.getByText("Fazenda Horizonte")).toBeInTheDocument();
    });
  });
});
