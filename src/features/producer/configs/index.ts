import type { Column } from "@/components/organisms/Table";
import type { ProducerTableRow } from "../types";

export const producerTableColumns: Column<ProducerTableRow>[] = [
  { header: "Nome", accessor: "name" },
  { header: "Documento", accessor: "document" },
  { header: "Quantidade de Fazendas", accessor: "totalFarms" },
  { header: "Área Total (ha)", accessor: "totalArea" },
];
