import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import MainLayout from "@/components/organisms/MainLayout";
import DynamicTable from "@/components/organisms/Table";
import Button from "@/components/atoms/Button";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import type { CropTableRow } from "../types";
import { mockProducers } from "@/services/mocks/producerData";
import { mapCropsToTableRows } from "@/utils";

import {
  ContainerBtn,
  ContainerTableAndBtn,
  ContainerTableContent,
  PageTitle,
} from "../styles/stylesCropListPage";
import { cropTableColumns } from "../configs";

export default function CropListPage() {
  const [tableData, setTableData] = useState<CropTableRow[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const data = mapCropsToTableRows(mockProducers);
    setTableData(data);
  }, []);

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
                onClick: (row) => console.log("Excluir", row),
              },
            ]}
          />
        </ContainerTableContent>
      </ContainerTableAndBtn>
    </MainLayout>
  );
}
