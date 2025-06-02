import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import MainLayout from "@/components/organisms/MainLayout";
import DynamicTable from "@/components/organisms/Table";
import Button from "@/components/atoms/Button";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import type { FarmTableRow } from "../types";
import { farmTableColumns } from "./configs";
import { mockProducers } from "@/services/mocks/producerData";
import { mapFarmsWithProducerToTableRows } from "@/utils";

import {
  ContainerBtn,
  ContainerTableAndBtn,
  ContainerTableContent,
  PageTitle,
} from "../styles/stylesFarmListPage";

export default function FarmListPage() {
  const [tableData, setTableData] = useState<FarmTableRow[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const data = mapFarmsWithProducerToTableRows(mockProducers);
    setTableData(data);
  }, []);

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
                onClick: (row) => console.log("Excluir", row),
              },
            ]}
          />
        </ContainerTableContent>
      </ContainerTableAndBtn>
    </MainLayout>
  );
}
