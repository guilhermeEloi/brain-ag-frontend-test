import type { Column } from "@/components/organisms/Table";
import type { FarmTableRow } from "../../types";

export const farmTableColumns: Column<FarmTableRow>[] = [
  { header: "Produtor", accessor: "producerName" },
  { header: "Fazenda", accessor: "name" },
  { header: "Cidade", accessor: "city" },
  { header: "Estado", accessor: "state" },
  { header: "Área Total (ha)", accessor: "totalArea" },
  { header: "Área agricultável", accessor: "agricultableArea" },
  { header: "Área vegetável", accessor: "vegetationArea" },
  { header: "Quantidade de culturas", accessor: "totalCrops" },
];
