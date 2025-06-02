/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import MainLayout from "@/components/organisms/MainLayout";
import DynamicTable from "@/components/organisms/Table";
import Button from "@/components/atoms/Button";
import DynamicModal from "@/components/organisms/Modal/DynamicModal";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { deleteCrop } from "@/redux/slices/producerSlice";
import type { CropTableRow } from "../types";
import { mapCropsToTableRows } from "@/utils";

import {
  ContainerBtn,
  ContainerTableAndBtn,
  ContainerTableContent,
  PageTitle,
} from "../styles/stylesCropListPage";
import { cropTableColumns } from "../configs";
import { useSelector } from "react-redux";

export default function CropListPage() {
  const [tableData, setTableData] = useState<CropTableRow[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<CropTableRow | null>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const producers = useSelector((state: any) => state.producer.producers);

  useEffect(() => {
    const data = mapCropsToTableRows(producers);
    setTableData(data);
  }, [producers]);

  const handleDeleteClick = (row: CropTableRow) => {
    setSelectedRow(row);
    setModalOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedRow) return;

    dispatch(
      deleteCrop({
        producerId: selectedRow.producerId,
        farmId: selectedRow.farmId,
        cropId: selectedRow.id,
      })
    );

    toast.success("Cultura excluída com sucesso!");
    setModalOpen(false);
    setSelectedRow(null);
  };

  return (
    <MainLayout>
      <PageTitle>Culturas</PageTitle>
      <ContainerTableAndBtn>
        <ContainerBtn>
          <Button
            variant="contained"
            label="Nova cultura"
            onClick={() => navigate("/crops/new")}
          />
        </ContainerBtn>

        <ContainerTableContent>
          <DynamicTable<CropTableRow>
            columns={cropTableColumns}
            data={tableData}
            actions={[
              {
                icon: <EditIcon color="primary" />,
                label: "Editar",
                onClick: (row) => navigate(`/crops/edit/${row.id}`),
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
          <p>
            Tem certeza de que deseja excluir a cultura{" "}
            <strong>{selectedRow?.culture}</strong>{" "}
            <strong>{selectedRow?.harvest}</strong>, cultivada na fazenda{" "}
            <strong>{selectedRow?.farmName}</strong>, do produtor{" "}
            <strong>{selectedRow?.producerName}</strong>?
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
