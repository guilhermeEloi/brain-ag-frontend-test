/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { deleteFarm } from "@/redux/slices/producerSlice";
import { toast } from "react-toastify";

import MainLayout from "@/components/organisms/MainLayout";
import DynamicTable from "@/components/organisms/Table";
import Button from "@/components/atoms/Button";
import DynamicModal from "@/components/organisms/Modal/DynamicModal";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import type { FarmTableRow } from "../types";
import { farmTableColumns } from "./configs";
import { mapFarmsWithProducerToTableRows } from "@/utils";

import { ColorModeContext } from "@/contexts/ThemeContext";

import {
  ContainerBtn,
  ContainerTableAndBtn,
  ContainerTableContent,
  PageTitle,
} from "../styles/stylesFarmListPage";

export default function FarmListPage() {
  const [tableData, setTableData] = useState<FarmTableRow[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<FarmTableRow | null>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mode } = useContext(ColorModeContext);

  const producers = useSelector((state: any) => state.producer.producers);

  const handleDeleteClick = (row: FarmTableRow) => {
    setSelectedRow(row);
    setModalOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedRow) return;

    dispatch(
      deleteFarm({ producerId: selectedRow.producerId, farmId: selectedRow.id })
    );
    toast.success("Fazenda excluída com sucesso!");

    setModalOpen(false);
    setSelectedRow(null);
  };

  useEffect(() => {
    const data = mapFarmsWithProducerToTableRows(producers);
    setTableData(data);
  }, [producers]);

  return (
    <MainLayout>
      <PageTitle>Fazendas</PageTitle>
      <ContainerTableAndBtn>
        <ContainerBtn>
          <Button
            variant="contained"
            label="Nova fazenda"
            onClick={() => navigate("/farms/new")}
          />
        </ContainerBtn>

        <ContainerTableContent>
          <DynamicTable<FarmTableRow>
            columns={farmTableColumns}
            data={tableData}
            actions={[
              {
                icon: <EditIcon color="primary" />,
                label: "Editar",
                onClick: (row) => navigate(`/farms/edit/${row.id}`),
              },
              {
                icon: <DeleteIcon color="error" />,
                label: "Excluir",
                onClick: handleDeleteClick,
              },
            ]}
          />
        </ContainerTableContent>
      </ContainerTableAndBtn>

      <DynamicModal
        isOpen={modalOpen}
        title="Confirmar Exclusão"
        content={
          <p style={{ color: mode === "light" ? "#000000" : "#ffffff" }}>
            Tem certeza de que deseja excluir a fazenda{" "}
            <strong>{selectedRow?.name}</strong>{" "}
          </p>
        }
        onClose={() => setModalOpen(false)}
        actions={[
          {
            label: "Cancelar",
            onClick: () => setModalOpen(false),
            variant: "text",
          },
          {
            label: "Excluir",
            onClick: confirmDelete,
            style: { backgroundColor: "#f44336" },
          },
        ]}
      />
    </MainLayout>
  );
}
