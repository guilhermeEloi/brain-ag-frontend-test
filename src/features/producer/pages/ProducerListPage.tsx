/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { deleteProducer } from "@/redux/slices/producerSlice";

import MainLayout from "@/components/organisms/MainLayout";
import DynamicTable from "@/components/organisms/Table";
import Button from "@/components/atoms/Button";
import DynamicModal from "@/components/organisms/Modal/DynamicModal";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import type { ProducerTableRow } from "../types";

import { producerTableColumns } from "../configs";
import { mapProducersToTableRows } from "@/utils";

import {
  ContainerBtn,
  ContainerTableAndBtn,
  ContainerTableContent,
  PageTitle,
} from "../styles/stylesProducerListPage";

export default function ProducerListPage() {
  const [tableData, setTableData] = useState<ProducerTableRow[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<ProducerTableRow | null>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const producers = useSelector((state: any) => state.producer.producers);

  const handleDeleteClick = (row: ProducerTableRow) => {
    setSelectedRow(row);
    setModalOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedRow) return;

    dispatch(deleteProducer(selectedRow.id));
    toast.success("Produtor excluído com sucesso!");

    setModalOpen(false);
    setSelectedRow(null);
  };

  useEffect(() => {
    const data = mapProducersToTableRows(producers);
    setTableData(data);
  }, [producers]);

  return (
    <MainLayout>
      <PageTitle>Produtores</PageTitle>
      <ContainerTableAndBtn>
        <ContainerBtn>
          <Button
            variant="contained"
            label="Novo produtor"
            onClick={() => navigate("/producers/new")}
          />
        </ContainerBtn>

        <ContainerTableContent>
          <DynamicTable<ProducerTableRow>
            columns={producerTableColumns}
            data={tableData}
            actions={[
              {
                icon: <EditIcon color="primary" />,
                label: "Editar",
                onClick: (row) => navigate(`/producers/edit/${row.id}`),
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
            Tem certeza de que deseja excluir o produtor{" "}
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
