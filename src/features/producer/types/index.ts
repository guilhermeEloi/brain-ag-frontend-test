import type { Farm } from "@/features/farm/types";

export interface Producer {
  id: number;
  name: string;
  document: string;
  farms: Farm[];
}

export interface ProducerTableRow {
  id: number;
  name: string;
  document: string;
  totalFarms: number;
  totalArea: number;
}
