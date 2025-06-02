import type { Column } from "@/components/organisms/Table";
import type { CropTableRow } from "../types";

export const cropTableColumns: Column<CropTableRow>[] = [
  { header: "Nome da Fazenda", accessor: "farmName" },
  { header: "Nome do Produtor", accessor: "producerName" },
  { header: "Nome da Cultura", accessor: "culture" },
  { header: "Safra", accessor: "harvest" },
];
