import { useEffect, useState } from "react";

import MainLayout from "@/components/organisms/MainLayout";
import DynamicTable from "@/components/organisms/Table";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { producerTableColumns } from "../configs";
import { mockProducers } from "@/services/mocks/producerData";

import {
  ContainerBtn,
  ContainerTableAndBtn,
  ContainerTableContent,
  PageTitle,
} from "../styles/stylesProducerListPage";
import { mapProducersToTableRows } from "@/utils";
import type { ProducerTableRow } from "../types";
import Button from "@/components/atoms/Button";
import { useNavigate } from "react-router-dom";

export default function ProducerListPage() {
  const [tableData, setTableData] = useState<ProducerTableRow[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const data = mapProducersToTableRows(mockProducers);
    setTableData(data);
  }, []);

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
                onClick: (row) => console.log("Excluir", row),
              },
            ]}
          />
        </ContainerTableContent>
      </ContainerTableAndBtn>
    </MainLayout>
  );
}
