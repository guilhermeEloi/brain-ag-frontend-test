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

import ProducerListPage from "@/features/producer/pages/ProducerListPage";
import { store } from "@/redux/store";
import { toast } from "react-toastify";

import { setProducers, deleteProducer } from "@/redux/slices/producerSlice";

import { CustomThemeProvider } from "@/contexts/CustomThemeProvider";

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

describe("ProducerListPage", () => {
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
            <ProducerListPage />
          </CustomThemeProvider>
        </BrowserRouter>
      </Provider>
    );

  const clickFirstDeleteButton = () => {
    const deleteButtons = screen.getAllByRole("button", { name: "Excluir" });
    fireEvent.click(deleteButtons[0]);
  };

  it("should render producers and buttons", () => {
    renderPage();

    expect(screen.getByText("Produtores")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Novo produtor" })
    ).toBeInTheDocument();

    expect(screen.getByText("João da Silva")).toBeInTheDocument();
    expect(screen.getByText("Agro Horizonte Ltda")).toBeInTheDocument();

    expect(screen.getAllByRole("button", { name: "Editar" })).toHaveLength(2);
    expect(screen.getAllByRole("button", { name: "Excluir" })).toHaveLength(2);
  });

  it("should navigate to new producer page when 'Novo produtor' clicked", () => {
    renderPage();

    fireEvent.click(screen.getByRole("button", { name: "Novo produtor" }));

    expect(mockNavigate).toHaveBeenCalledWith("/producers/new");
  });

  it("should navigate to edit page when 'Editar' clicked", () => {
    renderPage();

    const editButtons = screen.getAllByRole("button", { name: "Editar" });

    fireEvent.click(editButtons[0]);

    expect(mockNavigate).toHaveBeenCalledWith("/producers/edit/1");
  });

  it("should open and close modal on delete click and cancel", () => {
    renderPage();

    clickFirstDeleteButton();

    expect(
      screen.getByText(/Tem certeza de que deseja excluir o produtor/i)
    ).toBeInTheDocument();
    expect(screen.getAllByText("João da Silva")[0]).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(
      screen.queryByText(/Tem certeza de que deseja excluir o produtor/i)
    ).not.toBeInTheDocument();
  });

  it("should confirm deletion, dispatch deleteProducer, show toast, and close modal", async () => {
    renderPage();

    const spyDispatch = jest.spyOn(store, "dispatch");

    clickFirstDeleteButton();

    const dialog = await screen.findByRole("dialog");
    expect(
      within(dialog).getByText(/Tem certeza de que deseja excluir o produtor/i)
    ).toBeInTheDocument();
    expect(within(dialog).getByText("João da Silva")).toBeInTheDocument();

    const modalDeleteButton = within(dialog).getByRole("button", {
      name: "Excluir",
    });
    fireEvent.click(modalDeleteButton);

    expect(spyDispatch).toHaveBeenCalledWith(deleteProducer(1));
    expect(toast.success).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledWith(
      "Produtor excluído com sucesso!"
    );

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.queryByText("João da Silva")).not.toBeInTheDocument();
      expect(screen.getByText("Agro Horizonte Ltda")).toBeInTheDocument();
    });
  });
});
